import React, { useState } from 'react';
import {
  IconBook,
  IconShieldCheck,
  IconSparkles,
  IconTrendingDown,
  IconPigMoney,
  IconHeartHandshake,
  IconCircleCheck,
  IconChevronDown,
  IconChevronUp,
  IconVolume,
  IconPlayerPlay,
  IconPlayerPause,
  IconArrowRight,
  IconInfoCircle,
  IconBulb,
} from '@tabler/icons-react';
import { useUser } from '../context/UserContext';
import { useSpeech } from '../hooks/useSpeech';

const TOPICS = [
  {
    id: 'emergency-fund',
    title: 'Emergency Fund',
    badge: 'Essential',
    badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300',
    subtitle: 'Build your safety net against hospital visits & emergencies',
    icon: IconShieldCheck,
    iconColor: 'bg-orange-100 dark:bg-[#28211C] text-orange-700 dark:text-[#ffb690]',
    ruleTitle: 'The Golden Rule',
    summary: 'Keep 3 months of kitchen & living expenses in a bank or post office account. When medical emergencies strike, you never have to borrow from private moneylenders at 36%–60% high interest.',
    bestLocation: 'Post Office / MSSC',
    allocation: '₹1,500 / month',
    points: [
      'Target: Save 3 times your monthly household expenses safely in a bank account.',
      'Where to keep: In a separate savings account or Post Office account with an ATM card.',
      'Why it helps: Avoids borrowing from private moneylenders at 3% to 5% monthly interest.'
    ]
  },
  {
    id: 'managing-debt',
    title: 'Managing Loans',
    badge: 'High Priority',
    badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300',
    subtitle: 'Pay off high-interest moneylender debt first to keep your surplus',
    icon: IconTrendingDown,
    iconColor: 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300',
    ruleTitle: 'Debt Snowball Rule',
    summary: 'Private moneylender loans drain your household surplus. Paying down high-interest debt first frees up your income every single month.',
    insightPill: 'Clearing your moneylender loan saves ₹360 to ₹600 every single month in interest.',
    points: [
      'Pay highest-interest debt first (loans with 3% to 5% monthly interest).',
      'Put at least half of your monthly surplus towards paying loan principal.',
      'Explore low-interest SHG credit or Stree Nidhi to replace expensive private debt.'
    ]
  },
  {
    id: 'disciplined-savings',
    title: 'Disciplined Saving',
    badge: 'Guaranteed Growth',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300',
    subtitle: 'Put aside ₹500 to ₹1,000 the day money arrives, before spending',
    icon: IconPigMoney,
    iconColor: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300',
    ruleTitle: 'Pay Yourself First',
    summary: 'Saving is not what is left after spending. It is putting aside a small fixed amount the day your salary, milk sale, or harvest money arrives.',
    insightPill: 'Using Recurring Deposits (RD) or SHG weekly pot guarantees money is safe before festival spending.',
    points: [
      'Open a Recurring Deposit (RD) at your nearest Post Office or bank.',
      'Set an auto-save of ₹500 or ₹1,000 every month right after market day.',
      'Explore Mahila Samman Savings Certificate (MSSC) offering 7.5% guaranteed interest for women.'
    ]
  },
  {
    id: 'government-insurance',
    title: 'Micro-Insurance',
    badge: 'Govt Scheme',
    badgeColor: 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-[#ffb690]',
    subtitle: 'Protect your family for ₹20/year with government PMSBY',
    icon: IconHeartHandshake,
    iconColor: 'bg-amber-100 dark:bg-[#28211C] text-amber-800 dark:text-[#ffb690]',
    ruleTitle: 'Tiny Premium, Huge Security',
    summary: 'Government-backed micro-insurance policies provide ₹2 Lakh protection for your family with tiny annual bank deductions.',
    insightPill: '₹2 Lakh accidental security for less than the cost of a single cup of tea.',
    points: [
      'PMSBY: ₹20 per year gives ₹2 Lakh accidental protection.',
      'PMJJBY: ₹436 per year gives ₹2 Lakh life insurance for family security.',
      'How to get: Fill out the simple one-page form at your savings bank branch.'
    ]
  }
];

export default function Learn({ onOpenAskSakhi }) {
  const { user, financialHealth, language, setLanguage, t } = useUser();
  const { isSpeaking, speakingId, speak, stop, isSupported: isTtsSupported } = useSpeech();
  const [expandedId, setExpandedId] = useState(TOPICS[0].id);

  const surplus = financialHealth?.monthly_surplus ?? user?.monthly_income ? Math.round((user.monthly_income || 12000) * 0.35) : 4200;
  const expenses = (user?.monthly_income || 12000) - surplus;
  const emergencyTarget = expenses > 0 ? expenses * 3 : 24000;
  const savedAmount = financialHealth?.total_savings ?? 8000;
  const emergencyPercent = Math.min(100, Math.round((savedAmount / (emergencyTarget || 1)) * 100));

  const langNames = {
    en: 'English',
    hi: 'Hindi',
    te: 'Telugu',
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header Context */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 dark:bg-[#28211C] text-orange-900 dark:text-[#ffb690] font-bold text-[11px] uppercase tracking-wider border border-orange-200/60 dark:border-[#3D332B] shadow-2xs">
            <IconBook size={13} />
            Financial Guidance
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 dark:bg-[#1e1b19] text-stone-700 dark:text-[#D4C4B5] font-bold text-[11px] border border-stone-200/60 dark:border-[#3D332B]">
            <IconShieldCheck size={13} />
            Plain Language
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-[#221a0e] dark:text-[#FFF5EB] tracking-tight leading-tight">
          What do you want to learn?
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-[#A8988A] leading-relaxed">
          Simple audio guides to protect your family and grow your savings with zero bank jargon.
        </p>

        {/* Mother Tongue Audio Selector Banner */}
        <div className="p-3.5 rounded-2xl bg-[#fff1e3] dark:bg-[#1e1b19] border border-orange-200/70 dark:border-[#3D332B] flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <IconVolume size={20} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-orange-950 dark:text-[#FFF5EB]">
                Listen in your mother tongue
              </span>
              <span className="text-[11px] text-stone-600 dark:text-[#A8988A] truncate">
                Telugu • Hindi • English voiceovers
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const next = language === 'te' ? 'hi' : language === 'hi' ? 'en' : 'te';
              setLanguage(next);
            }}
            className="px-3 py-1.5 rounded-full bg-white dark:bg-[#28211C] text-orange-900 dark:text-[#ffb690] font-bold text-xs shadow-2xs border border-orange-200 dark:border-[#3D332B] active:scale-95 transition cursor-pointer shrink-0"
          >
            {langNames[language] || 'Telugu'} ▾
          </button>
        </div>
      </div>

      {/* Educational Visual Card */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-white dark:bg-[#1e1b19] border border-amber-100 dark:border-[#3D332B] p-3.5 shadow-2xs flex items-center gap-3.5">
        <img
          className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-amber-100 dark:border-[#3D332B] shadow-xs"
          alt="Indian woman reviewing passbook in sunlit courtyard"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcVmgv_uYzxirRMwxZusOIPQFf74usILkdpiFR_ZxaKV2N20IiDOzpFD_YL9Jgca5NKvOv6XoesasiUTZcdg-khHqRAdZeSev9bnq4pSkY4cp88m5E4IddEQn2CHExoHfH_U4Fm61H4X8YhbZAY1IDbKzcFlFQgMc8kGpxsq6e3bfEOiVXmrnFHMW9mRyW365euKST6JhaXvw0CQoCqaBcletY_1EGHbx7e_N4A6lvN8m2tnZFi6uS0w"
        />
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1 text-orange-600 dark:text-[#ffb690]">
            <IconSparkles size={13} />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Personalized for {user?.name || 'Lakshmi'}
            </span>
          </div>
          <p className="text-sm font-black text-[#221a0e] dark:text-[#FFF5EB] leading-tight mt-0.5">
            Based on your ₹{Number(surplus).toLocaleString('en-IN')} surplus
          </p>
          <p className="text-[11px] text-stone-500 dark:text-[#A8988A] mt-1 leading-snug">
            Starting small today keeps moneylenders away forever.
          </p>
        </div>
      </div>

      {/* Topics Accordion Cards */}
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
              className={`bg-white dark:bg-[#1e1b19] border rounded-2xl overflow-hidden shadow-xs transition ${
                isExpanded
                  ? 'border-orange-400 dark:border-orange-500 ring-2 ring-orange-100 dark:ring-orange-950/40'
                  : 'border-amber-100 dark:border-[#3D332B] hover:border-amber-200 dark:hover:border-stone-700'
              }`}
            >
              {/* Card Header */}
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : topic.id)}
                className="w-full p-4 text-left flex items-start justify-between gap-3 hover:bg-stone-50/50 dark:hover:bg-[#28211C]/50 transition cursor-pointer"
                aria-expanded={isExpanded}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`p-2.5 rounded-xl shrink-0 ${topic.iconColor}`}>
                    <Icon size={22} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-black text-sm text-[#221a0e] dark:text-[#FFF5EB] leading-snug">
                        {topic.title}
                      </h3>
                      {topic.badge && (
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${topic.badgeColor}`}>
                          {topic.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 dark:text-[#A8988A] mt-0.5 leading-snug">
                      {topic.subtitle}
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-[#28211C] flex items-center justify-center text-stone-500 dark:text-[#D4C4B5] shrink-0 ml-1">
                  {isExpanded ? <IconChevronUp size={18} /> : <IconChevronDown size={18} />}
                </div>
              </button>

              {/* Card Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-amber-100 dark:border-[#28211C] bg-[#fffaf5]/50 dark:bg-[#14110F] space-y-3 animate-in fade-in">
                  {/* Summary / Golden Rule Box */}
                  <div className="p-3.5 rounded-xl bg-white dark:bg-[#1e1b19] border border-amber-100 dark:border-[#3D332B] space-y-1">
                    <span className="text-[11px] font-black uppercase tracking-wider text-orange-700 dark:text-[#ffb690] flex items-center gap-1">
                      <IconBulb size={14} />
                      {topic.ruleTitle}
                    </span>
                    <p className="text-xs text-stone-700 dark:text-[#D4C4B5] leading-relaxed font-medium">
                      {topic.summary}
                    </p>
                  </div>

                  {/* Custom Infographic for Emergency Fund */}
                  {topic.id === 'emergency-fund' && (
                    <div className="p-3.5 rounded-xl bg-[#fff1e3]/60 dark:bg-[#1e1b19] border border-orange-200/60 dark:border-[#3D332B] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-600 dark:text-[#A8988A]">
                          Recommended Fund Goal
                        </span>
                        <span className="text-sm font-black text-orange-600 dark:text-[#ffb690]">
                          ₹{Number(emergencyTarget).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="w-full bg-stone-200 dark:bg-[#28211C] h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-orange-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${emergencyPercent}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-[11px] text-stone-500 dark:text-[#A8988A] font-semibold">
                        <span>Saved so far: ₹{Number(savedAmount).toLocaleString('en-IN')} ({emergencyPercent}%)</span>
                        <span>Target: 3 Months</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="p-2 rounded-lg bg-white dark:bg-[#100e0c] border border-amber-100 dark:border-[#3D332B] flex flex-col">
                          <span className="text-[10px] text-stone-400 dark:text-[#A8988A] uppercase font-bold">Monthly Allocation</span>
                          <span className="text-xs font-black text-[#221a0e] dark:text-[#FFF5EB]">
                            {topic.allocation}
                          </span>
                        </div>
                        <div className="p-2 rounded-lg bg-white dark:bg-[#100e0c] border border-amber-100 dark:border-[#3D332B] flex flex-col">
                          <span className="text-[10px] text-stone-400 dark:text-[#A8988A] uppercase font-bold">Best Safe Location</span>
                          <span className="text-xs font-black text-[#221a0e] dark:text-[#FFF5EB] truncate">
                            {topic.bestLocation}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Insight Pill for Other Cards */}
                  {topic.insightPill && (
                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-[#1e1b19] border border-amber-200 dark:border-[#3D332B] flex items-center gap-2">
                      <IconInfoCircle size={16} className="text-orange-600 dark:text-[#ffb690] shrink-0" />
                      <p className="text-xs text-stone-700 dark:text-[#D4C4B5] font-medium leading-snug">
                        {topic.insightPill}
                      </p>
                    </div>
                  )}

                  {/* Bullet Points */}
                  <ul className="space-y-2">
                    {topic.points.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-stone-600 dark:text-[#D4C4B5] leading-relaxed">
                        <IconCircleCheck size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Audio Player Strip + Sakhi Trigger */}
                  <div className="pt-2 border-t border-amber-100 dark:border-[#28211C] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                    {/* Audio Player Button */}
                    {isTtsSupported && (
                      <button
                        type="button"
                        onClick={() => {
                          if (isTopicSpeaking) {
                            stop();
                          } else {
                            speak(topicSpeechText, topicSpeechId);
                          }
                        }}
                        aria-label={isTopicSpeaking ? t('stop_listening') : t('listen')}
                        className={`px-4 py-2 rounded-full font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer min-h-[40px] border shadow-xs ${
                          isTopicSpeaking
                            ? 'bg-amber-100 dark:bg-[#28211C] text-amber-950 dark:text-[#ffb690] border-amber-300 dark:border-[#3D332B]'
                            : 'bg-orange-600 hover:bg-orange-700 text-white border-orange-600'
                        }`}
                      >
                        {isTopicSpeaking ? (
                          <>
                            <IconPlayerPause size={16} />
                            <span>{t('stop_listening')}</span>
                            <div className="flex items-center gap-0.5 ml-1">
                              <span className="w-1 h-3 bg-amber-800 dark:bg-[#ffb690] rounded-full animate-pulse" />
                              <span className="w-1 h-4 bg-amber-800 dark:bg-[#ffb690] rounded-full animate-bounce" />
                              <span className="w-1 h-2 bg-amber-800 dark:bg-[#ffb690] rounded-full animate-pulse" />
                            </div>
                          </>
                        ) : (
                          <>
                            <IconPlayerPlay size={16} />
                            <span>Listen to Guide (🔊)</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* Ask Sakhi Shortcut */}
                    {onOpenAskSakhi && (
                      <button
                        type="button"
                        onClick={onOpenAskSakhi}
                        className="py-2 px-3 rounded-xl bg-orange-100/70 hover:bg-orange-100 dark:bg-[#28211C] dark:hover:bg-[#383431] text-orange-950 dark:text-[#ffb690] font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px] border border-orange-200/60 dark:border-[#3D332B] active:scale-95"
                      >
                        <IconSparkles size={15} className="text-orange-600 dark:text-[#ffb690]" />
                        <span className="truncate">Ask Sakhi how this applies to your surplus</span>
                        <IconArrowRight size={14} className="text-stone-400" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Community Learning Circle Trust Box */}
      <div className="p-4 rounded-2xl bg-[#fff1e3]/70 dark:bg-[#1e1b19] border border-orange-200/60 dark:border-[#3D332B] flex items-center gap-3.5 shadow-2xs">
        <img
          className="w-14 h-14 rounded-full object-cover shrink-0 border-2 border-orange-400 shadow-xs"
          alt="Rural South Asian village women conversing outdoors"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtNPHnO1y3OMpfYT7c93IGzr-6a-9fHGOsyLYXB7n_Eq8sJN-CqxfMXwDiPuFrsaJ0P5S4jvMDv9ndfoBqGVRy5SyUOzxbJSHlEv9cemRI64AaICfR0CanrkApwFPRynkzJMJtitGjktviGSfWim8r3H_dW6NKfkGqiVThXGspL6P8O2sIiKaTbqpWUgjWKcHAtNfEJjjm0jaVvnXWHd9np9LZm3S9XjMjhYqSndfq6nrSHKkF2IjGpA"
        />
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-black text-[#221a0e] dark:text-[#FFF5EB]">
            Community Learning Circle
          </span>
          <p className="text-[11px] text-stone-600 dark:text-[#A8988A] leading-snug mt-0.5">
            38 women in your {user?.state || 'Telangana'} SHG group completed this guide this week.
          </p>
        </div>
      </div>
    </div>
  );
}
