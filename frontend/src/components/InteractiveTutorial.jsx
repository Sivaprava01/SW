import React, { useState } from 'react';
import {
  IconSparkles,
  IconArrowRight,
  IconArrowLeft,
  IconCircleCheck,
  IconX,
  IconWallet,
  IconCompass,
  IconTarget,
  IconShieldCheck,
  IconStar,
  IconRobot,
} from '@tabler/icons-react';
import confetti from 'canvas-confetti';
import { useUser } from '../context/UserContext';

const TUTORIAL_STEPS = [
  {
    id: 1,
    title: "Namaste, Sister! Welcome to Sakhi",
    subtitle: "Your personal, trustworthy financial companion",
    icon: IconStar,
    iconColor: "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300",
    badge: "Step 1 • Welcome",
    description: "Sakhi is designed especially for you. We help you understand your money in simple words without bank jargon or complicated calculations.",
    tip: "💡 Everything is calculated automatically and kept 100% private."
  },
  {
    id: 2,
    title: "1. Know Your Monthly Money Left (Surplus)",
    subtitle: "Income minus household expenses",
    icon: IconWallet,
    iconColor: "bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300",
    badge: "Step 2 • My Money",
    description: "Whenever you earn or spend money, log it in 'My Money'. Sakhi immediately tells you how much surplus remains to save and protect your family.",
    tip: "💡 Even ₹500 saved on market day builds your safety shield over time."
  },
  {
    id: 3,
    title: "2. Your 7-Stage Financial Roadmap",
    subtitle: "From emergency safety to financial freedom",
    icon: IconCompass,
    iconColor: "bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300",
    badge: "Step 3 • Journey",
    description: "Check 'Journey' to see your active milestone. You'll move from building a 3-month Emergency Fund to clearing high-interest debt and growing your dreams.",
    tip: "💡 Tap 🔊 Listen on any milestone to hear Sakhi explain it."
  },
  {
    id: 4,
    title: "3. Verified Government Schemes",
    subtitle: "Central & State support for women and SHGs",
    icon: IconShieldCheck,
    iconColor: "bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300",
    badge: "Step 4 • Schemes",
    description: "Answer 5 quick questions in 'Benefits' to find government grants, MUDRA loans, Lakhpati Didi support, and insurance for your family.",
    tip: "💡 Includes direct links to official government portals."
  },
  {
    id: 5,
    title: "4. Ask Sakhi Anytime",
    subtitle: "Voice and text in your own language",
    icon: IconSparkles,
    iconColor: "bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300",
    badge: "Step 5 • AI Companion",
    description: "Confused about a loan or saving for your daughter's future? Tap 'Ask Sakhi' anytime to talk in English, Hindi, or Telugu!",
    tip: "🎉 You are now ready to take control of your financial freedom!"
  }
];

export default function InteractiveTutorial({ isOpen, onClose }) {
  const { completeTutorial } = useUser();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = TUTORIAL_STEPS[currentStep];
  const isLast = currentStep === TUTORIAL_STEPS.length - 1;
  const Icon = step.icon;

  const handleNext = () => {
    if (!isLast) {
      setCurrentStep(currentStep + 1);
    } else {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      if (completeTutorial) completeTutorial();
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-title"
      className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-amber-100 dark:border-slate-800 flex flex-col animate-in zoom-in-95">
        
        {/* Top Header & Progress */}
        <div className="p-4 border-b border-amber-100 dark:border-slate-800 flex items-center justify-between bg-[#fffaf5] dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-orange-900 dark:text-orange-300 bg-[#fff1e3] dark:bg-orange-950/80 px-2.5 py-0.5 rounded-full border border-orange-200/60 dark:border-orange-800/40">
              {step.badge}
            </span>
          </div>
          <button
            onClick={() => {
              if (completeTutorial) completeTutorial();
              onClose();
            }}
            aria-label="Skip tutorial"
            className="text-xs font-bold text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 cursor-pointer"
          >
            Skip Tour
          </button>
        </div>

        {/* Progress Dots */}
        <div className="w-full bg-stone-100 dark:bg-slate-800 h-1.5">
          <div
            className="bg-orange-500 dark:bg-orange-400 h-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / TUTORIAL_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Content Body */}
        <div className="p-6 text-center space-y-4 flex-1 flex flex-col justify-center bg-[#fffaf5]/40 dark:bg-slate-900">
          <div className={`w-16 h-16 rounded-3xl ${step.iconColor} flex items-center justify-center mx-auto shadow-md scale-105 transition-transform animate-in zoom-in`}>
            <Icon size={32} />
          </div>

          <div className="space-y-1.5">
            <h3 id="tutorial-title" className="text-lg font-black text-stone-900 dark:text-stone-100 tracking-tight leading-snug">
              {step.title}
            </h3>
            <p className="text-xs font-bold text-orange-700 dark:text-orange-400">
              {step.subtitle}
            </p>
          </div>

          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed text-left bg-white dark:bg-slate-800/70 p-3.5 rounded-2xl border border-amber-100 dark:border-slate-800">
            {step.description}
          </p>

          <div className="text-xs text-amber-950 dark:text-amber-300 bg-[#fff1e3] dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/50 text-left font-medium">
            {step.tip}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="p-4 border-t border-amber-100 dark:border-slate-800 bg-[#fffaf5] dark:bg-slate-800/60 flex items-center justify-between gap-2">
          {currentStep > 0 ? (
            <button
              onClick={handleBack}
              className="px-3.5 py-2.5 bg-stone-200 hover:bg-stone-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-stone-700 dark:text-stone-200 font-bold rounded-xl text-xs transition cursor-pointer min-h-[44px] flex items-center gap-1 active:scale-95"
            >
              <IconArrowLeft size={15} />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-xl text-xs transition shadow-sm cursor-pointer min-h-[44px] flex items-center justify-center gap-1.5 active:scale-95"
          >
            <span>{isLast ? "Let's Get Started! 🎉" : "Next Step"}</span>
            <IconArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
