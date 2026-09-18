import React from 'react';
import {
  IconX,
  IconExternalLink,
  IconFileText,
  IconCircleCheck,
  IconAlertTriangle,
  IconBuildingCommunity,
  IconMapPin,
  IconUsers,
  IconAward,
} from '@tabler/icons-react';

export default function SchemeDetailsModal({ scheme, onClose }) {
  if (!scheme) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl border border-amber-100 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-amber-100 dark:border-slate-800 flex items-start justify-between bg-stone-50 dark:bg-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#fff1e3] dark:bg-slate-800 text-orange-900 dark:text-orange-300 border border-orange-200/50 dark:border-slate-700">
                {scheme.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 flex items-center gap-1 border border-emerald-300/40">
                <IconMapPin size={12} /> {scheme.state}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100 leading-tight">
              {scheme.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg transition"
          >
            <IconX size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs sm:text-sm">
          
          {/* Disclaimer Box */}
          <div className="bg-[#fff1e3] dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 rounded-2xl p-3.5 flex gap-2.5 text-orange-950 dark:text-orange-200">
            <IconAlertTriangle size={18} className="shrink-0 text-orange-600 dark:text-orange-400 mt-0.5" />
            <p className="text-xs leading-relaxed font-medium">
              <strong>Important Notice:</strong> Sakhi provides a preliminary eligibility match and does not provide official eligibility confirmation. Always verify rules and submit applications through official government channels.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 dark:text-stone-100 mb-1 flex items-center gap-1.5">
              <IconAward size={16} className="text-emerald-600 dark:text-emerald-400" /> What this program provides
            </h4>
            <p className="text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-slate-800 p-3 rounded-2xl border border-stone-100 dark:border-slate-700/60 leading-relaxed font-medium">
              {scheme.what_it_provides}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 dark:text-stone-100 mb-1 flex items-center gap-1.5">
              <IconUsers size={16} className="text-emerald-600 dark:text-emerald-400" /> Target beneficiaries
            </h4>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
              {scheme.target_users}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 dark:text-stone-100 mb-1 flex items-center gap-1.5">
              <IconCircleCheck size={16} className="text-emerald-600 dark:text-emerald-400" /> Basic Eligibility
            </h4>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
              {scheme.basic_eligibility}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 dark:text-stone-100 mb-1 flex items-center gap-1.5">
              <IconFileText size={16} className="text-emerald-600 dark:text-emerald-400" /> Documents Needed
            </h4>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed bg-stone-50 dark:bg-slate-800 p-3 rounded-2xl border border-stone-100 dark:border-slate-700/60">
              {scheme.required_documents}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 dark:text-stone-100 mb-1 flex items-center gap-1.5">
              <IconBuildingCommunity size={16} className="text-emerald-600 dark:text-emerald-400" /> How to Apply
            </h4>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
              {scheme.application_process}
            </p>
          </div>
        </div>

        {/* Footer with Official Link */}
        <div className="p-4 border-t border-amber-100 dark:border-slate-800 bg-stone-50 dark:bg-slate-800/80 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-stone-200 dark:bg-slate-700 hover:bg-stone-300 text-stone-700 dark:text-stone-200 font-bold rounded-xl text-xs transition cursor-pointer min-h-[44px]"
          >
            Close
          </button>

          <a
            href={scheme.official_source}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer min-h-[44px]"
          >
            <span>View official source →</span>
            <IconExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
