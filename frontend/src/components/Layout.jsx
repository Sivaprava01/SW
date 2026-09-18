import React, { useState } from 'react';
import {
  IconHome,
  IconWallet,
  IconCompass,
  IconTarget,
  IconShieldCheck,
  IconBook,
  IconSparkles,
  IconMenu2,
} from '@tabler/icons-react';
import { useUser } from '../context/UserContext';
import { FloatingDock } from '@/components/ui/floating-dock';
import ProfileModal from './ProfileModal';
import SettingsDrawer from './SettingsDrawer';

export default function Layout({ activeTab, setActiveTab, onOpenAskSakhi, children }) {
  const { user, loadDemoUser, t } = useUser();
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Avatar state
  const avatarUrl = typeof window !== 'undefined' ? localStorage.getItem('sakhi_avatar') : null;
  const avatarColor = (typeof window !== 'undefined' ? localStorage.getItem('sakhi_avatar_color') : null) || 'from-emerald-600 to-teal-500';

  const dockItems = [
    {
      title: t('nav_home') || 'Home',
      icon: <IconHome className="h-full w-full stroke-[2.2]" />,
      onClick: () => setActiveTab('home'),
      isActive: activeTab === 'home',
    },
    {
      title: t('nav_money') || 'My Money',
      icon: <IconWallet className="h-full w-full stroke-[2.2]" />,
      onClick: () => setActiveTab('money'),
      isActive: activeTab === 'money',
    },
    {
      title: t('nav_journey') || 'Journey',
      icon: <IconCompass className="h-full w-full stroke-[2.2]" />,
      onClick: () => setActiveTab('journey'),
      isActive: activeTab === 'journey',
    },
    {
      title: t('nav_goals') || 'Goals',
      icon: <IconTarget className="h-full w-full stroke-[2.2]" />,
      onClick: () => setActiveTab('goals'),
      isActive: activeTab === 'goals',
    },
    {
      title: t('nav_benefits') || 'Benefits',
      icon: <IconShieldCheck className="h-full w-full stroke-[2.2]" />,
      onClick: () => setActiveTab('benefits'),
      isActive: activeTab === 'benefits',
    },
    {
      title: t('nav_learn') || 'Learn',
      icon: <IconBook className="h-full w-full stroke-[2.2]" />,
      onClick: () => setActiveTab('learn'),
      isActive: activeTab === 'learn',
    },
    {
      title: t('nav_ask') || 'Ask Sakhi',
      icon: <IconSparkles className="h-full w-full stroke-[2.2] text-amber-500" />,
      onClick: onOpenAskSakhi,
      isActive: false,
    },
  ];

  return (
    <div className="app-container">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
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
              <IconSparkles size={16} />
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
              <IconMenu2 size={20} />
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-28 px-4 pt-4 overflow-y-auto">
        {children}
      </main>

      {/* Aceternity UI Floating Dock Navbar */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[480px] w-full px-4 flex justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <FloatingDock
            items={dockItems}
            desktopClassName="shadow-2xl border-slate-200/90 dark:border-slate-800/90"
            mobileClassName="shadow-2xl"
          />
        </div>
      </div>

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
