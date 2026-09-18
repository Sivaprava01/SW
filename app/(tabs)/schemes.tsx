import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

type Scheme = {
  id: string;
  title: string;
  badge: string;
  category: string;
  matchScore: number;
  highlight: string;
  tags: string[];
  benefit: string;
  matchReason: string;
  portalUrl: string;
};

const SCHEMES_DATA: Scheme[] = [
  {
    id: 'lakhpati-didi',
    title: 'Lakhpati Didi Initiative',
    badge: 'Central & Telangana',
    category: 'enterprise',
    matchScore: 100,
    highlight: '₹1L - ₹5L Credit Assistance',
    tags: ['Tailoring', 'Food Processing'],
    benefit:
      'Collateral-free business credit up to ₹1 Lakh to ₹5 Lakh via SHG federation, plus skill training in tailoring and micro-enterprise scaling.',
    matchReason:
      'Active SHG member in Telangana with a registered tailoring micro-business unit.',
    portalUrl: 'https://lakhpatididi.gov.in',
  },
  {
    id: 'stree-nidhi',
    title: 'Stree Nidhi Credit Cooperative',
    badge: 'Telangana State',
    category: 'credit',
    matchScore: 95,
    highlight: 'Disbursal within 48 Hours',
    tags: ['SHG Credit', 'Affordable Rates'],
    benefit:
      'Timely, affordable micro-credit sanctioned directly via Village Organizations for asset creation and working capital.',
    matchReason:
      '1+ year active SHG track record with on-time internal thrift loan repayments.',
    portalUrl: 'https://www.streenidhi.telangana.gov.in',
  },
  {
    id: 'pm-suraksha-bima',
    title: 'PM Suraksha Bima Yojana',
    badge: 'Central Govt',
    category: 'insurance',
    matchScore: 90,
    highlight: '₹2 Lakh Accident Cover',
    tags: ['₹20 / Year Premium', 'Jan Dhan Linked'],
    benefit:
      'Annual accidental death and disability coverage automatically debited from your Jan Dhan savings bank account.',
    matchReason: 'Valid Aadhaar and active Jan Dhan savings account linked.',
    portalUrl: 'https://www.jansuraksha.gov.in',
  },
  {
    id: 'atal-pension',
    title: 'Atal Pension Yojana',
    badge: 'Central Govt',
    category: 'pension',
    matchScore: 85,
    highlight: '₹1,000 - ₹5,000 / Month',
    tags: ['Guaranteed Pension', 'Age 18-40'],
    benefit:
      'Guaranteed monthly pension starting from age 60 for unorganized sector workers and rural artisans.',
    matchReason: 'Age 28 falls in the prime compounding contribution bracket.',
    portalUrl: 'https://www.npscra.nsdl.co.in',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All (15)' },
  { id: 'enterprise', label: 'Women Enterprise (5)' },
  { id: 'credit', label: 'SHG Credit (4)' },
  { id: 'insurance', label: 'Insurance (2)' },
  { id: 'pension', label: 'Pension (2)' },
];

export default function SchemesScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const filteredSchemes = SCHEMES_DATA.filter((scheme) => {
    const matchesCategory =
      selectedCategory === 'all' || scheme.category === selectedCategory;
    const matchesSearch =
      scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.benefit.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAudio = (id: string) => {
    setPlayingAudioId((prev) => (prev === id ? null : id));
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fff8f3]" edges={['top']}>
      {/* Header */}
      <View className="px-4 py-3 bg-[#fff8f3] border-b border-[#f1e0cc] flex-row items-center justify-between">
        <View className="flex-col">
          <View className="flex-row items-center gap-1 self-start px-2.5 py-0.5 rounded-full bg-[#f6e6d2] mb-1">
            <MaterialIcons name="verified" size={13} color="#9d4300" />
            <Text className="text-xs font-semibold text-[#584237]">
              Verified Government Programs
            </Text>
          </View>
          <Text className="text-xl font-bold text-[#221a0e]">
            Benefits & Schemes
          </Text>
        </View>

        <TouchableOpacity className="w-10 h-10 rounded-full bg-[#f6e6d2] items-center justify-center">
          <MaterialIcons name="tune" size={20} color="#221a0e" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="p-4">
          {/* Guided Matcher Banner Card */}
          <View className="rounded-2xl bg-[#fcebd7] p-4 mb-4 border border-[#f1e0cc] shadow-sm">
            <View className="flex-row items-start space-x-3 mb-3">
              <View className="w-10 h-10 rounded-full bg-[#f97316] items-center justify-center mr-3 flex-shrink-0">
                <MaterialIcons name="auto-awesome" size={20} color="#ffffff" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-[#221a0e] leading-tight">
                  Find Schemes You May Be Eligible For
                </Text>
                <Text className="text-xs text-[#584237] mt-1 leading-relaxed">
                  Answer 5 quick voice questions. Sakhi checks your profile (Lakshmi, 28y, Telangana SHG) automatically.
                </Text>
              </View>
            </View>

            <View className="flex-row items-center bg-white px-3 py-1.5 rounded-lg mb-3">
              <MaterialIcons name="psychology" size={16} color="#9d4300" />
              <Text className="text-xs text-[#584237] ml-1.5">
                Auto-synced: <Text className="font-bold text-[#221a0e]">Lakshmi (28y)</Text> • <Text className="font-bold text-[#221a0e]">Telangana SHG</Text>
              </Text>
            </View>

            <TouchableOpacity className="w-full h-11 rounded-xl bg-[#f97316] flex-row items-center justify-center shadow-sm active:scale-95">
              <Text className="text-white font-bold text-sm mr-1">
                Start Guided Matcher
              </Text>
              <MaterialIcons name="arrow-forward" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View className="flex-row items-center bg-white rounded-xl px-3 h-12 border border-[#f1e0cc] mb-3">
            <MaterialIcons name="search" size={20} color="#8c7164" />
            <TextInput
              className="flex-1 ml-2 text-sm text-[#221a0e]"
              placeholder="Search schemes, subsidies, loans..."
              placeholderTextColor="#8c7164"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <MaterialIcons name="close" size={18} color="#8c7164" />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Chips Scroll */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
          >
            <View className="flex-row gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-2 rounded-full mr-2 ${
                      isSelected ? 'bg-[#f97316]' : 'bg-white border border-[#f1e0cc]'
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        isSelected ? 'text-white' : 'text-[#584237]'
                      }`}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Scheme Cards Feed */}
          <View className="space-y-4">
            {filteredSchemes.map((scheme) => {
              const isPlaying = playingAudioId === scheme.id;
              return (
                <View
                  key={scheme.id}
                  className="bg-white rounded-2xl p-4 border border-[#f1e0cc] shadow-sm mb-3"
                >
                  {/* Top Badge & Match */}
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="px-2 py-0.5 rounded-full bg-[#f6e6d2]">
                      <Text className="text-xs font-semibold text-[#584237]">
                        {scheme.badge}
                      </Text>
                    </View>
                    <View className="flex-row items-center px-2 py-0.5 rounded-full bg-[#ffdbca]">
                      <MaterialIcons name="stars" size={13} color="#9d4300" />
                      <Text className="text-xs font-bold text-[#9d4300] ml-1">
                        {scheme.matchScore}% Match
                      </Text>
                    </View>
                  </View>

                  <Text className="text-lg font-bold text-[#221a0e] mb-1">
                    {scheme.title}
                  </Text>

                  {/* Highlight Strip */}
                  <View className="bg-[#fff1e3] p-2.5 rounded-xl flex-row items-center justify-between mb-2.5">
                    <Text className="text-xs font-bold text-[#9d4300]">
                      {scheme.highlight}
                    </Text>
                    <View className="flex-row gap-1">
                      {scheme.tags.map((tag, idx) => (
                        <Text
                          key={idx}
                          className="text-[11px] bg-white px-2 py-0.5 rounded text-[#584237]"
                        >
                          {tag}
                        </Text>
                      ))}
                    </View>
                  </View>

                  {/* Benefit */}
                  <Text className="text-xs text-[#584237] leading-relaxed mb-3">
                    <Text className="font-bold text-[#221a0e]">Benefit: </Text>
                    {scheme.benefit}
                  </Text>

                  {/* Why You Match */}
                  <View className="bg-[#fcebd7] p-2.5 rounded-xl flex-row items-start mb-3">
                    <MaterialIcons
                      name="check-circle"
                      size={16}
                      color="#9d4300"
                      style={{ marginTop: 2, marginRight: 6 }}
                    />
                    <Text className="text-xs text-[#584237] flex-1 leading-relaxed">
                      <Text className="font-bold text-[#9d4300]">Why You Match: </Text>
                      {scheme.matchReason}
                    </Text>
                  </View>

                  {/* Action Buttons */}
                  <View className="flex-row items-center justify-between pt-1 border-t border-[#f1e0cc]">
                    <TouchableOpacity
                      onPress={() => toggleAudio(scheme.id)}
                      className="flex-row items-center py-1.5"
                    >
                      <MaterialIcons
                        name={isPlaying ? 'pause-circle' : 'volume-up'}
                        size={18}
                        color={isPlaying ? '#b3291b' : '#9d4300'}
                      />
                      <Text
                        className={`text-xs font-bold ml-1 ${
                          isPlaying ? 'text-[#b3291b]' : 'text-[#9d4300]'
                        }`}
                      >
                        {isPlaying ? 'వింటున్నారు...' : 'Listen in Telugu'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => WebBrowser.openBrowserAsync(scheme.portalUrl)}
                      className="px-3 py-1.5 rounded-lg bg-[#f6e6d2] flex-row items-center"
                    >
                      <Text className="text-xs font-bold text-[#221a0e] mr-1">
                        Details & Source
                      </Text>
                      <MaterialIcons name="open-in-new" size={14} color="#221a0e" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
