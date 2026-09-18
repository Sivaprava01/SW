import React, { useState } from 'react';
import { Plus, ArrowUpRight, ArrowDownLeft, Trash2, Calendar, Tag } from 'lucide-react';

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
        <h3 className="font-bold text-slate-800 text-sm">Recent Transactions</h3>
        <button
          onClick={() => setShowModal(true)}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs transition cursor-pointer min-h-[36px]"
        >
          <Plus size={14} /> Log Entry
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-500">
          <p className="text-sm font-medium">No transactions recorded yet.</p>
          <p className="text-xs text-slate-400 mt-1">Tap "Log Entry" to track your daily income or household expense.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map((t) => {
            const isIncome = t.type === 'income';
            return (
              <div
                key={t.id}
                className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center justify-between hover:border-slate-300 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isIncome ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {isIncome ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{t.category}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span>{t.date}</span>
                      {t.description && <span>• {t.description}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`text-sm font-black ${
                      isIncome ? 'text-emerald-700' : 'text-slate-900'
                    }`}
                  >
                    {isIncome ? '+' : '-'}₹{Number(t.amount).toLocaleString('en-IN')}
                  </div>
                  {onDeleteTransaction && (
                    <button
                      onClick={() => onDeleteTransaction(t.id)}
                      className="text-slate-300 hover:text-rose-500 transition p-2 cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                      title="Delete entry"
                      aria-label="Delete transaction"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl border border-slate-100 animate-in zoom-in-95">
            <h3 className="text-lg font-black text-slate-900 mb-1">Add Money Entry</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter your income or expense. Sakhi will recalculate your surplus.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'income', category: categories.income[0] })}
                  className={`py-2 text-xs font-bold rounded-xl border transition min-h-[44px] cursor-pointer ${
                    formData.type === 'income'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  + Income
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'expense', category: categories.expense[0] })}
                  className={`py-2 text-xs font-bold rounded-xl border transition min-h-[44px] cursor-pointer ${
                    formData.type === 'expense'
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  - Expense
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 1500"
                  required
                  min="1"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full text-lg font-bold px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  {categories[formData.type].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date (Today or earlier)</label>
                <input
                  type="date"
                  max={today}
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Note (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Sold tomato harvest"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition min-h-[44px] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-sm min-h-[44px] cursor-pointer"
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
