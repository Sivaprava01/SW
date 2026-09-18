import React, { useState } from 'react';
import {
  IconUser,
  IconMapPin,
  IconUsers,
  IconHome,
  IconBuildingCommunity,
  IconArrowRight,
  IconArrowLeft,
  IconCheck,
  IconVolume,
  IconLanguage,
} from '@tabler/icons-react';
import { api } from '../services/api';
import { useUser } from '../context/UserContext';
import { useSpeech } from '../hooks/useSpeech';

export default function Onboarding({ onComplete }) {
  const { setUser, setFinancialHealth, language, setLanguage, t } = useUser();
  const { speak } = useSpeech();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    age: 28,
    state: 'Andhra Pradesh',
    is_shg_member: true,
    residence: 'rural',
    monthly_income: 12000,
    monthly_expenses: 7800,
    savings: 8000,
    debt: 12000,
    financial_goal: "Daughter's Education",
  });

  const states = [
    { value: 'Andhra Pradesh', label: 'Andhra Pradesh' },
    { value: 'Telangana', label: 'Telangana' },
    { value: 'Maharashtra', label: 'Maharashtra' },
    { value: 'Karnataka', label: 'Karnataka' },
    { value: 'Tamil Nadu', label: 'Tamil Nadu' },
    { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
    { value: 'Bihar', label: 'Bihar' },
    { value: 'Rajasthan', label: 'Rajasthan' },
    { value: 'Madhya Pradesh', label: 'Madhya Pradesh' },
    { value: 'West Bengal', label: 'West Bengal' },
    { value: 'Other', label: 'Other State / Central' },
  ];

  const handleAgeSelect = (ageVal) => {
    setFormData((prev) => ({ ...prev, age: parseInt(ageVal, 10) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        name: formData.name.trim(),
        age: parseInt(formData.age, 10),
        state: formData.state,
        is_shg_member: formData.is_shg_member,
        residence: formData.residence,
        monthly_income: parseFloat(formData.monthly_income) || 0,
        monthly_expenses: parseFloat(formData.monthly_expenses) || 0,
        savings: parseFloat(formData.savings) || 0,
        debt: parseFloat(formData.debt) || 0,
        financial_goal: formData.financial_goal.trim() || 'Emergency Fund',
      };

      const newUser = await api.createUser(payload);
      setUser(newUser);

      if (newUser.id) {
        try {
          const healthData = await api.getFinancialHealth(newUser.id);
          setFinancialHealth(healthData);
        } catch {
          // Fallback handled gracefully
        }
      }

      if (onComplete) {
        onComplete(newUser);
      }
    } catch (err) {
      setError(err.message || 'Failed to complete setup. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  const calculatedSurplus = Math.max(0, (Number(formData.monthly_income) || 0) - (Number(formData.monthly_expenses) || 0));

  return (
    <div className="flex flex-col w-full pb-8 bg-[#fff8f3] dark:bg-[#14110F] text-[#221a0e] dark:text-[#FFF5EB] min-h-screen">
      {/* Warm Top Accent Bar */}
      <div className="w-full h-1.5 bg-gradient-to-r from-rose-700 via-orange-500 to-amber-600"></div>

      <div className="px-3.5 sm:px-4 pt-3 flex flex-col gap-4 max-w-md mx-auto w-full">
        
        {/* Mascot & Greeting Card */}
        <section className="bg-white dark:bg-[#1e1b19] rounded-2xl p-4 shadow-xs flex flex-col gap-3 border border-amber-200/70 dark:border-[#3D332B] relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            {/* Cultural Emblem Mascot */}
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center shadow-md text-white font-black text-2xl border-2 border-white/60 dark:border-stone-800">
                స
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#100e0c] rounded-full p-0.5 shadow-xs">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                </span>
              </div>
            </div>

            {/* Title */}
            <div className="flex flex-col min-w-0">
              <h1 className="font-headline font-bold text-xl sm:text-2xl text-[#221a0e] dark:text-[#FFF5EB] truncate">
                Welcome to Sakhi
              </h1>
            </div>
          </div>
        </section>

        {/* Stepper Indicator */}
        <nav aria-label="Onboarding Progress" className="bg-white dark:bg-[#1e1b19] rounded-2xl p-3.5 shadow-xs border border-amber-200/70 dark:border-[#3D332B] flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-2">
            {/* Step 1 */}
            <div className={`flex flex-col gap-1.5 items-center text-center ${step === 1 ? '' : 'opacity-65'}`}>
              <div className={`w-full h-1.5 rounded-full ${step >= 1 ? 'bg-orange-600' : 'bg-stone-200 dark:bg-stone-800'}`}></div>
              <div className="flex items-center gap-1">
                <span className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${step >= 1 ? 'bg-orange-600 text-white' : 'bg-stone-300 text-stone-700'}`}>1</span>
                <span className="text-xs font-bold text-orange-700 dark:text-[#ffb690] truncate">Personal</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className={`flex flex-col gap-1.5 items-center text-center ${step === 2 ? '' : 'opacity-65'}`}>
              <div className={`w-full h-1.5 rounded-full ${step >= 2 ? 'bg-orange-600' : 'bg-stone-200 dark:bg-stone-800'}`}></div>
              <div className="flex items-center gap-1">
                <span className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${step >= 2 ? 'bg-orange-600 text-white' : 'bg-stone-300 text-stone-700'}`}>2</span>
                <span className="text-xs font-bold text-stone-700 dark:text-[#D4C4B5] truncate">Cashflow</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className={`flex flex-col gap-1.5 items-center text-center ${step === 3 ? '' : 'opacity-65'}`}>
              <div className={`w-full h-1.5 rounded-full ${step >= 3 ? 'bg-orange-600' : 'bg-stone-200 dark:bg-stone-800'}`}></div>
              <div className="flex items-center gap-1">
                <span className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${step >= 3 ? 'bg-orange-600 text-white' : 'bg-stone-300 text-stone-700'}`}>3</span>
                <span className="text-xs font-bold text-stone-700 dark:text-[#D4C4B5] truncate">First Dream</span>
              </div>
            </div>
          </div>
        </nav>

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Onboarding Steps Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          
          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-3.5 animate-in fade-in">
              {/* Full Name */}
              <div className="bg-white dark:bg-[#1e1b19] rounded-2xl p-4 shadow-xs flex flex-col gap-2 border border-amber-200/70 dark:border-[#3D332B]">
                <label className="text-xs font-bold text-stone-800 dark:text-[#FFF5EB] flex items-center justify-between" htmlFor="fullNameInput">
                  <span>Full Name</span>
                  <span className="text-orange-600 dark:text-[#ffb690] text-[10px] uppercase font-bold">Step 1 of 3</span>
                </label>
                <div className="relative flex items-center">
                  <IconUser size={18} className="absolute left-3.5 text-stone-400 pointer-events-none" />
                  <input
                    id="fullNameInput"
                    type="text"
                    required
                    placeholder="e.g. Lakshmi Devi"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#fffaf5] dark:bg-[#100e0c] border border-amber-200/70 dark:border-[#3D332B] rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-[#221a0e] dark:text-[#FFF5EB] focus:ring-2 focus:ring-orange-500 focus:outline-hidden transition"
                  />
                </div>
              </div>

              {/* Age Input with Preset Chips */}
              <div className="bg-white dark:bg-[#1e1b19] rounded-2xl p-4 shadow-xs flex flex-col gap-3 border border-amber-200/70 dark:border-[#3D332B]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-800 dark:text-[#FFF5EB]" htmlFor="ageInput">
                    Age (Years)
                  </label>
                  <div className="flex items-center gap-1 bg-[#fff1e3] dark:bg-[#28211C] px-3 py-0.5 rounded-full border border-amber-200/50 dark:border-[#3D332B]">
                    <span className="text-sm font-bold text-orange-700 dark:text-[#ffb690]">{formData.age}</span>
                    <span className="text-[10px] text-stone-500 font-medium">yrs</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-stone-500 dark:text-[#A8988A] font-bold">
                    Quick Select Age
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {['25', '28', '35', '45'].map((age) => (
                      <button
                        key={age}
                        type="button"
                        onClick={() => handleAgeSelect(age)}
                        className={`py-2 rounded-full text-xs font-bold transition active:scale-95 cursor-pointer border ${
                          formData.age === parseInt(age, 10)
                            ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                            : 'bg-[#fffaf5] dark:bg-[#28211C] text-stone-700 dark:text-[#D4C4B5] border-amber-200/70 dark:border-[#3D332B] hover:bg-orange-50'
                        }`}
                      >
                        {age} {formData.age === parseInt(age, 10) && '✓'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* State Dropdown */}
              <div className="bg-white dark:bg-[#1e1b19] rounded-2xl p-4 shadow-xs flex flex-col gap-2.5 border border-amber-200/70 dark:border-[#3D332B]">
                <label className="text-xs font-bold text-stone-800 dark:text-[#FFF5EB]" htmlFor="stateSelect">
                  Operating State
                </label>
                <div className="relative flex items-center">
                  <IconMapPin size={18} className="absolute left-3.5 text-rose-600 pointer-events-none" />
                  <select
                    id="stateSelect"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-[#fffaf5] dark:bg-[#100e0c] border border-amber-200/70 dark:border-[#3D332B] rounded-xl py-3 pl-10 pr-8 text-xs font-bold text-[#221a0e] dark:text-[#FFF5EB] appearance-none focus:ring-2 focus:ring-orange-500 focus:outline-hidden cursor-pointer"
                  >
                    {states.map((st) => (
                      <option key={st.value} value={st.value} className="bg-white dark:bg-[#1e1b19] text-[#221a0e] dark:text-[#FFF5EB]">
                        {st.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SHG Toggle Cards (Clean Yes / No) */}
              <div className="bg-white dark:bg-[#1e1b19] rounded-2xl p-4 shadow-xs flex flex-col gap-2.5 border border-amber-200/70 dark:border-[#3D332B]">
                <span className="text-xs font-bold text-stone-800 dark:text-[#FFF5EB]">
                  Are you a member of a Self-Help Group (SHG)?
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_shg_member: true })}
                    className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border ${
                      formData.is_shg_member
                        ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                        : 'bg-[#fffaf5] dark:bg-[#100e0c] text-stone-700 dark:text-[#D4C4B5] border-amber-200/70 dark:border-[#3D332B] hover:bg-orange-50'
                    }`}
                  >
                    <IconUsers size={16} />
                    <span>Yes</span>
                    {formData.is_shg_member && <IconCheck size={14} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_shg_member: false })}
                    className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border ${
                      !formData.is_shg_member
                        ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                        : 'bg-[#fffaf5] dark:bg-[#100e0c] text-stone-700 dark:text-[#D4C4B5] border-amber-200/70 dark:border-[#3D332B] hover:bg-orange-50'
                    }`}
                  >
                    <span>No</span>
                    {!formData.is_shg_member && <IconCheck size={14} />}
                  </button>
                </div>
              </div>

              {/* Rural / Urban Residence */}
              <div className="bg-white dark:bg-[#1e1b19] rounded-2xl p-4 shadow-xs flex flex-col gap-2.5 border border-amber-200/70 dark:border-[#3D332B]">
                <label className="text-xs font-bold text-stone-800 dark:text-[#FFF5EB]">
                  Where is your family home located?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, residence: 'rural' })}
                    className={`py-3 px-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition border text-xs font-bold ${
                      formData.residence === 'rural'
                        ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                        : 'bg-[#fffaf5] dark:bg-[#100e0c] text-stone-700 dark:text-[#D4C4B5] border-amber-200/70 dark:border-[#3D332B] hover:bg-orange-50'
                    }`}
                  >
                    <IconHome size={16} />
                    <span>Rural village</span>
                    {formData.residence === 'rural' && <IconCheck size={14} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, residence: 'urban' })}
                    className={`py-3 px-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition border text-xs font-bold ${
                      formData.residence === 'urban'
                        ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                        : 'bg-[#fffaf5] dark:bg-[#100e0c] text-stone-700 dark:text-[#D4C4B5] border-amber-200/70 dark:border-[#3D332B] hover:bg-orange-50'
                    }`}
                  >
                    <IconBuildingCommunity size={16} />
                    <span>Urban town</span>
                    {formData.residence === 'urban' && <IconCheck size={14} />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Monthly Cashflow */}
          {step === 2 && (
            <div className="space-y-3.5 animate-in fade-in">
              <div className="bg-white dark:bg-[#1e1b19] rounded-2xl p-4 shadow-xs flex flex-col gap-3.5 border border-amber-200/70 dark:border-[#3D332B]">
                <h2 className="text-sm font-bold text-stone-900 dark:text-[#FFF5EB] flex items-center justify-between">
                  <span>Step 2: Monthly Money Flow</span>
                  <span className="text-orange-600 dark:text-[#ffb690] text-[10px] uppercase font-bold">Step 2 of 3</span>
                </h2>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-[#D4C4B5] mb-1">
                    Monthly Income
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-stone-400 font-bold">₹</span>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.monthly_income}
                      onChange={(e) => setFormData({ ...formData, monthly_income: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-[#fffaf5] dark:bg-[#100e0c] border border-amber-200/70 dark:border-[#3D332B] rounded-xl text-sm font-bold text-stone-900 dark:text-[#FFF5EB] focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-[#D4C4B5] mb-1">
                    Monthly Expenses
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-stone-400 font-bold">₹</span>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.monthly_expenses}
                      onChange={(e) => setFormData({ ...formData, monthly_expenses: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-[#fffaf5] dark:bg-[#100e0c] border border-amber-200/70 dark:border-[#3D332B] rounded-xl text-sm font-bold text-stone-900 dark:text-[#FFF5EB] focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Live Surplus Indicator */}
                <div className="bg-[#fff1e3] dark:bg-[#28211C] border border-amber-200/70 dark:border-[#3D332B] rounded-xl p-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-700 dark:text-[#D4C4B5]">
                    Calculated Monthly Surplus:
                  </span>
                  <span className="text-sm font-black text-orange-700 dark:text-[#ffb690]">
                    ₹{calculatedSurplus.toLocaleString('en-IN')}<span className="text-[10px] font-normal text-stone-500">/mo</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Savings, Debt & Goals */}
          {step === 3 && (
            <div className="space-y-3.5 animate-in fade-in">
              <div className="bg-white dark:bg-[#1e1b19] rounded-2xl p-4 shadow-xs flex flex-col gap-3.5 border border-amber-200/70 dark:border-[#3D332B]">
                <h2 className="text-sm font-bold text-stone-900 dark:text-[#FFF5EB] flex items-center justify-between">
                  <span>Step 3: Savings, Loans & Dreams</span>
                  <span className="text-orange-600 dark:text-[#ffb690] text-[10px] uppercase font-bold">Step 3 of 3</span>
                </h2>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-[#D4C4B5] mb-1">
                    Existing Savings
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-stone-400 font-bold">₹</span>
                    <input
                      type="number"
                      min="0"
                      value={formData.savings}
                      onChange={(e) => setFormData({ ...formData, savings: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-[#fffaf5] dark:bg-[#100e0c] border border-amber-200/70 dark:border-[#3D332B] rounded-xl text-sm font-bold text-stone-900 dark:text-[#FFF5EB] focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-[#D4C4B5] mb-1">
                    Current Debt or Loans
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-stone-400 font-bold">₹</span>
                    <input
                      type="number"
                      min="0"
                      value={formData.debt}
                      onChange={(e) => setFormData({ ...formData, debt: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-[#fffaf5] dark:bg-[#100e0c] border border-amber-200/70 dark:border-[#3D332B] rounded-xl text-sm font-bold text-rose-700 dark:text-[#ffb599] focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-[#D4C4B5] mb-1">
                    Your Main Financial Dream or Goal
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Daughter's Education, Tailoring Machine, House Repair"
                    value={formData.financial_goal}
                    onChange={(e) => setFormData({ ...formData, financial_goal: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#fffaf5] dark:bg-[#100e0c] border border-amber-200/70 dark:border-[#3D332B] rounded-xl text-xs font-bold text-stone-900 dark:text-[#FFF5EB] focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form CTAs */}
          <div className="flex gap-2 pt-1">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-3 bg-stone-200 dark:bg-[#28211C] hover:bg-stone-300 text-stone-800 dark:text-[#D4C4B5] font-bold rounded-xl text-xs transition active:scale-95 cursor-pointer flex items-center gap-1"
              >
                <IconArrowLeft size={14} />
                Back
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex-1 min-h-[48px] bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{step === 3 ? (loading ? 'Creating Sakhi Profile...' : 'Start My Journey') : (step === 1 ? 'Next: Income & Cashflow' : 'Next: First Dream')}</span>
              <IconArrowRight size={16} />
            </button>
          </div>
        </form>

        {/* Audio & Language Helpers */}
        <div className="flex items-center justify-center gap-2 pt-1 pb-4">
          <button
            type="button"
            onClick={() => speak("నమస్తే! సఖి యాప్‌కు స్వాగతం. మీ ప్రొఫైల్‌ను సులభంగా పూర్తి చేయండి.", "onboarding-guide", "te")}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#fcebd7] dark:bg-[#28211C] text-stone-700 dark:text-[#D4C4B5] text-[11px] font-bold active:scale-95 transition cursor-pointer"
          >
            <IconVolume size={14} className="text-orange-600" />
            <span>Listen in Telugu</span>
          </button>

          <button
            type="button"
            onClick={() => setLanguage(language === 'te' ? 'hi' : language === 'hi' ? 'en' : 'te')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#fcebd7] dark:bg-[#28211C] text-stone-700 dark:text-[#D4C4B5] text-[11px] font-bold active:scale-95 transition cursor-pointer"
          >
            <IconLanguage size={14} className="text-rose-700" />
            <span>Language ({language.toUpperCase()})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
