import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SakhiHeader } from '@/components/SakhiHeader';
import { CreateDreamPotModal } from '@/components/CreateDreamPotModal';
import { LogTransactionModal } from '@/components/LogTransactionModal';
import { AskSakhiModal } from '@/components/AskSakhiModal';
import { ProfileModal } from '@/components/ProfileModal';
import { useApp, Goal } from '@/context/AppContext';

export default function GoalsScreen() {
  const router = useRouter();
  const { goals, addGoal, updateGoal, deleteGoal } = useApp();

  const [filter, setFilter] = useState<'all' | 'education' | 'business' | 'emergency'>('all');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [activeMenuGoal, setActiveMenuGoal] = useState<Goal | null>(null);
  const [addMoneyModalVisible, setAddMoneyModalVisible] = useState(false);
  const [askSakhiVisible, setAskSakhiVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);

  const filteredGoals = goals.filter(
    (g) => filter === 'all' || g.filterCat === filter
  );

  const handleEditGoal = (goal: Goal) => {
    setActiveMenuGoal(null);
    setEditingGoal(goal);
    setCreateModalVisible(true);
  };

  const handleDeleteGoal = (goal: Goal) => {
    setActiveMenuGoal(null);
    deleteGoal(goal.id);
  };

  const handleCompleteGoal = (goal: Goal) => {
    setActiveMenuGoal(null);
    updateGoal(goal.id, { saved: goal.target, percent: 100, status: 'Completed' });
  };

  const handleSaveGoal = (goalData: any) => {
    if (editingGoal) {
      updateGoal(editingGoal.id, goalData);
      setEditingGoal(null);
    } else {
      addGoal(goalData);
    }
  };

  const handleOpenCreate = () => {
    setEditingGoal(null);
    setCreateModalVisible(true);
  };

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
          {/* Page Header & Action Bar */}
          <View className="flex-row items-start justify-between mb-3">
          <View className="flex-col flex-1 mr-2">
            <View className="flex-row items-center mb-0.5">
              <View className="w-5 h-5 rounded-full bg-primary/10 items-center justify-center mr-1">
                <MaterialIcons name="stars" size={14} color="#9d4300" />
              </View>
              <Text className="text-lg font-bold text-on-surface">My Goals & Dreams</Text>
            </View>
            <Text className="text-xs text-on-surface-variant leading-tight">
              Set a target, and Sakhi calculates the exact monthly savings needed.
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleOpenCreate}
            className="h-10 px-3.5 bg-primary-container rounded-full flex-row items-center shadow-sm active:scale-95">
            <MaterialIcons name="add-circle" size={18} color="#ffffff" />
            <Text className="text-xs font-bold text-on-primary ml-1">New Goal</Text>
          </TouchableOpacity>
        </View>

        {/* Surplus & Goal Allocation Summary Card */}
        <View className="w-full bg-surface-container-low rounded-xl p-3.5 shadow-xs border border-surface-container-highest/60 mb-3">
          <View className="flex-row items-center justify-between mb-1.5">
            <View className="flex-row items-center">
              <MaterialIcons name="pie-chart" size={15} color="#9d4300" />
              <Text className="text-[11px] uppercase tracking-wider font-bold text-on-surface-variant ml-1">
                Monthly Goal Allocation
              </Text>
            </View>
            <View className="bg-surface-container px-2 py-0.5 rounded-full">
              <Text className="text-[10px] font-bold text-primary">Healthy Margin</Text>
            </View>
          </View>

          <View className="flex-row items-baseline justify-between mb-1.5">
            <View className="flex-row items-baseline">
              <Text className="text-xl font-bold text-on-surface">₹2,500</Text>
              <Text className="text-xs text-on-surface-variant ml-1">/ ₹4,200 Surplus</Text>
            </View>
            <Text className="text-xs font-bold text-primary">60% Allocated</Text>
          </View>

          {/* Dual Segment Progress Bar */}
          <View className="w-full h-2.5 bg-surface-container-highest rounded-full overflow-hidden flex-row mb-2">
            <View className="h-full bg-primary-container" style={{ width: '60%' }} />
            <View className="h-full bg-surface-tint/20" style={{ width: '40%' }} />
          </View>

          <View className="flex-row items-center justify-between pt-1 border-t border-surface-container-highest/40">
            <View className="flex-row items-center">
              <MaterialIcons name="verified" size={14} color="#9d4300" />
              <Text className="text-xs font-semibold text-on-surface ml-1">Safe Surplus Available</Text>
            </View>
            <Text className="text-xs font-bold text-primary">₹1,700 safe</Text>
          </View>
        </View>

        {/* Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-1.5 mb-3.5">
          <TouchableOpacity
            onPress={() => setFilter('all')}
            className={`h-8 px-3.5 rounded-full items-center justify-center ${
              filter === 'all' ? 'bg-primary-container shadow-xs' : 'bg-surface-container'
            } active:scale-95`}>
            <Text
              className={`text-xs font-semibold ${
                filter === 'all' ? 'text-on-primary' : 'text-on-surface-variant'
              }`}>
              All Goals ({goals.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilter('education')}
            className={`h-8 px-3.5 rounded-full items-center justify-center ${
              filter === 'education' ? 'bg-primary-container shadow-xs' : 'bg-surface-container'
            } active:scale-95`}>
            <Text
              className={`text-xs font-semibold ${
                filter === 'education' ? 'text-on-primary' : 'text-on-surface-variant'
              }`}>
              Education & Kids
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilter('business')}
            className={`h-8 px-3.5 rounded-full items-center justify-center ${
              filter === 'business' ? 'bg-primary-container shadow-xs' : 'bg-surface-container'
            } active:scale-95`}>
            <Text
              className={`text-xs font-semibold ${
                filter === 'business' ? 'text-on-primary' : 'text-on-surface-variant'
              }`}>
              Small Business
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilter('emergency')}
            className={`h-8 px-3.5 rounded-full items-center justify-center ${
              filter === 'emergency' ? 'bg-primary-container shadow-xs' : 'bg-surface-container'
            } active:scale-95`}>
            <Text
              className={`text-xs font-semibold ${
                filter === 'emergency' ? 'text-on-primary' : 'text-on-surface-variant'
              }`}>
              Emergency Pool
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Goal Cards Feed */}
        <View className="flex-col gap-3">
          {filteredGoals.map((goal) => {
            const remaining = Math.max(0, goal.target - goal.saved);
            return (
              <View
                key={goal.id}
                className="w-full bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container-highest/60 relative overflow-hidden">
                <View
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: goal.accentColor }}
                />

                <View className="flex-row items-start justify-between mb-2 pt-0.5">
                  <View className="flex-row items-start flex-1 mr-2">
                    <View className="w-10 h-10 rounded-xl bg-surface-container-low items-center justify-center mr-2.5 flex-shrink-0">
                      <MaterialIcons name={goal.icon} size={22} color="#9d4300" />
                    </View>
                    <View className="flex-col flex-1 min-w-0">
                      <Text className="text-sm font-bold text-on-surface truncate">{goal.title}</Text>
                      <View className="flex-row items-center mt-0.5 flex-wrap">
                        <View className="bg-surface-container px-2 py-0.2 rounded-full mr-1.5">
                          <Text className="text-[10px] font-semibold text-on-surface-variant">
                            {goal.category}
                          </Text>
                        </View>
                        <Text className="text-[10px] text-on-surface-variant">• {goal.timeline}</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => setActiveMenuGoal(goal)}
                    className="w-8 h-8 rounded-full items-center justify-center active:scale-90 bg-surface-container-low">
                    <MaterialIcons name="more-vert" size={18} color="#584237" />
                  </TouchableOpacity>
                </View>

                {/* Progress Box */}
                <View className="bg-surface-container-low p-2.5 rounded-lg mb-2">
                  <View className="flex-row items-baseline justify-between mb-1">
                    <Text className="text-base font-bold text-on-surface">₹{goal.saved.toLocaleString('en-IN')}</Text>
                    <Text className="text-xs text-on-surface-variant">
                      Target: <Text className="font-bold text-on-surface">₹{goal.target.toLocaleString('en-IN')}</Text>
                    </Text>
                  </View>
                  <View className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden mb-1">
                    <View
                      className="h-full bg-primary-container rounded-full"
                      style={{ width: `${Math.min(100, goal.percent)}%` }}
                    />
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-[10px] font-bold text-primary">{goal.percent}% Saved</Text>
                    <Text className="text-[10px] text-on-surface-variant">₹{remaining.toLocaleString('en-IN')} remaining</Text>
                  </View>
                </View>

                {/* Requirement */}
                <View className="flex-row items-center justify-between mb-2.5">
                  <View className="flex-col">
                    <Text className="text-[10px] text-on-surface-variant">Plan Requirement</Text>
                    <Text className="text-xs font-bold text-on-surface">{goal.requiredMonthly}</Text>
                  </View>
                  <View className="flex-row items-center bg-primary/10 px-2 py-0.5 rounded-full">
                    <MaterialIcons name="check-circle" size={13} color="#9d4300" />
                    <Text className="text-[10px] font-bold text-primary ml-0.5">{goal.status}</Text>
                  </View>
                </View>

                {/* Card Actions */}
                <View className="flex-row items-center gap-2">
                  <TouchableOpacity
                    onPress={() => setAddMoneyModalVisible(true)}
                    className="flex-1 h-10 rounded-lg bg-primary-container flex-row items-center justify-center shadow-xs active:scale-95">
                    <MaterialIcons name="add-task" size={16} color="#ffffff" />
                    <Text className="text-xs font-bold text-on-primary ml-1.5">+ Add Money</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleEditGoal(goal)}
                    className="w-10 h-10 rounded-lg bg-surface-container items-center justify-center active:scale-95">
                    <MaterialIcons name="edit" size={16} color="#584237" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
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

      {/* Three-Dots Action Menu Modal */}
      {activeMenuGoal && (
        <Modal
          transparent
          animationType="fade"
          visible={!!activeMenuGoal}
          onRequestClose={() => setActiveMenuGoal(null)}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setActiveMenuGoal(null)}
            className="flex-1 bg-black/40 justify-end p-4">
            <View className="bg-surface rounded-2xl p-4 shadow-xl border border-surface-container-highest">
              <View className="flex-row items-center justify-between pb-3 border-b border-surface-container-highest mb-2">
                <View className="flex-col flex-1 mr-2">
                  <Text className="text-base font-bold text-on-surface truncate">
                    {activeMenuGoal.title}
                  </Text>
                  <Text className="text-xs text-on-surface-variant font-mono">
                    Target: ₹{activeMenuGoal.target.toLocaleString('en-IN')}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setActiveMenuGoal(null)}
                  className="w-8 h-8 rounded-full bg-surface-container-high items-center justify-center">
                  <MaterialIcons name="close" size={18} color="#221a0e" />
                </TouchableOpacity>
              </View>

              {/* Action 1: Edit Goal */}
              <TouchableOpacity
                onPress={() => handleEditGoal(activeMenuGoal)}
                className="flex-row items-center py-3 px-2 rounded-xl active:bg-surface-container-low">
                <View className="w-8 h-8 rounded-full bg-primary-fixed items-center justify-center mr-3">
                  <MaterialIcons name="edit" size={18} color="#9d4300" />
                </View>
                <View className="flex-col">
                  <Text className="text-sm font-bold text-on-surface">Edit Goal Details</Text>
                  <Text className="text-xs text-on-surface-variant">Change target amount or timeline</Text>
                </View>
              </TouchableOpacity>

              {/* Action 2: Add Savings */}
              <TouchableOpacity
                onPress={() => {
                  setActiveMenuGoal(null);
                  setAddMoneyModalVisible(true);
                }}
                className="flex-row items-center py-3 px-2 rounded-xl active:bg-surface-container-low">
                <View className="w-8 h-8 rounded-full bg-primary-container/20 items-center justify-center mr-3">
                  <MaterialIcons name="add-task" size={18} color="#f97316" />
                </View>
                <View className="flex-col">
                  <Text className="text-sm font-bold text-on-surface">Add Savings to Goal</Text>
                  <Text className="text-xs text-on-surface-variant">Log deposit to accelerate timeline</Text>
                </View>
              </TouchableOpacity>

              {/* Action 3: Mark as Completed */}
              <TouchableOpacity
                onPress={() => handleCompleteGoal(activeMenuGoal)}
                className="flex-row items-center py-3 px-2 rounded-xl active:bg-surface-container-low">
                <View className="w-8 h-8 rounded-full bg-surface-container items-center justify-center mr-3">
                  <MaterialIcons name="check-circle" size={18} color="#9d4300" />
                </View>
                <View className="flex-col">
                  <Text className="text-sm font-bold text-on-surface">Mark as Achieved</Text>
                  <Text className="text-xs text-on-surface-variant">Move dream to completed archive</Text>
                </View>
              </TouchableOpacity>

              {/* Action 4: Delete Goal */}
              <TouchableOpacity
                onPress={() => handleDeleteGoal(activeMenuGoal)}
                className="flex-row items-center py-3 px-2 rounded-xl active:bg-surface-container-low">
                <View className="w-8 h-8 rounded-full bg-error-container/40 items-center justify-center mr-3">
                  <MaterialIcons name="delete-outline" size={18} color="#ba1a1a" />
                </View>
                <View className="flex-col">
                  <Text className="text-sm font-bold text-error">Delete Goal</Text>
                  <Text className="text-xs text-on-surface-variant">Remove goal and restore surplus</Text>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      <CreateDreamPotModal
        visible={createModalVisible}
        initialGoal={editingGoal}
        onSaveGoal={handleSaveGoal}
        onClose={() => {
          setCreateModalVisible(false);
          setEditingGoal(null);
        }}
      />
      <LogTransactionModal visible={addMoneyModalVisible} onClose={() => setAddMoneyModalVisible(false)} />
      <AskSakhiModal visible={askSakhiVisible} onClose={() => setAskSakhiVisible(false)} />
      <ProfileModal visible={profileVisible} onClose={() => setProfileVisible(false)} />
    </SafeAreaView>
  );
}
