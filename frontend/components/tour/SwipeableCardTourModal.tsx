import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet,
  Platform,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ViewToken,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { TOUR_CARDS, TourCardData } from '@/constants/tourCards';
import { getTourAudioAsset } from '@/constants/tourAssets';
import { audioPlayer } from '@/services/audioPlayer';

interface SwipeableCardTourModalProps {
  visible: boolean;
  onClose: (completed: boolean) => void;
}

export function SwipeableCardTourModal({ visible, onClose }: SwipeableCardTourModalProps) {
  const insets = useSafeAreaInsets();
  const { language } = useApp();
  const activeLang = (language === 'hi' || language === 'te' || language === 'en') ? language : 'te';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  const flatListRef = useRef<FlatList<TourCardData>>(null);
  const audioRequestTokenRef = useRef<number>(0);
  const windowDimensions = Dimensions.get('window');
  const [screenWidth, setScreenWidth] = useState(windowDimensions.width);

  // Sync screen width on resize / orientation change
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  // Audio status subscriber
  useEffect(() => {
    const unsubscribe = audioPlayer.subscribe((event) => {
      const activeCard = TOUR_CARDS[currentIndex];
      const activeAudioId = activeCard ? `tour-card-${activeCard.index}-${activeLang}` : null;

      if (activeAudioId && event.currentId === activeAudioId) {
        setIsPlayingAudio(event.state === 'playing');
        setIsLoadingAudio(event.state === 'loading');
      } else {
        setIsPlayingAudio(false);
        setIsLoadingAudio(false);
      }
    });
    return () => unsubscribe();
  }, [currentIndex, activeLang]);

  // Audio Playback Orchestrator (100% Local Pre-bundled MP3s)
  const playCardAudio = useCallback(
    async (cardIndex: number) => {
      const currentToken = ++audioRequestTokenRef.current;
      const targetCard = TOUR_CARDS[cardIndex];
      if (!targetCard) return;

      const audioAsset = getTourAudioAsset(activeLang, targetCard.index);
      if (!audioAsset) {
        if (__DEV__) console.log(`[CardTour] No local audio asset for card ${targetCard.index} in ${activeLang}`);
        return;
      }

      // Stop previous audio immediately
      audioPlayer.stop();

      try {
        setIsLoadingAudio(true);
        const audioId = `tour-card-${targetCard.index}-${activeLang}`;

        // Guard: check token before playing
        if (audioRequestTokenRef.current !== currentToken) {
          return;
        }

        await audioPlayer.playAsset(audioAsset, audioId);
      } catch (err: any) {
        if (__DEV__) console.warn(`[CardTour] Audio playback error for card ${targetCard.index}:`, err);
      } finally {
        if (audioRequestTokenRef.current === currentToken) {
          setIsLoadingAudio(false);
        }
      }
    },
    [activeLang]
  );

  // Trigger audio on card transition when modal is visible
  useEffect(() => {
    if (!visible) {
      audioRequestTokenRef.current += 1;
      audioPlayer.stop();
      setIsPlayingAudio(false);
      setIsLoadingAudio(false);
      return;
    }

    // Play local audio for the active card
    playCardAudio(currentIndex);

    return () => {
      audioRequestTokenRef.current += 1;
      audioPlayer.stop();
    };
  }, [visible, currentIndex, playCardAudio]);

  // Reset index to 0 when modal opens
  useEffect(() => {
    if (visible) {
      setCurrentIndex(0);
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({ offset: 0, animated: false });
      }
    }
  }, [visible]);

  // Handle manual audio toggle for current card
  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      audioPlayer.stop();
    } else {
      playCardAudio(currentIndex);
    }
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentIndex < TOUR_CARDS.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
    }
  };

  const handleSkip = () => {
    audioPlayer.stop();
    onClose(true); // Mark as completed on skip as requested
  };

  const handleComplete = () => {
    audioPlayer.stop();
    onClose(true);
  };

  // Track active index from swipe momentum
  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / screenWidth);
    if (newIndex >= 0 && newIndex < TOUR_CARDS.length && newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems && viewableItems.length > 0 && viewableItems[0].index !== null && viewableItems[0].index !== undefined) {
        const idx = viewableItems[0].index;
        if (idx !== currentIndex && idx >= 0 && idx < TOUR_CARDS.length) {
          setCurrentIndex(idx);
        }
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;

  // Localized UI strings
  const labels = {
    skip: activeLang === 'te' ? 'వదిలివేయి (Skip)' : activeLang === 'hi' ? 'छोड़ें (Skip)' : 'Skip',
    next: activeLang === 'te' ? 'తర్వాత →' : activeLang === 'hi' ? 'आगे →' : 'Next →',
    back: activeLang === 'te' ? '← వెనుకకు' : activeLang === 'hi' ? '← पीछे' : '← Back',
    getStarted: activeLang === 'te' ? 'సఖిని ప్రారంభించండి 🚀' : activeLang === 'hi' ? 'शुरू करें 🚀' : 'Get Started 🚀',
    cardCount: (idx: number, total: number) =>
      activeLang === 'te' ? `${idx} / ${total}` : activeLang === 'hi' ? `${idx} / ${total}` : `${idx} of ${total}`,
  };

  const currentCard = TOUR_CARDS[currentIndex] || TOUR_CARDS[0];
  const isLastCard = currentIndex === TOUR_CARDS.length - 1;

  if (!visible) return null;

  const renderCardItem = ({ item }: { item: TourCardData }) => {
    const title = item.title[activeLang] || item.title.en;
    const desc = item.description[activeLang] || item.description.en;
    const category = item.category[activeLang] || item.category.en;
    const badge = item.highlightBadge[activeLang] || item.highlightBadge.en;
    const points = item.points[activeLang] || item.points.en;

    return (
      <View style={{ width: screenWidth }} className="items-center justify-center px-4">
        <View className="w-full max-w-sm bg-surface-container rounded-3xl p-5 shadow-lg border border-surface-container-highest/70 flex-col">
          {/* Card Category & Badge Header */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              <Text className="text-[11px] font-bold text-primary tracking-wider uppercase">
                {category}
              </Text>
            </View>

            <View className="bg-surface-container-highest px-2.5 py-1 rounded-full flex-row items-center">
              <MaterialIcons name="verified" size={13} color="#9d4300" />
              <Text className="text-[10px] font-bold text-on-surface-variant ml-1">
                {badge}
              </Text>
            </View>
          </View>

          {/* Central Hero Icon Badge */}
          <View className="items-center my-2">
            <View className="w-20 h-20 rounded-2xl bg-primary-container items-center justify-center shadow-md border-2 border-surface-container-lowest">
              <MaterialIcons name={item.iconName as any} size={42} color="#ffffff" />
            </View>
          </View>

          {/* Title */}
          <Text className="text-xl font-bold text-on-surface text-center mt-3 mb-2 leading-tight">
            {title}
          </Text>

          {/* Short Narrative Description */}
          <Text className="text-xs text-on-surface-variant text-center leading-relaxed mb-4 px-1">
            {desc}
          </Text>

          {/* Highlight Key Feature Bullets */}
          <View className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-xs border border-surface-container-highest/50 gap-2 mb-1">
            {points.map((pt, ptIdx) => (
              <View key={ptIdx} className="flex-row items-start">
                <View className="w-5 h-5 rounded-full bg-primary/15 items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                  <MaterialIcons name="check" size={12} color="#9d4300" />
                </View>
                <Text className="text-xs text-on-surface font-medium flex-1 leading-snug">
                  {pt}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleSkip}
      statusBarTranslucent
    >
      <View
        style={[
          styles.modalContainer,
          {
            paddingTop: Math.max(insets.top, 16),
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}
      >
        {/* Top Header Bar */}
        <View className="w-full px-5 py-2 flex-row items-center justify-between z-10">
          {/* Logo & Step Counter */}
          <View className="flex-row items-center gap-2">
            <View className="w-8 h-8 rounded-full bg-surface-container-high items-center justify-center shadow-xs border border-surface-container-highest/60 overflow-hidden">
              <Image
                source={require('@/assets/images/app-logo-emblem.png')}
                style={{ width: 28, height: 28 }}
                resizeMode="contain"
              />
            </View>
            <View className="bg-surface-container-high px-2.5 py-1 rounded-full border border-surface-container-highest/60">
              <Text className="text-[11px] font-bold text-primary font-mono">
                {labels.cardCount(currentIndex + 1, TOUR_CARDS.length)}
              </Text>
            </View>
          </View>

          {/* Audio Speaker Control & Skip Button */}
          <View className="flex-row items-center gap-2">
            {/* Audio Indicator / Toggle */}
            <TouchableOpacity
              onPress={handleToggleAudio}
              accessibilityLabel="Toggle Tour Audio"
              className="flex-row items-center bg-surface-container-high px-2.5 py-1.5 rounded-full border border-surface-container-highest/60 active:scale-95"
            >
              {isLoadingAudio ? (
                <ActivityIndicator size="small" color="#9d4300" style={{ transform: [{ scale: 0.75 }] }} />
              ) : (
                <MaterialIcons
                  name={isPlayingAudio ? 'volume-up' : 'volume-mute'}
                  size={16}
                  color={isPlayingAudio ? '#9d4300' : '#8c7164'}
                />
              )}
              <Text className="text-[10px] font-bold text-on-surface-variant ml-1">
                {isPlayingAudio ? 'Voice' : 'Play'}
              </Text>
            </TouchableOpacity>

            {/* Skip Button */}
            <TouchableOpacity
              onPress={handleSkip}
              accessibilityLabel="Skip Tour"
              className="px-3 py-1.5 rounded-full bg-surface-container-high active:scale-95"
            >
              <Text className="text-xs font-bold text-on-surface-variant">
                {labels.skip}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Swipeable FlatList Carousel */}
        <View className="flex-1 justify-center">
          <FlatList
            ref={flatListRef}
            data={TOUR_CARDS}
            keyExtractor={(item) => item.id}
            renderItem={renderCardItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            bounces={false}
            decelerationRate="fast"
            snapToAlignment="center"
            snapToInterval={screenWidth}
            onMomentumScrollEnd={onMomentumScrollEnd}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            getItemLayout={(_, index) => ({
              length: screenWidth,
              offset: screenWidth * index,
              index,
            })}
            contentContainerStyle={styles.flatListContent}
          />
        </View>

        {/* Bottom Pagination & Navigation Controls */}
        <View className="w-full px-5 py-3 flex-col items-center gap-3">
          {/* Animated Pagination Dots */}
          <View className="flex-row items-center justify-center gap-1.5 mb-1">
            {TOUR_CARDS.map((_, dotIdx) => {
              const isActive = dotIdx === currentIndex;
              return (
                <TouchableOpacity
                  key={dotIdx}
                  onPress={() => {
                    setCurrentIndex(dotIdx);
                    flatListRef.current?.scrollToIndex({ index: dotIdx, animated: true });
                  }}
                  accessibilityLabel={`Go to card ${dotIdx + 1}`}
                  style={[
                    styles.paginationDot,
                    isActive ? styles.paginationDotActive : styles.paginationDotInactive,
                  ]}
                />
              );
            })}
          </View>

          {/* Navigation Action Buttons Row */}
          <View className="w-full flex-row items-center gap-3 max-w-sm">
            {/* Back Button (Only visible if > 0) */}
            {currentIndex > 0 ? (
              <TouchableOpacity
                onPress={handlePrev}
                accessibilityLabel="Previous Card"
                className="flex-1 bg-surface-container-high py-3.5 px-4 rounded-xl items-center justify-center border border-surface-container-highest/60 active:scale-95"
              >
                <Text className="text-xs font-bold text-on-surface">
                  {labels.back}
                </Text>
              </TouchableOpacity>
            ) : null}

            {/* Next / Get Started Primary Action */}
            <TouchableOpacity
              onPress={handleNext}
              accessibilityLabel={isLastCard ? 'Get Started' : 'Next Card'}
              className={`flex-2 py-3.5 px-5 rounded-xl flex-row items-center justify-center shadow-md active:scale-[0.98] ${
                isLastCard ? 'bg-primary' : 'bg-primary'
              } ${currentIndex === 0 ? 'w-full flex-1' : ''}`}
            >
              <Text className="text-sm font-bold text-white mr-1.5">
                {isLastCard ? labels.getStarted : labels.next}
              </Text>
              {isLastCard ? (
                <MaterialIcons name="check-circle" size={18} color="#ffffff" />
              ) : (
                <MaterialIcons name="arrow-forward" size={18} color="#ffffff" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(15, 10, 8, 0.88)',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 99999,
  },
  flatListContent: {
    alignItems: 'center',
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: '#ff8947',
  },
  paginationDotInactive: {
    width: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
});
