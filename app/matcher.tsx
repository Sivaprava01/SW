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

export default function MatcherScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedOccupation, setSelectedOccupation] = useState('tailoring');
  const [selectedState, setSelectedState] = useState('Telangana');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const occupations = [
    {
      id: 'tailoring',
      title: 'Tailoring, Handloom & Garments',
      icon: 'checkroom' as const,
      schemesCount: 4,
    },
    {
      id: 'dairy',
      title: 'Dairy, Goat Rearing or Livestock',
      icon: 'pets' as const,
      schemesCount: 2,
    },
    {
      id: 'kirana',
      title: 'Small Kirana Store or Petty Trade',
      icon: 'storefront' as const,
      schemesCount: 3,
    },
    {
      id: 'farming',
      title: 'Farming or Agriculture Labor',
      icon: 'agriculture' as const,
      schemesCount: 5,
    },
    {
      id: 'artisan',
      title: 'Other artisan / home-based work',
      icon: 'palette' as const,
      schemesCount: 2,
    },
  ];

  const states = [
    {
      id: 'Telangana',
      name: 'Telangana',
      sub: '(తెలంగాణ)',
      tag: 'SERP & Stree Nidhi Active',
      schemes: '4 Matching Schemes',
      current: true,
    },
    {
      id: 'Andhra Pradesh',
      name: 'Andhra Pradesh',
      sub: '(ఆంధ్రప్రదేశ్)',
      tag: 'YSR Aasara & Sunna Vaddi',
      schemes: '3 Matching Schemes',
    },
    {
      id: 'Maharashtra',
      name: 'Maharashtra',
      sub: '(महाराष्ट्र)',
      tag: 'MAVIM & MSRLM',
      schemes: '2 Matching Schemes',
    },
    {
      id: 'Other',
      name: 'Other Indian State',
      sub: '(All India)',
      tag: 'DAY-NRLM Central Focus',
      schemes: '3 Matching Schemes',
    },
  ];

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      router.replace('/(tabs)/benefits');
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface justify-between" edges={['top', 'bottom']}>
      {/* Top Header Card */}
      <View className="bg-surface-container px-4 py-3 border-b border-surface-container-highest shadow-sm">
        <View className="flex-row items-center justify-between mb-1">
          <View className="flex-row items-center">
            <View className="w-2.5 h-2.5 rounded-full bg-primary-container mr-1.5" />
            <Text className="text-[11px] font-bold text-primary uppercase tracking-wider">
              Government Scheme Matcher
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-8 h-8 rounded-full bg-surface-container-high items-center justify-center active:scale-90">
            <MaterialIcons name="close" size={18} color="#221a0e" />
          </TouchableOpacity>
        </View>

        <Text className="text-base font-bold text-on-surface">Preliminary Eligibility Check</Text>

        {/* Progress Tracker */}
        <View className="mt-2">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-xs font-bold text-on-surface">Step {step} of 2</Text>
            <Text className="text-xs font-bold text-primary">{step === 1 ? '50%' : '100%'} Complete</Text>
          </View>
          <View className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
            <View
              className="bg-primary-container h-full rounded-full"
              style={{ width: step === 1 ? '50%' : '100%' }}
            />
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-3" contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Audio Assistance Bar */}
        <View className="bg-surface-container-low rounded-xl p-2.5 mb-3 flex-row items-center justify-between border border-surface-container-highest/60">
          <View className="flex-row items-center flex-1 mr-2">
            <View className="w-9 h-9 rounded-full bg-primary items-center justify-center mr-2 shadow-xs">
              <MaterialIcons name="record-voice-over" size={18} color="#ffffff" />
            </View>
            <View className="flex-col flex-1">
              <Text className="text-[10px] uppercase font-bold text-on-surface-variant">వాయిస్ సహాయం</Text>
              <Text className="text-xs font-bold text-on-surface truncate">
                Listen in Telugu / Hindi
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setIsPlayingAudio(!isPlayingAudio)}
            className="h-8 px-3 rounded-full bg-surface-container-highest flex-row items-center active:scale-95">
            <MaterialIcons name={isPlayingAudio ? 'pause' : 'volume-up'} size={15} color="#9d4300" />
            <Text className="text-xs font-bold text-primary ml-1">{isPlayingAudio ? 'Pause' : 'Play'}</Text>
          </TouchableOpacity>
        </View>

        {step === 1 ? (
          /* Question 1: Livelihood */
          <View>
            <View className="mb-3">
              <Text className="text-[11px] font-bold text-primary uppercase tracking-wider mb-0.5">
                PRIMARY OCCUPATION
              </Text>
              <Text className="text-lg font-bold text-on-surface leading-snug">
                What is your main source of household income?
              </Text>
            </View>

            <View className="flex-col gap-2 mb-4">
              {occupations.map((occ) => {
                const isSelected = selectedOccupation === occ.id;
                return (
                  <TouchableOpacity
                    key={occ.id}
                    onPress={() => setSelectedOccupation(occ.id)}
                    className={`p-3.5 rounded-2xl flex-row items-center justify-between ${
                      isSelected
                        ? 'bg-surface-container border border-primary-container'
                        : 'bg-surface-container-low border border-surface-container-highest/60'
                    } active:scale-[0.99]`}>
                    <View className="flex-row items-center flex-1 mr-2">
                      <View
                        className={`w-11 h-11 rounded-xl items-center justify-center mr-3 ${
                          isSelected
                            ? 'bg-primary-container text-on-primary'
                            : 'bg-surface-container-high'
                        }`}>
                        <MaterialIcons
                          name={occ.icon}
                          size={22}
                          color={isSelected ? '#ffffff' : '#221a0e'}
                        />
                      </View>
                      <View className="flex-col flex-1">
                        <Text className="text-sm font-bold text-on-surface leading-tight">
                          {occ.title}
                        </Text>
                        <Text className="text-[11px] text-on-surface-variant mt-0.5">
                          {occ.schemesCount} Schemes Available
                        </Text>
                      </View>
                    </View>
                    <View
                      className={`w-6 h-6 rounded-full items-center justify-center ${
                        isSelected ? 'bg-primary-container' : 'bg-surface-container-high'
                      }`}>
                      {isSelected && <MaterialIcons name="check" size={14} color="#ffffff" />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : (
          /* Question 2: Location */
          <View>
            <View className="mb-3">
              <Text className="text-[11px] font-bold text-primary uppercase tracking-wider mb-0.5">
                LOCATION & REGIONAL BENEFITS
              </Text>
              <Text className="text-lg font-bold text-on-surface leading-snug">
                Where do you live and do your work?
              </Text>
            </View>

            <View className="flex-col gap-2 mb-4">
              {states.map((st) => {
                const isSelected = selectedState === st.id;
                return (
                  <TouchableOpacity
                    key={st.id}
                    onPress={() => setSelectedState(st.id)}
                    className={`p-3.5 rounded-2xl flex-row items-start justify-between ${
                      isSelected
                        ? 'bg-surface-container border border-primary-container'
                        : 'bg-surface-container-low border border-surface-container-highest/60'
                    } active:scale-[0.99]`}>
                    <View className="flex-row items-start flex-1 mr-2">
                      <View
                        className={`w-9 h-9 rounded-full items-center justify-center mr-2.5 mt-0.5 ${
                          isSelected ? 'bg-primary-container' : 'bg-surface-container-high'
                        }`}>
                        {isSelected ? (
                          <MaterialIcons name="check" size={18} color="#ffffff" />
                        ) : (
                          <MaterialIcons name="location-on" size={18} color="#584237" />
                        )}
                      </View>
                      <View className="flex-col flex-1">
                        <View className="flex-row items-center flex-wrap">
                          <Text className="text-sm font-bold text-on-surface">{st.name}</Text>
                          <Text className="text-xs text-on-surface-variant ml-1">{st.sub}</Text>
                        </View>
                        <View className="flex-row flex-wrap gap-1 mt-1">
                          <View className="bg-primary-container/20 px-2 py-0.5 rounded-full">
                            <Text className="text-[10px] font-bold text-primary">{st.tag}</Text>
                          </View>
                          <View className="bg-surface-container px-2 py-0.5 rounded-full">
                            <Text className="text-[10px] font-semibold text-on-surface-variant">
                              {st.schemes}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    {st.current && (
                      <Text className="text-[10px] font-bold text-primary">Current</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Real-time Match Indicator */}
        <View className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-sm mb-4 flex-row items-center justify-between border border-surface-container-highest/60">
          <View className="flex-row items-center flex-1 mr-2">
            <View className="w-9 h-9 rounded-full bg-secondary-fixed items-center justify-center mr-2.5">
              <MaterialIcons name="account-balance" size={18} color="#410000" />
            </View>
            <View className="flex-col">
              <Text className="text-xs font-bold text-on-surface">4 schemes Found</Text>
              <Text className="text-[10px] text-on-surface-variant">Estimated assistance: ₹1.85 Lakh</Text>
            </View>
          </View>
          <View className="bg-surface-container px-2 py-0.5 rounded-full">
            <Text className="text-[10px] font-semibold text-primary">Real-time update</Text>
          </View>
        </View>
      </ScrollView>

      {/* Wizard Bottom Controls */}
      <View className="px-4 py-3 bg-surface border-t border-surface-container-highest flex-row items-center gap-2">
        <TouchableOpacity
          onPress={handlePrev}
          className="flex-1 h-11 rounded-xl bg-surface-container-high flex-row items-center justify-center active:scale-95">
          <MaterialIcons name="arrow-back" size={16} color="#221a0e" />
          <Text className="text-xs font-bold text-on-surface ml-1">
            {step === 1 ? 'Cancel' : 'Previous'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          className="flex-[1.8] h-11 rounded-xl bg-primary-container flex-row items-center justify-center active:scale-95 shadow-md">
          <Text className="text-xs font-bold text-on-primary mr-1">
            {step === 1 ? 'Next: Location (2/2)' : 'View Matched Schemes'}
          </Text>
          <MaterialIcons name="arrow-forward" size={16} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
