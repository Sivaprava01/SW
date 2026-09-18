import React, { useState, useEffect } from 'react';
import { IconSparkles, IconArrowRight } from '@tabler/icons-react';
import { useUser } from '../context/UserContext';

export default function StartupGreeting({ name = 'Sister', onComplete }) {
  const { language } = useUser();
  const [fading, setFading] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Check if already greeted in this browser session
    const greeted = sessionStorage.getItem('sakhi_startup_greeted');
    if (greeted) {
      setVisible(false);
      if (onComplete) onComplete();
      return;
    }

    // Auto fade after 2.6 seconds
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        setVisible(false);
        sessionStorage.setItem('sakhi_startup_greeted', 'true');
        if (onComplete) onComplete();
      }, 400);
    }, 2600);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  const handleDismiss = () => {
    setFading(true);
    setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('sakhi_startup_greeted', 'true');
      if (onComplete) onComplete();
    }, 250);
  };

  const greetingTitle = language === 'te' 
    ? `నమస్తే, ${name} 👋`
    : language === 'hi'
    ? `नमस्ते, ${name} 👋`
    : `Namaste, ${name} 👋`;

  const greetingSubtitle = language === 'te'
    ? 'మీ వ్యక్తిగత ఆర్థిక సహచరి సిద్ధంగా ఉంది'
    : language === 'hi'
    ? 'आपकी व्यक्तिगत सखी वित्तीय साथी तैयार है'
    : 'Your personal AI financial companion is ready';

  return (
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-50 bg-[#fff8f3]/95 dark:bg-[#14110F]/95 backdrop-blur-lg flex items-center justify-center p-6 text-[#221a0e] dark:text-[#FFF5EB] cursor-pointer transition-opacity duration-400 select-none ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="text-center flex flex-col items-center space-y-5 max-w-sm animate-in zoom-in-95 duration-300">
        
        {/* Stitch Glowing Dual Radial Concentric Rings & Cultural Mascot */}
        <div className="relative flex items-center justify-center my-4">
          <span className="absolute w-36 h-36 rounded-full bg-orange-500/25 dark:bg-orange-500/15 animate-ping pointer-events-none"></span>
          <span className="absolute w-44 h-44 rounded-full bg-orange-500/15 dark:bg-orange-500/10 animate-pulse pointer-events-none"></span>
          
          <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 via-amber-500 to-rose-600 flex items-center justify-center shadow-2xl border-4 border-white/60 dark:border-stone-800">
            <span className="font-headline text-4xl font-black text-white select-none">
              स
            </span>
          </div>

          <span className="absolute bottom-1 right-2 w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-[#fff8f3] dark:ring-[#14110F] flex items-center justify-center z-20">
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
          </span>
        </div>

        {/* Title & Pill Badges */}
        <div className="space-y-2 flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#fcebd7] dark:bg-[#28211C] text-orange-800 dark:text-[#ffb690] text-xs font-bold border border-amber-200/70 dark:border-[#3D332B] shadow-xs">
            <IconSparkles size={14} className="text-orange-600 dark:text-[#ffb690]" />
            <span>Sakhi (సఖీ) • Financial Companion</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#221a0e] dark:text-[#FFF5EB] font-headline">
            {greetingTitle}
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-[#D4C4B5] font-medium max-w-xs leading-relaxed">
            {greetingSubtitle}
          </p>
        </div>

        {/* Continue prompt */}
        <div className="pt-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white dark:bg-[#1e1b19] border border-amber-200/60 dark:border-[#3D332B] shadow-xs text-xs font-bold text-stone-500 dark:text-[#A8988A] hover:text-orange-600 transition">
            <span>Tap anywhere to continue</span>
            <IconArrowRight size={13} />
          </div>
        </div>

      </div>
    </div>
  );
}
