import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { authService } from '@/services/authService';

export default function SignInScreen() {
  const router = useRouter();
  const { loginUser, language, setLanguage } = useApp();

  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSignIn = async () => {
    const cleanMobile = mobileNumber.trim();
    const cleanPassword = password.trim();

    if (!cleanMobile) {
      setAuthError(
        language === 'te'
          ? 'దయచేసి మీ 10-అంకెల మొబైల్ నంబర్‌ను నమోదు చేయండి'
          : language === 'hi'
          ? 'कृपया अपना 10 अंकों का मोबाइल नंबर दर्ज करें'
          : 'Please enter your 10-digit mobile number'
      );
      return;
    }

    if (cleanMobile.length < 10) {
      setAuthError(
        language === 'te'
          ? 'దయచేసి సరైన 10-అంకెల మొబైల్ నంబర్‌ను నమోదు చేయండి'
          : language === 'hi'
          ? 'कृपया एक वैध 10 अंकों का मोबाइल नंबर दर्ज करें'
          : 'Please enter a valid 10-digit mobile number'
      );
      return;
    }

    if (!cleanPassword) {
      setAuthError(
        language === 'te'
          ? 'దయచేసి మీ పాస్‌వర్డ్‌ను నమోదు చేయండి'
          : language === 'hi'
          ? 'कृपया अपना पासवर्ड दर्ज करें'
          : 'Please enter your password'
      );
      return;
    }

    setIsSubmitting(true);
    setAuthError(null);

    try {
      const response = await authService.login({
        mobile: cleanMobile,
        password: cleanPassword,
      });

      if (response?.user) {
        await loginUser(response.user);
        router.replace('/(tabs)');
      } else {
        throw new Error('Authentication succeeded but user profile was not returned.');
      }
    } catch (err: any) {
      const genericError =
        language === 'te'
          ? 'చెల్లని మొబైల్ నంబర్ లేదా పాస్‌వర్డ్. దయచేసి మళ్లీ ప్రయత్నించండి.'
          : language === 'hi'
          ? 'अमान्य मोबाइल नंबर या पासवर्ड। कृपया पुनः प्रयास करें।'
          : 'Invalid mobile number or password. Please try again.';
      setAuthError(err?.message && !err.message.includes('401') ? err.message : genericError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      {/* Top Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-surface-container-highest/60 bg-surface">
        <TouchableOpacity
          onPress={() => router.replace('/splash' as any)}
          className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center active:scale-95"
          accessibilityLabel="Go back">
          <MaterialIcons name="arrow-back" size={22} color="#9d4300" />
        </TouchableOpacity>

        <View className="flex-row items-center bg-surface-container-high px-3 py-1 rounded-full">
          <MaterialIcons name="lock" size={14} color="#9d4300" />
          <Text className="text-xs font-bold text-primary ml-1">
            {language === 'te' ? 'సభ్యురాలి లాగిన్' : language === 'hi' ? 'सदस्य साइन इन' : 'Member Sign In'}
          </Text>
        </View>

        <View className="flex-row items-center gap-1">
          <TouchableOpacity
            onPress={() => setLanguage('te')}
            className={`px-2 py-1 rounded ${language === 'te' ? 'bg-primary' : 'bg-surface-container-high'}`}>
            <Text className={`text-[10px] font-bold ${language === 'te' ? 'text-white' : 'text-on-surface'}`}>
              తెలుగు
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setLanguage('hi')}
            className={`px-2 py-1 rounded ${language === 'hi' ? 'bg-primary' : 'bg-surface-container-high'}`}>
            <Text className={`text-[10px] font-bold ${language === 'hi' ? 'text-white' : 'text-on-surface'}`}>
              हिंदी
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setLanguage('en')}
            className={`px-2 py-1 rounded ${language === 'en' ? 'bg-primary' : 'bg-surface-container-high'}`}>
            <Text className={`text-[10px] font-bold ${language === 'en' ? 'text-white' : 'text-on-surface'}`}>
              EN
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-4" contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        {/* Mascot & Greeting */}
        <View className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-surface-container-highest/60 mb-5 flex-row items-center gap-3.5">
          <View className="w-14 h-14 rounded-2xl bg-primary-container items-center justify-center shadow-sm">
            <Text className="text-2xl font-bold text-on-primary">स</Text>
          </View>
          <View className="flex-1 min-w-0">
            <Text className="text-lg font-bold text-on-surface">
              {language === 'te' ? 'తిరిగి స్వాగతం 👋' : language === 'hi' ? 'वापसी पर स्वागत है 👋' : 'Welcome Back 👋'}
            </Text>
            <Text className="text-xs text-on-surface-variant leading-relaxed">
              {language === 'te'
                ? 'మీ ఖాతాలోకి ప్రవేశించడానికి మీ మొబైల్ నంబర్ మరియు పాస్‌వర్డ్‌ను నమోదు చేయండి.'
                : language === 'hi'
                ? 'अपने खाते में प्रवेश करने के लिए अपना मोबाइल नंबर और पासवर्ड दर्ज करें।'
                : 'Sign in with your registered mobile number and password.'}
            </Text>
          </View>
        </View>

        {/* Authentication Form Card */}
        <View className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-surface-container-highest/60 mb-5">
          {/* Mobile Number Field */}
          <View className="mb-4">
            <Text className="text-xs font-bold text-on-surface mb-1.5">
              {language === 'te' ? 'మొబైల్ నంబర్' : language === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'}
            </Text>
            <View className="flex-row items-center bg-surface-container-low rounded-xl px-3 py-2.5 border border-surface-container-highest/80">
              <MaterialIcons name="phone" size={18} color="#9d4300" className="mr-2" />
              <Text className="text-xs font-bold text-on-surface-variant mr-1.5">+91</Text>
              <TextInput
                placeholder="98765 43210"
                placeholderTextColor="#8c7164"
                keyboardType="phone-pad"
                maxLength={10}
                value={mobileNumber}
                onChangeText={(text) => {
                  setMobileNumber(text.replace(/[^0-9]/g, ''));
                  if (authError) setAuthError(null);
                }}
                className="flex-1 text-sm font-semibold text-on-surface py-0.5"
                autoComplete="tel"
              />
              {mobileNumber.length > 0 && (
                <TouchableOpacity onPress={() => setMobileNumber('')}>
                  <MaterialIcons name="close" size={18} color="#8c7164" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Password Field */}
          <View className="mb-5">
            <Text className="text-xs font-bold text-on-surface mb-1.5">
              {language === 'te' ? 'పాస్‌వర్డ్' : language === 'hi' ? 'पासवर्ड' : 'Password'}
            </Text>
            <View className="flex-row items-center bg-surface-container-low rounded-xl px-3 py-2.5 border border-surface-container-highest/80">
              <MaterialIcons name="lock-outline" size={18} color="#9d4300" className="mr-2" />
              <TextInput
                placeholder={language === 'te' ? 'పాస్‌వర్డ్ నమోదు చేయండి' : language === 'hi' ? 'पासवर्ड दर्ज करें' : 'Enter password'}
                placeholderTextColor="#8c7164"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (authError) setAuthError(null);
                }}
                onSubmitEditing={handleSignIn}
                className="flex-1 text-sm font-semibold text-on-surface py-0.5"
                autoComplete="password"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons
                  name={showPassword ? 'visibility-off' : 'visibility'}
                  size={20}
                  color="#8c7164"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Error Banner */}
          {authError && (
            <View className="mb-4 bg-error-container/20 border border-error/30 p-3 rounded-xl flex-row items-start">
              <MaterialIcons name="error-outline" size={16} color="#ba1a1a" className="mr-2 mt-0.5" />
              <Text className="text-xs text-error font-medium flex-1 leading-snug">{authError}</Text>
            </View>
          )}

          {/* Submit Sign In Button */}
          <TouchableOpacity
            onPress={handleSignIn}
            disabled={isSubmitting}
            className="w-full bg-primary py-3.5 rounded-xl flex-row items-center justify-center shadow-md active:scale-[0.98]">
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <MaterialIcons name="login" size={18} color="#ffffff" className="mr-2" />
                <Text className="text-sm font-bold text-white">
                  {language === 'te' ? 'లాగిన్ అవ్వండి' : language === 'hi' ? 'साइन इन करें' : 'Sign In'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Link to Registration */}
        <TouchableOpacity
          onPress={() => router.replace('/onboarding' as any)}
          className="w-full bg-surface-container-lowest p-4 rounded-2xl border border-surface-container-highest/80 items-center justify-center shadow-xs active:scale-98 flex-row">
          <MaterialIcons name="person-add" size={18} color="#9d4300" className="mr-2" />
          <Text className="text-xs font-bold text-on-surface">
            {language === 'te' ? 'ఖాతా లేదా? ' : language === 'hi' ? 'खाता नहीं है? ' : "Don't have an account? "}
            <Text className="text-primary font-bold">
              {language === 'te' ? 'కొత్త సభ్యురాలి నమోదు' : language === 'hi' ? 'नया पंजीकरण' : 'Register New Member'}
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
