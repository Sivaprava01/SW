import React, { useRef, useEffect, useCallback } from 'react';
import { View, ViewProps, Platform } from 'react-native';
import { useTutorial } from '@/context/TutorialContext';
import { TargetLayout } from '@/types/tutorial';

interface TutorialTargetProps extends ViewProps {
  id: string;
  children: React.ReactNode;
  onTargetPress?: () => void;
}

export function TutorialTarget({
  id,
  children,
  style,
  className,
  onTargetPress,
  ...props
}: TutorialTargetProps) {
  const { registerTarget, unregisterTarget, reportTargetLayout, onTargetAction, currentStep } = useTutorial();
  const viewRef = useRef<View>(null);

  const measureLayout = useCallback((): Promise<TargetLayout | null> => {
    return new Promise((resolve) => {
      if (!viewRef.current) {
        resolve(null);
        return;
      }

      // Web fallback
      if (Platform.OS === 'web') {
        const node = viewRef.current as any;
        if (node && typeof node.getBoundingClientRect === 'function') {
          const rect = node.getBoundingClientRect();
          resolve({
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
            pageX: rect.left + window.scrollX,
            pageY: rect.top + window.scrollY,
          });
          return;
        }
      }

      // Native measure in window
      viewRef.current.measureInWindow((x, y, width, height) => {
        if (typeof x === 'number' && typeof y === 'number' && width > 0 && height > 0) {
          resolve({
            x,
            y,
            width,
            height,
            pageX: x,
            pageY: y,
          });
        } else {
          resolve(null);
        }
      });
    });
  }, []);

  useEffect(() => {
    registerTarget(id, measureLayout);
    return () => {
      unregisterTarget(id);
    };
  }, [id, measureLayout, registerTarget, unregisterTarget]);

  const handleLayout = async () => {
    const layout = await measureLayout();
    if (layout) {
      reportTargetLayout(id, layout);
    }
  };

  const isCurrentTarget = currentStep?.targetId === id;

  return (
    <View
      ref={viewRef}
      onLayout={handleLayout}
      style={style}
      className={className}
      onTouchEnd={() => {
        if (isCurrentTarget) {
          onTargetAction(id);
          if (onTargetPress) onTargetPress();
        }
      }}
      {...props}
    >
      {children}
    </View>
  );
}
