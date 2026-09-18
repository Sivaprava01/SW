import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { useRouter } from 'expo-router';
import { SakhiHeader } from '@/components/SakhiHeader';
import { AskSakhiModal } from '@/components/AskSakhiModal';
import { ProfileModal } from '@/components/ProfileModal';
import { TutorialTarget } from '@/components/tutorial/TutorialTarget';
import { useApp } from '@/context/AppContext';
import { learningService } from '@/services/learningService';
import { knowledgeService } from '@/services/knowledgeService';
import { voiceService } from '@/services/voiceService';
import { audioPlayer } from '@/services/audioPlayer';
import { ModuleResponse, LessonResponse } from '@/types/learning';
import { FinancialConceptResponse, GoldenRuleResponse } from '@/types/knowledge';
import { getLocalizedText } from '@/utils/localization';

export default function LearnScreen() {
  const router = useRouter();
  const {
    currentUser,
    financialSummary,
    language,
    setLanguage,
    learningProgress,
    refreshLearningProgress,
    completeLesson,
    userId,
  } = useApp();

  const [askSakhiVisible, setAskSakhiVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [expandedConceptId, setExpandedConceptId] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [loadingAudioId, setLoadingAudioId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [modules, setModules] = useState<ModuleResponse[]>([]);
  const [concepts, setConcepts] = useState<FinancialConceptResponse[]>([]);
  const [goldenRules, setGoldenRules] = useState<GoldenRuleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Quiz interactive state per lesson: { [lessonId]: { selectedOption: number, isSubmitted: boolean } }
  const [quizAnswers, setQuizAnswers] = useState<{
    [lessonId: string]: { selectedOption: number | null; isSubmitted: boolean };
  }>({});
  const [completingLessonId, setCompletingLessonId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [mods, concs, rules] = await Promise.all([
        learningService.getModules(),
        knowledgeService.getConcepts(),
        knowledgeService.getGoldenRules(),
      ]);
      setModules(mods);
      setConcepts(concs);
      setGoldenRules(rules);
      if (mods.length > 0 && !expandedModuleId) {
        setExpandedModuleId(mods[0].module_id);
      }
    } catch (err) {
      if (__DEV__) console.warn('[LearnScreen] Failed to load learning modules:', err);
    } finally {
      setIsLoading(false);
    }
  }, [expandedModuleId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.allSettled([loadData(), refreshLearningProgress()]);
    setRefreshing(false);
  }, [loadData, refreshLearningProgress]);

  const completedLessonIds = useMemo(() => {
    return new Set(learningProgress?.completed_lesson_ids || []);
  }, [learningProgress]);

  const surplusDisplay = financialSummary
    ? `₹${Math.round(financialSummary.monthly_surplus).toLocaleString('en-IN')}`
    : '₹4,200';

  const handleSelectQuizOption = (lessonId: string, optionIdx: number) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [lessonId]: { selectedOption: optionIdx, isSubmitted: false },
    }));
  };

  const handleCompleteLesson = async (lesson: LessonResponse) => {
    if (!userId) return;
    try {
      setCompletingLessonId(lesson.lesson_id);
      let quizScore = 100;
      if (lesson.quiz) {
        const answer = quizAnswers[lesson.lesson_id];
        const isCorrect = answer && answer.selectedOption === lesson.quiz.correct_option_index;
        quizScore = isCorrect ? 100 : 50;
        setQuizAnswers((prev) => ({
          ...prev,
          [lesson.lesson_id]: { ...prev[lesson.lesson_id], isSubmitted: true },
        }));
      }
      await completeLesson(lesson.lesson_id, quizScore);
    } catch (err) {
      if (__DEV__) console.warn('[LearnScreen] Complete lesson error:', err);
    } finally {
      setCompletingLessonId(null);
    }
  };

  useEffect(() => {
    const unsubscribe = audioPlayer.subscribe((event) => {
      if (event.state === 'playing') {
        setPlayingAudioId(event.currentId);
        setLoadingAudioId(null);
      } else if (event.state === 'loading') {
        setLoadingAudioId(event.currentId);
      } else {
        setPlayingAudioId(null);
        setLoadingAudioId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handlePlayLessonAudio = async (lesson: LessonResponse) => {
    const trackId = `lesson-${lesson.lesson_id}`;
    if (playingAudioId === trackId) {
      audioPlayer.stop();
      return;
    }
    try {
      setLoadingAudioId(trackId);
      const lessonNum = parseInt(lesson.lesson_id.replace(/\D/g, '') || '1', 10);
      const audioRes = await voiceService.getLessonAudio(lessonNum, language);
      await audioPlayer.playBase64(audioRes.audio_base64, audioRes.audio_format || 'mp3', trackId);
    } catch (err) {
      if (__DEV__) console.warn('[LearnScreen] Failed to fetch lesson audio:', err);
      setLoadingAudioId(null);
    }
  };

  const toggleLanguage = () => {
    if (language === 'te') setLanguage('hi');
    else if (language === 'hi') setLanguage('en');
    else setLanguage('te');
  };

  const languageLabel = language === 'te' ? 'తెలుగు (Telugu)' : language === 'hi' ? 'हिंदी (Hindi)' : 'English';

  const getModuleIcon = (iconName: string): any => {
    switch (iconName) {
      case 'shield':
      case 'shield-moon':
        return 'shield';
      case 'trending-down':
      case 'insights':
        return 'trending-down';
      case 'savings':
      case 'account-balance':
        return 'savings';
      case 'verified':
      case 'security':
        return 'verified';
      default:
        return 'auto-stories';
    }
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
          {/* Header Block */}
          <View className="mb-3">
            <View className="flex-row items-center gap-1.5 mb-1.5 flex-wrap">
              <View className="flex-row items-center bg-primary-fixed px-2.5 py-0.5 rounded-full">
                <MaterialIcons name="auto-stories" size={13} color="#341100" />
                <Text className="text-[10px] font-bold text-primary-on-fixed ml-1">
                  Financial Guidance
                </Text>
              </View>
              <View className="flex-row items-center bg-surface-container-high px-2 py-0.5 rounded-full">
                <MaterialIcons name="verified-user" size={12} color="#584237" />
                <Text className="text-[10px] text-on-surface-variant ml-1 font-semibold">
                  Plain Language
                </Text>
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
                  Voice & Script: <Text className="font-bold text-on-surface">{languageLabel}</Text>
                </Text>
              </View>
              <TouchableOpacity
                onPress={toggleLanguage}
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
                Based on your {surplusDisplay} surplus
              </Text>
              {learningProgress && (
                <Text className="text-[11px] text-on-surface-variant mt-0.5">
                  Progress: {learningProgress.completed_lessons_count} of {learningProgress.total_available_lessons} Lessons Completed ({Math.round(learningProgress.overall_progress_percentage)}%)
                </Text>
              )}
            </View>
          </View>

          {/* Loading Indicator */}
          {isLoading && modules.length === 0 && (
            <View className="py-10 items-center justify-center">
              <ActivityIndicator size="large" color="#9d4300" />
              <Text className="text-xs text-on-surface-variant mt-2 font-medium">
                Loading educational modules & micro-lessons...
              </Text>
            </View>
          )}

          {/* Topic Cards Accordion (Micro-Lessons) */}
          <View className="flex-col gap-3 mb-4">
            {modules.map((mod, idx) => {
              const isExpanded = expandedModuleId === mod.module_id;
              const title = getLocalizedText(mod.title, language);
              const desc = getLocalizedText(mod.description, language);
              const iconName = getModuleIcon(mod.icon);

              const moduleCard = (
                <View
                  key={mod.module_id}
                  className="rounded-xl bg-surface-container-lowest shadow-xs border border-surface-container-highest/60 overflow-hidden">
                  <TouchableOpacity
                    onPress={() => setExpandedModuleId(isExpanded ? null : mod.module_id)}
                    className="p-3.5 flex-row items-start justify-between">
                    <View className="flex-row items-start flex-1 mr-2">
                      <View className="w-10 h-10 rounded-xl bg-primary-fixed items-center justify-center mr-2.5 flex-shrink-0">
                        <MaterialIcons name={iconName} size={22} color="#9d4300" />
                      </View>
                      <View className="flex-col flex-1">
                        <View className="flex-row items-center space-x-1.5 flex-wrap">
                          <Text className="text-sm font-bold text-on-surface">{title}</Text>
                          <View className="bg-secondary-fixed px-2 py-0.2 rounded-full ml-1.5">
                            <Text className="text-[10px] font-bold text-on-secondary-fixed">
                              {mod.total_lessons} Lessons
                            </Text>
                          </View>
                        </View>
                        <Text className="text-[11px] text-on-surface-variant mt-0.5">{desc}</Text>
                      </View>
                    </View>
                    <MaterialIcons
                      name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                      size={22}
                      color="#584237"
                    />
                  </TouchableOpacity>

                  {isExpanded && (
                    <View className="px-3.5 pb-3.5 flex-col gap-3 pt-1 border-t border-surface-container-highest/40">
                      {mod.lessons.map((lesson) => {
                        const isCompleted = completedLessonIds.has(lesson.lesson_id);
                        const lessonTitle = getLocalizedText(lesson.title, language);
                        const takeaways = lesson.key_takeaways.map((t) => getLocalizedText(t, language));
                        const isCompleting = completingLessonId === lesson.lesson_id;
                        const quizState = quizAnswers[lesson.lesson_id];

                        return (
                          <View
                            key={lesson.lesson_id}
                            className="p-3 rounded-xl bg-surface-container flex-col gap-2 border border-surface-container-highest/40">
                            {/* Lesson Header */}
                            <View className="flex-row items-center justify-between">
                              <View className="flex-row items-center flex-1 mr-2">
                                <View
                                  className={`w-5 h-5 rounded-full items-center justify-center mr-2 ${
                                    isCompleted ? 'bg-primary' : 'bg-surface-container-highest'
                                  }`}>
                                  {isCompleted ? (
                                    <MaterialIcons name="check" size={13} color="#ffffff" />
                                  ) : (
                                    <MaterialIcons name="play-arrow" size={13} color="#9d4300" />
                                  )}
                                </View>
                                <Text className="text-xs font-bold text-on-surface flex-1">
                                  {lessonTitle}
                                </Text>
                              </View>
                              <View className="bg-surface-container-high px-2 py-0.5 rounded-full">
                                <Text className="text-[10px] font-semibold text-on-surface-variant">
                                  {lesson.duration_minutes} min
                                </Text>
                              </View>
                            </View>

                            {/* Takeaways list */}
                            <View className="flex-col gap-1 pl-7">
                              {takeaways.map((point, pIdx) => (
                                <View key={pIdx} className="flex-row items-start">
                                  <Text className="text-primary font-bold mr-1.5">•</Text>
                                  <Text className="text-[11px] text-on-surface-variant flex-1 leading-relaxed">
                                    {point}
                                  </Text>
                                </View>
                              ))}
                            </View>

                            {/* Optional Comprehension Quiz */}
                            {lesson.quiz && (
                              <View className="mt-2 p-2.5 rounded-lg bg-surface-container-lowest border border-surface-container-highest/60">
                                <Text className="text-[11px] font-bold text-primary mb-1">
                                  Quick Quiz: {getLocalizedText(lesson.quiz.question, language)}
                                </Text>
                                <View className="flex-col gap-1.5">
                                  {lesson.quiz.options.map((opt, oIdx) => {
                                    const isSelected = quizState?.selectedOption === oIdx;
                                    const isSubmitted = !!quizState?.isSubmitted;
                                    const isCorrectOpt = oIdx === lesson.quiz?.correct_option_index;

                                    let optBg = 'bg-surface-container-low';
                                    if (isSubmitted) {
                                      if (isCorrectOpt) optBg = 'bg-primary/20 border-primary';
                                      else if (isSelected) optBg = 'bg-error-container/40';
                                    } else if (isSelected) {
                                      optBg = 'bg-primary-container/20 border-primary-container';
                                    }

                                    return (
                                      <TouchableOpacity
                                        key={oIdx}
                                        onPress={() => handleSelectQuizOption(lesson.lesson_id, oIdx)}
                                        className={`p-2 rounded-lg flex-row items-center justify-between border border-surface-container-highest/40 ${optBg}`}>
                                        <Text className="text-[11px] text-on-surface flex-1">
                                          {getLocalizedText(opt, language)}
                                        </Text>
                                        {isSelected && (
                                          <MaterialIcons name="check" size={14} color="#9d4300" />
                                        )}
                                      </TouchableOpacity>
                                    );
                                  })}
                                </View>
                              </View>
                            )}

                            {/* Complete Action Button */}
                            <View className="flex-row items-center justify-between pt-1 border-t border-surface-container-highest/40">
                              <TouchableOpacity
                                onPress={() => handlePlayLessonAudio(lesson)}
                                disabled={loadingAudioId === `lesson-${lesson.lesson_id}`}
                                className="flex-row items-center active:scale-95">
                                {loadingAudioId === `lesson-${lesson.lesson_id}` ? (
                                  <ActivityIndicator size="small" color="#9d4300" style={{ marginRight: 4 }} />
                                ) : (
                                  <MaterialIcons
                                    name={playingAudioId === `lesson-${lesson.lesson_id}` ? 'pause-circle' : 'volume-up'}
                                    size={16}
                                    color="#9d4300"
                                  />
                                )}
                                <Text className="text-[11px] font-bold text-primary ml-1">
                                  {playingAudioId === `lesson-${lesson.lesson_id}`
                                    ? 'Playing...'
                                    : `Listen in ${language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English'}`}
                                </Text>
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress={() => handleCompleteLesson(lesson)}
                                disabled={isCompleting || isCompleted}
                                className={`px-3 py-1.5 rounded-lg flex-row items-center active:scale-95 ${
                                  isCompleted ? 'bg-surface-container-high' : 'bg-primary'
                                }`}>
                                {isCompleting ? (
                                  <ActivityIndicator size="small" color="#ffffff" />
                                ) : (
                                  <>
                                    <MaterialIcons
                                      name={isCompleted ? 'done-all' : 'check'}
                                      size={14}
                                      color={isCompleted ? '#584237' : '#ffffff'}
                                    />
                                    <Text
                                      className={`text-[11px] font-bold ml-1 ${
                                        isCompleted ? 'text-on-surface-variant' : 'text-on-primary'
                                      }`}>
                                      {isCompleted ? 'Completed' : 'Mark Done'}
                                    </Text>
                                  </>
                                )}
                              </TouchableOpacity>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              );

              if (idx === 0) {
                return (
                  <TutorialTarget
                    key={mod.module_id}
                    id="learn-first-module"
                    onTargetPress={() => setExpandedModuleId(isExpanded ? null : mod.module_id)}
                  >
                    {moduleCard}
                  </TutorialTarget>
                );
              }

              return moduleCard;
            })}
          </View>

          {/* 5 Golden Rules of Sakhi */}
          {goldenRules.length > 0 && (
            <TutorialTarget id="learn-rules-card">
              <View className="mb-4">
                <View className="flex-row items-center mb-2 px-0.5">
                  <MaterialIcons name="military-tech" size={18} color="#9d4300" />
                  <Text className="text-sm font-bold text-on-surface ml-1">
                    5 Golden Rules of Sakhi
                  </Text>
                </View>

                <View className="flex-col gap-2">
                  {goldenRules.map((rule) => (
                    <View
                      key={rule.rule_number}
                      className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container-highest/60 flex-row items-start shadow-xs">
                      <View className="w-6 h-6 rounded-full bg-primary items-center justify-center mr-2.5 mt-0.5 flex-shrink-0">
                        <Text className="text-xs font-bold text-on-primary">{rule.rule_number}</Text>
                      </View>
                      <View className="flex-col flex-1">
                        <View className="flex-row items-center justify-between">
                          <Text className="text-xs font-bold text-on-surface">
                            {getLocalizedText(rule.title, language)}
                          </Text>
                          <View className="bg-primary-fixed px-2 py-0.5 rounded-full">
                            <Text className="text-[10px] font-bold text-primary-on-fixed">
                              {rule.short_formula}
                            </Text>
                          </View>
                        </View>
                        <Text className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                          {getLocalizedText(rule.explanation, language)}
                        </Text>
                        <Text className="text-[10px] font-medium text-secondary mt-1">
                          💡 {getLocalizedText(rule.example, language)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </TutorialTarget>
          )}

          {/* Financial Concepts Plain Language Explanations */}
          {concepts.length > 0 && (
            <View className="mb-2">
              <View className="flex-row items-center mb-2 px-0.5">
                <MaterialIcons name="menu-book" size={18} color="#9d4300" />
                <Text className="text-sm font-bold text-on-surface ml-1">
                  Plain-Language Financial Concepts
                </Text>
              </View>

              <View className="flex-col gap-2">
                {concepts.map((concept) => {
                  const isExpanded = expandedConceptId === concept.id;
                  const conceptTitle = getLocalizedText(concept.title, language);
                  const conceptSummary = getLocalizedText(concept.summary, language);
                  const conceptAction = getLocalizedText(concept.practical_action, language);

                  return (
                    <View
                      key={concept.id}
                      className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container-highest/60 shadow-xs">
                      <TouchableOpacity
                        onPress={() => setExpandedConceptId(isExpanded ? null : concept.id)}
                        className="flex-row items-start justify-between">
                        <View className="flex-col flex-1 mr-2">
                          <Text className="text-xs font-bold text-on-surface">{conceptTitle}</Text>
                          <Text className="text-[11px] text-on-surface-variant mt-0.5">
                            {conceptSummary}
                          </Text>
                        </View>
                        <MaterialIcons
                          name={isExpanded ? 'expand-less' : 'expand-more'}
                          size={20}
                          color="#584237"
                        />
                      </TouchableOpacity>

                      {isExpanded && (
                        <View className="mt-2.5 pt-2 border-t border-surface-container-highest/40 flex-col gap-2">
                          <Text className="text-[11px] text-on-surface leading-relaxed">
                            {getLocalizedText(concept.plain_language_explanation, language)}
                          </Text>
                          <View className="p-2 rounded-lg bg-surface-container-low flex-row items-start">
                            <MaterialIcons name="lightbulb" size={14} color="#9d4300" style={{ marginTop: 1, marginRight: 4 }} />
                            <Text className="text-[11px] font-semibold text-primary flex-1">
                              Action: {conceptAction}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Ask Sakhi button */}
      <View className="absolute bottom-20 right-4 z-40">
        <TouchableOpacity
          onPress={() => setAskSakhiVisible(true)}
          className="h-11 px-3.5 rounded-full bg-primary-container flex-row items-center shadow-lg active:scale-95">
          <MaterialIcons name="auto-awesome" size={20} color="#ffffff" />
          <Text className="text-on-primary font-headline-sm text-[14px] font-bold ml-1.5">
            Ask Sakhi a Doubt
          </Text>
        </TouchableOpacity>
      </View>

      <AskSakhiModal visible={askSakhiVisible} onClose={() => setAskSakhiVisible(false)} />
      <ProfileModal visible={profileVisible} onClose={() => setProfileVisible(false)} />
    </SafeAreaView>
  );
}
