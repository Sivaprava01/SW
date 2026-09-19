/**
 * Static pre-bundled local MP3 asset registry for the Sakhi Onboarding Card Tour.
 * Enables 100% offline, zero-network instant audio playback across English, Telugu, and Hindi.
 */

export const TOUR_AUDIO_ASSETS: Record<'en' | 'te' | 'hi', Record<number, any>> = {
  en: {
    1: require('@/assets/audio/tour/tour-en-01.mp3'),
    2: require('@/assets/audio/tour/tour-en-02.mp3'),
    3: require('@/assets/audio/tour/tour-en-03.mp3'),
    4: require('@/assets/audio/tour/tour-en-04.mp3'),
    5: require('@/assets/audio/tour/tour-en-05.mp3'),
    6: require('@/assets/audio/tour/tour-en-06.mp3'),
    7: require('@/assets/audio/tour/tour-en-07.mp3'),
  },
  te: {
    1: require('@/assets/audio/tour/tour-te-01.mp3'),
    2: require('@/assets/audio/tour/tour-te-02.mp3'),
    3: require('@/assets/audio/tour/tour-te-03.mp3'),
    4: require('@/assets/audio/tour/tour-te-04.mp3'),
    5: require('@/assets/audio/tour/tour-te-05.mp3'),
    6: require('@/assets/audio/tour/tour-te-06.mp3'),
    7: require('@/assets/audio/tour/tour-te-07.mp3'),
  },
  hi: {
    1: require('@/assets/audio/tour/tour-hi-01.mp3'),
    2: require('@/assets/audio/tour/tour-hi-02.mp3'),
    3: require('@/assets/audio/tour/tour-hi-03.mp3'),
    4: require('@/assets/audio/tour/tour-hi-04.mp3'),
    5: require('@/assets/audio/tour/tour-hi-05.mp3'),
    6: require('@/assets/audio/tour/tour-hi-06.mp3'),
    7: require('@/assets/audio/tour/tour-hi-07.mp3'),
  },
};

export function getTourAudioAsset(language: 'en' | 'te' | 'hi' | string, cardIndex: number): any | null {
  const lang = (language === 'te' || language === 'hi' || language === 'en') ? language : 'en';
  return TOUR_AUDIO_ASSETS[lang]?.[cardIndex] || null;
}
