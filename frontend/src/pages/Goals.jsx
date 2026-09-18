import React, { useState, useEffect } from 'react';
import { Target, Plus, Sparkles, TrendingUp, CheckCircle, RefreshCw } from 'lucide-react';
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
  const { user, refreshFinancialData } = useUser();
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            My Goals & Dreams
          </h2>
          <p className="text-xs text-slate-500">
            Set a target, and Sakhi calculates the exact monthly savings needed
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs transition"
        >
          <Plus size={14} /> New Goal
        </button>
      </div>

      {/* Goal Cards */}
      {goals.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <Target size={24} />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">No Goals Created Yet</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 mb-4">
            Dreaming of education, a shop, or a better house? Add a goal to let Sakhi plan your monthly savings.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-emerald-700 transition"
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-black text-slate-900 mb-1">Create Savings Goal</h3>
            <p className="text-xs text-slate-500 mb-4">
              What are you saving for?
            </p>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Goal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Daughter's College Fees"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target (₹)</label>
                  <input
                    type="number"
                    required
                    min="100"
                    placeholder="50000"
                    value={formData.target_amount}
                    onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Saved So Far (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="10000"
                    value={formData.current_amount}
                    onChange={(e) => setFormData({ ...formData, current_amount: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Time Horizon (Months)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="120"
                  placeholder="12"
                  value={formData.target_date}
                  onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-xs"
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl border border-slate-100">
            <h3 className="text-base font-black text-slate-900 mb-1">Add Savings to Goal</h3>
            <p className="text-xs text-slate-500 mb-3">
              {addProgressGoal.name} (Saved so far: ₹{Number(addProgressGoal.current_amount).toLocaleString('en-IN')})
            </p>

            <form onSubmit={handleAddSavings} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Amount Saved Today (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 500"
                  value={progressAmount}
                  onChange={(e) => setProgressAmount(e.target.value)}
                  className="w-full px-3 py-2 text-lg font-bold border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddProgressGoal(null)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-xs"
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
