import React from 'react';
import {
  IconCircleCheck,
  IconChevronRight,
  IconShieldCheck,
  IconMapPin,
} from '@tabler/icons-react';

export default function SchemeCard({ scheme, matchScore, matchReasons, onViewDetails }) {
  return (
    <div className="bg-white dark:bg-[#1e1b19] border border-amber-100 dark:border-[#3D332B] rounded-2xl p-4 shadow-xs hover:border-orange-300 dark:hover:border-stone-700 hover:shadow-sm transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#fff1e3] dark:bg-[#28211C] text-orange-900 dark:text-[#ffb690] border border-orange-200/50 dark:border-[#3D332B]">
              {scheme.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#fffaf5] dark:bg-[#28211C] text-stone-700 dark:text-[#D4C4B5] border border-stone-200 dark:border-[#3D332B] flex items-center gap-1 font-mono">
              <IconMapPin size={11} /> {scheme.state}
            </span>
          </div>

          {matchScore && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-[#28211C] text-emerald-800 dark:text-emerald-300 border border-emerald-300/40 dark:border-[#3D332B] font-mono">
              <IconCircleCheck size={12} /> {matchScore}% Match
            </span>
          )}
        </div>

        <h3 className="font-headline text-base font-bold text-[#221a0e] dark:text-[#FFF5EB] leading-snug mb-1.5">
          {scheme.name}
        </h3>

        <p className="text-xs text-stone-600 dark:text-[#D4C4B5] line-clamp-2 leading-relaxed mb-3">
          {scheme.description}
        </p>

        <div className="bg-[#fffaf5] dark:bg-[#14110F] rounded-xl p-2.5 mb-3 border border-amber-50 dark:border-[#3D332B]">
          <span className="text-[10px] font-bold text-stone-500 dark:text-[#A8988A] uppercase tracking-wider block mb-0.5">
            What It Provides:
          </span>
          <p className="text-xs text-[#221a0e] dark:text-[#FFF5EB] font-medium line-clamp-2">
            {scheme.what_it_provides}
          </p>
        </div>

        {matchReasons && matchReasons.length > 0 && (
          <div className="mb-3">
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
              Why you match:
            </span>
            <ul className="text-xs text-stone-600 dark:text-[#D4C4B5] space-y-0.5 pl-3 list-disc">
              {matchReasons.slice(0, 2).map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-amber-100 dark:border-[#3D332B] flex items-center justify-between">
        <span className="text-[11px] text-stone-400 dark:text-[#A8988A]">
          Preliminary guidance
        </span>
        <button
          onClick={() => onViewDetails(scheme)}
          aria-label={`View details and official source for ${scheme.name}`}
          className="px-3.5 py-2 bg-orange-50 dark:bg-[#28211C] hover:bg-orange-100 dark:hover:bg-stone-800 text-orange-800 dark:text-[#ffb690] font-bold rounded-xl text-xs transition flex items-center gap-1 cursor-pointer min-h-[40px] border border-orange-200/50 dark:border-[#3D332B] active:scale-95"
        >
          <span>Details & Source</span>
          <IconChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
