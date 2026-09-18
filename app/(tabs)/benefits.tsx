import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SakhiHeader } from '@/components/SakhiHeader';
import { SchemeDetailModal } from '@/components/SchemeDetailModal';
import { EligibilityMatcherModal } from '@/components/EligibilityMatcherModal';
import { AskSakhiModal } from '@/components/AskSakhiModal';
import { ProfileModal } from '@/components/ProfileModal';

export default function BenefitsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedScheme, setSelectedScheme] = useState<any>(null);
  const [matcherVisible, setMatcherVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [askSakhiVisible, setAskSakhiVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);

  const categories = [
    { id: 'all', label: 'All (15)' },
    { id: 'enterprise', label: 'Women Enterprise (5)' },
    { id: 'credit', label: 'SHG Credit (4)' },
    { id: 'insurance', label: 'Insurance (2)' },
    { id: 'pension', label: 'Pension (2)' },
    { id: 'telangana', label: 'Telangana State (3)' },
  ];

  const schemes = [
    {
      id: '1',
      title: 'Lakhpati Didi Initiative',
      department: 'Ministry of Rural Development & SERP Telangana',
      categories: ['enterprise', 'telangana'],
      matchPercent: '100% Match',
      tags: ['SHG Livelihood', 'Central Govt'],
      benefit: '₹1L - ₹5L Credit Assistance',
      subBenefit: 'Tailoring & Food Processing',
      portalUrl: 'https://lakhpatididi.gov.in',
    },
    {
      id: '2',
      title: 'Stree Nidhi Credit Cooperative',
      department: 'Society for Elimination of Rural Poverty (SERP)',
      categories: ['credit', 'telangana'],
      matchPercent: '95% Match',
      tags: ['Telangana State', 'SHG Credit'],
      benefit: 'Disbursal within 48 Hours',
      subBenefit: 'Affordable Rates',
      portalUrl: 'https://streenidhi.telangana.gov.in',
    },
    {
      id: '3',
      title: 'PM Suraksha Bima (PMSBY)',
      department: 'Ministry of Finance, Government of India',
      categories: ['insurance'],
      matchPercent: '100% Match',
      tags: ['Insurance', 'Accident Cover'],
      benefit: '₹2,00,000 Coverage',
      subBenefit: '₹20 / Year',
      portalUrl: 'https://www.jansuraksha.gov.in',
    },
  ];

  const filteredSchemes = schemes.filter((s) => {
    const matchesCat = selectedCategory === 'all' || s.categories.includes(selectedCategory);
    const matchesSearch =
      !searchQuery ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleOpenDetail = (scheme: any) => {
    setSelectedScheme(scheme);
    setDetailVisible(true);
  };

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
          {/* Header Title */}
          <View className="mb-3">
          <View className="flex-row items-center self-start px-2.5 py-0.5 rounded-full bg-surface-container-high mb-1">
            <MaterialIcons name="verified" size={13} color="#9d4300" />
            <Text className="text-[10px] text-on-surface-variant ml-1 font-semibold">
              Verified Government Programs
            </Text>
          </View>
          <Text className="text-xl font-bold text-on-surface">Government Benefits & Schemes</Text>
        </View>

        {/* Hero Matcher Card */}
        <View className="relative overflow-hidden rounded-xl bg-surface-container p-4 shadow-sm mb-3.5 border border-surface-container-highest/60">
          <View className="flex-row items-center mb-2.5">
            <View className="w-9 h-9 rounded-full bg-primary-container items-center justify-center mr-2.5 shadow-xs">
              <MaterialIcons name="auto-awesome" size={18} color="#ffffff" />
            </View>
            <Text className="text-sm font-bold text-on-surface flex-1">
              Find Schemes You May Be Eligible For
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setMatcherVisible(true)}
            className="w-full min-h-[46px] rounded-lg bg-primary-container flex-row items-center justify-center shadow-xs active:scale-[0.98]">
            <Text className="text-xs font-bold text-on-primary mr-1">Start Guided Matcher</Text>
            <MaterialIcons name="arrow-forward" size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="relative flex-row items-center bg-surface-container-lowest rounded-xl px-3 py-2 border border-surface-container-highest/60 mb-2.5 shadow-xs">
          <MaterialIcons name="search" size={18} color="#8c7164" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search schemes, subsidies, loans..."
            placeholderTextColor="#8c7164"
            className="flex-1 ml-2 text-xs text-on-surface"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="close" size={16} color="#8c7164" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-1.5 mb-3.5">
          {categories.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                className={`h-8 px-3.5 rounded-full items-center justify-center ${
                  active ? 'bg-primary-container shadow-xs' : 'bg-surface-container-lowest border border-surface-container-highest/60'
                } active:scale-95`}>
                <Text
                  className={`text-xs font-semibold ${
                    active ? 'text-on-primary' : 'text-on-surface'
                  }`}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Schemes Feed */}
        <View className="flex-col gap-3 mb-4">
          {filteredSchemes.map((scheme) => (
            <View
              key={scheme.id}
              className="rounded-xl bg-surface-container-lowest p-3.5 shadow-xs border border-surface-container-highest/60 flex-col gap-2.5">
              <View className="flex-row items-start justify-between">
                <View className="flex-col flex-1 mr-2">
                  <View className="flex-row items-center gap-1.5 mb-1 flex-wrap">
                    {scheme.tags.map((t, idx) => (
                      <View key={idx} className="bg-surface-container-high px-2 py-0.5 rounded-full">
                        <Text className="text-[10px] text-on-surface-variant font-medium">{t}</Text>
                      </View>
                    ))}
                  </View>
                  <Text className="text-sm font-bold text-on-surface">{scheme.title}</Text>
                </View>
                <View className="bg-primary-fixed px-2.5 py-1 rounded-full flex-row items-center">
                  <MaterialIcons name="stars" size={13} color="#9d4300" />
                  <Text className="text-[10px] font-bold text-primary-on-fixed ml-1">{scheme.matchPercent}</Text>
                </View>
              </View>

              {/* Benefit Banner */}
              <View className="bg-surface-container-low p-2.5 rounded-lg flex-row items-center justify-between border border-surface-container-highest/40">
                <View className="flex-row items-center">
                  <MaterialIcons name="currency-rupee" size={15} color="#9d4300" />
                  <Text className="text-xs font-bold text-on-surface ml-1">{scheme.benefit}</Text>
                </View>
                <Text className="text-[11px] text-on-surface-variant font-medium">{scheme.subBenefit}</Text>
              </View>

              {/* Action Buttons */}
              <View className="flex-row items-center justify-between pt-1 border-t border-surface-container-highest/40">
                <TouchableOpacity
                  onPress={() => setAskSakhiVisible(true)}
                  className="flex-row items-center active:scale-95">
                  <MaterialIcons name="volume-up" size={16} color="#9d4300" />
                  <Text className="text-xs font-bold text-primary ml-1">Listen in Telugu</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleOpenDetail(scheme)}
                  className="h-8 px-3 rounded-lg bg-surface-container-high flex-row items-center active:scale-95">
                  <Text className="text-xs font-bold text-on-surface mr-1">Details & Source</Text>
                  <MaterialIcons name="open-in-new" size={14} color="#584237" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Need Help Applying */}
        <View className="rounded-xl bg-surface-container p-3.5 flex-col gap-2.5 border border-surface-container-highest/60 mb-2">
          <View className="flex-row items-center">
            <MaterialIcons name="live-help" size={18} color="#9d4300" />
            <Text className="text-xs font-bold text-on-surface ml-1.5">Need Help Applying?</Text>
          </View>
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => Linking.openURL('tel:1800000123').catch(() => {})}
              className="flex-1 h-10 rounded-lg bg-surface-container-lowest flex-row items-center justify-center shadow-xs active:scale-95">
              <MaterialIcons name="support-agent" size={16} color="#9d4300" />
              <Text className="text-xs font-bold text-on-surface ml-1">Call Helpline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/settings' as any)}
              className="flex-1 h-10 rounded-lg bg-surface-container-lowest flex-row items-center justify-center shadow-xs active:scale-95">
              <MaterialIcons name="pin-drop" size={16} color="#b3291b" />
              <Text className="text-xs font-bold text-on-surface ml-1">Find Center</Text>
            </TouchableOpacity>
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

      <SchemeDetailModal
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
        scheme={selectedScheme}
      />
      <EligibilityMatcherModal
        visible={matcherVisible}
        onClose={() => setMatcherVisible(false)}
      />
      <AskSakhiModal visible={askSakhiVisible} onClose={() => setAskSakhiVisible(false)} />
      <ProfileModal visible={profileVisible} onClose={() => setProfileVisible(false)} />
    </SafeAreaView>
  );
}
