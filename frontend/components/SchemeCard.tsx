import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SchemeResponse, SchemeMatchResponse } from '@/types/scheme';

export interface SchemeCardProps {
  scheme: SchemeResponse | SchemeMatchResponse;
  isPlayingAudio?: boolean;
  isLoadingAudio?: boolean;
  onToggleAudio?: (scheme: SchemeResponse | SchemeMatchResponse) => void;
  onOpenDetail?: (scheme: SchemeResponse | SchemeMatchResponse) => void;
  language?: string;
  testID?: string;
}

function getCategoryIcon(category: string = ''): keyof typeof MaterialIcons.glyphMap {
  const cat = category.toLowerCase();
  if (cat.includes('enterprise') || cat.includes('livelihood') || cat.includes('business')) {
    return 'storefront';
  }
  if (cat.includes('credit') || cat.includes('loan') || cat.includes('shg')) {
    return 'groups';
  }
  if (cat.includes('insurance') || cat.includes('bima') || cat.includes('protection')) {
    return 'shield';
  }
  if (cat.includes('pension') || cat.includes('retirement')) {
    return 'savings';
  }
  if (cat.includes('savings') || cat.includes('deposit')) {
    return 'account-balance-wallet';
  }
  if (cat.includes('health') || cat.includes('ayushman')) {
    return 'local-hospital';
  }
  return 'account-balance';
}

export function SchemeCard({
  scheme,
  isPlayingAudio = false,
  isLoadingAudio = false,
  onToggleAudio,
  onOpenDetail,
  language = 'en',
  testID,
}: SchemeCardProps) {
  const matchScore =
    'match_score' in scheme && typeof (scheme as SchemeMatchResponse).match_score === 'number'
      ? `${Math.round((scheme as SchemeMatchResponse).match_score)}% Match`
      : 'Verified';

  const tags: string[] = [
    scheme.category,
    scheme.jurisdiction,
    scheme.requires_shg ? 'SHG Livelihood' : 'Central Program',
  ].filter(Boolean);

  const iconName = getCategoryIcon(scheme.category);

  const subtitle =
    scheme.short_name && scheme.short_name !== scheme.name
      ? scheme.short_name
      : scheme.target_beneficiaries || scheme.category || 'Government Welfare Program';

  const descriptionText =
    scheme.what_it_provides || scheme.description || 'Comprehensive financial support and welfare benefits.';

  const audioLabel = isPlayingAudio
    ? 'వింటున్నారు...'
    : language === 'te'
    ? 'తెలుగులో వినండి'
    : language === 'hi'
    ? 'हिंदी में सुनें'
    : 'Listen in English';

  return (
    <View
      testID={testID}
      style={{ height: 246 }}
      className="w-full h-[246px] rounded-2xl bg-surface-container-lowest p-3.5 border border-surface-container-highest/60 shadow-xs flex-col justify-between overflow-hidden">
      {/* 1. HEADER / CATEGORY & MATCH BADGE (Fixed Height: 24px) */}
      <View className="h-6 flex-row items-center justify-between">
        <View className="flex-row items-center gap-1.5 flex-1 mr-2 overflow-hidden">
          {tags.slice(0, 2).map((tag, idx) => (
            <View key={idx} className="bg-surface-container-high px-2 py-0.5 rounded-full max-w-[130px]">
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className="text-[10px] text-on-surface-variant font-semibold uppercase">
                {tag}
              </Text>
            </View>
          ))}
        </View>
        <View className="bg-primary-fixed px-2.5 py-0.5 rounded-full flex-row items-center shrink-0">
          <MaterialIcons name="stars" size={13} color="#9d4300" />
          <Text className="text-[10px] font-bold text-primary-on-fixed ml-1">{matchScore}</Text>
        </View>
      </View>

      {/* 2. ICON & TITLE REGION (Fixed Height: 44px) */}
      <View className="h-11 flex-row items-center gap-2.5">
        <View className="w-10 h-10 rounded-xl bg-surface-container-high items-center justify-center shrink-0">
          <MaterialIcons name={iconName} size={20} color="#9d4300" />
        </View>
        <View className="flex-1 justify-center overflow-hidden">
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className="text-sm font-bold text-on-surface">
            {scheme.name}
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className="text-[11px] text-on-surface-variant font-medium mt-0.5">
            {subtitle}
          </Text>
        </View>
      </View>

      {/* 3. DESCRIPTION REGION (Fixed Height: 36px) */}
      <View className="h-9 justify-center overflow-hidden">
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          className="text-xs text-on-surface-variant leading-[18px]">
          {descriptionText}
        </Text>
      </View>

      {/* 4. KEY BENEFIT / META BANNER (Fixed Height: 40px) */}
      <View className="h-10 bg-surface-container-low px-2.5 rounded-lg flex-row items-center justify-between border border-surface-container-highest/40 overflow-hidden">
        <View className="flex-row items-center flex-1 mr-2 overflow-hidden">
          <MaterialIcons name="currency-rupee" size={15} color="#9d4300" />
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className="text-xs font-bold text-on-surface ml-1 flex-1">
            {scheme.benefit_amount_display || 'Direct Support'}
          </Text>
        </View>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className="text-[11px] text-on-surface-variant font-medium max-w-[130px] shrink-0 text-right">
          {scheme.cost_or_premium || 'Govt Funded'}
        </Text>
      </View>

      {/* 5. BUTTON / ACTION FOOTER (Fixed Height: 36px) */}
      <View className="h-9 pt-1.5 border-t border-surface-container-highest/40 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => onToggleAudio?.(scheme)}
          disabled={isLoadingAudio}
          className="flex-row items-center py-1 active:scale-95">
          {isLoadingAudio ? (
            <ActivityIndicator size="small" color="#9d4300" style={{ marginRight: 4 }} />
          ) : (
            <MaterialIcons
              name={isPlayingAudio ? 'pause-circle' : 'volume-up'}
              size={16}
              color={isPlayingAudio ? '#b3291b' : '#9d4300'}
            />
          )}
          <Text
            className={`text-xs font-bold ml-1 ${
              isPlayingAudio ? 'text-secondary' : 'text-primary'
            }`}>
            {audioLabel}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onOpenDetail?.(scheme)}
          className="h-8 px-3 rounded-lg bg-surface-container-high flex-row items-center active:scale-95">
          <Text className="text-xs font-bold text-on-surface mr-1">Details & Source</Text>
          <MaterialIcons name="open-in-new" size={14} color="#584237" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
