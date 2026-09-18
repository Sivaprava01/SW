import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SakhiHeader } from '@/components/SakhiHeader';
import { LogTransactionModal } from '@/components/LogTransactionModal';
import { AskSakhiModal } from '@/components/AskSakhiModal';
import { ProfileModal } from '@/components/ProfileModal';

export default function MoneyScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [logModalVisible, setLogModalVisible] = useState(false);
  const [askSakhiVisible, setAskSakhiVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);

  const transactions = [
    {
      id: '1',
      title: 'Tailoring & Stitched Clothes',
      sub: 'Yesterday • Shop Sales',
      amount: '+₹3,200',
      type: 'income',
      icon: 'checkroom' as const,
    },
    {
      id: '2',
      title: 'Food & Rice Ration',
      sub: '3 days ago • Groceries',
      amount: '-₹1,850',
      type: 'expense',
      icon: 'shopping-basket' as const,
    },
    {
      id: '3',
      title: 'SHG Monthly Contribution',
      sub: '5 days ago • Group Savings',
      amount: '-₹500',
      type: 'expense',
      icon: 'groups' as const,
    },
    {
      id: '4',
      title: 'Vegetable Market Sales',
      sub: 'Last week • Market',
      amount: '+₹1,400',
      type: 'income',
      icon: 'storefront' as const,
    },
  ];

  const filtered = transactions.filter(
    (t) => filter === 'all' || t.type === filter
  );

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 90 }}>
        {/* Top App Bar / Header (Scrolls with page content) */}
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
            <Text className="text-[11px] text-on-surface-variant font-medium ml-1">Updated today</Text>
          </View>
        </View>

        {/* 3 Metric Cards */}
        <View className="flex-row justify-between gap-2 mb-3">
          {/* Income */}
          <View className="flex-1 bg-surface-container-lowest rounded-xl p-2.5 shadow-xs border border-surface-container-highest/60 justify-between min-h-[75px]">
            <View className="flex-row items-center justify-between">
              <Text className="text-[11px] text-on-surface-variant font-medium">Income</Text>
              <View className="w-6 h-6 rounded-full bg-surface-container-low items-center justify-center">
                <MaterialIcons name="arrow-downward" size={15} color="#2e7d32" />
              </View>
            </View>
            <Text className="text-base font-bold text-on-surface">₹18,500</Text>
          </View>

          {/* Expense */}
          <View className="flex-1 bg-surface-container-lowest rounded-xl p-2.5 shadow-xs border border-surface-container-highest/60 justify-between min-h-[75px]">
            <View className="flex-row items-center justify-between">
              <Text className="text-[11px] text-on-surface-variant font-medium">Expense</Text>
              <View className="w-6 h-6 rounded-full bg-error-container items-center justify-center">
                <MaterialIcons name="arrow-upward" size={15} color="#ba1a1a" />
              </View>
            </View>
            <Text className="text-base font-bold text-on-surface">₹14,300</Text>
          </View>

          {/* Savings */}
          <View className="flex-1 bg-surface-container-lowest rounded-xl p-2.5 shadow-xs border border-surface-container-highest/60 justify-between min-h-[75px]">
            <View className="flex-row items-center justify-between">
              <Text className="text-[11px] text-on-surface-variant font-medium">Savings</Text>
              <View className="w-6 h-6 rounded-full bg-surface-container items-center justify-center">
                <MaterialIcons name="security" size={15} color="#221a0e" />
              </View>
            </View>
            <Text className="text-base font-bold text-on-surface">₹18,000</Text>
          </View>
        </View>

        {/* Total Outstanding Debt */}
        <View className="bg-error-container rounded-xl p-3.5 mb-3 shadow-xs border border-error/20 flex-row items-start">
          <View className="w-9 h-9 rounded-full bg-error items-center justify-center mr-2.5 shadow-xs flex-shrink-0">
            <MaterialIcons name="warning" size={20} color="#ffffff" />
          </View>
          <View className="flex-col flex-1">
            <Text className="text-xs font-bold text-on-error-container">Total Outstanding Debt</Text>
            <Text className="text-xl font-bold text-on-error-container mt-0.5">₹12,000</Text>
          </View>
        </View>

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
              <Text className="text-[10px] font-bold text-primary">42% complete</Text>
            </View>
          </View>

          <View className="flex-row justify-between items-baseline mb-1">
            <Text className="text-base font-bold text-on-surface">₹18,000</Text>
            <Text className="text-xs font-bold text-on-surface-variant">/ ₹42,900</Text>
          </View>
          <View className="w-full bg-surface-container-highest h-2.5 rounded-full overflow-hidden">
            <View className="bg-primary-container h-full rounded-full" style={{ width: '42%' }} />
          </View>
        </View>

        {/* Recent Money Log */}
        <View className="mb-3.5">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-sm font-bold text-on-surface">Recent Money Log</Text>
            <TouchableOpacity
              onPress={() => setLogModalVisible(true)}
              className="h-8 px-2.5 rounded-lg bg-primary-container flex-row items-center shadow-xs active:scale-95">
              <MaterialIcons name="add" size={16} color="#ffffff" />
              <Text className="text-xs font-bold text-on-primary ml-0.5">Log Money</Text>
            </TouchableOpacity>
          </View>

          {/* Filter Pills */}
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
                All
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

          {/* Transactions List */}
          <View className="flex-col gap-1.5">
            {filtered.map((tx) => (
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
                      name={tx.icon}
                      size={18}
                      color={tx.type === 'income' ? '#2e7d32' : '#ba1a1a'}
                    />
                  </View>
                  <View className="flex-col flex-1 min-w-0">
                    <Text className="text-xs font-bold text-on-surface truncate">{tx.title}</Text>
                    <Text className="text-[10px] text-on-surface-variant mt-0.5">{tx.sub}</Text>
                  </View>
                </View>
                <Text
                  className={`text-xs font-bold ${
                    tx.type === 'income' ? 'text-[#2e7d32]' : 'text-on-surface'
                  }`}>
                  {tx.amount}
                </Text>
              </View>
            ))}
          </View>
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
