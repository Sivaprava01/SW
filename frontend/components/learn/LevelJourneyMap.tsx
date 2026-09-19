import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LearnLevelData } from '@/constants/learnLevels';
import { useApp } from '@/context/AppContext';

interface LevelJourneyMapProps {
  levels: LearnLevelData[];
  completedLevels: Set<number>;
  currentLevelNumber: number;
  onSelectLevel: (level: LearnLevelData) => void;
}

export function LevelJourneyMap({
  levels,
  completedLevels,
  currentLevelNumber,
  onSelectLevel,
}: LevelJourneyMapProps) {
  const { language } = useApp();
  const activeLang = (language === 'hi' || language === 'te' || language === 'en') ? language : 'te';

  // S-Curve alternating horizontal offsets (safe responsive margins)
  const getAlignmentStyle = (levelNumber: number) => {
    const pattern = levelNumber % 4;
    switch (pattern) {
      case 1:
        // Right side
        return { alignSelf: 'center' as const, transform: [{ translateX: 50 }] };
      case 2:
        // Left side
        return { alignSelf: 'center' as const, transform: [{ translateX: -50 }] };
      case 3:
        // Center-right
        return { alignSelf: 'center' as const, transform: [{ translateX: 40 }] };
      case 0:
        // Center-left
        return { alignSelf: 'center' as const, transform: [{ translateX: -40 }] };
      default:
        return { alignSelf: 'center' as const };
    }
  };

  // Milestone checkpoints after specific tier completion (15-level curriculum)
  const tierMilestones: { [levelNum: number]: string } = {
    5: activeLang === 'te' ? 'మైలురాయి 1: నగదు & బడ్జెట్ విజేత 🏆' : activeLang === 'hi' ? 'पड़ाव 1: आय-व्यय और बजट विजेता 🏆' : 'Milestone 1: Budget Master 🏆',
    7: activeLang === 'te' ? 'మైలురాయి 2: అత్యవసర రక్షణ నిధి సిద్ధం 🛡️' : activeLang === 'hi' ? 'पड़ाव 2: सुरक्षा कवच तैयार 🛡️' : 'Milestone 2: Safety Shield Activated 🛡️',
    10: activeLang === 'te' ? 'మైలురాయి 3: బ్యాంకింగ్ & అప్పుల విముక్తి 🤝' : activeLang === 'hi' ? 'पड़ाव 3: बैंकिंग और कर्ज मुक्ति 🤝' : 'Milestone 3: Banking & Debt Free 🤝',
    12: activeLang === 'te' ? 'మైలురాయి 4: సంపద & చక్రవడ్డీ సాధకురాలు 📈' : activeLang === 'hi' ? 'पड़ाव 4: धन संचय और चक्रवृद्धि 📈' : 'Milestone 4: Wealth & Compounding 📈',
    15: activeLang === 'te' ? 'మహా మైలురాయి: సఖి సంపూర్ణ ఆర్థిక స్వావలంబన సాధకురాలు 🎓' : activeLang === 'hi' ? 'महा पड़ाव: सखी प्रमाणित वित्तीय आत्मनिर्भरता लीडर 🎓' : 'Grand Milestone: Financial Independence Leader 🎓',
  };

  // Render from Level 15 (Summit at Top) down to Level 1 (Base at Bottom)
  const orderedLevels = [...levels].sort((a, b) => b.levelNumber - a.levelNumber);

  return (
    <View className="w-full py-6 px-4 items-center">
      {orderedLevels.map((level, idx) => {
        const isCompleted = completedLevels.has(level.levelNumber);
        const isCurrent = level.levelNumber === currentLevelNumber;
        const isUpcoming = !isCompleted && !isCurrent;

        const title = level.title[activeLang] || level.title.en;
        const tierName = level.tierName[activeLang] || level.tierName.en;
        const alignStyle = getAlignmentStyle(level.levelNumber);
        const milestoneText = tierMilestones[level.levelNumber];

        return (
          <View key={level.levelNumber} className="w-full items-center my-1.5">
            {/* Top Summit Flag for Level 15 */}
            {level.levelNumber === 15 && (
              <View className="mb-4 px-4 py-2 rounded-2xl bg-primary/10 border border-primary/30 flex-row items-center justify-center shadow-xs">
                <MaterialIcons name="emoji-events" size={20} color="#9d4300" />
                <Text className="text-xs font-bold text-primary ml-1.5 uppercase tracking-wide">
                  {activeLang === 'te' ? 'ఆర్థిక విజయం శిఖరం (Summit)' : activeLang === 'hi' ? 'वित्तीय सफलता शिखर (Summit)' : 'Financial Summit (Level 15)'}
                </Text>
              </View>
            )}

            {/* Level Interactive Node + Card */}
            <View style={[styles.nodeWrapper, alignStyle]}>
              <TouchableOpacity
                onPress={() => onSelectLevel(level)}
                activeOpacity={0.85}
                accessibilityLabel={
                  activeLang === 'te'
                    ? `లెవెల్ ${level.levelNumber}: ${title}`
                    : activeLang === 'hi'
                    ? `स्तर ${level.levelNumber}: ${title}`
                    : `Level ${level.levelNumber}: ${title}`
                }
                style={[
                  styles.nodeButton,
                  isCompleted && styles.nodeCompleted,
                  isCurrent && styles.nodeCurrent,
                  isUpcoming && styles.nodeUpcoming,
                ]}
              >
                {/* Visual Status Indicator inside Node */}
                {isCompleted ? (
                  <View className="items-center justify-center">
                    <MaterialIcons name="check" size={22} color="#ffffff" />
                    <Text className="text-[10px] font-bold text-white font-mono leading-none mt-0.5">
                      {level.levelNumber}
                    </Text>
                  </View>
                ) : isCurrent ? (
                  <View className="items-center justify-center">
                    <MaterialIcons name={level.iconName as any} size={20} color="#ffffff" />
                    <Text className="text-[11px] font-bold text-white font-mono leading-none mt-0.5">
                      {level.levelNumber}
                    </Text>
                  </View>
                ) : (
                  <View className="items-center justify-center">
                    <MaterialIcons name={level.iconName as any} size={18} color="#8c7164" />
                    <Text className="text-[10px] font-semibold text-on-surface-variant font-mono leading-none mt-0.5">
                      {level.levelNumber}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Title & Tier Badge Card (Always Clickable) */}
              <TouchableOpacity
                onPress={() => onSelectLevel(level)}
                activeOpacity={0.85}
                className={`mt-1.5 w-[160px] rounded-xl p-2 items-center text-center shadow-xs border ${
                  isCurrent
                    ? 'bg-primary-container/15 border-primary shadow-sm'
                    : isCompleted
                    ? 'bg-surface-container-lowest border-surface-container-highest/80'
                    : 'bg-surface-container-high border-surface-container-highest/50'
                }`}
              >
                <View className="flex-row items-center gap-1 mb-0.5">
                  <View
                    className={`w-2 h-2 rounded-full ${
                      isCompleted ? 'bg-secondary' : isCurrent ? 'bg-primary' : 'bg-outline/50'
                    }`}
                  />
                  <Text className="text-[9px] font-bold text-primary uppercase truncate max-w-[130px]">
                    {tierName}
                  </Text>
                </View>
                <Text
                  numberOfLines={2}
                  className={`text-[11px] text-center font-bold leading-tight ${
                    isCurrent ? 'text-primary' : isUpcoming ? 'text-on-surface-variant' : 'text-on-surface'
                  }`}
                >
                  {title}
                </Text>
                {isCurrent && (
                  <View className="bg-primary px-2 py-0.5 rounded-full mt-1">
                    <Text className="text-[9px] font-bold text-white">
                      {activeLang === 'te' ? 'నేర్చుకోండి →' : activeLang === 'hi' ? 'सीखें →' : 'Learn →'}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Connecting Dotted Trail Line (Descending towards base) */}
            {idx < orderedLevels.length - 1 && (
              <View style={styles.trailContainer}>
                <View style={[styles.trailDot, isCompleted ? styles.trailDotCompleted : styles.trailDotDefault]} />
                <View style={[styles.trailDot, isCompleted ? styles.trailDotCompleted : styles.trailDotDefault]} />
                <View style={[styles.trailDot, isCompleted ? styles.trailDotCompleted : styles.trailDotDefault]} />
              </View>
            )}

            {/* Tier Milestone Checkpoint Banner */}
            {milestoneText && (
              <View className="w-full max-w-xs my-2.5 px-4 py-2 rounded-2xl bg-surface-container-highest border border-primary/30 flex-row items-center justify-center shadow-xs">
                <MaterialIcons name="stars" size={16} color="#9d4300" className="mr-1.5" />
                <Text className="text-xs font-bold text-primary text-center">
                  {milestoneText}
                </Text>
              </View>
            )}

            {/* Base Start Banner for Level 1 */}
            {level.levelNumber === 1 && (
              <View className="mt-4 px-4 py-2 rounded-2xl bg-secondary/10 border border-secondary/30 flex-row items-center justify-center shadow-xs">
                <MaterialIcons name="flag" size={18} color="#2e7d32" />
                <Text className="text-xs font-bold text-secondary ml-1.5 uppercase tracking-wide">
                  {activeLang === 'te' ? 'ఆరంభం: మొదటి అడుగు (Level 1 Start)' : activeLang === 'hi' ? 'शुरुआत: पहला कदम (Level 1 Start)' : 'Start Here (Level 1)'}
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
    height: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
    marginVertical: 4,
  },
  trailDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  trailDotCompleted: {
    backgroundColor: '#2e7d32',
  },
  trailDotDefault: {
    backgroundColor: '#d6c2b4',
  },
  nodeWrapper: {
    alignItems: 'center',
  },
  nodeButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
  nodeUpcoming: {
    backgroundColor: '#f5e8dc',
    borderWidth: 2,
    borderColor: '#d6c2b4',
  },
});
