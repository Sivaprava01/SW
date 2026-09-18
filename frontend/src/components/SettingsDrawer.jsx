import React, { useState, useEffect } from 'react';
import { 
  X, User, MapPin, Calendar, Wallet, Target, Globe, LogOut, 
  Check, Camera, Sparkles, Shield, Info, Edit3, Save, CheckCircle2, 
  Sun, Moon, Compass, PlayCircle, Volume2 
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { api } from '../services/api';

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
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

const AVATAR_COLORS = [
  'from-emerald-600 to-teal-500',
  'from-amber-500 to-orange-600',
  'from-purple-600 to-indigo-600',
  'from-rose-500 to-pink-600',
];

export default function SettingsDrawer({ isOpen, onClose }) {
  const { 
    user, financialHealth, language, setLanguage, theme, setTheme, 
    startTutorial, t, logoutUser, updateUserLocally, refreshFinancialData 
  } = useUser();

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showSignoutConfirm, setShowSignoutConfirm] = useState(false);

  // Avatar state
  const [avatarUrl, setAvatarUrl] = useState(() => {
    return localStorage.getItem('sakhi_avatar') || '';
  });
  const [avatarColor, setAvatarColor] = useState(() => {
    return localStorage.getItem('sakhi_avatar_color') || AVATAR_COLORS[0];
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
        monthly_income: user.monthly_income ?? 12000,
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

  const handleColorSelect = (color) => {
    setAvatarColor(color);
    localStorage.setItem('sakhi_avatar_color', color);
    setAvatarUrl('');
    localStorage.removeItem('sakhi_avatar');
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-drawer-title"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in"
    >
      <div className="bg-white dark:bg-slate-900 w-full sm:max-w-md h-[94vh] sm:h-[680px] rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 border border-slate-100 dark:border-slate-800">
        
        {/* Header */}
        <div className="bg-linear-to-r from-emerald-800 to-teal-900 text-white p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl border border-white/20">
              <User size={18} className="text-amber-300" />
            </div>
            <div>
              <h2 id="settings-drawer-title" className="font-black text-base tracking-tight">
                {t('settings')}
              </h2>
              <p className="text-xs text-emerald-200">
                Edit Information & App Preferences
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Settings Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm">
          
          {/* SECTION 1: 👤 Personal Information */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                <Edit3 size={14} />
                <span>Personal Information</span>
              </h3>
              {savedSuccess && (
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={13} /> Updated!
                </span>
              )}
            </div>

            {/* Profile Picture Upload & Styles */}
            <div className="flex items-center gap-3.5 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="relative">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-xs"
                  />
                ) : (
                  <div className={`w-14 h-14 rounded-2xl bg-linear-to-tr ${avatarColor} flex items-center justify-center text-white font-black text-xl shadow-xs border border-white/20`}>
                    {user.name ? user.name[0] : 'S'}
                  </div>
                )}
                
                <label
                  htmlFor="settings-avatar-upload"
                  className="absolute -bottom-1 -right-1 p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md cursor-pointer transition min-h-[28px] min-w-[28px] flex items-center justify-center"
                  title="Upload picture"
                >
                  <Camera size={12} />
                  <input
                    id="settings-avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex-1">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
                  Profile Picture
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5">
                  Upload photo or choose avatar color:
                </p>
                <div className="flex gap-1.5">
                  {AVATAR_COLORS.map((c, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleColorSelect(c)}
                      className={`w-5 h-5 rounded-full bg-linear-to-tr ${c} cursor-pointer transition border ${
                        avatarColor === c && !avatarUrl ? 'ring-2 ring-emerald-500 scale-110' : 'border-slate-200 dark:border-slate-700'
                      }`}
                      title="Choose avatar color"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Editable Fields */}
            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">{t('full_name')}</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">{t('monthly_income')} (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.monthly_income}
                    onChange={(e) => setFormData({ ...formData, monthly_income: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">{t('age')}</label>
                  <input
                    type="number"
                    required
                    min="18"
                    max="100"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">{t('state')}</label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  {STATES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">{t('shg_member')}</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_shg_member: true })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition border min-h-[38px] cursor-pointer ${
                      formData.is_shg_member
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {t('yes')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_shg_member: false })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition border min-h-[38px] cursor-pointer ${
                      !formData.is_shg_member
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {t('no')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: 🌐 Language & Theme Preferences */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
              <Globe size={14} />
              <span>Language & Theme</span>
            </h3>

            {/* Language Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                {t('language_label')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {LANGUAGES.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setLanguage(lang.code)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-0.5 cursor-pointer min-h-[44px] border ${
                        isSelected
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xs">{lang.native}</span>
                      <span className="text-[10px] opacity-80">{lang.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Theme Mode Toggle (Light / Dark) */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                App Appearance Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px] border ${
                    theme === 'light'
                      ? 'bg-amber-100 text-amber-950 border-amber-300 shadow-2xs font-black'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Sun size={15} className="text-amber-600" />
                  <span>Light Mode ☀️</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px] border ${
                    theme === 'dark'
                      ? 'bg-slate-800 text-amber-300 border-slate-600 shadow-2xs font-black'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Moon size={15} className="text-indigo-400" />
                  <span>Dark Mode 🌙</span>
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 3: 🎓 Interactive App Tour Replay */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
              <Sparkles size={14} />
              <span>Help & Guided Tour</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Need a reminder on how to use Sakhi? Walkthrough our simple guided tour again.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                startTutorial();
              }}
              className="w-full py-2.5 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 font-bold rounded-xl text-xs transition border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px]"
            >
              <PlayCircle size={16} />
              <span>Replay Interactive App Tour</span>
            </button>
          </div>

          {/* SECTION 4: 🔊 Audio & Voice Status */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Volume2 size={15} className="text-emerald-700 dark:text-emerald-400" />
              <span>Voice Assistance</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Listen buttons (🔊) are available on Learn topics, Roadmaps, and AI responses with Indian accent support.
            </p>
          </div>

          {/* SECTION 5: ⚙️ App Information & Security */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Shield size={14} className="text-emerald-700 dark:text-emerald-400" />
              <span>{t('app_title')}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              <strong>Sakhi (सखी) 1.0</strong> • Financial companion for rural women and families.
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              All financial calculations are computed deterministically. AI provides simple explanations.
            </p>
          </div>

          {/* ──────────────────────── SAVE CHANGES ACTION ──────────────────────── */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={saving}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black rounded-2xl text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
            >
              <Save size={16} />
              <span>{saving ? 'Saving...' : t('save_changes')}</span>
            </button>
          </div>

          {/* ──────────────────────── LOG OUT DANGEROUS ACTION ──────────────────────── */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            {!showSignoutConfirm ? (
              <button
                type="button"
                onClick={() => setShowSignoutConfirm(true)}
                className="w-full py-3 bg-transparent hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-bold rounded-2xl text-xs transition flex items-center justify-center gap-2 cursor-pointer min-h-[48px] border-2 border-rose-300 dark:border-rose-800"
              >
                <LogOut size={16} />
                <span>{t('sign_out')}</span>
              </button>
            ) : (
              <div className="bg-rose-50 dark:bg-rose-950/50 p-3.5 rounded-2xl border border-rose-300 dark:border-rose-800 space-y-2 animate-in fade-in">
                <p className="text-xs font-bold text-rose-900 dark:text-rose-200 text-center">
                  Are you sure you want to log out?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSignoutConfirm(false)}
                    className="py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs border border-slate-200 dark:border-slate-700"
                  >
                    {t('cancel')}
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
