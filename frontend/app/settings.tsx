import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Linking,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp, AVAILABLE_STATES } from '@/context/AppContext';
import { useTutorial } from '@/context/TutorialContext';
import { TUTORIAL_DEFINITIONS } from '@/constants/tutorialSteps';

export default function SettingsScreen() {
  const router = useRouter();
  const {
    currentUser,
    operatingState,
    setOperatingState,
    updateUserPreferences,
    logoutUser,
    language: appLanguage,
    setLanguage: setAppLanguage,
  } = useApp();
  const { openCardTour, startTutorial } = useTutorial();

  // State initialized from currentUser or appLanguage
  const [showStatePicker, setShowStatePicker] = useState(false);
  const [fullName, setFullName] = useState(currentUser?.name || 'Member');
  const [monthlyIncome, setMonthlyIncome] = useState(
    currentUser?.monthly_income ? currentUser.monthly_income.toString() : '18500'
  );
  const [age, setAge] = useState(currentUser?.age ? currentUser.age.toString() : '28');
  const [shgActive, setShgActive] = useState(currentUser?.is_shg_member ?? true);
  const [language, setLanguage] = useState<'en' | 'hi' | 'te'>(
    (currentUser?.primary_language as 'en' | 'hi' | 'te') || appLanguage || 'te'
  );
  const [appearance, setAppearance] = useState<'light' | 'dark'>('light');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state if currentUser changes
  React.useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.name);
      setMonthlyIncome(currentUser.monthly_income.toString());
      setAge(currentUser.age.toString());
      setShgActive(currentUser.is_shg_member);
      if (currentUser.primary_language && ['en', 'hi', 'te'].includes(currentUser.primary_language)) {
        const lang = currentUser.primary_language as 'en' | 'hi' | 'te';
        setLanguage(lang);
        setAppLanguage(lang);
      }
      if (currentUser.state) {
        setOperatingState(currentUser.state);
      }
    }
  }, [currentUser, setOperatingState, setAppLanguage]);

  const handleSelectLanguage = (selectedLang: 'en' | 'hi' | 'te') => {
    setLanguage(selectedLang);
    setAppLanguage(selectedLang);
  };



  const handleSave = async () => {
    setIsSaving(true);
    try {
      const parsedIncome = parseFloat(monthlyIncome.replace(/,/g, '')) || 18500;
      const parsedAge = parseInt(age, 10) || 28;
      await updateUserPreferences({
        name: fullName.trim() || 'Member',
        monthly_income: parsedIncome,
        age: parsedAge,
        is_shg_member: shgActive,
        primary_language: language,
        state: operatingState,
      });
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
      }, 2000);
    } catch (err) {
      if (__DEV__) {
        console.warn('Failed to save user preferences:', err);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out from Device',
      'Are you sure you want to log out? You can sign back in anytime with your mobile number or member profile.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            logoutUser();
            router.replace('/splash' as any);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Top Navigation / Header */}
        <View className="flex-row items-center justify-between py-2 mb-2 mt-1">
          <View className="flex-col">
            <Text className="font-headline-sm text-[22px] font-bold text-on-surface">Settings & Profile</Text>
            <Text className="font-body-sm text-[14px] text-on-surface-variant">Personal info, language & voice</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-11 h-11 rounded-full bg-surface-container-high items-center justify-center active:scale-95"
          >
            <MaterialIcons name="close" size={24} color="#1f1a1b" />
          </TouchableOpacity>
        </View>

        {/* Section 1: Personal Profile */}
        <View className="bg-surface-container-low rounded-xl p-4 shadow-sm mb-4 gap-4">
          <View className="flex-row items-center gap-3">
            <View className="relative">
              <View className="w-16 h-16 rounded-full bg-surface-container-high items-center justify-center shadow-sm overflow-hidden border border-surface-container-highest/60">
                <Image
                  source={require('@/assets/images/app-logo-emblem.png')}
                  style={{ width: 56, height: 56 }}
                  resizeMode="contain"
                />
              </View>
              <TouchableOpacity className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-secondary items-center justify-center shadow-sm">
                <MaterialIcons name="photo-camera" size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-1">
                <Text className="font-headline-sm text-[18px] font-bold text-on-surface">{fullName}</Text>
                <MaterialIcons name="verified" size={20} color="#9d4300" />
              </View>
              <Text className="font-body-sm text-[12px] text-on-surface-variant font-mono">SERP TG-48209 · Active Member</Text>
            </View>
          </View>



          {/* Form Inputs */}
          <View className="gap-3 pt-1">
            {/* Full Name */}
            <View className="gap-1">
              <Text className="font-label-md text-[13px] text-on-surface-variant font-semibold">Registered Full Name</Text>
              <View className="flex-row items-center bg-surface-container-lowest rounded-lg px-3 py-2.5 shadow-sm">
                <MaterialIcons name="badge" size={20} color="#9d4300" className="mr-2" style={{ marginRight: 8 }} />
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  className="flex-1 font-headline-sm text-[16px] text-on-surface p-0 font-bold"
                />
              </View>
            </View>

            {/* Income & Age Row */}
            <View className="flex-row gap-2">
              <View className="flex-1 gap-1">
                <Text className="font-label-md text-[13px] text-on-surface-variant font-semibold">Monthly Income</Text>
                <View className="flex-row items-center bg-surface-container-lowest rounded-lg px-3 py-2.5 shadow-sm">
                  <Text className="font-body-md text-[16px] text-primary font-bold mr-1 font-mono">₹</Text>
                  <TextInput
                    value={monthlyIncome}
                    onChangeText={setMonthlyIncome}
                    keyboardType="numeric"
                    className="flex-1 font-body-lg text-[16px] text-on-surface p-0 font-mono"
                  />
                </View>
              </View>
              <View className="w-28 gap-1">
                <Text className="font-label-md text-[13px] text-on-surface-variant font-semibold">Member Age</Text>
                <View className="flex-row items-center bg-surface-container-lowest rounded-lg px-3 py-2.5 shadow-sm">
                  <TextInput
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                    className="flex-1 font-body-lg text-[16px] text-on-surface p-0 font-mono"
                  />
                  <Text className="font-body-sm text-[14px] text-on-surface-variant">yrs</Text>
                </View>
              </View>
            </View>

            {/* State Selector */}
            <View className="gap-1">
              <View className="flex-row items-center justify-between">
                <Text className="font-label-md text-[13px] text-on-surface-variant font-semibold">Operating State</Text>
                <TouchableOpacity
                  onPress={() => setShowStatePicker(!showStatePicker)}
                  className="flex-row items-center active:scale-95">
                  <Text className="text-xs font-bold text-primary mr-0.5">
                    {showStatePicker ? 'Close' : 'Change'}
                  </Text>
                  <MaterialIcons
                    name={showStatePicker ? 'expand-less' : 'edit'}
                    size={14}
                    color="#9d4300"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => setShowStatePicker(!showStatePicker)}
                className="flex-row items-center justify-between bg-surface-container-lowest rounded-lg px-3 py-2.5 shadow-sm active:scale-[0.99]">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="location-on" size={20} color="#9d4300" />
                  <Text className="font-headline-sm text-[16px] font-bold text-on-surface">{operatingState}</Text>
                </View>
                <View className="bg-primary-fixed px-2.5 py-1 rounded-full flex-row items-center gap-1.5">
                  <View className="w-2 h-2 rounded-full bg-primary" />
                  <Text className="text-on-primary-fixed font-label-sm text-[11px] font-semibold">SERP Active</Text>
                </View>
              </TouchableOpacity>

              {/* State Selection Dropdown List */}
              {showStatePicker && (
                <View className="bg-surface-container-lowest rounded-xl p-2 border border-surface-container-highest/70 shadow-sm mt-1">
                  <Text className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider px-2 py-1">
                    Select Operating State
                  </Text>
                  {AVAILABLE_STATES.map((st) => {
                    const isCurrent = operatingState === st;
                    return (
                      <TouchableOpacity
                        key={st}
                        onPress={() => {
                          setOperatingState(st);
                          setShowStatePicker(false);
                        }}
                        className={`flex-row items-center justify-between px-3 py-2 rounded-lg ${
                          isCurrent ? 'bg-primary-container/15' : 'bg-transparent'
                        } active:scale-98`}>
                        <View className="flex-row items-center gap-2">
                          <MaterialIcons
                            name="location-city"
                            size={16}
                            color={isCurrent ? '#9d4300' : '#8c7164'}
                          />
                          <Text
                            className={`text-sm ${
                              isCurrent ? 'font-bold text-primary' : 'text-on-surface font-medium'
                            }`}>
                            {st}
                          </Text>
                        </View>
                        {isCurrent && (
                          <MaterialIcons name="check-circle" size={16} color="#9d4300" />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            {/* SHG Membership Toggle */}
            <View className="flex-row items-center justify-between bg-surface-container-lowest rounded-lg p-3 shadow-sm">
              <View className="flex-col">
                <Text className="font-headline-sm text-[15px] font-bold text-on-surface">SHG Membership</Text>
                <Text className="font-body-sm text-[12px] text-on-surface-variant">Active borrower status</Text>
              </View>
              <Switch
                value={shgActive}
                onValueChange={setShgActive}
                trackColor={{ false: '#eae0e0', true: '#9d4300' }}
                thumbColor={'#ffffff'}
              />
            </View>
          </View>
        </View>

        {/* Section 2: Language & Voice Preferences */}
        <View className="bg-surface-container-low rounded-xl p-4 shadow-sm mb-4 gap-3">
          <View className="flex-row items-center gap-1.5">
            <MaterialIcons name="translate" size={22} color="#9d4300" />
            <Text className="font-headline-sm text-[18px] font-bold text-on-surface">Language & Voice</Text>
          </View>

          {/* 3 Accessible Cards */}
          <View className="flex-row gap-2">
            {/* English */}
            <TouchableOpacity
              onPress={() => handleSelectLanguage('en')}
              className={`flex-1 items-center justify-center p-2.5 rounded-xl ${
                language === 'en' ? 'bg-primary shadow-sm' : 'bg-surface-container-lowest shadow-sm'
              } h-20 active:scale-95`}
            >
              {language === 'en' && (
                <View className="absolute top-1 right-1">
                  <MaterialIcons name="check-circle" size={16} color="#ffffff" />
                </View>
              )}
              <Text className={`font-headline-sm text-[18px] font-bold ${language === 'en' ? 'text-on-primary' : 'text-on-surface'}`}>
                A
              </Text>
              <Text className={`font-body-sm text-[13px] mt-0.5 ${language === 'en' ? 'text-on-primary' : 'text-on-surface'}`}>
                English
              </Text>
            </TouchableOpacity>

            {/* Hindi */}
            <TouchableOpacity
              onPress={() => handleSelectLanguage('hi')}
              className={`flex-1 items-center justify-center p-2.5 rounded-xl ${
                language === 'hi' ? 'bg-primary shadow-sm' : 'bg-surface-container-lowest shadow-sm'
              } h-20 active:scale-95`}
            >
              {language === 'hi' && (
                <View className="absolute top-1 right-1">
                  <MaterialIcons name="check-circle" size={16} color="#ffffff" />
                </View>
              )}
              <Text className={`font-headline-sm text-[18px] font-bold ${language === 'hi' ? 'text-on-primary' : 'text-on-surface'}`}>
                हिन्दी
              </Text>
              <Text className={`font-body-sm text-[13px] mt-0.5 ${language === 'hi' ? 'text-on-primary' : 'text-on-surface'}`}>
                Hindi
              </Text>
            </TouchableOpacity>

            {/* Telugu (Selected) */}
            <TouchableOpacity
              onPress={() => handleSelectLanguage('te')}
              className={`flex-1 items-center justify-center p-2.5 rounded-xl ${
                language === 'te' ? 'bg-primary shadow-sm' : 'bg-surface-container-lowest shadow-sm'
              } h-20 active:scale-95`}
            >
              {language === 'te' && (
                <View className="absolute top-1 right-1">
                  <MaterialIcons name="check-circle" size={16} color="#ffffff" />
                </View>
              )}
              <Text className={`font-headline-sm text-[18px] font-bold ${language === 'te' ? 'text-on-primary' : 'text-on-surface'}`}>
                తెలుగు
              </Text>
              <Text className={`font-body-sm text-[13px] mt-0.5 ${language === 'te' ? 'text-on-primary' : 'text-on-surface'}`}>
                Telugu
              </Text>
            </TouchableOpacity>
          </View>

          {/* Voice Speed */}
          <View className="bg-surface-container-lowest rounded-lg p-3 shadow-sm flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="record-voice-over" size={20} color="#9d4300" />
              <Text className="font-label-lg text-[14px] font-semibold text-on-surface">Voice Narration</Text>
            </View>
            <View className="bg-surface-container px-2.5 py-1 rounded-full">
              <Text className="font-label-sm text-[12px] text-primary font-semibold">Normal (Clear)</Text>
            </View>
          </View>

          {/* Appearance Mode */}
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setAppearance('light')}
              className={`flex-1 flex-row items-center justify-center gap-2 py-2.5 px-3 rounded-lg shadow-sm ${
                appearance === 'light' ? 'bg-primary' : 'bg-surface-container-lowest'
              }`}
            >
              <Text className="text-[16px]">☀️</Text>
              <Text className={`font-headline-sm text-[14px] font-bold ${appearance === 'light' ? 'text-on-primary' : 'text-on-surface'}`}>
                Light Mode
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setAppearance('dark')}
              className={`flex-1 flex-row items-center justify-center gap-2 py-2.5 px-3 rounded-lg shadow-sm ${
                appearance === 'dark' ? 'bg-primary' : 'bg-surface-container-lowest'
              }`}
            >
              <Text className="text-[16px]">🌙</Text>
              <Text className={`font-headline-sm text-[14px] font-bold ${appearance === 'dark' ? 'text-on-primary' : 'text-on-surface'}`}>
                Dark Mode
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section 3: App Tour & Help */}
        <View className="bg-surface-container-low rounded-xl p-4 shadow-sm mb-4 gap-3">
          <View className="flex-row items-center gap-1.5 mb-1">
            <MaterialIcons name="help-center" size={22} color="#9d4300" />
            <Text className="font-headline-sm text-[18px] font-bold text-on-surface">Interactive Guided Walkthroughs</Text>
          </View>

          {/* Quick Launch Basics Tour */}
          <TouchableOpacity
            onPress={() => {
              router.push('/(tabs)' as any);
              setTimeout(() => {
                openCardTour();
              }, 250);
            }}
            className="w-full flex-row items-center justify-between p-3 bg-primary-container rounded-lg shadow-sm active:scale-98"
          >
            <View className="flex-row items-center gap-3">
              <View className="w-9 h-9 rounded-full bg-on-primary items-center justify-center">
                <MaterialIcons name="explore" size={20} color="#9d4300" />
              </View>
              <View className="flex-col">
                <Text className="font-headline-sm text-[15px] font-bold text-on-primary">Start Main Sakhi Tour</Text>
                <Text className="font-body-sm text-[12px] text-on-primary/80">Interactive spotlight walkthrough</Text>
              </View>
            </View>
            <MaterialIcons name="play-arrow" size={22} color="#ffffff" />
          </TouchableOpacity>

          {/* Tour Hub Button */}
          <TouchableOpacity
            onPress={() => router.push('/tour' as any)}
            className="w-full flex-row items-center justify-between p-3 bg-surface-container-lowest rounded-lg shadow-sm active:scale-98"
          >
            <View className="flex-row items-center gap-3">
              <View className="w-9 h-9 rounded-full bg-primary-fixed items-center justify-center">
                <MaterialIcons name="library-books" size={20} color="#9d4300" />
              </View>
              <View className="flex-col">
                <Text className="font-headline-sm text-[15px] font-bold text-on-surface">Explore All 7 Guided Tutorials</Text>
                <Text className="font-body-sm text-[12px] text-on-surface-variant">Money, Goals, Schemes, Journey & AI</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#8c7164" />
          </TouchableOpacity>

          {/* Coordinator Call Card */}
          <View className="flex-row items-center justify-between p-3 bg-surface-container-lowest rounded-lg shadow-sm">
            <View className="flex-row items-center gap-3">
              <View className="w-9 h-9 rounded-full bg-secondary-fixed items-center justify-center">
                <MaterialIcons name="support-agent" size={20} color="#b3291b" />
              </View>
              <View className="flex-col">
                <Text className="font-headline-sm text-[15px] font-bold text-on-surface">Village BC Sakhi</Text>
                <Text className="font-body-sm text-[12px] text-on-surface-variant">Smt. Radha Rani (Khammam)</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => Linking.openURL('tel:1800000123')}
              className="w-10 h-10 rounded-full bg-primary items-center justify-center shadow-sm active:scale-95"
            >
              <MaterialIcons name="call" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="gap-2 mb-6">
          <TouchableOpacity
            onPress={handleSave}
            disabled={isSaving}
            className="w-full min-h-[48px] bg-primary-container items-center justify-center rounded-lg shadow-md active:scale-98 flex-row gap-2 py-3"
          >
            {isSaving ? (
              <MaterialIcons name="sync" size={20} color="#ffffff" className="animate-spin" />
            ) : (
              <>
                <MaterialIcons name={savedSuccess ? 'check' : 'save'} size={20} color="#ffffff" />
                <Text className="text-on-primary font-headline-sm text-[16px] font-bold">
                  {savedSuccess ? 'Saved to Device' : 'Save Changes'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            className="w-full min-h-[48px] bg-surface-container-lowest items-center justify-center rounded-lg shadow-sm active:scale-98 flex-row gap-2 py-3"
          >
            <MaterialIcons name="logout" size={20} color="#b3291b" />
            <Text className="text-secondary font-headline-sm text-[16px] font-bold">Log Out from Device</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
