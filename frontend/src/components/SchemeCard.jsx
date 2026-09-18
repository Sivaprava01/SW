import React from 'react';
import { ExternalLink, CheckCircle2, ChevronRight, ShieldCheck } from 'lucide-react';

export default function SchemeCard({ scheme, matchScore, matchReasons, onViewDetails }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900">
              {scheme.category}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
              {scheme.state}
            </span>
          </div>

          {matchScore && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
              <CheckCircle2 size={12} /> {matchScore}% Match
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-slate-900 leading-snug mb-1.5">
          {scheme.name}
        </h3>

        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
          {scheme.description}
        </p>

        <div className="bg-slate-50 rounded-xl p-2.5 mb-3 border border-slate-100">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
            What It Provides:
          </span>
          <p className="text-xs text-slate-800 font-medium line-clamp-2">
            {scheme.what_it_provides}
          </p>
        </div>

        {matchReasons && matchReasons.length > 0 && (
          <div className="mb-3">
            <span className="text-[11px] font-bold text-emerald-700 block mb-1">
              Why you match:
            </span>
            <ul className="text-xs text-slate-600 space-y-0.5 pl-3 list-disc">
              {matchReasons.slice(0, 2).map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          Preliminary guidance
        </span>
        <button
          onClick={() => onViewDetails(scheme)}
          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg text-xs transition flex items-center gap-1"
        >
          <span>Details & Source</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
