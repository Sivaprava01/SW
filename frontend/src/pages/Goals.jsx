import React, { useState, useEffect } from 'react';
import {
  IconTarget,
  IconPlus,
  IconSparkles,
  IconTrendingUp,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import confetti from 'canvas-confetti';
import { useUser } from '../context/UserContext';
import { api } from '../services/api';
import GoalCard from '../components/GoalCard';

const CATEGORIES = [
  'Education',
  'Emergency Fund',
  'Business',
  'House',
  'Healthcare',
  'Other Personal Goal'
];

export default function Goals() {
  const { user, refreshFinancialData, t } = useUser();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [addProgressGoal, setAddProgressGoal] = useState(null);
  const [progressAmount, setProgressAmount] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: 'Education',
    target_amount: '',
    current_amount: '0',
    target_date: '12' // 12 months
  });

  const fetchGoals = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const gList = await api.getGoals(user.id);
      setGoals(gList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.target_amount) return;

    try {
      await api.createGoal({
        user_id: user.id,
        name: formData.name,
        category: formData.category,
        target_amount: parseFloat(formData.target_amount),
        current_amount: parseFloat(formData.current_amount || 0),
        target_date: formData.target_date
      });
      setShowCreateModal(false);
      setFormData({
        name: '',
        category: 'Education',
        target_amount: '',
        current_amount: '0',
        target_date: '12'
      });
      await fetchGoals();
      await refreshFinancialData(user.id);
    } catch (err) {
      alert(err.message || 'Failed to create goal');
    }
  };

  const handleDelete = async (goalId) => {
    if (!confirm('Are you sure you want to remove this goal?')) return;
    try {
      await api.deleteGoal(goalId);
      await fetchGoals();
      await refreshFinancialData(user.id);
    } catch (err) {
      alert(err.message || 'Failed to delete goal');
    }
  };

  const handleAddSavings = async (e) => {
    e.preventDefault();
    if (!addProgressGoal || !progressAmount || isNaN(progressAmount)) return;

    const added = parseFloat(progressAmount);
    const newAmount = addProgressGoal.current_amount + added;

    try {
      await api.updateGoal(addProgressGoal.id, {
        current_amount: newAmount
      });

      if (newAmount >= addProgressGoal.target_amount) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      setAddProgressGoal(null);
      setProgressAmount('');
      await fetchGoals();
      await refreshFinancialData(user.id);
    } catch (err) {
      alert(err.message || 'Failed to update goal savings');
    }
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            {t('nav_goals') || 'My Goals'} & Dreams
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Set a target, and Sakhi calculates the exact monthly savings needed
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer min-h-[36px]"
        >
          <IconPlus size={15} />
          <span>New Goal</span>
        </button>
      </div>

      {/* Goal Cards List */}
      {goals.length === 0 ? (
        <div className="bg-[#fff1e3]/50 dark:bg-slate-900 border border-dashed border-amber-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-2xs">
          <div className="w-13 h-13 rounded-2xl bg-orange-100 dark:bg-slate-800 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <IconTarget size={26} />
          </div>
          <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
            No Goals Created Yet
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mx-auto mt-1 mb-4 leading-relaxed">
            Dreaming of education, a shop, or a better house? Add a goal to let Sakhi plan your monthly savings.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-orange-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-orange-700 transition active:scale-95 cursor-pointer min-h-[44px]"
          >
            Create My First Goal
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onAddProgress={(g) => setAddProgressGoal(g)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal: Create Goal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm p-5 shadow-2xl border border-amber-100 dark:border-slate-800 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-black text-stone-900 dark:text-stone-100">
                Create Savings Goal
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition"
              >
                <IconX size={18} />
              </button>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
              What are you saving for?
            </p>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Daughter's College Fees"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Target (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min="100"
                    placeholder="50000"
                    value={formData.target_amount}
                    onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 rounded-xl text-sm font-bold text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Saved So Far (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="10000"
                    value={formData.current_amount}
                    onChange={(e) => setFormData({ ...formData, current_amount: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 rounded-xl text-sm font-bold text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Time Horizon (Months)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="120"
                  placeholder="12"
                  value={formData.target_date}
                  onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-stone-700 dark:text-stone-300 font-bold rounded-xl text-xs transition min-h-[44px] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs transition shadow-xs min-h-[44px] cursor-pointer"
                >
                  Calculate & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Progress to Goal */}
      {addProgressGoal && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm p-5 shadow-2xl border border-amber-100 dark:border-slate-800 animate-in zoom-in-95">
            <h3 className="text-base font-black text-stone-900 dark:text-stone-100 mb-1">
              Add Money to Goal
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
              {addProgressGoal.name} (Saved so far: ₹{Number(addProgressGoal.current_amount).toLocaleString('en-IN')})
            </p>

            <form onSubmit={handleAddSavings} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Amount to Allocate (₹)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 1000"
                  value={progressAmount}
                  onChange={(e) => setProgressAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 rounded-xl text-lg font-black text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
                {progressAmount && !isNaN(progressAmount) && Number(progressAmount) > 0 && (
                  <p className="mt-2 text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 rounded-xl p-2.5 font-medium border border-emerald-300/40">
                    ℹ️ This moves ₹{Number(progressAmount).toLocaleString('en-IN')} into this goal from your savings.
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAddProgressGoal(null);
                    setProgressAmount('');
                  }}
                  className="flex-1 py-2.5 bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 font-bold rounded-xl text-xs min-h-[44px] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs shadow-xs min-h-[44px] cursor-pointer"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
