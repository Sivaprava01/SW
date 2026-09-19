import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { JourneyLevelData } from '@/constants/journeyLevels';
import { useApp } from '@/context/AppContext';
import { voiceService } from '@/services/voiceService';
import { audioPlayer } from '@/services/audioPlayer';

interface LevelDetailModalProps {
  level: JourneyLevelData | null;
  visible: boolean;
  isCompleted: boolean;
  onClose: () => void;
  onCompleteLevel: (levelNumber: number) => Promise<void>;
}

export function LevelDetailModal({
  level,
  visible,
  isCompleted,
  onClose,
  onCompleteLevel,
}: LevelDetailModalProps) {
  const insets = useSafeAreaInsets();
  const { language } = useApp();
  const activeLang = (language === 'hi' || language === 'te' || language === 'en') ? language : 'te';

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);

  const audioRequestTokenRef = useRef<number>(0);

  const trackId = level ? `journey-level-${level.levelNumber}-${activeLang}` : 'level-audio';

  // Audio status subscriber
  useEffect(() => {
    const unsubscribe = audioPlayer.subscribe((event) => {
      if (event.currentId === trackId) {
        setIsPlayingAudio(event.state === 'playing');
        setIsLoadingAudio(event.state === 'loading');
      } else {
        setIsPlayingAudio(false);
        setIsLoadingAudio(false);
      }
    });
    return () => unsubscribe();
  }, [trackId]);

  // Clean up audio on close / level change
  useEffect(() => {
    if (!visible) {
      audioRequestTokenRef.current += 1;
      audioPlayer.stop();
      setIsPlayingAudio(false);
      setIsLoadingAudio(false);
    }
  }, [visible]);

  // Indic voice speech synthesis for level explanation
  const handleToggleVoice = async () => {
    if (!level) return;

    if (isPlayingAudio) {
      audioPlayer.stop();
      return;
    }

    const currentToken = ++audioRequestTokenRef.current;
    const textToSpeak = `${level.title[activeLang]}. ${level.explanation[activeLang]}`;

    try {
      setIsLoadingAudio(true);
      audioPlayer.stop();

      const res = await voiceService.synthesizeSpeech({
        text: textToSpeak,
        language: activeLang,
        speed: 1.0,
        audio_format: 'mp3',
      });

      if (audioRequestTokenRef.current !== currentToken) {
        return;
      }

      setIsLoadingAudio(false);
      await audioPlayer.playBase64(res.audio_base64, res.audio_format || 'mp3', trackId);
    } catch (err) {
      if (audioRequestTokenRef.current === currentToken) {
        setIsLoadingAudio(false);
        if (__DEV__) console.warn('[LevelDetailModal] Voice synthesis error:', err);
      }
    }
  };

  const handleComplete = async () => {
    if (!level || isMarkingComplete) return;
    try {
      setIsMarkingComplete(true);
      await onCompleteLevel(level.levelNumber);
      onClose();
    } catch (err) {
      if (__DEV__) console.warn('[LevelDetailModal] Complete level error:', err);
    } finally {
      setIsMarkingComplete(false);
    }
  };

  if (!level) return null;

  const title = level.title[activeLang] || level.title.en;
  const tierName = level.tierName[activeLang] || level.tierName.en;
  const summary = level.summary[activeLang] || level.summary.en;
  const explanation = level.explanation[activeLang] || level.explanation.en;
  const takeaways = level.keyTakeaways[activeLang] || level.keyTakeaways.en;

  const labels = {
    levelPrefix: activeLang === 'te' ? 'లెవెల్' : activeLang === 'hi' ? 'स्तर' : 'Level',
    listenVoice: activeLang === 'te' ? 'వాయిస్ వినండి' : activeLang === 'hi' ? 'ऑडियो सुनें' : 'Listen Voice',
    playing: activeLang === 'te' ? 'ప్లే అవుతోంది...' : activeLang === 'hi' ? 'चल रहा है...' : 'Playing...',
    keyTakeaways: activeLang === 'te' ? 'ముఖ్యమైన ఆచరణాత్మక నియమాలు' : activeLang === 'hi' ? 'महत्वपूर्ण व्यावहारिक नियम' : 'Key Practical Rules',
    markComplete: activeLang === 'te' ? 'పూర్తయింది (తర్వాతి లెవెల్ అన్‌లాక్) ✓' : activeLang === 'hi' ? 'पूरा हुआ (अगला स्तर खोलें) ✓' : 'Mark Complete & Unlock Next Level ✓',
    completedBadge: activeLang === 'te' ? 'ఈ లెవెల్ పూర్తయింది' : activeLang === 'hi' ? 'यह स्तर पूरा हो चुका है' : 'Level Completed',
    completedBtn: activeLang === 'te' ? 'మళ్లీ పూర్తి చేయండి ✓' : activeLang === 'hi' ? 'दोबारा पूरा करें ✓' : 'Completed ✓',
    voiceSubtext: activeLang === 'te' ? 'తెలుగులో స్పష్టమైన ఆడియో వివరణ' : activeLang === 'hi' ? 'हिंदी में स्पष्ट ऑडियो स्पष्टीकरण' : 'Clear audio narration in English',
    closeA11y: activeLang === 'te' ? 'లెవెల్ వివరాలు మూసివేయండి' : activeLang === 'hi' ? 'स्तर का विवरण बंद करें' : 'Close Level Details',
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalBackdrop}>
        <View
          style={[
            styles.sheetContainer,
            {
              paddingTop: Math.max(insets.top, 16),
              paddingBottom: Math.max(insets.bottom, 16),
            },
          ]}
        >
          {/* Top Sheet Header */}
          <View className="px-5 py-3 flex-row items-center justify-between border-b border-surface-container-highest/60">
            <View className="flex-row items-center gap-2 flex-1 mr-2">
              <View className="w-8 h-8 rounded-xl bg-primary-container items-center justify-center shadow-xs">
                <Text className="text-xs font-bold text-white font-mono">
                  {level.levelNumber}
                </Text>
              </View>
              <View className="flex-col flex-1 min-w-0">
                <View className="flex-row items-center gap-1.5 flex-wrap">
                  <View className="bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                    <Text className="text-[10px] font-bold text-primary uppercase">
                      {tierName}
                    </Text>
                  </View>
                  {isCompleted && (
                    <View className="bg-secondary/15 px-2 py-0.5 rounded-md flex-row items-center">
                      <MaterialIcons name="check" size={11} color="#2e7d32" />
                      <Text className="text-[10px] font-bold text-secondary ml-0.5">
                        {labels.completedBadge}
                      </Text>
                    </View>
                  )}
                </View>
                <Text className="text-xs font-bold text-on-surface truncate mt-0.5">
                  {labels.levelPrefix} {level.levelNumber}: {title}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              accessibilityLabel={labels.closeA11y}
              className="w-8 h-8 rounded-full bg-surface-container-high items-center justify-center active:scale-95"
            >
              <MaterialIcons name="close" size={18} color="#584237" />
            </TouchableOpacity>
          </View>

          {/* Scrollable Content */}
          <ScrollView
            className="flex-1 px-5 py-3"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {/* Main Headline */}
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-10 h-10 rounded-xl bg-primary-fixed items-center justify-center shadow-2xs">
                <MaterialIcons name={level.iconName as any} size={22} color="#9d4300" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-on-surface leading-snug">
                  {title}
                </Text>
                <Text className="text-xs text-on-surface-variant mt-0.5 font-medium">
                  {summary}
                </Text>
              </View>
            </View>

            {/* Audio Voice Narration Card */}
            <TouchableOpacity
              onPress={handleToggleVoice}
              disabled={isLoadingAudio}
              activeOpacity={0.85}
              className="w-full bg-surface-container-high rounded-2xl p-3 mb-4 shadow-xs flex-row items-center justify-between border border-surface-container-highest/60 active:scale-[0.99]"
            >
              <View className="flex-row items-center flex-1 mr-2">
                <View className="w-9 h-9 rounded-xl bg-primary-container items-center justify-center mr-2.5">
                  <MaterialIcons name="record-voice-over" size={18} color="#ffffff" />
                </View>
                <View className="flex-col flex-1">
                  <Text className="text-xs font-bold text-on-surface">
                    {isPlayingAudio ? labels.playing : labels.listenVoice}
                  </Text>
                  <Text className="text-[10px] text-on-surface-variant font-medium">
                    {labels.voiceSubtext}
                  </Text>
                </View>
              </View>
              <View className="w-8 h-8 rounded-full bg-surface-container-lowest items-center justify-center shadow-2xs">
                {isLoadingAudio ? (
                  <ActivityIndicator size="small" color="#9d4300" />
                ) : (
                  <MaterialIcons
                    name={isPlayingAudio ? 'stop' : 'play-arrow'}
                    size={20}
                    color="#9d4300"
                  />
                )}
              </View>
            </TouchableOpacity>

            {/* Plain-Language Text Explanation */}
            <View className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-surface-container-highest/60 mb-4">
              <Text className="text-[13px] text-on-surface leading-relaxed font-normal">
                {explanation}
              </Text>
            </View>

            {/* Key Takeaways Section */}
            <View className="bg-surface-container-low rounded-2xl p-4 shadow-xs border border-surface-container-highest/60 mb-4">
              <View className="flex-row items-center mb-2.5">
                <MaterialIcons name="lightbulb" size={16} color="#9d4300" />
                <Text className="text-xs font-bold text-primary ml-1.5 uppercase tracking-wider">
                  {labels.keyTakeaways}
                </Text>
              </View>

              <View className="flex-col gap-2">
                {takeaways.map((pt, ptIdx) => (
                  <View key={ptIdx} className="flex-row items-start">
                    <View className="w-4 h-4 rounded-full bg-primary/15 items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <MaterialIcons name="check" size={10} color="#9d4300" />
                    </View>
                    <Text className="text-xs text-on-surface flex-1 leading-relaxed font-medium">
                      {pt}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Complete Level CTA Button */}
            <TouchableOpacity
              onPress={handleComplete}
              disabled={isMarkingComplete}
              className={`w-full py-3.5 px-5 rounded-2xl flex-row items-center justify-center shadow-md active:scale-[0.98] ${
                isCompleted ? 'bg-surface-container-high border border-surface-container-highest/70' : 'bg-primary'
              }`}
            >
              {isMarkingComplete ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <MaterialIcons
                    name={isCompleted ? 'done-all' : 'check-circle'}
                    size={18}
                    color={isCompleted ? '#584237' : '#ffffff'}
                  />
                  <Text
                    className={`text-sm font-bold ml-2 ${
                      isCompleted ? 'text-on-surface' : 'text-white'
                    }`}
                  >
                    {isCompleted ? labels.completedBtn : labels.markComplete}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    width: '100%',
    maxHeight: '88%',
    backgroundColor: '#fff8f3',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 16,
  },
});
