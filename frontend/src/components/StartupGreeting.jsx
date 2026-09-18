import React, { useState, useEffect } from 'react';
import {
  IconArrowRight,
  IconVolume,
  IconPlayerPlay,
  IconPlayerPause,
  IconCheck,
} from '@tabler/icons-react';
import { useUser } from '../context/UserContext';

const LANGUAGES = [
  { code: 'te', native: 'తెలుగు', name: 'Telugu' },
  { code: 'en', native: 'English', name: 'English' },
  { code: 'hi', native: 'हिंदी', name: 'Hindi' },
];

const GREETINGS_BY_LANG = {
  te: {
    title: (name) => `నమస్తే ${name || 'లక్ష్మి'} గారు 👋`,
    subtitle: 'మీ వ్యక్తిగత ఆర్థిక సహాయకురాలు',
    voiceLabel: 'వినండి (Listen)',
    cta: 'ప్రారంభించండి',
  },
  en: {
    title: (name) => `Namaste, ${name || 'Lakshmi'} 👋`,
    subtitle: 'Your personal financial companion',
    voiceLabel: 'Listen to greeting',
    cta: 'Get Started',
  },
  hi: {
    title: (name) => `नमस्ते ${name || 'लक्ष्मी'} जी 👋`,
    subtitle: 'आपकी व्यक्तिगत सखी वित्तीय साथी',
    voiceLabel: 'सुनिए (Listen)',
    cta: 'शुरू करें',
  },
};

export default function StartupGreeting({ name = 'Lakshmi', onComplete }) {
  const { language, setLanguage, user } = useUser();
  const [fading, setFading] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const activeLang = ['te', 'en', 'hi'].includes(language) ? language : 'te';
  const greetingConfig = GREETINGS_BY_LANG[activeLang] || GREETINGS_BY_LANG.te;
  const displayName = user?.name || name || 'Lakshmi';
  const greetingTitle = greetingConfig.title(displayName);

  const handleDismiss = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setFading(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 350);
  };

  const handleSelectLang = (e, langCode) => {
    if (e) e.stopPropagation();
    setLanguage(langCode);
    if (isAudioPlaying && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsAudioPlaying(false);
    }
  };

  const handleToggleVoiceAudio = (e) => {
    if (e) e.stopPropagation();

    if (isAudioPlaying) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsAudioPlaying(false);
      return;
    }

    setIsAudioPlaying(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(
        `${greetingTitle}. ${greetingConfig.subtitle}`
      );
      utter.rate = 0.95;
      utter.pitch = 1.05;
      if (activeLang === 'te') utter.lang = 'te-IN';
      else if (activeLang === 'hi') utter.lang = 'hi-IN';
      else utter.lang = 'en-IN';

      utter.onend = () => setIsAudioPlaying(false);
      utter.onerror = () => setIsAudioPlaying(false);
      window.speechSynthesis.speak(utter);
    } else {
      setTimeout(() => setIsAudioPlaying(false), 2000);
    }
  };

  return (
    <div
      id="splash-screen"
      role="region"
      aria-label="Welcome screen for Sakhi Financial Companion"
      className={`fixed inset-0 z-[100] bg-[#fff8f3] dark:bg-[#14110F] flex flex-col justify-center items-center overflow-y-auto px-4 py-8 text-[#221a0e] dark:text-[#FFF5EB] transition-all duration-350 select-none ${
        fading ? 'opacity-0 pointer-events-none scale-98' : 'opacity-100 scale-100'
      }`}
    >
      {/* Subtle ambient warm glow */}
      <div aria-hidden="true" className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-orange-400/15 dark:bg-orange-500/10 blur-3xl pointer-events-none" />

      {/* Main Clean Card */}
      <div className="w-full max-w-sm mx-auto z-10 flex flex-col items-center text-center space-y-5">
        
        {/* Mascot Emblem */}
        <div className="relative">
          <div aria-hidden="true" className="absolute -inset-2 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-3xl opacity-30 blur-lg" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white dark:bg-[#1e1b19] border-2 border-amber-200/80 dark:border-[#3D332B] p-2 shadow-xl flex items-center justify-center">
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-rose-600 flex items-center justify-center shadow-md">
              <span className="font-headline text-4xl sm:text-5xl font-black text-white select-none">
                స
              </span>
            </div>
          </div>
        </div>

        {/* Personalized Greeting */}
        <div className="space-y-1">
          <h1 className="font-headline text-2xl sm:text-3xl font-black tracking-tight text-[#221a0e] dark:text-[#FFF5EB]">
            {greetingTitle}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-[#D4C4B5] font-medium">
            {greetingConfig.subtitle}
          </p>
        </div>

        {/* Language Selector: 3 Clean Options (Telugu, English, Hindi) */}
        <div className="w-full pt-1">
          <div className="grid grid-cols-3 gap-2">
            {LANGUAGES.map((lang) => {
              const isSelected = activeLang === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={(e) => handleSelectLang(e, lang.code)}
                  className={`py-2.5 px-2 rounded-2xl text-xs font-bold transition flex flex-col items-center justify-center cursor-pointer border ${
                    isSelected
                      ? 'bg-orange-600 text-white border-orange-600 shadow-md scale-102'
                      : 'bg-white dark:bg-[#1e1b19] text-stone-700 dark:text-[#D4C4B5] border-amber-200/70 dark:border-[#3D332B] hover:bg-amber-50'
                  }`}
                >
                  <span className="text-sm font-black">{lang.native}</span>
                  <span className="text-[10px] opacity-85 mt-0.5">{lang.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Spoken Audio Voice Button */}
        <button
          type="button"
          onClick={handleToggleVoiceAudio}
          className="w-full bg-white dark:bg-[#1e1b19] border border-amber-200/80 dark:border-[#3D332B] rounded-2xl p-3 shadow-xs flex items-center justify-between gap-3 cursor-pointer hover:border-orange-300 transition active:scale-98"
        >
          <div className="flex items-center gap-2.5 text-left min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#fcebd7] dark:bg-[#28211C] flex items-center justify-center shrink-0 text-orange-600 dark:text-[#ffb690]">
              <IconVolume size={18} />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-[#221a0e] dark:text-[#FFF5EB] block truncate">
                {isAudioPlaying ? 'Speaking...' : greetingConfig.voiceLabel}
              </span>
              <span className="text-[10px] text-stone-500 dark:text-[#A8988A]">
                {activeLang === 'te' ? 'వాయిస్ గైడెన్స్' : activeLang === 'hi' ? 'आवाज़ में सुनें' : 'Audio guidance'}
              </span>
            </div>
          </div>

          <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            {isAudioPlaying ? <IconPlayerPause size={16} /> : <IconPlayerPlay size={16} />}
          </div>
        </button>

        {/* Primary Action Button */}
        <div className="w-full pt-1">
          <button
            type="button"
            id="continue-button"
            onClick={handleDismiss}
            className="w-full py-3.5 px-6 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-headline text-base font-bold shadow-lg shadow-orange-600/25 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{greetingConfig.cta}</span>
            <IconArrowRight size={20} />
          </button>
        </div>

      </div>
    </div>
  );
}
