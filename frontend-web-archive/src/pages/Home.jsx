import React from 'react';
import {
  IconWallet,
  IconCompass,
  IconTarget,
  IconShieldCheck,
  IconBook,
  IconArrowUpRight,
  IconMicrophone,
  IconChevronRight,
  IconVolume,
} from '@tabler/icons-react';
import { useUser } from '../context/UserContext';
import { useSpeech } from '../hooks/useSpeech';
import ProgressBar from '../components/ProgressBar';

export default function Home({ onNavigate, onOpenAskSakhi }) {
  const { user, financialHealth, language, t } = useUser();
  const { isSpeaking, speakingId, speak, stop, isSupported: isTtsSupported } = useSpeech();

  const income = financialHealth?.monthly_income ?? user?.monthly_income ?? 0;
  const surplus = financialHealth?.surplus ?? ((user?.monthly_income || 0) - (user?.monthly_expenses || 0));
  const primaryGoal = financialHealth?.primary_goal;
  const journey = financialHealth?.journey;

  const homeSummaryId = 'home-summary-speech';
  const isHomeSpeaking = isSpeaking && speakingId === homeSummaryId;

  const handleHomeAudioSummary = (e) => {
    e?.stopPropagation();
    if (isHomeSpeaking) {
      stop();
    } else {
      const summaryText =
        language === 'te'
          ? `నమస్తే ${user?.name || 'లక్ష్మి'}, మీ నెలవారీ ఆదాయం ₹${Number(income).toLocaleString('en-IN')}, మరియు ఖర్చులు పోగా ₹${Number(surplus).toLocaleString('en-IN')} మిగిలిన డబ్బు ఉంది.`
          : language === 'hi'
          ? `नमस्ते ${user?.name || 'लक्ष्मी'}, आपकी मासिक आय ₹${Number(income).toLocaleString('en-IN')} है, और ₹${Number(surplus).toLocaleString('en-IN')} बचत के लिए उपलब्ध है।`
          : `Namaste ${user?.name || 'Lakshmi'}, your monthly income is ₹${Number(income).toLocaleString('en-IN')}, leaving ₹${Number(surplus).toLocaleString('en-IN')} available to save.`;
      speak(summaryText, homeSummaryId, language);
    }
  };

  const handleSurplusAudio = (e) => {
    e?.stopPropagation();
    const surplusText =
      language === 'te'
        ? `ఇంటి ఖర్చులు పోగా మీకు ₹${Number(surplus).toLocaleString('en-IN')} సురక్షితంగా మిగిలి ఉంది.`
        : language === 'hi'
        ? `घर के खर्चों के बाद आपके पास ₹${Number(surplus).toLocaleString('en-IN')} सुरक्षित बचे हैं।`
        : `You have ₹${Number(surplus).toLocaleString('en-IN')} safely left after your household expenses.`;
    speak(surplusText, 'home-surplus-audio', language);
  };

  return (
    <div className="space-y-3 pb-4">
      {/* 1. Clean Financial Summary Card */}
      <div className="relative overflow-hidden rounded-2xl bg-[#fff1e3] dark:bg-[#1e1b19] border border-amber-200/70 dark:border-[#3D332B] p-4 sm:p-5 shadow-xs space-y-3">
        {/* Header with Clean SHG Badge & Voice Summary Button */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-stone-700 dark:text-[#FFF5EB]">
              {user?.name || 'Lakshmi'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {user?.is_shg_member && (
              <span className="text-[10px] font-bold bg-amber-200/80 dark:bg-[#28211C] text-amber-900 dark:text-[#ffb690] px-2.5 py-0.5 rounded-full border border-amber-300/40 dark:border-[#3D332B]">
                SHG Member
              </span>
            )}
            {isTtsSupported && (
              <button
                type="button"
                onClick={handleHomeAudioSummary}
                title="Listen Summary"
                aria-label="Listen Summary"
                className={`p-1.5 rounded-full transition active:scale-95 cursor-pointer border shadow-2xs ${
                  isHomeSpeaking
                    ? 'bg-orange-600 text-white border-orange-600 animate-pulse'
                    : 'bg-white dark:bg-[#28211C] text-orange-800 dark:text-[#ffb690] border-amber-200/70 dark:border-[#3D332B] hover:bg-orange-50'
                }`}
              >
                <IconVolume size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Income Stat */}
        <div className="flex items-center justify-between py-0.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-orange-100 dark:bg-[#28211C] flex items-center justify-center text-orange-600 dark:text-[#ffb690]">
              <IconWallet size={16} />
            </div>
            <span className="text-xs font-bold text-stone-600 dark:text-[#D4C4B5]">
              {t('income_label') || 'Income'}
            </span>
          </div>
          <span className="font-headline text-lg sm:text-xl font-black text-[#221a0e] dark:text-[#FFF5EB]">
            ₹{Number(income).toLocaleString('en-IN')}
          </span>
        </div>

        {/* Surplus Highlight Container (Clean, Audio-Enabled, No Redundant Badges) */}
        <div
          onClick={handleSurplusAudio}
          className="rounded-xl bg-white dark:bg-[#14110F] p-3.5 shadow-xs border border-amber-100 dark:border-[#3D332B] flex items-center justify-between cursor-pointer active:scale-99 transition-transform"
        >
          <div>
            <span className="text-[11px] font-bold text-stone-500 dark:text-[#A8988A] block">
              {t('surplus_label') || 'Surplus'}
            </span>
            <span className="font-headline text-2xl sm:text-3xl font-black text-orange-600 dark:text-[#ffb690]">
              ₹{Number(surplus).toLocaleString('en-IN')}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('money');
            }}
            aria-label="View Breakdown"
            className="w-8 h-8 rounded-full bg-[#fff1e3] dark:bg-[#28211C] text-orange-600 dark:text-[#ffb690] flex items-center justify-center hover:bg-orange-100 dark:hover:bg-[#383431] transition active:scale-95 cursor-pointer border border-amber-200/50 dark:border-[#3D332B]"
          >
            <IconArrowUpRight size={17} />
          </button>
        </div>
      </div>

      {/* 2. Tactile "Talk to Sakhi" Banner (Clean, No Meta-Pills) */}
      <div
        onClick={onOpenAskSakhi}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 p-3.5 sm:p-4 text-white shadow-md active:scale-[0.99] transition-all cursor-pointer group border border-orange-400/40"
      >
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white text-orange-600 flex items-center justify-center shadow-md font-black text-xl shrink-0">
              స
            </div>
            <h2 className="font-headline text-base sm:text-lg font-black text-white leading-tight">
              {t('talk_to_sakhi') || 'Talk to Sakhi'}
            </h2>
          </div>

          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:bg-white group-hover:text-orange-600 transition-colors shadow-xs">
            <IconMicrophone size={18} />
          </div>
        </div>
      </div>

      {/* 3. 2x2 Feature Navigation Grid (Clean Localized Titles, No English Subtitles) */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Card 1: My Money */}
        <button
          onClick={() => onNavigate('money')}
          className="flex flex-col justify-between p-3.5 rounded-2xl bg-white dark:bg-[#1e1b19] border border-amber-100 dark:border-[#3D332B] shadow-xs hover:border-orange-300 dark:hover:border-stone-700 active:scale-95 transition-all text-left cursor-pointer min-h-[90px]"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-[#28211C] flex items-center justify-center text-orange-600 dark:text-[#ffb690]">
              <IconWallet size={18} />
            </div>
            <span className="text-[11px] font-bold bg-[#fff1e3] dark:bg-[#28211C] text-orange-700 dark:text-[#ffb690] px-2 py-0.5 rounded-full border border-amber-200/50 dark:border-[#3D332B]">
              ₹{Number(surplus).toLocaleString('en-IN')}
            </span>
          </div>
          <h3 className="font-headline font-bold text-xs sm:text-sm text-[#221a0e] dark:text-[#FFF5EB] mt-2">
            {t('nav_money') || 'My Money'}
          </h3>
        </button>

        {/* Card 2: My Journey */}
        <button
          onClick={() => onNavigate('journey')}
          className="flex flex-col justify-between p-3.5 rounded-2xl bg-white dark:bg-[#1e1b19] border border-amber-100 dark:border-[#3D332B] shadow-xs hover:border-orange-300 dark:hover:border-stone-700 active:scale-95 transition-all text-left cursor-pointer min-h-[90px]"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-[#28211C] flex items-center justify-center text-teal-700 dark:text-teal-400">
              <IconCompass size={18} />
            </div>
            <span className="text-[11px] font-bold bg-teal-50 dark:bg-[#28211C] text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-full border border-teal-200/50 dark:border-[#3D332B]">
              Stage {journey?.current_stage_id || 2}
            </span>
          </div>
          <h3 className="font-headline font-bold text-xs sm:text-sm text-[#221a0e] dark:text-[#FFF5EB] mt-2">
            {t('nav_journey') || 'My Journey'}
          </h3>
        </button>

        {/* Card 3: My Goals */}
        <button
          onClick={() => onNavigate('goals')}
          className="flex flex-col justify-between p-3.5 rounded-2xl bg-white dark:bg-[#1e1b19] border border-amber-100 dark:border-[#3D332B] shadow-xs hover:border-orange-300 dark:hover:border-stone-700 active:scale-95 transition-all text-left cursor-pointer min-h-[90px]"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-[#28211C] flex items-center justify-center text-orange-700 dark:text-[#ffb690]">
              <IconTarget size={18} />
            </div>
            {primaryGoal && (
              <span className="text-[11px] font-bold bg-[#fff1e3] dark:bg-[#28211C] text-orange-900 dark:text-[#ffb690] px-2 py-0.5 rounded-full border border-orange-200/50 dark:border-[#3D332B]">
                {primaryGoal.percent_complete}%
              </span>
            )}
          </div>
          <h3 className="font-headline font-bold text-xs sm:text-sm text-[#221a0e] dark:text-[#FFF5EB] mt-2">
            {t('nav_goals') || 'My Goals'}
          </h3>
        </button>

        {/* Card 4: Benefits */}
        <button
          onClick={() => onNavigate('benefits')}
          className="flex flex-col justify-between p-3.5 rounded-2xl bg-white dark:bg-[#1e1b19] border border-amber-100 dark:border-[#3D332B] shadow-xs hover:border-orange-300 dark:hover:border-stone-700 active:scale-95 transition-all text-left cursor-pointer min-h-[90px]"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-[#28211C] flex items-center justify-center text-amber-700 dark:text-[#ffb690]">
              <IconShieldCheck size={18} />
            </div>
            <span className="text-[11px] font-bold bg-amber-50 dark:bg-[#28211C] text-amber-800 dark:text-[#ffb690] px-2 py-0.5 rounded-full border border-amber-200/50 dark:border-[#3D332B]">
              15 Schemes
            </span>
          </div>
          <h3 className="font-headline font-bold text-xs sm:text-sm text-[#221a0e] dark:text-[#FFF5EB] mt-2">
            {t('nav_benefits') || 'Benefits'}
          </h3>
        </button>
      </div>

      {/* 4. Active Dream Clean Progress Card (No Redundant Meta-Labels) */}
      {primaryGoal && (
        <div className="rounded-2xl bg-white dark:bg-[#1e1b19] border border-amber-100 dark:border-[#3D332B] p-3.5 sm:p-4 shadow-xs space-y-2">
          <div className="flex justify-between items-baseline">
            <h3 className="font-headline text-xs sm:text-sm font-bold text-[#221a0e] dark:text-[#FFF5EB]">
              {primaryGoal.name}
            </h3>
            <span className="font-mono text-xs font-bold text-orange-600 dark:text-[#ffb690]">
              {primaryGoal.percent_complete}%
            </span>
          </div>
          <ProgressBar value={primaryGoal.current_amount} max={primaryGoal.target_amount} />
          <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-[#A8988A] font-medium font-mono">
            <span>₹{Number(primaryGoal.current_amount).toLocaleString('en-IN')}</span>
            <span>₹{Number(primaryGoal.target_amount).toLocaleString('en-IN')}</span>
          </div>
        </div>
      )}

      {/* 5. Clean Single-Row Financial Guides Banner */}
      <button
        type="button"
        onClick={() => onNavigate('learn')}
        className="w-full rounded-2xl bg-[#fff1e3]/70 dark:bg-[#1e1b19] border border-amber-200/70 dark:border-[#3D332B] p-3 shadow-xs flex items-center justify-between gap-3 active:scale-95 transition-transform text-left cursor-pointer min-h-[48px]"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-[#28211C] flex items-center justify-center text-orange-600 dark:text-[#ffb690] shrink-0">
            <IconBook size={18} />
          </div>
          <span className="font-headline font-bold text-xs sm:text-sm text-[#221a0e] dark:text-[#FFF5EB] truncate">
            {t('financial_guides') || 'Financial Guides'}
          </span>
        </div>
        <IconChevronRight size={18} className="text-stone-400 shrink-0" />
      </button>
    </div>
  );
}
