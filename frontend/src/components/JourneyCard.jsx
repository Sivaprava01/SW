import React from 'react';
import { Compass, CheckCircle, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import ProgressBar from './ProgressBar';

export default function JourneyCard({ journey, onExplore }) {
  if (!journey) return null;

  return (
    <div className="bg-linear-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
      <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-700/20 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-800/80 rounded-xl">
            <Compass size={18} className="text-emerald-300" />
          </div>
          <span className="text-xs font-semibold tracking-wider text-emerald-200 uppercase">
            Your Financial Journey
          </span>
        </div>
        <span className="text-xs font-bold bg-emerald-800/80 text-emerald-300 px-2.5 py-1 rounded-full">
          Stage {journey.current_stage_id} of 7
        </span>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-black tracking-tight text-white mb-1">
          {journey.current_stage_name}
        </h2>
        <p className="text-xs text-emerald-100/80 leading-relaxed">
          {journey.current_stage_description}
        </p>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-emerald-200 mb-1 font-medium">
          <span>Overall Journey Progress</span>
          <span>{journey.progress_percent}%</span>
        </div>
        <ProgressBar
          value={journey.progress_percent}
          max={100}
          color="bg-emerald-400"
          height="h-2.5"
        />
      </div>

      {journey.action_title && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 mb-3 border border-white/10">
          <div className="flex items-start gap-2.5">
            <ShieldCheck size={18} className="text-amber-300 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-amber-300">
                Recommended Next Step:
              </div>
              <div className="text-sm font-semibold text-white mt-0.5">
                {journey.action_title}
              </div>
              <div className="text-xs text-emerald-100/70 mt-1">
                {journey.action_description}
              </div>
            </div>
          </div>
        </div>
      )}

      {onExplore && (
        <button
          onClick={onExplore}
          className="w-full mt-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
        >
          <span>View All 7 Milestones</span>
          <ChevronRight size={15} />
        </button>
      )}
    </div>
  );
}
