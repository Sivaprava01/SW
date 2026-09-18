import React from 'react';
import {
  IconX,
  IconMapPin,
  IconCalendar,
  IconWallet,
  IconTarget,
  IconUsers,
  IconShieldCheck,
  IconSettings,
  IconArrowRight,
} from '@tabler/icons-react';
import { useUser } from '../context/UserContext';

export default function ProfileModal({ isOpen, onClose, onOpenSettings }) {
  const { user, financialHealth, t } = useUser();

  if (!isOpen || !user) return null;

  const avatarUrl = typeof window !== 'undefined' ? localStorage.getItem('sakhi_avatar') : null;
  const avatarColor = (typeof window !== 'undefined' ? localStorage.getItem('sakhi_avatar_color') : null) || 'from-orange-500 to-amber-400';

  const income = financialHealth?.monthly_income ?? user.monthly_income ?? 0;
  const goalName = financialHealth?.primary_goal?.name || user.financial_goal || "Daughter's Education";
  const stageName = financialHealth?.journey?.current_stage_name || "Emergency Shield";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-title"
      className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-amber-100 dark:border-slate-800 animate-in zoom-in-95">
        
        {/* Header (Stitch Warm Gradient) */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={user.name}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-white/40 shadow-sm"
              />
            ) : (
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${avatarColor} flex items-center justify-center text-white font-black text-xl border border-white/20 shadow-sm`}>
                {user.name ? user.name[0] : 'स'}
              </div>
            )}
            <div>
              <h2 id="profile-title" className="text-lg font-black tracking-tight">
                {user.name}
              </h2>
              <div className="flex items-center gap-1 text-xs text-orange-100">
                <IconMapPin size={13} />
                <span>{user.state || 'India'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close profile"
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <IconX size={20} />
          </button>
        </div>

        {/* View-Only Profile Summary Details (Stitch 2x2 Layout) */}
        <div className="p-5 space-y-3.5 text-xs sm:text-sm bg-[#fffaf5]/50 dark:bg-slate-900">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white dark:bg-slate-800/80 border border-amber-100 dark:border-slate-800 rounded-2xl p-3 shadow-2xs">
              <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block mb-0.5">
                {t('monthly_income') || 'Monthly Income'}
              </span>
              <span className="text-base font-black text-orange-600 dark:text-orange-400">
                ₹{Number(income).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-800/80 border border-amber-100 dark:border-slate-800 rounded-2xl p-3 shadow-2xs">
              <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block mb-0.5">
                {t('age') || 'Age'}
              </span>
              <span className="text-base font-black text-stone-900 dark:text-stone-100">
                {user.age || 28} years
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white dark:bg-slate-800/80 border border-amber-100 dark:border-slate-800 rounded-2xl p-3 shadow-2xs">
              <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block mb-0.5">
                {t('state') || 'State'}
              </span>
              <span className="text-sm font-bold text-stone-900 dark:text-stone-100 block truncate">
                {user.state || 'Telangana'}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-800/80 border border-amber-100 dark:border-slate-800 rounded-2xl p-3 shadow-2xs">
              <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block mb-0.5">
                SHG Member
              </span>
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                {user.is_shg_member ? (t('yes') || 'Yes') : (t('no') || 'No')}
              </span>
            </div>
          </div>

          {/* Active Goal & Milestone */}
          <div className="bg-white dark:bg-slate-800/80 border border-amber-100 dark:border-slate-800 rounded-2xl p-3 space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
              Active Dream & Roadmap
            </span>
            <div className="text-sm font-bold text-stone-900 dark:text-stone-100">
              🎯 {goalName}
            </div>
            <div className="text-xs text-orange-700 dark:text-orange-400 font-semibold">
              🗺️ Current Stage: {stageName}
            </div>
          </div>

          {/* Link / Button to Settings for Editing */}
          <div className="pt-2 border-t border-amber-100 dark:border-slate-800">
            <button
              onClick={() => {
                onClose();
                if (onOpenSettings) onOpenSettings();
              }}
              className="w-full py-2.5 bg-[#fff1e3] hover:bg-orange-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-orange-950 dark:text-orange-200 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] border border-orange-200/60 dark:border-slate-700 active:scale-95"
            >
              <IconSettings size={16} className="text-orange-600 dark:text-orange-400" />
              <span>Open Settings (☰) to Edit Details</span>
              <IconArrowRight size={14} className="text-stone-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
