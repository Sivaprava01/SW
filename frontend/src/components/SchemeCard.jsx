import React from 'react';
import {
  IconCircleCheck,
  IconChevronRight,
  IconShieldCheck,
  IconMapPin,
} from '@tabler/icons-react';

export default function SchemeCard({ scheme, matchScore, matchReasons, onViewDetails }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:border-orange-300 dark:hover:border-slate-700 hover:shadow-sm transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#fff1e3] dark:bg-slate-800 text-orange-900 dark:text-orange-300 border border-orange-200/50 dark:border-slate-700">
              {scheme.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-slate-700 flex items-center gap-1">
              <IconMapPin size={11} /> {scheme.state}
            </span>
          </div>

          {matchScore && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40">
              <IconCircleCheck size={12} /> {matchScore}% Match
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 leading-snug mb-1.5">
          {scheme.name}
        </h3>

        <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed mb-3">
          {scheme.description}
        </p>

        <div className="bg-stone-50 dark:bg-slate-800/80 rounded-xl p-2.5 mb-3 border border-amber-50 dark:border-slate-700/60">
          <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block mb-0.5">
            What It Provides:
          </span>
          <p className="text-xs text-stone-800 dark:text-stone-200 font-medium line-clamp-2">
            {scheme.what_it_provides}
          </p>
        </div>

        {matchReasons && matchReasons.length > 0 && (
          <div className="mb-3">
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
              Why you match:
            </span>
            <ul className="text-xs text-stone-600 dark:text-stone-400 space-y-0.5 pl-3 list-disc">
              {matchReasons.slice(0, 2).map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-amber-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-[11px] text-stone-400 dark:text-stone-500">
          Preliminary guidance
        </span>
        <button
          onClick={() => onViewDetails(scheme)}
          aria-label={`View details and official source for ${scheme.name}`}
          className="px-3.5 py-2 bg-orange-50 dark:bg-orange-950/60 hover:bg-orange-100 dark:hover:bg-orange-900/80 text-orange-800 dark:text-orange-300 font-bold rounded-xl text-xs transition flex items-center gap-1 cursor-pointer min-h-[40px] border border-orange-200/50 dark:border-orange-800/40 active:scale-95"
        >
          <span>Details & Source</span>
          <IconChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
