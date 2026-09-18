import React, { useState, useEffect } from 'react';
import {
  IconX,
  IconUser,
  IconMapPin,
  IconCalendar,
  IconWallet,
  IconWorld,
  IconLogout,
  IconCheck,
  IconCamera,
  IconSparkles,
  IconShield,
  IconEdit,
  IconDeviceFloppy,
  IconCircleCheck,
  IconSun,
  IconMoon,
  IconCompass,
  IconPlayerPlay,
  IconVolume,
  IconPhone,
  IconLock,
  IconChecklist,
  IconLanguage,
  IconHelpCircle,
} from '@tabler/icons-react';
import { useUser } from '../context/UserContext';
import { api } from '../services/api';

const LANGUAGES = [
  { code: 'en', symbol: 'A', name: 'English', native: 'English' },
  { code: 'hi', symbol: 'हिन्दी', name: 'Hindi', native: 'हिन्दी' },
  { code: 'te', symbol: 'తెలుగు', name: 'Telugu', native: 'తెలుగు' },
];

const STATES = [
  'Telangana',
  'Andhra Pradesh',
  'Maharashtra',
  'Karnataka',
  'Tamil Nadu',
  'Uttar Pradesh',
  'Bihar',
  'Rajasthan',
  'Madhya Pradesh',
  'West Bengal',
  'Other / Central'
];

const AVATAR_PALETTES = [
  { id: 'primary', bg: 'bg-orange-600', gradient: 'from-orange-500 to-amber-400', ring: 'ring-orange-500' },
  { id: 'secondary', bg: 'bg-rose-700', gradient: 'from-rose-600 to-pink-500', ring: 'ring-rose-500' },
  { id: 'tertiary', bg: 'bg-amber-700', gradient: 'from-amber-600 to-yellow-500', ring: 'ring-amber-500' },
  { id: 'emerald', bg: 'bg-emerald-600', gradient: 'from-emerald-500 to-teal-400', ring: 'ring-emerald-500' },
];

