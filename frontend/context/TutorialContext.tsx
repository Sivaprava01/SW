import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import { useRouter } from 'expo-router';
import {
  TutorialStep,
  TutorialDefinition,
  TargetLayout,
  TutorialState,
} from '@/types/tutorial';
import { TUTORIAL_DEFINITIONS } from '@/constants/tutorialSteps';
import { voiceService } from '@/services/voiceService';
import { audioPlayer } from '@/services/audioPlayer';
import { tokenStorage } from '@/services/tokenStorage';
import { useApp } from '@/context/AppContext';

type TargetRegistryItem = {
  getLayout: () => Promise<TargetLayout | null>;
  elementLayout?: TargetLayout;
};

type TutorialContextType = {
  activeTutorial: string | null;
  currentStepIndex: number;
  currentStep: TutorialStep | null;
  activeDefinition: TutorialDefinition | null;
  state: TutorialState;
  activeTargetLayout: TargetLayout | null;
  isVoiceEnabled: boolean;
  isPlayingVoice: boolean;
  isLoadingVoice: boolean;
  showCompletionModal: boolean;
  showPromptModal: boolean;
  isCardTourVisible: boolean;

  // Actions
  openCardTour: () => void;
  closeCardTour: (completed?: boolean) => void;
  startTutorial: (tutorialId: string, startStepIndex?: number) => void;
  stopTutorial: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTutorial: () => void;
  onTargetAction: (targetId: string) => void;
  toggleVoice: () => void;
  playCurrentStepAudio: () => Promise<void>;
  stopCurrentStepAudio: () => void;
  dismissCompletionModal: () => void;
  dismissPromptModal: () => void;
  triggerFirstTimePrompt: () => Promise<void>;

  // Target Registry
  registerTarget: (id: string, getLayout: () => Promise<TargetLayout | null>) => void;
  unregisterTarget: (id: string) => void;
  reportTargetLayout: (id: string, layout: TargetLayout) => void;
  refreshActiveLayout: () => Promise<void>;
  hasSeenTutorial: (tutorialId: string) => boolean;
  resetTourForActiveUser: () => Promise<void>;
};

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function TutorialProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { language, userId } = useApp();

  const [activeTutorial, setActiveTutorial] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [state, setState] = useState<TutorialState>('IDLE');
  const [activeTargetLayout, setActiveTargetLayout] = useState<TargetLayout | null>(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true);
  const [isPlayingVoice, setIsPlayingVoice] = useState<boolean>(false);
  const [isLoadingVoice, setIsLoadingVoice] = useState<boolean>(false);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [showPromptModal, setShowPromptModal] = useState<boolean>(false);
  const [isCardTourVisible, setIsCardTourVisible] = useState<boolean>(false);

  const [seenTutorials, setSeenTutorials] = useState<Set<string>>(new Set());

  // Registry of targets currently mounted in the tree
  const targetRegistryRef = useRef<Map<string, TargetRegistryItem>>(new Map());

  // Concurrency & Token Guards for Audio Orchestration
  const audioRequestTokenRef = useRef<number>(0);
  const lastSpokenStepKeyRef = useRef<string | null>(null);

  // Load account-specific persistent tour completion when userId changes
  useEffect(() => {
    if (!userId) {
      setSeenTutorials(new Set());
      return;
    }

    let isMounted = true;
    tokenStorage.getTourCompleted(userId).then((completed) => {
      if (isMounted && completed) {
        setSeenTutorials((prev) => new Set(prev).add('basics'));
      }
    });

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const activeDefinition: TutorialDefinition | null = activeTutorial
    ? TUTORIAL_DEFINITIONS[activeTutorial] || null
    : null;

  const currentStep: TutorialStep | null =
    activeDefinition && currentStepIndex >= 0 && currentStepIndex < activeDefinition.steps.length
      ? activeDefinition.steps[currentStepIndex]
      : null;

  const currentAudioId = currentStep ? `tutorial-step-${currentStep.id}` : null;

  // Audio status subscription
  useEffect(() => {
    const unsubscribe = audioPlayer.subscribe((event) => {
      if (currentAudioId && event.currentId === currentAudioId) {
        setIsPlayingVoice(event.state === 'playing');
        setIsLoadingVoice(event.state === 'loading');
      } else {
        setIsPlayingVoice(false);
        setIsLoadingVoice(false);
      }
    });
    return () => unsubscribe();
  }, [currentAudioId]);

  // Audio Playback & Cancellation
  const stopCurrentStepAudio = useCallback(() => {
    audioRequestTokenRef.current += 1;
    audioPlayer.stop();
    setIsLoadingVoice(false);
    setIsPlayingVoice(false);
  }, []);

  const playCurrentStepAudio = useCallback(async () => {
    if (!currentStep || !isVoiceEnabled) return;
    const currentLang = language || 'te';
    const textToSpeak = currentStep.text[currentLang] || currentStep.text.en;
    if (!textToSpeak) return;

    // Token guard: invalidate any previous pending synthesis requests
    const currentToken = ++audioRequestTokenRef.current;
    const stepAudioKey = `${currentStep.id}-${currentLang}`;
    lastSpokenStepKeyRef.current = stepAudioKey;

    stopCurrentStepAudio();
    setIsLoadingVoice(true);

    try {
      const res = await voiceService.synthesizeSpeech({
        text: textToSpeak,
        language: currentLang,
        speed: 1.0,
        audio_format: 'mp3',
      });

      if (audioRequestTokenRef.current !== currentToken) {
        if (__DEV__) console.log(`[TutorialContext] Discarded stale audio response for step ${currentStep.id}`);
        return;
      }

      setIsLoadingVoice(false);
      await audioPlayer.playBase64(res.audio_base64, 'mp3', `tutorial-step-${currentStep.id}`);
    } catch (err) {
      if (audioRequestTokenRef.current === currentToken) {
        setIsLoadingVoice(false);
        if (__DEV__) console.warn('[TutorialContext] Audio synthesis error:', err);
      }
    }
  }, [currentStep, isVoiceEnabled, language, stopCurrentStepAudio]);

  // Measure and update active target layout
  const refreshActiveLayout = useCallback(async () => {
    if (!currentStep) {
      setActiveTargetLayout(null);
      return;
    }

    const reg = targetRegistryRef.current.get(currentStep.targetId);
    if (reg) {
      const layout = await reg.getLayout();
      if (layout) {
        setActiveTargetLayout(layout);
        return;
      }
    }

    setActiveTargetLayout(null);
  }, [currentStep]);

  // Step change effect: handles routing, layout measurement, and voice trigger
  const currentStepId = currentStep?.id;
  const currentStepRoute = currentStep?.route;
  const currentStepVoiceEnabled = currentStep?.voiceEnabled;

  useEffect(() => {
    if (!currentStepId || !activeTutorial) {
      lastSpokenStepKeyRef.current = null;
      return;
    }

    setState('SHOWING_STEP');

    if (currentStepRoute) {
      try {
        router.push(currentStepRoute as any);
      } catch (err) {
        if (__DEV__) console.warn('[TutorialContext] Navigation error:', err);
      }
    }

    const measureTimer = setTimeout(() => {
      refreshActiveLayout();
      setState('WAITING_FOR_USER_ACTION');

      if (currentStepVoiceEnabled && isVoiceEnabled) {
        const stepAudioKey = `${currentStepId}-${language || 'te'}`;
        if (lastSpokenStepKeyRef.current !== stepAudioKey) {
          playCurrentStepAudio();
        }
      }
    }, 250);

    return () => {
      clearTimeout(measureTimer);
      stopCurrentStepAudio();
    };
  }, [
    currentStepId,
    currentStepRoute,
    currentStepVoiceEnabled,
    activeTutorial,
    isVoiceEnabled,
    language,
    playCurrentStepAudio,
    refreshActiveLayout,
    router,
    stopCurrentStepAudio,
  ]);

  // Target Registry functions
  const registerTarget = useCallback(
    (id: string, getLayout: () => Promise<TargetLayout | null>) => {
      targetRegistryRef.current.set(id, { getLayout });
      if (currentStep && currentStep.targetId === id) {
        getLayout().then((layout) => {
          if (layout) {
            setActiveTargetLayout(layout);
          }
        });
      }
    },
    [currentStep]
  );

  const unregisterTarget = useCallback((id: string) => {
    targetRegistryRef.current.delete(id);
  }, []);

  const reportTargetLayout = useCallback(
    (id: string, layout: TargetLayout) => {
      const existing = targetRegistryRef.current.get(id);
      if (existing) {
        existing.elementLayout = layout;
      }
      if (currentStep && currentStep.targetId === id) {
        setActiveTargetLayout(layout);
      }
    },
    [currentStep]
  );

  // Persistence helpers
  const markTutorialSeen = useCallback(
    (tutorialId: string) => {
      setSeenTutorials((prev) => new Set(prev).add(tutorialId));
      if (userId && tutorialId === 'basics') {
        tokenStorage.setTourCompleted(userId, true);
      }
    },
    [userId]
  );

  const hasSeenTutorial = useCallback(
    (tutorialId: string) => {
      return seenTutorials.has(tutorialId);
    },
    [seenTutorials]
  );

  const resetTourForActiveUser = useCallback(async () => {
    if (userId) {
      await tokenStorage.resetTourCompleted(userId);
    }
    setSeenTutorials((prev) => {
      const next = new Set(prev);
      next.delete('basics');
      return next;
    });
  }, [userId]);

  // Card Tour Flow Controls
  const openCardTour = useCallback(() => {
    stopCurrentStepAudio();
    setShowPromptModal(false);
    setShowCompletionModal(false);
    setActiveTutorial(null);
    setIsCardTourVisible(true);
  }, [stopCurrentStepAudio]);

  const closeCardTour = useCallback(
    (completed: boolean = true) => {
      setIsCardTourVisible(false);
      if (completed) {
        markTutorialSeen('basics');
      }
    },
    [markTutorialSeen]
  );

  // Spotlight Tutorial Flow controls
  const startTutorial = useCallback(
    (tutorialId: string, startStepIndex: number = 0) => {
      const def = TUTORIAL_DEFINITIONS[tutorialId];
      if (!def) {
        if (__DEV__) console.warn(`[TutorialContext] Unknown tutorial ID: ${tutorialId}`);
        return;
      }

      stopCurrentStepAudio();
      setShowCompletionModal(false);
      setShowPromptModal(false);
      setIsCardTourVisible(false);
      lastSpokenStepKeyRef.current = null;
      setActiveTutorial(tutorialId);
      setCurrentStepIndex(startStepIndex);
      setState('SHOWING_STEP');
    },
    [stopCurrentStepAudio]
  );

  const stopTutorial = useCallback(() => {
    stopCurrentStepAudio();
    lastSpokenStepKeyRef.current = null;
    setActiveTutorial(null);
    setCurrentStepIndex(0);
    setState('IDLE');
    setActiveTargetLayout(null);
  }, [stopCurrentStepAudio]);

  const nextStep = useCallback(() => {
    stopCurrentStepAudio();
    lastSpokenStepKeyRef.current = null;
    if (!activeDefinition) return;

    if (currentStepIndex < activeDefinition.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      markTutorialSeen(activeDefinition.id);
      setState('COMPLETED');
      setShowCompletionModal(true);
      setActiveTutorial(null);
    }
  }, [activeDefinition, currentStepIndex, markTutorialSeen, stopCurrentStepAudio]);

  const prevStep = useCallback(() => {
    stopCurrentStepAudio();
    lastSpokenStepKeyRef.current = null;
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex, stopCurrentStepAudio]);

  const skipTutorial = useCallback(() => {
    if (activeDefinition) {
      markTutorialSeen(activeDefinition.id);
    }
    stopTutorial();
  }, [activeDefinition, markTutorialSeen, stopTutorial]);

  // Target interaction handler
  const onTargetAction = useCallback(
    (targetId: string) => {
      if (state !== 'WAITING_FOR_USER_ACTION' && state !== 'SHOWING_STEP') return;
      if (currentStep && currentStep.targetId === targetId) {
        setState('ACTION_COMPLETED');
        setTimeout(() => {
          nextStep();
        }, 150);
      }
    },
    [currentStep, nextStep, state]
  );

  const toggleVoice = useCallback(() => {
    setIsVoiceEnabled((prev) => {
      const next = !prev;
      if (!next) {
        stopCurrentStepAudio();
      }
      return next;
    });
  }, [stopCurrentStepAudio]);

  const dismissCompletionModal = useCallback(() => {
    setShowCompletionModal(false);
  }, []);

  const dismissPromptModal = useCallback(() => {
    setShowPromptModal(false);
    markTutorialSeen('basics');
  }, [markTutorialSeen]);

  // Trigger post-login swipeable card tour on first login for an account
  const triggerFirstTimePrompt = useCallback(async () => {
    if (!userId) return;
    const completed = await tokenStorage.getTourCompleted(userId);
    if (!completed && !seenTutorials.has('basics')) {
      setIsCardTourVisible(true);
    }
  }, [userId, seenTutorials]);

  return (
    <TutorialContext.Provider
      value={{
        activeTutorial,
        currentStepIndex,
        currentStep,
        activeDefinition,
        state,
        activeTargetLayout,
        isVoiceEnabled,
        isPlayingVoice,
        isLoadingVoice,
        showCompletionModal,
        showPromptModal,
        isCardTourVisible,

        openCardTour,
        closeCardTour,
        startTutorial,
        stopTutorial,
        nextStep,
        prevStep,
        skipTutorial,
        onTargetAction,
        toggleVoice,
        playCurrentStepAudio,
        stopCurrentStepAudio,
        dismissCompletionModal,
        dismissPromptModal,
        triggerFirstTimePrompt,

        registerTarget,
        unregisterTarget,
        reportTargetLayout,
        refreshActiveLayout,
        hasSeenTutorial,
        resetTourForActiveUser,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
}
