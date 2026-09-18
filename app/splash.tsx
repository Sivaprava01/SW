import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const router = useRouter();
  const [greetingIndex, setGreetingIndex] = useState(0);

  const greetings = [
    'Namaste, Lakshmi 👋',
    'Namaste, Sister 👋',
    'Pranam, Lakshmiji 🙏',
  ];

  const handleContinue = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView className="flex-1 bg-surface justify-between px-4 py-4">
      {/* Top Bar */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center bg-surface-container-high px-3 py-1 rounded-full shadow-xs">
          <View className="w-2 h-2 rounded-full bg-primary-container mr-1.5" />
          <Text className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
            Sakhi · v2.4
          </Text>
        </View>
        <View className="flex-row items-center bg-surface-container-high px-2.5 py-1 rounded-full">
          <MaterialIcons name="wifi" size={14} color="#9d4300" />
          <Text className="text-[10px] text-on-surface-variant font-semibold ml-1">Offline Safe</Text>
        </View>
      </View>

      {/* Main Hero Card */}
      <View className="items-center text-center my-auto py-4">
        {/* Mascot */}
        <TouchableOpacity
          onPress={() => setGreetingIndex((prev) => (prev + 1) % greetings.length)}
          className="relative mb-4 active:scale-95">
          <View className="w-24 h-24 rounded-2xl bg-surface-container-lowest items-center justify-center shadow-md p-2 border border-surface-container-highest/60">
            <View className="w-16 h-16 rounded-full bg-primary-container items-center justify-center">
              <Text className="text-3xl font-bold text-on-primary">स</Text>
            </View>
          </View>
          <View className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1 shadow-xs">
            <MaterialIcons name="verified" size={16} color="#ffffff" />
          </View>
        </TouchableOpacity>

        {/* Product Badge */}
        <View className="flex-row items-center bg-surface-container-high px-3 py-1 rounded-full mb-3 shadow-xs">
          <MaterialIcons name="diversity-1" size={14} color="#9d4300" />
          <Text className="text-xs font-bold text-primary ml-1.5">
            Sakhi Financial Companion
          </Text>
        </View>

        {/* Headline */}
        <TouchableOpacity
          onPress={() => setGreetingIndex((prev) => (prev + 1) % greetings.length)}
          className="items-center mb-1">
          <Text className="text-2xl font-bold text-on-surface text-center">
            {greetings[greetingIndex]}
          </Text>
          <Text className="text-[10px] text-outline mt-0.5">(tap to switch greeting)</Text>
        </TouchableOpacity>

        {/* Sub-caption */}
        <Text className="text-xs text-on-surface-variant text-center max-w-xs mb-5 px-4 leading-relaxed">
          Your personal financial companion is ready for today's savings & ledgers.
        </Text>

        {/* Trust Pills */}
        <View className="flex-row flex-wrap justify-center gap-2 mb-6">
          <View className="flex-row items-center bg-surface-container-lowest px-3 py-1.5 rounded-full shadow-xs border border-surface-container-highest/60">
            <MaterialIcons name="shield" size={14} color="#9d4300" />
            <Text className="text-xs font-medium text-on-surface ml-1">100% Private</Text>
          </View>
          <View className="flex-row items-center bg-surface-container-lowest px-3 py-1.5 rounded-full shadow-xs border border-surface-container-highest/60">
            <MaterialIcons name="chat-bubble-outline" size={14} color="#b3291b" />
            <Text className="text-xs font-medium text-on-surface ml-1">Zero Bank Jargon</Text>
          </View>
          <View className="flex-row items-center bg-surface-container-lowest px-3 py-1.5 rounded-full shadow-xs border border-surface-container-highest/60">
            <MaterialIcons name="record-voice-over" size={14} color="#9d4135" />
            <Text className="text-xs font-medium text-on-surface ml-1">Voice Support</Text>
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          onPress={handleContinue}
          className="w-full bg-primary-container py-3.5 px-6 rounded-xl flex-row items-center justify-center shadow-md active:scale-[0.98]">
          <Text className="text-sm font-bold text-on-primary mr-1.5">Tap anywhere to continue</Text>
          <MaterialIcons name="arrow-forward" size={18} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Bottom Voice Guidance Bar */}
      <View className="w-full bg-surface-container-low rounded-xl p-3 shadow-xs flex-row items-center border border-surface-container-highest/60">
        <View className="w-9 h-9 rounded-lg bg-surface-container-highest items-center justify-center mr-2.5">
          <MaterialIcons name="volume-up" size={18} color="#b3291b" />
        </View>
        <View className="flex-col flex-1 min-w-0">
          <Text className="text-xs font-bold text-on-surface leading-tight">Voice Guidance Ready</Text>
          <Text className="text-[10px] text-on-surface-variant truncate">
            हिन्दी • తెలుగు • English • मराठी
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleContinue}
          className="w-8 h-8 rounded-lg bg-surface-container-highest items-center justify-center active:scale-95">
          <MaterialIcons name="play-arrow" size={18} color="#9d4300" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
