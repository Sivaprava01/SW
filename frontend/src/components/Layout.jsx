import React, { useState } from 'react';
import { Home, Wallet, Compass, Target, Shield, BookOpen, Bot, Sparkles, Menu, User as UserIcon } from 'lucide-react';
import { useUser } from '../context/UserContext';
import ProfileModal from './ProfileModal';
import SettingsDrawer from './SettingsDrawer';

export default function Layout({ activeTab, setActiveTab, onOpenAskSakhi, children }) {
  const { user, loadDemoUser, t } = useUser();
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Avatar state
  const avatarUrl = typeof window !== 'undefined' ? localStorage.getItem('sakhi_avatar') : null;
  const avatarColor = (typeof window !== 'undefined' ? localStorage.getItem('sakhi_avatar_color') : null) || 'from-emerald-600 to-teal-500';

  const navItems = [
    { id: 'home', label: t('nav_home'), icon: Home },
    { id: 'money', label: t('nav_money'), icon: Wallet },
    { id: 'journey', label: t('nav_journey'), icon: Compass },
    { id: 'goals', label: t('nav_goals'), icon: Target },
    { id: 'benefits', label: t('nav_benefits'), icon: Shield },
    { id: 'learn', label: t('nav_learn'), icon: BookOpen },
  ];

  return (
    <div className="app-container">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
        {/* User clickable profile target (VIEW-ONLY PROFILE) */}
        <button
          onClick={() => (user ? setShowProfile(true) : null)}
          className="flex items-center gap-2.5 text-left group cursor-pointer"
          aria-label={user ? `View ${user.name}'s profile` : 'Sakhi Home'}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={user?.name || 'User'}
              className="w-9 h-9 rounded-2xl object-cover border border-emerald-400 shadow-xs group-hover:scale-105 transition"
            />
          ) : (
            <div className={`w-9 h-9 rounded-2xl bg-linear-to-tr ${avatarColor} flex items-center justify-center text-white font-black text-lg shadow-xs group-hover:scale-105 transition`}>
              {user?.name ? user.name[0] : 'स'}
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition">
                {user ? `${t('greeting_namaste')}, ${user.name} 👋` : 'Sakhi (सखी)'}
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <span>{user?.state || t('tagline')}</span>
            </p>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {!user && (
            <button
              onClick={loadDemoUser}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black transition flex items-center gap-1 shadow-xs cursor-pointer min-h-[38px]"
            >
              <Sparkles size={14} />
              <span>Demo (Lakshmi)</span>
            </button>
          )}

          {user && (
            <button
              onClick={() => setShowSettings(true)}
              title={t('settings')}
              aria-label="Open Settings and Edit Information"
              className="p-2 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-2xs"
            >
              <Menu size={20} />
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-24 px-4 pt-4 overflow-y-auto">
        {children}
      </main>

      {/* Floating Ask Sakhi button on mobile (for tabs other than Home) */}
      {user && activeTab !== 'home' && (
        <button
          onClick={onOpenAskSakhi}
          aria-label={t('nav_ask')}
          className="fixed bottom-20 right-4 sm:right-[max(1rem,calc(50%-220px))] z-40 px-3.5 py-2.5 bg-linear-to-r from-emerald-600 to-teal-700 text-white font-bold rounded-2xl shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all border border-emerald-400/40 cursor-pointer min-h-[44px]"
        >
          <Bot size={18} className="text-amber-300" />
          <span className="text-xs">{t('nav_ask')}</span>
        </button>
      )}

      {/* Bottom Navigation with Accessible Active State Highlight */}
      <nav
        aria-label="Main Navigation"
        className="fixed bottom-0 left-0 right-0 sm:max-w-[480px] sm:mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-40 px-2 py-1.5 flex justify-around items-center"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition cursor-pointer min-h-[48px] relative ${
                isActive
                  ? 'text-emerald-800 dark:text-emerald-300 font-black bg-emerald-50/80 dark:bg-emerald-950/60 shadow-2xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
              }`}
            >
              <Icon size={20} className={isActive ? 'stroke-[2.5] text-emerald-700 dark:text-emerald-400' : 'stroke-2'} />
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-0.5 shadow-xs" />
              )}
            </button>
          );
        })}
      </nav>

      {/* View-Only Profile Modal */}
      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* Edit & App Settings Drawer */}
      <SettingsDrawer
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}


