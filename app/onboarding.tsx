import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function OnboardingScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('Lakshmi Devi');
  const [age, setAge] = useState('28');
  const [state, setState] = useState('Telangana');
  const [isSHG, setIsSHG] = useState(true);
  const [isRural, setIsRural] = useState(true);

  const handleExploreAsLakshmi = () => {
    setFullName('Lakshmi Devi');
    setAge('28');
    setState('Telangana');
    setIsSHG(true);
    setIsRural(true);
  };

  const handleNext = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      {/* Top Accent Bar */}
      <View className="w-full h-1 bg-primary-container" />

      <ScrollView className="flex-1 px-4 py-3" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Mascot & Greeting Card */}
        <View className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-surface-container-highest/60 mb-3.5 flex-col gap-3">
          <View className="flex-row items-center gap-3">
            <View className="w-12 h-12 rounded-full bg-primary-container items-center justify-center shadow-sm">
              <Text className="text-2xl font-bold text-on-primary">स</Text>
            </View>
            <View className="flex-col flex-1 min-w-0">
              <Text className="text-base font-bold text-on-surface">
                Welcome to Sakhi <Text className="text-primary font-bold">(सखी)</Text>
              </Text>
              <Text className="text-xs text-on-surface-variant">
                Let's set up your profile in 3 simple steps
              </Text>
            </View>
          </View>

          {/* Quick Action Demo Auto-Fill */}
          <View className="bg-surface-container-low rounded-lg p-2.5 flex-row items-center justify-between border border-surface-container-highest/40">
            <View className="flex-row items-center flex-1 mr-2">
              <Text className="text-sm mr-1.5">⚡</Text>
              <Text className="text-xs font-semibold text-on-surface">Instant guided preview</Text>
            </View>
            <TouchableOpacity
              onPress={handleExploreAsLakshmi}
              className="bg-secondary px-3 py-1.5 rounded-lg flex-row items-center shadow-xs active:scale-95">
              <Text className="text-xs font-bold text-on-secondary mr-1">Explore as Lakshmi</Text>
              <MaterialIcons name="auto-fix-high" size={14} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stepper Indicator */}
        <View className="bg-surface-container-lowest rounded-xl p-3 shadow-xs border border-surface-container-highest/60 mb-3.5 flex-row justify-between">
          {/* Step 1 */}
          <View className="flex-1 items-center px-1">
            <View className="w-full h-1 rounded-full bg-primary-container mb-1.5" />
            <Text className="text-[11px] font-bold text-primary">1. Personal</Text>
          </View>
          {/* Step 2 */}
          <View className="flex-1 items-center px-1 opacity-60">
            <View className="w-full h-1 rounded-full bg-surface-container-high mb-1.5" />
            <Text className="text-[11px] font-medium text-on-surface-variant">2. Cashflow</Text>
          </View>
          {/* Step 3 */}
          <View className="flex-1 items-center px-1 opacity-60">
            <View className="w-full h-1 rounded-full bg-surface-container-high mb-1.5" />
            <Text className="text-[11px] font-medium text-on-surface-variant">3. First Dream</Text>
          </View>
        </View>

        {/* Form Fields */}
        <View className="flex-col gap-3 mb-4">
          {/* Full Name */}
          <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container-highest/60">
            <Text className="text-xs font-bold text-on-surface mb-1.5">Full Name</Text>
            <View className="flex-row items-center bg-surface-container-low rounded-lg px-3 py-2 border border-surface-container-highest/60">
              <MaterialIcons name="person" size={18} color="#8c7164" />
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="e.g. Lakshmi Devi"
                placeholderTextColor="#8c7164"
                className="flex-1 ml-2 text-xs font-semibold text-on-surface"
              />
            </View>
          </View>

          {/* Age Input */}
          <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container-highest/60">
            <View className="flex-row items-center justify-between mb-1.5">
              <Text className="text-xs font-bold text-on-surface">Age in Years</Text>
              <Text className="text-xs font-bold text-primary">{age} yrs</Text>
            </View>
            <View className="flex-row items-center bg-surface-container-low rounded-lg px-3 py-2 border border-surface-container-highest/60">
              <TextInput
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                className="flex-1 text-xs font-semibold text-on-surface"
              />
            </View>
          </View>

          {/* Operating State */}
          <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container-highest/60">
            <Text className="text-xs font-bold text-on-surface mb-1.5">Operating State</Text>
            <View className="bg-surface-container-low rounded-lg p-2.5 flex-row items-center justify-between border border-surface-container-highest/60">
              <View className="flex-row items-center">
                <MaterialIcons name="location-on" size={18} color="#b3291b" />
                <Text className="text-xs font-bold text-on-surface ml-1.5">{state} (తెలంగాణ)</Text>
              </View>
              <View className="bg-primary-fixed px-2 py-0.5 rounded-full">
                <Text className="text-[10px] font-bold text-primary-on-fixed">SERP Linked</Text>
              </View>
            </View>
          </View>

          {/* SHG Member Toggle */}
          <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container-highest/60">
            <Text className="text-xs font-bold text-on-surface mb-2">
              Are you a member of a Self-Help Group (SHG)?
            </Text>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setIsSHG(true)}
                className={`flex-1 p-2.5 rounded-xl border flex-row items-center justify-between ${
                  isSHG
                    ? 'bg-surface-container border-primary-container'
                    : 'bg-surface-container-low border-surface-container-highest/60'
                } active:scale-95`}>
                <Text className="text-xs font-bold text-on-surface">Yes, member</Text>
                {isSHG && <MaterialIcons name="check-circle" size={16} color="#9d4300" />}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsSHG(false)}
                className={`flex-1 p-2.5 rounded-xl border flex-row items-center justify-between ${
                  !isSHG
                    ? 'bg-surface-container border-primary-container'
                    : 'bg-surface-container-low border-surface-container-highest/60'
                } active:scale-95`}>
                <Text className="text-xs font-bold text-on-surface">Independent</Text>
                {!isSHG && <MaterialIcons name="check-circle" size={16} color="#9d4300" />}
              </TouchableOpacity>
            </View>
          </View>

          {/* Location */}
          <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container-highest/60">
            <Text className="text-xs font-bold text-on-surface mb-2">Where is your family home located?</Text>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setIsRural(true)}
                className={`flex-1 p-2.5 rounded-xl border flex-row items-center justify-between ${
                  isRural
                    ? 'bg-surface-container border-primary-container'
                    : 'bg-surface-container-low border-surface-container-highest/60'
                } active:scale-95`}>
                <Text className="text-xs font-bold text-on-surface">Rural village</Text>
                {isRural && <MaterialIcons name="check-circle" size={16} color="#9d4300" />}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsRural(false)}
                className={`flex-1 p-2.5 rounded-xl border flex-row items-center justify-between ${
                  !isRural
                    ? 'bg-surface-container border-primary-container'
                    : 'bg-surface-container-low border-surface-container-highest/60'
                } active:scale-95`}>
                <Text className="text-xs font-bold text-on-surface">Urban town</Text>
                {!isRural && <MaterialIcons name="check-circle" size={16} color="#9d4300" />}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Primary CTA */}
        <TouchableOpacity
          onPress={handleNext}
          className="w-full min-h-[50px] bg-primary-container rounded-xl flex-row items-center justify-center shadow-md active:scale-[0.98] mb-3">
          <Text className="text-sm font-bold text-on-primary mr-1.5">Next Step: Income & Cashflow</Text>
          <MaterialIcons name="arrow-forward" size={18} color="#ffffff" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
