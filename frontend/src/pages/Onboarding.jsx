import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Heart, User, MapPin, IndianRupee } from 'lucide-react';
import { api } from '../services/api';
import { useUser } from '../context/UserContext';

export default function Onboarding({ onComplete }) {
  const { loginUser, loadDemoUser } = useUser();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    age: '28',
    state: 'Telangana',
    monthly_income: '12000',
    monthly_expenses: '7000',
    savings: '10000',
    debt: '20000',
    financial_goal: "Daughter's Education",
  });

  const states = [
    'Telangana',
    'Andhra Pradesh',
    'Maharashtra',
    'Karnataka',
    'Madhya Pradesh',
    'Uttar Pradesh',
    'Bihar',
    'Rajasthan',
    'Tamil Nadu',
    'Other'
  ];

  const handleQuickDemo = async () => {
    setLoading(true);
    setError('');
    try {
      await loadDemoUser();
      if (onComplete) onComplete();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const payload = {
        name: formData.name.trim() || 'Sister',
        age: parseInt(formData.age, 10) || 28,
        state: formData.state,
        monthly_income: parseFloat(formData.monthly_income) || 0,
        monthly_expenses: parseFloat(formData.monthly_expenses) || 0,
        savings: parseFloat(formData.savings) || 0,
        debt: parseFloat(formData.debt) || 0,
        financial_goal: formData.financial_goal.trim() || null,
      };

      const newUser = await api.createUser(payload);
      loginUser(newUser);
      if (onComplete) onComplete();
    } catch (err) {
      setError(err.message || 'Failed to create profile. Please check your numbers.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 px-1">
      {/* Welcome Banner */}
      <div className="text-center mb-6">
        <div className="inline-flex p-3 rounded-2xl bg-amber-100 text-amber-900 mb-3 shadow-xs">
          <Heart size={28} className="text-amber-700" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">
          Welcome to Sakhi
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
          Your friendly guide to understanding money, saving for your family, and finding government benefits.
        </p>
      </div>

      {/* One-Tap Demo Button */}
      <div className="mb-6 bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 text-center">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
          <Sparkles size={16} className="text-amber-600" />
          <span>Judges & Quick Demo</span>
        </div>
        <p className="text-xs text-amber-800/80 mb-3">
          Explore instantly with Lakshmi's profile (Telangana, ₹12k income, ₹20k debt, daughter's education goal).
        </p>
        <button
          type="button"
          onClick={handleQuickDemo}
          disabled={loading}
          className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 font-black rounded-xl text-xs transition shadow-sm"
        >
          {loading ? 'Setting up Lakshmi...' : 'Instant Demo as Lakshmi'}
        </button>
      </div>

      {/* Step Progress */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all ${
              step === s
                ? 'w-8 bg-emerald-600'
                : step > s
                ? 'w-4 bg-emerald-300'
                : 'w-4 bg-slate-200'
            }`}
          />
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
        {step === 1 && (
          <div className="space-y-3.5 animate-in fade-in">
            <h2 className="text-base font-bold text-slate-900 mb-2">
              Step 1: About You
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Lakshmi"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  required
                  min="18"
                  max="90"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  State
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {states.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3.5 animate-in fade-in">
            <h2 className="text-base font-bold text-slate-900 mb-2">
              Step 2: Monthly Money Flow
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Monthly Income (What comes in)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-bold">₹</span>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="12000"
                  value={formData.monthly_income}
                  onChange={(e) => setFormData({ ...formData, monthly_income: e.target.value })}
                  className="w-full pl-8 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Monthly Expenses (What goes out)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-bold">₹</span>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="7000"
                  value={formData.monthly_expenses}
                  onChange={(e) => setFormData({ ...formData, monthly_expenses: e.target.value })}
                  className="w-full pl-8 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            {Number(formData.monthly_income) > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 font-medium">
                Calculated Monthly Surplus: <strong>₹{(Number(formData.monthly_income) - Number(formData.monthly_expenses)).toLocaleString('en-IN')}</strong>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3.5 animate-in fade-in">
            <h2 className="text-base font-bold text-slate-900 mb-2">
              Step 3: Savings, Loans & Dreams
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Existing Savings (In bank, cash or Post Office)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  placeholder="10000"
                  value={formData.savings}
                  onChange={(e) => setFormData({ ...formData, savings: e.target.value })}
                  className="w-full pl-8 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Current Debt / Loans to Repay
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  placeholder="20000"
                  value={formData.debt}
                  onChange={(e) => setFormData({ ...formData, debt: e.target.value })}
                  className="w-full pl-8 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Main Financial Dream / Goal
              </label>
              <input
                type="text"
                placeholder="e.g. Daughter's Education, Tailoring Machine, House Repair"
                value={formData.financial_goal}
                onChange={(e) => setFormData({ ...formData, financial_goal: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
            >
              Back
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-1.5"
          >
            <span>{step === 3 ? (loading ? 'Creating Sakhi Profile...' : 'Start My Journey') : 'Continue'}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </form>
    </div>
  );
}
