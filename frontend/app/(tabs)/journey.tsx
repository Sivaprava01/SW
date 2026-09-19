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
import { JourneyStageDetailModal } from '@/components/JourneyStageDetailModal';
import { TutorialTarget } from '@/components/tutorial/TutorialTarget';
import { useApp } from '@/context/AppContext';
import { getLocalizedText } from '@/utils/localization';
import { JourneyStageResponse } from '@/types/journey';
import { audioPlayer } from '@/services/audioPlayer';
import { getJourneyStageAudio } from '@/constants/journeyAudio';

type Lang = 'en' | 'te' | 'hi';

const L = {
  headerBadge: {
    en: 'Financial Freedom Roadmap',
    te: 'ఆర్థిక స్వాతంత్ర్య ప్రయాణ పటం',
    hi: 'वित्तीय स्वतंत्रता रोडमैप',
  },
  headerTitle: {
    en: 'Your 7-Stage Journey',
    te: 'మీ 7-దశల ఆర్థిక ప్రయాణం',
    hi: 'आपकी 7-चरणीय वित्तीय यात्रा',
  },
  peerPath: {
    en: 'Mahila Bachat Gat • Peer Path',
    te: 'మహిళా పొదుపు సంఘం • ఆదర్శ మార్గం',
    hi: 'महिला बचत गट • आदर्श मार्ग',
  },
  currentActiveMilestone: {
    en: 'Current Active Milestone',
    te: 'ప్రస్తుత క్రియాశీల మైలురాయి',
    hi: 'वर्तमान सक्रिय चरण',
  },
  stageOfSeven: {
    en: 'Stage {x} of 7',
    te: 'దశ {x} / 7',
    hi: 'चरण {x} (कुल 7)',
  },
  target: {
    en: 'Target',
    te: 'లక్ష్యం',
    hi: 'लक्ष्य',
  },
  status: {
    en: 'Status',
    te: 'స్థితి',
    hi: 'स्थिति',
  },
  achieved: {
    en: 'Achieved',
    te: 'పూర్తయింది',
    hi: 'प्राप्त किया',
  },
  complete: {
    en: 'Complete',
    te: 'పూర్తయింది',
    hi: 'पूर्ण',
  },
  verified: {
    en: 'FastAPI Verified',
    te: 'ధృవీకరించబడింది',
    hi: 'सत्यापित',
  },
  next: {
    en: 'Next Action',
    te: 'తదుపరి చర్య',
    hi: 'अगला कदम',
  },
  listen: {
    en: 'Listen',
    te: 'వినండి',
    hi: 'सुनें',
  },
  playing: {
    en: 'Playing...',
    te: 'వింటున్నారు...',
    hi: 'चल रहा है...',
  },
  loading: {
    en: 'Loading...',
    te: 'లోడ్ అవుతోంది...',
    hi: 'लोड हो रहा है...',
  },
  askSakhiAdvice: {
    en: 'Ask Sakhi Advice',
    te: 'సఖి సలహా అడగండి',
    hi: 'सखी से सलाह लें',
  },
  allMilestones: {
    en: 'All 7 Milestones',
    te: 'మొత్తం 7 మైలురాళ్లు',
    hi: 'सभी 7 चरण',
  },
  completedCount: {
    en: '{x} of 7 Completed',
    te: '7 లో {x} పూర్తయ్యాయి',
    hi: '7 में से {x} पूर्ण',
  },
  loadingRoadmap: {
    en: 'Loading 7-Stage Roadmap...',
    te: '7-దశల ప్రయాణం లోడ్ అవుతోంది...',
    hi: '7-चरणीय रोडमैप लोड हो रहा है...',
  },
  stage: {
    en: 'STAGE',
    te: 'దశ',
    hi: 'चरण',
  },
  active: {
    en: 'ACTIVE',
    te: 'క్రియాశీలం',
    hi: 'सक्रिय',
  },
  inProgress: {
    en: 'In Progress',
    te: 'కొనసాగుతోంది',
    hi: 'प्रगति पर',
  },
  locked: {
    en: 'Locked',
    te: 'లాక్ చేయబడింది',
    hi: 'बंद',
  },
  viewDetails: {
    en: 'Tap for Details & Audio →',
    te: 'వివరాలు & ఆడియో కోసం నొక్కండి →',
    hi: 'विवरण और ऑडियो के लिए टैप करें →',
  },
};

