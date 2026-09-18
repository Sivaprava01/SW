import React from 'react';
import {
  IconX,
  IconMapPin,
  IconWallet,
  IconTarget,
  IconUsers,
  IconSettings,
  IconArrowRight,
  IconLock,
  IconCheck,
  IconTrendingUp,
} from '@tabler/icons-react';
import { useUser } from '../context/UserContext';

export default function ProfileModal({ isOpen, onClose, onOpenSettings }) {
  const { user, financialHealth, t } = useUser();

  if (!isOpen || !user) return null;

  const avatarUrl = typeof window !== 'undefined' ? localStorage.getItem('sakhi_avatar') : null;
  const avatarColor = (typeof window !== 'undefined' ? localStorage.getItem('sakhi_avatar_color') : null) || 'from-orange-500 to-amber-400';

  const income = financialHealth?.monthly_income ?? user.monthly_income ?? 18500;
  const surplus = financialHealth?.monthly_surplus ?? Math.round(income * 0.35);
  const goalName = financialHealth?.primary_goal?.name || user.financial_goal || "Daughter's College";
  const goalTarget = financialHealth?.primary_goal?.target_amount || 50000;
  const goalSaved = financialHealth?.primary_goal?.current_amount || 18000;
  const goalPercent = Math.min(100, Math.round((goalSaved / (goalTarget || 1)) * 100));
  const stageName = financialHealth?.journey?.current_stage_name || "Emergency Shield";
  const stageIndex = financialHealth?.journey?.current_stage || 2;
  const stagePercent = Math.round((stageIndex / 7) * 100);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-title"
      className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in"
    >
      <div className="bg-[#fff8f3] dark:bg-[#14110F] text-[#221a0e] dark:text-[#FFF5EB] rounded-3xl w-full max-w-sm sm:max-w-md max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-amber-200/70 dark:border-[#3D332B] animate-in zoom-in-95">
        
        {/* Top Header */}
        <div className="bg-[#fff1e3] dark:bg-[#1e1b19] px-4 py-3 flex items-center justify-between border-b border-amber-200/70 dark:border-[#28211C]">
          <h3 className="font-black text-sm text-[#221a0e] dark:text-[#FFF5EB] tracking-tight">
            User Profile
          </h3>

          <button
            onClick={onClose}
            aria-label="Close Profile Modal"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-[#28211C] dark:hover:bg-[#383431] text-stone-600 dark:text-[#D4C4B5] transition-all cursor-pointer"
            type="button"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#fffaf5]/50 dark:bg-[#14110F] text-xs sm:text-sm">
          
          {/* Centered Profile Header Section */}
          <div className="flex flex-col items-center text-center pt-1 pb-1">
            <div className="relative mb-2">
              <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full p-1 bg-gradient-to-tr from-orange-500 to-amber-400 shadow-md flex items-center justify-center">
                <div className="w-full h-full rounded-full overflow-hidden relative bg-stone-100 dark:bg-[#1e1b19] flex items-center justify-center">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      className="w-full h-full object-cover"
                      alt="Portrait of smiling Indian woman"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDQe0yHWlOXmQq75tOb-RKKq-RpsFHeNaiAx7R6oV_lHcUWZk_Bp-zceyzkmI3D26dX-kTcEr0fbYQbw6GAvvMASGXWzkrN9mLjmH_dpuVsftRwa9OHQREyBhtBURKjYmMhz6pMt4kHhlcqStizd7p7T9mzwdsjgKDN7oyykUWlvMCUKIyZO6ZbpcP-eLRxAOip586OhxBpD6bXbS3JVAWi8Z4IAGFHVKR-7XEed4i7drIjoSgpStcuA"
                    />
                  )}
                </div>
              </div>
              {/* Verified Badge */}
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center shadow-md ring-3 ring-[#fff8f3] dark:ring-[#14110F] text-white">
                <IconCheck size={15} strokeWidth={3} />
              </div>
            </div>

            <h2 id="profile-title" className="text-base sm:text-lg font-black text-[#221a0e] dark:text-[#FFF5EB] tracking-tight">
              {user.name || 'Lakshmi Devi'}
            </h2>
            <p className="text-[11px] text-stone-500 dark:text-[#A8988A] mt-0.5 max-w-[280px]">
              Tailoring & Micro-Retail • Rural Village, {user.state || 'Telangana'}
            </p>

            {user.is_shg_member && (
              <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#fff1e3] dark:bg-[#28211C] text-orange-900 dark:text-[#ffb690] border border-orange-200/60 dark:border-[#3D332B]">
                <IconUsers size={14} className="text-orange-600 dark:text-[#ffb690]" />
                <span className="text-[11px] font-bold">
                  Active SHG Member
                </span>
              </div>
            )}
          </div>

          {/* Card 1: Declared Monthly Income */}
          <div className="w-full bg-white dark:bg-[#1e1b19] rounded-2xl p-3.5 border border-amber-100 dark:border-[#3D332B] shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-stone-500 dark:text-[#A8988A]">
                <IconWallet size={16} className="text-orange-600 dark:text-[#ffb690]" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Declared Monthly Income</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-[#28211C] text-stone-600 dark:text-[#D4C4B5] font-bold text-[10px] border border-stone-200/60 dark:border-[#3D332B]">
                Audited
              </span>
            </div>
            <div className="flex items-baseline justify-between pt-0.5">
              <span className="text-lg font-black text-orange-600 dark:text-[#ffb690] tracking-tight">
                ₹{Number(income).toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] font-bold bg-[#fff1e3] dark:bg-[#28211C] px-2.5 py-1 rounded-lg text-orange-950 dark:text-[#FFF5EB] border border-amber-200/50 dark:border-[#3D332B]">
                Tailoring & Shop Sales
              </span>
            </div>
          </div>

          {/* Card 2: Age & Residence */}
          <div className="w-full bg-white dark:bg-[#1e1b19] rounded-2xl p-3.5 border border-amber-100 dark:border-[#3D332B] shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-[#28211C] flex items-center justify-center text-orange-700 dark:text-[#ffb690] shrink-0">
                <IconMapPin size={18} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold text-stone-400 dark:text-[#A8988A] uppercase">Age & Residence</span>
                <span className="text-xs font-bold text-[#221a0e] dark:text-[#FFF5EB] truncate">
                  {user.age || 28} years • Rural Village, {user.state || 'Telangana'}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-stone-100 dark:bg-[#28211C] px-2 py-0.5 rounded text-stone-600 dark:text-[#D4C4B5] border border-stone-200/60 dark:border-[#3D332B]">
              Zone 4
            </span>
          </div>

          {/* Card 3: Financial Health State */}
          <div className="w-full bg-white dark:bg-[#1e1b19] rounded-2xl p-3.5 border border-amber-100 dark:border-[#3D332B] shadow-2xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-stone-500 dark:text-[#A8988A]">
              <IconTrendingUp size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Calculated Monthly Surplus</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-base font-black text-emerald-700 dark:text-emerald-400">
                  ₹{Number(surplus).toLocaleString('en-IN')} <span className="text-xs font-normal text-stone-400">/ month</span>
                </span>
                <p className="text-[10px] text-stone-500 dark:text-[#A8988A] font-medium">
                  Safe liquidity to allocate
                </p>
              </div>

              {/* Inline Radial Visual */}
              <div className="flex flex-col items-end">
                <div className="w-10 h-10 relative flex items-center justify-center">
                  <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-stone-200 dark:text-[#28211C]"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    />
                    <path
                      className="text-emerald-600 dark:text-emerald-400"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="72, 100"
                      strokeLinecap="round"
                      strokeWidth="3.5"
                    />
                  </svg>
                  <span className="absolute text-[10px] font-black text-[#221a0e] dark:text-[#FFF5EB]">72%</span>
                </div>
                <span className="text-[9px] text-stone-400 dark:text-[#A8988A] font-bold mt-0.5">Health Score</span>
              </div>
            </div>
          </div>

          {/* Card 4: Current Goal & Stage */}
          <div className="w-full bg-white dark:bg-[#1e1b19] rounded-2xl p-3.5 border border-amber-100 dark:border-[#3D332B] shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-stone-500 dark:text-[#A8988A]">
                <IconTarget size={16} className="text-orange-600 dark:text-[#ffb690]" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Current Goal & Stage</span>
              </div>
              <span className="text-xs font-black text-orange-600 dark:text-[#ffb690]">
                {goalPercent}% Funded
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#221a0e] dark:text-[#FFF5EB]">
                  🎯 {goalName}
                </span>
                <span className="font-bold text-stone-500 dark:text-[#A8988A] text-[11px]">
                  ₹{Number(goalSaved).toLocaleString('en-IN')} / ₹{Number(goalTarget).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="w-full h-2 bg-stone-100 dark:bg-[#100e0c] rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${goalPercent}%` }}
                />
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between bg-[#fff1e3]/60 dark:bg-[#28211C] p-2 rounded-xl border border-amber-200/50 dark:border-[#3D332B]">
              <span className="text-[11px] font-bold text-stone-800 dark:text-[#FFF5EB]">
                🗺️ Stage {stageIndex}: {stageName}
              </span>
              <span className="text-[10px] font-bold text-orange-700 dark:text-[#ffb690] bg-white dark:bg-[#1e1b19] px-2 py-0.5 rounded shadow-2xs border border-amber-100 dark:border-[#3D332B]">
                {stagePercent}% Complete
              </span>
            </div>
          </div>

          {/* Bottom Settings Redirection CTA */}
          <div className="pt-1 space-y-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenSettings) onOpenSettings();
              }}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md active:scale-95 cursor-pointer min-h-[46px]"
            >
              <IconSettings size={16} />
              <span>Open Settings to Edit Details</span>
              <IconArrowRight size={16} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
