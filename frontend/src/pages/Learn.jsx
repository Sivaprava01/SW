import React, { useState } from 'react';
import { BookOpen, ShieldAlert, Sparkles, TrendingDown, PiggyBank, HeartHandshake, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

const MODULES = [
  {
    id: 'emergency-fund',
    title: 'Suraksha Kavach (Emergency Fund)',
    subtitle: 'Why keeping 3 months of expenses safe stops medical debt',
    icon: ShieldAlert,
    iconColor: 'bg-teal-100 text-teal-800',
    summary: 'An Emergency Fund is cash you NEVER touch for shopping or festivals. It is your shield against hospital visits or crop failures.',
    details: [
      'Target: Calculate your 1-month family expenses and multiply by 3.',
      'Where to keep it: In a separate savings account or Post Office savings account with an ATM card.',
      'Why it matters: When emergencies strike, families without an emergency shield are forced to borrow from moneylenders at 36% to 60% annual interest.'
    ]
  },
  {
    id: 'managing-debt',
    title: 'Karz Ka Bojh (Managing Debt)',
    subtitle: 'How high-interest informal loans trap families & how to break free',
    icon: TrendingDown,
    iconColor: 'bg-rose-100 text-rose-800',
    summary: 'Not all loans are the same. Informal village moneylenders charge high compound interest that drains your surplus.',
    details: [
      'Identify the loan with the highest interest first (e.g. 3 rupees per 100 per month is 36% per year!).',
      'Use at least 50% of your monthly surplus to pay extra principal each month.',
      'Consider low-interest SHG credit or Stree Nidhi to replace expensive private moneylender debt.'
    ]
  },
  {
    id: 'disciplined-savings',
    title: 'Gullak Aur RD (Disciplined Savings)',
    subtitle: 'Saving ₹500 to ₹1,000 automatically every month',
    icon: PiggyBank,
    iconColor: 'bg-emerald-100 text-emerald-800',
    summary: 'Saving is not what is left after spending; it is putting aside a small fixed amount the day money arrives.',
    details: [
      'Open a Recurring Deposit (RD) at your nearest Post Office or bank.',
      'Set an auto-debit of ₹500 or ₹1,000 every month right after salary or market day.',
      'Explore Mahila Samman Savings Certificate (MSSC) offering 7.5% guaranteed interest for women.'
    ]
  },
  {
    id: 'government-insurance',
    title: '₹20 Ka Bima (Gov Micro-Insurance)',
    subtitle: 'Full family protection for less than the cost of a cup of tea',
    icon: HeartHandshake,
    iconColor: 'bg-purple-100 text-purple-800',
    summary: 'Government provides life and accidental insurance with tiny annual premiums deducted straight from your bank.',
    details: [
      'PMSBY: ₹20 per year gives ₹2 Lakh accident protection.',
      'PMJJBY: ₹436 per year gives ₹2 Lakh life insurance for family in case of any demise.',
      'How to get it: Walk into your savings bank branch and fill the one-page simple consent form.'
    ]
  }
];

export default function Learn({ onOpenAskSakhi }) {
  const [expandedId, setExpandedId] = useState(MODULES[0].id);

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-xs font-bold text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-full">
            Financial Literacy & Wisdom
          </span>
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Financial Learnings
        </h2>
        <p className="text-xs text-slate-500">
          Simple, everyday financial concepts explained in plain language
        </p>
      </div>

      <div className="space-y-3">
        {MODULES.map((mod) => {
          const Icon = mod.icon;
          const isExpanded = expandedId === mod.id;

          return (
            <div
              key={mod.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs transition"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : mod.id)}
                className="w-full p-4 text-left flex items-start justify-between gap-3 hover:bg-slate-50/60 transition"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${mod.iconColor}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {mod.subtitle}
                    </p>
                  </div>
                </div>
                <div className="text-slate-400 mt-1">
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-3">
                  <p className="text-xs font-medium text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                    {mod.summary}
                  </p>
                  <ul className="space-y-2">
                    {mod.details.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  {onOpenAskSakhi && (
                    <button
                      onClick={onOpenAskSakhi}
                      className="mt-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                    >
                      <Sparkles size={13} />
                      <span>Ask Sakhi how this applies to your situation →</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
