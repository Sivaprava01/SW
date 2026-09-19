import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { speechRecorder } from '@/utils/speechRecorder';

type LogTransactionModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave?: (tx: any) => void;
};

export function LogTransactionModal({ visible, onClose, onSave }: LogTransactionModalProps) {
  const { logTransaction, totalMonthlySurplus, language } = useApp();
  const [txType, setTxType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('1400');
  const [selectedCategory, setSelectedCategory] = useState('Shop Sales / Market');
  const [note, setNote] = useState('Weekly handloom bazaar sales');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [sttError, setSttError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleSpeech = async () => {
    setSttError(null);
    const activeLang = language || 'te';

    if (isRecording) {
      await speechRecorder.stop(activeLang, {
        onStop: () => setIsRecording(false),
        onTranscribing: () => setIsTranscribing(true),
        onTranscript: (transcribedText) => {
          setIsTranscribing(false);
          setNote(transcribedText);
        },
        onError: (err) => {
          setIsTranscribing(false);
          setSttError(err);
        },
      });
    } else {
      await speechRecorder.start(activeLang, {
        onStart: () => setIsRecording(true),
        onStop: () => setIsRecording(false),
        onTranscribing: () => setIsTranscribing(true),
        onTranscript: (transcribedText) => {
          setIsTranscribing(false);
          setNote(transcribedText);
        },
        onError: (err) => {
          setIsRecording(false);
          setIsTranscribing(false);
          setSttError(err);
        },
      });
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const formatDisplayDate = (d: Date) => {
    const today = new Date();
    const isToday =
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();
    const day = d.getDate();
    const monthStr = monthNames[d.getMonth()].substring(0, 3);
    const year = d.getFullYear();
    return `${isToday ? 'Today, ' : ''}${day} ${monthStr} ${year}`;
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((y) => y - 1);
    } else {
      setCalendarMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((y) => y + 1);
    } else {
      setCalendarMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    setSelectedDate(new Date(calendarYear, calendarMonth, day));
    setShowCalendar(false);
  };

  const numAmount = parseInt(amount, 10) || 0;
  const baseSurplus = totalMonthlySurplus;
  const projectedSurplus = txType === 'income' ? baseSurplus + numAmount : Math.max(0, baseSurplus - numAmount);

  const incomeCategories = [
    { name: 'Shop Sales / Market', icon: 'storefront' as const },
    { name: 'Tailoring & Garments', icon: 'checkroom' as const },
    { name: 'Salary / Wages', icon: 'payments' as const },
    { name: 'Agri & Livestock', icon: 'agriculture' as const },
    { name: 'SHG Loan Disbursed', icon: 'diversity-3' as const },
    { name: 'Govt Benefit / DBT', icon: 'assured-workload' as const },
    { name: 'Other Income', icon: 'savings' as const },
  ];

  const expenseCategories = [
    { name: 'Food & Groceries', icon: 'shopping-cart' as const },
    { name: 'SHG Monthly Contribution', icon: 'groups' as const },
    { name: 'Rent & Electricity', icon: 'lightbulb' as const },
    { name: 'Healthcare & Medicine', icon: 'medical-services' as const },
    { name: 'Children School Fees', icon: 'school' as const },
    { name: 'Loan EMI Repayment', icon: 'assignment-return' as const },
    { name: 'Festival & Family', icon: 'celebration' as const },
    { name: 'Other Expense', icon: 'receipt' as const },
  ];

  const addAmount = (val: number) => {
    setAmount((prev) => ((parseInt(prev, 10) || 0) + val).toString());
  };

  const handleSave = async () => {
    if (numAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0.');
      return;
    }

    setIsSubmitting(true);
    try {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const savedTx = await logTransaction({
        amount: numAmount,
        type: txType,
        category: selectedCategory,
        date: dateStr,
        description: note.trim() || undefined,
      });

      if (onSave) {
        onSave(savedTx);
      }
      onClose();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
        {/* Header */}
        <View className="px-4 py-3 bg-surface border-b border-surface-container-highest flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-7 h-7 rounded-full bg-primary-container/20 items-center justify-center mr-2">
              <MaterialIcons name="edit-note" size={18} color="#f97316" />
            </View>
            <Text className="text-base font-bold text-on-surface">Log Income or Expense</Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            className="w-9 h-9 rounded-full bg-surface-container-high items-center justify-center active:scale-95">
            <MaterialIcons name="close" size={18} color="#221a0e" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-4 py-3" contentContainerStyle={{ paddingBottom: 40 }}>
          {/* 1. Transaction Type Toggle */}
          <View className="w-full bg-surface-container-high p-1 rounded-full flex-row items-center mb-3">
            <TouchableOpacity
              onPress={() => {
                setTxType('income');
                setSelectedCategory('Shop Sales / Market');
              }}
              className={`flex-1 py-2 rounded-full flex-row items-center justify-center ${
                txType === 'income' ? 'bg-primary-container shadow-sm' : 'bg-transparent'
              } active:scale-95`}>
              {txType === 'income' && (
                <MaterialIcons name="check-circle" size={16} color="#ffffff" className="mr-1" />
              )}
              <Text
                className={`text-xs font-bold ${
                  txType === 'income' ? 'text-on-primary' : 'text-on-surface-variant'
                }`}>
                Income (+)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setTxType('expense');
                setSelectedCategory('Food & Groceries');
              }}
              className={`flex-1 py-2 rounded-full flex-row items-center justify-center ${
                txType === 'expense' ? 'bg-secondary shadow-sm' : 'bg-transparent'
              } active:scale-95`}>
              {txType === 'expense' && (
                <MaterialIcons name="check-circle" size={16} color="#ffffff" className="mr-1" />
              )}
              <Text
                className={`text-xs font-bold ${
                  txType === 'expense' ? 'text-on-primary' : 'text-on-surface-variant'
                }`}>
                Expense (-)
              </Text>
            </TouchableOpacity>
          </View>

          {/* 2. Amount Input + Quick Chips */}
          <View className="bg-surface-container-low rounded-xl p-3.5 mb-3.5 border border-surface-container-highest/60 shadow-sm">
            <Text className="text-[11px] uppercase tracking-wider font-bold text-on-surface-variant mb-1">
              Amount
            </Text>
            <View className="flex-row items-center bg-surface-container-lowest px-3 py-2 rounded-lg border border-surface-container-highest/60">
              <Text className="text-2xl font-bold text-primary mr-1.5">₹</Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                className="flex-1 text-2xl font-bold text-on-surface"
                placeholder="0"
                placeholderTextColor="#8c7164"
              />
              <TouchableOpacity
                onPress={() => setAmount('')}
                className="w-7 h-7 rounded-full items-center justify-center active:scale-90">
                <MaterialIcons name="backspace" size={18} color="#8c7164" />
              </TouchableOpacity>
            </View>

            {/* Quick Preset Chips */}
            <View className="flex-row gap-1.5 mt-2.5">
              {[200, 500, 1000, 2000].map((preset) => (
                <TouchableOpacity
                  key={preset}
                  onPress={() => addAmount(preset)}
                  className="flex-1 py-1.5 rounded-full bg-surface-container-lowest items-center justify-center border border-surface-container-highest/60 active:scale-95">
                  <Text className="text-xs font-bold text-on-surface">+₹{preset.toLocaleString('en-IN')}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 3. Category Selector */}
          <View className="mb-3.5">
            <Text className="text-[11px] uppercase tracking-wider font-bold text-on-surface-variant mb-1.5">
              Select Category
            </Text>
            <View className="flex-row flex-wrap gap-1.5">
              {(txType === 'income' ? incomeCategories : expenseCategories).map((cat) => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <TouchableOpacity
                    key={cat.name}
                    onPress={() => setSelectedCategory(cat.name)}
                    className={`w-[48.5%] min-h-[44px] p-2.5 rounded-lg flex-row items-center justify-between ${
                      isSelected
                        ? txType === 'income'
                          ? 'bg-primary-container/15 border border-primary-container'
                          : 'bg-secondary/15 border border-secondary'
                        : 'bg-surface-container-low border border-surface-container-highest/50'
                    } active:scale-95`}>
                    <View className="flex-row items-center flex-1 mr-1">
                      <MaterialIcons
                        name={cat.icon}
                        size={18}
                        color={isSelected ? (txType === 'income' ? '#9d4300' : '#b3291b') : '#584237'}
                      />
                      <Text
                        className={`text-xs font-bold ml-1.5 flex-1 truncate ${
                          isSelected ? 'text-on-surface font-bold' : 'text-on-surface-variant'
                        }`}
                        numberOfLines={1}>
                        {cat.name}
                      </Text>
                    </View>
                    {isSelected && (
                      <MaterialIcons
                        name="check-circle"
                        size={16}
                        color={txType === 'income' ? '#9d4300' : '#b3291b'}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 4. Transaction Date with Interactive Calendar Picker */}
          <View className="mb-3.5">
            <Text className="text-[12px] uppercase tracking-wider font-bold text-on-surface-variant mb-1">
              Transaction Date
            </Text>
            <TouchableOpacity
              onPress={() => setShowCalendar(!showCalendar)}
              className="bg-surface-container-low rounded-lg px-3.5 py-2.5 flex-row items-center justify-between border border-surface-container-highest/60 active:scale-[0.99]">
              <View className="flex-row items-center">
                <MaterialIcons name="calendar-today" size={18} color="#9d4300" />
                <Text className="text-sm font-bold text-on-surface ml-2">
                  {formatDisplayDate(selectedDate)}
                </Text>
              </View>
              <MaterialIcons
                name={showCalendar ? 'expand-less' : 'expand-more'}
                size={20}
                color="#8c7164"
              />
            </TouchableOpacity>

            {/* Interactive Calendar Dropdown */}
            {showCalendar && (
              <View className="mt-2 bg-surface-container-lowest rounded-xl p-3 border border-surface-container-highest/70 shadow-sm">
                {/* Month/Year Header with Navigation */}
                <View className="flex-row items-center justify-between mb-2 pb-1 border-b border-surface-container-highest/50">
                  <TouchableOpacity
                    onPress={handlePrevMonth}
                    className="w-7 h-7 rounded-full bg-surface-container items-center justify-center active:scale-90">
                    <MaterialIcons name="chevron-left" size={20} color="#9d4300" />
                  </TouchableOpacity>
                  <Text className="text-sm font-bold text-on-surface">
                    {monthNames[calendarMonth]} {calendarYear}
                  </Text>
                  <TouchableOpacity
                    onPress={handleNextMonth}
                    className="w-7 h-7 rounded-full bg-surface-container items-center justify-center active:scale-90">
                    <MaterialIcons name="chevron-right" size={20} color="#9d4300" />
                  </TouchableOpacity>
                </View>

                {/* Day of Week Headers */}
                <View className="flex-row justify-around mb-1.5">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                    <Text key={d} className="w-8 text-center text-[11px] font-bold text-on-surface-variant">
                      {d}
                    </Text>
                  ))}
                </View>

                {/* Day Grid */}
                <View className="flex-row flex-wrap">
                  {Array.from({ length: getFirstDayOfMonth(calendarMonth, calendarYear) }).map((_, i) => (
                    <View key={`empty-${i}`} className="w-[14.28%] h-8" />
                  ))}
                  {Array.from({ length: getDaysInMonth(calendarMonth, calendarYear) }).map((_, i) => {
                    const day = i + 1;
                    const isSelected =
                      selectedDate.getDate() === day &&
                      selectedDate.getMonth() === calendarMonth &&
                      selectedDate.getFullYear() === calendarYear;
                    const isToday =
                      new Date().getDate() === day &&
                      new Date().getMonth() === calendarMonth &&
                      new Date().getFullYear() === calendarYear;

                    return (
                      <TouchableOpacity
                        key={`day-${day}`}
                        onPress={() => handleSelectDay(day)}
                        className={`w-[14.28%] h-8 items-center justify-center rounded-full ${
                          isSelected
                            ? 'bg-primary shadow-xs'
                            : isToday
                            ? 'bg-surface-container border border-primary/40'
                            : ''
                        } active:scale-90`}>
                        <Text
                          className={`text-xs ${
                            isSelected
                              ? 'font-bold text-on-primary'
                              : isToday
                              ? 'font-bold text-primary'
                              : 'text-on-surface font-medium'
                          }`}>
                          {day}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}
          </View>

          {/* 5. Note / Description with Voice Mic */}
          <View className="mb-3.5">
            <Text className="text-[11px] uppercase tracking-wider font-bold text-on-surface-variant mb-1">
              Note / Description
            </Text>
            <View className="flex-row items-center bg-surface-container-low rounded-lg px-3 py-1.5 border border-surface-container-highest/60">
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="e.g., Weekly handloom bazaar sales"
                placeholderTextColor="#8c7164"
                className="flex-1 text-xs text-on-surface"
              />
              <TouchableOpacity
                onPress={handleToggleSpeech}
                disabled={isTranscribing}
                className={`w-9 h-9 rounded-full ${
                  isRecording ? 'bg-secondary' : isTranscribing ? 'bg-amber-600' : 'bg-primary-container'
                } items-center justify-center active:scale-90 shadow-sm ml-1.5`}>
                {isTranscribing ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <MaterialIcons name={isRecording ? 'graphic-eq' : 'mic'} size={18} color="#ffffff" />
                )}
              </TouchableOpacity>
            </View>
            {isRecording && (
              <Text className="text-[10px] text-secondary font-semibold mt-1">
                {language === 'te'
                  ? '🎙️ వింటున్నాము... మీ వివరణ చెప్పండి'
                  : language === 'hi'
                  ? '🎙️ सुन रहे हैं... अपना नोट बोलें'
                  : '🎙️ Listening... speak your note now'}
              </Text>
            )}
            {isTranscribing && (
              <Text className="text-[10px] text-amber-700 font-semibold mt-1">
                {language === 'te'
                  ? 'లిప్యంతరీకరణ జరుగుతోంది...'
                  : language === 'hi'
                  ? 'टेक्स्ट में बदला जा रहा है...'
                  : 'Transcribing speech to text...'}
              </Text>
            )}
            {sttError && (
              <Text className="text-[10px] text-error font-medium mt-1">
                {sttError}
              </Text>
            )}
          </View>

          {/* 6. Projected Household Impact */}
          <View className="bg-surface-container p-3.5 rounded-xl flex-row items-start mb-4 border border-surface-container-highest/60">
            <View className="w-8 h-8 rounded-full bg-primary-container items-center justify-center mr-2.5 mt-0.5 shadow-xs">
              <MaterialIcons name="trending-up" size={18} color="#ffffff" />
            </View>
            <View className="flex-col flex-1">
              <Text className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
                Projected Household Impact
              </Text>
              <Text className="text-xs text-on-surface mt-0.5 leading-relaxed">
                {txType === 'income' ? 'Adding' : 'Logging'}{' '}
                <Text className="font-bold">₹{numAmount.toLocaleString('en-IN')}</Text> will adjust your monthly
                surplus to <Text className="font-bold text-primary">₹{projectedSurplus.toLocaleString('en-IN')}</Text>.
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={onClose}
              disabled={isSubmitting}
              className="w-1/3 min-h-[46px] rounded-full bg-surface-container-high items-center justify-center active:scale-95">
              <Text className="text-xs font-bold text-on-surface">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              disabled={isSubmitting}
              className="flex-1 min-h-[46px] rounded-full bg-primary-container flex-row items-center justify-center active:scale-95 shadow-md">
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <MaterialIcons name="check" size={18} color="#ffffff" />
                  <Text className="text-xs font-bold text-on-primary ml-1">Save Transaction</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
