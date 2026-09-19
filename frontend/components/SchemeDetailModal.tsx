import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { SchemeResponse, SchemeMatchResponse } from '@/types/scheme';
import { useApp } from '@/context/AppContext';
import { voiceService } from '@/services/voiceService';
import { audioPlayer } from '@/services/audioPlayer';

type SchemeDetailModalProps = {
  visible: boolean;
  onClose: () => void;
  scheme?: SchemeResponse | SchemeMatchResponse | null;
};

export function SchemeDetailModal({ visible, onClose, scheme }: SchemeDetailModalProps) {
  const { bookmarkScheme, userId, language } = useApp();
  const [checkedDocs, setCheckedDocs] = useState<{ [key: number]: boolean }>({ 0: true, 1: true });
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const audioTrackId = scheme?.id ? `scheme-detail-${scheme.id}` : 'scheme-detail';

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

  useEffect(() => {
    if (scheme) {
      // Default first 2 documents checked if available
      const initial: { [key: number]: boolean } = {};
      const docs = scheme.required_documents || [];
      docs.forEach((_, idx) => {
        initial[idx] = idx < 2;
      });
      setCheckedDocs(initial);
      const isMatched = 'user_application_status' in scheme;
      setIsBookmarked(isMatched && !!(scheme as SchemeMatchResponse).user_application_status);
    }
  }, [scheme]);

  if (!scheme) return null;

  const matchPercent =
    'match_score' in scheme && typeof (scheme as SchemeMatchResponse).match_score === 'number'
      ? `${Math.round((scheme as SchemeMatchResponse).match_score)}% Match`
      : 'Verified';

  const documents = scheme.required_documents && scheme.required_documents.length > 0
    ? scheme.required_documents
    : [
        'Aadhaar Card (Verified & linked to mobile)',
        'Jan Dhan / Savings Bank Passbook',
        'SHG Membership Verification / Resolution Copy',
      ];

  const readyCount = documents.filter((_, idx) => !!checkedDocs[idx]).length;

  const handleToggleDoc = (idx: number) => {
    setCheckedDocs((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleOpenPortal = () => {
    if (scheme.official_portal_url) {
      Linking.openURL(scheme.official_portal_url).catch(() => {});
    }
  };

  const handleToggleBookmark = async () => {
    if (!userId || !scheme.id) return;
    try {
      setIsBookmarking(true);
      const nextStatus = isBookmarked ? 'dismissed' : 'enrolled';
      await bookmarkScheme(scheme.id, {
        is_bookmarked: !isBookmarked,
        application_status: isBookmarked ? 'dismissed' : 'applied',
      });
      setIsBookmarked(!isBookmarked);
    } catch (err) {
      if (__DEV__) console.warn('[SchemeDetailModal] Bookmark error:', err);
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleToggleAudio = async () => {
    if (isPlayingAudio) {
      audioPlayer.stop();
      return;
    }
    try {
      setIsLoadingAudio(true);
      const lang = language || 'te';
      let narrationText = '';
      if (lang === 'te') {
        narrationText = `నమస్తే అక్క. ఈ పథకం పేరు: ${scheme.name}. ప్రయోజనం: ${scheme.benefit_amount_display}. ఖర్చు లేదా ప్రీమియం: ${scheme.cost_or_premium}. లక్షిత లబ్ధిదారులు: ${scheme.target_beneficiaries}. దరఖాస్తు విధానం: ${scheme.offline_application_process || ''}`;
      } else if (lang === 'hi') {
        narrationText = `नमस्ते दीदी। इस योजना का नाम: ${scheme.name}। लाभ: ${scheme.benefit_amount_display}। लागत या प्रीमियम: ${scheme.cost_or_premium}। लक्षित लाभार्थी: ${scheme.target_beneficiaries}। आवेदन प्रक्रिया: ${scheme.offline_application_process || ''}`;
      } else {
        narrationText = `Namaste Sister. This scheme is: ${scheme.name}. Benefit: ${scheme.benefit_amount_display}. Premium: ${scheme.cost_or_premium}. Target beneficiaries: ${scheme.target_beneficiaries}. Application process: ${scheme.offline_application_process || ''}`;
      }

      const res = await voiceService.synthesizeSpeech({
        text: narrationText,
        language: lang,
        speed: 1.0,
        audio_format: 'mp3',
      });

      await audioPlayer.playBase64(res.audio_base64, 'mp3', audioTrackId);
    } catch (err) {
      if (__DEV__) console.warn('[SchemeDetailModal] Failed to play audio:', err);
      setIsLoadingAudio(false);
    }
  };

  // Parse offline application steps
  const processSteps = scheme.offline_application_process
    ? scheme.offline_application_process.split('\n').filter((s) => s.trim().length > 0)
    : [
        'Inform your SHG President at the upcoming fortnightly VO meeting.',
        'Submit required documents along with the Micro-Investment Plan (MIP).',
        'Verification and sanction disbursal directly to bank account.',
      ];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
        {/* Top Header */}
        <View className="bg-surface-container-low px-4 py-3 border-b border-surface-container-highest shadow-sm">
          <View className="flex-row items-center justify-between mb-1">
            <View className="flex-row items-center gap-1.5 flex-wrap">
              <View className="bg-primary-container/15 px-2 py-0.5 rounded-full">
                <Text className="text-[10px] font-bold text-primary tracking-wider uppercase">
                  {scheme.category || 'Government Scheme'}
                </Text>
              </View>
              <View className="bg-surface-container-high px-2 py-0.5 rounded-full">
                <Text className="text-[10px] font-semibold text-on-surface-variant uppercase">
                  {scheme.jurisdiction || 'Central'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-surface-container-high items-center justify-center active:scale-90">
              <MaterialIcons name="close" size={18} color="#221a0e" />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-start justify-between mt-1">
            <View className="flex-1 mr-2">
              <Text className="text-base font-bold text-on-surface leading-tight">
                {scheme.name}
              </Text>
              {scheme.short_name && scheme.short_name !== scheme.name && (
                <Text className="text-xs text-on-surface-variant mt-0.5">
                  {scheme.short_name}
                </Text>
              )}
            </View>
            <View className="bg-primary-container px-2.5 py-1 rounded-full flex-row items-center shadow-xs">
              <MaterialIcons name="stars" size={13} color="#ffffff" />
              <Text className="text-xs font-bold text-on-primary ml-1">{matchPercent}</Text>
            </View>
          </View>
        </View>

        <ScrollView className="flex-1 px-4 py-3.5" contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Benefit Highlight Strip */}
          <View className="bg-surface-container-low p-3 rounded-xl mb-4 border border-surface-container-highest/60 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 mr-2">
              <MaterialIcons name="currency-rupee" size={18} color="#9d4300" />
              <View className="ml-1.5 flex-1">
                <Text className="text-xs font-bold text-on-surface">
                  {scheme.benefit_amount_display}
                </Text>
                <Text className="text-[11px] text-on-surface-variant">
                  Premium / Cost: {scheme.cost_or_premium}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleToggleBookmark}
              disabled={isBookmarking}
              className={`px-3 py-1.5 rounded-full flex-row items-center ${
                isBookmarked ? 'bg-primary' : 'bg-surface-container-high'
              }`}>
              {isBookmarking ? (
                <ActivityIndicator size="small" color={isBookmarked ? '#ffffff' : '#9d4300'} />
              ) : (
                <>
                  <MaterialIcons
                    name={isBookmarked ? 'bookmark' : 'bookmark-border'}
                    size={15}
                    color={isBookmarked ? '#ffffff' : '#9d4300'}
                  />
                  <Text
                    className={`text-[11px] font-bold ml-1 ${
                      isBookmarked ? 'text-on-primary' : 'text-primary'
                    }`}>
                    {isBookmarked ? 'Tracked' : 'Track'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Target Beneficiaries & Eligibility */}
          <View className="mb-4">
            <View className="flex-row items-center mb-2">
              <MaterialIcons name="groups" size={18} color="#9d4300" />
              <Text className="text-sm font-bold text-on-surface ml-1.5">
                Target Beneficiaries & Eligibility
              </Text>
            </View>
            <View className="p-3.5 rounded-xl bg-surface-container flex-col gap-2 border border-surface-container-highest/60">
              <View className="flex-row items-start">
                <MaterialIcons name="check-circle" size={16} color="#9d4300" style={{ marginTop: 2, marginRight: 8 }} />
                <Text className="text-xs text-on-surface flex-1">
                  {scheme.target_beneficiaries}
                </Text>
              </View>
              <View className="flex-row items-start">
                <MaterialIcons name="check-circle" size={16} color="#9d4300" style={{ marginTop: 2, marginRight: 8 }} />
                <Text className="text-xs text-on-surface flex-1">
                  {scheme.what_it_provides}
                </Text>
              </View>
              {scheme.requires_shg && (
                <View className="flex-row items-start">
                  <MaterialIcons name="check-circle" size={16} color="#9d4300" style={{ marginTop: 2, marginRight: 8 }} />
                  <Text className="text-xs text-on-surface flex-1">
                    Active membership in a recognized <Text className="font-bold">Self-Help Group (SHG)</Text>.
                  </Text>
                </View>
              )}
              {scheme.min_age !== undefined && scheme.max_age !== undefined && (
                <View className="flex-row items-start">
                  <MaterialIcons name="check-circle" size={16} color="#9d4300" style={{ marginTop: 2, marginRight: 8 }} />
                  <Text className="text-xs text-on-surface flex-1">
                    Age criteria: <Text className="font-bold">{scheme.min_age} – {scheme.max_age} years</Text>.
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Documents Checklist */}
          <View className="mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center">
                <MaterialIcons name="inventory-2" size={18} color="#9d4300" />
                <Text className="text-sm font-bold text-on-surface ml-1.5">Documents Checklist</Text>
              </View>
              <Text className="text-xs font-bold text-primary">
                {readyCount} of {documents.length} Ready
              </Text>
            </View>

            <View className="flex-col gap-2">
              {documents.map((doc, idx) => {
                const isChecked = !!checkedDocs[idx];
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => handleToggleDoc(idx)}
                    className="flex-row items-center justify-between p-3 rounded-xl bg-surface-container-low border border-surface-container-highest/60 active:scale-[0.99]">
                    <View className="flex-row items-center flex-1 mr-2">
                      <View
                        className={`w-5 h-5 rounded items-center justify-center mr-2.5 ${
                          isChecked ? 'bg-primary' : 'bg-surface-container-highest'
                        }`}>
                        {isChecked && <MaterialIcons name="check" size={14} color="#ffffff" />}
                      </View>
                      <View className="flex-col flex-1">
                        <Text className="text-xs font-bold text-on-surface">{doc}</Text>
                      </View>
                    </View>
                    <View className={`px-2 py-0.5 rounded-full ${isChecked ? 'bg-surface-container' : 'bg-secondary-fixed'}`}>
                      <Text className={`text-[10px] font-semibold ${isChecked ? 'text-on-surface-variant' : 'text-on-secondary-fixed'}`}>
                        {isChecked ? 'Ready' : 'Needed'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* How to Apply */}
          <View className="mb-4">
            <View className="flex-row items-center mb-2">
              <MaterialIcons name="route" size={18} color="#9d4300" />
              <Text className="text-sm font-bold text-on-surface ml-1.5">How to Apply</Text>
            </View>

            <View className="flex-col gap-2">
              {processSteps.map((step, idx) => (
                <View
                  key={idx}
                  className="flex-row gap-2.5 p-3 rounded-xl bg-surface-container-lowest shadow-xs border border-surface-container-highest/60">
                  <View className="w-7 h-7 rounded-full bg-primary-container items-center justify-center flex-shrink-0">
                    <Text className="text-xs font-bold text-on-primary">{idx + 1}</Text>
                  </View>
                  <View className="flex-col flex-1">
                    <Text className="text-xs text-on-surface leading-snug">
                      {step.replace(/^\d+[\.\)]\s*/, '')}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Footer Action Bar */}
        <View className="bg-surface-container-low px-4 py-3 flex-row items-center gap-2 border-t border-surface-container-highest shadow-sm">
          <TouchableOpacity
            onPress={handleToggleAudio}
            disabled={isLoadingAudio}
            className={`h-11 px-3.5 rounded-full flex-row items-center active:scale-95 ${
              isPlayingAudio ? 'bg-secondary-fixed' : 'bg-surface-container-high'
            }`}>
            {isLoadingAudio ? (
              <ActivityIndicator size="small" color="#9d4300" style={{ marginRight: 4 }} />
            ) : (
              <MaterialIcons
                name={isPlayingAudio ? 'pause-circle' : 'volume-up'}
                size={18}
                color={isPlayingAudio ? '#b3291b' : '#9d4300'}
              />
            )}
            <Text
              className={`text-xs font-bold ml-1.5 ${
                isPlayingAudio ? 'text-secondary' : 'text-on-surface'
              }`}>
              {isLoadingAudio
                ? (language === 'te' ? 'లోడ్ అవుతోంది...' : language === 'hi' ? 'लोड हो रहा है...' : 'Loading...')
                : isPlayingAudio
                ? (language === 'te' ? 'వింటున్నారు...' : language === 'hi' ? 'सुन रहे हैं...' : 'Playing...')
                : language === 'te'
                ? 'తెలుగులో వినండి'
                : language === 'hi'
                ? 'हिंदी में सुनें'
                : 'Listen in English'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleOpenPortal}
            disabled={!scheme.official_portal_url}
            className={`flex-1 h-11 px-4 rounded-full flex-row items-center justify-center active:scale-95 shadow-md ${
              scheme.official_portal_url ? 'bg-primary-container' : 'bg-surface-container-highest'
            }`}>
            <Text className="text-xs font-bold text-on-primary mr-1">
              {scheme.official_portal_url ? 'View Official Portal' : 'Offline Application Only'}
            </Text>
            {scheme.official_portal_url && (
              <MaterialIcons name="north-east" size={16} color="#ffffff" />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
