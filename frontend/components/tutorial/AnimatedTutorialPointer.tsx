import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TooltipPosition } from '@/types/tutorial';

interface AnimatedTutorialPointerProps {
  x: number;
  y: number;
  width: number;
  height: number;
  position?: TooltipPosition;
}

export function AnimatedTutorialPointer({
  x,
  y,
  width,
  height,
  position = 'auto',
}: AnimatedTutorialPointerProps) {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Continuous Bobbing / Tapping loop
    const bounceLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -12,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );

    // 2. Ripple pulse loop
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ])
    );

    bounceLoop.start();
    pulseLoop.start();

    return () => {
      bounceLoop.stop();
      pulseLoop.stop();
    };
  }, [bounceAnim, pulseAnim]);

  // Center the pointer on the target element
  const centerX = x + width / 2 - 20;
  // If target is tall, place pointer closer to the top-center or center
  const centerY = y + Math.min(height / 2, 40) - 20;

  const rippleScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 2.2],
  });

  const rippleOpacity = pulseAnim.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [0.8, 0.3, 0],
  });

  return (
    <View
      pointerEvents="none"
      style={[
        styles.container,
        {
          left: centerX,
          top: centerY,
        },
      ]}
    >
      {/* Ripple ring effect */}
      <Animated.View
        style={[
          styles.ripple,
          {
            transform: [{ scale: rippleScale }],
            opacity: rippleOpacity,
          },
        ]}
      />

      {/* Animated Bobbing Finger */}
      <Animated.View
        style={[
          styles.pointerBadge,
          {
            transform: [{ translateY: bounceAnim }],
          },
        ]}
      >
        <View style={styles.iconCircle}>
          <MaterialIcons name="touch-app" size={26} color="#ffffff" />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10001,
  },
  ripple: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(217, 119, 6, 0.45)',
    borderWidth: 2,
    borderColor: '#ff9800',
  },
  pointerBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#9d4300',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  iconCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
