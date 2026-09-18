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
  IconVolume,
  IconPlayerPlay,
  IconPlayerPause,
  IconCheck,
} from '@tabler/icons-react';
import confetti from 'canvas-confetti';
import { useUser } from '../context/UserContext';
import { useSpeech } from '../hooks/useSpeech';

const TUTORIAL_STEPS = [
  {
    step: 1,
    name: 'Welcome',
    pillName: 'Welcome',
    title: 'Namaste, Sister!\nWelcome to Sakhi',
    subtitle: 'Your personal, trustworthy financial companion',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsj0tYnm-j_ZRjSDbkb3GOHua881avYaJwg1xGC-Ljmr4VSMMkB8ANibRnu-tPq2MonM7-TN2qzMygxVBpl8rQVZWdOREPqdJwKnEeVgu6kulGkeidg7NxZFgPZmGc0Z4aIFv7bb8KdqMYRuRolN1laq5RTKCUu2y-U_RYA9BOhc93k1k18cOoka8srdtAInkEPBe6HL6AgSKNtC6gEkM_OMHddToLp9dzlM3yjcWAxd1E9hf4bHbjEg',
    body: 'Sakhi is like an elder sister who sits with you, counts every rupee from your crop, dairy, or handloom work, and protects your household dreams. Absolutely zero confusing English bank jargon.',
    tip: '100% Private: Everything is calculated automatically and saved securely on your phone. No secret fees.',
    duration: '18 sec',
    icon: IconStar,
    iconColor: 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300',
  },
  {
    step: 2,
    name: 'My Money',
    pillName: 'Money',
    title: 'Track Cash &\nSHG Group Dues',
    subtitle: 'One-tap ledger for income, sales & micro-loans',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHr9e9Y78m-00z9bXbO1g9Zq4Z7JgG3i7Nq_Z78m2-00z9bXbO1g9Zq4Z7JgG3i7Nq',
    body: 'Record daily earnings from milk sales, stitching, or local market stalls. Never lose track of monthly Self-Help Group (SHG) repayments or neighbor loans.',
    tip: 'Zero Math Stress: Simply speak your expense or type numbers. Sakhi balances the passbook.',
    duration: '22 sec',
    icon: IconWallet,
    iconColor: 'bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300',
  },
  {
    step: 3,
    name: 'Journey',
    pillName: 'Journey',
    title: 'Save For Dreams,\nBig & Small',
    subtitle: "Gold coins, daughter's schooling, or shop tools",
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcVmgv_uYzxirRMwxZusOIPQFf74usILkdpiFR_ZxaKV2N20IiDOzpFD_YL9Jgca5NKvOv6XoesasiUTZcdg-khHqRAdZeSev9bnq4pSkY4cp88m5E4IddEQn2CHExoHfH_U4Fm61H4X8YhbZAY1IDbKzcFlFQgMc8kGpxsq6e3bfEOiVXmrnFHMW9mRyW365euKST6JhaXvw0CQoCqaBcletY_1EGHbx7e_N4A6lvN8m2tnZFi6uS0w',
    body: 'Set targets like saving ₹20 a day into your piggy bank or gold locker. Watch your savings jar fill up like grains of rice with every milestone.',
    tip: 'Visual Reminders: Receive gentle reminders in your mother tongue so your family goals stay protected.',
    duration: '20 sec',
    icon: IconCompass,
    iconColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300',
  },
  {
    step: 4,
    name: 'Schemes',
    pillName: 'Schemes',
    title: 'Government Benefits\nMade For You',
    subtitle: 'Lakhpati Didi, PM Awas, Mudra, & Sukanya',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtNPHnO1y3OMpfYT7c93IGzr-6a-9fHGOsyLYXB7n_Eq8sJN-CqxfMXwDiPuFrsaJ0P5S4jvMDv9ndfoBqGVRy5SyUOzxbJSHlEv9cemRI64AaICfR0CanrkApwFPRynkzJMJtitGjktviGSfWim8r3H_dW6NKfkGqiVThXGspL6P8O2sIiKaTbqpWUgjWKcHAtNfEJjjm0jaVvnXWHd9np9LZm3S9XjMjhYqSndfq6nrSHKkF2IjGpA',
    body: 'Know which direct bank benefit transfers (DBT) and subsidy schemes you qualify for without having to pay any middleman or tout at the taluk office.',
    tip: 'Direct Benefits: Sakhi checks eligibility instantly with basic ration card or SHG details.',
    duration: '25 sec',
    icon: IconShieldCheck,
    iconColor: 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300',
  },
  {
    step: 5,
    name: 'Companion',
    pillName: 'Companion',
    title: 'Speak Naturally,\nAnytime You Need',
    subtitle: 'Your 24/7 audio assistant in your dialect',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDQe0yHWlOXmQq75tOb-RKKq-RpsFHeNaiAx7R6oV_lHcUWZk_Bp-zceyzkmI3D26dX-kTcEr0fbYQbw6GAvvMASGXWzkrN9mLjmH_dpuVsftRwa9OHQREyBhtBURKjYmMhz6pMt4kHhlcqStizd7p7T9mzwdsjgKDN7oyykUWlvMCUKIyZO6ZbpcP-eLRxAOip586OhxBpD6bXbS3JVAWi8Z4IAGFHVKR-7XEed4i7drIjoSgpStcuA',
    body: "Ask Sakhi questions just like speaking with your village counselor: 'How much did I save this month?' or 'When is my next SHG installment due?'",
    tip: 'Voice Ready: Tap the mic button anywhere in the app to speak instead of reading or typing.',
    duration: '19 sec',
    icon: IconSparkles,
    iconColor: 'bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300',
  },
];

