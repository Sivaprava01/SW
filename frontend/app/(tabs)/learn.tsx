import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SakhiHeader } from '@/components/SakhiHeader';
import { AskSakhiModal } from '@/components/AskSakhiModal';
import { ProfileModal } from '@/components/ProfileModal';
import { useApp } from '@/context/AppContext';
import { LEARN_LEVELS, LEARN_TIERS, LearnLevelData } from '@/constants/learnLevels';
import { LevelJourneyMap } from '@/components/learn/LevelJourneyMap';
import { LevelDetailModal } from '@/components/learn/LevelDetailModal';
import { tokenStorage } from '@/services/tokenStorage';

export default function LearnScreen() {
  const router = useRouter();
  const {
    currentUser,
    language,
    setLanguage,
    learningProgress,
    refreshLearningProgress,
    completeLesson,
    userId,
  } = useApp();

  const activeLang = (language === 'hi' || language === 'te' || language === 'en') ? language : 'te';

  const [askSakhiVisible, setAskSakhiVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<LearnLevelData | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTierFilter, setSelectedTierFilter] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // ScrollView reference
  const scrollViewRef = useRef<ScrollView>(null);

  // Completed level numbers set (e.g. Set([1, 2]))
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set());

  // Load account-specific completed levels from tokenStorage
  const loadCompletedLevels = useCallback(async () => {
    if (!userId) {
      setCompletedLevels(new Set());
      return;
    }
    try {
      const persisted = await tokenStorage.getCompletedLevels(userId);
      const levelSet = new Set<number>(persisted);

      // If backend has completed lessons, map them to corresponding levels
      if (learningProgress?.completed_lesson_ids) {
        learningProgress.completed_lesson_ids.forEach((lessonId) => {
          const matchedLevel = LEARN_LEVELS.find((l) => l.backendLessonId === lessonId);
          if (matchedLevel) {
            levelSet.add(matchedLevel.levelNumber);
          }
        });
      }

      setCompletedLevels(levelSet);
    } catch (err) {
      if (__DEV__) console.warn('[LearnScreen] Failed to load completed levels:', err);
    }
  }, [userId, learningProgress]);

  useEffect(() => {
    loadCompletedLevels();
  }, [loadCompletedLevels]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.allSettled([refreshLearningProgress(), loadCompletedLevels()]);
    setRefreshing(false);
  }, [refreshLearningProgress, loadCompletedLevels]);

  // Current active level is the first incomplete level (or Level 1)
  const currentLevelNumber = useMemo(() => {
    for (let i = 1; i <= LEARN_LEVELS.length; i++) {
      if (!completedLevels.has(i)) {
        return i;
      }
    }
    return LEARN_LEVELS.length; // All 15 completed!
  }, [completedLevels]);

  // Overall progress metrics for 15 levels
  const completedCount = completedLevels.size;
  const progressPercentage = Math.round((completedCount / LEARN_LEVELS.length) * 100);

  // Handle level completion
  const handleCompleteLevel = async (levelNumber: number) => {
    if (!userId) return;

    const newCompleted = new Set(completedLevels);
    newCompleted.add(levelNumber);
    setCompletedLevels(newCompleted);

    // Save to persistent account storage
    await tokenStorage.setCompletedLevels(userId, Array.from(newCompleted));

    // If matching backend lesson exists, sync with backend
    const targetLevel = LEARN_LEVELS.find((l) => l.levelNumber === levelNumber);
    if (targetLevel?.backendLessonId) {
      try {
        await completeLesson(targetLevel.backendLessonId, 100);
      } catch (e) {
        if (__DEV__) console.warn('[LearnScreen] Sync completeLesson error:', e);
      }
    }
  };

  const handleSelectLevel = (level: LearnLevelData) => {
    setSelectedLevel(level);
    setDetailModalVisible(true);
  };

  const toggleLanguage = () => {
    if (language === 'te') setLanguage('hi');
    else if (language === 'hi') setLanguage('en');
    else setLanguage('te');
  };

  const languageLabel = language === 'te' ? 'తెలుగు' : language === 'hi' ? 'हिंदी' : 'English';

  // Filter levels if specific tier selected
  const displayedLevels = useMemo(() => {
    if (selectedTierFilter === null) {
      return LEARN_LEVELS;
    }
    return LEARN_LEVELS.filter((l) => l.tierId === selectedTierFilter);
  }, [selectedTierFilter]);

  const labels = {
    badgeMap: activeLang === 'te' ? '15-దశల అభ్యాస ప్రయాణం' : activeLang === 'hi' ? '15-स्तरीय शिक्षा यात्रा' : '15-Level Learning Map',
    title: activeLang === 'te' ? 'ఆర్థిక అభ్యాస ప్రయాణం' : activeLang === 'hi' ? 'वित्तीय शिक्षा यात्रा' : 'Financial Learning Journey',
    subtitle: activeLang === 'te' ? '15 ముఖ్యమైన ఆర్థిక పాఠాలు. ప్రతి పాఠంతో స్వయం సమృద్ధి సాధించండి.' : activeLang === 'hi' ? '15 महत्वपूर्ण वित्तीय पाठ। हर कदम पर आत्मविश्वास बढ़ाएं।' : '15 essential financial lessons. Build confidence step by step.',
    progressText: (curr: number, total: number) =>
      activeLang === 'te' ? `లెవెల్ ${curr} / ${total} అన్‌లాక్ అయింది` : activeLang === 'hi' ? `स्तर ${curr} / ${total} खुला है` : `Level ${curr} of ${total} Active`,
    completedStat: (done: number, total: number) =>
      activeLang === 'te' ? `${done} / ${total} లెవెల్స్ పూర్తి` : activeLang === 'hi' ? `${done} / ${total} स्तर पूरे` : `${done} of ${total} Completed`,
    allTiers: activeLang === 'te' ? 'అన్ని 15 లెవెల్స్' : activeLang === 'hi' ? 'सभी 15 स्तर' : 'All 15 Levels',
    voiceBadge: activeLang === 'te' ? 'వాయిస్ & స్క్రిప్ట్' : activeLang === 'hi' ? 'ऑडियो और भाषा' : 'Voice & Text',
    askSakhi: activeLang === 'te' ? 'సఖిని అడగండి' : activeLang === 'hi' ? 'सखी से पूछें' : 'Ask Sakhi',
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#9d4300"
            colors={['#9d4300']}
          />
        }
      >
        {/* Top App Bar / Header */}
        <SakhiHeader
          logoOnly={true}
          onPressProfile={() => setProfileVisible(true)}
          onPressMenu={() => router.push('/settings' as any)}
        />

        <View className="px-4 py-3">
          {/* Main Hero Header Block */}
          <View className="mb-3">
            <View className="flex-row items-center justify-between mb-1.5 flex-wrap">
              <View className="flex-row items-center bg-primary-fixed px-2.5 py-0.5 rounded-full">
                <MaterialIcons name="explore" size={13} color="#341100" />
                <Text className="text-[10px] font-bold text-primary-on-fixed ml-1 uppercase tracking-wider">
                  {labels.badgeMap}
                </Text>
              </View>

              {/* Language Switcher Pill */}
              <TouchableOpacity
                onPress={toggleLanguage}
                className="px-2.5 py-1 rounded-full bg-surface-container-high flex-row items-center border border-surface-container-highest/60 shadow-2xs"
              >
                <MaterialIcons name="translate" size={12} color="#9d4300" />
                <Text className="text-[11px] font-bold text-primary ml-1 mr-0.5">
                  {languageLabel}
                </Text>
                <MaterialIcons name="expand-more" size={14} color="#9d4300" />
              </TouchableOpacity>
            </View>

            <Text className="text-2xl font-bold text-on-surface">
              {labels.title}
            </Text>
            <Text className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
              {labels.subtitle}
            </Text>
          </View>

          {/* Journey Overall Progress Card */}
          <View className="rounded-2xl bg-surface-container p-4 shadow-sm border border-surface-container-highest/70 mb-3.5">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center flex-1 mr-2">
                <View className="w-8 h-8 rounded-xl bg-primary-container items-center justify-center mr-2 shadow-2xs">
                  <MaterialIcons name="military-tech" size={20} color="#ffffff" />
                </View>
                <View className="flex-col flex-1 min-w-0">
                  <Text className="text-xs font-bold text-on-surface truncate">
                    {labels.progressText(currentLevelNumber, LEARN_LEVELS.length)}
                  </Text>
                  <Text className="text-[11px] text-on-surface-variant font-medium truncate">
                    {labels.completedStat(completedCount, LEARN_LEVELS.length)} ({progressPercentage}%)
                  </Text>
                </View>
              </View>

              <View className="bg-primary-fixed px-2.5 py-1 rounded-full">
                <Text className="text-xs font-bold text-primary font-mono">
                  {progressPercentage}%
                </Text>
              </View>
            </View>

            {/* Progress Bar Track */}
            <View className="w-full bg-surface-container-highest h-2.5 rounded-full overflow-hidden">
              <View
                className="bg-primary h-full rounded-full"
                style={{ width: `${Math.max(4, Math.min(100, progressPercentage))}%` }}
              />
            </View>
          </View>

          {/* Tier Quick-Filter Scroll Bar */}
          <View className="mb-2">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 4, gap: 8 }}
            >
              {/* All Levels Button */}
              <TouchableOpacity
                onPress={() => setSelectedTierFilter(null)}
                className={`px-3 py-1.5 rounded-full border shadow-2xs ${
                  selectedTierFilter === null
                    ? 'bg-primary border-primary'
                    : 'bg-surface-container-high border-surface-container-highest/60'
                }`}
              >
                <Text
                  className={`text-[11px] font-bold ${
                    selectedTierFilter === null ? 'text-white' : 'text-on-surface'
                  }`}
                >
                  {labels.allTiers}
                </Text>
              </TouchableOpacity>

              {/* 5 Tier Filters */}
              {LEARN_TIERS.map((tier) => {
                const isSelected = selectedTierFilter === tier.id;
                const tierName = tier.name[activeLang] || tier.name.en;

                return (
                  <TouchableOpacity
                    key={tier.id}
                    onPress={() => setSelectedTierFilter(isSelected ? null : tier.id)}
                    className={`px-3 py-1.5 rounded-full border shadow-2xs ${
                      isSelected
                        ? 'bg-primary border-primary'
                        : 'bg-surface-container-high border-surface-container-highest/60'
                    }`}
                  >
                    <Text
                      className={`text-[11px] font-bold ${
                        isSelected ? 'text-white' : 'text-on-surface'
                      }`}
                    >
                      {tierName}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* 15-Level Ascending Learning Journey Map */}
          <LevelJourneyMap
            levels={displayedLevels}
            completedLevels={completedLevels}
            currentLevelNumber={currentLevelNumber}
            onSelectLevel={handleSelectLevel}
          />
        </View>
      </ScrollView>

      {/* Floating Ask Sakhi button */}
      <View className="absolute bottom-20 right-4 z-40">
        <TouchableOpacity
          onPress={() => setAskSakhiVisible(true)}
          className="h-11 px-3.5 rounded-full bg-primary-container flex-row items-center shadow-lg active:scale-95"
        >
          <MaterialIcons name="auto-awesome" size={20} color="#ffffff" />
          <Text className="text-on-primary font-headline-sm text-[14px] font-bold ml-1.5">
            {labels.askSakhi}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <LevelDetailModal
        level={selectedLevel}
        visible={detailModalVisible}
        isCompleted={selectedLevel ? completedLevels.has(selectedLevel.levelNumber) : false}
        onClose={() => setDetailModalVisible(false)}
        onCompleteLevel={handleCompleteLevel}
      />

      <AskSakhiModal visible={askSakhiVisible} onClose={() => setAskSakhiVisible(false)} />
      <ProfileModal visible={profileVisible} onClose={() => setProfileVisible(false)} />
    </SafeAreaView>
  );
}
