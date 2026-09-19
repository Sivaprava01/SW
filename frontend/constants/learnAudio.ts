/**
 * Static require mappings for Learn Level pre-generated audio assets.
 * 15 levels x 3 languages (English, Telugu, Hindi) = 45 bundled audio files.
 */

export const LEARN_LEVEL_AUDIO: Record<
  number,
  { en: any; te: any; hi: any }
> = {
  1: {
    en: require('@/assets/audio/learn/learn-en-01.mp3'),
    te: require('@/assets/audio/learn/learn-te-01.mp3'),
    hi: require('@/assets/audio/learn/learn-hi-01.mp3'),
  },
  2: {
    en: require('@/assets/audio/learn/learn-en-02.mp3'),
    te: require('@/assets/audio/learn/learn-te-02.mp3'),
    hi: require('@/assets/audio/learn/learn-hi-02.mp3'),
  },
  3: {
    en: require('@/assets/audio/learn/learn-en-03.mp3'),
    te: require('@/assets/audio/learn/learn-te-03.mp3'),
    hi: require('@/assets/audio/learn/learn-hi-03.mp3'),
  },
  4: {
    en: require('@/assets/audio/learn/learn-en-04.mp3'),
    te: require('@/assets/audio/learn/learn-te-04.mp3'),
    hi: require('@/assets/audio/learn/learn-hi-04.mp3'),
  },
  5: {
    en: require('@/assets/audio/learn/learn-en-05.mp3'),
    te: require('@/assets/audio/learn/learn-te-05.mp3'),
    hi: require('@/assets/audio/learn/learn-hi-05.mp3'),
  },
  6: {
    en: require('@/assets/audio/learn/learn-en-06.mp3'),
    te: require('@/assets/audio/learn/learn-te-06.mp3'),
    hi: require('@/assets/audio/learn/learn-hi-06.mp3'),
  },
  7: {
    en: require('@/assets/audio/learn/learn-en-07.mp3'),
    te: require('@/assets/audio/learn/learn-te-07.mp3'),
    hi: require('@/assets/audio/learn/learn-hi-07.mp3'),
  },
  8: {
    en: require('@/assets/audio/learn/learn-en-08.mp3'),
    te: require('@/assets/audio/learn/learn-te-08.mp3'),
    hi: require('@/assets/audio/learn/learn-hi-08.mp3'),
  },
  9: {
    en: require('@/assets/audio/learn/learn-en-09.mp3'),
    te: require('@/assets/audio/learn/learn-te-09.mp3'),
    hi: require('@/assets/audio/learn/learn-hi-09.mp3'),
  },
  10: {
    en: require('@/assets/audio/learn/learn-en-10.mp3'),
    te: require('@/assets/audio/learn/learn-te-10.mp3'),
    hi: require('@/assets/audio/learn/learn-hi-10.mp3'),
  },
  11: {
    en: require('@/assets/audio/learn/learn-en-11.mp3'),
    te: require('@/assets/audio/learn/learn-te-11.mp3'),
    hi: require('@/assets/audio/learn/learn-hi-11.mp3'),
  },
  12: {
    en: require('@/assets/audio/learn/learn-en-12.mp3'),
    te: require('@/assets/audio/learn/learn-te-12.mp3'),
    hi: require('@/assets/audio/learn/learn-hi-12.mp3'),
  },
  13: {
    en: require('@/assets/audio/learn/learn-en-13.mp3'),
    te: require('@/assets/audio/learn/learn-te-13.mp3'),
    hi: require('@/assets/audio/learn/learn-hi-13.mp3'),
  },
  14: {
    en: require('@/assets/audio/learn/learn-en-14.mp3'),
    te: require('@/assets/audio/learn/learn-te-14.mp3'),
    hi: require('@/assets/audio/learn/learn-hi-14.mp3'),
  },
  15: {
    en: require('@/assets/audio/learn/learn-en-15.mp3'),
    te: require('@/assets/audio/learn/learn-te-15.mp3'),
    hi: require('@/assets/audio/learn/learn-hi-15.mp3'),
  },
};

export function getLearnAudio(levelNumber: number, lang: 'en' | 'te' | 'hi' = 'en') {
  const levelMap = LEARN_LEVEL_AUDIO[levelNumber];
  if (!levelMap) return null;
  return levelMap[lang] || levelMap.en;
}

export default LEARN_LEVEL_AUDIO;
