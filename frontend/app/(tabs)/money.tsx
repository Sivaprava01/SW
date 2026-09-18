import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SakhiHeader } from '@/components/SakhiHeader';
import { LogTransactionModal } from '@/components/LogTransactionModal';
import { AskSakhiModal } from '@/components/AskSakhiModal';
import { ProfileModal } from '@/components/ProfileModal';
import { TutorialTarget } from '@/components/tutorial/TutorialTarget';
import { useApp } from '@/context/AppContext';
import { TransactionResponse } from '@/types/transaction';

export default function MoneyScreen() {
  const router = useRouter();
  const {
    userId,
    financialSummary,
    transactions,
    debts,
    debtSnowball,
    refreshFinancialSummary,
    refreshTransactions,
    deleteTransaction,
    refreshDebts,
    refreshDebtSnowball,
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [logModalVisible, setLogModalVisible] = useState(false);
  const [askSakhiVisible, setAskSakhiVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    if (!userId) return;
    await Promise.allSettled([
      refreshFinancialSummary(),
      refreshTransactions(),
      refreshDebts(),
      refreshDebtSnowball(),
    ]);
  }, [userId, refreshFinancialSummary, refreshTransactions, refreshDebts, refreshDebtSnowball]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  const handleDelete = (tx: TransactionResponse) => {
    Alert.alert(
      'Delete Transaction',
      `Are you sure you want to delete "${tx.category}" (₹${tx.amount.toLocaleString('en-IN')})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTransaction(tx.id);
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete transaction');
            }
          },
        },
      ]
    );
  };

  const getCategoryIcon = (category: string, type: 'income' | 'expense'): keyof typeof MaterialIcons.glyphMap => {
    const cat = category.toLowerCase();
    if (cat.includes('tailor') || cat.includes('cloth')) return 'checkroom';
    if (cat.includes('food') || cat.includes('grocer') || cat.includes('ration')) return 'shopping-basket';
    if (cat.includes('shg') || cat.includes('group')) return 'groups';
    if (cat.includes('market') || cat.includes('sale') || cat.includes('shop')) return 'storefront';
    if (cat.includes('salary') || cat.includes('wage')) return 'payments';
    if (cat.includes('agri') || cat.includes('crop') || cat.includes('dairy')) return 'agriculture';
    if (cat.includes('rent') || cat.includes('electric') || cat.includes('light')) return 'lightbulb';
    if (cat.includes('health') || cat.includes('med')) return 'medical-services';
    if (cat.includes('school') || cat.includes('fee') || cat.includes('child')) return 'school';
    if (cat.includes('loan') || cat.includes('emi')) return 'assignment-return';
    if (cat.includes('festival') || cat.includes('fam')) return 'celebration';
    return type === 'income' ? 'savings' : 'receipt';
  };

  const formatDateDisplay = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const today = new Date();
      const isToday =
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear();
      if (isToday) return 'Today';
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    } catch {
      return dateStr;
    }
  };

  const income = financialSummary?.monthly_income ?? 18500;
  const expense = financialSummary?.monthly_expenses ?? 14300;
  const savings = financialSummary?.total_savings ?? 18000;
  const debt = financialSummary?.total_debt ?? (debtSnowball?.total_debt_balance ?? 12000);
  const emergencyTarget = financialSummary?.emergency_target ?? 42900;
  const emergencyProgress = financialSummary?.emergency_progress_percentage ?? Math.min(100, Math.round((savings / (emergencyTarget || 1)) * 100));

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 90 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#9d4300" colors={['#9d4300']} />
        }>
        {/* Top App Bar / Header */}
        <SakhiHeader
          logoOnly={true}
          onPressProfile={() => setProfileVisible(true)}
          onPressMenu={() => router.push('/settings' as any)}
        />

        <View className="px-4 py-3">
          {/* Title Bar */}
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-bold text-on-surface">My Money & Health</Text>
            <View className="flex-row items-center bg-surface-container-high px-2.5 py-1 rounded-full">
              <MaterialIcons name="sync" size={14} color="#9d4300" />
              <Text className="text-[11px] text-on-surface-variant font-medium ml-1">
                {financialSummary?.health_status || 'Healthy Surplus'}
              </Text>
            </View>
          </View>

          {/* 3 Metric Cards */}
          <TutorialTarget id="money-surplus-card">
            <View className="flex-row justify-between gap-2 mb-3">
              {/* Income */}
              <View className="flex-1 bg-surface-container-lowest rounded-xl p-2.5 shadow-xs border border-surface-container-highest/60 justify-between min-h-[75px]">
                <View className="flex-row items-center justify-between">
                  <Text className="text-[11px] text-on-surface-variant font-medium">Income</Text>
                  <View className="w-6 h-6 rounded-full bg-surface-container-low items-center justify-center">
                    <MaterialIcons name="arrow-downward" size={15} color="#2e7d32" />
                  </View>
                </View>
                <Text className="text-base font-bold text-on-surface">₹{income.toLocaleString('en-IN')}</Text>
              </View>

              {/* Expense */}
              <View className="flex-1 bg-surface-container-lowest rounded-xl p-2.5 shadow-xs border border-surface-container-highest/60 justify-between min-h-[75px]">
                <View className="flex-row items-center justify-between">
                  <Text className="text-[11px] text-on-surface-variant font-medium">Expense</Text>
                  <View className="w-6 h-6 rounded-full bg-error-container items-center justify-center">
                    <MaterialIcons name="arrow-upward" size={15} color="#ba1a1a" />
                  </View>
                </View>
                <Text className="text-base font-bold text-on-surface">₹{expense.toLocaleString('en-IN')}</Text>
              </View>

              {/* Savings */}
              <View className="flex-1 bg-surface-container-lowest rounded-xl p-2.5 shadow-xs border border-surface-container-highest/60 justify-between min-h-[75px]">
                <View className="flex-row items-center justify-between">
                  <Text className="text-[11px] text-on-surface-variant font-medium">Savings</Text>
                  <View className="w-6 h-6 rounded-full bg-surface-container items-center justify-center">
                    <MaterialIcons name="security" size={15} color="#221a0e" />
                  </View>
                </View>
                <Text className="text-base font-bold text-on-surface">₹{savings.toLocaleString('en-IN')}</Text>
              </View>
            </View>
          </TutorialTarget>

          {/* Total Outstanding Debt */}
          <View className="bg-error-container rounded-xl p-3.5 mb-3 shadow-xs border border-error/20 flex-row items-start justify-between">
            <View className="flex-row items-start flex-1 mr-2">
              <View className="w-9 h-9 rounded-full bg-error items-center justify-center mr-2.5 shadow-xs flex-shrink-0">
                <MaterialIcons name="warning" size={20} color="#ffffff" />
              </View>
              <View className="flex-col flex-1">
                <Text className="text-xs font-bold text-on-error-container">Total Outstanding Debt</Text>
                <Text className="text-xl font-bold text-on-error-container mt-0.5">₹{debt.toLocaleString('en-IN')}</Text>
                {debtSnowball && debtSnowball.total_monthly_interest_drain > 0 && (
                  <Text className="text-[11px] text-on-error-container/80 mt-0.5 font-medium">
                    ₹{Math.round(debtSnowball.total_monthly_interest_drain).toLocaleString('en-IN')}/mo interest drain
                  </Text>
                )}
              </View>
            </View>
            {debts.length > 0 && (
              <View className="bg-surface-container-lowest/80 px-2 py-0.5 rounded">
                <Text className="text-[10px] font-bold text-error">{debts.length} active loans</Text>
              </View>
            )}
          </View>

          {/* Subsidized SHG Refinancing Banner (if moneylender debt exists) */}
          {debtSnowball && debtSnowball.potential_shg_refinance_monthly_savings > 0 && (
            <View className="bg-secondary-container/20 rounded-xl p-3 mb-3 border border-secondary-container/40 flex-row items-center justify-between">
              <View className="flex-row items-center flex-1 mr-2">
                <View className="w-8 h-8 rounded-full bg-secondary-container items-center justify-center mr-2 flex-shrink-0">
                  <MaterialIcons name="swap-horiz" size={18} color="#9d4300" />
                </View>
                <View className="flex-col flex-1">
                  <Text className="text-xs font-bold text-on-surface">SHG Refinancing Arbitrage</Text>
                  <Text className="text-[11px] text-on-surface-variant">
                    Save <Text className="font-bold text-primary">₹{Math.round(debtSnowball.potential_shg_refinance_monthly_savings).toLocaleString('en-IN')}/mo</Text> by moving moneylender debt to SHG (12% APR)
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Emergency Fund */}
          <View className="bg-surface-container-lowest rounded-xl p-3.5 mb-3.5 shadow-xs border border-surface-container-highest/60">
            <View className="flex-row items-center justify-between mb-1.5">
              <View className="flex-row items-center">
                <View className="w-7 h-7 rounded-full bg-primary-fixed items-center justify-center mr-2">
                  <MaterialIcons name="shield" size={16} color="#9d4300" />
                </View>
                <Text className="text-xs font-bold text-on-surface">Emergency Fund</Text>
              </View>
              <View className="bg-surface-container-high px-2 py-0.5 rounded-full">
                <Text className="text-[10px] font-bold text-primary">{Math.round(emergencyProgress)}% complete</Text>
              </View>
            </View>

            <View className="flex-row justify-between items-baseline mb-1">
              <Text className="text-base font-bold text-on-surface">₹{savings.toLocaleString('en-IN')}</Text>
              <Text className="text-xs font-bold text-on-surface-variant">/ ₹{emergencyTarget.toLocaleString('en-IN')}</Text>
            </View>
            <View className="w-full bg-surface-container-highest h-2.5 rounded-full overflow-hidden">
              <View className="bg-primary-container h-full rounded-full" style={{ width: `${Math.min(100, emergencyProgress)}%` }} />
            </View>
          </View>

          {/* Recent Money Log */}
          <View className="mb-3.5">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm font-bold text-on-surface">Recent Money Log</Text>
              <TutorialTarget id="money-add-btn" onTargetPress={() => setLogModalVisible(true)}>
                <TouchableOpacity
                  onPress={() => setLogModalVisible(true)}
                  className="h-8 px-2.5 rounded-lg bg-primary-container flex-row items-center shadow-xs active:scale-95">
                  <MaterialIcons name="add" size={16} color="#ffffff" />
                  <Text className="text-xs font-bold text-on-primary ml-0.5">Log Money</Text>
                </TouchableOpacity>
              </TutorialTarget>
            </View>

            {/* Filter Pills */}
            <TutorialTarget id="money-filters">
              <View className="flex-row gap-1.5 mb-2.5">
                <TouchableOpacity
                  onPress={() => setFilter('all')}
                  className={`h-7 px-3.5 rounded-full items-center justify-center ${
                    filter === 'all'
                      ? 'bg-primary-container shadow-xs'
                      : 'bg-surface-container-lowest border border-surface-container-highest/60'
                  } active:scale-95`}>
                  <Text
                    className={`text-xs font-semibold ${
                      filter === 'all' ? 'text-on-primary' : 'text-on-surface-variant'
                    }`}>
                    All ({transactions.length})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setFilter('income')}
                  className={`h-7 px-3.5 rounded-full items-center justify-center ${
                    filter === 'income'
                      ? 'bg-primary-container shadow-xs'
                      : 'bg-surface-container-lowest border border-surface-container-highest/60'
                  } active:scale-95`}>
                  <Text
                    className={`text-xs font-semibold ${
                      filter === 'income' ? 'text-on-primary' : 'text-on-surface-variant'
                    }`}>
                    Income
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setFilter('expense')}
                  className={`h-7 px-3.5 rounded-full items-center justify-center ${
                    filter === 'expense'
                      ? 'bg-primary-container shadow-xs'
                      : 'bg-surface-container-lowest border border-surface-container-highest/60'
                  } active:scale-95`}>
                  <Text
                    className={`text-xs font-semibold ${
                      filter === 'expense' ? 'text-on-primary' : 'text-on-surface-variant'
                    }`}>
                    Expense
                  </Text>
                </TouchableOpacity>
              </View>
            </TutorialTarget>

            {/* Transactions List */}
            {filteredTransactions.length === 0 ? (
              <View className="bg-surface-container-lowest rounded-xl p-6 border border-surface-container-highest/60 items-center justify-center">
                <MaterialIcons name="receipt-long" size={32} color="#8c7164" />
                <Text className="text-sm font-bold text-on-surface mt-2">No transactions recorded</Text>
                <Text className="text-xs text-on-surface-variant text-center mt-1">
                  Tap "+ Log Money" to record your daily sales or household expenses.
                </Text>
              </View>
            ) : (
              <View className="flex-col gap-1.5">
                {filteredTransactions.map((tx) => (
                  <View
                    key={tx.id}
                    className="bg-surface-container-lowest rounded-xl p-3 shadow-xs border border-surface-container-highest/60 flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1 mr-2">
                      <View
                        className={`w-9 h-9 rounded-full items-center justify-center mr-2.5 flex-shrink-0 ${
                          tx.type === 'income'
                            ? 'bg-surface-container-low text-[#2e7d32]'
                            : 'bg-error-container'
                        }`}>
                        <MaterialIcons
                          name={getCategoryIcon(tx.category, tx.type)}
                          size={18}
                          color={tx.type === 'income' ? '#2e7d32' : '#ba1a1a'}
                        />
                      </View>
                      <View className="flex-col flex-1 min-w-0">
                        <Text className="text-xs font-bold text-on-surface truncate">{tx.category}</Text>
                        <Text className="text-[10px] text-on-surface-variant mt-0.5">
                          {formatDateDisplay(tx.date)} {tx.description ? `• ${tx.description}` : ''}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center">
                      <Text
                        className={`text-xs font-bold mr-2 ${
                          tx.type === 'income' ? 'text-[#2e7d32]' : 'text-on-surface'
                        }`}>
                        {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleDelete(tx)}
                        className="w-7 h-7 rounded-full items-center justify-center active:scale-90 bg-surface-container-low">
                        <MaterialIcons name="delete-outline" size={15} color="#ba1a1a" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Floating Ask Sakhi button */}
      <View className="absolute bottom-20 right-4 z-40">
        <TouchableOpacity
          onPress={() => setAskSakhiVisible(true)}
          className="h-11 px-3.5 rounded-full bg-primary-container flex-row items-center shadow-lg active:scale-95">
          <MaterialIcons name="record-voice-over" size={18} color="#ffffff" />
          <Text className="text-xs font-bold text-on-primary ml-1.5">Ask Sakhi</Text>
        </TouchableOpacity>
      </View>

      <LogTransactionModal visible={logModalVisible} onClose={() => setLogModalVisible(false)} />
      <AskSakhiModal visible={askSakhiVisible} onClose={() => setAskSakhiVisible(false)} />
      <ProfileModal visible={profileVisible} onClose={() => setProfileVisible(false)} />
    </SafeAreaView>
  );
}
