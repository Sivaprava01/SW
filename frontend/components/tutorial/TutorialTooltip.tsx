import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTutorial } from '@/context/TutorialContext';
import { useApp } from '@/context/AppContext';
import { TargetLayout, TooltipPosition } from '@/types/tutorial';

interface TutorialTooltipProps {
  targetLayout: TargetLayout | null;
  positionPreference?: TooltipPosition;
}

export function TutorialTooltip({
  targetLayout,
  positionPreference = 'auto',
}: TutorialTooltipProps) {
  const {
    currentStep,
    currentStepIndex,
    activeDefinition,
    nextStep,
    prevStep,
    skipTutorial,
    playCurrentStepAudio,
    stopCurrentStepAudio,
    isPlayingVoice,
    isLoadingVoice,
  } = useTutorial();

  const { language } = useApp();

  if (!currentStep || !activeDefinition) return null;

  const currentLang = language || 'te';
  const totalSteps = activeDefinition.steps.length;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;

  const titleText = currentStep.title[currentLang] || currentStep.title.en;
  const bodyText = currentStep.text[currentLang] || currentStep.text.en;
  const tipText = currentStep.tip ? currentStep.tip[currentLang] || currentStep.tip.en : null;

  // Window geometry
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;

  // Compute vertical placement
  let isPositionBottom = true;

  if (targetLayout) {
    const spaceAbove = targetLayout.y;
    const spaceBelow = windowHeight - (targetLayout.y + targetLayout.height);

    if (positionPreference === 'top') {
      isPositionBottom = false;
    } else if (positionPreference === 'bottom') {
      isPositionBottom = true;
    } else {
      // Auto
      isPositionBottom = spaceBelow >= 240 || spaceBelow > spaceAbove;
    }
  }

  const tooltipTop = targetLayout
    ? isPositionBottom
      ? Math.min(windowHeight - 280, targetLayout.y + targetLayout.height + 16)
      : Math.max(48, targetLayout.y - 240)
    : windowHeight / 2 - 120;

  const handleToggleVoice = () => {
    if (isPlayingVoice) {
      stopCurrentStepAudio();
    } else {
      playCurrentStepAudio();
    }
  };

  return (
    <View
      style={[
        styles.cardContainer,
        {
          top: tooltipTop,
          left: 16,
          right: 16,
          maxWidth: Math.min(windowWidth - 32, 440),
        },
      ]}
    >
      {/* Top Header: Step Counter & Skip */}
      <View className="flex-row items-center justify-between pb-2 border-b border-surface-container-highest/60">
        <View className="flex-row items-center bg-primary-fixed/30 px-2.5 py-0.5 rounded-full">
          <View className="w-2 h-2 rounded-full bg-primary mr-1.5" />
          <Text className="text-[11px] font-bold text-primary uppercase tracking-wide">
            {activeDefinition.name[currentLang]} • Step {currentStepIndex + 1}/{totalSteps}
          </Text>
        </View>

        <TouchableOpacity onPress={skipTutorial} className="p-1" accessibilityLabel="Skip Tutorial">
          <Text className="text-xs font-bold text-on-surface-variant">Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View className="py-2.5">
        <View className="flex-row items-center mb-1">
          <View className="w-7 h-7 rounded-lg bg-primary-container items-center justify-center mr-2 shadow-xs">
            <Text className="text-sm font-bold text-on-primary">स</Text>
          </View>
          <Text className="text-base font-bold text-on-surface flex-1">{titleText}</Text>
        </View>

        <Text className="text-xs text-on-surface-variant leading-relaxed font-medium mt-1">
          {bodyText}
        </Text>

        {tipText && (
          <View className="mt-2 bg-surface-container-high/60 p-2 rounded-lg flex-row items-start">
            <Text className="text-xs mr-1">💡</Text>
            <Text className="text-[11px] text-on-surface-variant flex-1 leading-tight">{tipText}</Text>
          </View>
        )}
      </View>

      {/* Audio Voice Narration Pill */}
      <View className="bg-surface-container-low rounded-xl p-2 flex-row items-center justify-between mb-2.5 border border-surface-container-highest/50">
        <View className="flex-row items-center flex-1 mr-2">
          <TouchableOpacity
            onPress={handleToggleVoice}
            disabled={isLoadingVoice}
            className={`w-8 h-8 rounded-full items-center justify-center mr-2 shadow-xs ${
              isPlayingVoice ? 'bg-primary animate-pulse' : 'bg-primary-container'
            }`}
          >
            {isLoadingVoice ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <MaterialIcons
                name={isPlayingVoice ? 'pause' : 'volume-up'}
                size={18}
                color="#ffffff"
              />
            )}
          </TouchableOpacity>
          <View className="flex-col">
            <Text className="text-xs font-bold text-on-surface">
              {isPlayingVoice ? 'Speaking...' : 'Listen to Voice'}
            </Text>
            <Text className="text-[10px] text-on-surface-variant">
              {language === 'te' ? 'తెలుగు' : language === 'hi' ? 'हिंदी' : 'English'}
            </Text>
          </View>
        </View>
        <View className="bg-surface-container-highest px-2 py-0.5 rounded-full">
          <Text className="text-[10px] font-bold text-primary">Audio</Text>
        </View>
      </View>

      {/* Action Footer */}
      <View className="flex-row items-center justify-between gap-2 pt-1 border-t border-surface-container-highest/40">
        {!isFirstStep ? (
          <TouchableOpacity
            onPress={prevStep}
            className="px-3 py-2 rounded-xl bg-surface-container-high flex-row items-center"
          >
            <MaterialIcons name="arrow-back" size={14} color="#584237" />
            <Text className="text-xs font-bold text-on-surface ml-0.5">Back</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}

        {currentStep.action === 'tap' ? (
          <View className="flex-row items-center bg-primary/10 px-3 py-2 rounded-xl">
            <MaterialIcons name="touch-app" size={16} color="#9d4300" className="mr-1" />
            <Text className="text-xs font-bold text-primary">Tap highlighted item</Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={nextStep}
            className="flex-1 max-w-[160px] bg-primary py-2.5 px-4 rounded-xl flex-row items-center justify-center shadow-xs active:scale-95"
          >
            <Text className="text-xs font-bold text-white mr-1">
              {isLastStep ? 'Complete' : 'Next Step'}
            </Text>
            <MaterialIcons name="arrow-forward" size={16} color="#ffffff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: '#fff8f3',
    borderRadius: 20,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 12,
    borderWidth: 1.5,
    borderColor: '#e8c2a8',
    zIndex: 10002,
  },
});
