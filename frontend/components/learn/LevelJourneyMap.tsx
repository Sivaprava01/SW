import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { JourneyLevelData, FINANCIAL_TIERS } from '@/constants/journeyLevels';
import { useApp } from '@/context/AppContext';

interface LevelJourneyMapProps {
  levels: JourneyLevelData[];
  completedLevels: Set<number>;
  currentLevelNumber: number;
  onSelectLevel: (level: JourneyLevelData) => void;
}

export function LevelJourneyMap({
  levels,
  completedLevels,
  currentLevelNumber,
  onSelectLevel,
}: LevelJourneyMapProps) {
  const { language } = useApp();
  const activeLang = (language === 'hi' || language === 'te' || language === 'en') ? language : 'te';

  // Get alternating alignment class for organic winding path
  const getAlignmentStyle = (index: number) => {
    const pattern = index % 6;
    switch (pattern) {
      case 0:
        return { alignSelf: 'flex-start' as const, marginLeft: 28 };
      case 1:
        return { alignSelf: 'center' as const, marginLeft: -40 };
      case 2:
        return { alignSelf: 'center' as const, marginLeft: 40 };
      case 3:
        return { alignSelf: 'flex-end' as const, marginRight: 28 };
      case 4:
        return { alignSelf: 'center' as const, marginLeft: 40 };
      case 5:
        return { alignSelf: 'center' as const, marginLeft: -40 };
      default:
        return { alignSelf: 'center' as const };
    }
  };

  // Milestone checkpoints after specific tier completion
  const tierMilestones: { [levelNum: number]: string } = {
    6: 'Tier 1 Milestone: Cashflow Master 🏆',
    13: 'Tier 2 Milestone: Safety Shield 🛡️',
    19: 'Tier 3 Milestone: Digital Banking Leader 📱',
    26: 'Tier 4 Milestone: Debt-Free Champion 🎯',
    33: 'Tier 5 Milestone: Wealth Builder 📈',
    39: 'Tier 6 Milestone: Family Shield 🏥',
    45: 'Tier 7 Milestone: Village Entrepreneur 👩‍💼',
    50: 'Grand Milestone: Sakhi Certified Financial Leader 🎓',
  };

  return (
    <View className="w-full py-4 px-2 items-center">
      {levels.map((level, idx) => {
        const isCompleted = completedLevels.has(level.levelNumber);
        const isCurrent = level.levelNumber === currentLevelNumber;
        const isLocked = !isCompleted && !isCurrent && level.levelNumber > currentLevelNumber;

        const title = level.title[activeLang] || level.title.en;
        const tierName = level.tierName[activeLang] || level.tierName.en;
        const alignStyle = getAlignmentStyle(idx);
        const milestoneText = tierMilestones[level.levelNumber];

        return (
          <View key={level.levelNumber} className="w-full items-center my-1.5">
            {/* Winding Connecting Dotted Path Line */}
            {idx > 0 && (
              <View style={styles.trailContainer}>
                <View style={[styles.trailDot, isCompleted ? styles.trailDotCompleted : styles.trailDotLocked]} />
                <View style={[styles.trailDot, isCompleted ? styles.trailDotCompleted : styles.trailDotLocked]} />
                <View style={[styles.trailDot, isCompleted ? styles.trailDotCompleted : styles.trailDotLocked]} />
              </View>
            )}

            {/* Level Interactive Node */}
            <View style={[styles.nodeWrapper, alignStyle]}>
              <TouchableOpacity
                onPress={() => onSelectLevel(level)}
                disabled={isLocked}
                activeOpacity={0.85}
                accessibilityLabel={`Level ${level.levelNumber}: ${title}`}
                style={[
                  styles.nodeButton,
                  isCompleted && styles.nodeCompleted,
                  isCurrent && styles.nodeCurrent,
                  isLocked && styles.nodeLocked,
                ]}
              >
                {/* Visual Status Indicator inside Node */}
                {isCompleted ? (
                  <View className="items-center justify-center">
                    <MaterialIcons name="check" size={24} color="#ffffff" />
                    <Text className="text-[10px] font-bold text-white font-mono leading-none mt-0.5">
                      {level.levelNumber}
                    </Text>
                  </View>
                ) : isCurrent ? (
                  <View className="items-center justify-center">
                    <MaterialIcons name={level.iconName as any} size={22} color="#ffffff" />
                    <Text className="text-[11px] font-bold text-white font-mono leading-none mt-0.5">
                      {level.levelNumber}
                    </Text>
                  </View>
                ) : (
                  <View className="items-center justify-center">
                    <MaterialIcons name="lock" size={18} color="#8c7164" />
                    <Text className="text-[10px] font-semibold text-on-surface-variant font-mono leading-none mt-0.5">
                      {level.levelNumber}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Title & Tier Badge Card */}
              <TouchableOpacity
                onPress={() => onSelectLevel(level)}
                disabled={isLocked}
                activeOpacity={0.85}
                className={`mt-1.5 max-w-[170px] rounded-xl p-2 items-center text-center shadow-xs border ${
                  isCurrent
                    ? 'bg-primary-container/15 border-primary shadow-sm'
                    : isCompleted
                    ? 'bg-surface-container-lowest border-surface-container-highest/70'
                    : 'bg-surface-container-high border-surface-container-highest/40 opacity-70'
                }`}
              >
                <View className="flex-row items-center gap-1 mb-0.5">
                  <View
                    className={`w-2 h-2 rounded-full ${
                      isCompleted ? 'bg-secondary' : isCurrent ? 'bg-primary' : 'bg-outline/50'
                    }`}
                  />
                  <Text className="text-[9px] font-bold text-primary uppercase truncate">
                    {tierName}
                  </Text>
                </View>
                <Text
                  numberOfLines={2}
                  className={`text-[11px] text-center font-bold leading-tight ${
                    isCurrent ? 'text-primary' : isLocked ? 'text-on-surface-variant' : 'text-on-surface'
                  }`}
                >
                  {title}
                </Text>
                {isCurrent && (
                  <View className="bg-primary px-2 py-0.2 rounded-full mt-1">
                    <Text className="text-[9px] font-bold text-white">
                      {activeLang === 'te' ? 'నేర్చుకోండి →' : activeLang === 'hi' ? 'सीखें →' : 'Learn →'}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Tier Milestone Checkpoint Banner */}
            {milestoneText && (
              <View className="w-full max-w-xs my-3 px-4 py-2.5 rounded-2xl bg-surface-container-highest border border-primary/30 flex-row items-center justify-center shadow-xs">
                <MaterialIcons name="stars" size={18} color="#9d4300" className="mr-1.5" />
                <Text className="text-xs font-bold text-primary text-center">
                  {milestoneText}
                </Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  trailContainer: {
    height: 28,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  trailDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  trailDotCompleted: {
    backgroundColor: '#ff8947',
  },
  trailDotLocked: {
    backgroundColor: '#d6c2b4',
  },
  nodeWrapper: {
    alignItems: 'center',
  },
  nodeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  nodeCompleted: {
    backgroundColor: '#2e7d32',
    borderWidth: 2.5,
    borderColor: '#a5d6a7',
  },
  nodeCurrent: {
    backgroundColor: '#9d4300',
    borderWidth: 3,
    borderColor: '#ffdbca',
    transform: [{ scale: 1.08 }],
    shadowColor: '#9d4300',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  nodeLocked: {
    backgroundColor: '#f1e0cc',
    borderWidth: 1.5,
    borderColor: '#d6c2b4',
  },
});
