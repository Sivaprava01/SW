import React from 'react';
import { Bot, Wallet, Compass, Target, Shield, BookOpen, ArrowUpRight, TrendingUp, Sparkles, ChevronRight } from 'lucide-react';
import { useUser } from '../context/UserContext';
import MoneyCard from '../components/MoneyCard';
import ProgressBar from '../components/ProgressBar';

export default function Home({ onNavigate, onOpenAskSakhi }) {
  const { user, financialHealth } = useUser();

  const income = financialHealth?.monthly_income ?? user?.monthly_income ?? 0;
  const surplus = financialHealth?.surplus ?? ((user?.monthly_income || 0) - (user?.monthly_expenses || 0));
  const primaryGoal = financialHealth?.primary_goal;
  const journey = financialHealth?.journey;

  return (
    <div className="space-y-4">
      {/* Welcome Banner */}
      <div className="bg-linear-to-br from-emerald-700 via-emerald-800 to-teal-900 text-white rounded-3xl p-5 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-emerald-200">
            Namaste, {user?.name || 'Sister'}
          </span>
          <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
            {user?.state || 'India'}
          </span>
        </div>

        <div className="mt-2 mb-3">
          <span className="text-xs text-emerald-100 font-medium block">
            Your Monthly Income
          </span>
          <div className="text-3xl sm:text-4xl font-black tracking-tight">
            ₹{Number(income).toLocaleString('en-IN')}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 flex items-center justify-between border border-white/15">
          <div>
            <span className="text-[11px] text-emerald-200 block">
              Calculated Monthly Surplus
            </span>
            <span className="text-lg font-black text-amber-300">
              ₹{Number(surplus).toLocaleString('en-IN')}
            </span>
          </div>
          <button
            onClick={() => onNavigate('money')}
            className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold transition flex items-center gap-1"
          >
            <span>Breakdown</span>
            <ArrowUpRight size={13} />
          </button>
        </div>
      </div>

      {/* Primary Hero Action: Ask Sakhi */}
      <button
        onClick={onOpenAskSakhi}
        className="w-full bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 p-4 rounded-3xl shadow-md flex items-center justify-between transition-all hover:scale-[1.01] active:scale-[0.99] border border-amber-300/60 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/25 flex items-center justify-center text-slate-950 shadow-xs">
            <Bot size={26} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight">
                Talk to Sakhi
              </span>
              <span className="text-[10px] font-bold bg-slate-950 text-amber-300 px-1.5 py-0.2 rounded-full">
                AI Voice/Text
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-900/80">
              Ask about your ₹{Number(surplus).toLocaleString('en-IN')} surplus, debt or schemes
            </p>
          </div>
        </div>
        <ChevronRight size={20} className="text-slate-950/70 shrink-0" />
      </button>

      {/* Primary Action Grid (as required by Section 5.2) */}
      <div className="grid grid-cols-2 gap-3">
        {/* 1. My Money */}
        <button
          onClick={() => onNavigate('money')}
          className="bg-white border border-slate-200 hover:border-emerald-400 p-4 rounded-2xl text-left shadow-xs transition hover:shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
              <Wallet size={20} />
            </div>
            <ArrowUpRight size={14} className="text-slate-400" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">My Money</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Income, expenses & transactions
            </p>
          </div>
        </button>

        {/* 2. My Journey */}
        <button
          onClick={() => onNavigate('journey')}
          className="bg-white border border-slate-200 hover:border-emerald-400 p-4 rounded-2xl text-left shadow-xs transition hover:shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2.5 rounded-xl bg-teal-100 text-teal-800">
              <Compass size={20} />
            </div>
            <span className="text-[10px] font-bold bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded">
              Stage {journey?.current_stage_id || 2}
            </span>
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">My Journey</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {journey?.current_stage_name || 'Emergency Fund'}
            </p>
          </div>
        </button>

        {/* 3. My Goals */}
        <button
          onClick={() => onNavigate('goals')}
          className="bg-white border border-slate-200 hover:border-emerald-400 p-4 rounded-2xl text-left shadow-xs transition hover:shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-800">
              <Target size={20} />
            </div>
            {primaryGoal && (
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                {primaryGoal.percent_complete}%
              </span>
            )}
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">My Goals</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {primaryGoal?.name || "Save for future"}
            </p>
          </div>
        </button>

        {/* 4. Benefits / Government Schemes */}
        <button
          onClick={() => onNavigate('benefits')}
          className="bg-white border border-slate-200 hover:border-emerald-400 p-4 rounded-2xl text-left shadow-xs transition hover:shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
              <Shield size={20} />
            </div>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded">
              15 Schemes
            </span>
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">Benefits</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Government schemes & loans
            </p>
          </div>
        </button>
      </div>

      {/* Learn Card */}
      <button
        onClick={() => onNavigate('learn')}
        className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 p-3.5 rounded-2xl text-left shadow-2xs flex items-center justify-between transition cursor-pointer min-h-[52px]"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-100 text-purple-800">
            <BookOpen size={18} />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900">Learn: Financial Guides</h4>
            <p className="text-[11px] text-slate-500">
              Emergency Fund • Managing Loans • Disciplined Savings • Micro-Insurance
            </p>
          </div>
        </div>
        <ChevronRight size={16} className="text-slate-400" />
      </button>

      {/* Goal Preview Banner if available */}
      {primaryGoal && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600">Active Dream</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              ₹{Number(primaryGoal.monthly_saving_required).toLocaleString('en-IN')}/mo required
            </span>
          </div>
          <h4 className="font-bold text-sm text-slate-900 mb-1.5">{primaryGoal.name}</h4>
          <ProgressBar value={primaryGoal.current_amount} max={primaryGoal.target_amount} />
          <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
            <span>Saved: ₹{Number(primaryGoal.current_amount).toLocaleString('en-IN')}</span>
            <span>Target: ₹{Number(primaryGoal.target_amount).toLocaleString('en-IN')}</span>
          </div>
        </div>
      )}
    </div>
  );
}
