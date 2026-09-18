import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { schemeService } from '@/services/schemeService';
import { voiceService } from '@/services/voiceService';
import { audioPlayer } from '@/services/audioPlayer';
import { SchemeMatchResponse, SchemeResponse } from '@/types/scheme';
import { SchemeDetailModal } from '@/components/SchemeDetailModal';
import { EligibilityMatcherModal } from '@/components/EligibilityMatcherModal';

export default function SchemesScreen() {
  const router = useRouter();
  const { matchedSchemes, refreshMatchedSchemes, currentUser, language } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);
  const [loadingAudioId, setLoadingAudioId] = useState<number | null>(null);
  const [catalogSchemes, setCatalogSchemes] = useState<SchemeResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<SchemeMatchResponse | SchemeResponse | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [matcherVisible, setMatcherVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = audioPlayer.subscribe((event) => {
      if (event.state === 'playing' && event.currentId && event.currentId.startsWith('scheme-card-')) {
        const id = parseInt(event.currentId.replace('scheme-card-', ''), 10);
        setPlayingAudioId(isNaN(id) ? null : id);
        setLoadingAudioId(null);
      } else if (event.state === 'loading' && event.currentId && event.currentId.startsWith('scheme-card-')) {
        const id = parseInt(event.currentId.replace('scheme-card-', ''), 10);
        setLoadingAudioId(isNaN(id) ? null : id);
      } else {
        setPlayingAudioId(null);
        setLoadingAudioId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadCatalog = useCallback(async () => {
    try {
      setIsLoading(true);
      const list = await schemeService.getSchemes();
      setCatalogSchemes(list);
    } catch (err) {
      if (__DEV__) console.warn('[SchemesScreen] Failed to load catalog:', err);
    } finally {
      setIsLoading(false);
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

  const displaySchemes = useMemo(() => {
    if (matchedSchemes && matchedSchemes.length > 0) {
      return matchedSchemes;
    }
    return catalogSchemes;
  }, [matchedSchemes, catalogSchemes]);

  const categories = useMemo(() => {
    const counts: { [key: string]: number } = {
      all: displaySchemes.length,
      enterprise: 0,
      credit: 0,
      insurance: 0,
      pension: 0,
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
    return displaySchemes.filter((scheme) => {
      const cat = (scheme.category || '').toLowerCase();
      const matchesCategory =
        selectedCategory === 'all' ||
        (selectedCategory === 'enterprise' && (cat.includes('enterprise') || cat.includes('livelihood') || cat.includes('business'))) ||
        (selectedCategory === 'credit' && (cat.includes('credit') || cat.includes('loan') || cat.includes('shg'))) ||
        (selectedCategory === 'insurance' && (cat.includes('insurance') || cat.includes('bima') || cat.includes('protection'))) ||
        (selectedCategory === 'pension' && (cat.includes('pension') || cat.includes('retirement')));

      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        scheme.name.toLowerCase().includes(q) ||
        (scheme.short_name && scheme.short_name.toLowerCase().includes(q)) ||
        (scheme.description && scheme.description.toLowerCase().includes(q)) ||
        (scheme.what_it_provides && scheme.what_it_provides.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [displaySchemes, selectedCategory, searchQuery]);

  const toggleAudio = async (scheme: SchemeResponse | SchemeMatchResponse) => {
    const trackId = `scheme-card-${scheme.id}`;
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
      if (__DEV__) console.warn('[SchemesScreen] Failed to synthesize speech:', err);
      setLoadingAudioId(null);
    }
  };

  const handleOpenDetail = (scheme: SchemeMatchResponse | SchemeResponse) => {
    setSelectedScheme(scheme);
    setDetailVisible(true);
  };

  const userName = currentUser?.name || 'Lakshmi';
  const userAge = currentUser?.age || 28;
  const userState = currentUser?.state || 'Telangana';

  return (
    <SafeAreaView className="flex-1 bg-[#fff8f3]" edges={['top']}>
      {/* Header */}
      <View className="px-4 py-3 bg-[#fff8f3] border-b border-[#f1e0cc] flex-row items-center justify-between">
        <View className="flex-col">
          <View className="flex-row items-center gap-1 self-start px-2.5 py-0.5 rounded-full bg-[#f6e6d2] mb-1">
            <MaterialIcons name="verified" size={13} color="#9d4300" />
            <Text className="text-xs font-semibold text-[#584237]">
              Verified Government Programs
            </Text>
          </View>
          <Text className="text-xl font-bold text-[#221a0e]">
            Benefits & Schemes
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/settings' as any)}
          className="w-10 h-10 rounded-full bg-[#f6e6d2] items-center justify-center">
          <MaterialIcons name="tune" size={20} color="#221a0e" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#9d4300"
            colors={['#9d4300']}
          />
        }
      >
        <View className="p-4">
          {/* Guided Matcher Banner Card */}
          <View className="rounded-2xl bg-[#fcebd7] p-4 mb-4 border border-[#f1e0cc] shadow-sm">
            <View className="flex-row items-start space-x-3 mb-3">
              <View className="w-10 h-10 rounded-full bg-[#f97316] items-center justify-center mr-3 flex-shrink-0">
                <MaterialIcons name="auto-awesome" size={20} color="#ffffff" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-[#221a0e] leading-tight">
                  Find Schemes You May Be Eligible For
                </Text>
                <Text className="text-xs text-[#584237] mt-1 leading-relaxed">
                  FastAPI matches your profile ({userName}, {userAge}y, {userState}) automatically.
                </Text>
              </View>
            </View>

            <View className="flex-row items-center bg-white px-3 py-1.5 rounded-lg mb-3">
              <MaterialIcons name="psychology" size={16} color="#9d4300" />
              <Text className="text-xs text-[#584237] ml-1.5">
                Auto-synced: <Text className="font-bold text-[#221a0e]">{userName} ({userAge}y)</Text> • <Text className="font-bold text-[#221a0e]">{userState} SHG</Text>
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setMatcherVisible(true)}
              className="w-full h-11 rounded-xl bg-[#f97316] flex-row items-center justify-center shadow-sm active:scale-95">
              <Text className="text-white font-bold text-sm mr-1">
                Start Guided Matcher
              </Text>
              <MaterialIcons name="arrow-forward" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View className="flex-row items-center bg-white rounded-xl px-3 h-12 border border-[#f1e0cc] mb-3">
            <MaterialIcons name="search" size={20} color="#8c7164" />
            <TextInput
              className="flex-1 ml-2 text-sm text-[#221a0e]"
              placeholder="Search schemes, subsidies, loans..."
              placeholderTextColor="#8c7164"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <MaterialIcons name="close" size={18} color="#8c7164" />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Chips Scroll */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
          >
            <View className="flex-row gap-2">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-2 rounded-full mr-2 ${
                      isSelected ? 'bg-[#f97316]' : 'bg-white border border-[#f1e0cc]'
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        isSelected ? 'text-white' : 'text-[#584237]'
                      }`}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Loading Indicator */}
          {isLoading && displaySchemes.length === 0 && (
            <View className="py-12 items-center justify-center">
              <ActivityIndicator size="large" color="#9d4300" />
              <Text className="text-xs text-[#584237] mt-2 font-medium">
                Loading verified government schemes...
              </Text>
            </View>
          )}

          {/* Empty State */}
          {!isLoading && filteredSchemes.length === 0 && (
            <View className="py-10 items-center justify-center bg-white rounded-2xl border border-[#f1e0cc] p-6 mb-4">
              <MaterialIcons name="search-off" size={36} color="#8c7164" />
              <Text className="text-sm font-bold text-[#221a0e] mt-2">No matching schemes found</Text>
              <Text className="text-xs text-[#584237] text-center mt-1">
                Try a different keyword or browse all categories.
              </Text>
            </View>
          )}

          {/* Scheme Cards Feed */}
          <View className="space-y-4">
            {filteredSchemes.map((scheme) => {
              const isPlaying = playingAudioId === scheme.id;
              const matchScore =
                'match_score' in scheme && typeof (scheme as SchemeMatchResponse).match_score === 'number'
                  ? Math.round((scheme as SchemeMatchResponse).match_score)
                  : 100;

              const matchReason =
                'eligibility_reasons' in scheme && (scheme as SchemeMatchResponse).eligibility_reasons.length > 0
                  ? (scheme as SchemeMatchResponse).eligibility_reasons[0]
                  : scheme.target_beneficiaries;

              return (
                <View
                  key={scheme.id}
                  className="bg-white rounded-2xl p-4 border border-[#f1e0cc] shadow-sm mb-3"
                >
                  {/* Top Badge & Match */}
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="px-2 py-0.5 rounded-full bg-[#f6e6d2]">
                      <Text className="text-xs font-semibold text-[#584237]">
                        {scheme.jurisdiction || 'Central'} • {scheme.category}
                      </Text>
                    </View>
                    <View className="flex-row items-center px-2 py-0.5 rounded-full bg-[#ffdbca]">
                      <MaterialIcons name="stars" size={13} color="#9d4300" />
                      <Text className="text-xs font-bold text-[#9d4300] ml-1">
                        {matchScore}% Match
                      </Text>
                    </View>
                  </View>

                  <Text className="text-lg font-bold text-[#221a0e] mb-1">
                    {scheme.name}
                  </Text>

                  {/* Highlight Strip */}
                  <View className="bg-[#fff1e3] p-2.5 rounded-xl flex-row items-center justify-between mb-2.5">
                    <Text className="text-xs font-bold text-[#9d4300]">
                      {scheme.benefit_amount_display}
                    </Text>
                    <View className="flex-row gap-1">
                      <Text className="text-[11px] bg-white px-2 py-0.5 rounded text-[#584237]">
                        {scheme.cost_or_premium}
                      </Text>
                    </View>
                  </View>

                  {/* Benefit */}
                  <Text className="text-xs text-[#584237] leading-relaxed mb-3">
                    <Text className="font-bold text-[#221a0e]">Benefit: </Text>
                    {scheme.what_it_provides || scheme.description}
                  </Text>

                  {/* Why You Match */}
                  <View className="bg-[#fcebd7] p-2.5 rounded-xl flex-row items-start mb-3">
                    <MaterialIcons
                      name="check-circle"
                      size={16}
                      color="#9d4300"
                      style={{ marginTop: 2, marginRight: 6 }}
                    />
                    <Text className="text-xs text-[#584237] flex-1 leading-relaxed">
                      <Text className="font-bold text-[#9d4300]">Why You Match: </Text>
                      {matchReason}
                    </Text>
                  </View>

                  {/* Action Buttons */}
                  <View className="flex-row items-center justify-between pt-1 border-t border-[#f1e0cc]">
                    <TouchableOpacity
                      onPress={() => toggleAudio(scheme)}
                      disabled={loadingAudioId === scheme.id}
                      className="flex-row items-center py-1.5"
                    >
                      {loadingAudioId === scheme.id ? (
                        <ActivityIndicator size="small" color="#9d4300" style={{ marginRight: 4 }} />
                      ) : (
                        <MaterialIcons
                          name={isPlaying ? 'pause-circle' : 'volume-up'}
                          size={18}
                          color={isPlaying ? '#b3291b' : '#9d4300'}
                        />
                      )}
                      <Text
                        className={`text-xs font-bold ml-1 ${
                          isPlaying ? 'text-[#b3291b]' : 'text-[#9d4300]'
                        }`}
                      >
                        {isPlaying
                          ? 'వింటున్నారు...'
                          : language === 'te'
                          ? 'తెలుగులో వినండి'
                          : language === 'hi'
                          ? 'हिंदी में सुनें'
                          : 'Listen in English'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleOpenDetail(scheme)}
                      className="px-3 py-1.5 rounded-lg bg-[#f6e6d2] flex-row items-center"
                    >
                      <Text className="text-xs font-bold text-[#221a0e] mr-1">
                        Details & Source
                      </Text>
                      <MaterialIcons name="open-in-new" size={14} color="#221a0e" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <SchemeDetailModal
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
        scheme={selectedScheme}
      />
      <EligibilityMatcherModal
        visible={matcherVisible}
        onClose={() => setMatcherVisible(false)}
      />
    </SafeAreaView>
  );
}
