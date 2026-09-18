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

export default function LearnScreen() {
  const router = useRouter();
  const [askSakhiVisible, setAskSakhiVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [expandedCard, setExpandedCard] = useState<'emergency' | 'loans' | 'savings' | 'insurance'>('emergency');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

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
          {/* Header Block */}
          <View className="mb-3">
          <View className="flex-row items-center gap-1.5 mb-1.5 flex-wrap">
            <View className="flex-row items-center bg-primary-fixed px-2.5 py-0.5 rounded-full">
              <MaterialIcons name="auto-stories" size={13} color="#341100" />
              <Text className="text-[10px] font-bold text-primary-on-fixed ml-1">Financial Guidance</Text>
            </View>
            <View className="flex-row items-center bg-surface-container-high px-2 py-0.5 rounded-full">
              <MaterialIcons name="verified-user" size={12} color="#584237" />
              <Text className="text-[10px] text-on-surface-variant ml-1 font-semibold">Plain Language</Text>
            </View>
          </View>
          <Text className="text-xl font-bold text-on-surface">What do you want to learn?</Text>

          {/* Language Audio Selector Banner */}
          <View className="mt-2.5 p-3 rounded-xl bg-surface-container-high flex-row items-center justify-between border border-surface-container-highest/60">
            <View className="flex-row items-center flex-1 mr-2">
              <View className="w-8 h-8 rounded-full bg-primary-container items-center justify-center mr-2.5">
                <MaterialIcons name="record-voice-over" size={16} color="#ffffff" />
              </View>
              <Text className="text-xs text-on-surface-variant font-medium">
                Telugu • Hindi • English voiceovers
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setAskSakhiVisible(true)}
              className="px-2.5 py-1 rounded-full bg-surface-container-lowest flex-row items-center shadow-xs">
              <Text className="text-[11px] font-bold text-primary mr-0.5">Change</Text>
              <MaterialIcons name="expand-more" size={14} color="#9d4300" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Educational Visual Card */}
        <View className="rounded-xl bg-surface-container-lowest p-3.5 shadow-xs border border-surface-container-highest/60 flex-row items-center mb-3.5">
          <View className="w-12 h-12 rounded-xl bg-surface-container-high items-center justify-center mr-3">
            <MaterialIcons name="savings" size={24} color="#9d4300" />
          </View>
          <View className="flex-col flex-1">
            <View className="flex-row items-center">
              <MaterialIcons name="recommend" size={15} color="#9d4300" />
              <Text className="text-[10px] font-bold text-primary ml-1">Personalized Plan</Text>
            </View>
            <Text className="text-sm font-bold text-on-surface mt-0.5">
              Based on your ₹4,200 surplus
            </Text>
          </View>
        </View>

        {/* Topic Cards Accordion */}
        <View className="flex-col gap-3">
          {/* Card 1: Emergency Fund */}
          <View className="rounded-xl bg-surface-container-lowest shadow-xs border border-surface-container-highest/60 overflow-hidden">
            <TouchableOpacity
              onPress={() => setExpandedCard(expandedCard === 'emergency' ? ('' as any) : 'emergency')}
              className="p-3.5 flex-row items-start justify-between">
              <View className="flex-row items-start flex-1 mr-2">
                <View className="w-10 h-10 rounded-xl bg-primary-fixed items-center justify-center mr-2.5 flex-shrink-0">
                  <MaterialIcons name="shield" size={22} color="#9d4300" />
                </View>
                <View className="flex-col flex-1">
                  <View className="flex-row items-center space-x-1.5 flex-wrap">
                    <Text className="text-sm font-bold text-on-surface">Emergency Fund</Text>
                    <View className="bg-secondary-fixed px-2 py-0.2 rounded-full ml-1.5">
                      <Text className="text-[10px] font-bold text-on-secondary-fixed">Essential</Text>
                    </View>
                  </View>
                  <Text className="text-[11px] text-on-surface-variant mt-0.5">
                    3 Months household safety reserve
                  </Text>
                </View>
              </View>
              <MaterialIcons
                name={expandedCard === 'emergency' ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                size={22}
                color="#584237"
              />
            </TouchableOpacity>

            {expandedCard === 'emergency' && (
              <View className="px-3.5 pb-3.5 flex-col gap-2.5 pt-1 border-t border-surface-container-highest/40">
                {/* Metric breakdown */}
                <View className="p-3 rounded-xl bg-surface-container flex-col gap-2">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs text-on-surface-variant font-medium">Recommended Fund Goal</Text>
                    <Text className="text-sm font-bold text-primary">₹42,900</Text>
                  </View>
                  <View className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                    <View className="bg-primary h-full rounded-full" style={{ width: '28%' }} />
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-[10px] text-on-surface-variant">Saved so far: ₹12,000</Text>
                    <Text className="text-[10px] text-on-surface-variant">Target: 3 Months</Text>
                  </View>
                  <View className="flex-row gap-2 pt-1">
                    <View className="flex-1 p-2 rounded-lg bg-surface-container-lowest flex-row items-center">
                      <MaterialIcons name="savings" size={16} color="#9d4300" />
                      <Text className="text-xs font-bold text-on-surface ml-1.5">₹1,500 / mo</Text>
                    </View>
                    <View className="flex-1 p-2 rounded-lg bg-surface-container-lowest flex-row items-center">
                      <MaterialIcons name="account-balance" size={16} color="#9d4300" />
                      <Text className="text-xs font-bold text-on-surface ml-1.5">Post Office / MSSC</Text>
                    </View>
                  </View>
                </View>

                {/* Audio player strip */}
                <View className="p-2 pl-3 rounded-full bg-surface-container-highest flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <TouchableOpacity
                      onPress={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="w-8 h-8 rounded-full bg-primary items-center justify-center mr-2 shadow-xs active:scale-90">
                      <MaterialIcons
                        name={isPlayingAudio ? 'pause' : 'play-arrow'}
                        size={18}
                        color="#ffffff"
                      />
                    </TouchableOpacity>
                    <Text className="text-xs font-bold text-on-surface">Telugu Audio Guide</Text>
                  </View>
                  <View className="flex-row items-center gap-1 pr-3">
                    <View className="w-1 h-3 bg-primary rounded-full" />
                    <View className="w-1 h-5 bg-primary rounded-full" />
                    <View className="w-1 h-2 bg-primary rounded-full" />
                    <View className="w-1 h-4 bg-primary rounded-full" />
                  </View>
                </View>

                {/* AI Shortcut trigger */}
                <TouchableOpacity
                  onPress={() => setAskSakhiVisible(true)}
                  className="w-full py-2.5 px-3 rounded-xl bg-surface-container-high flex-row items-center justify-between active:scale-[0.99]">
                  <View className="flex-row items-center flex-1 mr-2">
                    <MaterialIcons name="auto-awesome" size={16} color="#9d4300" />
                    <Text className="text-xs font-bold text-primary ml-1.5">
                      Ask Sakhi how this applies to your ₹4,200 surplus
                    </Text>
                  </View>
                  <MaterialIcons name="arrow-forward" size={16} color="#9d4300" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Card 2: Managing Loans */}
          <View className="rounded-xl bg-surface-container-lowest shadow-xs border border-surface-container-highest/60 overflow-hidden">
            <View className="p-3.5 flex-col gap-2">
              <View className="flex-row items-start justify-between">
                <View className="flex-row items-start flex-1 mr-2">
                  <View className="w-10 h-10 rounded-xl bg-secondary-fixed items-center justify-center mr-2.5 flex-shrink-0">
                    <MaterialIcons name="trending-down" size={22} color="#b3291b" />
                  </View>
                  <View className="flex-col flex-1">
                    <View className="flex-row items-center flex-wrap">
                      <Text className="text-sm font-bold text-on-surface">Managing Loans</Text>
                      <View className="bg-error-container px-2 py-0.2 rounded-full ml-1.5">
                        <Text className="text-[10px] font-bold text-on-error-container">High Priority</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              <View className="p-2.5 rounded-lg bg-surface-container-low flex-row items-center">
                <MaterialIcons name="insights" size={16} color="#b3291b" />
                <Text className="text-xs text-on-surface-variant ml-1.5 flex-1 leading-snug">
                  Clearing your <Text className="font-bold text-on-surface">₹12,000 moneylender loan</Text> saves{' '}
                  <Text className="text-secondary font-bold">₹360 every single month.</Text>
                </Text>
              </View>

              <View className="flex-row items-center justify-end pt-1">
                <TouchableOpacity
                  onPress={() => setAskSakhiVisible(true)}
                  className="px-3.5 py-1.5 rounded-full bg-primary flex-row items-center shadow-xs active:scale-95">
                  <MaterialIcons name="volume-up" size={14} color="#ffffff" />
                  <Text className="text-xs font-bold text-on-primary ml-1">Listen Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Card 3: Disciplined Saving */}
          <View className="rounded-xl bg-surface-container-lowest shadow-xs border border-surface-container-highest/60 p-3.5 flex-col gap-2">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1 mr-2">
                <View className="w-10 h-10 rounded-xl bg-surface-container-high items-center justify-center mr-2.5 flex-shrink-0">
                  <MaterialIcons name="savings" size={22} color="#9d4300" />
                </View>
                <Text className="text-sm font-bold text-on-surface">Disciplined Saving</Text>
              </View>
              <TouchableOpacity
                onPress={() => setAskSakhiVisible(true)}
                className="px-3.5 py-1.5 rounded-full bg-primary flex-row items-center shadow-xs active:scale-95">
                <MaterialIcons name="volume-up" size={14} color="#ffffff" />
                <Text className="text-xs font-bold text-on-primary ml-1">Listen Now</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Card 4: Micro-Insurance Protection */}
          <View className="rounded-xl bg-surface-container-lowest shadow-xs border border-surface-container-highest/60 p-3.5 flex-col gap-2">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1 mr-2">
                <View className="w-10 h-10 rounded-xl bg-tertiary-fixed items-center justify-center mr-2.5 flex-shrink-0">
                  <MaterialIcons name="verified" size={22} color="#9d4135" />
                </View>
                <View className="flex-col flex-1">
                  <View className="flex-row items-center">
                    <Text className="text-sm font-bold text-on-surface">Micro-Insurance</Text>
                    <View className="bg-surface-container-high px-2 py-0.2 rounded-full ml-1.5">
                      <Text className="text-[10px] font-bold text-primary">Govt Scheme</Text>
                    </View>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setAskSakhiVisible(true)}
                className="px-3.5 py-1.5 rounded-full bg-primary flex-row items-center shadow-xs active:scale-95">
                <MaterialIcons name="volume-up" size={14} color="#ffffff" />
                <Text className="text-xs font-bold text-on-primary ml-1">Listen Now</Text>
              </TouchableOpacity>
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
          <MaterialIcons name="auto-awesome" size={20} color="#ffffff" />
          <Text className="text-on-primary font-headline-sm text-[14px] font-bold ml-1.5">Ask Sakhi a Doubt</Text>
        </TouchableOpacity>
      </View>

      <AskSakhiModal visible={askSakhiVisible} onClose={() => setAskSakhiVisible(false)} />
      <ProfileModal visible={profileVisible} onClose={() => setProfileVisible(false)} />
    </SafeAreaView>
  );
}
