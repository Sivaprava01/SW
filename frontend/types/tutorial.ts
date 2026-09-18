export type LocalizedTutorialText = {
  te: string;
  hi: string;
  en: string;
};

export type TargetLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
  pageX: number;
  pageY: number;
};

export type TutorialActionType = 'tap' | 'next' | 'none';

export type TooltipPosition = 'top' | 'bottom' | 'auto';

export type TutorialStep = {
  id: string;
  targetId: string;
  route?: string; // e.g. '/(tabs)', '/(tabs)/money', '/(tabs)/goals'
  title: LocalizedTutorialText;
  text: LocalizedTutorialText;
  tip?: LocalizedTutorialText;
  action?: TutorialActionType;
  position?: TooltipPosition;
  voiceEnabled?: boolean;
};

export type TutorialCategory = 'core' | 'finance' | 'benefits' | 'ai';

export type TutorialDefinition = {
  id: string;
  name: LocalizedTutorialText;
  description: LocalizedTutorialText;
  icon: string;
  category: TutorialCategory;
  estimatedSeconds: number;
  steps: TutorialStep[];
};

export type TutorialState =
  | 'IDLE'
  | 'SHOWING_STEP'
  | 'WAITING_FOR_USER_ACTION'
  | 'ACTION_COMPLETED'
  | 'NEXT_STEP'
  | 'COMPLETED';
