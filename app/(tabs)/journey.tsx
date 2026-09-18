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
import { SakhiHeader } from '@/components/SakhiHeader';
import { AskSakhiModal } from '@/components/AskSakhiModal';
import { ProfileModal } from '@/components/ProfileModal';

export default function JourneyScreen() {
  const router = useRouter();
  const [askSakhiVisible, setAskSakhiVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [isListeningAudio, setIsListeningAudio] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 90 }}>
        {/* Top App Bar / Header (Scrolls with page content) */}
        <SakhiHeader
          logoOnly={true}
          onPressProfile={() => setProfileVisible(true)}
          onPressMenu={() => router.push('/settings' as any)}
        />

        <View className="px-4 py-3">
          {/* Intro Framing Header */}
          <View className="mb-3">
          <View className="flex-row items-center self-start px-2.5 py-0.5 rounded-full bg-primary-container/15 mb-1">
            <MaterialIcons name="verified" size={13} color="#9d4300" />
            <Text className="text-[10px] uppercase tracking-wider font-bold text-primary ml-1">
              Financial Freedom Roadmap
            </Text>
          </View>
          <Text className="text-xl font-bold text-on-surface">Your 7-Stage Journey</Text>
        </View>

        {/* Peer Path Banner */}
        <View className="relative w-full h-24 rounded-xl overflow-hidden bg-primary-container p-3 justify-end mb-3.5 shadow-xs">
          <View className="flex-row items-center">
            <MaterialIcons name="groups" size={18} color="#ffffff" />
            <Text className="text-xs font-semibold text-on-primary ml-1.5">
              Mahila Bachat Gat • Telangana Peer Path
            </Text>
          </View>
        </View>

        {/* Active Milestone Hero Card (Stage 2) */}
        <View className="w-full bg-surface-container rounded-xl p-4 flex-col gap-3 shadow-sm mb-4 border border-surface-container-highest/60">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center bg-primary px-2.5 py-1 rounded-full">
              <View className="w-1.5 h-1.5 rounded-full bg-on-primary mr-1.5" />
              <Text className="text-[10px] font-bold text-on-primary tracking-wide">
                Current Active Milestone
              </Text>
            </View>
            <View className="bg-surface px-2 py-0.5 rounded-full">
              <Text className="text-xs font-bold text-on-surface-variant">Stage 2 of 7</Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <MaterialIcons name="shield-moon" size={24} color="#9d4300" />
            <Text className="text-base font-bold text-on-surface ml-2">Build Emergency Shield</Text>
          </View>

          {/* Metrics Card */}
          <View className="bg-surface rounded-xl p-3 flex-row items-center justify-between border border-surface-container-highest/60">
            <View className="flex-row items-center flex-1">
              <View className="w-12 h-12 rounded-full bg-surface-container items-center justify-center mr-3 border border-primary-container">
                <Text className="text-xs font-bold text-primary">42%</Text>
              </View>
              <View className="flex-col">
                <Text className="text-[10px] uppercase tracking-wider text-on-surface-variant">Shield Target</Text>
                <Text className="text-base font-bold text-on-surface">₹15,000</Text>
                <Text className="text-[11px] font-semibold text-primary">₹6,300 saved so far</Text>
              </View>
            </View>
            <View className="w-px h-10 bg-surface-container-high mx-2" />
            <View className="flex-col items-end">
              <Text className="text-[10px] text-on-surface-variant">Estimated</Text>
              <Text className="text-xs font-bold text-secondary">6 Months left</Text>
              <Text className="text-[10px] text-on-surface-variant">at ₹1.5k/mo</Text>
            </View>
          </View>

          {/* Action Row */}
          <View className="flex-col gap-2 pt-1">
            <View className="flex-row items-center">
              <MaterialIcons name="arrow-forward" size={14} color="#b3291b" />
              <Text className="text-[11px] font-semibold text-on-surface-variant ml-1">
                Next: Stage 3 • Clear High-Interest Debt
              </Text>
            </View>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setIsListeningAudio(!isListeningAudio)}
                className="flex-1 h-11 rounded-lg bg-surface flex-row items-center justify-center shadow-xs active:scale-95 border border-surface-container-highest/60">
                <MaterialIcons name={isListeningAudio ? 'pause' : 'graphic-eq'} size={18} color="#9d4300" />
                <Text className="text-xs font-bold text-on-surface ml-1.5">
                  {isListeningAudio ? '🔊 Playing' : '🔊 Listen'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setAskSakhiVisible(true)}
                className="flex-1 h-11 rounded-lg bg-primary flex-row items-center justify-center shadow-xs active:scale-95">
                <Text className="text-xs font-bold text-on-primary mr-1">Ask Sakhi Advice</Text>
                <MaterialIcons name="arrow-forward" size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* All 7 Milestones */}
        <View className="mb-3">
          <View className="flex-row items-center justify-between mb-2 px-0.5">
            <Text className="text-sm font-bold text-on-surface">All 7 Milestones</Text>
            <Text className="text-[11px] text-on-surface-variant">Tap stage for details</Text>
          </View>

          <View className="flex-col gap-2">
            {/* Stage 1 */}
            <View className="bg-surface-container-lowest rounded-xl p-3 shadow-xs border border-surface-container-highest/60 flex-row items-center justify-between">
              <View className="flex-row items-center flex-1 mr-2">
                <View className="w-9 h-9 rounded-full bg-surface-container-high items-center justify-center mr-2.5">
                  <MaterialIcons name="check-circle" size={20} color="#b3291b" />
                </View>
                <View className="flex-col flex-1">
                  <Text className="text-[10px] font-bold text-on-surface-variant">STAGE 1</Text>
                  <Text className="text-xs font-bold text-on-surface">Stabilize Cashflow</Text>
                </View>
              </View>
              <View className="bg-surface-container-high px-2 py-0.5 rounded-full flex-row items-center">
                <MaterialIcons name="done-all" size={12} color="#9d4300" />
                <Text className="text-[10px] font-bold text-on-surface-variant ml-1">Completed</Text>
              </View>
            </View>

            {/* Stage 2 (Active) */}
            <View className="bg-surface-container rounded-xl p-3.5 shadow-sm border border-primary-container/40">
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center flex-1 mr-2">
                  <View className="w-9 h-9 rounded-full bg-primary items-center justify-center mr-2.5 shadow-xs">
                    <Text className="text-xs font-bold text-on-primary">02</Text>
                  </View>
                  <View className="flex-col flex-1">
                    <Text className="text-[10px] font-bold text-primary">STAGE 2 • ACTIVE</Text>
                    <Text className="text-xs font-bold text-on-surface">Build Emergency Shield</Text>
                  </View>
                </View>
                <View className="bg-primary px-2 py-0.5 rounded-full">
                  <Text className="text-[10px] font-bold text-on-primary">In Progress (42%)</Text>
                </View>
              </View>
              <View className="pl-11">
                <View className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden mb-1">
                  <View className="h-full bg-primary rounded-full" style={{ width: '42%' }} />
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-[10px] text-on-surface-variant">₹6,300 collected</Text>
                  <Text className="text-[10px] font-bold text-primary">Goal: ₹15,000</Text>
                </View>
              </View>
            </View>

            {/* Stage 3 */}
            <View className="bg-surface-container-lowest rounded-xl p-3 shadow-xs border border-surface-container-highest/60 flex-row items-center justify-between">
              <View className="flex-row items-center flex-1 mr-2">
                <View className="w-9 h-9 rounded-full bg-secondary-fixed items-center justify-center mr-2.5">
                  <Text className="text-xs font-bold text-on-secondary-fixed">03</Text>
                </View>
                <View className="flex-col flex-1">
                  <Text className="text-[10px] font-bold text-secondary">STAGE 3</Text>
                  <Text className="text-xs font-bold text-on-surface">Clear High-Interest Debt</Text>
                </View>
              </View>
              <View className="bg-secondary-fixed px-2 py-0.5 rounded-full">
                <Text className="text-[10px] font-bold text-on-secondary-fixed">Next Up</Text>
              </View>
            </View>

            {/* Stage 4 */}
            <View className="bg-surface-container-low/70 rounded-xl p-3 shadow-xs border border-surface-container-highest/40">
              <View className="flex-row items-center justify-between mb-1.5">
                <View className="flex-row items-center flex-1 mr-2">
                  <View className="w-9 h-9 rounded-full bg-surface-container-high items-center justify-center mr-2.5">
                    <MaterialIcons name="lock" size={16} color="#8c7164" />
                  </View>
                  <View className="flex-col flex-1">
                    <Text className="text-[10px] font-bold text-outline">STAGE 4</Text>
                    <Text className="text-xs font-bold text-on-surface-variant">Micro-Insurance Protection</Text>
                  </View>
                </View>
                <View className="bg-surface-container-high px-2 py-0.5 rounded-full">
                  <Text className="text-[10px] text-on-surface-variant font-medium">Locked</Text>
                </View>
              </View>
              <View className="pl-11 flex-row gap-1.5">
                <View className="bg-surface-container-highest px-2 py-0.5 rounded-full">
                  <Text className="text-[10px] font-bold text-on-surface">PMSBY ₹20/yr</Text>
                </View>
                <View className="bg-surface-container-highest px-2 py-0.5 rounded-full">
                  <Text className="text-[10px] font-bold text-on-surface">PMJJBY ₹436/yr</Text>
                </View>
              </View>
            </View>

            {/* Stage 5 */}
            <View className="bg-surface-container-low/70 rounded-xl p-3 shadow-xs border border-surface-container-highest/40 flex-row items-center justify-between">
              <View className="flex-row items-center flex-1 mr-2">
                <View className="w-9 h-9 rounded-full bg-surface-container-high items-center justify-center mr-2.5">
                  <MaterialIcons name="lock" size={16} color="#8c7164" />
                </View>
                <View className="flex-col flex-1">
                  <Text className="text-[10px] font-bold text-outline">STAGE 5</Text>
                  <Text className="text-xs font-bold text-on-surface-variant">Goal-Based Savings</Text>
                </View>
              </View>
              <View className="bg-surface-container-high px-2 py-0.5 rounded-full">
                <Text className="text-[10px] text-on-surface-variant font-medium">Locked</Text>
              </View>
            </View>

            {/* Stage 6 */}
            <View className="bg-surface-container-low/70 rounded-xl p-3 shadow-xs border border-surface-container-highest/40 flex-row items-center justify-between">
              <View className="flex-row items-center flex-1 mr-2">
                <View className="w-9 h-9 rounded-full bg-surface-container-high items-center justify-center mr-2.5">
                  <MaterialIcons name="lock" size={16} color="#8c7164" />
                </View>
                <View className="flex-col flex-1">
                  <Text className="text-[10px] font-bold text-outline">STAGE 6</Text>
                  <Text className="text-xs font-bold text-on-surface-variant">Enterprise & Livelihood</Text>
                </View>
              </View>
              <View className="bg-surface-container-high px-2 py-0.5 rounded-full">
                <Text className="text-[10px] text-on-surface-variant font-medium">Locked</Text>
              </View>
            </View>

            {/* Stage 7 */}
            <View className="bg-surface-container-low/70 rounded-xl p-3 shadow-xs border border-surface-container-highest/40 flex-row items-center justify-between">
              <View className="flex-row items-center flex-1 mr-2">
                <View className="w-9 h-9 rounded-full bg-surface-container-high items-center justify-center mr-2.5">
                  <MaterialIcons name="workspace-premium" size={16} color="#8c7164" />
                </View>
                <View className="flex-col flex-1">
                  <Text className="text-[10px] font-bold text-outline">STAGE 7</Text>
                  <Text className="text-xs font-bold text-on-surface-variant">Retirement & Future Dignity</Text>
                </View>
              </View>
              <View className="bg-surface-container-high px-2 py-0.5 rounded-full">
                <Text className="text-[10px] text-on-surface-variant font-medium">Locked</Text>
              </View>
            </View>
          </View>
        </View>
        </View>
      </ScrollView>

      {/* Floating Ask Sakhi button */}
      <View className="absolute bottom-20 right-4 z-40">
        <TouchableOpacity
          onPress={() => setAskSakhiVisible(true)}
          className="h-11 px-3.5 rounded-full bg-primary-container flex-row items-center shadow-lg active:scale-95">
          <MaterialIcons name="record-voice-over" size={18} color="#ffffff" />
          <Text className="text-xs font-bold text-on-primary ml-1.5">Ask Sakhi</Text>
        </TouchableOpacity>
      </View>

      <AskSakhiModal visible={askSakhiVisible} onClose={() => setAskSakhiVisible(false)} />
      <ProfileModal visible={profileVisible} onClose={() => setProfileVisible(false)} />
    </SafeAreaView>
  );
}
