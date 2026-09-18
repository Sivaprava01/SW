import React from 'react';
import { X, MapPin, Calendar, Wallet, Target, Users, ShieldCheck, Settings, ArrowRight } from 'lucide-react';
import { useUser } from '../context/UserContext';

export default function ProfileModal({ isOpen, onClose, onOpenSettings }) {
  const { user, financialHealth, t } = useUser();

  if (!isOpen || !user) return null;

  const avatarUrl = typeof window !== 'undefined' ? localStorage.getItem('sakhi_avatar') : null;
  const avatarColor = (typeof window !== 'undefined' ? localStorage.getItem('sakhi_avatar_color') : null) || 'from-emerald-600 to-teal-500';

  const income = financialHealth?.monthly_income ?? user.monthly_income ?? 0;
  const goalName = financialHealth?.primary_goal?.name || user.financial_goal || "Daughter's Education";
  const stageName = financialHealth?.journey?.current_stage_name || "Emergency Shield";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-title"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-linear-to-r from-emerald-800 to-teal-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={user.name}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-white/40 shadow-sm"
              />
            ) : (
              <div className={`w-12 h-12 rounded-2xl bg-linear-to-tr ${avatarColor} flex items-center justify-center text-white font-black text-xl border border-white/20 shadow-sm`}>
                {user.name ? user.name[0] : 'S'}
              </div>
            )}
            <div>
              <h2 id="profile-title" className="text-lg font-black tracking-tight">
                {user.name}
              </h2>
              <div className="flex items-center gap-1 text-xs text-emerald-200">
                <MapPin size={12} />
                <span>{user.state || 'India'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close profile"
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X size={20} />
          </button>
        </div>

        {/* View-Only Profile Summary Details */}
        <div className="p-5 space-y-3.5 text-xs sm:text-sm">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-2xl p-3">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-0.5">
                {t('monthly_income')}
              </span>
              <span className="text-base font-bold text-emerald-700 dark:text-emerald-400">
                ₹{Number(income).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-2xl p-3">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-0.5">
                {t('age')}
              </span>
              <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                {user.age || 28} years
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-2xl p-3">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-0.5">
                {t('state')}
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100 block truncate">
                {user.state || 'Telangana'}
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-2xl p-3">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-0.5">
                SHG Member
              </span>
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                {user.is_shg_member ? t('yes') : t('no')}
              </span>
            </div>
          </div>

          {/* Active Goal & Milestone */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-2xl p-3 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Active Dream & Roadmap
            </span>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
              🎯 {goalName}
            </div>
            <div className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
              🗺️ Current Stage: {stageName}
            </div>
          </div>

          {/* Link / Button to Settings for Editing */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                onClose();
                if (onOpenSettings) onOpenSettings();
              }}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
            >
              <Settings size={15} className="text-emerald-600" />
              <span>Open Settings (☰) to Edit Details</span>
              <ArrowRight size={13} className="text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
