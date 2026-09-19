/**
 * Static require mappings for Journey Stage pre-generated audio assets.
 * 7 stages x 3 languages (English, Telugu, Hindi) = 21 bundled audio files.
 */

export const JOURNEY_STAGE_AUDIO: Record<
  number,
  { en: any; te: any; hi: any }
> = {
  1: {
    en: require('@/assets/audio/journey/journey-en-01.mp3'),
    te: require('@/assets/audio/journey/journey-te-01.mp3'),
    hi: require('@/assets/audio/journey/journey-hi-01.mp3'),
  },
  2: {
    en: require('@/assets/audio/journey/journey-en-02.mp3'),
    te: require('@/assets/audio/journey/journey-te-02.mp3'),
    hi: require('@/assets/audio/journey/journey-hi-02.mp3'),
  },
  3: {
    en: require('@/assets/audio/journey/journey-en-03.mp3'),
    te: require('@/assets/audio/journey/journey-te-03.mp3'),
    hi: require('@/assets/audio/journey/journey-hi-03.mp3'),
  },
  4: {
    en: require('@/assets/audio/journey/journey-en-04.mp3'),
    te: require('@/assets/audio/journey/journey-te-04.mp3'),
    hi: require('@/assets/audio/journey/journey-hi-04.mp3'),
  },
  5: {
    en: require('@/assets/audio/journey/journey-en-05.mp3'),
    te: require('@/assets/audio/journey/journey-te-05.mp3'),
    hi: require('@/assets/audio/journey/journey-hi-05.mp3'),
  },
  6: {
    en: require('@/assets/audio/journey/journey-en-06.mp3'),
    te: require('@/assets/audio/journey/journey-te-06.mp3'),
    hi: require('@/assets/audio/journey/journey-hi-06.mp3'),
  },
  7: {
    en: require('@/assets/audio/journey/journey-en-07.mp3'),
    te: require('@/assets/audio/journey/journey-te-07.mp3'),
    hi: require('@/assets/audio/journey/journey-hi-07.mp3'),
  },
};

export function getJourneyStageAudio(stageNumber: number, lang: 'en' | 'te' | 'hi' = 'en') {
  const stageMap = JOURNEY_STAGE_AUDIO[stageNumber];
  if (!stageMap) return null;
  return stageMap[lang] || stageMap.en;
}

export default JOURNEY_STAGE_AUDIO;
