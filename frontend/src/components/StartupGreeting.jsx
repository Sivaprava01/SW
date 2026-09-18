import React, { useState, useEffect, useRef } from 'react';
import {
  IconSparkles,
  IconArrowRight,
  IconWifi,
  IconShieldLock,
  IconMessageCircle,
  IconVolume,
  IconPlayerPlay,
  IconPlayerPause,
  IconCheck,
  IconRotateClockwise,
  IconLockOpen,
  IconPigMoney,
  IconCalendarTime,
} from '@tabler/icons-react';
import { useUser } from '../context/UserContext';

const GREETINGS = [
  { text: 'Namaste, Lakshmi 👋', sub: 'Your personal financial companion is ready' },
  { text: 'నమస్తే లక్ష్మి గారు 👋', sub: 'మీ వ్యక్తిగత పొదుపు మరియు లెడ్జర్ సహచరి సిద్ధంగా ఉంది' },
  { text: 'नमस्ते लक्ष्मी जी 👋', sub: 'आपकी व्यक्तिगत सखी वित्तीय साथी तैयार है' },
  { text: 'Namaste, Sister 👋', sub: 'Empowering your savings & SHG journey together' },
  { text: 'Pranam, Lakshmiji 🙏', sub: 'Zero jargon • 100% private financial guidance' },
];

const LANGUAGES = [
  { code: 'te', native: 'తెలుగు', name: 'Telugu' },
  { code: 'hi', native: 'हिंदी', name: 'Hindi' },
  { code: 'en', native: 'English', name: 'Simple Terms' },
  { code: 'mr', native: 'मराठी', name: 'Marathi' },
];

