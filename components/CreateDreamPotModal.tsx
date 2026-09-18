import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Goal } from '@/context/AppContext';

type CreateGoalModalProps = {
  visible: boolean;
  onClose: () => void;
  initialGoal?: Goal | null;
  onSaveGoal?: (goal: any) => void;
};

export function CreateDreamPotModal({ visible, onClose, initialGoal, onSaveGoal }: CreateGoalModalProps) {
  const [selectedCategory, setSelectedCategory] = useState('education');
  const [goalTitle, setGoalTitle] = useState("Daughter's 10th & College Admission");
  const [targetAmount, setTargetAmount] = useState(55000);
  const [durationMonths, setDurationMonths] = useState(24);

  useEffect(() => {
    if (initialGoal) {
      setSelectedCategory(initialGoal.filterCat || 'education');
      setGoalTitle(initialGoal.title);
      setTargetAmount(initialGoal.target);
      setDurationMonths(initialGoal.durationMonths || 12);
    } else {
      setSelectedCategory('education');
      setGoalTitle("Daughter's 10th & College Admission");
      setTargetAmount(55000);
      setDurationMonths(24);
    }
  }, [initialGoal, visible]);

  const monthlySurplus = 4200;
  const monthlyRequired = Math.round(targetAmount / (durationMonths || 1));
  const surplusPercentage = Math.min(100, Math.round((monthlyRequired / monthlySurplus) * 100));
  const isSafe = monthlyRequired <= 3800;

  const categories = [
    { id: 'education', label: 'Education', icon: 'school' as const },
    { id: 'emergency', label: 'Emergency Shield', icon: 'shield' as const },
    { id: 'business', label: 'Business & Sewing', icon: 'storefront' as const },
    { id: 'gold', label: 'Gold / Jewelry', icon: 'savings' as const },
    { id: 'repair', label: 'House Repair', icon: 'home-repair-service' as const },
    { id: 'custom', label: 'Custom Dream', icon: 'auto-awesome' as const },
  ];

  const durations = [6, 12, 18, 24, 36];

  const handleSave = () => {
    const selectedCatObj = categories.find((c) => c.id === selectedCategory);
    if (onSaveGoal) {
      onSaveGoal({
        category: selectedCatObj ? selectedCatObj.label : 'General',
        filterCat: selectedCategory,
        title: goalTitle,
        target: targetAmount,
        durationMonths,
        requiredMonthly: `₹${monthlyRequired.toLocaleString('en-IN')}/mo required`,
        timeline: `${durationMonths} months left`,
        icon: selectedCatObj ? selectedCatObj.icon : 'star',
      });
    }
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
        {/* Header */}
        <View className="px-4 py-3 bg-surface border-b border-surface-container-highest flex-row items-center justify-between">
          <View className="flex-col">
            <View className="flex-row items-center space-x-1 mb-0.5">
              <View className="w-5 h-5 rounded-full bg-primary-fixed items-center justify-center mr-1">
                <MaterialIcons name="stars" size={13} color="#341100" />
              </View>
              <Text className="text-[11px] font-bold text-primary uppercase tracking-wider">
                Lakshya Yojna
              </Text>
            </View>
            <Text className="text-base font-bold text-on-surface">
              {initialGoal ? 'Edit Savings Goal' : 'Create New Savings Dream'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center active:scale-95">
            <MaterialIcons name="close" size={20} color="#221a0e" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-4 py-3" contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Step 1: Category Selection */}
          <View className="mb-4">
            <View className="flex-row items-center mb-2">
              <View className="w-5 h-5 rounded-full bg-primary items-center justify-center mr-1.5">
                <Text className="text-[11px] font-bold text-on-primary">1</Text>
              </View>
              <Text className="text-sm font-bold text-on-surface">What are you saving for?</Text>
            </View>
            <View className="flex-row flex-wrap gap-1.5">
              {categories.map((cat) => {
                const active = selectedCategory === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setSelectedCategory(cat.id)}
                    className={`h-9 px-3 rounded-full flex-row items-center ${
                      active ? 'bg-primary shadow-sm' : 'bg-surface-container'
                    } active:scale-95`}>
                    <MaterialIcons
                      name={cat.icon}
                      size={16}
                      color={active ? '#ffffff' : '#584237'}
                    />
                    <Text
                      className={`text-xs font-semibold ml-1.5 ${
                        active ? 'text-on-primary' : 'text-on-surface'
                      }`}>
                      {cat.label}
                    </Text>
                    {active && (
                      <MaterialIcons name="check-circle" size={14} color="#ffffff" className="ml-1" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Step 2: Goal Title Input */}
          <View className="mb-4">
            <View className="flex-row items-center mb-1.5">
              <View className="w-5 h-5 rounded-full bg-primary items-center justify-center mr-1.5">
                <Text className="text-[11px] font-bold text-on-primary">2</Text>
              </View>
              <Text className="text-sm font-bold text-on-surface">Goal Title</Text>
            </View>
            <View className="bg-surface-container-low rounded-xl px-3 py-2.5 flex-row items-center border border-surface-container-highest/60">
              <MaterialIcons name="edit-note" size={20} color="#9d4300" />
              <TextInput
                value={goalTitle}
                onChangeText={setGoalTitle}
                className="flex-1 ml-2 text-sm font-semibold text-on-surface"
                placeholder="e.g. Daughter's College"
                placeholderTextColor="#8c7164"
              />
            </View>
          </View>

          {/* Step 3: Target Amount */}
          <View className="mb-4">
            <View className="flex-row items-center mb-1.5">
              <View className="w-5 h-5 rounded-full bg-primary items-center justify-center mr-1.5">
                <Text className="text-[11px] font-bold text-on-primary">3</Text>
              </View>
              <Text className="text-sm font-bold text-on-surface">Target Amount</Text>
            </View>
            <View className="bg-surface-container-low rounded-xl p-3 items-center border border-surface-container-highest/60">
              <Text className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider mb-1">
                Total Goal Target
              </Text>
              <View className="flex-row items-center justify-center">
                <Text className="text-2xl font-bold text-primary mr-1">₹</Text>
                <TextInput
                  value={targetAmount.toString()}
                  onChangeText={(val) => setTargetAmount(parseInt(val, 10) || 0)}
                  keyboardType="numeric"
                  className="text-2xl font-bold text-primary text-center min-w-[120px]"
                />
              </View>
            </View>
          </View>

          {/* Step 4: Target Timeline & Monthly Calculation */}
          <View className="mb-4">
            <View className="flex-row items-center justify-between mb-1.5">
              <View className="flex-row items-center">
                <View className="w-5 h-5 rounded-full bg-primary items-center justify-center mr-1.5">
                  <Text className="text-[11px] font-bold text-on-primary">4</Text>
                </View>
                <Text className="text-sm font-bold text-on-surface">Target Timeline</Text>
              </View>
              <Text className="text-xs font-bold text-primary">{durationMonths} Months</Text>
            </View>

            <View className="flex-row bg-surface-container-low rounded-xl p-1 justify-between mb-2 border border-surface-container-highest/50">
              {durations.map((m) => {
                const active = durationMonths === m;
                return (
                  <TouchableOpacity
                    key={m}
                    onPress={() => setDurationMonths(m)}
                    className={`flex-1 py-2 rounded-lg items-center ${
                      active ? 'bg-primary shadow-sm' : 'bg-transparent'
                    } active:scale-95`}>
                    <Text
                      className={`text-xs font-bold ${
                        active ? 'text-on-primary' : 'text-on-surface'
                      }`}>
                      {m} Mo{m === 24 ? '*' : ''}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Live Calculation Card */}
            <View className="bg-surface-container-low rounded-xl p-3.5 border border-surface-container-highest/60 shadow-sm">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-xs font-semibold text-on-surface-variant">Monthly Allocation</Text>
                <View className="flex-row items-baseline">
                  <Text className="text-xl font-bold text-primary">₹{monthlyRequired.toLocaleString('en-IN')}</Text>
                  <Text className="text-xs text-on-surface-variant ml-1">/ month</Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden mb-1.5">
                <View
                  className={`h-full rounded-full ${isSafe ? 'bg-primary-container' : 'bg-error'}`}
                  style={{ width: `${surplusPercentage}%` }}
                />
              </View>
              <View className="flex-row justify-between">
                <Text className="text-[11px] text-on-surface-variant">
                  ₹{monthlyRequired.toLocaleString('en-IN')} goal saving
                </Text>
                <Text className={`text-[11px] font-bold ${isSafe ? 'text-primary' : 'text-error'}`}>
                  {surplusPercentage}% of ₹4,200 surplus safe
                </Text>
              </View>
            </View>
          </View>

          {/* Step 5: Destination Account */}
          <View className="mb-4">
            <View className="flex-row items-center mb-1.5">
              <View className="w-5 h-5 rounded-full bg-primary items-center justify-center mr-1.5">
                <Text className="text-[11px] font-bold text-on-primary">5</Text>
              </View>
              <Text className="text-sm font-bold text-on-surface">Destination Account</Text>
            </View>
            <View className="bg-surface-container-low rounded-xl p-3 flex-row items-center justify-between border border-surface-container-highest/60">
              <View className="flex-row items-center flex-1">
                <View className="w-9 h-9 rounded-full bg-secondary-fixed items-center justify-center mr-2.5">
                  <MaterialIcons name="account-balance" size={20} color="#410000" />
                </View>
                <View className="flex-col flex-1">
                  <View className="flex-row items-center space-x-1">
                    <Text className="text-xs font-bold text-on-surface">Post Office RD / Mahila Samman</Text>
                  </View>
                  <Text className="text-[10px] font-bold text-secondary">7.5% APY • Safe Govt Scheme</Text>
                </View>
              </View>
              <MaterialIcons name="check-circle" size={18} color="#9d4300" />
            </View>
          </View>

          {/* Primary Action */}
          <TouchableOpacity
            onPress={handleSave}
            className="w-full min-h-[50px] bg-primary rounded-xl flex-row items-center justify-center active:scale-[0.99] shadow-md mb-2">
            <Text className="text-sm font-bold text-on-primary mr-1">
              Lock Goal & Begin Saving ₹{monthlyRequired.toLocaleString('en-IN')}/mo
            </Text>
            <MaterialIcons name="arrow-forward" size={18} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            className="w-full py-2 items-center justify-center active:scale-95">
            <Text className="text-xs font-semibold text-on-surface-variant">Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

export const CreateGoalModal = CreateDreamPotModal;
