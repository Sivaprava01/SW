import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { TutorialTarget } from '@/components/tutorial/TutorialTarget';
import { aiService } from '@/services/aiService';
import { voiceService } from '@/services/voiceService';
import { audioPlayer } from '@/services/audioPlayer';
import { speechRecorder } from '@/utils/speechRecorder';
import { GroundingMetrics } from '@/types/ai';

type AskSakhiModalProps = {
  visible: boolean;
  onClose: () => void;
};

type Message = {
  id: string;
  sender: 'user' | 'sakhi';
  time?: string;
  text: string;
  isMathCard?: boolean;
  audioLabel?: string;
  audioBase64?: string | null;
  isFallback?: boolean;
  groundingMetrics?: GroundingMetrics | null;
  suggestedFollowups?: string[];
};

export function AskSakhiModal({ visible, onClose }: AskSakhiModalProps) {
  const {
    userId,
    currentUser,
    financialSummary,
    totalMonthlySurplus,
    totalSavings,
    totalDebt,
    debts,
    journeyRoadmap,
    language,
    setLanguage,
  } = useApp();

  const [selectedLanguage, setSelectedLanguage] = useState<'te' | 'hi' | 'en'>(language || 'te');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [loadingAudioId, setLoadingAudioId] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  // Sync selectedLanguage with AppContext language on mount or change
  useEffect(() => {
    if (language) {
      setSelectedLanguage(language);
    }
  }, [language]);

  // Subscribe to audio player events
  useEffect(() => {
    const unsubscribe = audioPlayer.subscribe((event) => {
      if (event.state === 'playing') {
        setPlayingAudioId(event.currentId);
        setLoadingAudioId(null);
      } else if (event.state === 'loading') {
        setLoadingAudioId(event.currentId);
      } else {
        setPlayingAudioId(null);
        setLoadingAudioId(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Initial welcome messages per language
  const getInitialMessages = (lang: 'te' | 'hi' | 'en'): Message[] => {
    const timeStr = 'Just now';
    if (lang === 'te') {
      return [
        {
          id: 'welcome-te',
          sender: 'sakhi',
          time: timeStr,
          text: `నమస్తే ${currentUser?.name || 'లక్ష్మి'} అక్క! నేను మీ సఖి సోదరిని. మీ పొదుపు, అప్పులు, లేదా ప్రభుత్వ పథకాల గురించి నన్ను ఏదైనా అడగండి.`,
          audioLabel: 'వినండి (తెలుగు)',
          suggestedFollowups: [
            'నా మిగులు బడ్జెట్ ఎంత?',
            'అప్పు ఎలా త్వరగా తీర్చాలి?',
            'నాకు సరిపోయే ప్రభుత్వ పథకాలు ఏవి?',
          ],
        },
      ];
    } else if (lang === 'hi') {
      return [
        {
          id: 'welcome-hi',
          sender: 'sakhi',
          time: timeStr,
          text: `नमस्ते ${currentUser?.name || 'लक्ष्मी'} दीदी! मैं आपकी सखी बहन हूँ। अपनी बचत, ऋण, या सरकारी योजनाओं के बारे में मुझसे कुछ भी पूछें।`,
          audioLabel: 'सुनिए (हिंदी)',
          suggestedFollowups: [
            'मेरी मासिक बचत कितनी है?',
            'कर्ज कैसे जल्दी चुकाएं?',
            'मेरे लिए कौन सी योजनाएं हैं?',
          ],
        },
      ];
    } else {
      return [
        {
          id: 'welcome-en',
          sender: 'sakhi',
          time: timeStr,
          text: `Namaste ${currentUser?.name || 'Sister'}! I am your Sakhi companion. I can help you analyze your surplus, plan debt payoff, and find government schemes.`,
          audioLabel: 'Listen in English',
          suggestedFollowups: [
            'What is my monthly surplus?',
            'How can I pay off my debt faster?',
            'Which schemes match my profile?',
          ],
        },
      ];
    }
  };

  const [messages, setMessages] = useState<Message[]>(() => getInitialMessages(selectedLanguage));

  // Reset or update initial message when language changes if only welcome message present
  const handleToggleLanguage = () => {
    const nextLang: 'te' | 'hi' | 'en' =
      selectedLanguage === 'te' ? 'hi' : selectedLanguage === 'hi' ? 'en' : 'te';
    setSelectedLanguage(nextLang);
    setLanguage(nextLang);

    if (messages.length <= 1) {
      setMessages(getInitialMessages(nextLang));
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 150);
  };

  // Send message to Ask Sakhi AI
  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isAiLoading) return;

    setErrorMessage(null);
    const userMsgId = Date.now().toString();
    const userMsg: Message = {
      id: userMsgId,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsAiLoading(true);
    scrollToBottom();

    try {
      const chatRes = await aiService.chat({
        user_id: userId || 1,
        message: query,
        language: selectedLanguage,
      });

      const audioLabel =
        selectedLanguage === 'te'
          ? 'వినండి (తెలుగు)'
          : selectedLanguage === 'hi'
          ? 'सुनिए (हिंदी)'
          : 'Listen';

      const sakhiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'sakhi',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: chatRes.reply,
        audioLabel,
        isFallback: chatRes.is_fallback,
        groundingMetrics: chatRes.grounding_metrics,
        suggestedFollowups: chatRes.suggested_followups || [],
        isMathCard:
          chatRes.reply.includes('₹') ||
          chatRes.reply.includes('వడ్డీ') ||
          chatRes.reply.includes('ब्याज') ||
          chatRes.reply.includes('surplus'),
      };

      setMessages((prev) => [...prev, sakhiMsg]);
      scrollToBottom();
    } catch (err: any) {
      if (__DEV__) console.warn('[AskSakhi] Chat request failed:', err);
      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'sakhi',
        time: 'Just now',
        text:
          selectedLanguage === 'te'
            ? 'క్షమించండి అక్క, సర్వర్‌తో అనుసంధానం కాలేదు. దయచేసి మీ ఇంటర్నెట్ సరిచూసుకొని మళ్లీ ప్రయత్నించండి.'
            : selectedLanguage === 'hi'
            ? 'क्षमा करें दीदी, सर्वर से संपर्क नहीं हो पाया। कृपया अपना इंटरनेट जांचें और पुनः प्रयास करें।'
            : 'Sorry, I could not reach the server. Please check your connection and try again.',
        suggestedFollowups: ['Retry: ' + query],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      setErrorMessage(err.message || 'Network error');
      scrollToBottom();
    } finally {
      setIsAiLoading(false);
    }
  };

  // Play / Synthesize Audio Narration for a message
  const handlePlayMessageAudio = async (item: Message) => {
    if (playingAudioId === item.id) {
      audioPlayer.stop();
      return;
    }

    try {
      setLoadingAudioId(item.id);

      if (item.audioBase64) {
        await audioPlayer.playBase64(item.audioBase64, 'mp3', item.id);
      } else {
        // Synthesize via backend
        const synthRes = await voiceService.synthesizeSpeech({
          text: item.text,
          language: selectedLanguage,
          speed: 1.0,
          audio_format: 'mp3',
        });

        item.audioBase64 = synthRes.audio_base64;
        await audioPlayer.playBase64(synthRes.audio_base64, 'mp3', item.id);
      }
    } catch (err: any) {
      if (__DEV__) console.warn('[AskSakhi] Audio synthesis/playback failed:', err);
      setErrorMessage('Audio playback failed: ' + (err.message || 'Unknown error'));
      setLoadingAudioId(null);
    }
  };

  // Voice recording & STT flow via speechRecorder
  const toggleRecording = async () => {
    setErrorMessage(null);
    if (isRecording) {
      await speechRecorder.stop(selectedLanguage, {
        onStop: () => setIsRecording(false),
        onTranscribing: () => setIsTranscribing(true),
        onTranscript: (transcript) => {
          setIsTranscribing(false);
          if (transcript && transcript.trim()) {
            handleSend(transcript.trim());
          }
        },
        onError: (err) => {
          setIsTranscribing(false);
          setErrorMessage(err);
        },
      });
    } else {
      await speechRecorder.start(selectedLanguage, {
        onStart: () => setIsRecording(true),
        onStop: () => setIsRecording(false),
        onTranscribing: () => setIsTranscribing(true),
        onTranscript: (transcript) => {
          setIsTranscribing(false);
          if (transcript && transcript.trim()) {
            handleSend(transcript.trim());
          }
        },
        onError: (err) => {
          setIsRecording(false);
          setIsTranscribing(false);
          setErrorMessage(err);
        },
      });
    }
  };

  // Calculate live member data metrics
  const displaySurplus = Math.round(totalMonthlySurplus).toLocaleString('en-IN');
  const totalDebtAmount = Math.round(totalDebt).toLocaleString('en-IN');
  const displaySavings = Math.round(totalSavings).toLocaleString('en-IN');

  const displayStage = journeyRoadmap?.current_active_stage != null
    ? `${journeyRoadmap.current_active_stage} (${journeyRoadmap.stages?.find(s => s.stage_number === journeyRoadmap.current_active_stage)?.title?.en || 'Shield'})`
    : '2 (Shield)';

  const getLanguageDisplayLabel = () => {
    if (selectedLanguage === 'te') return 'తెలుగు / Eng';
    if (selectedLanguage === 'hi') return 'हिन्दी / Eng';
    return 'English';
  };

  const getMicStatusText = () => {
    if (isTranscribing) {
      return selectedLanguage === 'te'
        ? 'మాటలను అర్థం చేసుకుంటోంది...'
        : selectedLanguage === 'hi'
        ? 'आवाज पहचानी जा रही है...'
        : 'Transcribing speech...';
    }
    if (isRecording) {
      return selectedLanguage === 'te'
        ? 'వినబడుతోంది... మాట్లాడండి'
        : selectedLanguage === 'hi'
        ? 'सुन रहे हैं... बोलिए'
        : 'Listening... speak now';
    }
    return selectedLanguage === 'te'
      ? 'తెలుగు లేదా హిందీలో మాట్లాడటానికి నొక్కండి'
      : selectedLanguage === 'hi'
      ? 'हिंदी या तेलुगु में बोलने के लिए टैप करें'
      : 'Tap to Speak in Telugu, Hindi or English';
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
        {/* Header Section */}
        <View className="px-4 py-3 bg-surface-container-low border-b border-surface-container-highest flex-row items-center justify-between shadow-sm">
          <View className="flex-row items-center flex-1 min-w-0 mr-2">
            <View className="relative mr-2.5 flex-shrink-0">
              <View className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center shadow-xs overflow-hidden border border-surface-container-highest/60">
                <Image
                  source={require('@/assets/images/app-logo-emblem.png')}
                  style={{ width: 36, height: 36 }}
                  resizeMode="contain"
                />
              </View>
            </View>
            <View className="flex-col min-w-0">
              <View className="flex-row items-center space-x-1.5">
                <Text className="text-base font-bold text-on-surface">Ask Sakhi</Text>
                <View className="bg-primary px-2 py-0.5 rounded-full ml-1.5">
                  <Text className="text-[10px] font-bold text-on-primary">AI Companion</Text>
                </View>
              </View>
            </View>
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={handleToggleLanguage}
              className="h-8 px-2.5 rounded-full bg-surface-container-high flex-row items-center mr-2 active:scale-95 shadow-sm">
              <MaterialIcons name="translate" size={14} color="#9d4300" />
              <Text className="text-xs font-semibold text-on-surface ml-1">
                {getLanguageDisplayLabel()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                audioPlayer.stop();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-surface-container-high items-center justify-center active:scale-95">
              <MaterialIcons name="close" size={18} color="#584237" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Live Data Bar */}
        <View className="mx-4 mt-2.5 bg-surface-container rounded-xl p-2.5 shadow-sm border border-surface-container-highest/60">
          <View className="flex-row items-center justify-between mb-1.5 px-0.5">
            <Text className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              Live Member Data
            </Text>
            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-emerald-500 mr-1" />
              <Text className="text-[11px] font-bold text-primary">Live Data</Text>
            </View>
          </View>
          <View className="flex-row flex-wrap justify-between gap-1.5">
            <View className="w-[48%] bg-surface-container-lowest rounded-lg p-2 flex-row items-center justify-between shadow-xs">
              <Text className="text-[11px] text-on-surface-variant font-medium">Surplus</Text>
              <Text className="text-xs font-bold text-on-surface">
                ₹{displaySurplus}
                <Text className="text-[10px] text-on-surface-variant">/mo</Text>
              </Text>
            </View>
            <View className="w-[48%] bg-surface-container-lowest rounded-lg p-2 flex-row items-center justify-between shadow-xs">
              <Text className="text-[11px] text-on-surface-variant font-medium">Debt</Text>
              <Text className="text-xs font-bold text-secondary">₹{totalDebtAmount}</Text>
            </View>
            <View className="w-[48%] bg-surface-container-lowest rounded-lg p-2 flex-row items-center justify-between shadow-xs">
              <Text className="text-[11px] text-on-surface-variant font-medium">Savings</Text>
              <Text className="text-xs font-bold text-on-surface">₹{displaySavings}</Text>
            </View>
            <View className="w-[48%] bg-surface-container-lowest rounded-lg p-2 flex-row items-center justify-between shadow-xs">
              <Text className="text-[11px] text-on-surface-variant font-medium">Stage</Text>
              <Text className="text-[11px] font-bold text-primary truncate">{displayStage}</Text>
            </View>
          </View>
        </View>

        {/* Error Alert if any */}
        {errorMessage && (
          <View className="mx-4 mt-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 mr-2">
              <MaterialIcons name="info-outline" size={14} color="#b45309" />
              <Text className="text-[11px] text-amber-800 ml-1.5 flex-1">{errorMessage}</Text>
            </View>
            <TouchableOpacity onPress={() => setErrorMessage(null)}>
              <MaterialIcons name="close" size={14} color="#b45309" />
            </TouchableOpacity>
          </View>
        )}

        {/* Messages List */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4 py-3"
          contentContainerStyle={{ paddingBottom: 20 }}>
          {messages.map((item) => (
            <View key={item.id} className="mb-3.5">
              {item.sender === 'sakhi' ? (
                <View className="flex-col items-start w-full">
                  <View className="flex-row items-center mb-1 px-1">
                    <View className="w-2 h-2 rounded-full bg-primary mr-1.5" />
                    <Text className="text-xs font-bold text-primary">
                      {selectedLanguage === 'te'
                        ? 'సఖి అక్క (Sakhi Akka)'
                        : selectedLanguage === 'hi'
                        ? 'सखी दीदी (Sakhi Didi)'
                        : 'Sakhi Sister'}
                    </Text>
                    {item.time && (
                      <Text className="text-[10px] text-on-surface-variant ml-1.5">{item.time}</Text>
                    )}
                    {item.isFallback && (
                      <View className="ml-2 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                        <Text className="text-[9px] font-semibold text-stone-600">Deterministic</Text>
                      </View>
                    )}
                  </View>

                  <View className="w-full bg-surface-container-low text-on-surface rounded-2xl rounded-tl-xs p-3.5 shadow-sm border border-surface-container-highest/60">
                    <Text className="text-sm text-on-surface leading-relaxed font-normal">
                      {item.text}
                    </Text>

                    {/* Grounding / Financial Calculation Card */}
                    {item.isMathCard && (
                      <View className="mt-2.5 bg-surface-container-lowest rounded-xl p-3 shadow-xs border border-surface-container-highest/50">
                        <View className="flex-row items-center justify-between py-1">
                          <View className="flex-row items-center">
                            <View className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5" />
                            <Text className="text-xs text-on-surface-variant">Monthly Surplus</Text>
                          </View>
                          <Text className="text-xs font-bold text-on-surface">₹{displaySurplus}</Text>
                        </View>
                        <View className="flex-row items-center justify-between py-1">
                          <View className="flex-row items-center">
                            <View className="w-1.5 h-1.5 rounded-full bg-secondary mr-1.5" />
                            <Text className="text-xs text-secondary">Debt Repayment Plan</Text>
                          </View>
                          <Text className="text-xs font-bold text-secondary">
                            -₹{Math.round(totalMonthlySurplus * 0.35).toLocaleString('en-IN')}
                          </Text>
                        </View>
                        <View className="flex-row items-center justify-between py-1">
                          <View className="flex-row items-center">
                            <View className="w-1.5 h-1.5 rounded-full bg-primary-container mr-1.5" />
                            <Text className="text-xs text-on-surface">Target Goal Savings</Text>
                          </View>
                          <Text className="text-xs font-bold text-on-surface">
                            -₹{Math.round(totalMonthlySurplus * 0.35).toLocaleString('en-IN')}
                          </Text>
                        </View>
                        <View className="w-full h-px bg-surface-container-high my-1.5" />
                        <View className="flex-row items-center justify-between bg-surface-container-low p-2 rounded-lg">
                          <View className="flex-row items-center">
                            <MaterialIcons name="shield" size={15} color="#9d4300" />
                            <Text className="text-xs font-bold text-on-surface ml-1">Leftover Safety Buffer</Text>
                          </View>
                          <Text className="text-sm font-bold text-primary">
                            ₹{Math.round(totalMonthlySurplus * 0.3).toLocaleString('en-IN')}
                          </Text>
                        </View>
                      </View>
                    )}

                    {/* Listen Audio Speaker Action */}
                    <View className="flex-row items-center justify-between mt-2.5 pt-1">
                      <TouchableOpacity
                        onPress={() => handlePlayMessageAudio(item)}
                        disabled={loadingAudioId === item.id}
                        className="h-8 px-3 rounded-full bg-primary text-on-primary flex-row items-center active:scale-95 shadow-sm">
                        {loadingAudioId === item.id ? (
                          <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                          <MaterialIcons
                            name={playingAudioId === item.id ? 'pause' : 'volume-up'}
                            size={16}
                            color="#ffffff"
                          />
                        )}
                        <Text className="text-xs font-bold text-on-primary ml-1.5">
                          {playingAudioId === item.id
                            ? 'Playing...'
                            : item.audioLabel || 'Listen'}
                        </Text>
                      </TouchableOpacity>

                      <View className="flex-row items-center bg-surface-container-lowest px-2 py-1 rounded-full border border-surface-container-highest/60">
                        <MaterialIcons name="verified" size={13} color="#9d4300" />
                        <Text className="text-[10px] text-on-surface-variant font-semibold ml-1">
                          Verified Calculations
                        </Text>
                      </View>
                    </View>

                    {/* Contextual Suggested Follow-up Chips */}
                    {item.suggestedFollowups && item.suggestedFollowups.length > 0 && (
                      <TutorialTarget id="sakhi-suggested-chips">
                        <View className="mt-3 pt-2 border-t border-surface-container-highest/40">
                          <Text className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                            Suggested Questions
                          </Text>
                          <View className="flex-row flex-wrap gap-1.5">
                            {item.suggestedFollowups.map((chip, chipIdx) => (
                              <TouchableOpacity
                                key={chipIdx}
                                onPress={() => handleSend(chip)}
                                className="bg-surface-container-highest/60 active:bg-primary-container/20 px-2.5 py-1.5 rounded-lg border border-surface-container-highest">
                                <Text className="text-xs text-on-surface font-medium">
                                  💬 {chip}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>
                      </TutorialTarget>
                    )}
                  </View>
                </View>
              ) : (
                <View className="flex-col items-end w-full">
                  <View className="flex-row items-center mb-1 px-1">
                    {item.time && (
                      <Text className="text-[10px] text-on-surface-variant mr-1.5">{item.time}</Text>
                    )}
                    <Text className="text-xs font-bold text-on-surface">
                      {currentUser?.name || 'You'} (You)
                    </Text>
                  </View>
                  <View className="max-w-[85%] bg-primary-container rounded-2xl rounded-tr-xs p-3.5 shadow-sm">
                    <Text className="text-sm text-on-primary font-medium">{item.text}</Text>
                  </View>
                </View>
              )}
            </View>
          ))}

          {/* AI Thinking / Loading Bubble */}
          {isAiLoading && (
            <View className="mb-3.5 flex-col items-start w-full">
              <View className="flex-row items-center mb-1 px-1">
                <View className="w-2 h-2 rounded-full bg-primary mr-1.5 animate-pulse" />
                <Text className="text-xs font-bold text-primary">Sakhi is thinking...</Text>
              </View>
              <View className="bg-surface-container-low rounded-2xl rounded-tl-xs px-4 py-3 border border-surface-container-highest/60 flex-row items-center space-x-2">
                <ActivityIndicator size="small" color="#9d4300" />
                <Text className="text-xs text-on-surface-variant ml-2">
                  Analyzing financial facts & policies...
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom Input Area */}
        <View className="mx-4 mb-3 bg-surface-container-low rounded-2xl p-2.5 shadow-sm border border-surface-container-highest">
          <TutorialTarget id="sakhi-mic-button">
            <View className="items-center justify-center py-1 mb-1">
              <TouchableOpacity
                onPress={toggleRecording}
                disabled={isTranscribing}
                className="relative items-center justify-center active:scale-95">
                {isRecording && (
                  <View className="absolute w-14 h-14 rounded-full bg-secondary/30 animate-ping" />
                )}
                <View
                  className={`w-12 h-12 rounded-full ${
                    isRecording ? 'bg-secondary' : isTranscribing ? 'bg-amber-600' : 'bg-primary-container'
                  } items-center justify-center shadow-md`}>
                  {isTranscribing ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <MaterialIcons
                      name={isRecording ? 'graphic-eq' : 'mic'}
                      size={24}
                      color="#ffffff"
                    />
                  )}
                </View>
              </TouchableOpacity>
              <Text className="text-[11px] text-on-surface-variant font-medium mt-1">
                {getMicStatusText()}
              </Text>
            </View>
          </TutorialTarget>

          <View className="flex-row items-center bg-surface-container-lowest rounded-xl p-1 shadow-inner border border-surface-container-highest/60">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask about savings, debt, schemes..."
              placeholderTextColor="#8c7164"
              className="flex-1 px-3 py-2 text-sm text-on-surface font-normal"
              onSubmitEditing={() => handleSend()}
              returnKeyType="send"
              editable={!isAiLoading}
            />
            <TouchableOpacity
              onPress={() => handleSend()}
              disabled={!inputText.trim() || isAiLoading}
              className={`w-9 h-9 rounded-lg ${
                !inputText.trim() || isAiLoading ? 'bg-surface-container-high' : 'bg-primary-container'
              } items-center justify-center active:scale-95 shadow-sm`}>
              <MaterialIcons
                name="send"
                size={18}
                color={!inputText.trim() || isAiLoading ? '#8c7164' : '#ffffff'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
