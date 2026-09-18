import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTutorial } from '@/context/TutorialContext';
import { useApp } from '@/context/AppContext';
import { voiceService } from '@/services/voiceService';
import { audioPlayer } from '@/services/audioPlayer';

export function TutorialCompletionModal() {
  const { showCompletionModal, dismissCompletionModal } = useTutorial();
  const { language } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  const currentLang = language || 'te';

  const congratulationsAudioText =
    currentLang === 'te'
      ? 'అభినందనలు అక్క! మీరు సఖి ముఖ్యమైన ఫీచర్లను విజయవంతంగా నేర్చుకున్నారు. సఖి ఎల్లప్పుడూ మీ తోడుగా ఉంటుంది.'
      : currentLang === 'hi'
      ? 'बधाई हो दीदी! आपने सखी की महत्वपूर्ण विशेषताओं को सफलतापूर्वक सीख लिया है। सखी हमेशा आपकी मदद के लिए तैयार है।'
      : 'Congratulations Sister! You have successfully completed the walkthrough. Sakhi is always here to assist you.';

  useEffect(() => {
    if (showCompletionModal) {
      // Play brief congratulatory voice
      const playCongratAudio = async () => {
        try {
          setIsLoadingAudio(true);
          const res = await voiceService.synthesizeSpeech({
            text: congratulationsAudioText,
            language: currentLang,
            speed: 1.0,
            audio_format: 'mp3',
          });
          await audioPlayer.playBase64(res.audio_base64, 'mp3', 'tutorial-congratulations');
          setIsPlaying(true);
        } catch (err) {
          if (__DEV__) console.warn('Tutorial completion audio failed:', err);
        } finally {
          setIsLoadingAudio(false);
        }
      };

      playCongratAudio();
    } else {
      audioPlayer.stop();
      setIsPlaying(false);
    }
  }, [showCompletionModal, congratulationsAudioText, currentLang]);

  if (!showCompletionModal) return null;

  return (
    <Modal
      visible={showCompletionModal}
      transparent
      animationType="fade"
      onRequestClose={dismissCompletionModal}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {/* Badge */}
          <View style={styles.badgeWrapper}>
            <View style={styles.badge}>
              <MaterialIcons name="emoji-events" size={36} color="#ffffff" />
            </View>
            <View style={styles.sparkleBadge}>
              <MaterialIcons name="star" size={16} color="#d97706" />
            </View>
          </View>

          {/* Headline */}
          <Text className="text-xl font-bold text-on-surface text-center mb-1">
            {currentLang === 'te'
              ? 'అభినందనలు! 🎉'
              : currentLang === 'hi'
              ? 'बधाई हो! 🎉'
              : 'Well Done! 🎉'}
          </Text>

          {/* Subtitle */}
          <Text className="text-xs font-bold text-primary text-center mb-2 uppercase tracking-wide">
            {currentLang === 'te'
              ? 'మీరు కొత్త నైపుణ్యాలు నేర్చుకున్నారు'
              : currentLang === 'hi'
              ? 'आपने नए वित्तीय कौशल सीखे'
              : 'You Mastered New Skills Today'}
          </Text>

          {/* Body */}
          <Text className="text-xs text-on-surface-variant text-center leading-relaxed mb-4 px-2">
            {currentLang === 'te'
              ? 'సఖిని ఉపయోగించడానికి మీరు సిద్ధమయ్యారు. మీ కలలు మరియు పొదుపులను సురక్షితంగా రికార్డ్ చేయండి.'
              : currentLang === 'hi'
              ? 'आप सखी का उपयोग करने के लिए तैयार हैं। अपने सपनों और बचत को सुरक्षित रूप से दर्ज करें।'
              : 'You are now ready to make the most of Sakhi. Track expenses, save in Dream Pots, and explore matched schemes!'}
          </Text>

          {/* Audio Indicator */}
          <View className="flex-row items-center justify-center bg-surface-container-low p-2 rounded-xl mb-4 border border-surface-container-highest/60 w-full">
            <MaterialIcons
              name={isPlaying ? 'volume-up' : 'volume-mute'}
              size={18}
              color="#9d4300"
              className="mr-1.5"
            />
            <Text className="text-[11px] font-semibold text-on-surface">
              {isLoadingAudio
                ? 'Loading voice...'
                : isPlaying
                ? 'Voice playing...'
                : 'Voice narration complete'}
            </Text>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            onPress={dismissCompletionModal}
            className="w-full bg-primary py-3.5 px-6 rounded-xl flex-row items-center justify-center shadow-md active:scale-95"
          >
            <Text className="text-sm font-bold text-white mr-1">
              {currentLang === 'te'
                ? 'సఖిని ప్రారంభించండి'
                : currentLang === 'hi'
                ? 'सखी का उपयोग शुरू करें'
                : 'Start Using Sakhi'}
            </Text>
            <MaterialIcons name="arrow-forward" size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    zIndex: 10005,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#fff8f3',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 16,
    borderWidth: 1.5,
    borderColor: '#e8c2a8',
  },
  badgeWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  badge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#9d4300',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#9d4300',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sparkleBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#d97706',
  },
});
