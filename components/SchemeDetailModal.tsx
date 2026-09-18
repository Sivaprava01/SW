import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

type SchemeDetailModalProps = {
  visible: boolean;
  onClose: () => void;
  scheme?: {
    title: string;
    department?: string;
    matchPercent?: string;
    category?: string;
    portalUrl?: string;
  };
};

export function SchemeDetailModal({ visible, onClose, scheme }: SchemeDetailModalProps) {
  const [doc1Checked, setDoc1Checked] = useState(true);
  const [doc2Checked, setDoc2Checked] = useState(true);
  const [doc3Checked, setDoc3Checked] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const readyCount = (doc1Checked ? 1 : 0) + (doc2Checked ? 1 : 0) + (doc3Checked ? 1 : 0);

  const currentScheme = scheme || {
    title: 'Lakhpati Didi Initiative',
    department: 'Ministry of Rural Development & SERP Telangana',
    matchPercent: '100% Match',
    category: 'SHG LIVELIHOOD • CENTRAL & TELANGANA',
    portalUrl: 'https://lakhpatididi.gov.in',
  };

  const handleOpenPortal = () => {
    if (currentScheme.portalUrl) {
      Linking.openURL(currentScheme.portalUrl).catch(() => {});
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
        {/* Top Header */}
        <View className="bg-surface-container-low px-4 py-3 border-b border-surface-container-highest shadow-sm">
          <View className="flex-row items-center justify-between mb-1">
            <View className="flex-row items-center gap-1.5 flex-wrap">
              <View className="bg-primary-container/15 px-2 py-0.5 rounded-full">
                <Text className="text-[10px] font-bold text-primary tracking-wider">SHG LIVELIHOOD</Text>
              </View>
              <View className="bg-surface-container-high px-2 py-0.5 rounded-full">
                <Text className="text-[10px] font-semibold text-on-surface-variant">CENTRAL & TELANGANA</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-surface-container-high items-center justify-center active:scale-90">
              <MaterialIcons name="close" size={18} color="#221a0e" />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-start justify-between mt-1">
            <View className="flex-1 mr-2">
              <Text className="text-base font-bold text-on-surface leading-tight">
                {currentScheme.title}
              </Text>
              <Text className="text-xs text-on-surface-variant mt-0.5">
                {currentScheme.department}
              </Text>
            </View>
            <View className="bg-primary-container px-2.5 py-1 rounded-full flex-row items-center shadow-xs">
              <MaterialIcons name="stars" size={13} color="#ffffff" />
              <Text className="text-xs font-bold text-on-primary ml-1">{currentScheme.matchPercent}</Text>
            </View>
          </View>
        </View>

        <ScrollView className="flex-1 px-4 py-3.5" contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Target Beneficiaries & Eligibility */}
          <View className="mb-4">
            <View className="flex-row items-center mb-2">
              <MaterialIcons name="groups" size={18} color="#9d4300" />
              <Text className="text-sm font-bold text-on-surface ml-1.5">
                Target Beneficiaries & Eligibility
              </Text>
            </View>
            <View className="p-3.5 rounded-xl bg-surface-container flex-col gap-2 border border-surface-container-highest/60">
              <View className="flex-row items-start">
                <MaterialIcons name="check-circle" size={16} color="#9d4300" className="mt-0.5 mr-2" />
                <Text className="text-xs text-on-surface flex-1">
                  Active woman member in an SHG / Mahila Mandal for at least <Text className="font-bold">1 year</Text>.
                </Text>
              </View>
              <View className="flex-row items-start">
                <MaterialIcons name="check-circle" size={16} color="#9d4300" className="mt-0.5 mr-2" />
                <Text className="text-xs text-on-surface flex-1">
                  Household income target: transitioning to at least <Text className="font-bold">₹1,00,000</Text> annual sustainable income.
                </Text>
              </View>
              <View className="flex-row items-start">
                <MaterialIcons name="check-circle" size={16} color="#9d4300" className="mt-0.5 mr-2" />
                <Text className="text-xs text-on-surface flex-1">
                  Valid Aadhaar card and linked active <Text className="font-bold">Jan Dhan bank passbook</Text>.
                </Text>
              </View>
            </View>
          </View>

          {/* Documents Checklist */}
          <View className="mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center">
                <MaterialIcons name="inventory-2" size={18} color="#9d4300" />
                <Text className="text-sm font-bold text-on-surface ml-1.5">Documents Checklist</Text>
              </View>
              <Text className="text-xs font-bold text-primary">{readyCount} of 3 Ready</Text>
            </View>

            <View className="flex-col gap-2">
              {/* Doc 1 */}
              <TouchableOpacity
                onPress={() => setDoc1Checked(!doc1Checked)}
                className="flex-row items-center justify-between p-3 rounded-xl bg-surface-container-low border border-surface-container-highest/60 active:scale-[0.99]">
                <View className="flex-row items-center flex-1 mr-2">
                  <View
                    className={`w-5 h-5 rounded items-center justify-center mr-2.5 ${
                      doc1Checked ? 'bg-primary' : 'bg-surface-container-highest'
                    }`}>
                    {doc1Checked && <MaterialIcons name="check" size={14} color="#ffffff" />}
                  </View>
                  <View className="flex-col flex-1">
                    <Text className="text-xs font-bold text-on-surface">Aadhaar Card</Text>
                    <Text className="text-[10px] text-on-surface-variant">
                      Verified & linked to your registered mobile number
                    </Text>
                  </View>
                </View>
                <View className="px-2 py-0.5 rounded-full bg-surface-container">
                  <Text className="text-[10px] font-semibold text-on-surface-variant">Linked</Text>
                </View>
              </TouchableOpacity>

              {/* Doc 2 */}
              <TouchableOpacity
                onPress={() => setDoc2Checked(!doc2Checked)}
                className="flex-row items-center justify-between p-3 rounded-xl bg-surface-container-low border border-surface-container-highest/60 active:scale-[0.99]">
                <View className="flex-row items-center flex-1 mr-2">
                  <View
                    className={`w-5 h-5 rounded items-center justify-center mr-2.5 ${
                      doc2Checked ? 'bg-primary' : 'bg-surface-container-highest'
                    }`}>
                    {doc2Checked && <MaterialIcons name="check" size={14} color="#ffffff" />}
                  </View>
                  <View className="flex-col flex-1">
                    <Text className="text-xs font-bold text-on-surface">SHG Passbook & Resolution</Text>
                    <Text className="text-[10px] text-on-surface-variant">
                      Latest 6-month ledger record + group meeting resolution copy
                    </Text>
                  </View>
                </View>
                <View className="px-2 py-0.5 rounded-full bg-surface-container">
                  <Text className="text-[10px] font-semibold text-on-surface-variant">Verified</Text>
                </View>
              </TouchableOpacity>

              {/* Doc 3 */}
              <TouchableOpacity
                onPress={() => setDoc3Checked(!doc3Checked)}
                className="flex-row items-center justify-between p-3 rounded-xl bg-surface-container-low border border-surface-container-highest/60 active:scale-[0.99]">
                <View className="flex-row items-center flex-1 mr-2">
                  <View
                    className={`w-5 h-5 rounded items-center justify-center mr-2.5 ${
                      doc3Checked ? 'bg-primary' : 'bg-surface-container-highest'
                    }`}>
                    {doc3Checked && <MaterialIcons name="check" size={14} color="#ffffff" />}
                  </View>
                  <View className="flex-col flex-1">
                    <Text className="text-xs font-bold text-on-surface">Gram Panchayat / VO Letter</Text>
                    <Text className="text-[10px] text-on-surface-variant">
                      Signed by Village Animator or VO Secretary
                    </Text>
                  </View>
                </View>
                <View className="px-2 py-0.5 rounded-full bg-secondary-fixed">
                  <Text className="text-[10px] font-bold text-on-secondary-fixed">Needed</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* How to Apply */}
          <View className="mb-4">
            <View className="flex-row items-center mb-2">
              <MaterialIcons name="route" size={18} color="#9d4300" />
              <Text className="text-sm font-bold text-on-surface ml-1.5">How to Apply</Text>
            </View>

            <View className="flex-col gap-2">
              <View className="flex-row gap-2.5 p-3 rounded-xl bg-surface-container-lowest shadow-xs border border-surface-container-highest/60">
                <View className="w-7 h-7 rounded-full bg-primary-container items-center justify-center flex-shrink-0">
                  <Text className="text-xs font-bold text-on-primary">1</Text>
                </View>
                <View className="flex-col flex-1">
                  <Text className="text-xs font-bold text-on-surface">Inform Your SHG President</Text>
                  <Text className="text-[11px] text-on-surface-variant mt-0.5">
                    Raise your intent at the upcoming fortnightly Village Organization (VO) meeting.
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-2.5 p-3 rounded-xl bg-surface-container-lowest shadow-xs border border-surface-container-highest/60">
                <View className="w-7 h-7 rounded-full bg-primary-container items-center justify-center flex-shrink-0">
                  <Text className="text-xs font-bold text-on-primary">2</Text>
                </View>
                <View className="flex-col flex-1">
                  <Text className="text-xs font-bold text-on-surface">Submit Micro-Investment Plan (MIP)</Text>
                  <Text className="text-[11px] text-on-surface-variant mt-0.5">
                    Generate your verified cashflow numbers directly through Sakhi and submit to the cluster coordinator.
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-2.5 p-3 rounded-xl bg-surface-container-lowest shadow-xs border border-surface-container-highest/60">
                <View className="w-7 h-7 rounded-full bg-primary-container items-center justify-center flex-shrink-0">
                  <Text className="text-xs font-bold text-on-primary">3</Text>
                </View>
                <View className="flex-col flex-1">
                  <Text className="text-xs font-bold text-on-surface">Branch Disbursal to Bank Account</Text>
                  <Text className="text-[11px] text-on-surface-variant mt-0.5">
                    Funds are sanctioned directly into your SHG group savings account with automated updates.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer Action Bar */}
        <View className="bg-surface-container-low px-4 py-3 flex-row items-center gap-2 border-t border-surface-container-highest shadow-sm">
          <TouchableOpacity
            onPress={() => setIsPlayingAudio(!isPlayingAudio)}
            className={`h-11 px-3.5 rounded-full flex-row items-center active:scale-95 ${
              isPlayingAudio ? 'bg-secondary-fixed' : 'bg-surface-container-high'
            }`}>
            <MaterialIcons
              name={isPlayingAudio ? 'pause-circle' : 'volume-up'}
              size={18}
              color={isPlayingAudio ? '#b3291b' : '#9d4300'}
            />
            <Text
              className={`text-xs font-bold ml-1.5 ${
                isPlayingAudio ? 'text-secondary' : 'text-on-surface'
              }`}>
              {isPlayingAudio ? 'వింటున్నారు...' : 'తెలుగులో వినండి'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleOpenPortal}
            className="flex-1 h-11 px-4 rounded-full bg-primary-container flex-row items-center justify-center active:scale-95 shadow-md">
            <Text className="text-xs font-bold text-on-primary mr-1">View Official Portal</Text>
            <MaterialIcons name="north-east" size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
