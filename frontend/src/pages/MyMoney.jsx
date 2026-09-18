import React, { useState, useEffect } from 'react';
import {
  IconArrowDownLeft,
  IconArrowUpRight,
  IconTrendingUp,
  IconAlertTriangle,
  IconShieldCheck,
  IconPlus,
} from '@tabler/icons-react';
import { useUser } from '../context/UserContext';
import { api } from '../services/api';
import MoneyCard from '../components/MoneyCard';
import ProgressBar from '../components/ProgressBar';
import TransactionList from '../components/TransactionList';

export default function MyMoney() {
  const { user, financialHealth, refreshFinancialData, t } = useUser();
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
    <div className="space-y-4 pb-6">
      {/* Top Title */}
      <div>
        <h2 className="text-xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
          {t('nav_money') || 'My Money'} & Cashflow
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Real-time calculations from your logged income & expenses
        </p>
      </div>

      {/* Primary Financial Overview Grid */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        <MoneyCard
          title={t('income') || 'Income'}
          amount={income}
          subtitle="Monthly inflow"
          icon={IconArrowDownLeft}
          variant="income"
        />

        <MoneyCard
          title={t('expense') || 'Expense'}
          amount={expenses}
          subtitle="Monthly outflow"
          icon={IconArrowUpRight}
          variant="expense"
        />

        <MoneyCard
          title={t('surplus') || 'Surplus'}
          amount={surplus}
          subtitle={surplus >= 0 ? "Safe to save & invest" : "Monthly deficit"}
          icon={IconTrendingUp}
          variant="surplus"
        />

        <MoneyCard
          title={t('savings') || 'Savings'}
          amount={savings}
          subtitle="In bank & cash"
          icon={IconShieldCheck}
          variant="savings"
        />
      </div>

      {/* Debt Card */}
      {debt > 0 && (
        <div className="bg-rose-50/90 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 rounded-xl mt-0.5 shrink-0">
              <IconAlertTriangle size={20} />
            </div>
            <div>
              <span className="text-[11px] font-bold text-rose-900 dark:text-rose-300 uppercase tracking-wider block">
                Total Outstanding Debt
              </span>
              <div className="text-xl font-black text-rose-950 dark:text-rose-100">
                ₹{Number(debt).toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-rose-700 dark:text-rose-300/90 mt-0.5 font-medium">
                Suggested payment: ~₹{Math.min(surplus, Math.max(1000, Math.round(surplus * 0.5))).toLocaleString('en-IN')}/mo from surplus
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Fund Progress */}
      {ef && (
        <div className="bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
              <span>🛡 Emergency Fund</span>
            </span>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-300/40">
              {ef.percent_complete}% complete
            </span>
          </div>

          <div className="text-base font-black text-stone-900 dark:text-stone-100 mb-1.5">
            ₹{Number(ef.current).toLocaleString('en-IN')}{' '}
            <span className="text-xs font-normal text-stone-400">
              / ₹{Number(ef.target).toLocaleString('en-IN')}
            </span>
          </div>

          <ProgressBar value={ef.current} max={ef.target} color="bg-emerald-600 dark:bg-emerald-500" />
          
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 font-medium">
            Build your safety net (3 months of household expenses)
          </p>
        </div>
      )}

      {/* Transaction Log Feed */}
      <div className="pt-1">
        <TransactionList
          transactions={transactions}
          onAddTransaction={handleAddTransaction}
          onDeleteTransaction={handleDeleteTransaction}
        />
      </div>
    </div>
  );
}
