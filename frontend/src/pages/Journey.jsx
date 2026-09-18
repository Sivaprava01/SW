import React, { useState, useEffect } from 'react';
import {
  IconCompass,
  IconCircleCheck,
  IconLock,
  IconVolume,
  IconVolumeOff,
  IconSparkles,
  IconChevronRight,
  IconArrowRight,
} from '@tabler/icons-react';
import { useUser } from '../context/UserContext';
import { api } from '../services/api';
import { useSpeech } from '../hooks/useSpeech';

export default function Journey({ onOpenAskSakhi }) {
  const { user, financialHealth, t } = useUser();
  const { isSpeaking, speakingId, speak, stop, isSupported: isTtsSupported } = useSpeech();
  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchJourney = async () => {
    if (!user) return;
    try {
      const jData = await api.getJourney(user.id);
      setJourney(jData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJourney();
  }, [user, financialHealth]);

  if (loading || !journey) {
    return (
      <div className="p-8 text-center text-stone-500 dark:text-[#A8988A] text-xs font-medium">
        Evaluating your financial stage...
      </div>
    );
  }

  const activeMilestoneSpeech = `${journey.current_stage_name}. ${journey.current_stage_description}. Action: ${journey.action_title}. ${journey.action_description}`;
  const isMilestoneSpeaking = isSpeaking && speakingId === 'active-milestone';

  return (
    <div className="space-y-3.5 pb-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[11px] font-bold text-orange-800 dark:text-[#ffb690] bg-[#fff1e3] dark:bg-[#28211C] px-2.5 py-0.5 rounded-full border border-orange-200/60 dark:border-[#3D332B]">
            Financial Freedom Roadmap
          </span>
        </div>
        <h2 className="font-headline text-xl font-black text-[#221a0e] dark:text-[#FFF5EB] tracking-tight">
          Your 7-Stage Journey
        </h2>
        <p className="text-xs text-stone-500 dark:text-[#A8988A]">
          Step-by-step guidance tailored to your real surplus and savings
        </p>
      </div>

      {/* Hero Current Stage Focus (Stitch Hero Card) */}
      <div className="bg-gradient-to-br from-stone-900 via-orange-950 to-emerald-950 text-white rounded-3xl p-5 shadow-xl relative overflow-hidden border border-orange-900/40">
        <div className="absolute top-0 right-0 w-36 h-36 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
            Current Active Milestone
          </span>
          <span className="text-xs font-bold bg-white/20 text-white px-2.5 py-0.5 rounded-full">
            Stage {journey.current_stage_id} of 7
          </span>
        </div>

        <h3 className="font-headline text-xl font-black tracking-tight mb-1 text-white">
          {journey.current_stage_name}
        </h3>
        <p className="text-xs text-stone-200/90 leading-relaxed mb-4">
          {journey.current_stage_description}
        </p>

        {/* Immediate Action Box */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
          <div className="text-xs font-bold text-amber-300 mb-1 flex items-center gap-1.5">
            <IconSparkles size={15} /> Immediate Action:
          </div>
          <div className="text-sm font-semibold text-white">
            {journey.action_title}
          </div>
          <p className="text-xs text-stone-300/80 mt-1 leading-relaxed">
            {journey.action_description}
          </p>
        </div>

        {/* Actions Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {isTtsSupported && (
              <button
                type="button"
                onClick={() => speak(activeMilestoneSpeech, 'active-milestone')}
                className={`px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer min-h-[38px] flex items-center gap-1.5 border ${
                  isMilestoneSpeaking
                    ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-xs font-black'
                    : 'bg-white/15 hover:bg-white/25 text-white border-white/20'
                }`}
                aria-label={isMilestoneSpeaking ? t('stop_listening') : t('listen')}
              >
                {isMilestoneSpeaking ? (
                  <>
                    <IconVolumeOff size={15} />
                    <span>{t('stop_listening')}</span>
                  </>
                ) : (
                  <>
                    <IconVolume size={15} />
                    <span>🔊 {t('listen')}</span>
                  </>
                )}
              </button>
            )}
            <span className="text-xs text-orange-200">
              Next: <strong>{journey.next_stage}</strong>
            </span>
          </div>

          {onOpenAskSakhi && (
            <button
              onClick={onOpenAskSakhi}
              className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-black rounded-xl transition cursor-pointer min-h-[38px] flex items-center gap-1 shadow-xs"
            >
              <IconSparkles size={14} />
              <span>Ask Sakhi Advice</span>
            </button>
          )}
        </div>
      </div>

      {/* 7-Stage Interactive Roadmap List */}
      <div className="space-y-2 pt-2">
        <h4 className="text-[11px] font-bold text-stone-500 dark:text-[#A8988A] uppercase tracking-wider">
          Complete Roadmap
        </h4>

        {journey.stages.map((stage) => {
          const isDone = stage.is_completed;
          const isCurrent = stage.is_current;

          return (
            <div
              key={stage.id}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                isCurrent
                  ? 'bg-orange-50/80 dark:bg-[#28211C] border-orange-400 dark:border-orange-800/80 shadow-xs'
                  : isDone
                  ? 'bg-white dark:bg-[#1e1b19] border-amber-100 dark:border-[#3D332B] opacity-95'
                  : 'bg-[#fffaf5]/60 dark:bg-[#14110F]/60 border-stone-200 dark:border-[#28211C] opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <IconCircleCheck size={16} />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center font-black text-xs shadow-xs animate-pulse">
                      {stage.id}
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-stone-200 dark:bg-[#28211C] text-stone-500 dark:text-[#A8988A] flex items-center justify-center font-bold text-xs">
                      {stage.id}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`font-headline text-xs sm:text-sm font-bold truncate ${isCurrent ? 'text-orange-950 dark:text-[#ffb690]' : 'text-[#221a0e] dark:text-[#FFF5EB]'}`}>
                      {stage.name}
                    </h4>
                    {isDone && (
                      <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full shrink-0">
                        Completed
                      </span>
                    )}
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-amber-950 dark:text-amber-300 bg-amber-200 dark:bg-[#28211C] px-2 py-0.5 rounded-full shrink-0 border border-amber-300 dark:border-[#3D332B]">
                        In Progress
                      </span>
                    )}
                    {!isDone && !isCurrent && (
                      <span className="text-[10px] text-stone-400 dark:text-stone-500 flex items-center gap-0.5 shrink-0">
                        <IconLock size={11} /> Locked
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 dark:text-[#D4C4B5] mt-1 leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
