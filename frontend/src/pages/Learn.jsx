import React, { useState } from 'react';
import {
  IconShieldCheck,
  IconSparkles,
  IconTrendingDown,
  IconPigMoney,
  IconHeartHandshake,
  IconCircleCheck,
  IconVolume,
  IconPlayerPlay,
  IconPlayerPause,
  IconBulb,
  IconChevronRight,
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { useSpeech } from '../hooks/useSpeech';

const TOPICS = [
  {
    id: 'emergency-fund',
    title: 'Emergency Fund',
    category: 'Safety Shield',
    subtitle: 'Build a 3-month safety net for unexpected hospital or medical expenses',
    icon: IconShieldCheck,
    accentColor: 'from-orange-500 to-amber-500',
    iconBg: 'bg-orange-100 dark:bg-[#28211C] text-orange-700 dark:text-[#ffb690]',
    metricLabel: '3-Month Buffer',
    ruleTitle: 'The 3-Month Safety Rule',
    summary: 'Keep 3 months of essential kitchen and household expenses in a bank or Post Office account. When emergencies strike, you never have to borrow from private moneylenders at 36%–60% interest.',
    bestLocation: 'Post Office / MSSC',
    allocation: '₹1,500 / month',
    points: [
      'Target: 3 months of basic household expenses in a safe bank account.',
      'Location: Separate Post Office account or savings account with ATM card.',
      'Benefit: Eliminates high-interest borrowing at 3% to 5% monthly interest.'
    ]
  },
  {
    id: 'managing-debt',
    title: 'Managing Loans',
    category: 'Debt Freedom',
    subtitle: 'Pay off high-interest private debt first to unlock monthly cash surplus',
    icon: IconTrendingDown,
    accentColor: 'from-rose-500 to-orange-500',
    iconBg: 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300',
    metricLabel: 'Save ₹600/mo',
    ruleTitle: 'High-Interest Snowball',
    summary: 'Private moneylender loans drain your household surplus. Prioritizing high-interest principal repayment directly frees up extra cash every single month.',
    bestLocation: 'SHG / Stree Nidhi Refinance',
    allocation: '50% of monthly surplus',
    points: [
      'Prioritize loans with 3% to 5% monthly interest rates first.',
      'Direct half of your monthly surplus to reduce loan principal directly.',
      'Explore low-interest SHG credit or Stree Nidhi to replace expensive private debt.'
    ]
  },
  {
    id: 'disciplined-savings',
    title: 'Disciplined Saving',
    category: 'Wealth Growth',
    subtitle: 'Put aside ₹500 to ₹1,000 on pay day before spending on non-essentials',
    icon: IconPigMoney,
    accentColor: 'from-emerald-500 to-teal-500',
    iconBg: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300',
    metricLabel: 'Auto-Save Day 1',
    ruleTitle: 'Pay Yourself First',
    summary: 'Saving is not what is left after spending. Set aside a fixed amount on the day salary, harvest, or sales income arrives before festival or discretionary spending.',
    bestLocation: 'Post Office RD / Bank RD',
    allocation: '₹500 - ₹1,000 / month',
    points: [
      'Open a Recurring Deposit (RD) at your nearest Post Office or bank branch.',
      'Set an auto-save schedule immediately after weekly market or harvest payout.',
      'Explore Mahila Samman Savings Certificate (MSSC) with 7.5% guaranteed return.'
    ]
  },
  {
    id: 'government-insurance',
    title: 'Micro-Insurance',
    category: 'Family Security',
    subtitle: 'Protect your family with ₹2 Lakh security for just ₹20/year government schemes',
    icon: IconHeartHandshake,
    accentColor: 'from-amber-500 to-orange-600',
    iconBg: 'bg-amber-100 dark:bg-[#28211C] text-amber-800 dark:text-[#ffb690]',
    metricLabel: '₹20/Year (PMSBY)',
    ruleTitle: 'Tiny Premium, Huge Security',
    summary: 'Government-backed micro-insurance policies provide ₹2 Lakh protection for your family with minimal automated annual bank deductions.',
    bestLocation: 'Any Savings Bank Branch',
    allocation: '₹20/yr (PMSBY) + ₹436/yr (PMJJBY)',
    points: [
      'PMSBY: ₹20 per year gives ₹2 Lakh accidental insurance coverage.',
      'PMJJBY: ₹436 per year gives ₹2 Lakh life insurance protection for family.',
      'Enrollment: Fill out a simple one-page form at your savings bank.'
    ]
  }
];

export default function Learn({ onOpenAskSakhi }) {
  const { user, financialHealth, language, setLanguage, t } = useUser();
  const { isSpeaking, speakingId, speak, stop, isSupported: isTtsSupported } = useSpeech();
  const [selectedTopicId, setSelectedTopicId] = useState(TOPICS[0].id);

  const surplus = financialHealth?.monthly_surplus ?? (user?.monthly_income ? Math.round((user.monthly_income || 12000) * 0.35) : 4200);
  const expenses = (user?.monthly_income || 12000) - surplus;
  const emergencyTarget = expenses > 0 ? expenses * 3 : 24000;
  const savedAmount = financialHealth?.total_savings ?? 8000;
  const emergencyPercent = Math.min(100, Math.round((savedAmount / (emergencyTarget || 1)) * 100));

  const currentTopic = TOPICS.find((t) => t.id === selectedTopicId) || TOPICS[0];
  const Icon = currentTopic.icon;
  const topicSpeechId = `learn-${currentTopic.id}`;
  const isTopicSpeaking = isSpeaking && speakingId === topicSpeechId;
  const topicSpeechText = `${currentTopic.title}. ${currentTopic.summary}. Key lessons: ${currentTopic.points.join('. ')}`;

  const langNames = {
    en: 'English',
    hi: 'Hindi',
    te: 'Telugu',
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Language Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-black text-[#221a0e] dark:text-[#FFF5EB] tracking-tight">
            Financial Guides
          </h1>
          <button
            type="button"
            onClick={() => {
              const next = language === 'te' ? 'hi' : language === 'hi' ? 'en' : 'te';
              setLanguage(next);
            }}
            className="px-3 py-1 rounded-full bg-[#fff1e3] dark:bg-[#28211C] text-orange-900 dark:text-[#ffb690] font-bold text-xs shadow-2xs border border-orange-200/70 dark:border-[#3D332B] active:scale-95 transition cursor-pointer flex items-center gap-1 shrink-0"
          >
            <IconVolume size={14} className="text-orange-600 dark:text-[#ffb690]" />
            <span>{langNames[language] || 'Telugu'} ▾</span>
          </button>
        </div>
        <p className="text-xs text-stone-600 dark:text-[#A8988A]">
          Practical audio lessons tailored for your monthly surplus of ₹{Number(surplus).toLocaleString('en-IN')}.
        </p>
      </div>

      {/* Horizontal Swipeable Topic Carousel */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 dark:text-[#A8988A] px-0.5">
          <span>SELECT TOPIC (SWIPE)</span>
          <span>{TOPICS.findIndex((t) => t.id === selectedTopicId) + 1} of {TOPICS.length}</span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto snap-x snap-mandatory no-scrollbar py-1 -mx-3.5 px-3.5 sm:-mx-4 sm:px-4">
          {TOPICS.map((topic) => {
            const TopicIcon = topic.icon;
            const isSelected = selectedTopicId === topic.id;

            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => setSelectedTopicId(topic.id)}
                className={`snap-start shrink-0 min-w-[210px] sm:min-w-[240px] max-w-[75vw] p-3.5 rounded-2xl text-left transition-all duration-200 cursor-pointer border flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'bg-white dark:bg-[#1e1b19] border-orange-500 dark:border-orange-500 ring-2 ring-orange-500/20 shadow-md scale-[1.01]'
                    : 'bg-white/70 dark:bg-[#1e1b19]/70 border-amber-200/60 dark:border-[#3D332B] hover:bg-white dark:hover:bg-[#1e1b19] opacity-80'
                }`}
              >
                <div className="flex items-start justify-between w-full">
                  <div className={`p-2.5 rounded-xl ${topic.iconBg}`}>
                    <TopicIcon size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#fff1e3] dark:bg-[#28211C] text-orange-900 dark:text-[#ffb690] border border-amber-200/60 dark:border-[#3D332B]">
                    {topic.metricLabel}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-[#221a0e] dark:text-[#FFF5EB] leading-tight">
                    {topic.title}
                  </h3>
                  <p className="text-[11px] text-stone-500 dark:text-[#A8988A] truncate mt-0.5">
                    {topic.category}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Topic Deep-Dive Card (Progressive Disclosure) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTopic.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white dark:bg-[#1e1b19] border border-amber-200/80 dark:border-[#3D332B] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4"
        >
          {/* Card Header & Rule Summary */}
          <div className="flex items-start gap-3.5">
            <div className={`p-3 rounded-2xl shrink-0 ${currentTopic.iconBg}`}>
              <Icon size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase font-bold text-orange-600 dark:text-[#ffb690] tracking-wider">
                {currentTopic.category}
              </span>
              <h2 className="font-black text-base sm:text-lg text-[#221a0e] dark:text-[#FFF5EB] leading-tight">
                {currentTopic.title}
              </h2>
              <p className="text-xs text-stone-600 dark:text-[#D4C4B5] mt-1 leading-relaxed">
                {currentTopic.summary}
              </p>
            </div>
          </div>

          {/* Emergency Fund Specific Metric Ring / Progress */}
          {currentTopic.id === 'emergency-fund' && (
            <div className="p-3.5 rounded-xl bg-[#fff1e3]/60 dark:bg-[#14110F] border border-orange-200/60 dark:border-[#3D332B] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700 dark:text-[#D4C4B5]">
                  Your Emergency Target
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
                <span>Saved: ₹{Number(savedAmount).toLocaleString('en-IN')} ({emergencyPercent}%)</span>
                <span>Target: 3 Months Buffer</span>
              </div>
            </div>
          )}

          {/* Parameters & Safe Location Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-[#fffaf5] dark:bg-[#14110F] border border-amber-100 dark:border-[#3D332B]">
              <span className="text-[10px] text-stone-500 dark:text-[#A8988A] uppercase font-bold block">
                Monthly Recommendation
              </span>
              <span className="text-xs sm:text-sm font-black text-[#221a0e] dark:text-[#FFF5EB] mt-0.5 block truncate">
                {currentTopic.allocation}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#fffaf5] dark:bg-[#14110F] border border-amber-100 dark:border-[#3D332B]">
              <span className="text-[10px] text-stone-500 dark:text-[#A8988A] uppercase font-bold block">
                Best Safe Institution
              </span>
              <span className="text-xs sm:text-sm font-black text-[#221a0e] dark:text-[#FFF5EB] mt-0.5 block truncate">
                {currentTopic.bestLocation}
              </span>
            </div>
          </div>

          {/* Actionable Lessons Checklist */}
          <div className="space-y-2 pt-1 border-t border-amber-100 dark:border-[#28211C]">
            <span className="text-[11px] font-bold text-stone-700 dark:text-[#D4C4B5] block">
              Key Action Points:
            </span>
            <ul className="space-y-2">
              {currentTopic.points.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-stone-600 dark:text-[#D4C4B5] leading-relaxed">
                  <IconCircleCheck size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Single Focal Action: Audio Guide Player & Inline Ask Sakhi */}
          <div className="pt-2 border-t border-amber-100 dark:border-[#28211C] space-y-2">
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
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md min-h-[46px] border ${
                  isTopicSpeaking
                    ? 'bg-amber-100 dark:bg-[#28211C] text-amber-950 dark:text-[#ffb690] border-amber-300 dark:border-[#3D332B]'
                    : 'bg-orange-600 hover:bg-orange-700 active:scale-98 text-white border-orange-600 shadow-orange-600/20'
                }`}
              >
                {isTopicSpeaking ? (
                  <>
                    <IconPlayerPause size={18} />
                    <span>{t('stop_listening')} ({langNames[language] || 'Audio'})</span>
                    <div className="flex items-center gap-0.5 ml-2">
                      <span className="w-1 h-3.5 bg-amber-800 dark:bg-[#ffb690] rounded-full animate-pulse" />
                      <span className="w-1 h-4.5 bg-amber-800 dark:bg-[#ffb690] rounded-full animate-bounce" />
                      <span className="w-1 h-2.5 bg-amber-800 dark:bg-[#ffb690] rounded-full animate-pulse" />
                    </div>
                  </>
                ) : (
                  <>
                    <IconPlayerPlay size={18} />
                    <span>Listen Guide ({langNames[language] || 'Audio'} 🔊)</span>
                  </>
                )}
              </button>
            )}

            {onOpenAskSakhi && (
              <button
                type="button"
                onClick={onOpenAskSakhi}
                className="w-full py-2 px-3 rounded-xl bg-orange-50 hover:bg-orange-100/70 dark:bg-[#28211C]/60 dark:hover:bg-[#28211C] text-orange-950 dark:text-[#ffb690] font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer border border-orange-200/50 dark:border-[#3D332B] active:scale-98"
              >
                <IconSparkles size={15} className="text-orange-600 dark:text-[#ffb690]" />
                <span className="truncate">Ask Sakhi how this applies to your ₹{Number(surplus).toLocaleString('en-IN')} surplus</span>
                <IconChevronRight size={14} className="text-stone-400" />
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Community Circle Trust Footnote */}
      <div className="p-3.5 rounded-2xl bg-[#fff1e3]/60 dark:bg-[#1e1b19] border border-orange-200/60 dark:border-[#3D332B] flex items-center gap-3 shadow-2xs">
        <img
          className="w-11 h-11 rounded-full object-cover shrink-0 border border-orange-400 shadow-xs"
          alt="Rural South Asian village women conversing outdoors"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtNPHnO1y3OMpfYT7c93IGzr-6a-9fHGOsyLYXB7n_Eq8sJN-CqxfMXwDiPuFrsaJ0P5S4jvMDv9ndfoBqGVRy5SyUOzxbJSHlEv9cemRI64AaICfR0CanrkApwFPRynkzJMJtitGjktviGSfWim8r3H_dW6NKfkGqiVThXGspL6P8O2sIiKaTbqpWUgjWKcHAtNfEJjjm0jaVvnXWHd9np9LZm3S9XjMjhYqSndfq6nrSHKkF2IjGpA"
        />
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-[#221a0e] dark:text-[#FFF5EB]">
            Community Learning Circle
          </span>
          <p className="text-[11px] text-stone-500 dark:text-[#A8988A] leading-tight mt-0.5 truncate">
            Over 38 women in your {user?.state || 'Telangana'} SHG group completed this guide.
          </p>
        </div>
      </div>
    </div>
  );
}
