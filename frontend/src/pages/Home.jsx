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
  IconCheck,
  IconSparkles,
} from '@tabler/icons-react';
import { useUser } from '../context/UserContext';
import ProgressBar from '../components/ProgressBar';

export default function Home({ onNavigate, onOpenAskSakhi }) {
  const { user, financialHealth, t } = useUser();

  const income = financialHealth?.monthly_income ?? user?.monthly_income ?? 0;
  const surplus = financialHealth?.surplus ?? ((user?.monthly_income || 0) - (user?.monthly_expenses || 0));
  const primaryGoal = financialHealth?.primary_goal;
  const journey = financialHealth?.journey;

  return (
    <div className="space-y-3.5 pb-6">
      {/* Financial Health Summary Hero Banner (Stitch Design) */}
      <div className="relative overflow-hidden rounded-2xl bg-[#fff1e3] dark:bg-slate-900 border border-amber-200/70 dark:border-slate-800 p-4 sm:p-5 shadow-sm">
        <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-orange-500/10 dark:bg-emerald-500/10 pointer-events-none blur-xl" />
        
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-[11px] uppercase tracking-wider font-bold text-stone-600 dark:text-stone-300">
              {t('monthly_snapshot') || 'Monthly Snapshot • Active Cycle'}
            </span>
          </div>
          {user?.is_shg_member && (
            <span className="text-[11px] font-bold bg-amber-200/80 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-300/40">
              SHG Member
            </span>
          )}
        </div>

        {/* Income Stat */}
        <div className="flex items-center justify-between py-1 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-slate-800 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <IconWallet size={18} />
            </div>
            <span className="text-xs sm:text-sm font-bold text-stone-600 dark:text-stone-300">
              {t('your_monthly_income') || 'Your Monthly Income'}
            </span>
          </div>
          <span className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100">
            ₹{Number(income).toLocaleString('en-IN')}
          </span>
        </div>

        {/* Surplus Highlight Container */}
        <div className="rounded-xl bg-white dark:bg-slate-800/90 p-3.5 shadow-xs border border-amber-100 dark:border-slate-700/60 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
              {t('calculated_surplus') || 'Calculated Monthly Surplus'}
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center gap-1 border border-emerald-300/40">
              <IconCheck size={12} className="stroke-[3]" /> {t('safe_to_save') || 'Safe to Save'}
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-orange-600 dark:text-orange-400">
                ₹{Number(surplus).toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                ready to allocate
              </span>
            </div>
            <button
              onClick={() => onNavigate('money')}
              className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 inline-flex items-center gap-0.5 active:scale-95 transition-transform cursor-pointer"
            >
              <span>Breakdown</span>
              <IconArrowUpRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Primary Hero Action: Talk to Sakhi (Stitch Gradient Card) */}
      <div
        onClick={onOpenAskSakhi}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 p-4 text-white shadow-md active:scale-[0.99] transition-all cursor-pointer group border border-orange-400/40"
      >
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/10 pointer-events-none blur-sm" />
        <div className="flex items-center gap-3.5 relative z-10">
          {/* Companion Avatar */}
          <div className="relative shrink-0">
            <div className="w-13 h-13 rounded-2xl bg-white text-orange-600 flex items-center justify-center shadow-md font-black text-xl">
              स
            </div>
            <span className="absolute -bottom-1 -right-1 bg-amber-400 text-stone-950 text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-xs">
              AI
            </span>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] bg-white/25 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                Voice & Text
              </span>
              <span className="w-1 h-1 rounded-full bg-white/80" />
              <span className="text-[11px] text-orange-100 font-semibold">
                Telugu, Hindi & English
              </span>
            </div>
            <h2 className="text-base font-black text-white leading-tight">
              Talk to Sakhi
            </h2>
            <p className="text-xs text-orange-100/90 truncate font-medium">
              Ask about your ₹{Number(surplus).toLocaleString('en-IN')} surplus, debt or schemes
            </p>
          </div>

          {/* Action Button Indicator */}
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:bg-white group-hover:text-orange-600 transition-colors shadow-xs">
            <IconMicrophone size={20} />
          </div>
        </div>
      </div>

      {/* 2x2 Feature Navigation Grid (Stitch 2x2 Layout) */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {/* Card 1: My Money */}
        <button
          onClick={() => onNavigate('money')}
          className="flex flex-col justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 shadow-xs hover:border-orange-300 dark:hover:border-slate-700 active:scale-95 transition-all text-left cursor-pointer min-h-[110px]"
        >
          <div className="flex items-center justify-between w-full mb-2">
            <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-slate-800 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <IconWallet size={20} />
            </div>
            <span className="text-[11px] font-bold bg-[#fff1e3] dark:bg-slate-800 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full">
              ₹{Number(surplus).toLocaleString('en-IN')}
            </span>
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
              {t('nav_money') || 'My Money'}
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1">
              Income, expenses & logs
            </p>
          </div>
        </button>

        {/* Card 2: My Journey */}
        <button
          onClick={() => onNavigate('journey')}
          className="flex flex-col justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 shadow-xs hover:border-orange-300 dark:hover:border-slate-700 active:scale-95 transition-all text-left cursor-pointer min-h-[110px]"
        >
          <div className="flex items-center justify-between w-full mb-2">
            <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-slate-800 flex items-center justify-center text-teal-700 dark:text-teal-400">
              <IconCompass size={20} />
            </div>
            <span className="text-[11px] font-bold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-full">
              Stage {journey?.current_stage_id || 2}
            </span>
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
              {t('nav_journey') || 'My Journey'}
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1">
              {journey?.current_stage_name || 'Emergency Shield'}
            </p>
          </div>
        </button>

        {/* Card 3: My Goals */}
        <button
          onClick={() => onNavigate('goals')}
          className="flex flex-col justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 shadow-xs hover:border-orange-300 dark:hover:border-slate-700 active:scale-95 transition-all text-left cursor-pointer min-h-[110px]"
        >
          <div className="flex items-center justify-between w-full mb-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-slate-800 flex items-center justify-center text-blue-700 dark:text-blue-400">
              <IconTarget size={20} />
            </div>
            {primaryGoal && (
              <span className="text-[11px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                {primaryGoal.percent_complete}%
              </span>
            )}
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
              {t('nav_goals') || 'My Goals'}
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1">
              {primaryGoal?.name || "Save for future"}
            </p>
          </div>
        </button>

        {/* Card 4: Benefits */}
        <button
          onClick={() => onNavigate('benefits')}
          className="flex flex-col justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 shadow-xs hover:border-orange-300 dark:hover:border-slate-700 active:scale-95 transition-all text-left cursor-pointer min-h-[110px]"
        >
          <div className="flex items-center justify-between w-full mb-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-slate-800 flex items-center justify-center text-amber-700 dark:text-amber-400">
              <IconShieldCheck size={20} />
            </div>
            <span className="text-[11px] font-bold bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full">
              15 Schemes
            </span>
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
              {t('nav_benefits') || 'Benefits'}
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1">
              Govt schemes & grants
            </p>
          </div>
        </button>
      </div>

      {/* Active Dream Progress Preview Card */}
      {primaryGoal && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 p-4 shadow-xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <IconSparkles size={16} className="text-orange-500" />
              <span className="text-[11px] uppercase font-bold text-orange-600 dark:text-orange-400 tracking-wider">
                Active Dream
              </span>
            </div>
            <span className="text-[11px] font-bold text-stone-600 dark:text-stone-300 bg-[#fff1e3] dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
              ₹{Number(primaryGoal.monthly_saving_required).toLocaleString('en-IN')}/mo required
            </span>
          </div>
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                {primaryGoal.name}
              </h3>
              <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                {primaryGoal.percent_complete}%
              </span>
            </div>
          </div>
          <ProgressBar value={primaryGoal.current_amount} max={primaryGoal.target_amount} />
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pt-1 font-medium">
            <span>Saved: ₹{Number(primaryGoal.current_amount).toLocaleString('en-IN')}</span>
            <span>Target: ₹{Number(primaryGoal.target_amount).toLocaleString('en-IN')}</span>
          </div>
        </div>
      )}

      {/* Learn Guides Shortcut Banner */}
      <button
        onClick={() => onNavigate('learn')}
        className="w-full rounded-2xl bg-[#fff1e3]/70 dark:bg-slate-900 border border-amber-200/70 dark:border-slate-800 p-3.5 shadow-xs flex items-center justify-between gap-3 active:scale-95 transition-transform text-left cursor-pointer min-h-[54px]"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-slate-800 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
            <IconBook size={20} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 truncate">
                {t('nav_learn') || 'Learn'}: Financial Guides
              </h4>
              <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
              Emergency Fund • Managing Loans • Micro-Insurance
            </p>
          </div>
        </div>
        <IconChevronRight size={18} className="text-stone-400 shrink-0" />
      </button>
    </div>
  );
}
