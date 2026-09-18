import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { audioPlayer } from '@/services/audioPlayer';

// Statically analyzable pre-bundled MP3 assets for 100% offline playback
const LANDING_AUDIO = {
  en: require('@/assets/audio/landing-en.mp3'),
  hi: require('@/assets/audio/landing-hi.mp3'),
  te: require('@/assets/audio/landing-te.mp3'),
} as const;

export default function SplashScreen() {
  const router = useRouter();
  const { language, setLanguage } = useApp();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  useEffect(() => {
    const unsubscribe = audioPlayer.subscribe((event) => {
      if (event.currentId === 'splash-greeting') {
        setIsPlayingAudio(event.state === 'playing');
        setIsLoadingAudio(event.state === 'loading');
      } else {
        setIsPlayingAudio(false);
        setIsLoadingAudio(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLanguageChange = (newLang: 'te' | 'hi' | 'en') => {
    if (isPlayingAudio) {
      audioPlayer.stop();
    }
    setLanguage(newLang);
  };

  // Play pre-bundled static MP3 asset with 0 network calls directly on user tap
  const handlePlayGreeting = useCallback(async () => {
    if (__DEV__) {
      console.log('[LandingVoice] button pressed');
      console.log(`[LandingVoice] platform=${Platform.OS}`);
    }
    if (isPlayingAudio) {
      if (__DEV__) console.log('[LandingVoice] stopping current playback');
      audioPlayer.stop();
      return;
    }

    const activeLang = (language || 'te') as 'en' | 'hi' | 'te';
    if (__DEV__) console.log(`[LandingVoice] language=${activeLang}`);

    const audioAsset = LANDING_AUDIO[activeLang] || LANDING_AUDIO.te;

    try {
      setIsLoadingAudio(true);
      if (__DEV__) console.log('[LandingVoice] loading audio via audioPlayer.playAsset...');
      await audioPlayer.playAsset(audioAsset, 'splash-greeting');
      if (__DEV__) console.log('[LandingVoice] loaded successfully, playback initiated');
    } catch (err: any) {
      if (__DEV__) console.error('[LandingVoice] ERROR:', err?.message || err);
      setIsLoadingAudio(false);
    }
  }, [isPlayingAudio, language]);

  return (
    <SafeAreaView className="flex-1 bg-surface justify-between px-4 py-3" edges={['top', 'bottom']}>
      {/* Top Bar */}
      <View className="flex-row items-center justify-between">
        <Image
          source={require('@/assets/images/app-logo.png')}
          style={{ width: 36, height: 36 }}
          resizeMode="contain"
          accessibilityLabel="Sakhi Logo"
        />

        {/* Language Switcher */}
        <View className="flex-row items-center bg-surface-container-low p-0.5 rounded-lg border border-surface-container-highest/60">
          <TouchableOpacity
            onPress={() => handleLanguageChange('te')}
            className={`px-2.5 py-1 rounded-md ${language === 'te' ? 'bg-primary' : 'bg-transparent'}`}>
            <Text className={`text-[11px] font-bold ${language === 'te' ? 'text-white' : 'text-on-surface'}`}>
              తెలుగు
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleLanguageChange('hi')}
            className={`px-2.5 py-1 rounded-md ${language === 'hi' ? 'bg-primary' : 'bg-transparent'}`}>
            <Text className={`text-[11px] font-bold ${language === 'hi' ? 'text-white' : 'text-on-surface'}`}>
              हिंदी
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleLanguageChange('en')}
            className={`px-2.5 py-1 rounded-md ${language === 'en' ? 'bg-primary' : 'bg-transparent'}`}>
            <Text className={`text-[11px] font-bold ${language === 'en' ? 'text-white' : 'text-on-surface'}`}>
              EN
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1 my-auto"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ justifyContent: 'center', paddingVertical: 10 }}>
        {/* Main Hero Card */}
        <View className="items-center text-center">
          {/* Logo */}
          <View className="relative mb-3.5">
            <View className="w-24 h-24 rounded-2xl bg-surface-container-lowest items-center justify-center shadow-md p-2 border border-surface-container-highest/60">
              <Image
                source={require('@/assets/images/app-logo.png')}
                style={{ width: 72, height: 72 }}
                resizeMode="contain"
                accessibilityLabel="Sakhi Logo"
              />
            </View>
            <View className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1 shadow-xs">
              <MaterialIcons name="verified" size={16} color="#ffffff" />
            </View>
          </View>

          {/* Product Badge */}
          <View className="flex-row items-center bg-surface-container-high px-3 py-1 rounded-full mb-2.5 shadow-xs">
            <MaterialIcons name="diversity-1" size={14} color="#9d4300" />
            <Text className="text-xs font-bold text-primary ml-1.5">
              Sakhi Financial Companion
            </Text>
          </View>

          {/* Headline */}
          <Text className="text-2xl font-bold text-on-surface text-center mb-1">
            {language === 'te' ? 'నమస్తే 👋 సఖికి స్వాగతం' : language === 'hi' ? 'नमस्ते 👋 सखी में स्वागत है' : 'Namaste 👋 Welcome to Sakhi'}
          </Text>

          {/* Sub-caption */}
          <Text className="text-xs text-on-surface-variant text-center max-w-xs mb-6 px-2 leading-relaxed">
            {language === 'te'
              ? 'నమ్మకమైన వాయిస్ ఆర్థిక సహాయకురాలు.'
              : language === 'hi'
              ? 'विश्वसनीय वॉयस वित्तीय साथी।'
              : 'Voice-first financial companion.'}
          </Text>

          {/* 2 Main Entry Action Options */}
          <View className="w-full gap-3 max-w-sm">
            {/* 1. Sign In (Existing Member) */}
            <TouchableOpacity
              onPress={() => router.push('/signin' as any)}
              className="w-full bg-primary py-3.5 px-6 rounded-xl flex-row items-center justify-center shadow-md active:scale-[0.98]">
              <MaterialIcons name="login" size={18} color="#ffffff" className="mr-2" />
              <Text className="text-sm font-bold text-white">
                {language === 'te' ? 'ఖాతాలోకి లాగిన్ అవ్వండి (Sign In)' : language === 'hi' ? 'खाते में साइन इन करें (Sign In)' : 'Sign In to Account'}
              </Text>
              <MaterialIcons name="arrow-forward" size={18} color="#ffffff" className="ml-1" />
            </TouchableOpacity>

            {/* 2. Sign Up (New Registration) */}
            <TouchableOpacity
              onPress={() => router.push('/onboarding' as any)}
              className="w-full bg-primary-container py-3.5 px-6 rounded-xl flex-row items-center justify-center shadow-sm active:scale-[0.98]">
              <MaterialIcons name="person-add" size={18} color="#ffffff" className="mr-2" />
              <Text className="text-sm font-bold text-on-primary">
                {language === 'te' ? 'కొత్త సభ్యురాలి నమోదు (Sign Up)' : language === 'hi' ? 'नए सदस्य का पंजीकरण (Sign Up)' : 'New Member Registration'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Voice Guidance Bar */}
      <TouchableOpacity
        onPress={handlePlayGreeting}
        disabled={isLoadingAudio}
        activeOpacity={0.8}
        className="w-full bg-surface-container-low rounded-xl p-3 shadow-xs flex-row items-center border border-surface-container-highest/60">
        <View className="w-9 h-9 rounded-lg bg-surface-container-highest items-center justify-center mr-2.5">
          <MaterialIcons name="volume-up" size={18} color="#b3291b" />
        </View>
        <View className="flex-col flex-1 min-w-0">
          <Text className="text-xs font-bold text-on-surface leading-tight">
            {isPlayingAudio
              ? (language === 'te' ? 'వాయిస్ ప్లే అవుతోంది...' : language === 'hi' ? 'ऑडियो चल रहा है...' : 'Playing Voice Greeting...')
              : (language === 'te' ? 'వాయిస్ సహాయం సిద్ధంగా ఉంది' : language === 'hi' ? 'वॉयस सहायता तैयार है' : 'Voice Guidance Ready')}
          </Text>
          <Text className="text-[10px] text-on-surface-variant truncate">
            {isPlayingAudio
              ? (language === 'te' ? 'ఆపడానికి నొక్కండి' : language === 'hi' ? 'रोकने के लिए दबाएं' : 'Tap to stop audio')
              : (language === 'te' ? 'వినడానికి నొక్కండి' : language === 'hi' ? 'सुनने के लिए टैप करें' : 'Tap to listen to audio greeting')}
          </Text>
        </View>
        <View className="w-9 h-9 rounded-lg bg-surface-container-highest items-center justify-center">
          {isLoadingAudio ? (
            <ActivityIndicator size="small" color="#9d4300" />
          ) : (
            <MaterialIcons name={isPlayingAudio ? 'stop' : 'play-arrow'} size={20} color="#9d4300" />
          )}
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