export default function SettingsDrawer({ isOpen, onClose }) {
  const { 
    user, financialHealth, language, setLanguage, theme, setTheme, 
    startTutorial, replaySplash, t, logoutUser, updateUserLocally, refreshFinancialData 
  } = useUser();

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showSignoutConfirm, setShowSignoutConfirm] = useState(false);

  // Avatar state
  const [avatarUrl, setAvatarUrl] = useState(() => {
    return typeof window !== 'undefined' ? (localStorage.getItem('sakhi_avatar') || '') : '';
  });
  const [selectedPalette, setSelectedPalette] = useState(() => {
    return typeof window !== 'undefined' ? (localStorage.getItem('sakhi_avatar_palette') || 'primary') : 'primary';
  });

  // Edit profile form state
  const [formData, setFormData] = useState({
    name: '',
    monthly_income: '',
    age: '',
    state: '',
    is_shg_member: false,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        monthly_income: user.monthly_income ?? 18500,
        age: user.age ?? 28,
        state: user.state || 'Telangana',
        is_shg_member: Boolean(user.is_shg_member),
      });
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setAvatarUrl(base64);
        localStorage.setItem('sakhi_avatar', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaletteSelect = (paletteId) => {
    setSelectedPalette(paletteId);
    localStorage.setItem('sakhi_avatar_palette', paletteId);
    const chosen = AVATAR_PALETTES.find(p => p.id === paletteId);
    if (chosen) {
      localStorage.setItem('sakhi_avatar_color', chosen.gradient);
    }
  };

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        monthly_income: parseFloat(formData.monthly_income) || 0,
        age: parseInt(formData.age, 10) || 28,
        state: formData.state,
        is_shg_member: formData.is_shg_member,
      };

      const updated = await api.updateUser(user.id, payload);
      updateUserLocally(updated);
      await refreshFinancialData(user.id);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    setShowSignoutConfirm(false);
    onClose();
    logoutUser();
  };

  const currentPalette = AVATAR_PALETTES.find(p => p.id === selectedPalette) || AVATAR_PALETTES[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-drawer-title"
      className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in"
    >
      <div className="bg-white dark:bg-slate-900 w-full sm:max-w-md h-[95vh] sm:h-[720px] rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 border border-amber-100 dark:border-slate-800">
        
        {/* Top Navigation / Drawer Header (Stitch 1:1) */}
        <div className="bg-[#fff8f3] dark:bg-slate-900 px-4 py-3.5 flex items-center justify-between border-b border-amber-100 dark:border-slate-800 shrink-0">
          <div className="flex flex-col">
            <h2 id="settings-drawer-title" className="font-black text-base text-stone-900 dark:text-stone-100 tracking-tight">
              Settings & Profile
            </h2>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Personal info, language & voice preferences
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-stone-600 dark:text-stone-300 active:scale-95 transition cursor-pointer"
            type="button"
          >
            <IconX size={20} />
          </button>
        </div>

        {/* Scrollable Settings Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#fffaf5]/50 dark:bg-slate-950 text-xs sm:text-sm">
          
          {/* Section 1: Personal Profile (Stitch 1:1) */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-amber-100 dark:border-slate-800 shadow-2xs space-y-3.5">
            <div className="flex items-center gap-3.5">
              <div className="relative shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={formData.name || user.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-500 shadow-xs"
                  />
                ) : (
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${currentPalette.gradient} flex items-center justify-center text-white font-black text-2xl shadow-xs border border-white/20`}>
                    {formData.name ? formData.name[0] : (user.name ? user.name[0] : 'स')}
                  </div>
                )}

                <label
                  htmlFor="settings-avatar-upload"
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center shadow-md cursor-pointer transition active:scale-95"
                  title="Upload profile photo"
                >
                  <IconCamera size={14} />
                  <input
                    id="settings-avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm text-stone-900 dark:text-stone-100 truncate">
                    {formData.name || 'Lakshmi Devi'}
                  </span>
                  <IconCircleCheck size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                </div>
                <span className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  Tailoring & Micro-retail • {formData.state || 'Telangana'}
                </span>
              </div>
            </div>

            {/* Profile Tint Theme Picker */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 tracking-wider uppercase">
                Profile Tint Theme
              </span>
              <div className="flex items-center gap-2">
                {AVATAR_PALETTES.map((pal) => (
                  <button
                    key={pal.id}
                    type="button"
                    onClick={() => handlePaletteSelect(pal.id)}
                    className={`w-8 h-8 rounded-full ${pal.bg} flex items-center justify-center shadow-xs cursor-pointer transition text-white ${
                      selectedPalette === pal.id ? 'ring-2 ring-offset-2 ring-orange-500 scale-110' : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    {selectedPalette === pal.id && <IconCheck size={14} strokeWidth={3} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Inputs */}
            <div className="space-y-2.5 pt-2 border-t border-amber-100 dark:border-slate-800">
              {/* Registered Full Name */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400">
                  Registered Full Name
                </label>
                <div className="flex items-center bg-stone-50 dark:bg-slate-800/80 rounded-xl px-3 py-2 border border-amber-200/80 dark:border-slate-700">
                  <IconUser size={16} className="text-orange-600 dark:text-orange-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Monthly Income & Age Row */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400">
                    Monthly Income (₹)
                  </label>
                  <div className="flex items-center bg-stone-50 dark:bg-slate-800/80 rounded-xl px-3 py-2 border border-amber-200/80 dark:border-slate-700">
                    <span className="text-xs font-black text-orange-600 dark:text-orange-400 mr-1.5">₹</span>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.monthly_income}
                      onChange={(e) => setFormData({ ...formData, monthly_income: e.target.value })}
                      className="w-full bg-transparent text-xs font-bold text-orange-700 dark:text-orange-300 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400">
                    Member Age
                  </label>
                  <div className="flex items-center bg-stone-50 dark:bg-slate-800/80 rounded-xl px-3 py-2 border border-amber-200/80 dark:border-slate-700">
                    <input
                      type="number"
                      required
                      min="18"
                      max="100"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full bg-transparent text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-hidden"
                    />
                    <span className="text-[11px] text-stone-400 font-medium">yrs</span>
                  </div>
                </div>
              </div>

              {/* Operating State */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400">
                    Operating State
                  </label>
                  <span className="px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/80 text-orange-900 dark:text-orange-300 text-[10px] font-bold">
                    SERP Active
                  </span>
                </div>
                <div className="flex items-center bg-stone-50 dark:bg-slate-800/80 rounded-xl px-3 py-2 border border-amber-200/80 dark:border-slate-700">
                  <IconMapPin size={16} className="text-orange-600 dark:text-orange-400 mr-2 shrink-0" />
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-transparent text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-hidden cursor-pointer"
                  >
                    {STATES.map((st) => (
                      <option key={st} value={st} className="bg-white dark:bg-slate-800 text-stone-900 dark:text-stone-100">
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SHG Membership Toggle */}
              <div className="flex items-center justify-between bg-stone-50 dark:bg-slate-800/80 rounded-xl p-3 border border-amber-200/80 dark:border-slate-700">
                <div className="flex flex-col pr-2">
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    SHG Membership
                  </span>
                  <span className="text-[10px] text-orange-600 dark:text-orange-400 font-medium">
                    Velugu / SERP Federated
                  </span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.is_shg_member}
                  onClick={() => setFormData({ ...formData, is_shg_member: !formData.is_shg_member })}
                  className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer flex items-center px-0.5 ${
                    formData.is_shg_member ? 'bg-orange-600' : 'bg-stone-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                      formData.is_shg_member ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Section 2: Language & Voice Preferences (Stitch 1:1) */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-amber-100 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <IconLanguage size={18} className="text-orange-600 dark:text-orange-400" />
                <h3 className="font-black text-xs text-stone-900 dark:text-stone-100 uppercase tracking-wider">
                  Language & Voice
                </h3>
              </div>
              <span className="text-[10px] font-bold text-orange-800 dark:text-orange-300 bg-orange-100 dark:bg-orange-950/80 px-2 py-0.5 rounded-full">
                Audio First
              </span>
            </div>

            {/* 3 Large Accessible Cards */}
            <div className="grid grid-cols-3 gap-2">
              {LANGUAGES.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setLanguage(lang.code)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-2xl shadow-2xs h-20 transition-all cursor-pointer relative overflow-hidden border ${
                      isSelected
                        ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                        : 'bg-stone-50 dark:bg-slate-800/80 text-stone-800 dark:text-stone-200 border-stone-200/80 dark:border-slate-700 hover:bg-stone-100'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-1 right-1">
                        <IconCircleCheck size={14} className="text-white" />
                      </div>
                    )}
                    <span className="font-black text-base">{lang.symbol}</span>
                    <span className="text-[11px] font-medium mt-0.5 opacity-90">{lang.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Voice Narration Status Card */}
            <div className="bg-stone-50 dark:bg-slate-800/80 rounded-xl p-3 border border-amber-100 dark:border-slate-700 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900 dark:text-stone-100">
                  <IconVolume size={15} className="text-orange-600 dark:text-orange-400" />
                  <span>Voice Narration</span>
                </div>
                <span className="text-[10px] font-bold text-orange-700 dark:text-orange-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded shadow-2xs">
                  Normal (Clear)
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
                Sakhi speaks slowly with emphasized monetary terms in {language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English'} dialect.
              </p>
            </div>

            {/* Appearance Preference Mode (Light / Dark) */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400">
                Appearance Preference
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[42px] border ${
                    theme === 'light'
                      ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                      : 'bg-stone-50 dark:bg-slate-800/80 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-slate-700'
                  }`}
                >
                  <IconSun size={16} />
                  <span>Light Mode ☀️</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[42px] border ${
                    theme === 'dark'
                      ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                      : 'bg-stone-50 dark:bg-slate-800/80 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-slate-700'
                  }`}
                >
                  <IconMoon size={16} />
                  <span>Dark Mode 🌙</span>
                </button>
              </div>
            </div>
          </section>

          {/* Section 3: Assistance & Guides (Stitch 1:1) */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-amber-100 dark:border-slate-800 shadow-2xs space-y-2.5">
            <div className="flex items-center gap-1.5">
              <IconHelpCircle size={18} className="text-orange-600 dark:text-orange-400" />
              <h3 className="font-black text-xs text-stone-900 dark:text-stone-100 uppercase tracking-wider">
                Assistance & Guides
              </h3>
            </div>

            {/* Replay Interactive Tour */}
            <button
              type="button"
              onClick={() => {
                onClose();
                startTutorial();
              }}
              className="w-full flex items-center justify-between p-3 bg-stone-50 hover:bg-stone-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-stone-900 dark:text-stone-100 rounded-xl border border-stone-200/80 dark:border-slate-700 active:scale-98 transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/80 flex items-center justify-center text-orange-700 dark:text-orange-300">
                  <IconCompass size={18} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-xs">Replay Interactive Tour</span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400">Step-by-step audio walkthrough</span>
                </div>
              </div>
              <IconPlayerPlay size={16} className="text-stone-400" />
            </button>

            {/* Replay Startup Splash */}
            <button
              type="button"
              onClick={() => {
                onClose();
                replaySplash();
              }}
              className="w-full flex items-center justify-between p-3 bg-stone-50 hover:bg-stone-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-stone-900 dark:text-stone-100 rounded-xl border border-stone-200/80 dark:border-slate-700 active:scale-98 transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center text-amber-800 dark:text-amber-300">
                  <IconSparkles size={18} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-xs">Replay Startup Greeting</span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400">Welcome screen & multilingual namaste</span>
                </div>
              </div>
              <IconPlayerPlay size={16} className="text-stone-400" />
            </button>

            {/* Village BC Sakhi Coordinator Call Card */}
            <div className="flex items-center justify-between p-3 bg-stone-50 dark:bg-slate-800/80 rounded-xl border border-stone-200/80 dark:border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
                  <IconUser size={18} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-xs text-stone-900 dark:text-stone-100">Village BC Sakhi</span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400">Smt. Radha Rani (Khammam)</span>
                </div>
              </div>
              <a
                href="tel:1800000123"
                className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs active:scale-95 transition"
                title="Call Sakhi Coordinator"
              >
                <IconPhone size={15} />
              </a>
            </div>
          </section>

          {/* Section 4: Privacy & Deterministic Safety */}
          <section className="bg-stone-100 dark:bg-slate-800/90 rounded-2xl p-3.5 border border-stone-200 dark:border-slate-700 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-900 dark:text-stone-100">
              <IconShield size={16} className="text-orange-600 dark:text-orange-400" />
              <span>100% Private Ledger</span>
            </div>
            <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-snug">
              All calculations run deterministically on this phone. Zero analytics trackers, encrypted local backup, and strictly no third-party data selling.
            </p>
            <div className="flex items-center gap-1 text-orange-700 dark:text-orange-300 text-[10px] font-bold pt-0.5">
              <IconLock size={12} />
              <span>Hardware-bound SHG Signature: Active</span>
            </div>
          </section>

          {/* Action Buttons (Save & Logout) */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={saving}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-black rounded-2xl text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer min-h-[48px] active:scale-95"
            >
              {savedSuccess ? (
                <>
                  <IconCircleCheck size={18} />
                  <span>Saved to Device ✓</span>
                </>
              ) : (
                <>
                  <IconDeviceFloppy size={18} />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </>
              )}
            </button>

            {!showSignoutConfirm ? (
              <button
                type="button"
                onClick={() => setShowSignoutConfirm(true)}
                className="w-full py-3 bg-transparent hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-bold rounded-2xl text-xs transition flex items-center justify-center gap-2 cursor-pointer min-h-[46px] border border-rose-300 dark:border-rose-800 active:scale-95"
              >
                <IconLogout size={16} />
                <span>Log Out from Device</span>
              </button>
            ) : (
              <div className="bg-rose-50 dark:bg-rose-950/50 p-3 rounded-2xl border border-rose-300 dark:border-rose-800 space-y-2 animate-in fade-in">
                <p className="text-xs font-bold text-rose-900 dark:text-rose-200 text-center">
                  Are you sure you want to log out?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSignoutConfirm(false)}
                    className="py-2 bg-white dark:bg-slate-800 text-stone-700 dark:text-stone-200 font-bold rounded-xl text-xs border border-stone-200 dark:border-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs"
                  >
                    Confirm Log Out
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
