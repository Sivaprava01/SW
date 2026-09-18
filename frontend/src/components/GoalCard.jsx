import React from 'react';
import { Target, Calendar, CheckCircle2, PlusCircle, Sparkles } from 'lucide-react';
import ProgressBar from './ProgressBar';

export default function GoalCard({ goal, onAddProgress, onDelete }) {
  const isComplete = goal.current_amount >= goal.target_amount;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:border-emerald-300 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-1">
            {goal.category || 'Goal'}
          </span>
          <h3 className="text-lg font-bold text-slate-900">{goal.name}</h3>
        </div>
        {isComplete ? (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
            <CheckCircle2 size={14} /> Completed!
          </span>
        ) : (
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
            {goal.percent_complete}% Done
          </span>
        )}
      </div>

      <div className="mb-3">
        <div className="flex justify-between items-baseline text-sm mb-1.5 font-medium">
          <span className="text-slate-500">Saved: <strong className="text-slate-900">₹{Number(goal.current_amount).toLocaleString('en-IN')}</strong></span>
          <span className="text-slate-500">Target: <strong className="text-slate-900">₹{Number(goal.target_amount).toLocaleString('en-IN')}</strong></span>
        </div>
        <ProgressBar
          value={goal.current_amount}
          max={goal.target_amount}
          color={isComplete ? 'bg-emerald-500' : 'bg-emerald-600'}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
        <div>
          <span className="text-slate-500 block">Remaining</span>
          <span className="font-bold text-slate-800">
            ₹{Number(goal.remaining_amount).toLocaleString('en-IN')}
          </span>
        </div>
        <div>
          <span className="text-slate-500 block">Required / month</span>
          <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
            ₹{Number(goal.monthly_saving_required).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      <div className="mt-3.5 flex items-center justify-between pt-2">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Calendar size={13} />
          <span>{goal.months_remaining} months left</span>
        </div>
        <div className="flex items-center gap-2">
          {onAddProgress && !isComplete && (
            <button
              onClick={() => onAddProgress(goal)}
              aria-label={`Add savings to ${goal.name}`}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer min-h-[38px]"
            >
              <PlusCircle size={14} /> Add ₹
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(goal.id)}
              aria-label={`Delete goal ${goal.name}`}
              className="text-slate-400 hover:text-rose-600 text-xs px-2 py-1.5 rounded-lg cursor-pointer min-h-[38px] flex items-center"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
