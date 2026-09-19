import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTutorial } from '@/context/TutorialContext';
import { useApp } from '@/context/AppContext';

export function TutorialPromptModal() {
  const { showPromptModal, dismissPromptModal, startTutorial } = useTutorial();
  const { language } = useApp();

  const currentLang = language || 'te';

  if (!showPromptModal) return null;

  const handleStartTour = () => {
    dismissPromptModal();
    startTutorial('basics');
  };

  return (
    <Modal
      visible={showPromptModal}
      transparent
      animationType="fade"
      onRequestClose={dismissPromptModal}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {/* Mascot icon */}
          <View style={[styles.mascot, { backgroundColor: '#ffffff', overflow: 'hidden' }]}>
            <Image
              source={require('@/assets/images/app-logo-emblem.png')}
              style={{ width: 44, height: 44 }}
              resizeMode="contain"
            />
          </View>

          {/* Headline */}
          <Text className="text-lg font-bold text-on-surface text-center mb-1">
            {currentLang === 'te'
              ? 'నమస్తే! సఖిని పరిచయం చేయమంటారా? 👋'
              : currentLang === 'hi'
              ? 'नमस्ते! क्या सखी आपको ऐप समझाए? 👋'
              : 'Namaste! Let Sakhi Show You Around? 👋'}
          </Text>

          {/* Subtitle */}
          <Text className="text-xs text-on-surface-variant text-center leading-relaxed mb-4 px-2">
            {currentLang === 'te'
              ? 'డబ్బు నిర్వహణ, కలల కుండలు, మరియు ప్రభుత్వ పథకాలను 1 నిమిషంలో సులభంగా నేర్చుకోండి.'
              : currentLang === 'hi'
              ? 'पैसों का हिसाब, बचत के घड़े और सरकारी योजनाएं 1 मिनट में आसानी से समझें।'
              : 'Take a quick 1-minute guided interactive walkthrough to learn how to track money, set goals, and view benefits.'}
          </Text>

          {/* Action Buttons */}
          <View className="w-full gap-2.5">
            <TouchableOpacity
              onPress={handleStartTour}
              className="w-full bg-primary py-3 px-4 rounded-xl flex-row items-center justify-center shadow-sm active:scale-95"
            >
              <MaterialIcons name="explore" size={18} color="#ffffff" className="mr-1.5" />
              <Text className="text-xs font-bold text-white">
                {currentLang === 'te'
                  ? 'చూపించు (Show Me)'
                  : currentLang === 'hi'
                  ? 'दिखाएं (Show Me)'
                  : 'Start Interactive Tour'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={dismissPromptModal}
              className="w-full bg-surface-container-high py-2.5 px-4 rounded-xl items-center justify-center active:scale-95"
            >
              <Text className="text-xs font-bold text-on-surface-variant">
                {currentLang === 'te'
                  ? 'నేనే చూసుకుంటాను (Explore on my own)'
                  : currentLang === 'hi'
                  ? 'मैं खुद देखूंगी (Explore on my own)'
                  : 'Explore on My Own'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    zIndex: 10004,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff8f3',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 1.5,
    borderColor: '#e8c2a8',
  },
  mascot: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#9d4300',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#9d4300',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});
