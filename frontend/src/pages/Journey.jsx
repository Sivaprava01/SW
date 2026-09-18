import React, { useState, useEffect } from 'react';
import { Compass, CheckCircle2, Circle, ArrowRight, ShieldCheck, Sparkles, ChevronRight, Lock } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { api } from '../services/api';
import ProgressBar from '../components/ProgressBar';

export default function Journey({ onOpenAskSakhi }) {
  const { user, financialHealth } = useUser();
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
      <div className="p-8 text-center text-slate-500 text-xs font-medium">
        Evaluating your financial stage...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            Financial Freedom Roadmap
          </span>
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Your 7-Stage Journey
        </h2>
        <p className="text-xs text-slate-500">
          Step-by-step guidance tailored to your real surplus and savings
        </p>
      </div>

      {/* Hero Current Stage Focus */}
      <div className="bg-linear-to-br from-emerald-800 to-teal-950 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
            Current Active Milestone
          </span>
          <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
            Stage {journey.current_stage_id} of 7
          </span>
        </div>

        <h3 className="text-xl font-black tracking-tight mb-1 text-white">
          {journey.current_stage_name}
        </h3>
        <p className="text-xs text-emerald-100/80 leading-relaxed mb-4">
          {journey.current_stage_description}
        </p>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
          <div className="text-xs font-bold text-amber-300 mb-1 flex items-center gap-1.5">
            <Sparkles size={14} /> Immediate Action:
          </div>
          <div className="text-sm font-semibold text-white">
            {journey.action_title}
          </div>
          <p className="text-xs text-emerald-100/70 mt-1">
            {journey.action_description}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-emerald-200">
            Next up: <strong>{journey.next_stage}</strong>
          </span>
          {onOpenAskSakhi && (
            <button
              onClick={onOpenAskSakhi}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl transition"
            >
              Ask Sakhi Advice
            </button>
          )}
        </div>
      </div>

      {/* 7-Stage Interactive Roadmap List */}
      <div className="space-y-2.5 pt-2">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Complete Roadmap
        </h4>

        {journey.stages.map((stage) => {
          const isDone = stage.is_completed;
          const isCurrent = stage.is_current;

          return (
            <div
              key={stage.id}
              className={`p-4 rounded-2xl border transition-all ${
                isCurrent
                  ? 'bg-emerald-50/90 border-emerald-400 shadow-sm'
                  : isDone
                  ? 'bg-white border-slate-200 opacity-90'
                  : 'bg-slate-50/70 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {isDone ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <CheckCircle2 size={16} />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-xs animate-pulse">
                      {stage.id}
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs">
                      {stage.id}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-bold ${isCurrent ? 'text-emerald-950' : 'text-slate-800'}`}>
                      {stage.name}
                    </h4>
                    {isDone && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Completed
                      </span>
                    )}
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full">
                        In Progress
                      </span>
                    )}
                    {!isDone && !isCurrent && (
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Lock size={10} /> Locked
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
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