export default function InteractiveTutorial({ isOpen, onClose }) {
  const { completeTutorial } = useUser();
  const { isSpeaking, speakingId, speak, stop, isSupported: isTtsSupported } = useSpeech();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = TUTORIAL_STEPS[currentStep];
  const isLast = currentStep === TUTORIAL_STEPS.length - 1;
  const progressPercent = ((currentStep + 1) / TUTORIAL_STEPS.length) * 100;
  const Icon = step.icon;

  const stepSpeechId = `tour-step-${step.step}`;
  const isStepSpeaking = isSpeaking && speakingId === stepSpeechId;
  const stepSpeechText = `${step.title.replace('\n', ' ')}. ${step.subtitle}. ${step.body}. Tip: ${step.tip}`;

  const handleNext = () => {
    if (isSpeaking) stop();
    if (!isLast) {
      setCurrentStep(currentStep + 1);
    } else {
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.6 }
      });
      if (completeTutorial) completeTutorial();
      onClose();
    }
  };

  const handleBack = () => {
    if (isSpeaking) stop();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (isSpeaking) stop();
    if (completeTutorial) completeTutorial();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-title"
      className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in"
    >
      <div className="bg-[#fff8f3] dark:bg-[#14110F] text-[#221a0e] dark:text-[#FFF5EB] rounded-3xl w-full max-w-sm sm:max-w-md max-h-[94vh] flex flex-col overflow-hidden shadow-2xl border border-amber-200/70 dark:border-[#3D332B] animate-in zoom-in-95">
        
        {/* Top Meta Bar: Step Pill + Skip Action */}
        <div className="px-4 py-3 border-b border-amber-200/60 dark:border-[#28211C] flex items-center justify-between bg-[#fffaf5] dark:bg-[#1e1b19] shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff1e3] dark:bg-[#28211C] text-orange-950 dark:text-[#ffb690] border border-orange-200/60 dark:border-[#3D332B] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-wide">
              Step {step.step} • {step.name}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSkip}
            aria-label="Skip tour"
            className="text-xs font-bold text-stone-400 hover:text-stone-600 dark:hover:text-[#FFF5EB] p-1 cursor-pointer transition"
          >
            Skip Tour
          </button>
        </div>

        {/* Progress Bar Fill */}
        <div className="w-full bg-stone-100 dark:bg-[#28211C] h-1.5 shrink-0">
          <div
            className="bg-orange-600 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Main Step Card Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#fffaf5]/40 dark:bg-[#14110F] text-xs sm:text-sm">
          
          {/* Hero Visual Container */}
          <div className="w-full rounded-2xl bg-gradient-to-b from-[#fff1e3] to-white dark:from-[#1e1b19] dark:to-[#14110F] p-3.5 flex flex-col items-center justify-center relative overflow-hidden border border-orange-200/50 dark:border-[#3D332B] shadow-2xs">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-[#28211C] flex items-center justify-center text-orange-700 dark:text-[#ffb690] shadow-xs mb-2">
              <Icon size={28} />
            </div>

            {/* Authentic Photograph */}
            <div className="w-full h-32 rounded-xl overflow-hidden relative shadow-xs border border-amber-100/80 dark:border-[#3D332B]">
              <img
                className="w-full h-full object-cover"
                alt="Sakhi guided step visual"
                src={step.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 dark:bg-[#1e1b19]/90 text-orange-700 dark:text-[#ffb690] font-black text-[10px] shadow-sm">
                  <IconShieldCheck size={12} />
                  Sakhi Trust Seal
                </span>
              </div>
            </div>
          </div>

          {/* Title & Editorial Subtitle */}
          <div className="space-y-0.5">
            <h2 id="tutorial-title" className="text-base sm:text-lg font-black text-[#221a0e] dark:text-[#FFF5EB] tracking-tight leading-snug whitespace-pre-line">
              {step.title}
            </h2>
            <p className="text-xs font-bold text-orange-700 dark:text-[#ffb690]">
              {step.subtitle}
            </p>
          </div>

          {/* Friendly Plain Language Body Copy */}
          <p className="text-xs text-stone-600 dark:text-[#D4C4B5] leading-relaxed bg-white dark:bg-[#1e1b19] p-3 rounded-xl border border-amber-100 dark:border-[#3D332B]">
            {step.body}
          </p>

          {/* Audio Preview Pill with Live TTS Voice */}
          <div className="w-full rounded-xl bg-white dark:bg-[#1e1b19] p-2.5 border border-amber-100 dark:border-[#3D332B] flex items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              {isTtsSupported && (
                <button
                  type="button"
                  onClick={() => {
                    if (isStepSpeaking) {
                      stop();
                    } else {
                      speak(stepSpeechText, stepSpeechId);
                    }
                  }}
                  aria-label={isStepSpeaking ? "Stop Voice" : "Listen to voice guide"}
                  className={`w-9 h-9 rounded-full flex items-center justify-center shadow-xs cursor-pointer active:scale-90 transition shrink-0 ${
                    isStepSpeaking
                      ? 'bg-amber-100 dark:bg-[#28211C] text-amber-900 dark:text-[#ffb690] border border-amber-300 dark:border-[#3D332B] animate-bounce'
                      : 'bg-orange-600 hover:bg-orange-700 text-white'
                  }`}
                >
                  {isStepSpeaking ? <IconPlayerPause size={18} /> : <IconVolume size={18} />}
                </button>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-[#221a0e] dark:text-[#FFF5EB] truncate">
                  {isStepSpeaking ? 'Speaking Guide...' : 'Listen to Sakhi (🔊)'}
                </span>
                <span className="text-[10px] text-stone-500 dark:text-[#A8988A] truncate">
                  Telugu • Hindi • Odia • Marathi
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-orange-50 dark:bg-[#28211C] text-orange-800 dark:text-[#ffb690] text-[10px] font-bold border border-orange-200/50 dark:border-[#3D332B] shrink-0">
              {step.duration}
            </span>
          </div>

          {/* Reassurance Tip Box */}
          <div className="w-full rounded-xl bg-[#fff1e3]/60 dark:bg-[#1e1b19] p-3 border border-orange-200/60 dark:border-[#3D332B] flex items-start gap-2 text-[#221a0e] dark:text-[#FFF5EB]">
            <span className="text-base select-none shrink-0 mt-0.5">💡</span>
            <p className="text-[11px] text-stone-700 dark:text-[#D4C4B5] leading-snug">
              {step.tip}
            </p>
          </div>

          {/* Interactive Steps Breadcrumb / 5-Step Path */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 dark:text-[#A8988A] px-1">
              <span>Your 5-Step Path</span>
              <span className="text-orange-600 dark:text-[#ffb690]">{step.step} of 5</span>
            </div>

            <div className="grid grid-cols-5 gap-1.5 w-full">
              {TUTORIAL_STEPS.map((s, idx) => {
                const isActive = idx === currentStep;
                const isPast = idx < currentStep;
                return (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => {
                      if (isSpeaking) stop();
                      setCurrentStep(idx);
                    }}
                    className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition cursor-pointer min-h-[44px] justify-center border ${
                      isActive
                        ? 'bg-orange-600 text-white border-orange-600 shadow-xs scale-105'
                        : isPast
                        ? 'bg-[#fff1e3] dark:bg-[#1e1b19] text-orange-950 dark:text-[#ffb690] border-orange-200/50 dark:border-[#3D332B]'
                        : 'bg-white dark:bg-[#100e0c] text-stone-400 dark:text-[#A8988A] border-stone-200/60 dark:border-[#3D332B]'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-tight">
                      {s.pillName}
                    </span>
                    {isPast && <IconCheck size={10} strokeWidth={3} className="text-emerald-600 dark:text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Bottom Navigation Controls */}
        <div className="p-3.5 border-t border-amber-200/60 dark:border-[#28211C] bg-[#fffaf5] dark:bg-[#1e1b19] flex items-center justify-between gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1 min-h-[44px] cursor-pointer ${
              currentStep === 0
                ? 'opacity-40 bg-stone-100 dark:bg-[#28211C] text-stone-400 cursor-not-allowed'
                : 'bg-stone-200 hover:bg-stone-300 dark:bg-[#28211C] dark:hover:bg-[#383431] text-stone-800 dark:text-[#FFF5EB] active:scale-95'
            }`}
          >
            <IconArrowLeft size={16} />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-xl text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer min-h-[44px] active:scale-95"
          >
            <span>{isLast ? "Start Using Sakhi 🎉" : "Next Step"}</span>
            <IconArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
