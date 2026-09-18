import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function TourScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const steps = [
    {
      step: 1,
      name: 'Welcome',
      icon: 'handshake' as const,
      title: 'Namaste, Sister!\nWelcome to Sakhi',
      subtitle: 'Your personal, trustworthy financial companion',
      body: 'Sakhi is like an elder sister who sits with you, counts every rupee from your crop, dairy, or handloom work, and protects your household dreams. Absolutely zero confusing English bank jargon.',
      progress: '20%',
    },
    {
      step: 2,
      name: 'Money',
      icon: 'account-balance-wallet' as const,
      title: 'Track Cash &\nSHG Group Dues',
      subtitle: 'One-tap ledger for income, sales & micro-loans',
      body: 'Record daily earnings from milk sales, stitching, or local market stalls. Never lose track of monthly Self-Help Group (SHG) repayments or neighbor loans.',
      progress: '40%',
    },
    {
      step: 3,
      name: 'Journey',
      icon: 'explore' as const,
      title: 'Save For Dreams,\nBig & Small',
      subtitle: "Gold coins, daughter's schooling, or shop tools",
      body: 'Set targets like saving ₹20 a day into your piggy bank or gold locker. Watch your savings jar fill up like grains of rice with every milestone.',
      progress: '60%',
    },
    {
      step: 4,
      name: 'Schemes',
      icon: 'verified-user' as const,
      title: 'Government Benefits\nMade For You',
      subtitle: 'Lakhpati Didi, PM Awas, Mudra, & Sukanya',
      body: 'Know which direct bank benefit transfers (DBT) and subsidy schemes you qualify for without having to pay any middleman or tout at the taluk office.',
      progress: '80%',
    },
    {
      step: 5,
      name: 'Companion',
      icon: 'support-agent' as const,
      title: 'Speak Naturally,\nAnytime You Need',
      subtitle: 'Your 24/7 audio assistant in your dialect',
      body: "Ask Sakhi questions just like speaking with your village counselor: 'How much did I save this month?' or 'When is my next SHG installment due?'",
      progress: '100%',
    },
  ];

  const data = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.replace('/(tabs)');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface justify-between px-4 py-3">
      {/* Top Meta Bar */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center bg-surface-container px-3 py-1 rounded-full">
          <View className="w-2 h-2 rounded-full bg-primary-container mr-1.5" />
          <Text className="text-[11px] font-bold text-on-surface uppercase tracking-wide">
            Step {data.step} • {data.name}
          </Text>
        </View>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')} className="p-1">
          <Text className="text-xs font-bold text-on-surface-variant">Skip Tour</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden mb-3">
        <View className="h-full bg-primary-container rounded-full" style={{ width: `${data.progress}%` as any }} />
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Main Step Card */}
        <View className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-container-highest/60 flex-col gap-3 mb-4">
          <View className="w-full bg-surface-container-low rounded-xl p-4 items-center justify-center">
            <View className="w-16 h-16 rounded-full bg-surface-container items-center justify-center mb-1">
              <MaterialIcons name={data.icon} size={32} color="#9d4300" />
            </View>
          </View>

          <Text className="text-xl font-bold text-on-surface leading-tight">{data.title}</Text>
          <Text className="text-xs font-bold text-primary">{data.subtitle}</Text>
          <Text className="text-xs text-on-surface-variant leading-relaxed">{data.body}</Text>

          {/* Audio preview pill */}
          <View className="w-full rounded-xl bg-surface-container p-2.5 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 mr-2">
              <TouchableOpacity
                onPress={() => setIsPlayingAudio(!isPlayingAudio)}
                className="w-10 h-10 rounded-full bg-primary-container items-center justify-center mr-2 shadow-xs active:scale-90">
                <MaterialIcons name={isPlayingAudio ? 'pause' : 'volume-up'} size={20} color="#ffffff" />
              </TouchableOpacity>
              <View className="flex-col">
                <Text className="text-xs font-bold text-on-surface">Listen to Sakhi</Text>
                <Text className="text-[10px] text-on-surface-variant">Telugu • Hindi • Marathi</Text>
              </View>
            </View>
            <View className="bg-surface-container-high px-2 py-0.5 rounded-full">
              <Text className="text-[10px] font-bold text-primary">18 sec</Text>
            </View>
          </View>
        </View>

        {/* 5-step path pills */}
        <View className="flex-row gap-1 justify-between mb-3">
          {steps.map((st, idx) => {
            const active = idx === currentStep;
            return (
              <TouchableOpacity
                key={st.step}
                onPress={() => setCurrentStep(idx)}
                className={`flex-1 p-2 rounded-lg items-center ${
                  active ? 'bg-primary-container' : 'bg-surface-container'
                } active:scale-95`}>
                <MaterialIcons
                  name={st.icon}
                  size={16}
                  color={active ? '#ffffff' : '#584237'}
                />
                <Text
                  className={`text-[9px] uppercase font-bold mt-0.5 ${
                    active ? 'text-on-primary' : 'text-on-surface-variant'
                  }`}>
                  {st.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer Controls */}
      <View className="flex-row items-center gap-2 pt-2 border-t border-surface-container-highest">
        <TouchableOpacity
          onPress={handlePrev}
          disabled={currentStep === 0}
          className={`flex-1 min-h-[48px] rounded-xl bg-surface-container flex-row items-center justify-center ${
            currentStep === 0 ? 'opacity-40' : 'active:scale-95'
          }`}>
          <MaterialIcons name="arrow-back" size={16} color="#221a0e" />
          <Text className="text-xs font-bold text-on-surface ml-1">Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          className="flex-[2] min-h-[48px] rounded-xl bg-primary-container flex-row items-center justify-center shadow-md active:scale-95">
          <Text className="text-xs font-bold text-on-primary mr-1">
            {currentStep === steps.length - 1 ? 'Start Using Sakhi' : 'Next Step'}
          </Text>
          <MaterialIcons name="arrow-forward" size={16} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
