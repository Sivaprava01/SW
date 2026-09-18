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
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1e1b19] rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl border border-amber-100 dark:border-[#3D332B] overflow-hidden animate-in fade-in zoom-in-95 text-[#221a0e] dark:text-[#FFF5EB]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-amber-100 dark:border-[#3D332B] flex items-start justify-between bg-[#fff1e3] dark:bg-[#28211C]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#fffaf5] dark:bg-[#14110F] text-orange-900 dark:text-[#ffb690] border border-orange-200/50 dark:border-[#3D332B]">
                {scheme.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 flex items-center gap-1 border border-emerald-300/40 font-mono">
                <IconMapPin size={12} /> {scheme.state}
              </span>
            </div>
            <h2 className="font-headline text-base sm:text-lg font-black text-[#221a0e] dark:text-[#FFF5EB] leading-tight">
              {scheme.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg transition cursor-pointer"
          >
            <IconX size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs sm:text-sm">
          
          {/* Disclaimer Box */}
          <div className="bg-[#fff1e3] dark:bg-[#28211C] border border-orange-200 dark:border-[#3D332B] rounded-2xl p-3.5 flex gap-2.5 text-orange-950 dark:text-[#ffb690]">
            <IconAlertTriangle size={18} className="shrink-0 text-orange-600 dark:text-[#ffb690] mt-0.5" />
            <p className="text-xs leading-relaxed font-medium">
              <strong>Important Notice:</strong> Sakhi provides a preliminary eligibility match and does not provide official eligibility confirmation. Always verify rules and submit applications through official government channels.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#221a0e] dark:text-[#FFF5EB] mb-1 flex items-center gap-1.5">
              <IconAward size={16} className="text-emerald-600 dark:text-emerald-400" /> What this program provides
            </h4>
            <p className="text-stone-700 dark:text-[#D4C4B5] bg-[#fffaf5] dark:bg-[#14110F] p-3 rounded-2xl border border-stone-100 dark:border-[#3D332B] leading-relaxed font-medium">
              {scheme.what_it_provides}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#221a0e] dark:text-[#FFF5EB] mb-1 flex items-center gap-1.5">
              <IconUsers size={16} className="text-emerald-600 dark:text-emerald-400" /> Target beneficiaries
            </h4>
            <p className="text-stone-600 dark:text-[#D4C4B5] leading-relaxed">
              {scheme.target_users}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#221a0e] dark:text-[#FFF5EB] mb-1 flex items-center gap-1.5">
              <IconCircleCheck size={16} className="text-emerald-600 dark:text-emerald-400" /> Basic Eligibility
            </h4>
            <p className="text-stone-600 dark:text-[#D4C4B5] leading-relaxed">
              {scheme.basic_eligibility}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#221a0e] dark:text-[#FFF5EB] mb-1 flex items-center gap-1.5">
              <IconFileText size={16} className="text-emerald-600 dark:text-emerald-400" /> Documents Needed
            </h4>
            <p className="text-stone-600 dark:text-[#D4C4B5] leading-relaxed bg-[#fffaf5] dark:bg-[#14110F] p-3 rounded-2xl border border-stone-100 dark:border-[#3D332B]">
              {scheme.required_documents}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#221a0e] dark:text-[#FFF5EB] mb-1 flex items-center gap-1.5">
              <IconBuildingCommunity size={16} className="text-emerald-600 dark:text-emerald-400" /> How to Apply
            </h4>
            <p className="text-stone-600 dark:text-[#D4C4B5] leading-relaxed">
              {scheme.application_process}
            </p>
          </div>
        </div>

        {/* Footer with Official Link */}
        <div className="p-4 border-t border-amber-100 dark:border-[#3D332B] bg-[#fff1e3] dark:bg-[#28211C] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-stone-200 dark:bg-[#1e1b19] hover:bg-stone-300 dark:hover:bg-stone-800 text-stone-700 dark:text-[#D4C4B5] font-bold rounded-xl text-xs transition cursor-pointer min-h-[44px]"
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
