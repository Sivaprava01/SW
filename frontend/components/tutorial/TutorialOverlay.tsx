import React from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Platform,
} from 'react-native';
import { useTutorial } from '@/context/TutorialContext';
import { AnimatedTutorialPointer } from './AnimatedTutorialPointer';
import { TutorialTooltip } from './TutorialTooltip';
import { TutorialCompletionModal } from './TutorialCompletionModal';
import { TutorialPromptModal } from './TutorialPromptModal';
import { SwipeableCardTourModal } from '@/components/tour/SwipeableCardTourModal';

export function TutorialOverlay() {
  const {
    activeTutorial,
    currentStep,
    activeTargetLayout,
    onTargetAction,
    isCardTourVisible,
    closeCardTour,
  } = useTutorial();

  const windowDimensions = Dimensions.get('window');
  const screenWidth = windowDimensions.width;
  const screenHeight = windowDimensions.height;

  const isActive = Boolean(activeTutorial && currentStep);

  return (
    <>
      {isActive && (
        <View style={styles.overlayContainer} pointerEvents="box-none">
          {activeTargetLayout ? (
            <>
              {/* 4-piece Dimmed Backdrop surrounding the Target Cutout */}
              {/* Top slice */}
              <View
                style={[
                  styles.dimSlice,
                  {
                    top: 0,
                    left: 0,
                    right: 0,
                    height: Math.max(0, activeTargetLayout.y),
                  },
                ]}
              />

              {/* Bottom slice */}
              <View
                style={[
                  styles.dimSlice,
                  {
                    top: activeTargetLayout.y + activeTargetLayout.height,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  },
                ]}
              />

              {/* Left slice */}
              <View
                style={[
                  styles.dimSlice,
                  {
                    top: activeTargetLayout.y,
                    left: 0,
                    width: Math.max(0, activeTargetLayout.x),
                    height: activeTargetLayout.height,
                  },
                ]}
              />

              {/* Right slice */}
              <View
                style={[
                  styles.dimSlice,
                  {
                    top: activeTargetLayout.y,
                    left: activeTargetLayout.x + activeTargetLayout.width,
                    right: 0,
                    height: activeTargetLayout.height,
                  },
                ]}
              />

              {/* Glowing Highlight Box around the Target */}
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  if (currentStep) {
                    onTargetAction(currentStep.targetId);
                  }
                }}
                style={[
                  styles.spotlightHole,
                  {
                    left: Math.max(0, activeTargetLayout.x - 4),
                    top: Math.max(0, activeTargetLayout.y - 4),
                    width: activeTargetLayout.width + 8,
                    height: activeTargetLayout.height + 8,
                  },
                ]}
              />

              {/* Animated Finger / Pointer */}
              <AnimatedTutorialPointer
                x={activeTargetLayout.x}
                y={activeTargetLayout.y}
                width={activeTargetLayout.width}
                height={activeTargetLayout.height}
                position={currentStep?.position}
              />
            </>
          ) : (
            // Full dim if target layout is still calculating
            <View style={[styles.dimSlice, StyleSheet.absoluteFill]} />
          )}

          {/* Educational Tooltip Instruction Card */}
          <TutorialTooltip
            targetLayout={activeTargetLayout}
            positionPreference={currentStep?.position}
          />
        </View>
      )}

      {/* Swipeable Full-Screen Card Onboarding Tour Modal */}
      <SwipeableCardTourModal
        visible={isCardTourVisible}
        onClose={closeCardTour}
      />

      {/* Completion Modal */}
      <TutorialCompletionModal />

      {/* Legacy/Optional Prompt Modal */}
      <TutorialPromptModal />
    </>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFill,
    zIndex: 9999,
  },
  dimSlice: {
    position: 'absolute',
    backgroundColor: 'rgba(18, 12, 8, 0.72)',
  },
  spotlightHole: {
    position: 'absolute',
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: '#ff9800',
    backgroundColor: 'transparent',
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 10000,
  },
});
