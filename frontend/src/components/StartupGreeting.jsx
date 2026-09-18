import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

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

    // Auto fade after 1.6 seconds
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        setVisible(false);
        sessionStorage.setItem('sakhi_startup_greeted', 'true');
        if (onComplete) onComplete();
      }, 500); // 500ms fade transition
    }, 1600);

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
      className={`fixed inset-0 z-50 bg-linear-to-br from-emerald-800 via-emerald-900 to-teal-950 flex items-center justify-center p-6 text-white cursor-pointer transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="text-center space-y-4 max-w-xs animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-3xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto text-3xl font-black text-amber-300 shadow-xl">
          स
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-1 border border-amber-400/30">
            <Sparkles size={13} />
            <span>Sakhi Financial Companion</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Namaste, {name} 👋
          </h1>
          <p className="text-xs text-emerald-200/90 font-medium">
            Your personal financial companion is ready
          </p>
        </div>

        <p className="text-[11px] text-emerald-300/60 pt-4">
          Tap anywhere to continue
        </p>
      </div>
    </div>
  );
}
