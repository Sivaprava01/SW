import React from 'react';
import {
  IconTarget,
  IconCalendar,
  IconCircleCheck,
  IconPlus,
  IconSparkles,
} from '@tabler/icons-react';
import ProgressBar from './ProgressBar';

export default function GoalCard({ goal, onAddProgress, onDelete }) {
  const isComplete = goal.current_amount >= goal.target_amount;

  return (
    <div className="bg-white dark:bg-[#1e1b19] border border-amber-100 dark:border-[#3D332B] rounded-2xl p-4 shadow-xs hover:border-orange-300 dark:hover:border-stone-700 transition-all">
      {/* Category Pill & Title */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#fff1e3] dark:bg-[#28211C] text-orange-800 dark:text-[#ffb690] mb-1 border border-orange-200/50 dark:border-[#3D332B]">
            {goal.category || 'Goal'}
          </span>
          <h3 className="font-headline text-base font-bold text-[#221a0e] dark:text-[#FFF5EB]">{goal.name}</h3>
        </div>
        {isComplete ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-[#28211C] px-2.5 py-1 rounded-full border border-emerald-300/40 dark:border-[#3D332B]">
            <IconCircleCheck size={14} /> Completed!
          </span>
        ) : (
          <span className="text-[11px] font-bold text-stone-600 dark:text-[#D4C4B5] bg-[#fffaf5] dark:bg-[#28211C] px-2.5 py-1 rounded-full border border-stone-200 dark:border-[#3D332B] font-mono">
            {goal.percent_complete}% Done
          </span>
        )}
      </div>

      {/* Progress Track */}
      <div className="mb-3">
        <div className="flex justify-between items-baseline text-xs mb-1.5 font-medium font-mono">
          <span className="text-stone-500 dark:text-[#A8988A]">
            Saved: <strong className="text-[#221a0e] dark:text-[#FFF5EB]">₹{Number(goal.current_amount).toLocaleString('en-IN')}</strong>
          </span>
          <span className="text-stone-500 dark:text-[#A8988A]">
            Target: <strong className="text-[#221a0e] dark:text-[#FFF5EB]">₹{Number(goal.target_amount).toLocaleString('en-IN')}</strong>
          </span>
        </div>
        <ProgressBar
          value={goal.current_amount}
          max={goal.target_amount}
          color={isComplete ? 'bg-emerald-500' : 'bg-orange-500 dark:bg-[#ffb690]'}
        />
      </div>

      {/* Split Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-amber-100 dark:border-[#3D332B] text-xs">
        <div>
          <span className="text-stone-400 dark:text-[#A8988A] text-[11px] block">Remaining</span>
          <span className="font-headline font-bold text-[#221a0e] dark:text-[#FFF5EB]">
            ₹{Number(goal.remaining_amount).toLocaleString('en-IN')}
          </span>
        </div>
        <div>
          <span className="text-stone-400 dark:text-[#A8988A] text-[11px] block">Required / month</span>
          <span className="font-headline font-bold text-orange-700 dark:text-[#ffb690] bg-[#fff1e3] dark:bg-[#28211C] px-2 py-0.5 rounded-md inline-block">
            ₹{Number(goal.monthly_saving_required).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="mt-3.5 flex items-center justify-between pt-2">
        <div className="flex items-center gap-1 text-xs text-stone-500 dark:text-[#A8988A] font-medium font-mono">
          <IconCalendar size={14} />
          <span>{goal.months_remaining} months left</span>
        </div>
        <div className="flex items-center gap-2">
          {onAddProgress && !isComplete && (
            <button
              onClick={() => onAddProgress(goal)}
              aria-label={`Add savings to ${goal.name}`}
              className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer min-h-[38px] active:scale-95"
            >
              <IconPlus size={14} /> Add ₹
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(goal.id)}
              aria-label={`Delete goal ${goal.name}`}
              className="text-stone-400 dark:text-[#A8988A] hover:text-rose-600 dark:hover:text-rose-400 text-xs px-2 py-1.5 rounded-lg cursor-pointer min-h-[38px] flex items-center"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
