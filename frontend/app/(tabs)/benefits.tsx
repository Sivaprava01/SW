import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Linking,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SakhiHeader } from '@/components/SakhiHeader';
import { SchemeDetailModal } from '@/components/SchemeDetailModal';
import { SchemeCard } from '@/components/SchemeCard';
import { EligibilityMatcherModal } from '@/components/EligibilityMatcherModal';
import { AskSakhiModal } from '@/components/AskSakhiModal';
import { ProfileModal } from '@/components/ProfileModal';
import { TutorialTarget } from '@/components/tutorial/TutorialTarget';
import { useApp } from '@/context/AppContext';
import { SchemeMatchResponse, SchemeResponse } from '@/types/scheme';
import { schemeService } from '@/services/schemeService';
import { voiceService } from '@/services/voiceService';
import { audioPlayer } from '@/services/audioPlayer';

export default function BenefitsScreen() {
  const router = useRouter();
  const { matchedSchemes, refreshMatchedSchemes, userId, language } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedScheme, setSelectedScheme] = useState<SchemeMatchResponse | SchemeResponse | null>(null);
  const [matcherVisible, setMatcherVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [askSakhiVisible, setAskSakhiVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [catalogSchemes, setCatalogSchemes] = useState<SchemeResponse[]>([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);
  const [loadingAudioId, setLoadingAudioId] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribe = audioPlayer.subscribe((event) => {
      if (event.state === 'playing' && event.currentId && event.currentId.startsWith('benefits-card-')) {
        const id = parseInt(event.currentId.replace('benefits-card-', ''), 10);
        setPlayingAudioId(isNaN(id) ? null : id);
        setLoadingAudioId(null);
      } else if (event.state === 'loading' && event.currentId && event.currentId.startsWith('benefits-card-')) {
        const id = parseInt(event.currentId.replace('benefits-card-', ''), 10);
        setLoadingAudioId(isNaN(id) ? null : id);
      } else {
        setPlayingAudioId(null);
        setLoadingAudioId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleAudio = async (scheme: SchemeResponse | SchemeMatchResponse) => {
    const trackId = `benefits-card-${scheme.id}`;
    if (playingAudioId === scheme.id) {
      audioPlayer.stop();
      return;
    }
    try {
      setLoadingAudioId(scheme.id);
      const lang = language || 'te';
      let narration = '';
      if (lang === 'te') {
        narration = `నమస్తే అక్క. ${scheme.name} పథకం వివరాలు: ప్రయోజనం ${scheme.benefit_amount_display}. అర్హులు: ${scheme.target_beneficiaries}.`;
      } else if (lang === 'hi') {
        narration = `नमस्ते दीदी। ${scheme.name} योजना विवरण: लाभ ${scheme.benefit_amount_display}। लक्षित लाभार्थी: ${scheme.target_beneficiaries}।`;
      } else {
        narration = `Namaste Sister. Scheme: ${scheme.name}. Benefit: ${scheme.benefit_amount_display}. Target: ${scheme.target_beneficiaries}.`;
      }

      const res = await voiceService.synthesizeSpeech({
        text: narration,
        language: lang,
        speed: 1.0,
        audio_format: 'mp3',
      });

      await audioPlayer.playBase64(res.audio_base64, 'mp3', trackId);
    } catch (err) {
      if (__DEV__) console.warn('[BenefitsScreen] Failed to synthesize speech:', err);
      setLoadingAudioId(null);
    }
  };

  // Load all catalog schemes on mount to provide comprehensive search & category counts
  const loadCatalog = useCallback(async () => {
    try {
      setIsLoadingCatalog(true);
      const list = await schemeService.getSchemes();
      setCatalogSchemes(list);
    } catch (err) {
      if (__DEV__) console.warn('[BenefitsScreen] Failed to load catalog:', err);
    } finally {
      setIsLoadingCatalog(false);
    }
  }, []);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.allSettled([refreshMatchedSchemes(), loadCatalog()]);
    setRefreshing(false);
  }, [refreshMatchedSchemes, loadCatalog]);

  // Combine matched schemes with catalog schemes for display
  const displaySchemes = useMemo(() => {
    if (matchedSchemes && matchedSchemes.length > 0) {
      return matchedSchemes;
    }
    return catalogSchemes;
  }, [matchedSchemes, catalogSchemes]);

  // Dynamic category tabs with real counts
  const categories = useMemo(() => {
    const counts: { [key: string]: number } = {
      all: displaySchemes.length,
      enterprise: 0,
      credit: 0,
      insurance: 0,
      pension: 0,
      savings: 0,
    };

    displaySchemes.forEach((s) => {
      const cat = (s.category || '').toLowerCase();
      if (cat.includes('enterprise') || cat.includes('livelihood') || cat.includes('business')) {
        counts.enterprise++;
      } else if (cat.includes('credit') || cat.includes('loan') || cat.includes('shg')) {
        counts.credit++;
      } else if (cat.includes('insurance') || cat.includes('bima') || cat.includes('protection')) {
        counts.insurance++;
      } else if (cat.includes('pension') || cat.includes('retirement')) {
        counts.pension++;
      } else if (cat.includes('savings') || cat.includes('deposit')) {
        counts.savings++;
      }
    });

    return [
      { id: 'all', label: `All (${counts.all})` },
      { id: 'enterprise', label: `Women Enterprise (${counts.enterprise})` },
      { id: 'credit', label: `SHG Credit (${counts.credit})` },
      { id: 'insurance', label: `Insurance (${counts.insurance})` },
      { id: 'pension', label: `Pension (${counts.pension})` },
    ];
  }, [displaySchemes]);

  const filteredSchemes = useMemo(() => {
    return displaySchemes.filter((s) => {
      const cat = (s.category || '').toLowerCase();
      const jur = (s.jurisdiction || '').toLowerCase();
      const matchesCat =
        selectedCategory === 'all' ||
        (selectedCategory === 'enterprise' && (cat.includes('enterprise') || cat.includes('livelihood') || cat.includes('business'))) ||
        (selectedCategory === 'credit' && (cat.includes('credit') || cat.includes('loan') || cat.includes('shg'))) ||
        (selectedCategory === 'insurance' && (cat.includes('insurance') || cat.includes('bima') || cat.includes('protection'))) ||
        (selectedCategory === 'pension' && (cat.includes('pension') || cat.includes('retirement'))) ||
        (selectedCategory === 'savings' && (cat.includes('savings') || cat.includes('deposit'))) ||
        jur.includes(selectedCategory);

      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        s.name.toLowerCase().includes(q) ||
        (s.short_name && s.short_name.toLowerCase().includes(q)) ||
        (s.description && s.description.toLowerCase().includes(q)) ||
        (s.what_it_provides && s.what_it_provides.toLowerCase().includes(q)) ||
        (s.target_beneficiaries && s.target_beneficiaries.toLowerCase().includes(q));

      return matchesCat && matchesSearch;
    });
  }, [displaySchemes, selectedCategory, searchQuery]);

  const handleOpenDetail = (scheme: SchemeMatchResponse | SchemeResponse) => {
    setSelectedScheme(scheme);
    setDetailVisible(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 90 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#9d4300"
            colors={['#9d4300']}
          />
        }>
        {/* Top App Bar / Header */}
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
          <TutorialTarget id="schemes-search-box">
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
          </TutorialTarget>

          {/* Filter Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-1.5 mb-3.5">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id)}
                  className={`h-8 px-3.5 rounded-full items-center justify-center ${
                    active
                      ? 'bg-primary-container shadow-xs'
                      : 'bg-surface-container-lowest border border-surface-container-highest/60'
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

          {/* Loading Indicator */}
          {isLoadingCatalog && displaySchemes.length === 0 && (
            <View className="py-12 items-center justify-center">
              <ActivityIndicator size="large" color="#9d4300" />
              <Text className="text-xs text-on-surface-variant mt-2 font-medium">
                Loading verified government schemes...
              </Text>
            </View>
          )}

          {/* Empty Search State */}
          {!isLoadingCatalog && filteredSchemes.length === 0 && (
            <View className="py-10 items-center justify-center bg-surface-container-lowest rounded-xl border border-surface-container-highest/60 p-6 mb-4">
              <MaterialIcons name="search-off" size={36} color="#8c7164" />
              <Text className="text-sm font-bold text-on-surface mt-2">No matching schemes found</Text>
              <Text className="text-xs text-on-surface-variant text-center mt-1">
                Try a different keyword or tap "All" to browse all verified welfare programs.
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-3 px-4 py-2 rounded-lg bg-primary-container">
                <Text className="text-xs font-bold text-on-primary">Clear Filters</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Schemes Feed */}
          <View className="flex-col gap-3.5 mb-4">
            {filteredSchemes.map((scheme, idx) => {
              const cardContent = (
                <SchemeCard
                  key={scheme.id}
                  scheme={scheme}
                  isPlayingAudio={playingAudioId === scheme.id}
                  isLoadingAudio={loadingAudioId === scheme.id}
                  onToggleAudio={toggleAudio}
                  onOpenDetail={handleOpenDetail}
                  language={language}
                />
              );

              if (idx === 0) {
                return (
                  <TutorialTarget
                    key={scheme.id}
                    id="schemes-first-card"
                    onTargetPress={() => handleOpenDetail(scheme)}>
                    {cardContent}
                  </TutorialTarget>
                );
              }

              return cardContent;
            })}
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
