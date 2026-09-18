import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { authService } from '@/services/authService';

export const AVAILABLE_STATES = [
  'Telangana',
  'Andhra Pradesh',
  'Karnataka',
  'Maharashtra',
  'Tamil Nadu',
  'Odisha',
  'Madhya Pradesh',
  'Uttar Pradesh',
  'Bihar',
  'Rajasthan',
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { loginUser, language, setLanguage } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Personal & Credentials
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [age, setAge] = useState('28');
  const [state, setState] = useState('Telangana');
  const [isRural, setIsRural] = useState(true);

  // Step 2: SHG & Livelihood
  const [isSHG, setIsSHG] = useState(true);
  const [shgName, setShgName] = useState('Gayatri Mahila Sangham');
  const [occupation, setOccupation] = useState('Tailoring');

  // Step 3: Financial Baseline
  const [monthlyIncome, setMonthlyIncome] = useState('18500');
  const [monthlyExpenses, setMonthlyExpenses] = useState('14300');
  const [initialSavings, setInitialSavings] = useState('18000');
  const [initialDebt, setInitialDebt] = useState('12000');

  const handleBack = () => {
    if (step === 1) {
      router.replace('/splash' as any);
    } else if (step === 2) {
      setStep(1);
    } else {
      setStep(2);
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      if (!fullName.trim()) {
        Alert.alert('Required Field', 'Please enter your full name to proceed.');
        return;
      }
      if (!phoneNumber.trim() || phoneNumber.trim().length < 10) {
        Alert.alert('Required Field', 'Please enter a valid 10-digit mobile number for account login.');
        return;
      }
      if (!password.trim() || password.trim().length < 6) {
        Alert.alert('Password Requirement', 'Please create a secure password (minimum 6 characters).');
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      setStep(3);
      return;
    }

    // Step 3: Submit Registration with JWT Auth
    setLoading(true);
    try {
      const parsedAge = parseInt(age, 10) || 28;
      const parsedIncome = parseFloat(monthlyIncome) || 0;
      const parsedExpenses = parseFloat(monthlyExpenses) || 0;
      const parsedSavings = parseFloat(initialSavings) || 0;
      const parsedDebt = parseFloat(initialDebt) || 0;

      const response = await authService.register({
        name: fullName.trim(),
        mobile: phoneNumber.trim(),
        password: password.trim(),
        age: parsedAge,
        gender: 'female',
        state: state,
        locality_type: isRural ? 'rural' : 'urban',
        primary_language: language || 'te',
        is_shg_member: isSHG,
        shg_name: isSHG ? shgName.trim() || undefined : undefined,
        occupation: occupation.trim() || 'Self-Employed',
        monthly_income: parsedIncome,
        monthly_expenses: parsedExpenses,
        initial_savings: parsedSavings,
        initial_debt: parsedDebt,
      });

      if (response?.user) {
        await loginUser(response.user);
        router.replace('/(tabs)');
      } else {
        throw new Error('Registration completed but user profile was not returned.');
      }
    } catch (err: any) {
      if (__DEV__) console.warn('User creation failed:', err);
      Alert.alert(
        'Registration Error',
        err.message || 'Could not complete registration on server. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const calculatedSurplus = Math.max(
    0,
    (parseFloat(monthlyIncome) || 0) - (parseFloat(monthlyExpenses) || 0)
  );

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      {/* Top Header Bar */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-surface-container-highest/60 bg-surface">
        <TouchableOpacity
          onPress={handleBack}
          className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center active:scale-95"
          accessibilityLabel="Go back">
          <MaterialIcons name="arrow-back" size={22} color="#9d4300" />
        </TouchableOpacity>

        <View className="flex-row items-center bg-surface-container-high px-3 py-1 rounded-full">
          <MaterialIcons name="person-add" size={14} color="#9d4300" />
          <Text className="text-xs font-bold text-primary ml-1">New Member Registration</Text>
        </View>

        <View className="flex-row items-center gap-1">
          <TouchableOpacity
            onPress={() => setLanguage('te')}
            className={`px-2 py-1 rounded ${language === 'te' ? 'bg-primary' : 'bg-surface-container-high'}`}>
            <Text className={`text-[10px] font-bold ${language === 'te' ? 'text-white' : 'text-on-surface'}`}>
              తెలుగు
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setLanguage('hi')}
            className={`px-2 py-1 rounded ${language === 'hi' ? 'bg-primary' : 'bg-surface-container-high'}`}>
            <Text className={`text-[10px] font-bold ${language === 'hi' ? 'text-white' : 'text-on-surface'}`}>
              हिंदी
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setLanguage('en')}
            className={`px-2 py-1 rounded ${language === 'en' ? 'bg-primary' : 'bg-surface-container-high'}`}>
            <Text className={`text-[10px] font-bold ${language === 'en' ? 'text-white' : 'text-on-surface'}`}>
              EN
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-3" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Mascot & Greeting Card */}
        <View className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-surface-container-highest/60 mb-3.5 flex-col gap-3">
          <View className="flex-row items-center gap-3">
            <View className="w-12 h-12 rounded-full bg-primary-container items-center justify-center shadow-sm">
              <Text className="text-2xl font-bold text-on-primary">स</Text>
            </View>
            <View className="flex-col flex-1 min-w-0">
              <Text className="text-base font-bold text-on-surface">
                Join Sakhi <Text className="text-primary font-bold">(సఖి)</Text>
              </Text>
              <Text className="text-xs text-on-surface-variant">
                Set up your household profile in 3 simple steps
              </Text>
            </View>
          </View>
        </View>

        {/* Stepper Indicator */}
        <View className="bg-surface-container-lowest rounded-xl p-3 shadow-xs border border-surface-container-highest/60 mb-3.5 flex-row justify-between">
          {/* Step 1 */}
          <TouchableOpacity onPress={() => setStep(1)} className="flex-1 items-center px-1">
            <View className={`w-full h-1.5 rounded-full mb-1.5 ${step >= 1 ? 'bg-primary' : 'bg-surface-container-high'}`} />
            <Text className={`text-[11px] font-bold ${step === 1 ? 'text-primary' : 'text-on-surface-variant'}`}>
              1. Personal
            </Text>
          </TouchableOpacity>
          {/* Step 2 */}
          <TouchableOpacity onPress={() => fullName.trim() && setStep(2)} className="flex-1 items-center px-1">
            <View className={`w-full h-1.5 rounded-full mb-1.5 ${step >= 2 ? 'bg-primary' : 'bg-surface-container-high'}`} />
            <Text className={`text-[11px] font-bold ${step === 2 ? 'text-primary' : 'text-on-surface-variant'}`}>
              2. SHG & Work
            </Text>
          </TouchableOpacity>
          {/* Step 3 */}
          <TouchableOpacity onPress={() => fullName.trim() && setStep(3)} className="flex-1 items-center px-1">
            <View className={`w-full h-1.5 rounded-full mb-1.5 ${step === 3 ? 'bg-primary' : 'bg-surface-container-high'}`} />
            <Text className={`text-[11px] font-bold ${step === 3 ? 'text-primary' : 'text-on-surface-variant'}`}>
              3. Finances
            </Text>
          </TouchableOpacity>
        </View>

        {/* STEP 1: PERSONAL INFORMATION */}
        {step === 1 && (
          <View className="flex-col gap-3 mb-4">
            {/* Full Name */}
            <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container-highest/60">
              <Text className="text-xs font-bold text-on-surface mb-1.5">Full Name *</Text>
              <View className="flex-row items-center bg-surface-container-low rounded-lg px-3 py-2 border border-surface-container-highest/60">
                <MaterialIcons name="person" size={18} color="#8c7164" />
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="e.g. Lakshmi Devi"
                  placeholderTextColor="#8c7164"
                  className="flex-1 ml-2 text-xs font-semibold text-on-surface"
                />
              </View>
            </View>

            {/* Mobile Number */}
            <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container-highest/60">
              <Text className="text-xs font-bold text-on-surface mb-1.5">Mobile Number *</Text>
              <View className="flex-row items-center bg-surface-container-low rounded-lg px-3 py-2 border border-surface-container-highest/60">
                <MaterialIcons name="phone" size={18} color="#8c7164" />
                <Text className="text-xs font-bold text-on-surface-variant ml-2 mr-1">+91</Text>
                <TextInput
                  value={phoneNumber}
                  onChangeText={(text) => setPhoneNumber(text.replace(/[^0-9]/g, ''))}
                  keyboardType="phone-pad"
                  maxLength={10}
                  placeholder="e.g. 9876543210"
                  placeholderTextColor="#8c7164"
                  className="flex-1 text-xs font-semibold text-on-surface"
                />
              </View>
            </View>

            {/* Password */}
            <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container-highest/60">
              <Text className="text-xs font-bold text-on-surface mb-1.5">Create Password (min. 6 characters) *</Text>
              <View className="flex-row items-center bg-surface-container-low rounded-lg px-3 py-2 border border-surface-container-highest/60">
                <MaterialIcons name="lock-outline" size={18} color="#8c7164" />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="Enter strong password"
                  placeholderTextColor="#8c7164"
                  className="flex-1 ml-2 text-xs font-semibold text-on-surface"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcons
                    name={showPassword ? 'visibility-off' : 'visibility'}
                    size={18}
                    color="#8c7164"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Age Input */}
            <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container-highest/60">
              <View className="flex-row items-center justify-between mb-1.5">
                <Text className="text-xs font-bold text-on-surface">Age in Years</Text>
                <Text className="text-xs font-bold text-primary">{age} yrs</Text>
              </View>
              <View className="flex-row items-center bg-surface-container-low rounded-lg px-3 py-2 border border-surface-container-highest/60">
                <TextInput
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                  className="flex-1 text-xs font-semibold text-on-surface"
                />
              </View>
            </View>

            {/* State Selection */}
            <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container-highest/60">
              <Text className="text-xs font-bold text-on-surface mb-2">State of Residence</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                {AVAILABLE_STATES.map((st) => (
                  <TouchableOpacity
                    key={st}
                    onPress={() => setState(st)}
                    className={`px-3 py-1.5 rounded-lg border mr-2 ${
                      state === st
                        ? 'bg-primary border-primary'
                        : 'bg-surface-container-low border-surface-container-highest/60'
                    }`}>
                    <Text className={`text-xs font-bold ${state === st ? 'text-white' : 'text-on-surface'}`}>
                      {st}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Location (Rural / Urban) */}
            <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container-highest/60">
              <Text className="text-xs font-bold text-on-surface mb-2">Where is your family home located?</Text>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => setIsRural(true)}
                  className={`flex-1 p-2.5 rounded-xl border flex-row items-center justify-between ${
                    isRural
                      ? 'bg-surface-container border-primary-container'
                      : 'bg-surface-container-low border-surface-container-highest/60'
                  } active:scale-95`}>
                  <Text className="text-xs font-bold text-on-surface">Rural village</Text>
                  {isRural && <MaterialIcons name="check-circle" size={16} color="#9d4300" />}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setIsRural(false)}
                  className={`flex-1 p-2.5 rounded-xl border flex-row items-center justify-between ${
                    !isRural
                      ? 'bg-surface-container border-primary-container'
                      : 'bg-surface-container-low border-surface-container-highest/60'
                  } active:scale-95`}>
                  <Text className="text-xs font-bold text-on-surface">Urban town</Text>
                  {!isRural && <MaterialIcons name="check-circle" size={16} color="#9d4300" />}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* STEP 2: SHG & LIVELIHOOD */}
        {step === 2 && (
          <View className="flex-col gap-3 mb-4">
            {/* SHG Member Toggle */}
            <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container-highest/60">
              <Text className="text-xs font-bold text-on-surface mb-2">
                Are you a member of a Self-Help Group (SHG)?
              </Text>
              <View className="flex-row gap-2 mb-3">
                <TouchableOpacity
                  onPress={() => setIsSHG(true)}
                  className={`flex-1 p-3 rounded-xl border flex-row items-center justify-between ${
                    isSHG
                      ? 'bg-surface-container border-primary-container'
                      : 'bg-surface-container-low border-surface-container-highest/60'
                  } active:scale-95`}>
                  <Text className="text-xs font-bold text-on-surface">Yes, SHG Member</Text>
                  {isSHG && <MaterialIcons name="check-circle" size={16} color="#9d4300" />}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setIsSHG(false)}
                  className={`flex-1 p-3 rounded-xl border flex-row items-center justify-between ${
                    !isSHG
                      ? 'bg-surface-container border-primary-container'
                      : 'bg-surface-container-low border-surface-container-highest/60'
                  } active:scale-95`}>
                  <Text className="text-xs font-bold text-on-surface">Independent</Text>
                  {!isSHG && <MaterialIcons name="check-circle" size={16} color="#9d4300" />}
                </TouchableOpacity>
              </View>

              {isSHG && (
                <View>
                  <Text className="text-xs font-bold text-on-surface mb-1.5">SHG Group Name</Text>
                  <View className="flex-row items-center bg-surface-container-low rounded-lg px-3 py-2 border border-surface-container-highest/60">
                    <MaterialIcons name="groups" size={18} color="#8c7164" />
                    <TextInput
                      value={shgName}
                      onChangeText={setShgName}
                      placeholder="e.g. Gayatri Mahila Sangham"
                      placeholderTextColor="#8c7164"
                      className="flex-1 ml-2 text-xs font-semibold text-on-surface"
                    />
                  </View>
                </View>
              )}
            </View>

            {/* Occupation */}
            <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container-highest/60">
              <Text className="text-xs font-bold text-on-surface mb-1.5">Primary Livelihood / Occupation</Text>
              <View className="flex-row items-center bg-surface-container-low rounded-lg px-3 py-2 border border-surface-container-highest/60 mb-2.5">
                <MaterialIcons name="work" size={18} color="#8c7164" />
                <TextInput
                  value={occupation}
                  onChangeText={setOccupation}
                  placeholder="e.g. Tailoring, Dairy, Agriculture, Retail"
                  placeholderTextColor="#8c7164"
                  className="flex-1 ml-2 text-xs font-semibold text-on-surface"
                />
              </View>

              {/* Quick Occupation Chips */}
              <View className="flex-row flex-wrap gap-1.5">
                {['Tailoring', 'Dairy Farming', 'Agriculture', 'Kirana Store', 'Handicrafts'].map((occ) => (
                  <TouchableOpacity
                    key={occ}
                    onPress={() => setOccupation(occ)}
                    className={`px-2.5 py-1 rounded-md border ${
                      occupation === occ
                        ? 'bg-primary border-primary'
                        : 'bg-surface-container-low border-surface-container-highest/60'
                    }`}>
                    <Text className={`text-[11px] font-semibold ${occupation === occ ? 'text-white' : 'text-on-surface'}`}>
                      {occ}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* STEP 3: FINANCIAL BASELINE */}
        {step === 3 && (
          <View className="flex-col gap-3 mb-4">
            {/* Monthly Income */}
            <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container-highest/60">
              <Text className="text-xs font-bold text-on-surface mb-1.5">Monthly Household Income (₹)</Text>
              <View className="flex-row items-center bg-surface-container-low rounded-lg px-3 py-2 border border-surface-container-highest/60">
                <Text className="text-xs font-bold text-primary mr-1.5">₹</Text>
                <TextInput
                  value={monthlyIncome}
                  onChangeText={setMonthlyIncome}
                  keyboardType="numeric"
                  placeholder="e.g. 18500"
                  placeholderTextColor="#8c7164"
                  className="flex-1 text-xs font-semibold text-on-surface"
                />
              </View>
            </View>

            {/* Monthly Expenses */}
            <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container-highest/60">
              <Text className="text-xs font-bold text-on-surface mb-1.5">Monthly Living Expenses (₹)</Text>
              <View className="flex-row items-center bg-surface-container-low rounded-lg px-3 py-2 border border-surface-container-highest/60">
                <Text className="text-xs font-bold text-secondary mr-1.5">₹</Text>
                <TextInput
                  value={monthlyExpenses}
                  onChangeText={setMonthlyExpenses}
                  keyboardType="numeric"
                  placeholder="e.g. 14300"
                  placeholderTextColor="#8c7164"
                  className="flex-1 text-xs font-semibold text-on-surface"
                />
              </View>
            </View>

            {/* Calculated Monthly Surplus Highlight */}
            <View className="bg-primary-fixed/20 border border-primary/40 rounded-xl p-3 flex-row items-center justify-between">
              <View>
                <Text className="text-xs font-bold text-on-surface">Calculated Monthly Surplus</Text>
                <Text className="text-[10px] text-on-surface-variant font-medium">Safe amount available for savings</Text>
              </View>
              <Text className="text-base font-bold text-primary">₹{calculatedSurplus.toLocaleString('en-IN')}</Text>
            </View>

            {/* Current Savings */}
            <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container-highest/60">
              <Text className="text-xs font-bold text-on-surface mb-1.5">Current Total Savings (₹)</Text>
              <View className="flex-row items-center bg-surface-container-low rounded-lg px-3 py-2 border border-surface-container-highest/60">
                <Text className="text-xs font-bold text-primary mr-1.5">₹</Text>
                <TextInput
                  value={initialSavings}
                  onChangeText={setInitialSavings}
                  keyboardType="numeric"
                  placeholder="e.g. 18000"
                  placeholderTextColor="#8c7164"
                  className="flex-1 text-xs font-semibold text-on-surface"
                />
              </View>
            </View>

            {/* Outstanding Debt */}
            <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container-highest/60">
              <Text className="text-xs font-bold text-on-surface mb-1.5">Total Outstanding Debt (₹)</Text>
              <View className="flex-row items-center bg-surface-container-low rounded-lg px-3 py-2 border border-surface-container-highest/60">
                <Text className="text-xs font-bold text-secondary mr-1.5">₹</Text>
                <TextInput
                  value={initialDebt}
                  onChangeText={setInitialDebt}
                  keyboardType="numeric"
                  placeholder="e.g. 12000"
                  placeholderTextColor="#8c7164"
                  className="flex-1 text-xs font-semibold text-on-surface"
                />
              </View>
            </View>
          </View>
        )}

        {/* Primary CTA */}
        <TouchableOpacity
          onPress={handleNext}
          disabled={loading}
          className="w-full min-h-[50px] bg-primary-container rounded-xl flex-row items-center justify-center shadow-md active:scale-[0.98] mb-3">
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <Text className="text-sm font-bold text-on-primary mr-1.5">
                {step === 1
                  ? 'Next Step: SHG & Livelihood'
                  : step === 2
                  ? 'Next Step: Household Finances'
                  : 'Complete Registration & Enter'}
              </Text>
              <MaterialIcons name="arrow-forward" size={18} color="#ffffff" />
            </>
          )}
        </TouchableOpacity>

        {/* Existing Member Link */}
        <TouchableOpacity
          onPress={() => router.replace('/signin' as any)}
          className="w-full py-2 items-center justify-center">
          <Text className="text-xs text-on-surface-variant font-medium">
            Already registered? <Text className="text-primary font-bold">Sign In here</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
