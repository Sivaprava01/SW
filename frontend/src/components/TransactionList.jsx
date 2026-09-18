import React, { useState } from 'react';
import {
  IconPlus,
  IconArrowUpRight,
  IconArrowDownLeft,
  IconTrash,
  IconCalendar,
  IconTag,
  IconX,
} from '@tabler/icons-react';

export default function TransactionList({ transactions = [], onAddTransaction, onDeleteTransaction }) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: 'Groceries & Food',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const categories = {
    income: [
      'Salary / Wages',
      'Vegetable / Farm Sales',
      'Tailoring / Stitching',
      'Small Business / Kirana',
      'SHG Distribution',
      'Government Support',
      'Other Income'
    ],
    expense: [
      'Groceries & Food',
      'House Rent',
      'School Fees',
      'Medicine / Healthcare',
      'Debt / Loan Repayment',
      'Farming Supplies',
      'Travel / Transport',
      'Electricity & Mobile',
      'Other Expense'
    ]
  };

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!formData.date) {
      alert('Please select a valid date');
      return;
    }

    if (formData.date > today) {
      alert('Transaction date cannot be in the future. Please select today or an earlier date.');
      return;
    }

    onAddTransaction({
      ...formData,
      amount: parseFloat(formData.amount)
    });
    setFormData({
      amount: '',
      type: 'expense',
      category: categories.expense[0],
      date: today,
      description: '',
    });
    setShowModal(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-stone-800 dark:text-stone-200 text-sm">
          Recent Transactions
        </h3>
        <button
          onClick={() => setShowModal(true)}
          className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer min-h-[36px]"
        >
          <IconPlus size={15} />
          <span>Log Entry</span>
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="bg-[#fff1e3]/40 dark:bg-slate-900 border border-dashed border-amber-200 dark:border-slate-800 rounded-2xl p-6 text-center text-stone-500 dark:text-stone-400">
          <p className="text-sm font-bold">No transactions recorded yet.</p>
          <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">
            Tap "Log Entry" to track your daily income or household expense.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map((t) => {
            const isIncome = t.type === 'income';
            return (
              <div
                key={t.id}
                className="bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 rounded-2xl p-3 flex items-center justify-between hover:border-amber-300 dark:hover:border-slate-700 transition shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isIncome
                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                        : 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                    }`}
                  >
                    {isIncome ? <IconArrowDownLeft size={18} /> : <IconArrowUpRight size={18} />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      {t.category}
                    </div>
                    <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-2">
                      <span>{t.date}</span>
                      {t.description && <span>• {t.description}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={`text-sm font-black ${
                      isIncome
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-stone-900 dark:text-stone-100'
                    }`}
                  >
                    {isIncome ? '+' : '-'}₹{Number(t.amount).toLocaleString('en-IN')}
                  </div>
                  {onDeleteTransaction && (
                    <button
                      onClick={() => onDeleteTransaction(t.id)}
                      className="text-stone-300 dark:text-stone-600 hover:text-rose-500 dark:hover:text-rose-400 transition p-2 cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                      title="Delete entry"
                      aria-label="Delete transaction"
                    >
                      <IconTrash size={15} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Transaction Modal (Stitch Modal Pattern) */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm p-5 shadow-2xl border border-amber-100 dark:border-slate-800 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-black text-stone-900 dark:text-stone-100">
                Add Money Entry
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition"
              >
                <IconX size={18} />
              </button>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
              Enter your income or expense. Sakhi will recalculate your surplus.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'income', category: categories.income[0] })}
                  className={`py-2 text-xs font-bold rounded-xl border transition min-h-[44px] cursor-pointer ${
                    formData.type === 'income'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-stone-50 dark:bg-slate-800 text-stone-700 dark:text-stone-300 border-amber-100 dark:border-slate-700 hover:bg-stone-100'
                  }`}
                >
                  + Income
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'expense', category: categories.expense[0] })}
                  className={`py-2 text-xs font-bold rounded-xl border transition min-h-[44px] cursor-pointer ${
                    formData.type === 'expense'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-stone-50 dark:bg-slate-800 text-stone-700 dark:text-stone-300 border-amber-100 dark:border-slate-700 hover:bg-stone-100'
                  }`}
                >
                  - Expense
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 1500"
                  required
                  min="1"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full text-lg font-black px-3.5 py-2.5 bg-stone-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
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
                  {categories[formData.type].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Date (Today or earlier)
                </label>
                <input
                  type="date"
                  max={today}
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sold tomato harvest"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 rounded-xl text-sm text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-stone-700 dark:text-stone-300 font-bold rounded-xl text-xs transition min-h-[44px] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs transition shadow-sm min-h-[44px] cursor-pointer"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
