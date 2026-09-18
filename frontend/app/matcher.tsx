import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { voiceService } from '@/services/voiceService';
import { audioPlayer } from '@/services/audioPlayer';

export default function MatcherScreen() {
  const router = useRouter();
  const { currentUser, matchedSchemes, updateUserPreferences, refreshMatchedSchemes, language } = useApp();
  const [step, setStep] = useState(1);
  const [selectedOccupation, setSelectedOccupation] = useState('Tailoring');
  const [selectedState, setSelectedState] = useState('Telangana');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const audioTrackId = `matcher-page-step-${step}`;

  useEffect(() => {
    const unsubscribe = audioPlayer.subscribe((event) => {
      if (event.currentId === audioTrackId) {
        setIsPlayingAudio(event.state === 'playing');
        setIsLoadingAudio(event.state === 'loading');
      } else {
        setIsPlayingAudio(false);
        setIsLoadingAudio(false);
      }
    });
    return () => unsubscribe();
  }, [audioTrackId]);

  const handleToggleAudio = async () => {
    if (isPlayingAudio) {
      audioPlayer.stop();
      return;
    }
    try {
      setIsLoadingAudio(true);
      const lang = language || 'te';
      let narrationText = '';
      if (step === 1) {
        if (lang === 'te') {
          narrationText = 'నమస్తే అక్క. మొదటి ప్రశ్న: మీ కుటుంబ ప్రధాన ఆదాయ వనరు లేదా జీవనోపాధి ఏమిటి? మీ వృత్తిని ఎంచుకోండి.';
        } else if (lang === 'hi') {
          narrationText = 'नमस्ते दीदी। पहला प्रश्न: आपके परिवार की मुख्य आजीविका का साधन क्या है? अपना व्यवसाय चुनें।';
        } else {
          narrationText = 'Namaste Sister. Step 1: What is the primary livelihood or source of income for your household? Please select your occupation.';
        }
      } else {
        if (lang === 'te') {
          narrationText = 'రెండవ ప్రశ్న: మీరు ఎక్కడ నివసిస్తున్నారు మరియు పని చేస్తున్నారు? మీ రాష్ట్రాన్ని ఎంచుకోండి.';
        } else if (lang === 'hi') {
          narrationText = 'दूसरा प्रश्न: आप कहाँ रहती हैं और काम करती हैं? अपना राज्य चुनें।';
        } else {
          narrationText = 'Step 2: Where do you live and work? Please select your state.';
        }
      }

      const res = await voiceService.synthesizeSpeech({
        text: narrationText,
        language: lang,
        speed: 1.0,
        audio_format: 'mp3',
      });

      await audioPlayer.playBase64(res.audio_base64, 'mp3', audioTrackId);
    } catch (err) {
      if (__DEV__) console.warn('[MatcherScreen] Failed to play audio:', err);
      setIsLoadingAudio(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      if (currentUser.occupation) {
        setSelectedOccupation(currentUser.occupation);
      }
      if (currentUser.state) {
        setSelectedState(currentUser.state);
      }
    }
  }, [currentUser]);

  const occupations = [
    {
      id: 'Tailoring',
      title: 'Tailoring, Handloom & Garments',
      icon: 'checkroom' as const,
    },
    {
      id: 'Dairy',
      title: 'Dairy, Goat Rearing or Livestock',
      icon: 'pets' as const,
    },
    {
      id: 'Kirana Store',
      title: 'Small Kirana Store or Petty Trade',
      icon: 'storefront' as const,
    },
    {
      id: 'Farming',
      title: 'Farming or Agriculture Labor',
      icon: 'agriculture' as const,
    },
    {
      id: 'Artisan',
      title: 'Other artisan / home-based work',
      icon: 'palette' as const,
    },
  ];

  const states = [
    {
      id: 'Telangana',
      name: 'Telangana',
      sub: '(తెలంగాణ)',
      tag: 'SERP & Stree Nidhi Active',
    },
    {
      id: 'Andhra Pradesh',
      name: 'Andhra Pradesh',
      sub: '(ఆంధ్రప్రదేశ్)',
      tag: 'YSR Aasara & Sunna Vaddi',
    },
    {
      id: 'Maharashtra',
      name: 'Maharashtra',
      sub: '(महाराष्ट्र)',
      tag: 'MAVIM & MSRLM',
    },
    {
      id: 'Other',
      name: 'Other Indian State',
      sub: '(All India)',
      tag: 'DAY-NRLM Central Focus',
    },
  ];

  const handleNext = async () => {
    if (step === 1) {
      setStep(2);
    } else {
      try {
        setIsSubmitting(true);
        await updateUserPreferences({
          occupation: selectedOccupation,
          state: selectedState === 'Other' ? 'Telangana' : selectedState,
        });
        await refreshMatchedSchemes();
      } catch (err) {
        if (__DEV__) console.warn('[MatcherScreen] Error saving preferences:', err);
      } finally {
        setIsSubmitting(false);
        router.replace('/(tabs)/benefits');
      }
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const matchedCount = matchedSchemes.length > 0 ? matchedSchemes.length : 4;

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
            onPress={handleToggleAudio}
            disabled={isLoadingAudio}
            className="h-8 px-3 rounded-full bg-surface-container-highest flex-row items-center active:scale-95">
            {isLoadingAudio ? (
              <ActivityIndicator size="small" color="#9d4300" style={{ marginRight: 4 }} />
            ) : (
              <MaterialIcons name={isPlayingAudio ? 'pause' : 'volume-up'} size={15} color="#9d4300" />
            )}
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
                const isSelected = selectedOccupation.toLowerCase() === occ.id.toLowerCase();
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
                          Verified Programs Available
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
                const isSelected = selectedState.toLowerCase() === st.id.toLowerCase();
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
                        </View>
                      </View>
                    </View>
                    {currentUser?.state?.toLowerCase() === st.id.toLowerCase() && (
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
              <Text className="text-xs font-bold text-on-surface">{matchedCount} Schemes Evaluated</Text>
              <Text className="text-[10px] text-on-surface-variant">Deterministic FastAPI Match Engine</Text>
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
          disabled={isSubmitting}
          className="flex-[1.8] h-11 rounded-xl bg-primary-container flex-row items-center justify-center active:scale-95 shadow-md">
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <Text className="text-xs font-bold text-on-primary mr-1">
                {step === 1 ? 'Next: Location (2/2)' : 'View Matched Schemes'}
              </Text>
              <MaterialIcons name="arrow-forward" size={16} color="#ffffff" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
