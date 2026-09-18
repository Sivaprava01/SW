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

  // Actions
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
  triggerFirstTimePrompt: () => void;

  // Target Registry
  registerTarget: (id: string, getLayout: () => Promise<TargetLayout | null>) => void;
  unregisterTarget: (id: string) => void;
  reportTargetLayout: (id: string, layout: TargetLayout) => void;
  refreshActiveLayout: () => Promise<void>;
  hasSeenTutorial: (tutorialId: string) => boolean;
};

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function TutorialProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { language } = useApp();

  const [activeTutorial, setActiveTutorial] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [state, setState] = useState<TutorialState>('IDLE');
  const [activeTargetLayout, setActiveTargetLayout] = useState<TargetLayout | null>(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true);
  const [isPlayingVoice, setIsPlayingVoice] = useState<boolean>(false);
  const [isLoadingVoice, setIsLoadingVoice] = useState<boolean>(false);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [showPromptModal, setShowPromptModal] = useState<boolean>(false);

  const [seenTutorials, setSeenTutorials] = useState<Set<string>>(new Set());

  // Registry of targets currently mounted in the tree
  const targetRegistryRef = useRef<Map<string, TargetRegistryItem>>(new Map());

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

  // Audio Playback
  const stopCurrentStepAudio = useCallback(() => {
    audioPlayer.stop();
  }, []);

  const playCurrentStepAudio = useCallback(async () => {
    if (!currentStep || !isVoiceEnabled) return;
    const currentLang = language || 'te';
    const textToSpeak = currentStep.text[currentLang] || currentStep.text.en;
    if (!textToSpeak) return;

    try {
      setIsLoadingVoice(true);
      const res = await voiceService.synthesizeSpeech({
        text: textToSpeak,
        language: currentLang,
        speed: 1.0,
        audio_format: 'mp3',
      });
      await audioPlayer.playBase64(res.audio_base64, 'mp3', `tutorial-step-${currentStep.id}`);
    } catch (err) {
      if (__DEV__) console.warn('[TutorialContext] Audio synthesis error:', err);
      setIsLoadingVoice(false);
    }
  }, [currentStep, isVoiceEnabled, language]);

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

    // If not found yet, set null temporarily (it will re-register on mount/layout)
    setActiveTargetLayout(null);
  }, [currentStep]);

  // Step change effect: handles routing, measuring layout, playing narration
  useEffect(() => {
    if (!currentStep || state === 'IDLE' || state === 'COMPLETED') {
      return;
    }

    setState('SHOWING_STEP');

    // Route navigation if specified
    if (currentStep.route) {
      try {
        router.push(currentStep.route as any);
      } catch (err) {
        if (__DEV__) console.warn('[TutorialContext] Navigation error:', err);
      }
    }

    // Refresh layout with small delay to allow screen animation to settle
    const measureTimer = setTimeout(() => {
      refreshActiveLayout();
      setState('WAITING_FOR_USER_ACTION');

      // Auto play audio narration if enabled
      if (currentStep.voiceEnabled && isVoiceEnabled) {
        playCurrentStepAudio();
      }
    }, 350);

    return () => {
      clearTimeout(measureTimer);
      stopCurrentStepAudio();
    };
  }, [currentStep, isVoiceEnabled, playCurrentStepAudio, refreshActiveLayout, router, state, stopCurrentStepAudio]);

  // Target Registry functions
  const registerTarget = useCallback(
    (id: string, getLayout: () => Promise<TargetLayout | null>) => {
      targetRegistryRef.current.set(id, { getLayout });
      // If the registered target matches current active step, measure it immediately
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

  // Flow controls
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
      setActiveTutorial(tutorialId);
      setCurrentStepIndex(startStepIndex);
      setState('SHOWING_STEP');
    },
    [stopCurrentStepAudio]
  );

  const stopTutorial = useCallback(() => {
    stopCurrentStepAudio();
    setActiveTutorial(null);
    setCurrentStepIndex(0);
    setState('IDLE');
    setActiveTargetLayout(null);
  }, [stopCurrentStepAudio]);

  const markTutorialSeen = useCallback((tutorialId: string) => {
    setSeenTutorials((prev) => new Set(prev).add(tutorialId));
  }, []);

  const hasSeenTutorial = useCallback(
    (tutorialId: string) => {
      return seenTutorials.has(tutorialId);
    },
    [seenTutorials]
  );

  const nextStep = useCallback(() => {
    stopCurrentStepAudio();
    if (!activeDefinition) return;

    if (currentStepIndex < activeDefinition.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Completed!
      markTutorialSeen(activeDefinition.id);
      setState('COMPLETED');
      setShowCompletionModal(true);
      setActiveTutorial(null);
    }
  }, [activeDefinition, currentStepIndex, markTutorialSeen, stopCurrentStepAudio]);

  const prevStep = useCallback(() => {
    stopCurrentStepAudio();
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
        // Advance to next step after action
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
  }, []);

  const triggerFirstTimePrompt = useCallback(() => {
    if (!seenTutorials.has('basics')) {
      setShowPromptModal(true);
    }
  }, [seenTutorials]);

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
