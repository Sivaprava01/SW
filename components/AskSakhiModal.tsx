import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

type AskSakhiModalProps = {
  visible: boolean;
  onClose: () => void;
};

type Message = {
  id: string;
  sender: 'user' | 'sakhi';
  time?: string;
  text?: string;
  isMathCard?: boolean;
  audioLabel?: string;
};

export function AskSakhiModal({ visible, onClose }: AskSakhiModalProps) {
  const [isTelugu, setIsTelugu] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'sakhi',
      time: 'Just now',
      text: 'Namaste Lakshmi! I see you have ₹4,200 monthly surplus and ₹12,000 debt with the local moneylender at 3% monthly. Paying ₹1,500/month will clear it in 8 months and save you ₹2,880 in interest.',
      audioLabel: 'Listen in Telugu',
    },
    {
      id: '2',
      sender: 'user',
      time: '10:42 AM',
      text: "Can I still save ₹1,500 for my daughter's college fees if I pay the loan?",
    },
    {
      id: '3',
      sender: 'sakhi',
      time: '10:43 AM',
      text: 'Yes! Here is your exact math:',
      isMathCard: true,
      audioLabel: 'Listen',
    },
  ]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      time: 'Just now',
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      const sakhiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'sakhi',
        time: 'Just now',
        text: 'Lakshmi, with your ₹4,200 surplus, you can safely allocate ₹1,500 to clearing high-interest debt, ₹1,500 to savings goals, leaving ₹1,200 safe emergency cushion every single month.',
        audioLabel: 'Listen in Telugu',
      };
      setMessages((prev) => [...prev, sakhiMsg]);
    }, 600);
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      handleSend("Can I still save ₹1,500 for my daughter's college fees if I pay the loan?");
    } else {
      setIsRecording(true);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
        {/* Header Section */}
        <View className="px-4 py-3 bg-surface-container-low border-b border-surface-container-highest flex-row items-center justify-between shadow-sm">
          <View className="flex-row items-center flex-1 min-w-0 mr-2">
            <View className="relative mr-3 flex-shrink-0">
              <View className="w-11 h-11 rounded-full bg-primary-container/20 items-center justify-center">
                <View className="w-8 h-8 rounded-full bg-primary-container items-center justify-center shadow-md">
                  <MaterialIcons name="face-3" size={18} color="#ffffff" />
                </View>
              </View>
            </View>
            <View className="flex-col min-w-0">
              <View className="flex-row items-center space-x-1.5">
                <Text className="text-base font-bold text-on-surface">Ask Sakhi</Text>
                <View className="bg-primary px-2 py-0.5 rounded-full ml-1.5">
                  <Text className="text-[10px] font-bold text-on-primary">AI Companion</Text>
                </View>
              </View>
            </View>
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => setIsTelugu(!isTelugu)}
              className="h-8 px-2.5 rounded-full bg-surface-container-high flex-row items-center mr-2 active:scale-95 shadow-sm">
              <MaterialIcons name="translate" size={14} color="#9d4300" />
              <Text className="text-xs font-semibold text-on-surface ml-1">
                {isTelugu ? 'తెలుగు / Eng' : 'हिन्दी / Eng'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-surface-container-high items-center justify-center active:scale-95">
              <MaterialIcons name="close" size={18} color="#584237" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Live Data Bar */}
        <View className="mx-4 mt-2.5 bg-surface-container rounded-xl p-2.5 shadow-sm border border-surface-container-highest/60">
          <View className="flex-row items-center justify-between mb-1.5 px-0.5">
            <Text className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              Live Member Data
            </Text>
            <Text className="text-[11px] font-bold text-primary">Live Data</Text>
          </View>
          <View className="flex-row flex-wrap justify-between gap-1.5">
            <View className="w-[48%] bg-surface-container-lowest rounded-lg p-2 flex-row items-center justify-between shadow-xs">
              <Text className="text-[11px] text-on-surface-variant font-medium">Surplus</Text>
              <Text className="text-xs font-bold text-on-surface">₹4,200<Text className="text-[10px] text-on-surface-variant">/mo</Text></Text>
            </View>
            <View className="w-[48%] bg-surface-container-lowest rounded-lg p-2 flex-row items-center justify-between shadow-xs">
              <Text className="text-[11px] text-on-surface-variant font-medium">Debt</Text>
              <Text className="text-xs font-bold text-secondary">₹12,000</Text>
            </View>
            <View className="w-[48%] bg-surface-container-lowest rounded-lg p-2 flex-row items-center justify-between shadow-xs">
              <Text className="text-[11px] text-on-surface-variant font-medium">Savings</Text>
              <Text className="text-xs font-bold text-on-surface">₹18,000</Text>
            </View>
            <View className="w-[48%] bg-surface-container-lowest rounded-lg p-2 flex-row items-center justify-between shadow-xs">
              <Text className="text-[11px] text-on-surface-variant font-medium">Stage</Text>
              <Text className="text-[11px] font-bold text-primary truncate">2 (Shield)</Text>
            </View>
          </View>
        </View>

        {/* Messages List */}
        <ScrollView className="flex-1 px-4 py-3" contentContainerStyle={{ paddingBottom: 20 }}>
          {messages.map((item) => (
            <View key={item.id} className="mb-3.5">
              {item.sender === 'sakhi' ? (
                <View className="flex-col items-start w-full">
                  <View className="flex-row items-center mb-1 px-1">
                    <View className="w-2 h-2 rounded-full bg-primary mr-1.5" />
                    <Text className="text-xs font-bold text-primary">Sakhi Sister</Text>
                    {item.time && (
                      <Text className="text-[10px] text-on-surface-variant ml-1.5">{item.time}</Text>
                    )}
                  </View>
                  <View className="w-full bg-surface-container-low text-on-surface rounded-2xl rounded-tl-xs p-3.5 shadow-sm border border-surface-container-highest/60">
                    <Text className="text-sm text-on-surface leading-relaxed font-normal">
                      {item.text}
                    </Text>

                    {item.isMathCard && (
                      <View className="mt-2.5 bg-surface-container-lowest rounded-xl p-3 shadow-xs border border-surface-container-highest/50">
                        <View className="flex-row items-center justify-between py-1">
                          <View className="flex-row items-center">
                            <View className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5" />
                            <Text className="text-xs text-on-surface-variant">Total Monthly Surplus</Text>
                          </View>
                          <Text className="text-xs font-bold text-on-surface">₹4,200</Text>
                        </View>
                        <View className="flex-row items-center justify-between py-1">
                          <View className="flex-row items-center">
                            <View className="w-1.5 h-1.5 rounded-full bg-secondary mr-1.5" />
                            <Text className="text-xs text-secondary">Moneylender Repayment</Text>
                          </View>
                          <Text className="text-xs font-bold text-secondary">-₹1,500</Text>
                        </View>
                        <View className="flex-row items-center justify-between py-1">
                          <View className="flex-row items-center">
                            <View className="w-1.5 h-1.5 rounded-full bg-primary-container mr-1.5" />
                            <Text className="text-xs text-on-surface">Daughter's College RD</Text>
                          </View>
                          <Text className="text-xs font-bold text-on-surface">-₹1,500</Text>
                        </View>
                        <View className="w-full h-px bg-surface-container-high my-1.5" />
                        <View className="flex-row items-center justify-between bg-surface-container-low p-2 rounded-lg">
                          <View className="flex-row items-center">
                            <MaterialIcons name="shield" size={15} color="#9d4300" />
                            <Text className="text-xs font-bold text-on-surface ml-1">Leftover Safety Buffer</Text>
                          </View>
                          <Text className="text-sm font-bold text-primary">₹1,200</Text>
                        </View>
                      </View>
                    )}

                    {item.audioLabel && (
                      <View className="flex-row items-center justify-between mt-2.5 pt-1">
                        <TouchableOpacity
                          onPress={() => setIsPlayingAudio(!isPlayingAudio)}
                          className="h-8 px-3 rounded-full bg-primary text-on-primary flex-row items-center active:scale-95 shadow-sm">
                          <MaterialIcons name="volume-up" size={16} color="#ffffff" />
                          <Text className="text-xs font-bold text-on-primary ml-1.5">{item.audioLabel}</Text>
                        </TouchableOpacity>
                        <View className="flex-row items-center bg-surface-container-lowest px-2 py-1 rounded-full border border-surface-container-highest/60">
                          <MaterialIcons name="verified" size={13} color="#9d4300" />
                          <Text className="text-[10px] text-on-surface-variant font-semibold ml-1">
                            Verified Calculations
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              ) : (
                <View className="flex-col items-end w-full">
                  <View className="flex-row items-center mb-1 px-1">
                    {item.time && (
                      <Text className="text-[10px] text-on-surface-variant mr-1.5">{item.time}</Text>
                    )}
                    <Text className="text-xs font-bold text-on-surface">Lakshmi (You)</Text>
                  </View>
                  <View className="max-w-[85%] bg-primary-container rounded-2xl rounded-tr-xs p-3.5 shadow-sm">
                    <Text className="text-sm text-on-primary font-medium">{item.text}</Text>
                  </View>
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Bottom Input Area */}
        <View className="mx-4 mb-3 bg-surface-container-low rounded-2xl p-2.5 shadow-sm border border-surface-container-highest">
          <View className="items-center justify-center py-1 mb-1">
            <TouchableOpacity
              onPress={toggleRecording}
              className="relative items-center justify-center active:scale-95">
              {isRecording && (
                <View className="absolute w-14 h-14 rounded-full bg-primary-container/30 animate-ping" />
              )}
              <View className={`w-12 h-12 rounded-full ${isRecording ? 'bg-secondary' : 'bg-primary-container'} items-center justify-center shadow-md`}>
                <MaterialIcons name={isRecording ? 'graphic-eq' : 'mic'} size={24} color="#ffffff" />
              </View>
            </TouchableOpacity>
            <Text className="text-[11px] text-on-surface-variant font-medium mt-1">
              {isRecording ? 'Listening in Telugu... మాట్లాడండి' : 'Tap to Speak in Telugu or Hindi'}
            </Text>
          </View>

          <View className="flex-row items-center bg-surface-container-lowest rounded-xl p-1 shadow-inner border border-surface-container-highest/60">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask about savings, debt, schemes..."
              placeholderTextColor="#8c7164"
              className="flex-1 px-3 py-2 text-sm text-on-surface font-normal"
              onSubmitEditing={() => handleSend()}
            />
            <TouchableOpacity
              onPress={() => handleSend()}
              className="w-9 h-9 rounded-lg bg-primary-container items-center justify-center active:scale-95 shadow-sm">
              <MaterialIcons name="send" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
