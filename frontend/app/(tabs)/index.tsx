import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SakhiHeader } from '@/components/SakhiHeader';
import { AskSakhiModal } from '@/components/AskSakhiModal';
import { ProfileModal } from '@/components/ProfileModal';
import { useApp } from '@/context/AppContext';
import { useTutorial } from '@/context/TutorialContext';
import { TutorialTarget } from '@/components/tutorial/TutorialTarget';
import { financeService } from '@/services/financeService';
import { goalService } from '@/services/goalService';
import { journeyService } from '@/services/journeyService';
import { FinancialSummaryResponse } from '@/types/finance';
import { GoalResponse } from '@/types/goal';
import { JourneyRoadmapResponse } from '@/types/journey';

export default function HomeScreen() {
  const router = useRouter();
  const { is_new_user } = useLocalSearchParams<{ is_new_user?: string }>();
  const { userId, currentUser, isLoading, totalMonthlyIncome, totalMonthlySurplus } = useApp();
  const { triggerFirstTimePrompt } = useTutorial();
  const [askSakhiVisible, setAskSakhiVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);

  // Live state
  const [financialSummary, setFinancialSummary] = useState<FinancialSummaryResponse | null>(null);
  const [goals, setGoals] = useState<GoalResponse[]>([]);
  const [journey, setJourney] = useState<JourneyRoadmapResponse | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Redirect to entry screen if no active user session
  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.replace('/splash' as any);
    } else if (currentUser && is_new_user === 'true') {
      // Trigger tutorial only for first-time newly registered accounts
      const timer = setTimeout(() => {
        triggerFirstTimePrompt();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isLoading, currentUser, router, is_new_user, triggerFirstTimePrompt]);

  const fetchDashboardData = useCallback(async () => {
    if (!userId) return;
    try {
      const [finData, goalsData, journeyData] = await Promise.allSettled([
        financeService.getFinancialHealth(userId),
        goalService.getGoals(userId),
        journeyService.getJourney(userId),
      ]);

      if (finData.status === 'fulfilled') setFinancialSummary(finData.value);
      if (goalsData.status === 'fulfilled') setGoals(goalsData.value);
      if (journeyData.status === 'fulfilled') setJourney(journeyData.value);
    } catch (err: any) {
      if (__DEV__) console.warn('[HomeScreen] Failed loading dashboard data:', err);
    }
  }, [userId]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboardData();
    setIsRefreshing(false);
  };

  const monthlyIncome = totalMonthlyIncome;
  const monthlySurplus = totalMonthlySurplus;
  const activeGoal = goals.length > 0 ? goals[0] : null;
  const currentStage = journey?.current_active_stage || 2;

  if (!isLoading && !currentUser) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      {/* Header */}
      <SakhiHeader
        subtitle="Dashboard"
        hideAvatar={false}
        onPressProfile={() => setProfileVisible(true)}
        onPressMenu={() => router.push('/settings' as any)}
      />

      <ScrollView
        className="flex-1 px-4 py-3"
        contentContainerStyle={{ paddingBottom: 90 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#9d4300" colors={['#9d4300']} />
        }>
        {/* Financial Health Summary Hero Banner */}
        <TutorialTarget id="home-summary-card">
          <View className="relative overflow-hidden rounded-xl bg-surface-container p-4 shadow-sm mb-3.5 border border-surface-container-highest/60">
            <View className="flex-col gap-2">
              {/* Income Metric */}
              <View className="flex-row items-center justify-between py-0.5">
                <View className="flex-row items-center">
                  <View className="w-7 h-7 rounded-lg bg-surface-container-high items-center justify-center mr-2">
                    <MaterialIcons name="payments" size={18} color="#9d4300" />
                  </View>
                  <Text className="text-xs font-semibold text-on-surface-variant">Your Monthly Income</Text>
                </View>
                <Text className="text-base font-bold text-on-surface">₹{monthlyIncome.toLocaleString('en-IN')}</Text>
              </View>

              {/* Surplus Card Highlight Container */}
              <View className="rounded-lg bg-surface-container-lowest p-3 shadow-xs border border-surface-container-highest/50">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-xs font-semibold text-on-surface-variant">Calculated Monthly Surplus</Text>
                  <View className="flex-row items-center bg-primary-fixed px-2 py-0.5 rounded-full">
                    <MaterialIcons name="verified" size={12} color="#341100" />
                    <Text className="text-[10px] font-bold text-primary-on-fixed ml-0.5">Safe to Save</Text>
                  </View>
                </View>
                <View className="flex-row items-baseline justify-between mt-1">
                  <View className="flex-row items-baseline">
                    <Text className="text-2xl font-bold text-primary">₹{monthlySurplus.toLocaleString('en-IN')}</Text>
                    <Text className="text-xs text-on-surface-variant font-medium ml-1">ready to allocate</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => router.push('/(tabs)/money' as any)}
                    className="flex-row items-center active:scale-95">
                    <Text className="text-xs font-bold text-primary mr-0.5">Breakdown</Text>
                    <MaterialIcons name="arrow-forward" size={14} color="#9d4300" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </TutorialTarget>

        {/* Primary Interactive Card: 'Talk to Sakhi' */}
        <TutorialTarget id="home-ask-sakhi-card" onTargetPress={() => setAskSakhiVisible(true)}>
          <TouchableOpacity
            onPress={() => setAskSakhiVisible(true)}
            className="relative overflow-hidden rounded-xl bg-primary-container p-4 text-on-primary shadow-md mb-3.5 active:scale-[0.99]">
            <View className="flex-row items-center justify-between">
              {/* Companion Avatar */}
              <View className="relative mr-3 flex-shrink-0">
                <View className="w-13 h-13 rounded-full bg-on-primary items-center justify-center shadow-md p-2">
                  <MaterialIcons name="support-agent" size={28} color="#9d4300" />
                </View>
                <View className="absolute -bottom-1 -right-1 bg-surface-container-lowest px-1.5 py-0.2 rounded-full shadow-xs">
                  <Text className="text-[9px] font-bold text-primary">AI</Text>
                </View>
              </View>

              {/* Content */}
              <View className="flex-1 min-w-0 mr-2">
                <View className="flex-row items-center mb-0.5">
                  <View className="bg-white/25 px-2 py-0.5 rounded-full mr-1.5">
                    <Text className="text-[10px] font-bold text-white uppercase tracking-wider">Voice & Text</Text>
                  </View>
                  <Text className="text-[11px] text-white/90">Telugu & Hindi</Text>
                </View>
                <Text className="text-lg font-bold text-on-primary">Talk to Sakhi</Text>
              </View>

              {/* Action Mic Indicator */}
              <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center flex-shrink-0">
                <MaterialIcons name="mic" size={22} color="#ffffff" />
              </View>
            </View>
          </TouchableOpacity>
        </TutorialTarget>

        {/* 2x2 Feature Navigation Grid */}
        <View className="flex-row flex-wrap justify-between gap-2.5 mb-3.5">
          {/* Card 1: My Money */}
          <TutorialTarget id="home-money-card" className="w-[48%]" onTargetPress={() => router.push('/(tabs)/money' as any)}>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/money' as any)}
              className="w-full bg-surface-container-low p-3.5 rounded-xl shadow-xs border border-surface-container-highest/60 flex-col justify-between min-h-[90px] active:scale-95">
              <View className="flex-row items-center justify-between w-full mb-2">
                <View className="w-9 h-9 rounded-lg bg-surface-container-high items-center justify-center">
                  <MaterialIcons name="account-balance-wallet" size={20} color="#9d4300" />
                </View>
                <View className="bg-surface-container-highest px-1.5 py-0.5 rounded">
                  <Text className="text-[11px] font-bold text-primary">₹{monthlySurplus.toLocaleString('en-IN')}</Text>
                </View>
              </View>
              <Text className="text-sm font-bold text-on-surface">My Money</Text>
            </TouchableOpacity>
          </TutorialTarget>

          {/* Card 2: My Journey */}
          <TutorialTarget id="home-journey-card" className="w-[48%]" onTargetPress={() => router.push('/(tabs)/journey' as any)}>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/journey' as any)}
              className="w-full bg-surface-container-low p-3.5 rounded-xl shadow-xs border border-surface-container-highest/60 flex-col justify-between min-h-[90px] active:scale-95">
              <View className="flex-row items-center justify-between w-full mb-2">
                <View className="w-9 h-9 rounded-lg bg-surface-container-high items-center justify-center">
                  <MaterialIcons name="explore" size={20} color="#9d4300" />
                </View>
                <View className="bg-primary-fixed px-1.5 py-0.5 rounded">
                  <Text className="text-[11px] font-bold text-primary-on-fixed">Stage {currentStage}</Text>
                </View>
              </View>
              <Text className="text-sm font-bold text-on-surface">My Journey</Text>
            </TouchableOpacity>
          </TutorialTarget>

          {/* Card 3: My Goals */}
          <TutorialTarget id="home-goals-card" className="w-[48%]" onTargetPress={() => router.push('/(tabs)/goals' as any)}>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/goals' as any)}
              className="w-full bg-surface-container-low p-3.5 rounded-xl shadow-xs border border-surface-container-highest/60 flex-col justify-between min-h-[90px] active:scale-95">
              <View className="flex-row items-center justify-between w-full mb-2">
                <View className="w-9 h-9 rounded-lg bg-surface-container-high items-center justify-center">
                  <MaterialIcons name="ads-click" size={20} color="#9d4300" />
                </View>
                <View className="bg-secondary-fixed px-1.5 py-0.5 rounded">
                  <Text className="text-[11px] font-bold text-on-secondary-fixed">
                    {activeGoal ? `${Math.round(activeGoal.progress_percentage)}%` : '35%'}
                  </Text>
                </View>
              </View>
              <Text className="text-sm font-bold text-on-surface">My Goals</Text>
            </TouchableOpacity>
          </TutorialTarget>

          {/* Card 4: Benefits */}
          <TutorialTarget id="home-benefits-card" className="w-[48%]" onTargetPress={() => router.push('/(tabs)/benefits' as any)}>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/benefits' as any)}
              className="w-full bg-surface-container-low p-3.5 rounded-xl shadow-xs border border-surface-container-highest/60 flex-col justify-between min-h-[90px] active:scale-95">
              <View className="flex-row items-center justify-between w-full mb-2">
                <View className="w-9 h-9 rounded-lg bg-surface-container-high items-center justify-center">
                  <MaterialIcons name="verified-user" size={20} color="#9d4300" />
                </View>
                <View className="bg-surface-container-highest px-1.5 py-0.5 rounded">
                  <Text className="text-[11px] font-bold text-on-surface-variant">15 Schemes</Text>
                </View>
              </View>
              <Text className="text-sm font-bold text-on-surface">Benefits</Text>
            </TouchableOpacity>
          </TutorialTarget>
        </View>

        {/* Active Dream Progress Preview Card */}
        <TutorialTarget id="home-dream-card" onTargetPress={() => router.push('/(tabs)/goals' as any)}>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/goals' as any)}
            className="rounded-xl bg-surface-container-lowest p-4 shadow-sm mb-3.5 border border-surface-container-highest/60 active:scale-[0.99]">
            <View className="flex-row items-center justify-between mb-1.5">
              <View className="flex-row items-center">
                <MaterialIcons name="stars" size={18} color="#9d4300" />
                <Text className="text-[11px] font-bold text-primary uppercase tracking-wider ml-1">
                  Active Dream
                </Text>
              </View>
              <View className="bg-surface-container-high px-2 py-0.5 rounded-full">
                <Text className="text-[10px] font-bold text-on-surface-variant">
                  ₹{Math.round(activeGoal ? activeGoal.required_monthly_savings : 1500).toLocaleString('en-IN')}/mo required
                </Text>
              </View>
            </View>

            <View className="flex-row justify-between items-baseline mb-1">
              <Text className="text-sm font-bold text-on-surface">
                {activeGoal ? activeGoal.name : "Create your first Dream Pot"}
              </Text>
              <Text className="text-xs font-bold text-primary">
                {activeGoal ? `${Math.round(activeGoal.progress_percentage)}%` : '0%'}
              </Text>
            </View>

            {/* Progress Bar */}
            <View className="w-full bg-surface-container-highest h-2.5 rounded-full overflow-hidden mb-2.5">
              <View
                className="bg-primary-container h-full rounded-full"
                style={{ width: `${Math.min(100, Math.round(activeGoal ? activeGoal.progress_percentage : 0))}%` }}
              />
            </View>

            {/* Metrics Row */}
            <View className="flex-row items-center justify-between pt-0.5 border-t border-surface-container-highest/40">
              <View className="flex-col">
                <Text className="text-[10px] text-on-surface-variant">Saved so far</Text>
                <Text className="text-xs font-bold text-on-surface">
                  ₹{(activeGoal ? activeGoal.current_amount : 0).toLocaleString('en-IN')}
                </Text>
              </View>
              <View className="flex-col items-center">
                <Text className="text-[10px] text-on-surface-variant">Timeline</Text>
                <Text className="text-xs font-bold text-on-surface">
                  {activeGoal ? `${activeGoal.target_months} mos left` : '-'}
                </Text>
              </View>
              <View className="flex-col items-end">
                <Text className="text-[10px] text-on-surface-variant">Goal Target</Text>
                <Text className="text-xs font-bold text-on-surface">
                  ₹{(activeGoal ? activeGoal.target_amount : 0).toLocaleString('en-IN')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </TutorialTarget>

        {/* Learn Guides Shortcut Banner */}
        <TutorialTarget id="home-learn-card" onTargetPress={() => router.push('/(tabs)/learn' as any)}>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/learn' as any)}
            className="rounded-xl bg-surface-container p-3.5 shadow-sm flex-row items-center justify-between border border-surface-container-highest/60 active:scale-95">
            <View className="flex-row items-center flex-1 mr-2">
              <View className="w-9 h-9 rounded-lg bg-surface-container-highest items-center justify-center mr-2.5 flex-shrink-0">
                <MaterialIcons name="menu-book" size={20} color="#9d4300" />
              </View>
              <View className="flex-col flex-1">
                <View className="flex-row items-center">
                  <Text className="text-xs font-bold text-on-surface">Learn: Financial Guides</Text>
                  <View className="w-1.5 h-1.5 rounded-full bg-secondary-container ml-1.5" />
                </View>
                <Text className="text-[11px] text-on-surface-variant truncate mt-0.5">
                  Emergency Fund • Managing Loans • Micro-Insurance
                </Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#8c7164" />
          </TouchableOpacity>
        </TutorialTarget>
      </ScrollView>

      {/* Floating Ask Sakhi button */}
      <View className="absolute bottom-20 right-4 z-40">
        <TutorialTarget id="home-floating-sakhi" onTargetPress={() => setAskSakhiVisible(true)}>
          <TouchableOpacity
            onPress={() => setAskSakhiVisible(true)}
            className="h-11 px-3.5 rounded-full bg-primary-container flex-row items-center shadow-lg active:scale-95">
            <MaterialIcons name="record-voice-over" size={18} color="#ffffff" />
            <Text className="text-xs font-bold text-on-primary ml-1.5">Ask Sakhi</Text>
          </TouchableOpacity>
        </TutorialTarget>
      </View>

      {/* Modals */}
      <AskSakhiModal visible={askSakhiVisible} onClose={() => setAskSakhiVisible(false)} />
      <ProfileModal visible={profileVisible} onClose={() => setProfileVisible(false)} />
    </SafeAreaView>
  );
}
