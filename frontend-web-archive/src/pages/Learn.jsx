import React, { useState } from 'react';
import {
  IconShieldCheck,
  IconSparkles,
  IconTrendingDown,
  IconPigMoney,
  IconHeartHandshake,
  IconVolume,
  IconPlayerPlay,
  IconPlayerPause,
  IconMicrophone,
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { useSpeech } from '../hooks/useSpeech';

const TOPICS = [
  {
    id: 'emergency-fund',
    title: 'Emergency Fund',
    icon: IconShieldCheck,
    iconBg: 'bg-orange-100 dark:bg-[#28211C] text-orange-700 dark:text-[#ffb690]',
    bestLocation: 'Post Office / MSSC',
    allocation: '₹1,500 / month',
    audio: {
      en: 'Keep 3 months of essential kitchen and household expenses in a bank or Post Office account to protect your family from private moneylenders at 36% to 60% high interest.',
      te: 'అత్యవసరాల కోసం 3 నెలల కుటుంబ ఖర్చులను పోస్ట్ ఆఫీస్ లేదా బ్యాంకులో భద్రపరుచుకోండి. దీనివల్ల ప్రైవేట్ వడ్డీ వ్యాపారుల వద్ద అప్పు చేయాల్సిన అవసరం ఉండదు.',
      hi: 'आपातकालीन स्थिति के लिए 3 महीने का आवश्यक खर्च बैंक या डाकघर में सुरक्षित रखें ताकि महंगे ब्याज पर कर्ज़ न लेना पड़े।'
    }
  },
  {
    id: 'managing-debt',
    title: 'Managing Loans',
    icon: IconTrendingDown,
    iconBg: 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300',
    bestLocation: 'SHG / Stree Nidhi',
    allocation: '50% of monthly surplus',
    audio: {
      en: 'Private moneylender loans drain your household surplus. Paying down high-interest debt first frees up your income every single month.',
      te: 'అధిక వడ్డీ ప్రైవేట్ అప్పులను ముందుగా తీర్చివేయడం ద్వారా మీ నెలవారీ మిగులును పెంచుకోండి మరియు తక్కువ వడ్డీ స్త్రీనిధి లేదా సంఘం రుణాలను ఉపయోగించండి.',
      hi: 'ऊंचे ब्याज वाले कर्ज़ को पहले चुकाएं ताकि हर महीने ब्याज की बचत हो सके और आपका मासिक पैसा बढ़ सके।'
    }
  },
  {
    id: 'disciplined-savings',
    title: 'Disciplined Saving',
    icon: IconPigMoney,
    iconBg: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300',
    bestLocation: 'Post Office RD / Bank',
    allocation: '₹500 - ₹1,000 / month',
    audio: {
      en: 'Saving is not what is left after spending. Put aside a small fixed amount in a Post Office Recurring Deposit the day income arrives before festival spending.',
      te: 'ఆదాయం వచ్చిన రోజే పోస్ట్ ఆఫీస్ రికరింగ్ డిపాజిట్‌లో 500 నుండి 1000 రూపాయలు వెంటనే దాచుకోండి.',
      hi: 'आय आते ही सबसे पहले डाकघर आरडी या बैंक में 500 से 1000 रुपये की बचत अलग रख लें।'
    }
  },
  {
    id: 'government-insurance',
    title: 'Micro-Insurance',
    icon: IconHeartHandshake,
    iconBg: 'bg-amber-100 dark:bg-[#28211C] text-amber-800 dark:text-[#ffb690]',
    bestLocation: 'Savings Bank Branch',
    allocation: '₹20/year (PMSBY)',
    audio: {
      en: 'Government-backed micro-insurance policies provide 2 Lakh Rupees protection for your family with tiny annual bank deductions under PMSBY and PMJJBY.',
      te: 'ప్రభుత్వ పిఎంఎస్బివై మరియు పిఎంజెజెబివై పథకాల ద్వారా సంవత్సరానికి కేవలం 20 రూపాయలకే 2 లక్షల రూపాయల కుటుంబ బీమా రక్షణ లభిస్తుంది.',
      hi: 'सरकारी पीएमएसबीवाई योजना से केवल 20 रुपये प्रति वर्ष में आपके परिवार को 2 लाख रुपये का दुर्घटना बीमा मिलता है।'
    }
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
  const topicSpeechText = currentTopic.audio[language] || currentTopic.audio.en;

  const headerOverviewId = 'learn-header-overview';
  const isHeaderSpeaking = isSpeaking && speakingId === headerOverviewId;

  const handleHeaderAudio = () => {
    if (isHeaderSpeaking) {
      stop();
    } else {
      const headerText =
        language === 'te'
          ? `నమస్తే ${user?.name || 'లక్ష్మి'}, మీ ₹${Number(surplus).toLocaleString('en-IN')} మిగులు ఆధారంగా, ఇక్కడ మీ సిఫార్సు చేయబడిన ఆర్థిక పాఠాలు ఉన్నాయి.`
          : language === 'hi'
          ? `नमस्ते ${user?.name || 'लक्ष्मी'}, आपकी ₹${Number(surplus).toLocaleString('en-IN')} बचत के आधार पर, ये आपके लिए महत्वपूर्ण वित्तीय सुझाव हैं।`
          : `Namaste ${user?.name || 'Lakshmi'}, based on your ₹${Number(surplus).toLocaleString('en-IN')} surplus, here are your recommended financial steps.`;
      speak(headerText, headerOverviewId, language);
    }
  };

  const handleMetricAudio = () => {
    const metricText =
      language === 'te'
        ? `మీరు మీ ₹${Number(emergencyTarget).toLocaleString('en-IN')} లక్ష్యంలో ₹${Number(savedAmount).toLocaleString('en-IN')} పొదుపు చేశారు.`
        : language === 'hi'
        ? `आपने अपने ₹${Number(emergencyTarget).toLocaleString('en-IN')} के लक्ष्य में से ₹${Number(savedAmount).toLocaleString('en-IN')} बचा लिए हैं।`
        : `You have saved ₹${Number(savedAmount).toLocaleString('en-IN')} of your ₹${Number(emergencyTarget).toLocaleString('en-IN')} target.`;
    speak(metricText, 'learn-metric-audio', language);
  };

  const langNames = {
    en: 'English',
    hi: 'Hindi',
    te: 'Telugu',
  };

  return (
    <div className="space-y-4">
      {/* 1. Compact Header with Language Selector & Audio Waveform Pill */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <h1 className="text-xl sm:text-2xl font-black text-[#221a0e] dark:text-[#FFF5EB] tracking-tight">
          Financial Guides
        </h1>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Audio Overview Trigger */}
          {isTtsSupported && (
            <button
              type="button"
              onClick={handleHeaderAudio}
              title="Listen to Overview"
              aria-label="Listen to Overview"
              className={`p-2 rounded-full transition active:scale-95 cursor-pointer border shadow-2xs ${
                isHeaderSpeaking
                  ? 'bg-orange-600 text-white border-orange-600 animate-pulse'
                  : 'bg-[#fff1e3] dark:bg-[#28211C] text-orange-800 dark:text-[#ffb690] border-amber-200/70 dark:border-[#3D332B] hover:bg-orange-100'
              }`}
            >
              <IconVolume size={16} />
            </button>
          )}

          {/* Language Selector Dropdown Pill */}
          <button
            type="button"
            onClick={() => {
              const next = language === 'te' ? 'hi' : language === 'hi' ? 'en' : 'te';
              setLanguage(next);
            }}
            className="px-3 py-1.5 rounded-full bg-[#fff1e3] dark:bg-[#28211C] text-orange-950 dark:text-[#ffb690] font-bold text-xs shadow-2xs border border-orange-200/70 dark:border-[#3D332B] active:scale-95 transition cursor-pointer flex items-center gap-1"
          >
            <span>{langNames[language] || 'Telugu'} ▾</span>
          </button>
        </div>
      </div>

      {/* 2. Topic Carousel without Micro-Tags (Clean Category Names + Speaker Icon) */}
      <div className="flex gap-2.5 overflow-x-auto snap-x snap-mandatory no-scrollbar py-1 -mx-3.5 px-3.5 sm:-mx-4 sm:px-4">
        {TOPICS.map((topic) => {
          const TopicIcon = topic.icon;
          const isSelected = selectedTopicId === topic.id;

          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => {
                setSelectedTopicId(topic.id);
                if (isSpeaking) stop();
              }}
              className={`snap-start shrink-0 min-w-[170px] sm:min-w-[190px] p-3.5 rounded-2xl text-left transition-all duration-200 cursor-pointer border flex items-center justify-between gap-2.5 ${
                isSelected
                  ? 'bg-white dark:bg-[#1e1b19] border-orange-500 ring-2 ring-orange-500/20 shadow-md scale-[1.01]'
                  : 'bg-white/70 dark:bg-[#1e1b19]/70 border-amber-200/60 dark:border-[#3D332B] hover:bg-white dark:hover:bg-[#1e1b19] opacity-80'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`p-2 rounded-xl shrink-0 ${topic.iconBg}`}>
                  <TopicIcon size={18} />
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-[#221a0e] dark:text-[#FFF5EB] leading-tight truncate">
                  {topic.title}
                </h3>
              </div>
              {isSelected && (
                <div className="w-2 h-2 rounded-full bg-orange-600 dark:bg-orange-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Selected Topic Visual Metric Card (No Heavy Paragraphs, Visual Only) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTopic.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white dark:bg-[#1e1b19] border border-amber-200/80 dark:border-[#3D332B] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5"
        >
          {/* Visual Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`p-2.5 rounded-xl shrink-0 ${currentTopic.iconBg}`}>
                <Icon size={22} />
              </div>
              <h2 className="font-black text-base sm:text-lg text-[#221a0e] dark:text-[#FFF5EB]">
                {currentTopic.title}
              </h2>
            </div>
          </div>

          {/* 4. Visual Metric Progress (Clean Bar, ₹8,000 / ₹23,400, Tap to Hear) */}
          {currentTopic.id === 'emergency-fund' && (
            <div
              onClick={handleMetricAudio}
              className="p-3.5 rounded-xl bg-[#fffaf5] dark:bg-[#14110F] border border-amber-200/60 dark:border-[#3D332B] space-y-2 cursor-pointer active:scale-99 transition-transform"
              title="Tap to listen"
            >
              <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-[#D4C4B5]">
                <span>₹{Number(savedAmount).toLocaleString('en-IN')}</span>
                <span className="text-orange-600 dark:text-[#ffb690]">₹{Number(emergencyTarget).toLocaleString('en-IN')}</span>
              </div>

              <div className="w-full bg-stone-200 dark:bg-[#28211C] h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-orange-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${emergencyPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* 5. Clean Structured Stat Tiles (No Redundant Bullet Lists) */}
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

          {/* 6. Two Clean, Tactile Action Pills ([Play Lesson] & [Ask Sakhi]) */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {isTtsSupported && (
              <button
                type="button"
                onClick={() => {
                  if (isTopicSpeaking) {
                    stop();
                  } else {
                    speak(topicSpeechText, topicSpeechId, language);
                  }
                }}
                aria-label={isTopicSpeaking ? t('stop_listening') : 'Play Lesson'}
                className={`w-full py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm min-h-[44px] border ${
                  isTopicSpeaking
                    ? 'bg-amber-100 dark:bg-[#28211C] text-amber-950 dark:text-[#ffb690] border-amber-300 dark:border-[#3D332B]'
                    : 'bg-orange-600 hover:bg-orange-700 active:scale-98 text-white border-orange-600'
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
                    <span>Play Lesson</span>
                  </>
                )}
              </button>
            )}

            {onOpenAskSakhi && (
              <button
                type="button"
                onClick={onOpenAskSakhi}
                className="w-full py-3 px-3 rounded-xl bg-orange-100/70 hover:bg-orange-100 dark:bg-[#28211C] dark:hover:bg-[#383431] text-orange-950 dark:text-[#ffb690] font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 cursor-pointer border border-orange-200/60 dark:border-[#3D332B] active:scale-98 min-h-[44px]"
              >
                <IconMicrophone size={16} className="text-orange-600 dark:text-[#ffb690]" />
                <span>Ask Sakhi</span>
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
