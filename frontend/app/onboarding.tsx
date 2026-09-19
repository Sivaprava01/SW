import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
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

// Localized strings
const L = {
  newMember: { en: 'New Member Registration', te: 'కొత్త సభ్యుడు నమోదు', hi: 'नया सदस्य पंजीकरण' },
  joinTitle: { en: 'Join Sakhi', te: 'సఖిలో చేరండి', hi: 'सखी से जुड़ें' },
  joinSubtitle: { en: 'Set up your household profile in 3 simple steps', te: '3 సులభ దశల్లో మీ గృహ ప్రొఫైల్‌ను సెటప్ చేయండి', hi: '3 आसान चरणों में अपना घरेलू प्रोफाइल सेट करें' },
  step1Label: { en: '1. Personal', te: '1. వ్యక్తిగత', hi: '1. व्यक्तिगत' },
  step2Label: { en: '2. SHG & Work', te: '2. SHG & వృత్తి', hi: '2. SHG & कार्य' },
  step3Label: { en: '3. Finances', te: '3. ఆర్థికం', hi: '3. वित्त' },
  fullNameLabel: { en: 'Full Name *', te: 'పూర్తి పేరు *', hi: 'पूरा नाम *' },
  fullNamePlaceholder: { en: 'e.g. Lakshmi Devi', te: 'ఉదా: లక్ష్మీ దేవి', hi: 'उदा. लक्ष्मी देवी' },
  mobileLabel: { en: 'Mobile Number *', te: 'మొబైల్ నంబర్ *', hi: 'मोबाइल नंबर *' },
  mobilePlaceholder: { en: 'e.g. 9876543210', te: 'ఉదా: 9876543210', hi: 'उदा. 9876543210' },
  passwordLabel: { en: 'Create Password (min. 6 characters) *', te: 'పాస్‌వర్డ్ సృష్టించండి (కనీసం 6 అక్షరాలు) *', hi: 'पासवर्ड बनाएं (न्यूनतम 6 अक्षर) *' },
  passwordPlaceholder: { en: 'Enter strong password', te: 'బలమైన పాస్‌వర్డ్ నమోదు చేయండి', hi: 'मजबूत पासवर्ड दर्ज करें' },
  ageLabel: { en: 'Age in Years', te: 'వయస్సు (సంవత్సరాల్లో)', hi: 'आयु (वर्षों में)' },
  ageUnit: { en: 'yrs', te: 'సం.', hi: 'वर्ष' },
  stateLabel: { en: 'State of Residence', te: 'నివాస రాష్ట్రం', hi: 'निवास राज्य' },
  locationLabel: { en: 'Where is your family home located?', te: 'మీ కుటుంబ నివాసం ఎక్కడ ఉంది?', hi: 'आपका पारिवारिक घर कहाँ स्थित है?' },
  rural: { en: 'Rural village', te: 'గ్రామీణ గ్రామం', hi: 'ग्रामीण गाँव' },
  urban: { en: 'Urban town', te: 'పట్టణ నగరం', hi: 'शहरी कस्बा' },
  shgQuestion: { en: 'Are you a member of a Self-Help Group (SHG)?', te: 'మీరు స్వయం-సహాయ బృందం (SHG) సభ్యులా?', hi: 'क्या आप एक स्व-सहायता समूह (SHG) के सदस्य हैं?' },
  yesSHG: { en: 'Yes, SHG Member', te: 'అవును, SHG సభ్యుడు', hi: 'हाँ, SHG सदस्य' },
  independent: { en: 'Independent', te: 'స్వతంత్ర', hi: 'स्वतंत्र' },
  shgNameLabel: { en: 'SHG Group Name', te: 'SHG బృందం పేరు', hi: 'SHG समूह का नाम' },
  shgNamePlaceholder: { en: 'e.g. Gayatri Mahila Sangham', te: 'ఉదా: గాయత్రీ మహిళా సంఘం', hi: 'उदा. गायत्री महिला संघम' },
  occupationLabel: { en: 'Primary Livelihood / Occupation', te: 'ప్రాథమిక జీవనోపాధి / వృత్తి', hi: 'प्राथमिक आजीविका / व्यवसाय' },
  occupationPlaceholder: { en: 'e.g. Tailoring, Dairy, Agriculture, Retail', te: 'ఉదా: కుట్టుపని, పాడి, వ్యవసాయం, చిల్లర వ్యాపారం', hi: 'उदा. सिलाई, डेयरी, कृषि, खुदरा' },
  occupationChipsEn: ['Tailoring', 'Dairy Farming', 'Agriculture', 'Kirana Store', 'Handicrafts'],
  occupationChipsTe: ['కుట్టుపని', 'పాడి పరిశ్రమ', 'వ్యవసాయం', 'కిరాణా దుకాణం', 'హస్తకళలు'],
  occupationChipsHi: ['सिलाई', 'डेयरी खेती', 'कृषि', 'किराना स्टोर', 'हस्तशिल्प'],
  incomeLabel: { en: 'Monthly Household Income (₹)', te: 'నెలవారీ గృహ ఆదాయం (₹)', hi: 'मासिक घरेलू आय (₹)' },
  expensesLabel: { en: 'Monthly Living Expenses (₹)', te: 'నెలవారీ జీవన ఖర్చులు (₹)', hi: 'मासिक जीवन व्यय (₹)' },
  surplusLabel: { en: 'Calculated Monthly Surplus', te: 'లెక్కించిన నెలవారీ మిగులు', hi: 'परिकलित मासिक अधिशेष' },
  surplusSub: { en: 'Safe amount available for savings', te: 'పొదుపు కోసం అందుబాటులో ఉన్న సురక్షిత మొత్తం', hi: 'बचत के लिए उपलब्ध सुरक्षित राशि' },
  savingsLabel: { en: 'Current Total Savings (₹)', te: 'ప్రస్తుత మొత్తం పొదుపు (₹)', hi: 'वर्तमान कुल बचत (₹)' },
  debtLabel: { en: 'Total Outstanding Debt (₹)', te: 'మొత్తం మిగిలిన అప్పు (₹)', hi: 'कुल बकाया ऋण (₹)' },
  nextSHG: { en: 'Next Step: SHG & Livelihood', te: 'తదుపరి దశ: SHG & జీవనోపాధి', hi: 'अगला चरण: SHG और आजीविका' },
  nextFinance: { en: 'Next Step: Household Finances', te: 'తదుపరి దశ: గృహ ఆర్థికం', hi: 'अगला चरण: घरेलू वित्त' },
  completeReg: { en: 'Complete Registration & Enter', te: 'నమోదు పూర్తి చేయండి & లోపలికి రండి', hi: 'पंजीकरण पूर्ण करें और प्रवेश करें' },
  alreadyRegistered: { en: 'Already registered?', te: 'ఇప్పటికే నమోదు చేసుకున్నారా?', hi: 'पहले से पंजीकृत हैं?' },
  signInHere: { en: 'Sign In here', te: 'ఇక్కడ లాగిన్ అవ్వండి', hi: 'यहाँ साइन इन करें' },
  goBack: { en: 'Go back', te: 'వెనక్కు వెళ్ళండి', hi: 'वापस जाएं' },
};

