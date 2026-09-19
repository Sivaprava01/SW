import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useApp } from '@/context/AppContext';

type SakhiHeaderProps = {
  subtitle?: string;
  hideAvatar?: boolean;
  logoOnly?: boolean;
  onPressProfile?: () => void;
  onPressMenu?: () => void;
};

export function SakhiHeader({
  subtitle = 'Dashboard',
  hideAvatar = false,
  logoOnly = false,
  onPressProfile,
  onPressMenu,
}: SakhiHeaderProps) {
  const router = useRouter();
  const { operatingState, currentUser } = useApp();

  const handleProfilePress = () => {
    if (onPressProfile) {
      onPressProfile();
    } else {
      router.push('/modal');
    }
  };

  const handleMenuPress = () => {
    if (onPressMenu) {
      onPressMenu();
    } else {
      router.push('/settings' as any);
    }
  };

  const displayName = currentUser?.name || 'Member';
  const displayInitial = (displayName.charAt(0) || 'M').toUpperCase();
  const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Member';
  const displayState = currentUser?.state || operatingState || 'Telangana';

  return (
    <View
      className={`px-4 py-2.5 bg-surface flex-row items-center justify-between z-10 ${
        !logoOnly ? 'border-b border-surface-container-highest' : ''
      }`}>
      <View className="flex-row items-center flex-1 min-w-0 mr-2">
        {logoOnly ? (
          <View className="flex-row items-center gap-2">
            <Image
              source={require('@/assets/images/app-logo-emblem.png')}
              style={{ width: 36, height: 36 }}
              resizeMode="contain"
            />
            <Text className="text-xl font-bold text-[#103b2a] tracking-tight">Sakhi</Text>
          </View>
        ) : (
          <>
            {!hideAvatar && (
              <View className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center shadow-xs flex-shrink-0 mr-2.5 overflow-hidden border border-surface-container-highest/60">
                <Image
                  source={require('@/assets/images/app-logo-emblem.png')}
                  style={{ width: 36, height: 36 }}
                  resizeMode="contain"
                />
              </View>
            )}
            <View className="flex-col flex-1 min-w-0">
              <Text className="text-[17px] font-bold text-on-surface truncate" numberOfLines={1}>
                Namaste, {firstName} 👋
              </Text>
              <View className="flex-row items-center mt-0.5">
                <MaterialIcons name="location-on" size={13} color="#9d4300" />
                <Text className="text-[12px] text-on-surface-variant uppercase tracking-wider font-semibold truncate ml-0.5">
                  {displayState} • {subtitle}
                </Text>
              </View>
            </View>
          </>
        )}
      </View>

      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={handleProfilePress}
          className="w-8 h-8 rounded-full bg-primary items-center justify-center mr-2 active:scale-95 shadow-sm"
          accessibilityLabel="Open Member Profile">
          <MaterialIcons name="person" size={18} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleMenuPress}
          className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center active:scale-95"
          accessibilityLabel="Open Settings & Menu">
          <MaterialIcons name="menu" size={22} color="#221a0e" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
