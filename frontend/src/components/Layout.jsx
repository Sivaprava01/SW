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
      {/* Condensed Top Header */}
      <header className="sticky top-0 z-30 bg-[#fff8f3]/85 dark:bg-[#14110F]/85 backdrop-blur-xl border-b border-amber-200/60 dark:border-[#28211C] px-3.5 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between transition-all">
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
              className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-2xl object-cover border border-orange-400 shadow-xs group-hover:scale-105 transition"
            />
          ) : (
            <div className={`w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-2xl bg-gradient-to-tr ${avatarColor} flex items-center justify-center text-white font-black text-base sm:text-lg shadow-xs group-hover:scale-105 transition border border-white/30 dark:border-stone-800`}>
              {user?.name ? user.name[0] : 'స'}
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm sm:text-base tracking-tight text-[#221a0e] dark:text-[#FFF5EB] group-hover:text-orange-600 dark:group-hover:text-[#ffb690] transition">
                {user ? `${t('greeting_namaste')}, ${user.name}` : 'Sakhi'}
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] font-semibold text-stone-500 dark:text-[#A8988A] flex items-center gap-1 leading-tight">
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
              className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer min-h-[36px]"
            >
              <IconSparkles size={16} />
              <span>Explore Preview</span>
            </button>
          )}

          {user && (
            <button
              onClick={() => setShowSettings(true)}
              title={t('settings')}
              aria-label="Open Settings and Edit Information"
              className="p-2 text-stone-700 dark:text-[#D4C4B5] hover:text-orange-600 dark:hover:text-[#ffb690] bg-[#fff1e3]/80 dark:bg-[#1e1b19]/80 hover:bg-amber-100 dark:hover:bg-[#28211C] rounded-xl transition cursor-pointer min-h-[38px] min-w-[38px] sm:min-h-[42px] sm:min-w-[42px] flex items-center justify-center border border-amber-200/60 dark:border-[#3D332B] shadow-xs"
            >
              <IconMenu2 size={18} />
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area with Safe-Area Bottom Inset */}
      <main className="flex-1 pb-36 sm:pb-40 px-3.5 sm:px-4 pt-3.5 overflow-y-auto min-h-0">
        {children}
      </main>

      {/* Aceternity UI Floating Dock Navbar (Glassmorphism & Safe Inset) */}
      <div className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 w-auto max-w-[calc(100vw-0.75rem)] px-1 sm:px-2 flex justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <FloatingDock
            items={dockItems}
            desktopClassName="shadow-2xl border-amber-200/70 dark:border-[#3D332B]/80 bg-[#fff8f3]/80 dark:bg-[#14110F]/80 backdrop-blur-xl"
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
