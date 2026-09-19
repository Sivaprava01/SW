import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { JourneyStageResponse } from '@/types/journey';
import { useApp } from '@/context/AppContext';
import { getLocalizedText } from '@/utils/localization';
import { audioPlayer } from '@/services/audioPlayer';
import { getJourneyStageAudio } from '@/constants/journeyAudio';

type JourneyStageDetailModalProps = {
  visible: boolean;
  onClose: () => void;
  stage: JourneyStageResponse | null;
  onAskSakhi?: (prompt?: string) => void;
};

const L = {
  stage: { en: 'Stage', te: 'దశ', hi: 'चरण' },
  ofSeven: { en: 'of 7 Milestones', te: 'మొత్తం 7 మైలురాళ్లు', hi: '7 में से' },
  completed: { en: 'Completed', te: 'పూర్తయింది', hi: 'पूर्ण' },
  inProgress: { en: 'In Progress', te: 'కొనసాగుతోంది', hi: 'प्रगति पर' },
  locked: { en: 'Locked', te: 'లాక్ చేయబడింది', hi: 'बंद' },
  targetMetric: { en: 'Target Metric', te: 'లక్ష్యం కొలమానం', hi: 'लक्ष्य मानक' },
  currentStatus: { en: 'Status', te: 'స్థితి', hi: 'स्थिति' },
  listenStage: { en: 'Listen Stage Guide', te: 'దశ మార్గదర్శిని వినండి', hi: 'चरण मार्गदर्शन सुनें' },
  playing: { en: 'Playing Audio...', te: 'ఆడియో వింటున్నారు...', hi: 'ऑडियो चल रहा है...' },
  loading: { en: 'Loading...', te: 'లోడ్ అవుతోంది...', hi: 'लोड हो रहा है...' },
  askSakhiAdvice: { en: 'Ask Sakhi Advice', te: 'సఖి సలహా అడగండి', hi: 'सखी से सलाह लें' },
  nextAction: { en: 'Recommended Next Action', te: 'తదుపరి సిఫార్సు చేసిన చర్య', hi: 'अगला अनुशंसित कदम' },
  close: { en: 'Close', te: 'మూసివేయి', hi: 'बंद करें' },
  badgeUnlocked: { en: 'Unlocked Badge', te: 'అన్‌లాక్ అయిన బ్యాడ్జ్', hi: 'अनलॉक किया गया बैज' },
};

type Lang = 'en' | 'te' | 'hi';