export default function JourneyScreen() {
  const router = useRouter();
  const { journeyRoadmap, refreshJourneyRoadmap, language, operatingState, currentUser } = useApp();
  const lang = (language as Lang) || 'en';

  const [askSakhiVisible, setAskSakhiVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [selectedStageForDetail, setSelectedStageForDetail] = useState<JourneyStageResponse | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [loadingTrackId, setLoadingTrackId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = audioPlayer.subscribe((event) => {
      if (event.state === 'playing') {
        setPlayingTrackId(event.currentId);
        setLoadingTrackId(null);
      } else if (event.state === 'loading') {
        setLoadingTrackId(event.currentId);
      } else {
        setPlayingTrackId(null);
        setLoadingTrackId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshJourneyRoadmap();
    setRefreshing(false);
  }, [refreshJourneyRoadmap]);

  const stages = journeyRoadmap?.stages || [];

  const activeStage = useMemo<JourneyStageResponse | null>(() => {
    if (!journeyRoadmap) return null;
    const inProg = stages.find((s) => s.status === 'in_progress');
    if (inProg) return inProg;
    const currentNum = journeyRoadmap.current_active_stage || 1;
    return stages.find((s) => s.stage_number === currentNum) || stages[0] || null;
  }, [journeyRoadmap, stages]);

  const activeStageNumber = activeStage?.stage_number ?? 2;
  const activeStageTitle = activeStage ? getLocalizedText(activeStage.title, lang) : '';
  const activeStageProgress = Math.round(activeStage?.progress_percentage ?? 0);
  const nextAction = journeyRoadmap?.next_milestone_action
    ? getLocalizedText(journeyRoadmap.next_milestone_action, lang)
    : '';

  const stateName = currentUser?.state || operatingState || 'Telangana';

  const handleToggleStageAudio = async (stageNum: number, trackKey: string) => {
    if (playingTrackId === trackKey) {
      audioPlayer.stop();
      return;
    }
    try {
      setLoadingTrackId(trackKey);
      const asset = getJourneyStageAudio(stageNum, lang);
      if (asset) {
        await audioPlayer.playAsset(asset, trackKey);
      }
    } catch (err) {
      if (__DEV__) console.warn('[JourneyScreen] Playback error:', err);
      setLoadingTrackId(null);
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
          {/* Intro Framing Header */}
          <View className="mb-3">
            <View className="flex-row items-center self-start px-2.5 py-0.5 rounded-full bg-primary-container/15 mb-1">
              <MaterialIcons name="verified" size={13} color="#9d4300" />
              <Text className="text-[10px] uppercase tracking-wider font-bold text-primary ml-1">
                {L.headerBadge[lang]}
              </Text>
            </View>
            <Text className="text-xl font-bold text-on-surface">{L.headerTitle[lang]}</Text>
          </View>

          {/* Peer Path Banner */}
          <View className="relative w-full h-20 rounded-xl overflow-hidden bg-primary-container p-3 justify-end mb-3.5 shadow-xs">
            <View className="flex-row items-center">
              <MaterialIcons name="groups" size={18} color="#ffffff" />
              <Text className="text-xs font-semibold text-on-primary ml-1.5">
                {stateName} • {L.peerPath[lang]}
              </Text>
            </View>
          </View>

          {/* Active Milestone Hero Card */}
          {activeStage && (
            <TutorialTarget id="journey-stage-banner">
              <TouchableOpacity
                onPress={() => setSelectedStageForDetail(activeStage)}
                activeOpacity={0.95}
                className="w-full bg-surface-container rounded-xl p-4 flex-col gap-3 shadow-sm mb-4 border border-surface-container-highest/60">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center bg-primary px-2.5 py-1 rounded-full">
                    <View className="w-1.5 h-1.5 rounded-full bg-on-primary mr-1.5" />
                    <Text className="text-[10px] font-bold text-on-primary tracking-wide">
                      {L.currentActiveMilestone[lang]}
                    </Text>
                  </View>
                  <View className="bg-surface px-2 py-0.5 rounded-full">
                    <Text className="text-xs font-bold text-on-surface-variant">
                      {L.stageOfSeven[lang].replace('{x}', String(activeStageNumber))}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center">
                  <MaterialIcons name="shield-moon" size={24} color="#9d4300" />
                  <Text className="text-base font-bold text-on-surface ml-2">
                    {activeStageTitle}
                  </Text>
                </View>

                {/* Metrics Card */}
                <View className="bg-surface rounded-xl p-3 flex-row items-center justify-between border border-surface-container-highest/60">
                  <View className="flex-row items-center flex-1">
                    <View className="w-12 h-12 rounded-full bg-surface-container items-center justify-center mr-3 border border-primary-container">
                      <Text className="text-xs font-bold text-primary">{activeStageProgress}%</Text>
                    </View>
                    <View className="flex-col flex-1 mr-1">
                      <Text className="text-[10px] uppercase tracking-wider text-on-surface-variant">
                        {activeStage.target_metric_label || L.target[lang]}
                      </Text>
                      <Text className="text-base font-bold text-on-surface">
                        {activeStage.target_metric_value || L.inProgress[lang]}
                      </Text>
                      <Text className="text-[11px] font-semibold text-primary">
                        {getLocalizedText(activeStage.subtitle, lang)}
                      </Text>
                    </View>
                  </View>
                  <View className="w-px h-10 bg-surface-container-high mx-2" />
                  <View className="flex-col items-end">
                    <Text className="text-[10px] text-on-surface-variant">{L.status[lang]}</Text>
                    <Text className="text-xs font-bold text-secondary">
                      {activeStageProgress >= 100 ? L.achieved[lang] : `${activeStageProgress}% ${L.complete[lang]}`}
                    </Text>
                    <Text className="text-[10px] text-on-surface-variant">{L.verified[lang]}</Text>
                  </View>
                </View>

                {/* Action Row */}
                <TutorialTarget id="journey-active-milestone">
                  <View className="flex-col gap-2 pt-1">
                    {nextAction ? (
                      <View className="flex-row items-center">
                        <MaterialIcons name="arrow-forward" size={14} color="#b3291b" />
                        <Text className="text-[11px] font-semibold text-on-surface-variant ml-1 flex-1 truncate">
                          {L.next[lang]}: {nextAction}
                        </Text>
                      </View>
                    ) : null}
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          handleToggleStageAudio(activeStageNumber, 'hero-stage-audio');
                        }}
                        disabled={loadingTrackId === 'hero-stage-audio'}
                        className="flex-1 h-11 rounded-lg bg-surface flex-row items-center justify-center shadow-xs active:scale-95 border border-surface-container-highest/60">
                        {loadingTrackId === 'hero-stage-audio' ? (
                          <ActivityIndicator size="small" color="#9d4300" style={{ marginRight: 4 }} />
                        ) : (
                          <MaterialIcons
                            name={playingTrackId === 'hero-stage-audio' ? 'pause-circle' : 'volume-up'}
                            size={18}
                            color={playingTrackId === 'hero-stage-audio' ? '#b3291b' : '#9d4300'}
                          />
                        )}
                        <Text className="text-xs font-bold text-on-surface ml-1.5">
                          {loadingTrackId === 'hero-stage-audio'
                            ? L.loading[lang]
                            : playingTrackId === 'hero-stage-audio'
                            ? L.playing[lang]
                            : `🔊 ${L.listen[lang]}`}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          setAskSakhiVisible(true);
                        }}
                        className="flex-1 h-11 rounded-lg bg-primary flex-row items-center justify-center shadow-xs active:scale-95">
                        <Text className="text-xs font-bold text-on-primary mr-1">{L.askSakhiAdvice[lang]}</Text>
                        <MaterialIcons name="arrow-forward" size={16} color="#ffffff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TutorialTarget>
              </TouchableOpacity>
            </TutorialTarget>
          )}

          {/* All 7 Milestones */}
          <View className="mb-3">
            <View className="flex-row items-center justify-between mb-2 px-0.5">
              <Text className="text-sm font-bold text-on-surface">{L.allMilestones[lang]}</Text>
              <Text className="text-[11px] text-on-surface-variant">
                {journeyRoadmap
                  ? L.completedCount[lang].replace('{x}', String(journeyRoadmap.completed_stages_count))
                  : ''}
              </Text>
            </View>

            <View className="flex-col gap-2">
              {stages.length === 0 ? (
                <View className="py-8 items-center justify-center bg-surface-container-lowest rounded-xl">
                  <ActivityIndicator size="small" color="#9d4300" />
                  <Text className="text-xs text-on-surface-variant mt-2">{L.loadingRoadmap[lang]}</Text>
                </View>
              ) : (
                stages.map((stage) => {
                  const stageNumStr = String(stage.stage_number).padStart(2, '0');
                  const stageTitle = getLocalizedText(stage.title, lang);
                  const stageSubtitle = getLocalizedText(stage.subtitle, lang);
                  const progressPct = Math.round(stage.progress_percentage);
                  const trackKey = `stage-list-audio-${stage.stage_number}`;
                  const isPlaying = playingTrackId === trackKey;
                  const isLoading = loadingTrackId === trackKey;

                  if (stage.status === 'completed') {
                    return (
                      <TouchableOpacity
                        key={stage.stage_number}
                        onPress={() => setSelectedStageForDetail(stage)}
                        activeOpacity={0.85}
                        className="bg-surface-container-lowest rounded-xl p-3 shadow-xs border border-surface-container-highest/60 flex-row items-center justify-between active:scale-[0.99]">
                        <View className="flex-row items-center flex-1 mr-2">
                          <View className="w-9 h-9 rounded-full bg-surface-container-high items-center justify-center mr-2.5">
                            <MaterialIcons name="check-circle" size={20} color="#b3291b" />
                          </View>
                          <View className="flex-col flex-1">
                            <Text className="text-[10px] font-bold text-on-surface-variant">
                              {L.stage[lang]} {stage.stage_number}
                            </Text>
                            <Text className="text-xs font-bold text-on-surface">{stageTitle}</Text>
                          </View>
                        </View>
                        <View className="flex-row items-center gap-2">
                          <TouchableOpacity
                            onPress={(e) => {
                              e.stopPropagation();
                              handleToggleStageAudio(stage.stage_number, trackKey);
                            }}
                            className="w-8 h-8 rounded-full bg-surface-container-high items-center justify-center">
                            {isLoading ? (
                              <ActivityIndicator size="small" color="#9d4300" />
                            ) : (
                              <MaterialIcons
                                name={isPlaying ? 'pause' : 'volume-up'}
                                size={16}
                                color={isPlaying ? '#b3291b' : '#9d4300'}
                              />
                            )}
                          </TouchableOpacity>
                          <View className="bg-surface-container-high px-2 py-0.5 rounded-full flex-row items-center">
                            <MaterialIcons name="done-all" size={12} color="#9d4300" />
                            <Text className="text-[10px] font-bold text-on-surface-variant ml-1">
                              {L.complete[lang]}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  }

                  if (stage.status === 'in_progress') {
                    return (
                      <TouchableOpacity
                        key={stage.stage_number}
                        onPress={() => setSelectedStageForDetail(stage)}
                        activeOpacity={0.85}
                        className="bg-surface-container rounded-xl p-3.5 shadow-sm border border-primary-container/40 active:scale-[0.99]">
                        <View className="flex-row items-center justify-between mb-2">
                          <View className="flex-row items-center flex-1 mr-2">
                            <View className="w-9 h-9 rounded-full bg-primary items-center justify-center mr-2.5 shadow-xs">
                              <Text className="text-xs font-bold text-on-primary">{stageNumStr}</Text>
                            </View>
                            <View className="flex-col flex-1">
                              <Text className="text-[10px] font-bold text-primary">
                                {L.stage[lang]} {stage.stage_number} • {L.active[lang]}
                              </Text>
                              <Text className="text-xs font-bold text-on-surface">{stageTitle}</Text>
                            </View>
                          </View>
                          <View className="flex-row items-center gap-2">
                            <TouchableOpacity
                              onPress={(e) => {
                                e.stopPropagation();
                                handleToggleStageAudio(stage.stage_number, trackKey);
                              }}
                              className="w-8 h-8 rounded-full bg-surface-container-highest items-center justify-center">
                              {isLoading ? (
                                <ActivityIndicator size="small" color="#9d4300" />
                              ) : (
                                <MaterialIcons
                                  name={isPlaying ? 'pause' : 'volume-up'}
                                  size={16}
                                  color={isPlaying ? '#b3291b' : '#9d4300'}
                                />
                              )}
                            </TouchableOpacity>
                            <View className="bg-primary px-2 py-0.5 rounded-full">
                              <Text className="text-[10px] font-bold text-on-primary">
                                {L.inProgress[lang]} ({progressPct}%)
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View className="pl-11">
                          <View className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden mb-1">
                            <View className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, Math.max(5, progressPct))}%` }} />
                          </View>
                          <View className="flex-row justify-between">
                            <Text className="text-[10px] text-on-surface-variant">{stageSubtitle}</Text>
                            <Text className="text-[10px] font-bold text-primary">
                              {stage.target_metric_value || L.inProgress[lang]}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  }

                  // Locked stage
                  return (
                    <TouchableOpacity
                      key={stage.stage_number}
                      onPress={() => setSelectedStageForDetail(stage)}
                      activeOpacity={0.85}
                      className="bg-surface-container-low/70 rounded-xl p-3 shadow-xs border border-surface-container-highest/40 flex-row items-center justify-between active:scale-[0.99]">
                      <View className="flex-row items-center flex-1 mr-2">
                        <View className="w-9 h-9 rounded-full bg-surface-container-high items-center justify-center mr-2.5">
                          <MaterialIcons name="lock" size={16} color="#8c7164" />
                        </View>
                        <View className="flex-col flex-1">
                          <Text className="text-[10px] font-bold text-outline">
                            {L.stage[lang]} {stage.stage_number}
                          </Text>
                          <Text className="text-xs font-bold text-on-surface-variant">{stageTitle}</Text>
                        </View>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <TouchableOpacity
                          onPress={(e) => {
                            e.stopPropagation();
                            handleToggleStageAudio(stage.stage_number, trackKey);
                          }}
                          className="w-8 h-8 rounded-full bg-surface-container-high items-center justify-center">
                          {isLoading ? (
                            <ActivityIndicator size="small" color="#9d4300" />
                          ) : (
                            <MaterialIcons
                              name={isPlaying ? 'pause' : 'volume-up'}
                              size={16}
                              color={isPlaying ? '#b3291b' : '#9d4300'}
                            />
                          )}
                        </TouchableOpacity>
                        <View className="bg-surface-container-high px-2 py-0.5 rounded-full">
                          <Text className="text-[10px] text-on-surface-variant font-medium">{L.locked[lang]}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
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
          <Text className="text-xs font-bold text-on-primary ml-1.5">
            {lang === 'te' ? 'సఖిని అడగండి' : lang === 'hi' ? 'सखी से पूछें' : 'Ask Sakhi'}
          </Text>
        </TouchableOpacity>
      </View>

      <JourneyStageDetailModal
        visible={!!selectedStageForDetail}
        onClose={() => setSelectedStageForDetail(null)}
        stage={selectedStageForDetail}
        onAskSakhi={() => {
          setSelectedStageForDetail(null);
          setAskSakhiVisible(true);
        }}
      />
      <AskSakhiModal visible={askSakhiVisible} onClose={() => setAskSakhiVisible(false)} />
      <ProfileModal visible={profileVisible} onClose={() => setProfileVisible(false)} />
    </SafeAreaView>
  );
}