type Lang = 'en' | 'te' | 'hi';
type StrKey = keyof Omit<typeof L, 'occupationChipsEn' | 'occupationChipsTe' | 'occupationChipsHi'>;

function t(key: StrKey, lang: Lang): string {
  const entry = L[key] as Record<string, string>;
  return entry[lang] ?? entry['en'];
}

export default function OnboardingScreen() {
  const router = useRouter();
  const { loginUser, language, setLanguage } = useApp();
  const lang = (language as Lang) || 'en';

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [age, setAge] = useState('28');
  const [state, setState] = useState('Telangana');
  const [isRural, setIsRural] = useState(true);

  const [isSHG, setIsSHG] = useState(true);
  const [shgName, setShgName] = useState('Gayatri Mahila Sangham');
  const [occupation, setOccupation] = useState('Tailoring');

  const [monthlyIncome, setMonthlyIncome] = useState('18500');
  const [monthlyExpenses, setMonthlyExpenses] = useState('14300');
  const [initialSavings, setInitialSavings] = useState('18000');
  const [initialDebt, setInitialDebt] = useState('12000');

  const handleBack = () => {
    setRegError(null);
    if (step === 1) {
      router.replace('/splash' as any);
    } else if (step === 2) {
      setStep(1);
    } else {
      setStep(2);
    }
  };

  const handleNext = async () => {
    setRegError(null);
    let cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('91') && cleanPhone.length === 12) {
      cleanPhone = cleanPhone.substring(2);
    }

    if (step === 1) {
      if (!fullName.trim() || fullName.trim().length < 2) {
        setRegError(lang === 'te' ? 'దయచేసి మీ పూర్తి పేరును నమోదు చేయండి (కనీసం 2 అక్షరాలు).' : lang === 'hi' ? 'कृपया अपना पूरा नाम दर्ज करें (कम से कम 2 अक्षर)।' : 'Please enter your full name (minimum 2 characters).');
        return;
      }
      if (!cleanPhone || cleanPhone.length < 10) {
        setRegError(lang === 'te' ? 'దయచేసి సరైన 10-అంకెల మొబైల్ నంబర్‌ను నమోదు చేయండి.' : lang === 'hi' ? 'कृपया एक वैध 10 अंकों का मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
        return;
      }
      if (!password.trim() || password.trim().length < 6) {
        setRegError(lang === 'te' ? 'పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి.' : lang === 'hi' ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' : 'Password must be at least 6 characters.');
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      setStep(3);
      return;
    }

    setLoading(true);
    try {
      const parsedAge = Math.max(18, Math.min(100, parseInt(age, 10) || 28));
      const parsedIncome = parseFloat(monthlyIncome) || 0;
      const parsedExpenses = parseFloat(monthlyExpenses) || 0;
      const parsedSavings = parseFloat(initialSavings) || 0;
      const parsedDebt = parseFloat(initialDebt) || 0;

      const response = await authService.register({
        name: fullName.trim(),
        mobile: cleanPhone,
        password: password.trim(),
        age: parsedAge,
        gender: 'female',
        state: state,
        locality_type: isRural ? 'rural' : 'urban',
        primary_language: lang || 'te',
        is_shg_member: isSHG,
        shg_name: isSHG ? shgName.trim() || undefined : undefined,
        occupation: occupation.trim() || 'Tailoring',
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
      const is409 = err?.status === 409 || (typeof err?.message === 'string' && err.message.toLowerCase().includes('already exists'));
      const duplicateMsg = lang === 'te' ? 'ఈ మొబైల్ నంబర్‌తో ఇప్పటికే ఖాతా ఉంది. దయచేసి లాగిన్ అవ్వండి.' : lang === 'hi' ? 'इस मोबाइल नंबर के साथ पहले से खाता मौजूद है। कृपया साइन इन करें।' : 'An account with this mobile number already exists. Please sign in.';
      const errorMsg = is409 ? duplicateMsg : (err?.message || (lang === 'te' ? 'సర్వర్‌లో నమోదు పూర్తి కాలేదు.' : lang === 'hi' ? 'सर्वर पर पंजीकरण पूरा नहीं हो सका।' : 'Could not complete registration on server.'));
      setRegError(errorMsg);
      if (is409) setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const calculatedSurplus = Math.max(0, (parseFloat(monthlyIncome) || 0) - (parseFloat(monthlyExpenses) || 0));
  const occupationChips = lang === 'te' ? L.occupationChipsTe : lang === 'hi' ? L.occupationChipsHi : L.occupationChipsEn;
  const occupationChipsEn = L.occupationChipsEn;

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-surface-container-highest/60 bg-surface">
        <TouchableOpacity onPress={handleBack} className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center active:scale-95" accessibilityLabel={t('goBack', lang)}>
          <MaterialIcons name="arrow-back" size={22} color="#9d4300" />
        </TouchableOpacity>
        <View className="flex-row items-center bg-surface-container-high px-3 py-1 rounded-full">
          <MaterialIcons name="person-add" size={14} color="#9d4300" />
          <Text className="text-xs font-bold text-primary ml-1">{t('newMember', lang)}</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <TouchableOpacity onPress={() => setLanguage('te')} className={`px-2 py-1 rounded ${language === 'te' ? 'bg-primary' : 'bg-surface-container-high'}`}>
            <Text className={`text-[10px] font-bold ${language === 'te' ? 'text-white' : 'text-on-surface'}`}>తెలుగు</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setLanguage('hi')} className={`px-2 py-1 rounded ${language === 'hi' ? 'bg-primary' : 'bg-surface-container-high'}`}>
            <Text className={`text-[10px] font-bold ${language === 'hi' ? 'text-white' : 'text-on-surface'}`}>हिंदी</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setLanguage('en')} className={`px-2 py-1 rounded ${language === 'en' ? 'bg-primary' : 'bg-surface-container-high'}`}>
            <Text className={`text-[10px] font-bold ${language === 'en' ? 'text-white' : 'text-on-surface'}`}>EN</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-3" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-surface-container-highest/60 mb-3.5 flex-col gap-3">
          <View className="flex-row items-center gap-3">
            <View className="w-12 h-12 rounded-full bg-surface-container-high items-center justify-center shadow-xs border border-surface-container-highest/60 overflow-hidden">
              <Image source={require('@/assets/images/app-logo-emblem.png')} style={{ width: 42, height: 42 }} resizeMode="contain" />
            </View>
            <View className="flex-col flex-1 min-w-0">
              <Text className="text-base font-bold text-on-surface">{t('joinTitle', lang)} <Text className="text-primary font-bold">(సఖి)</Text></Text>
              <Text className="text-xs text-on-surface-variant">{t('joinSubtitle', lang)}</Text>
            </View>
          </View>
        </View>

        <View className="bg-surface-container-lowest rounded-xl p-3 shadow-xs border border-surface-container-highest/60 mb-3.5 flex-row justify-between">
          <TouchableOpacity onPress={() => setStep(1)} className="flex-1 items-center px-1">
            <View className={`w-full h-1.5 rounded-full mb-1.5 ${step >= 1 ? 'bg-primary' : 'bg-surface-container-high'}`} />
            <Text className={`text-[11px] font-bold ${step === 1 ? 'text-primary' : 'text-on-surface-variant'}`}>{t('step1Label', lang)}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => fullName.trim() && setStep(2)} className="flex-1 items-center px-1">
            <View className={`w-full h-1.5 rounded-full mb-1.5 ${step >= 2 ? 'bg-primary' : 'bg-surface-container-high'}`} />
            <Text className={`text-[11px] font-bold ${step === 2 ? 'text-primary' : 'text-on-surface-variant'}`}>{t('step2Label', lang)}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => fullName.trim() && setStep(3)} className="flex-1 items-center px-1">
            <View className={`w-full h-1.5 rounded-full mb-1.5 ${step === 3 ? 'bg-primary' : 'bg-surface-container-high'}`} />
            <Text className={`text-[11px] font-bold ${step === 3 ? 'text-primary' : 'text-on-surface-variant'}`}>{t('step3Label', lang)}</Text>
          </TouchableOpacity>
        </View>

        {step === 1 && (
          <View className="flex-col gap-3 mb-4">
            <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container-highest/60">
              <Text className="text-xs font-bold text-on-surface mb-1.5">{t('fullNameLabel', lang)}</Text>
              <View className="flex-row items-center bg-surface-container-low rounded-lg px-3 py-2 border border-surface-container-highest/60">
                <MaterialIcons name="person" size={18} color="#8c7164" />
                <TextInput value={fullName} onChangeText={setFullName} placeholder={t('fullNamePlaceholder', lang)} placeholderTextColor="#8c7164" className="flex-1 ml-2 text-xs font-semibold text-on-surface" />
              </View>
            </View>
            <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container-highest/60">
              <Text className="text-xs font-bold text-on-surface mb-1.5">{t('mobileLabel', lang)}</Text>
              <View className="flex-row items-center bg-surface-container-low rounded-lg px-3 py-2 border border-surface-container-highest/60">
                <MaterialIcons name="phone" size={18} color="#8c7164" />
                <Text className="text-xs font-bold text-on-surface-variant ml-2 mr-1">+91</Text>
                <TextInput value={phoneNumber} onChangeText={(text) => setPhoneNumber(text.replace(/[^0-9]/g, ''))} keyboardType="phone-pad" maxLength={10} placeholder={t('mobilePlaceholder', lang)} placeholderTextColor="#8c7164" className="flex-1 text-xs font-semibold text-on-surface" />
              </View>
            </View>
            <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container-highest/60">
              <Text className="text-xs font-bold text-on-surface mb-1.5">{t('passwordLabel', lang)}</Text>
              <View className="flex-row items-center bg-surface-container-low rounded-lg px-3 py-2 border border-surface-container-highest/60">
                <MaterialIcons name="lock-outline" size={18} color="#8c7164" />
                <TextInput value={password} onChangeText={setPassword} secureTextEntry={!showPassword} placeholder={t('passwordPlaceholder', lang)} placeholderTextColor="#8c7164" className="flex-1 ml-2 text-xs font-semibold text-on-surface" />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcons name={showPassword ? 'visibility-off' : 'visibility'} size={18} color="#8c7164" />
                </TouchableOpacity>
              </View>
            </View>
            <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container-highest/60">
              <View className="flex-row items-center justify-between mb-1.5">
                <Text className="text-xs font-bold text-on-surface">{t('ageLabel', lang)}</Text>
                <Text className="text-xs font-bold text-primary">{age} {t('ageUnit', lang)}</Text>
              </View>
              <View className="flex-row items-center bg-surface-container-low rounded-lg px-3 py-2 border border-surface-container-highest/60">
                <TextInput value={age} onChangeText={setAge} keyboardType="numeric" className="flex-1 text-xs font-semibold text-on-surface" />
              </View>
            </View>
            <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container-highest/60">
              <Text className="text-xs font-bold text-on-surface mb-2">{t('stateLabel', lang)}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                {AVAILABLE_STATES.map((st) => (
                  <TouchableOpacity key={st} onPress={() => setState(st)} className={`px-3 py-1.5 rounded-lg border mr-2 ${state === st ? 'bg-primary border-primary' : 'bg-surface-container-low border-surface-container-highest/60'}`}>
                    <Text className={`text-xs font-bold ${state === st ? 'text-white' : 'text-on-surface'}`}>{st}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container-highest/60">
              <Text className="text-xs font-bold text-on-surface mb-2">{t('locationLabel', lang)}</Text>
              <View className="flex-row gap-2">
                <TouchableOpacity onPress={() => setIsRural(true)} className={`flex-1 p-2.5 rounded-xl border flex-row items-center justify-between ${isRural ? 'bg-surface-container border-primary-container' : 'bg-surface-container-low border-surface-container-highest/60'} active:scale-95`}>
                  <Text className="text-xs font-bold text-on-surface">{t('rural', lang)}</Text>
                  {isRural && <MaterialIcons name="check-circle" size={16} color="#9d4300" />}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsRural(false)} className={`flex-1 p-2.5 rounded-xl border flex-row items-center justify-between ${!isRural ? 'bg-surface-container border-primary-container' : 'bg-surface-container-low border-surface-container-highest/60'} active:scale-95`}>
                  <Text className="text-xs font-bold text-on-surface">{t('urban', lang)}</Text>
                  {!isRural && <MaterialIcons name="check-circle" size={16} color="#9d4300" />}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {step === 2 && (
          <View className="flex-col gap-3 mb-4">
            <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container-highest/60">
              <Text className="text-xs font-bold text-on-surface mb-2">{t('shgQuestion', lang)}</Text>
              <View className="flex-row gap-2 mb-3">
                <TouchableOpacity onPress={() => setIsSHG(true)} className={`flex-1 p-3 rounded-xl border flex-row items-center justify-between ${isSHG ? 'bg-surface-container border-primary-container' : 'bg-surface-container-low border-surface-container-highest/60'} active:scale-95`}>
                  <Text className="text-xs font-bold text-on-surface">{t('yesSHG', lang)}</Text>
                  {isSHG && <MaterialIcons name="check-circle" size={16} color="#9d4300" />}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsSHG(false)} className={`flex-1 p-3 rounded-xl border flex-row items-center justify-between ${!isSHG ? 'bg-surface-container border-primary-container' : 'bg-surface-container-low border-surface-container-highest/60'} active:scale-95`}>
                  <Text className="text-xs font-bold text-on-surface">{t('independent', lang)}</Text>
                  {!isSHG && <MaterialIcons name="check-circle" size={16} color="#9d4300" />}
                </TouchableOpacity>
              </View>
              {isSHG && (
                <View>
                  <Text className="text-xs font-bold text-on-surface mb-1.5">{t('shgNameLabel', lang)}</Text>
                  <View className="flex-row items-center bg-surface-container-low rounded-lg px-3 py-2 border border-surface-container-highest/60">
                    <MaterialIcons name="groups" size={18} color="#8c7164" />
                    <TextInput value={shgName} onChangeText={setShgName} placeholder={t('shgNamePlaceholder', lang)} placeholderTextColor="#8c7164" className="flex-1 ml-2 text-xs font-semibold text-on-surface" />
                  </View>
                </View>
              )}
            </View>
            <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container-highest/60">
              <Text className="text-xs font-bold text-on-surface mb-1.5">{t('occupationLabel', lang)}</Text>
              <View className="flex-row items-center bg-surface-container-low rounded-lg px-3 py-2 border border-surface-container-highest/60 mb-2.5">
                <MaterialIcons name="work" size={18} color="#8c7164" />
                <TextInput value={occupation} onChangeText={setOccupation} placeholder={t('occupationPlaceholder', lang)} placeholderTextColor="#8c7164" className="flex-1 ml-2 text-xs font-semibold text-on-surface" />
              </View>
              <View className="flex-row flex-wrap gap-1.5">
                {occupationChips.map((displayLabel: string, idx: number) => {
                  const englishValue = occupationChipsEn[idx];
                  return (
                    <TouchableOpacity key={englishValue} onPress={() => setOccupation(englishValue)} className={`px-2.5 py-1 rounded-md border ${occupation === englishValue ? 'bg-primary border-primary' : 'bg-surface-container-low border-surface-container-highest/60'}`}>
                      <Text className={`text-[11px] font-semibold ${occupation === englishValue ? 'text-white' : 'text-on-surface'}`}>{displayLabel}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {step === 3 && (
          <View className="flex-col gap-3 mb-4">
            <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container-highest/60">
              <Text className="text-xs font-bold text-on-surface mb-1.5">{t('incomeLabel', lang)}</Text>
              <View className="flex-row items-center bg-surface-container-low rounded-lg px-3 py-2 border border-surface-container-highest/60">
                <Text className="text-xs font-bold text-primary mr-1.5">₹</Text>
                <TextInput value={monthlyIncome} onChangeText={setMonthlyIncome} keyboardType="numeric" placeholder="e.g. 18500" placeholderTextColor="#8c7164" className="flex-1 text-xs font-semibold text-on-surface" />
              </View>
            </View>
            <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container-highest/60">
              <Text className="text-xs font-bold text-on-surface mb-1.5">{t('expensesLabel', lang)}</Text>
              <View className="flex-row items-center bg-surface-container-low rounded-lg px-3 py-2 border border-surface-container-highest/60">
                <Text className="text-xs font-bold text-secondary mr-1.5">₹</Text>
                <TextInput value={monthlyExpenses} onChangeText={setMonthlyExpenses} keyboardType="numeric" placeholder="e.g. 14300" placeholderTextColor="#8c7164" className="flex-1 text-xs font-semibold text-on-surface" />
              </View>
            </View>
            <View className="bg-primary-fixed/20 border border-primary/40 rounded-xl p-3 flex-row items-center justify-between">
              <View>
                <Text className="text-xs font-bold text-on-surface">{t('surplusLabel', lang)}</Text>
                <Text className="text-[10px] text-on-surface-variant font-medium">{t('surplusSub', lang)}</Text>
              </View>
              <Text className="text-base font-bold text-primary">₹{calculatedSurplus.toLocaleString('en-IN')}</Text>
            </View>
            <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container-highest/60">
              <Text className="text-xs font-bold text-on-surface mb-1.5">{t('savingsLabel', lang)}</Text>
              <View className="flex-row items-center bg-surface-container-low rounded-lg px-3 py-2 border border-surface-container-highest/60">
                <Text className="text-xs font-bold text-primary mr-1.5">₹</Text>
                <TextInput value={initialSavings} onChangeText={setInitialSavings} keyboardType="numeric" placeholder="e.g. 18000" placeholderTextColor="#8c7164" className="flex-1 text-xs font-semibold text-on-surface" />
              </View>
            </View>
            <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container-highest/60">
              <Text className="text-xs font-bold text-on-surface mb-1.5">{t('debtLabel', lang)}</Text>
              <View className="flex-row items-center bg-surface-container-low rounded-lg px-3 py-2 border border-surface-container-highest/60">
                <Text className="text-xs font-bold text-secondary mr-1.5">₹</Text>
                <TextInput value={initialDebt} onChangeText={setInitialDebt} keyboardType="numeric" placeholder="e.g. 12000" placeholderTextColor="#8c7164" className="flex-1 text-xs font-semibold text-on-surface" />
              </View>
            </View>
          </View>
        )}

        {regError && (
          <View className="mb-3.5 bg-error-container/20 border border-error/30 p-3 rounded-xl flex-row items-start">
            <MaterialIcons name="error-outline" size={16} color="#ba1a1a" className="mr-2 mt-0.5" />
            <Text className="text-xs text-error font-medium flex-1 leading-snug">{regError}</Text>
          </View>
        )}

        <TouchableOpacity onPress={handleNext} disabled={loading} className="w-full min-h-[50px] bg-primary-container rounded-xl flex-row items-center justify-center shadow-md active:scale-[0.98] mb-3">
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <Text className="text-sm font-bold text-on-primary mr-1.5">
                {step === 1 ? t('nextSHG', lang) : step === 2 ? t('nextFinance', lang) : t('completeReg', lang)}
              </Text>
              <MaterialIcons name="arrow-forward" size={18} color="#ffffff" />
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace('/signin' as any)} className="w-full py-2 items-center justify-center">
          <Text className="text-xs text-on-surface-variant font-medium">
            {t('alreadyRegistered', lang)} <Text className="text-primary font-bold">{t('signInHere', lang)}</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
