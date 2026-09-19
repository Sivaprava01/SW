import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type ProfileModalProps = {
  visible: boolean;
  onClose: () => void;
};

import { useApp } from '@/context/AppContext';

export function ProfileModal({ visible, onClose }: ProfileModalProps) {
  const router = useRouter();
  const { currentUser, operatingState, logoutUser } = useApp();

  const handleOpenSettings = () => {
    onClose();
    router.push('/settings' as any);
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out from Device',
      'Are you sure you want to log out? You can sign back in anytime with your mobile number or member profile.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            onClose();
            logoutUser();
            router.replace('/splash' as any);
          },
        },
      ]
    );
  };

  const name = currentUser?.name || 'Member';
  const initial = name ? name.trim().charAt(0).toUpperCase() : 'M';
  const occupation = currentUser?.occupation || 'Tailoring & Micro-Retail';
  const state = currentUser?.state || operatingState;
  const district = currentUser?.district ? `, ${currentUser.district}` : '';
  const locality = currentUser?.locality_type === 'urban' ? 'Urban Town' : 'Rural Village';
  const age = currentUser?.age || 28;
  const isSHG = currentUser?.is_shg_member ?? true;
  const shgName = currentUser?.shg_name || 'SERP TG-48209';
  const income = currentUser?.monthly_income ?? 18500;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
        {/* Top Header */}
        <View className="px-4 py-2.5 flex-row items-center justify-between border-b border-surface-container-highest">
          <Text className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">
            Member Dossier
          </Text>
          <TouchableOpacity
            onPress={onClose}
            className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center active:scale-95"
            accessibilityLabel="Close Profile Modal">
            <MaterialIcons name="close" size={20} color="#221a0e" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-4 py-3" contentContainerStyle={{ paddingBottom: 30 }}>
          {/* Centered Profile Header */}
          <View className="items-center py-2 mb-3">
            <View className="relative mb-2">
              <View className="w-20 h-20 rounded-full bg-surface-container-high items-center justify-center shadow-md overflow-hidden border-2 border-surface-container-highest/80">
                <Image
                  source={require('@/assets/images/app-logo-emblem.png')}
                  style={{ width: 72, height: 72 }}
                  resizeMode="contain"
                />
              </View>
              <View className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-secondary items-center justify-center shadow-sm">
                <MaterialIcons name="verified" size={16} color="#ffffff" />
              </View>
            </View>

            <Text className="text-xl font-bold text-on-surface">{name}</Text>
            <Text className="text-xs text-on-surface-variant text-center mt-0.5">
              {occupation} • {locality}{district}, {state}
            </Text>

            <View className="mt-2 flex-row items-center bg-surface-container-low px-3 py-1.5 rounded-full border border-surface-container-highest/60">
              <MaterialIcons name="diversity-3" size={16} color="#9d4300" />
              <Text className="text-xs font-bold text-primary ml-1.5">
                {isSHG ? `Active SHG Member (${shgName})` : 'Independent Member'}
              </Text>
            </View>
          </View>

          {/* Card 1: Declared Monthly Income */}
          <View className="w-full bg-surface-container-low rounded-xl p-3.5 mb-2.5 shadow-sm border border-surface-container-highest/60">
            <View className="flex-row items-center justify-between mb-1">
              <View className="flex-row items-center">
                <MaterialIcons name="payments" size={18} color="#9d4300" />
                <Text className="text-xs uppercase tracking-wider text-on-surface-variant font-bold ml-1.5">
                  Declared Monthly Income
                </Text>
              </View>
              <View className="bg-surface-container-high px-2 py-0.5 rounded">
                <Text className="text-[10px] text-on-surface-variant font-semibold">Audited</Text>
              </View>
            </View>
            <View className="flex-row items-baseline justify-between mt-1">
              <Text className="text-2xl font-bold text-primary">₹{income.toLocaleString('en-IN')}</Text>
              <View className="bg-surface-container px-2.5 py-1 rounded">
                <Text className="text-xs font-semibold text-on-surface">{occupation}</Text>
              </View>
            </View>
          </View>

          {/* Card 2: Age & Residence */}
          <View className="w-full bg-surface-container-low rounded-xl p-3.5 mb-2.5 shadow-sm border border-surface-container-highest/60 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 min-w-0 mr-2">
              <View className="w-9 h-9 rounded-full bg-surface-container items-center justify-center mr-2.5 flex-shrink-0">
                <MaterialIcons name="cottage" size={20} color="#9d4300" />
              </View>
              <View className="flex-col min-w-0">
                <Text className="text-xs text-on-surface-variant">Age & Residence</Text>
                <Text className="text-sm font-bold text-on-surface truncate">
                  {age} years • {state}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleOpenSettings}
              className="bg-surface-container px-2.5 py-1 rounded flex-row items-center active:scale-95">
              <MaterialIcons name="edit" size={12} color="#9d4300" />
              <Text className="text-[11px] text-primary font-bold ml-1">Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Card 3: Financial Health State */}
          <View className="w-full bg-surface-container-low rounded-xl p-3.5 mb-2.5 shadow-sm border border-surface-container-highest/60">
            <View className="flex-row items-center mb-1">
              <MaterialIcons name="trending-up" size={18} color="#b3291b" />
              <Text className="text-xs uppercase tracking-wider text-on-surface-variant font-bold ml-1.5">
                Calculated Monthly Surplus
              </Text>
            </View>
            <View className="flex-row items-center justify-between mt-1">
              <View className="flex-col">
                <Text className="text-xl font-bold text-secondary">
                  ₹4,200 <Text className="text-xs font-normal text-on-surface-variant">/ month</Text>
                </Text>
              </View>
              <View className="flex-row items-center bg-surface-container px-2.5 py-1 rounded-full">
                <MaterialIcons name="verified" size={14} color="#9d4300" />
                <Text className="text-xs font-bold text-on-surface ml-1">72% Health Score</Text>
              </View>
            </View>
          </View>

          {/* Card 4: Active Dream & Milestone */}
          <View className="w-full bg-surface-container-low rounded-xl p-3.5 mb-4 shadow-sm border border-surface-container-highest/60">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center">
                <MaterialIcons name="flag-circle" size={18} color="#9d4300" />
                <Text className="text-xs uppercase tracking-wider text-on-surface-variant font-bold ml-1.5">
                  Current Goal & Stage
                </Text>
              </View>
              <Text className="text-xs font-bold text-primary">36%</Text>
            </View>

            {/* Goal Row */}
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-sm font-semibold text-on-surface">🎯 Daughter's College</Text>
              <Text className="text-xs font-bold text-on-surface">₹18,000 / ₹50,000</Text>
            </View>
            <View className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden mb-2.5">
              <View className="h-full bg-primary-container rounded-full" style={{ width: '36%' }} />
            </View>

            {/* Roadmap Milestone Stage */}
            <View className="flex-row items-center justify-between bg-surface-container/60 p-2 rounded-lg">
              <Text className="text-xs font-medium text-on-surface">🗺️ Stage 2: Emergency Shield</Text>
              <View className="bg-surface-container-lowest px-2 py-0.5 rounded shadow-xs">
                <Text className="text-xs font-bold text-primary">42% Complete</Text>
              </View>
            </View>
          </View>

          {/* Bottom Action Buttons */}
          <View className="gap-2.5 mt-1">
            <TouchableOpacity
              onPress={handleOpenSettings}
              className="w-full min-h-[48px] bg-primary-container rounded-xl flex-row items-center justify-center active:scale-[0.99] shadow-md">
              <Text className="text-sm font-bold text-on-primary mr-1.5">
                Open Settings (☰) to Edit Details
              </Text>
              <MaterialIcons name="arrow-forward" size={18} color="#ffffff" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              className="w-full min-h-[46px] bg-surface-container-lowest rounded-xl flex-row items-center justify-center border border-secondary/30 active:scale-[0.99] shadow-xs">
              <MaterialIcons name="logout" size={18} color="#b3291b" className="mr-1.5" />
              <Text className="text-xs font-bold text-secondary">
                Log Out from Device
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
