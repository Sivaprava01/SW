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
          <h2 className="font-headline text-xl font-black text-[#221a0e] dark:text-[#FFF5EB] tracking-tight">
            {t('nav_goals') || 'My Goals'} & Dreams
          </h2>
          <p className="text-xs text-stone-500 dark:text-[#A8988A]">
            Set a target, and Sakhi calculates the exact monthly savings needed
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer min-h-[36px]"
        >
          <IconPlus size={15} />
          <span>New Goal</span>
        </button>
      </div>

      {/* Goals List */}
      {goals.length === 0 ? (
        <div className="bg-[#fff1e3]/40 dark:bg-[#1e1b19] border border-dashed border-amber-200/80 dark:border-[#3D332B] rounded-2xl p-6 text-center text-stone-500 dark:text-[#A8988A]">
          <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-[#28211C] text-orange-600 dark:text-[#ffb690] flex items-center justify-center mx-auto mb-2">
            <IconTarget size={24} />
          </div>
          <p className="font-headline text-sm font-bold text-[#221a0e] dark:text-[#FFF5EB]">No financial goals created yet.</p>
          <p className="text-xs text-stone-500 dark:text-[#A8988A] mt-1 max-w-xs mx-auto">
            Create a goal (e.g. Children Education, Gold, Machinery, House Repair) to see how much to save monthly.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl shadow-xs active:scale-95 transition"
          >
            Create Your First Dream
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map((g) => (
            <GoalCard
              key={g.id}
              goal={g}
              onAddProgress={(goal) => setAddProgressGoal(goal)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* CREATE NEW GOAL MODAL (Stitch Pattern) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1e1b19] rounded-3xl w-full max-w-sm p-5 shadow-2xl border border-amber-100 dark:border-[#3D332B] animate-in zoom-in-95 text-[#221a0e] dark:text-[#FFF5EB]">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-headline text-lg font-black text-[#221a0e] dark:text-[#FFF5EB]">
                Create New Dream
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition cursor-pointer"
              >
                <IconX size={18} />
              </button>
            </div>
            <p className="text-xs text-stone-500 dark:text-[#A8988A] mb-4">
              Sakhi will calculate the exact monthly savings needed to reach this goal.
            </p>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-[#D4C4B5] mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Daughter's College, Tailoring Unit"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#fffaf5] dark:bg-[#14110F] border border-amber-200/70 dark:border-[#3D332B] rounded-xl text-xs sm:text-sm text-[#221a0e] dark:text-[#FFF5EB] focus:outline-hidden focus:ring-2 focus:ring-orange-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-[#D4C4B5] mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#fffaf5] dark:bg-[#14110F] border border-amber-200/70 dark:border-[#3D332B] rounded-xl text-xs sm:text-sm text-[#221a0e] dark:text-[#FFF5EB] focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-[#D4C4B5] mb-1">
                    Target (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 50000"
                    required
                    min="100"
                    value={formData.target_amount}
                    onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#fffaf5] dark:bg-[#14110F] border border-amber-200/70 dark:border-[#3D332B] rounded-xl text-xs sm:text-sm font-bold text-[#221a0e] dark:text-[#FFF5EB] focus:outline-hidden focus:ring-2 focus:ring-orange-500 font-headline"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-[#D4C4B5] mb-1">
                    Already Saved (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.current_amount}
                    onChange={(e) => setFormData({ ...formData, current_amount: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#fffaf5] dark:bg-[#14110F] border border-amber-200/70 dark:border-[#3D332B] rounded-xl text-xs sm:text-sm font-bold text-[#221a0e] dark:text-[#FFF5EB] focus:outline-hidden focus:ring-2 focus:ring-orange-500 font-headline"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-[#D4C4B5] mb-1">
                  Target Duration (Months)
                </label>
                <select
                  value={formData.target_date}
                  onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#fffaf5] dark:bg-[#14110F] border border-amber-200/70 dark:border-[#3D332B] rounded-xl text-xs sm:text-sm text-[#221a0e] dark:text-[#FFF5EB] focus:outline-hidden focus:ring-2 focus:ring-orange-500 font-mono"
                >
                  <option value="6">6 Months (Short term)</option>
                  <option value="12">12 Months (1 Year)</option>
                  <option value="24">24 Months (2 Years)</option>
                  <option value="36">36 Months (3 Years)</option>
                  <option value="60">60 Months (5 Years)</option>
                </select>
              </div>

              {/* Live Required Per Month Estimation */}
              {formData.target_amount && (
                <div className="p-3 rounded-xl bg-[#fcebd7] dark:bg-[#28211C] border border-amber-200/70 dark:border-[#3D332B] flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-700 dark:text-[#D4C4B5]">Estimated Monthly Quota:</span>
                  <span className="font-headline font-black text-orange-700 dark:text-[#ffb690]">
                    ₹{Math.ceil(Math.max(0, parseFloat(formData.target_amount || 0) - parseFloat(formData.current_amount || 0)) / parseInt(formData.target_date || 12, 10)).toLocaleString('en-IN')}/mo
                  </span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 bg-[#fff1e3] dark:bg-[#28211C] hover:bg-amber-100 dark:hover:bg-stone-800 text-stone-700 dark:text-[#D4C4B5] font-bold rounded-xl text-xs transition min-h-[44px] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs transition shadow-xs min-h-[44px] cursor-pointer active:scale-95"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD PROGRESS MODAL */}
      {addProgressGoal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1e1b19] rounded-3xl w-full max-w-sm p-5 shadow-2xl border border-amber-100 dark:border-[#3D332B] animate-in zoom-in-95 text-[#221a0e] dark:text-[#FFF5EB]">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-headline text-lg font-black text-[#221a0e] dark:text-[#FFF5EB]">
                Add Savings to Goal
              </h3>
              <button
                onClick={() => setAddProgressGoal(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition cursor-pointer"
              >
                <IconX size={18} />
              </button>
            </div>
            <p className="text-xs text-stone-500 dark:text-[#A8988A] mb-4">
              Adding to <strong>{addProgressGoal.name}</strong>
            </p>

            <form onSubmit={handleAddSavings} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-[#D4C4B5] mb-1">
                  Amount to Deposit (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 1500"
                  required
                  min="1"
                  value={progressAmount}
                  onChange={(e) => setProgressAmount(e.target.value)}
                  className="w-full text-xl font-headline font-black px-3.5 py-2.5 bg-[#fffaf5] dark:bg-[#14110F] border border-amber-200/70 dark:border-[#3D332B] rounded-xl text-[#221a0e] dark:text-[#FFF5EB] focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddProgressGoal(null)}
                  className="flex-1 py-2.5 bg-[#fff1e3] dark:bg-[#28211C] hover:bg-amber-100 dark:hover:bg-stone-800 text-stone-700 dark:text-[#D4C4B5] font-bold rounded-xl text-xs transition min-h-[44px] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs transition shadow-xs min-h-[44px] cursor-pointer active:scale-95"
                >
                  Confirm Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
