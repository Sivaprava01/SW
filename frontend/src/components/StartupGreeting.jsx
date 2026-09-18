import React, { useState, useEffect } from 'react';
import { IconSparkles } from '@tabler/icons-react';

export default function StartupGreeting({ name = 'Sister', onComplete }) {
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

    // Auto fade after 1.8 seconds
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        setVisible(false);
        sessionStorage.setItem('sakhi_startup_greeted', 'true');
        if (onComplete) onComplete();
      }, 500);
    }, 1800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  const handleDismiss = () => {
    setFading(true);
    setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('sakhi_startup_greeted', 'true');
      if (onComplete) onComplete();
    }, 300);
  };

  return (
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-50 bg-gradient-to-br from-stone-900 via-orange-950 to-emerald-950 flex items-center justify-center p-6 text-white cursor-pointer transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="text-center space-y-4 max-w-xs animate-in zoom-in-95 duration-300">
        {/* Central Mascot Badge */}
        <div className="w-18 h-18 rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-400 p-0.5 shadow-2xl shadow-orange-500/30 mx-auto">
          <div className="w-full h-full rounded-[22px] bg-stone-950/40 backdrop-blur-md flex items-center justify-center text-3xl font-black text-amber-200">
            स
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold mb-1 border border-orange-400/30 shadow-xs">
            <IconSparkles size={14} className="text-amber-400" />
            <span>Sakhi Financial Companion</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Namaste, {name} 👋
          </h1>
          <p className="text-xs text-orange-200/90 font-medium">
            Your personal financial companion is ready
          </p>
        </div>

        <p className="text-[11px] text-stone-400 pt-4 tracking-wider uppercase">
          Tap anywhere to continue
        </p>
      </div>
    </div>
  );
}
