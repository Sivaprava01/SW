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
  IconMapPin,
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
  const avatarColor = (typeof window !== 'undefined' ? localStorage.getItem('sakhi_avatar_color') : null) || 'from-orange-500 to-amber-500';

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
      icon: <IconSparkles className="h-full w-full stroke-[2.2] text-orange-500" />,
      onClick: onOpenAskSakhi,
      isActive: false,
    },
  ];

  return (
    <div className="app-container bg-[#fffaf5] dark:bg-[#14110F] text-[#221a0e] dark:text-[#FFF5EB]">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#fff8f3]/95 dark:bg-[#14110F]/95 backdrop-blur-md border-b border-amber-200/70 dark:border-[#28211C] px-4 py-3 flex items-center justify-between">
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
              className="w-9 h-9 rounded-2xl object-cover border border-orange-400 shadow-xs group-hover:scale-105 transition"
            />
          ) : (
            <div className={`w-9 h-9 rounded-2xl bg-gradient-to-tr ${avatarColor} flex items-center justify-center text-white font-black text-lg shadow-xs group-hover:scale-105 transition border border-white/30 dark:border-stone-800`}>
              {user?.name ? user.name[0] : 'स'}
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-[#221a0e] dark:text-[#FFF5EB] group-hover:text-orange-600 dark:group-hover:text-[#ffb690] transition">
                {user ? `${t('greeting_namaste')}, ${user.name} 👋` : 'Sakhi (సఖీ)'}
              </span>
            </div>
            <p className="text-[11px] font-semibold text-stone-500 dark:text-[#A8988A] flex items-center gap-1">
              <IconMapPin size={11} className="text-orange-600 dark:text-[#ffb690]" />
              <span>{user?.state || t('tagline')}</span>
            </p>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {!user && (
            <button
              onClick={loadDemoUser}
              className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer min-h-[38px]"
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
              className="p-2 text-stone-700 dark:text-[#D4C4B5] hover:text-orange-600 dark:hover:text-[#ffb690] bg-[#fff1e3] dark:bg-[#1e1b19] hover:bg-amber-100 dark:hover:bg-[#28211C] rounded-xl transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center border border-amber-200/70 dark:border-[#3D332B] shadow-xs"
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
      <div className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-auto max-w-[calc(100vw-1rem)] px-1 sm:px-4 flex justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <FloatingDock
            items={dockItems}
            desktopClassName="shadow-2xl border-amber-200/80 dark:border-[#3D332B] bg-[#fff8f3]/90 dark:bg-[#14110F]/90"
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