export default function StartupGreeting({ name = 'Lakshmi', onComplete }) {
  const { language, setLanguage, user } = useUser();
  const [fading, setFading] = useState(false);
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  // Set initial greeting based on language or user name
  useEffect(() => {
    if (language === 'te') setGreetingIndex(1);
    else if (language === 'hi') setGreetingIndex(2);
    else setGreetingIndex(0);
  }, [language]);

  const handleDismiss = () => {
    setUnlocked(true);
    setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 350);
    }, 450);
  };

  const toggleGreeting = (e) => {
    if (e) e.stopPropagation();
    setGreetingIndex((prev) => (prev + 1) % GREETINGS.length);
  };

  const handleSelectLang = (e, langCode) => {
    if (e) e.stopPropagation();
    setLanguage(langCode);
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
      const currentGreeting = GREETINGS[greetingIndex];
      const utter = new SpeechSynthesisUtterance(
        `${currentGreeting.text}. ${currentGreeting.sub}`
      );
      utter.rate = 0.95;
      utter.pitch = 1.05;
      if (language === 'te') utter.lang = 'te-IN';
      else if (language === 'hi') utter.lang = 'hi-IN';
      else utter.lang = 'en-IN';

      utter.onend = () => setIsAudioPlaying(false);
      utter.onerror = () => setIsAudioPlaying(false);
      window.speechSynthesis.speak(utter);
    } else {
      setTimeout(() => setIsAudioPlaying(false), 2400);
    }
  };

  const activeGreeting = GREETINGS[greetingIndex];
  const displayName = user?.name || name || 'Lakshmi';
  const resolvedGreetingText = activeGreeting.text.replace('Lakshmi', displayName).replace('లక్ష్మి', displayName).replace('लक्ष्मी', displayName);

  return (
    <div
      id="splash-screen"
      role="region"
      aria-label="Welcome screen for Sakhi Financial Companion"
      className={`fixed inset-0 z-[100] bg-[#fff8f3] dark:bg-[#14110F] flex flex-col justify-between overflow-y-auto px-4 py-6 sm:py-8 text-[#221a0e] dark:text-[#FFF5EB] transition-all duration-350 select-none ${
        fading ? 'opacity-0 pointer-events-none scale-98' : 'opacity-100 scale-100'
      }`}
    >
      {/* Subtle ambient decorative glow rings */}
      <div aria-hidden="true" className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-orange-400/20 dark:bg-orange-500/10 blur-3xl pointer-events-none" />
      <div aria-hidden="true" className="absolute -bottom-20 -left-12 w-80 h-80 rounded-full bg-amber-400/20 dark:bg-amber-600/10 blur-3xl pointer-events-none" />

      {/* Top bar: Brand subtle mark & offline indicator */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#fcebd7] dark:bg-[#28211C] rounded-full border border-amber-200/80 dark:border-[#3D332B] shadow-2xs">
          <span className="inline-block w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="font-mono text-xs font-bold text-orange-950 dark:text-[#ffb690] uppercase tracking-wider">
            Sakhi · v2.4
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-[#fcebd7] dark:bg-[#28211C] px-3 py-1.5 rounded-full text-stone-700 dark:text-[#D4C4B5] border border-amber-200/80 dark:border-[#3D332B] shadow-2xs">
          <IconWifi size={14} className="text-orange-600 dark:text-[#ffb690]" />
          <span className="font-mono text-xs font-bold">Offline Safe</span>
        </div>
      </div>

      {/* Main Hero Card */}
      <div className="w-full max-w-md mx-auto my-auto py-4 z-10 flex flex-col items-center text-center space-y-4">
        
        {/* Mascot Emblem with glowing halo */}
        <div 
          onClick={toggleGreeting}
          className="relative group cursor-pointer transition-transform active:scale-95"
          title="Tap to change greeting style"
        >
          <div aria-hidden="true" className="absolute -inset-2 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-3xl opacity-30 blur-lg transition duration-500 group-hover:opacity-60" />
          
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white dark:bg-[#1e1b19] border-2 border-amber-200/80 dark:border-[#3D332B] p-2 shadow-xl flex items-center justify-center">
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-rose-600 flex items-center justify-center shadow-md">
              <span className="font-headline text-4xl sm:text-5xl font-black text-white select-none">
                स
              </span>
            </div>
          </div>

          <div className="absolute -bottom-1 -right-1 bg-orange-600 text-white rounded-full p-1.5 shadow-md flex items-center justify-center border-2 border-white dark:border-[#14110F]">
            <IconSparkles size={14} />
          </div>
        </div>

        {/* Product Badge Pill */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#fcebd7] dark:bg-[#28211C] border border-amber-200/80 dark:border-[#3D332B] shadow-2xs text-orange-950 dark:text-[#ffb690] text-xs font-bold">
          <IconSparkles size={13} className="text-orange-600 dark:text-[#ffb690]" />
          <span>Mahila Bachat Gat & SHG Sahayika</span>
        </div>

        {/* Greeting Headline */}
        <div 
          onClick={toggleGreeting} 
          className="cursor-pointer select-none space-y-1 group"
          title="Tap to switch greeting"
        >
          <h1 className="font-headline text-2xl sm:text-3xl font-black tracking-tight text-[#221a0e] dark:text-[#FFF5EB] group-hover:text-orange-600 dark:group-hover:text-[#ffb690] transition flex items-center justify-center gap-1.5">
            <span>{resolvedGreetingText}</span>
          </h1>
          <p className="text-xs font-medium text-stone-500 dark:text-[#A8988A] flex items-center justify-center gap-1">
            <span>(tap to change greeting style)</span>
            <IconRotateClockwise size={12} className="group-hover:rotate-180 transition duration-300" />
          </p>
        </div>

        {/* Sub-caption */}
        <p className="text-xs sm:text-sm text-stone-600 dark:text-[#D4C4B5] font-medium max-w-xs leading-relaxed">
          {activeGreeting.sub}
        </p>

        {/* Language selector chips */}
        <div className="w-full pt-1">
          <div className="grid grid-cols-4 gap-1.5">
            {LANGUAGES.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={(e) => handleSelectLang(e, lang.code)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center cursor-pointer border ${
                    isSelected
                      ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                      : 'bg-white dark:bg-[#1e1b19] text-stone-700 dark:text-[#D4C4B5] border-amber-200/70 dark:border-[#3D332B] hover:bg-amber-50'
                  }`}
                >
                  <span className="text-xs">{lang.native}</span>
                  <span className="text-[10px] opacity-80">{lang.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Audio Guidance Card */}
        <div className="w-full bg-white dark:bg-[#1e1b19] border border-amber-200/80 dark:border-[#3D332B] rounded-2xl p-3 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-left min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#fcebd7] dark:bg-[#28211C] flex items-center justify-center shrink-0 text-orange-600 dark:text-[#ffb690]">
              <IconVolume size={18} />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-orange-800 dark:text-[#ffb690] uppercase tracking-wide block">
                Voice Guidance • శ్రవణ స్వాగతం
              </span>
              <p className="text-xs font-bold text-[#221a0e] dark:text-[#FFF5EB] truncate">
                {isAudioPlaying ? 'Playing spoken greeting...' : 'Tap play to listen to audio'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Waveform animation */}
            <div className="flex items-end gap-0.5 h-4 px-1">
              {[8, 16, 12, 20, 10].map((h, i) => (
                <span
                  key={i}
                  style={{ height: isAudioPlaying ? `${Math.floor(Math.random() * 14 + 6)}px` : `${h}px` }}
                  className="w-1 bg-orange-500 rounded-full transition-all duration-200"
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleToggleVoiceAudio}
              className="w-9 h-9 rounded-xl bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center shrink-0 shadow-xs cursor-pointer transition active:scale-90"
              title="Play voice greeting"
            >
              {isAudioPlaying ? <IconPlayerPause size={17} /> : <IconPlayerPlay size={17} />}
            </button>
          </div>
        </div>

        {/* Trust Badges Grid */}
        <div className="flex flex-wrap justify-center gap-2 w-full pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-[#1e1b19] border border-amber-200/70 dark:border-[#3D332B] rounded-full shadow-2xs text-xs font-semibold text-stone-700 dark:text-[#D4C4B5]">
            <IconShieldLock size={14} className="text-orange-600 dark:text-[#ffb690]" />
            <span>100% Private</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-[#1e1b19] border border-amber-200/70 dark:border-[#3D332B] rounded-full shadow-2xs text-xs font-semibold text-stone-700 dark:text-[#D4C4B5]">
            <IconMessageCircle size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>Zero Bank Jargon</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-[#1e1b19] border border-amber-200/70 dark:border-[#3D332B] rounded-full shadow-2xs text-xs font-semibold text-stone-700 dark:text-[#D4C4B5]">
            <IconVolume size={14} className="text-amber-600 dark:text-amber-400" />
            <span>Voice Support</span>
          </div>
        </div>

        {/* Primary Tap Action Button */}
        <div className="w-full pt-2">
          <button
            type="button"
            id="continue-button"
            onClick={handleDismiss}
            className="w-full py-3.5 px-6 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-headline text-base font-bold shadow-lg shadow-orange-600/25 active:scale-98 transition flex items-center justify-center gap-2 group cursor-pointer"
          >
            {unlocked ? (
              <>
                <IconLockOpen size={20} className="animate-bounce" />
                <span>Welcome! Opening Ledger...</span>
              </>
            ) : (
              <>
                <span>Shuru Karein / ప్రారంభించండి</span>
                <IconArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>

        {/* Tap prompt */}
        <div className="w-full flex items-center justify-center pt-1 text-stone-500 dark:text-[#A8988A] text-xs font-semibold gap-1.5">
          <IconSparkles size={13} className="text-orange-600 dark:text-[#ffb690]" />
          <span>Tap to explore your savings & financial guidance</span>
        </div>

      </div>

      {/* Footer */}
      <footer className="w-full max-w-md mx-auto text-center z-10 pt-2 pb-1">
        <p className="text-[11px] font-medium text-stone-500 dark:text-[#A8988A]">
          Protected by SHG Rural Trust & RBI Security Standards
        </p>
        <p className="font-mono text-[10px] text-stone-400 dark:text-stone-600 mt-0.5">
          Sakhi v2.4 • Offline First Enabled
        </p>
      </footer>
    </div>
  );
}
