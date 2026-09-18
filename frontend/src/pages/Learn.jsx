import React, { useState } from 'react';
import { BookOpen, ShieldAlert, Sparkles, TrendingDown, PiggyBank, HeartHandshake, CheckCircle2, ChevronDown, ChevronUp, Volume2, VolumeX } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useSpeech } from '../hooks/useSpeech';

const TOPICS = [
  {
    id: 'emergency-fund',
    title: 'Emergency Fund',
    subtitle: 'Build your safety net against hospital visits & emergencies',
    icon: ShieldAlert,
    iconColor: 'bg-teal-100 text-teal-800',
    summary: 'Money kept safely in the bank that you never touch for shopping or festivals. It protects your family from borrowing during medical emergencies.',
    points: [
      'Target: Save 3 times your monthly household expenses (e.g. ₹21,000 for ₹7,000/mo expenses).',
      'Where to keep: In a separate savings account or Post Office account with an ATM card.',
      'Why it helps: Avoids borrowing from private moneylenders at 36% to 60% high interest.'
    ]
  },
  {
    id: 'managing-debt',
    title: 'Managing Loans',
    subtitle: 'Pay off high-interest loans faster and keep your surplus',
    icon: TrendingDown,
    iconColor: 'bg-rose-100 text-rose-800',
    summary: 'Private moneylender loans drain your household surplus. Paying down high-interest debt first frees up your income.',
    points: [
      'Pay highest-interest debt first (loans with 3% to 5% monthly interest).',
      'Put at least half of your monthly surplus towards paying loan principal.',
      'Explore low-interest SHG credit or Stree Nidhi to replace expensive private debt.'
    ]
  },
  {
    id: 'disciplined-savings',
    title: 'Disciplined Saving',
    subtitle: 'Put aside ₹500 to ₹1,000 the day money arrives',
    icon: PiggyBank,
    iconColor: 'bg-emerald-100 text-emerald-800',
    summary: 'Saving is not what is left after spending. It is putting aside a small fixed amount the day your salary or sales money arrives.',
    points: [
      'Open a Recurring Deposit (RD) at your nearest Post Office or bank.',
      'Set an auto-save of ₹500 or ₹1,000 every month right after market day.',
      'Explore Mahila Samman Savings Certificate (MSSC) offering 7.5% guaranteed interest for women.'
    ]
  },
  {
    id: 'government-insurance',
    title: 'Micro-Insurance',
    subtitle: 'Protect your family for less than the cost of a cup of tea',
    icon: HeartHandshake,
    iconColor: 'bg-purple-100 text-purple-800',
    summary: 'Government-backed micro-insurance policies provide ₹2 Lakh protection for your family with tiny annual bank deductions.',
    points: [
      'PMSBY: ₹20 per year gives ₹2 Lakh accidental protection.',
      'PMJJBY: ₹436 per year gives ₹2 Lakh life insurance for family security.',
      'How to get: Fill out the simple one-page form at your savings bank branch.'
    ]
  }
];

export default function Learn({ onOpenAskSakhi }) {
  const { t } = useUser();
  const { isSpeaking, speakingId, speak, stop, isSupported: isTtsSupported } = useSpeech();
  const [expandedId, setExpandedId] = useState(TOPICS[0].id);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-xs font-bold text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-full">
            Financial Guidance
          </span>
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          What do you want to learn?
        </h2>
        <p className="text-xs text-slate-500">
          Simple guides to protect your family and grow your savings
        </p>
      </div>

      {/* Topics Grid / Cards */}
      <div className="space-y-3">
        {TOPICS.map((topic) => {
          const Icon = topic.icon;
          const isExpanded = expandedId === topic.id;
          const topicSpeechId = `learn-${topic.id}`;
          const isTopicSpeaking = isSpeaking && speakingId === topicSpeechId;
          const topicSpeechText = `${topic.title}. ${topic.summary}. Key lessons: ${topic.points.join('. ')}`;

          return (
            <div
              key={topic.id}
              className={`bg-white border rounded-2xl overflow-hidden shadow-xs transition ${
                isExpanded ? 'border-purple-300 ring-2 ring-purple-100' : 'border-slate-200'
              }`}
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : topic.id)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-slate-50/60 transition cursor-pointer min-h-[64px]"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl shrink-0 ${topic.iconColor}`}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                      {topic.subtitle}
                    </p>
                  </div>
                </div>
                <div className="text-slate-400 shrink-0">
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200 flex-1">
                      {topic.summary}
                    </p>
                  </div>

                  <ul className="space-y-2">
                    {topic.points.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                        <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    {isTtsSupported && (
                      <button
                        type="button"
                        onClick={() => speak(topicSpeechText, topicSpeechId)}
                        aria-label={isTopicSpeaking ? t('stop_listening') : t('listen')}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer min-h-[38px] border ${
                          isTopicSpeaking
                            ? 'bg-amber-100 text-amber-950 border-amber-300 shadow-xs'
                            : 'bg-purple-50 hover:bg-purple-100 text-purple-900 border-purple-200'
                        }`}
                      >
                        {isTopicSpeaking ? (
                          <>
                            <VolumeX size={15} className="text-amber-700" />
                            <span>{t('stop_listening')}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 size={15} className="text-purple-700" />
                            <span>🔊 {t('listen')}</span>
                          </>
                        )}
                      </button>
                    )}

                    {onOpenAskSakhi && (
                      <button
                        type="button"
                        onClick={onOpenAskSakhi}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 cursor-pointer py-1 min-h-[36px]"
                      >
                        <Sparkles size={14} />
                        <span>Ask Sakhi how this applies to you →</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

