import React from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { useTutorial } from '@/context/TutorialContext';
import { TUTORIAL_DEFINITIONS } from '@/constants/tutorialSteps';

export default function TourScreen() {
  const router = useRouter();
  const { language } = useApp();
  const { openCardTour, startTutorial, hasSeenTutorial } = useTutorial();

  const currentLang = language || 'te';

  const handleLaunchTutorial = (tutorialId: string) => {
    if (tutorialId === 'basics') {
      router.replace('/(tabs)' as any);
      setTimeout(() => {
        openCardTour();
      }, 200);
      return;
    }
    // Navigate to tabs first, then launch tutorial
    router.replace('/(tabs)' as any);
    setTimeout(() => {
      startTutorial(tutorialId);
    }, 200);
  };

  const tutorialsList = Object.values(TUTORIAL_DEFINITIONS);

  const getCategoryTitle = (cat: string) => {
    switch (cat) {
      case 'finance':
        return currentLang === 'te'
          ? 'డబ్బు & పొదుపులు (Money & Savings)'
          : currentLang === 'hi'
          ? 'पैसा और बचत (Money & Savings)'
          : 'Money & Savings';
      case 'benefits':
        return currentLang === 'te'
          ? 'పథకాలు & సంక్షేమం (Benefits)'
          : currentLang === 'hi'
          ? 'योजनाएं और कल्याण (Benefits)'
          : 'Government Schemes';
      case 'ai':
        return currentLang === 'te'
          ? 'వాయిస్ సహాయకురాలు (AI Voice)'
          : currentLang === 'hi'
          ? 'वॉयस सहायता (AI Voice)'
          : 'AI Voice Companion';
      default:
        return currentLang === 'te'
          ? 'ప్రధాన పరిచయం (Core App)'
          : currentLang === 'hi'
          ? 'मुख्य परिचय (Core App)'
          : 'Core Experience';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      {/* Top Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-surface-container-highest/60 bg-surface">
        <TouchableOpacity
          onPress={() => router.replace('/(tabs)' as any)}
          className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center active:scale-95"
          accessibilityLabel="Go back">
          <MaterialIcons name="arrow-back" size={22} color="#9d4300" />
        </TouchableOpacity>

        <View className="flex-row items-center bg-surface-container-high px-3 py-1 rounded-full">
          <MaterialIcons name="explore" size={14} color="#9d4300" />
          <Text className="text-xs font-bold text-primary ml-1">Guided Tutorials Hub</Text>
        </View>

        <TouchableOpacity onPress={() => router.replace('/(tabs)' as any)} className="p-1">
          <Text className="text-xs font-bold text-on-surface-variant">Close</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 py-3" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Main Hero Card: Full Basics Tour */}
        <View className="bg-primary-container rounded-2xl p-4 mb-4 shadow-md text-on-primary flex-col gap-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center bg-white/20 px-2.5 py-0.5 rounded-full">
              <MaterialIcons name="stars" size={14} color="#ffffff" />
              <Text className="text-[10px] font-bold text-white uppercase tracking-wider ml-1">
                Featured Walkthrough
              </Text>
            </View>
            <Text className="text-xs text-white/90 font-medium">~60 sec</Text>
          </View>

          <View className="flex-row items-center gap-3">
            <View className="w-12 h-12 rounded-xl bg-surface-container-lowest items-center justify-center shadow-xs overflow-hidden p-0.5 border border-surface-container-highest/60">
              <Image
                source={require('@/assets/images/app-logo-emblem.png')}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />
            </View>
            <View className="flex-1 min-w-0">
              <Text className="text-base font-bold text-white">
                {currentLang === 'te'
                  ? 'సఖి సమగ్ర పరిచయం (Basics Tour)'
                  : currentLang === 'hi'
                  ? 'सखी संपूर्ण परिचय (Basics Tour)'
                  : 'Main Sakhi Guided Tour'}
              </Text>
              <Text className="text-xs text-white/90 leading-snug mt-0.5">
                {currentLang === 'te'
                  ? 'స్పాట్‌లైట్ మరియు వాయిస్ సహాయంతో అన్ని ఫీచర్లను సులభంగా నేర్చుకోండి.'
                  : currentLang === 'hi'
                  ? 'स्पॉटलाइट और वॉयस सहायता से सभी विशेषताओं को आसानी से समझें।'
                  : 'Interactive spotlight walkthrough across Home, Money, Goals, and Schemes.'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => handleLaunchTutorial('basics')}
            className="w-full bg-surface py-3 px-4 rounded-xl flex-row items-center justify-center shadow-sm active:scale-98">
            <MaterialIcons name="play-circle-filled" size={20} color="#9d4300" className="mr-1.5" />
            <Text className="text-xs font-bold text-primary">
              {hasSeenTutorial('basics')
                ? currentLang === 'te'
                  ? 'మళ్ళీ చూడండి (Replay Basics Tour)'
                  : currentLang === 'hi'
                  ? 'दोबारा देखें (Replay Basics Tour)'
                  : 'Replay Basics Tour'
                : currentLang === 'te'
                ? 'టూర్ ప్రారంభించండి (Start Tour)'
                : currentLang === 'hi'
                ? 'टूर शुरू करें (Start Tour)'
                : 'Start Interactive Tour'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Section Heading */}
        <Text className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2.5 px-0.5">
          Feature-by-Feature Guided Walkthroughs
        </Text>

        {/* List of Feature Tutorials */}
        <View className="flex-col gap-2.5">
          {tutorialsList.map((tut) => {
            const isSeen = hasSeenTutorial(tut.id);
            const isBasics = tut.id === 'basics';

            return (
              <TouchableOpacity
                key={tut.id}
                onPress={() => handleLaunchTutorial(tut.id)}
                className="bg-surface-container-lowest p-3.5 rounded-xl shadow-xs border border-surface-container-highest/60 flex-row items-center justify-between active:scale-[0.99]">
                <View className="flex-row items-center flex-1 mr-2">
                  <View className="w-10 h-10 rounded-xl bg-primary-fixed items-center justify-center mr-3 shadow-2xs flex-shrink-0">
                    <MaterialIcons name={tut.icon as any} size={20} color="#9d4300" />
                  </View>

                  <View className="flex-col flex-1 min-w-0">
                    <View className="flex-row items-center gap-1.5 flex-wrap">
                      <Text className="text-xs font-bold text-on-surface truncate">
                        {tut.name[currentLang] || tut.name.en}
                      </Text>
                      {isSeen && (
                        <View className="bg-secondary/15 px-1.5 py-0.2 rounded flex-row items-center">
                          <MaterialIcons name="check" size={10} color="#2e7d32" />
                          <Text className="text-[9px] font-bold text-secondary ml-0.5">Completed</Text>
                        </View>
                      )}
                    </View>

                    <Text className="text-[11px] text-on-surface-variant mt-0.5 truncate">
                      {tut.description[currentLang] || tut.description.en}
                    </Text>

                    <View className="flex-row items-center gap-2 mt-1">
                      <Text className="text-[10px] font-bold text-primary">
                        {tut.steps.length} Steps
                      </Text>
                      <Text className="text-[10px] text-on-surface-variant">•</Text>
                      <Text className="text-[10px] text-on-surface-variant">
                        ~{tut.estimatedSeconds}s
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="w-8 h-8 rounded-full bg-surface-container-high items-center justify-center">
                  <MaterialIcons name="play-arrow" size={18} color="#9d4300" />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
