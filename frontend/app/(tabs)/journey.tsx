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
import { getLocalizedText } from '@/utils/localization';
import { JourneyStageResponse } from '@/types/journey';
import { voiceService } from '@/services/voiceService';
import { audioPlayer } from '@/services/audioPlayer';

export default function JourneyScreen() {
  const router = useRouter();
  const { journeyRoadmap, refreshJourneyRoadmap, language, operatingState, currentUser } = useApp();
  const [askSakhiVisible, setAskSakhiVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [isListeningAudio, setIsListeningAudio] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const audioTrackId = 'journey-active-milestone';

  useEffect(() => {
    const unsubscribe = audioPlayer.subscribe((event) => {
      if (event.currentId === audioTrackId) {
        setIsListeningAudio(event.state === 'playing');
        setIsLoadingAudio(event.state === 'loading');
      } else {
        setIsListeningAudio(false);
        setIsLoadingAudio(false);
      }
    });
    return () => unsubscribe();
  }, [audioTrackId]);

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
  const activeStageTitle = activeStage ? getLocalizedText(activeStage.title, language) : 'Build Emergency Shield';
  const activeStageProgress = Math.round(activeStage?.progress_percentage ?? 0);
  const nextAction = journeyRoadmap?.next_milestone_action
    ? getLocalizedText(journeyRoadmap.next_milestone_action, language)
    : 'Continue to allocate surplus towards your Emergency Shield';

  const stateName = currentUser?.state || operatingState || 'Telangana';

  const handleToggleAudio = async () => {
    if (isListeningAudio) {
      audioPlayer.stop();
      return;
    }
    if (!activeStage) return;
    try {
      setIsLoadingAudio(true);
      const lang = language || 'te';
      let narration = '';
      if (lang === 'te') {
        narration = `నమస్తే అక్క. మీ ప్రస్తుత ప్రయాణం: దశ ${activeStageNumber}, ${activeStageTitle}. లక్ష్యం: ${activeStage.target_metric_label || ''} ${activeStage.target_metric_value || ''}. తర్వాత చేయవలసిన పని: ${nextAction}.`;
      } else if (lang === 'hi') {
        narration = `नमस्ते दीदी। आपकी वर्तमान यात्रा: चरण ${activeStageNumber}, ${activeStageTitle}। लक्ष्य: ${activeStage.target_metric_label || ''} ${activeStage.target_metric_value || ''}। अगला कदम: ${nextAction}।`;
      } else {
        narration = `Namaste Sister. Your current journey: Stage ${activeStageNumber}, ${activeStageTitle}. Target: ${activeStage.target_metric_label || ''} ${activeStage.target_metric_value || ''}. Next action: ${nextAction}.`;
      }

      const res = await voiceService.synthesizeSpeech({
        text: narration,
        language: lang,
        speed: 1.0,
        audio_format: 'mp3',
      });

      await audioPlayer.playBase64(res.audio_base64, 'mp3', audioTrackId);
    } catch (err) {
      if (__DEV__) console.warn('[JourneyScreen] Failed to synthesize audio:', err);
      setIsLoadingAudio(false);
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
                Mahila Bachat Gat • {stateName} Peer Path
              </Text>
            </View>
          </View>

          {/* Active Milestone Hero Card */}
          {activeStage && (
            <TutorialTarget id="journey-stage-banner">
              <View className="w-full bg-surface-container rounded-xl p-4 flex-col gap-3 shadow-sm mb-4 border border-surface-container-highest/60">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center bg-primary px-2.5 py-1 rounded-full">
                    <View className="w-1.5 h-1.5 rounded-full bg-on-primary mr-1.5" />
                    <Text className="text-[10px] font-bold text-on-primary tracking-wide">
                      Current Active Milestone
                    </Text>
                  </View>
                  <View className="bg-surface px-2 py-0.5 rounded-full">
                    <Text className="text-xs font-bold text-on-surface-variant">
                      Stage {activeStageNumber} of 7
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
                        {activeStage.target_metric_label || 'Target'}
                      </Text>
                      <Text className="text-base font-bold text-on-surface">
                        {activeStage.target_metric_value || 'In Progress'}
                      </Text>
                      <Text className="text-[11px] font-semibold text-primary">
                        {getLocalizedText(activeStage.subtitle, language)}
                      </Text>
                    </View>
                  </View>
                  <View className="w-px h-10 bg-surface-container-high mx-2" />
                  <View className="flex-col items-end">
                    <Text className="text-[10px] text-on-surface-variant">Status</Text>
                    <Text className="text-xs font-bold text-secondary">
                      {activeStageProgress >= 100 ? 'Achieved' : `${activeStageProgress}% Complete`}
                    </Text>
                    <Text className="text-[10px] text-on-surface-variant">FastAPI Verified</Text>
                  </View>
                </View>

                {/* Action Row */}
                <TutorialTarget id="journey-active-milestone">
                  <View className="flex-col gap-2 pt-1">
                    <View className="flex-row items-center">
                      <MaterialIcons name="arrow-forward" size={14} color="#b3291b" />
                      <Text className="text-[11px] font-semibold text-on-surface-variant ml-1 flex-1 truncate">
                        Next: {nextAction}
                      </Text>
                    </View>
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        onPress={handleToggleAudio}
                        disabled={isLoadingAudio}
                        className="flex-1 h-11 rounded-lg bg-surface flex-row items-center justify-center shadow-xs active:scale-95 border border-surface-container-highest/60">
                        {isLoadingAudio ? (
                          <ActivityIndicator size="small" color="#9d4300" style={{ marginRight: 4 }} />
                        ) : (
                          <MaterialIcons name={isListeningAudio ? 'pause' : 'graphic-eq'} size={18} color="#9d4300" />
                        )}
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
                </TutorialTarget>
              </View>
            </TutorialTarget>
          )}

          {/* All 7 Milestones */}
          <View className="mb-3">
            <View className="flex-row items-center justify-between mb-2 px-0.5">
              <Text className="text-sm font-bold text-on-surface">All 7 Milestones</Text>
              <Text className="text-[11px] text-on-surface-variant">
                {journeyRoadmap ? `${journeyRoadmap.completed_stages_count} of 7 Completed` : 'Roadmap Progress'}
              </Text>
            </View>

            <View className="flex-col gap-2">
              {stages.length === 0 ? (
                <View className="py-8 items-center justify-center bg-surface-container-lowest rounded-xl">
                  <ActivityIndicator size="small" color="#9d4300" />
                  <Text className="text-xs text-on-surface-variant mt-2">Loading 7-Stage Roadmap...</Text>
                </View>
              ) : (
                stages.map((stage) => {
                  const stageNumStr = String(stage.stage_number).padStart(2, '0');
                  const stageTitle = getLocalizedText(stage.title, language);
                  const stageSubtitle = getLocalizedText(stage.subtitle, language);
                  const progressPct = Math.round(stage.progress_percentage);

                  if (stage.status === 'completed') {
                    return (
                      <View
                        key={stage.stage_number}
                        className="bg-surface-container-lowest rounded-xl p-3 shadow-xs border border-surface-container-highest/60 flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1 mr-2">
                          <View className="w-9 h-9 rounded-full bg-surface-container-high items-center justify-center mr-2.5">
                            <MaterialIcons name="check-circle" size={20} color="#b3291b" />
                          </View>
                          <View className="flex-col flex-1">
                            <Text className="text-[10px] font-bold text-on-surface-variant">
                              STAGE {stage.stage_number}
                            </Text>
                            <Text className="text-xs font-bold text-on-surface">{stageTitle}</Text>
                          </View>
                        </View>
                        <View className="bg-surface-container-high px-2 py-0.5 rounded-full flex-row items-center">
                          <MaterialIcons name="done-all" size={12} color="#9d4300" />
                          <Text className="text-[10px] font-bold text-on-surface-variant ml-1">Completed</Text>
                        </View>
                      </View>
                    );
                  }

                  if (stage.status === 'in_progress') {
                    return (
                      <View
                        key={stage.stage_number}
                        className="bg-surface-container rounded-xl p-3.5 shadow-sm border border-primary-container/40">
                        <View className="flex-row items-center justify-between mb-2">
                          <View className="flex-row items-center flex-1 mr-2">
                            <View className="w-9 h-9 rounded-full bg-primary items-center justify-center mr-2.5 shadow-xs">
                              <Text className="text-xs font-bold text-on-primary">{stageNumStr}</Text>
                            </View>
                            <View className="flex-col flex-1">
                              <Text className="text-[10px] font-bold text-primary">
                                STAGE {stage.stage_number} • ACTIVE
                              </Text>
                              <Text className="text-xs font-bold text-on-surface">{stageTitle}</Text>
                            </View>
                          </View>
                          <View className="bg-primary px-2 py-0.5 rounded-full">
                            <Text className="text-[10px] font-bold text-on-primary">
                              In Progress ({progressPct}%)
                            </Text>
                          </View>
                        </View>
                        <View className="pl-11">
                          <View className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden mb-1">
                            <View className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, Math.max(5, progressPct))}%` }} />
                          </View>
                          <View className="flex-row justify-between">
                            <Text className="text-[10px] text-on-surface-variant">{stageSubtitle}</Text>
                            <Text className="text-[10px] font-bold text-primary">
                              {stage.target_metric_value || 'In Progress'}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  }

                  // Locked stage
                  return (
                    <View
                      key={stage.stage_number}
                      className="bg-surface-container-low/70 rounded-xl p-3 shadow-xs border border-surface-container-highest/40 flex-row items-center justify-between">
                      <View className="flex-row items-center flex-1 mr-2">
                        <View className="w-9 h-9 rounded-full bg-surface-container-high items-center justify-center mr-2.5">
                          <MaterialIcons name="lock" size={16} color="#8c7164" />
                        </View>
                        <View className="flex-col flex-1">
                          <Text className="text-[10px] font-bold text-outline">
                            STAGE {stage.stage_number}
                          </Text>
                          <Text className="text-xs font-bold text-on-surface-variant">{stageTitle}</Text>
                        </View>
                      </View>
                      <View className="bg-surface-container-high px-2 py-0.5 rounded-full">
                        <Text className="text-[10px] text-on-surface-variant font-medium">Locked</Text>
                      </View>
                    </View>
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
          <Text className="text-xs font-bold text-on-primary ml-1.5">Ask Sakhi</Text>
        </TouchableOpacity>
      </View>

      <AskSakhiModal visible={askSakhiVisible} onClose={() => setAskSakhiVisible(false)} />
      <ProfileModal visible={profileVisible} onClose={() => setProfileVisible(false)} />
    </SafeAreaView>
  );
}
