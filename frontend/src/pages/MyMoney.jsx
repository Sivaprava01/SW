import React, { useState, useEffect } from 'react';
import { Wallet, ArrowDownLeft, ArrowUpRight, TrendingUp, AlertTriangle, ShieldCheck, Plus } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { api } from '../services/api';
import MoneyCard from '../components/MoneyCard';
import ProgressBar from '../components/ProgressBar';
import TransactionList from '../components/TransactionList';

export default function MyMoney() {
  const { user, financialHealth, refreshFinancialData } = useUser();
  const [transactions, setTransactions] = useState([]);
  const [loadingTxs, setLoadingTxs] = useState(false);

  const fetchTxs = async () => {
    if (!user) return;
    setLoadingTxs(true);
    try {
      const txList = await api.getTransactions(user.id);
      setTransactions(txList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTxs(false);
    }
  };

  useEffect(() => {
    fetchTxs();
  }, [user]);

  const handleAddTransaction = async (txData) => {
    if (!user) return;
    try {
      await api.createTransaction({
        ...txData,
        user_id: user.id
      });
      await fetchTxs();
      await refreshFinancialData(user.id);
    } catch (err) {
      alert(err.message || 'Failed to add transaction');
    }
  };

  const handleDeleteTransaction = async (txId) => {
    try {
      await api.deleteTransaction(txId);
      await fetchTxs();
      await refreshFinancialData(user.id);
    } catch (err) {
      alert(err.message || 'Failed to delete transaction');
    }
  };

  const income = financialHealth?.monthly_income ?? user?.monthly_income ?? 0;
  const expenses = financialHealth?.monthly_expenses ?? user?.monthly_expenses ?? 0;
  const surplus = financialHealth?.surplus ?? (income - expenses);
  const savings = financialHealth?.savings ?? user?.savings ?? 0;
  const debt = financialHealth?.debt ?? user?.debt ?? 0;
  const ef = financialHealth?.emergency_fund;

  return (
    <div className="space-y-4">
      {/* Top Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            My Money & Health
          </h2>
          <p className="text-xs text-slate-500">
            Real-time calculations from your logged income & expenses
          </p>
        </div>
      </div>

      {/* Primary Financial Overview Grid */}
      <div className="grid grid-cols-2 gap-3">
        <MoneyCard
          title="Income"
          amount={income}
          subtitle="Monthly inflow"
          icon={ArrowDownLeft}
          variant="income"
        />

        <MoneyCard
          title="Expense"
          amount={expenses}
          subtitle="Monthly outflow"
          icon={ArrowUpRight}
          variant="expense"
        />

        <MoneyCard
          title="Surplus"
          amount={surplus}
          subtitle={surplus >= 0 ? "Left to save & invest" : "Monthly deficit"}
          icon={TrendingUp}
          variant="surplus"
        />

        <MoneyCard
          title="Savings"
          amount={savings}
          subtitle="In bank & cash"
          icon={ShieldCheck}
          variant="savings"
        />
      </div>

      {/* Debt Card */}
      {debt > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-rose-100 text-rose-700 rounded-xl mt-0.5">
              <AlertTriangle size={20} />
            </div>
            <div>
              <span className="text-xs font-bold text-rose-900 uppercase tracking-wider block">
                Total Outstanding Debt
              </span>
              <div className="text-xl font-black text-rose-950">
                ₹{Number(debt).toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-rose-700 mt-0.5">
                Suggested payment: ~₹{Math.min(surplus, Math.max(1000, Math.round(surplus * 0.5))).toLocaleString('en-IN')}/mo from surplus
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Fund Progress */}
      {ef && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span>🛡 Emergency Fund</span>
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              {ef.percent_complete}% complete
            </span>
          </div>

          <div className="text-base font-black text-slate-900 mb-1.5">
            ₹{Number(ef.current).toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-400">/ ₹{Number(ef.target).toLocaleString('en-IN')}</span>
          </div>

          <ProgressBar value={ef.current} max={ef.target} color="bg-teal-600" />
          
          <p className="text-xs text-slate-500 mt-2 font-medium">
            Build your safety net (3 months of household expenses)
          </p>
        </div>
      )}

      {/* Transaction Log Feed */}
      <div className="pt-2">
        <TransactionList
          transactions={transactions}
          onAddTransaction={handleAddTransaction}
          onDeleteTransaction={handleDeleteTransaction}
        />
      </div>
    </div>
  );
}