export function JourneyStageDetailModal({
  visible,
  onClose,
  stage,
  onAskSakhi,
}: JourneyStageDetailModalProps) {
  const { language } = useApp();
  const lang = (language as Lang) || 'en';

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  const audioTrackId = stage ? `journey-stage-${stage.stage_number}` : 'journey-stage-detail';

  useEffect(() => {
    const unsubscribe = audioPlayer.subscribe((event) => {
      if (event.currentId === audioTrackId) {
        setIsPlayingAudio(event.state === 'playing');
        setIsLoadingAudio(event.state === 'loading');
      } else {
        setIsPlayingAudio(false);
        setIsLoadingAudio(false);
      }
    });
    return () => unsubscribe();
  }, [audioTrackId]);

  if (!stage) return null;

  const stageTitle = getLocalizedText(stage.title, lang);
  const stageSubtitle = getLocalizedText(stage.subtitle, lang);
  const actionCtaText = stage.action_cta ? getLocalizedText(stage.action_cta, lang) : '';
  const progressPct = Math.round(stage.progress_percentage || 0);

  const handleToggleAudio = async () => {
    if (isPlayingAudio) {
      audioPlayer.stop();
      return;
    }
    try {
      setIsLoadingAudio(true);
      const audioAsset = getJourneyStageAudio(stage.stage_number, lang);
      if (audioAsset) {
        await audioPlayer.playAsset(audioAsset, audioTrackId);
      }
    } catch (e) {
      if (__DEV__) console.warn('[JourneyStageDetailModal] Playback failed:', e);
      setIsLoadingAudio(false);
    }
  };

  const getStatusBadge = () => {
    if (stage.status === 'completed') {
      return (
        <View className="bg-primary-fixed px-3 py-1 rounded-full flex-row items-center">
          <MaterialIcons name="check-circle" size={14} color="#9d4300" />
          <Text className="text-xs font-bold text-primary-on-fixed ml-1">
            {L.completed[lang]} (100%)
          </Text>
        </View>
      );
    }
    if (stage.status === 'in_progress') {
      return (
        <View className="bg-primary px-3 py-1 rounded-full flex-row items-center">
          <MaterialIcons name="trending-up" size={14} color="#ffffff" />
          <Text className="text-xs font-bold text-on-primary ml-1">
            {L.inProgress[lang]} ({progressPct}%)
          </Text>
        </View>
      );
    }
    return (
      <View className="bg-surface-container-high px-3 py-1 rounded-full flex-row items-center">
        <MaterialIcons name="lock" size={14} color="#8c7164" />
        <Text className="text-xs font-bold text-on-surface-variant ml-1">
          {L.locked[lang]}
        </Text>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
        {/* Header */}
        <View className="bg-surface-container-low px-4 py-3 border-b border-surface-container-highest shadow-sm flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-9 h-9 rounded-full bg-primary items-center justify-center mr-2.5 shadow-xs">
              <Text className="text-sm font-bold text-on-primary">
                {String(stage.stage_number).padStart(2, '0')}
              </Text>
            </View>
            <View className="flex-col">
              <Text className="text-[11px] font-bold text-primary uppercase tracking-wider">
                {L.stage[lang]} {stage.stage_number} {L.ofSeven[lang]}
              </Text>
              <Text className="text-sm font-bold text-on-surface">{stageTitle}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={onClose}
            className="w-9 h-9 rounded-full bg-surface-container-high items-center justify-center active:scale-95"
            accessibilityLabel={L.close[lang]}>
            <MaterialIcons name="close" size={20} color="#221a0e" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-4 py-4" contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Status & Progress Card */}
          <View className="bg-surface-container-lowest p-4 rounded-2xl shadow-xs border border-surface-container-highest/60 mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-xs font-bold text-on-surface">{L.currentStatus[lang]}</Text>
              {getStatusBadge()}
            </View>

            {/* Progress bar */}
            <View className="w-full h-3 rounded-full bg-surface-container-high overflow-hidden mb-2">
              <View
                className="h-full bg-primary rounded-full"
                style={{ width: `${Math.min(100, Math.max(stage.status === 'in_progress' ? 10 : 0, progressPct))}%` }}
              />
            </View>

            {/* Target Metric row */}
            <View className="flex-row items-center justify-between bg-surface-container-low p-3 rounded-xl border border-surface-container-highest/40">
              <View className="flex-col">
                <Text className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">
                  {stage.target_metric_label || L.targetMetric[lang]}
                </Text>
                <Text className="text-base font-bold text-primary mt-0.5">
                  {stage.target_metric_value || (stage.status === 'completed' ? '100% Verified' : 'In Progress')}
                </Text>
              </View>
              {stage.unlocked_badge && (
                <View className="bg-primary-fixed px-2.5 py-1 rounded-lg flex-row items-center">
                  <MaterialIcons name="military-tech" size={16} color="#9d4300" />
                  <Text className="text-[11px] font-bold text-primary-on-fixed ml-1">
                    {stage.unlocked_badge}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Explanation / Subtitle */}
          <View className="bg-surface-container-lowest p-4 rounded-2xl shadow-xs border border-surface-container-highest/60 mb-4">
            <View className="flex-row items-center mb-2">
              <MaterialIcons name="lightbulb" size={18} color="#9d4300" />
              <Text className="text-sm font-bold text-on-surface ml-1.5">
                {lang === 'te'
                  ? 'ఈ దశ యొక్క ప్రాముఖ్యత'
                  : lang === 'hi'
                  ? 'इस चरण का महत्व'
                  : 'Stage Significance & Practical Strategy'}
              </Text>
            </View>
            <Text className="text-xs text-on-surface leading-relaxed">{stageSubtitle}</Text>
          </View>

          {/* Action Callout if available */}
          {actionCtaText ? (
            <View className="bg-surface-container p-4 rounded-2xl border border-surface-container-highest/60 mb-4 flex-col gap-1.5">
              <Text className="text-[11px] uppercase tracking-wider font-bold text-on-surface-variant">
                {L.nextAction[lang]}
              </Text>
              <Text className="text-xs font-semibold text-primary">{actionCtaText}</Text>
            </View>
          ) : null}

          {/* Buttons: Audio & Ask Sakhi */}
          <View className="flex-col gap-2.5 pt-2">
            <TouchableOpacity
              onPress={handleToggleAudio}
              disabled={isLoadingAudio}
              className={`w-full min-h-[48px] rounded-xl flex-row items-center justify-center shadow-xs active:scale-[0.99] border ${
                isPlayingAudio
                  ? 'bg-secondary-fixed border-secondary'
                  : 'bg-surface-container-lowest border-surface-container-highest/60'
              }`}>
              {isLoadingAudio ? (
                <ActivityIndicator size="small" color="#9d4300" style={{ marginRight: 6 }} />
              ) : (
                <MaterialIcons
                  name={isPlayingAudio ? 'pause-circle' : 'volume-up'}
                  size={20}
                  color={isPlayingAudio ? '#b3291b' : '#9d4300'}
                />
              )}
              <Text
                className={`text-xs font-bold ml-1.5 ${
                  isPlayingAudio ? 'text-secondary' : 'text-primary'
                }`}>
                {isLoadingAudio
                  ? L.loading[lang]
                  : isPlayingAudio
                  ? L.playing[lang]
                  : L.listenStage[lang]}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                onClose();
                onAskSakhi?.(stageTitle);
              }}
              className="w-full min-h-[48px] rounded-xl bg-primary flex-row items-center justify-center shadow-md active:scale-[0.99]">
              <MaterialIcons name="support-agent" size={18} color="#ffffff" />
              <Text className="text-xs font-bold text-on-primary ml-1.5">
                {L.askSakhiAdvice[lang]}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

export default JourneyStageDetailModal;
