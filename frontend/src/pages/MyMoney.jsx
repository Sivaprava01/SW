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
        <h2 className="font-headline text-xl font-black text-[#221a0e] dark:text-[#FFF5EB] tracking-tight">
          {t('nav_money') || 'My Money'} & Cashflow
        </h2>
        <p className="text-xs text-stone-500 dark:text-[#A8988A]">
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
        <div className="bg-rose-50/90 dark:bg-[#28211C] border border-rose-200 dark:border-[#3D332B] rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-rose-100 dark:bg-[#1e1b19] text-rose-700 dark:text-rose-400 rounded-xl mt-0.5 shrink-0">
              <IconAlertTriangle size={20} />
            </div>
            <div>
              <span className="text-[11px] font-bold text-rose-900 dark:text-rose-400 uppercase tracking-wider block">
                Total Outstanding Debt
              </span>
              <div className="font-headline text-xl font-black text-rose-950 dark:text-[#FFF5EB]">
                ₹{Number(debt).toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-rose-700 dark:text-[#D4C4B5] mt-0.5 font-medium">
                Suggested payment: ~₹{Math.min(surplus, Math.max(1000, Math.round(surplus * 0.5))).toLocaleString('en-IN')}/mo from surplus
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Fund Progress */}
      {ef && (
        <div className="bg-white dark:bg-[#1e1b19] border border-amber-100 dark:border-[#3D332B] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[11px] font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wider block">
                3-Month Emergency Fund Shield
              </span>
              <div className="text-sm font-bold text-[#221a0e] dark:text-[#FFF5EB]">
                ₹{Number(ef.current_amount || savings).toLocaleString('en-IN')} of ₹{Number(ef.target_amount || expenses * 3).toLocaleString('en-IN')}
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-teal-100 dark:bg-[#28211C] text-teal-800 dark:text-teal-300 rounded-full font-mono">
              {ef.percent_complete || Math.round(((savings) / Math.max(1, expenses * 3)) * 100)}%
            </span>
          </div>
          <ProgressBar value={ef.current_amount || savings} max={ef.target_amount || Math.max(1, expenses * 3)} />
        </div>
      )}

      {/* Transaction Feed */}
      <TransactionList
        transactions={transactions}
        onAddTransaction={handleAddTransaction}
        onDeleteTransaction={handleDeleteTransaction}
      />
    </div>
  );
}
