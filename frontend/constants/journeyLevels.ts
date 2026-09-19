/**
 * 50-Level Financial Education Journey Catalog for Sakhi.
 * Structured across 8 progressive tiers from basic cashflow awareness to rural enterprise mastery.
 * Pure text explanations + Indic voice narration (Telugu, Hindi, English) with zero quizzes.
 */

export interface LocalizedString {
  en: string;
  te: string;
  hi: string;
}

export interface JourneyLevelData {
  levelNumber: number;
  tierId: number;
  tierName: LocalizedString;
  title: LocalizedString;
  summary: LocalizedString;
  explanation: LocalizedString;
  keyTakeaways: {
    en: string[];
    te: string[];
    hi: string[];
  };
  iconName: string;
  backendLessonId?: string; // Optional linkage to existing backend lessons
}

export const FINANCIAL_TIERS: { id: number; name: LocalizedString; levelRange: string; color: string }[] = [
  {
    id: 1,
    name: {
      en: 'Tier 1: Money & Cashflow Basics',
      te: 'దశ 1: డబ్బు & దైనందిన నగదు నిర్వహణ',
      hi: 'स्तर 1: आय, खर्च और बजट की बुनियादी समझ',
    },
    levelRange: 'Levels 1–6',
    color: '#9d4300',
  },
  {
    id: 2,
    name: {
      en: 'Tier 2: Savings & Emergency Shield',
      te: 'దశ 2: పొదుపు & 3-నెలల రక్షణ కవచం',
      hi: 'स्तर 2: बचत और 3 महीने का सुरक्षा कवच',
    },
    levelRange: 'Levels 7–13',
    color: '#b3291b',
  },
  {
    id: 3,
    name: {
      en: 'Tier 3: Banking, ATM & Digital Payments',
      te: 'దశ 3: బ్యాంకింగ్ & డిజిటల్ యూపీఐ భద్రత',
      hi: 'स्तर 3: बैंकिंग, एटीएम और सुरक्षित यूपीआई',
    },
    levelRange: 'Levels 14–19',
    color: '#9d4135',
  },
  {
    id: 4,
    name: {
      en: 'Tier 4: Debt Elimination & Smart Loans',
      te: 'దశ 4: అప్పుల విముక్తి & సంఘం రుణాలు',
      hi: 'स्तर 4: कर्ज मुक्ति और समूह ऋण तकनीक',
    },
    levelRange: 'Levels 20–26',
    color: '#d9534f',
  },
  {
    id: 5,
    name: {
      en: 'Tier 5: Wealth Growth & Compounding',
      te: 'దశ 5: సంపద వృద్ధి & చక్రవడ్డీ అద్భుతం',
      hi: 'स्तर 5: धन वृद्धि और चक्रवृद्धि ब्याज का जादू',
    },
    levelRange: 'Levels 27–33',
    color: '#e67e22',
  },
  {
    id: 6,
    name: {
      en: 'Tier 6: Insurance & Family Security',
      te: 'దశ 6: బీమా పథకాలు & కుటుంబ భద్రత',
      hi: 'स्तर 6: बीमा सुरक्षा और परिवार का भविष्य',
    },
    levelRange: 'Levels 34–39',
    color: '#27ae60',
  },
  {
    id: 7,
    name: {
      en: 'Tier 7: Women Enterprise & SHG Finance',
      te: 'దశ 7: మహిళా వ్యాపారం & లఖ్‌పతి దీదీ ప్రణాళిక',
      hi: 'स्तर 7: महिला उद्यम और लखपति दीदी योजना',
    },
    levelRange: 'Levels 40–45',
    color: '#8e44ad',
  },
  {
    id: 8,
    name: {
      en: 'Tier 8: Welfare Schemes & Financial Mastery',
      te: 'దశ 8: ప్రభుత్వ సంక్షేమం & పూర్తి స్వావలంబన',
      hi: 'स्तर 8: सरकारी योजनाएं और पूर्ण आत्मनिर्भरता',
    },
    levelRange: 'Levels 46–50',
    color: '#2c3e50',
  },
];

export const JOURNEY_LEVELS: JourneyLevelData[] = [
  // ==========================================
  // TIER 1: MONEY & CASHFLOW BASICS (Levels 1-6)
  // ==========================================
  {
    levelNumber: 1,
    tierId: 1,
    tierName: { en: 'Money Basics', te: 'డబ్బు ప్రాథమికాంశాలు', hi: 'पैसे की बुनियादी बातें' },
    title: {
      en: 'Understanding Household Income',
      te: 'ఇంటి ఆదాయాన్ని గుర్తించడం',
      hi: 'घरेलू आमदनी की सही पहचान',
    },
    summary: {
      en: 'Learn to separate gross daily earnings from true net income.',
      te: 'రోజువారీ వ్యాపార ఆదాయాన్ని, నిజమైన నికర ఆదాయాన్ని వేరు చేయడం నేర్చుకోండి.',
      hi: 'दैनिक कुल कमाई और वास्तविक शुद्ध आमदनी का अंतर समझें।',
    },
    explanation: {
      en: 'Namaste! Many women who do tailoring, sell milk, or run small petty shops mix all money together. Gross income is all the cash you collect, but net income is what remains after paying for raw materials, cloth, cattle feed, and transport. Always calculate your real net income so you know how much money your family actually makes each month.',
      te: 'నమస్తే! కుట్టు పనులు, పాల అమ్మకాలు లేదా చిన్న దుకాణం నడిపే చాలామంది మహిళలు వచ్చే డబ్బునంతా ఒక్కచోటే కలిపేస్తుంటారు. మొత్తం వచ్చే నగదు వేరు, పెట్టుబడి ఖర్చులు పోగా మిగిలే నికర లాభం వేరు. మీ కుటుంబ నిజమైన నెలవారీ ఆదాయాన్ని ఖచ్చితంగా లెక్కించండి.',
      hi: 'नमस्ते! सिलाई, दूध की बिक्री या दुकान से आने वाले कुल पैसे और असली मुनाफे को अलग रखना सीखें। माल, चारा या सामान की लागत घटाने के बाद जो बचता है, वही आपकी असली आमदनी है।',
    },
    keyTakeaways: {
      en: [
        'Net Income = Total Cash Collected - Material Costs.',
        'Never mix shop cash with household kitchen spending.',
        'Write down total monthly earnings in one single notebook.',
      ],
      te: [
        'నికర ఆదాయం = మొత్తం కలెక్ట్ చేసిన నగదు - ముడిసరుకుల ఖర్చు.',
        'వ్యాపార డబ్బును వంటగది ఖర్చులతో కలపకండి.',
        'నెలవారీ మొత్తం సంపాదనను ఒకే డైరీలో నమోదు చేయండి.',
      ],
      hi: [
        'शुद्ध आय = कुल बिक्री - सामान की लागत।',
        'दुकान या काम के पैसे को घर के खर्च से अलग रखें।',
        'महीने की कुल आमदनी को एक डायरी में जरूर लिखें।',
      ],
    },
    iconName: 'account-balance-wallet',
    backendLessonId: 'les-1-1-income-expense',
  },
  {
    levelNumber: 2,
    tierId: 1,
    tierName: { en: 'Money Basics', te: 'డబ్బు ప్రాథమికాంశాలు', hi: 'पैसे की बुनियादी बातें' },
    title: {
      en: 'The Needs vs Wants Rule (70/30)',
      te: 'అవసరాలు vs కోరికలు (70/30 సూత్రం)',
      hi: 'जरूरतें बनाम इच्छाएं (70/30 का नियम)',
    },
    summary: {
      en: 'Divide spending into essential survival needs and flexible wants.',
      te: 'ఖర్చులను నిత్యావసరాలు మరియు ఆడంబర కోరికలుగా విభజించండి.',
      hi: 'खर्चों को अनिवार्य जरूरतों और टलने वाली इच्छाओं में बांटें।',
    },
    explanation: {
      en: 'Every rupee spent belongs to one of two categories: Needs or Wants. Needs are items you cannot survive without: food grains, cooking gas, school fees, rent, and medicines. Wants are nice-to-have items: festival new clothes, jewelry, eating out, or impulsive village fair purchases. Keeping essential needs below 70% of your income leaves 30% available for savings and loan repayment.',
      te: 'మనం ఖర్చు చేసే ప్రతి రూపాయి అవసరం లేదా కోరిక కిందకు వస్తుంది. బియ్యం, గ్యాస్, పిల్లల ఫీజులు, మందులు అవసరాలు. కొత్త బట్టలు, ఆభరణాలు, జాతర ఖర్చులు కోరికలు. నిత్యావసరాలను ఆదాయంలో 70% లోపే ఉంచితే 30% పొదుపుకు మిగులుతుంది.',
      hi: 'हर खर्च या तो जरूरत है या इच्छा। राशन, बच्चों की फीस, किराया और दवाएं जरूरतें हैं। नए कपड़े, गहने और मेले में खरीदारी इच्छाएं हैं। जरूरी खर्चों को 70% तक सीमित रखें ताकि 30% बचत हो सके।',
    },
    keyTakeaways: {
      en: [
        'Needs (70% Max): Rations, medicine, fees, electricity, rent.',
        'Wants (30% Target): Postpone non-essential splurges.',
        'Never take private loans to pay for non-essential wants.',
      ],
      te: [
        'అవసరాలు (గరిష్టంగా 70%): బియ్యం, మందులు, ఫీజులు, విద్యుత్.',
        'కోరికలు (30% వరకు): అనవసర ఆడంబరాలను వాయిదా వేయండి.',
        'కోరికల కోసం ప్రైవేట్ అప్పులు ఎప్పుడూ చేయకండి.',
      ],
      hi: [
        'जरूरतें (अधिकतम 70%): राशन, दवाई, स्कूल फीस, बिजली।',
        'इच्छाएं: गैर-जरूरी खर्चों को आगे के लिए टालें।',
        'इच्छाओं को पूरा करने के लिए कभी भारी ब्याज पर कर्ज न लें।',
      ],
    },
    iconName: 'pie-chart',
    backendLessonId: 'les-1-2-need-vs-want',
  },
  {
    levelNumber: 3,
    tierId: 1,
    tierName: { en: 'Money Basics', te: 'డబ్బు ప్రాథమికాంశాలు', hi: 'पैसे की बुनियादी बातें' },
    title: {
      en: 'Tracking Daily Micro-Expenses',
      te: 'రోజువారీ చిల్లర ఖర్చుల నమోదు',
      hi: 'दैनिक छोटे-मोटे खर्चों का हिसाब',
    },
    summary: {
      en: 'Catch the ₹20-₹50 daily cash leaks that silently drain household savings.',
      te: 'రోజుకు ₹20-₹50 చొప్పున తెలియకుండా ఖర్చయ్యే చిల్లర లీకులను అరికట్టండి.',
      hi: 'रोजाना ₹20-₹50 के अनजाने खर्चों को रोककर बड़ी बचत करें।',
    },
    explanation: {
      en: 'Small daily leaks add up fast. Spending ₹30 a day on tea, tobacco, packaged snacks, or auto fares equals ₹900 every month—more than ₹10,000 per year! By writing down every small expense in a pocket notebook or Sakhi app for just one week, you will discover where money is slipping away silently.',
      te: 'చిన్న చిన్న ఖర్చులు త్వరగా పెరిగిపోతాయి. రోజుకు టీ, పాన్, చిరుతిళ్లకు ₹30 ఖర్చు చేస్తే నెలకు ₹900, ఏడాదికి ₹10,000 పైనే అవుతుంది! ఒక వారం పాటు ప్రతి చిన్న ఖర్చును రాసి చూడండి, డబ్బు ఎక్కడ వృథా అవుతుందో అర్థమవుతుంది.',
      hi: 'छोटे-छोटे खर्च मिलकर बहुत बड़े बन जाते हैं। रोज चाय, नाश्ते या गुटखे पर ₹30 खर्च होने से महीने में ₹900 और साल में ₹10,000 से ज्यादा खर्च हो जाते हैं। एक हफ्ते तक रोज का हिसाब लिखकर देखें।',
    },
    keyTakeaways: {
      en: [
        '₹30/day unnecessary spending = ₹10,800 lost every year.',
        'Carry a small notebook or log in Sakhi daily.',
        'Review weekend spending with family members.',
      ],
      te: [
        'రోజుకు ₹30 వృథా = ఏడాదికి ₹10,800 నష్టం.',
        'చిన్న డైరీలో లేదా సఖిలో రోజూ నమోదు చేయండి.',
        'వారాంతంలో కుటుంబంతో కలిసి ఖర్చులను సమీక్షించండి.',
      ],
      hi: [
        'रोज ₹30 का फिजूलखर्च = साल में ₹10,800 का नुकसान।',
        'सखी ऐप में रोज के छोटे खर्च दर्ज करें।',
        'परिवार के साथ बैठकर हर हफ्ते हिसाब देखें।',
      ],
    },
    iconName: 'edit-note',
  },
  {
    levelNumber: 4,
    tierId: 1,
    tierName: { en: 'Money Basics', te: 'డబ్బు ప్రాథమికాంశాలు', hi: 'पैसे की बुनियादी बातें' },
    title: {
      en: 'Calculating Your Safe-to-Save Surplus',
      te: 'నెలవారీ మిగులు పొదుపును లెక్కించడం',
      hi: 'सुरक्षित मासिक बचत (सरप्लस) की गणना',
    },
    summary: {
      en: 'Know your disposable monthly surplus before deciding on savings commitments.',
      te: 'పొదుపు పథకాల్లో చేరే ముందు చేతిలో మిగిలే వాస్తవ మిగులును లెక్కించండి.',
      hi: 'कोई भी बचत या निवेश शुरू करने से पहले अपनी असली बचत राशि जानें।',
    },
    explanation: {
      en: 'Disposable surplus is the exact amount of money remaining after all essential living costs and mandatory loan EMIs are deducted from monthly income. Never commit to an RD or chit fund payment larger than your true surplus. Sakhi calculates this automatically so you never get trapped in missed payments.',
      te: 'నెలవారీ ఆదాయం నుండి ఇంటి నిత్యావసర ఖర్చులు మరియు తప్పనిసరి అప్పుల కిస్తీలు తీసివేయగా చేతిలో మిగిలే పక్కా మొత్తమే మిగులు. మీ మిగులు కన్నా ఎక్కువ మొత్తంలో చిట్టీలు లేదా పొదుపులు కట్టకండి. సఖి ఈ మిగులును సులభంగా లెక్కిస్తుంది.',
      hi: 'मासिक आमदनी में से घर का राशन और कर्ज की किस्तें घटाने के बाद बची सुरक्षित रकम ही सरप्लस है। अपनी बचत क्षमता से बड़ी किस्त या बीसी कभी न लें। सखी इसे आपके लिए आसानी से निकालती है।',
    },
    keyTakeaways: {
      en: [
        'Monthly Surplus = Monthly Income - (Living Expenses + Loan EMIs).',
        'Only commit 60% to 70% of your surplus to recurring goals.',
        'Keep the rest for unexpected monthly fluctuations.',
      ],
      te: [
        'నెలవారీ మిగులు = ఆదాయం - (ఇంటి ఖర్చులు + అప్పుల కిస్తీలు).',
        'మిగులులో 60% నుండి 70% మాత్రమే పొదుపు లక్ష్యాలకు కేటాయించండి.',
        'మిగిలినది చిన్న చిన్న హెచ్చుతగ్గుల కోసం ఉంచండి.',
      ],
      hi: [
        'मासिक सरप्लस = आमदनी - (घरेलू खर्च + कर्ज किस्तें)।',
        'बचत के लिए सरप्लस का 60% से 70% ही लगाएं।',
        'बाकी राशि अचानक होने वाले उतार-चढ़ाव के लिए रखें।',
      ],
    },
    iconName: 'calculate',
  },
  {
    levelNumber: 5,
    tierId: 1,
    tierName: { en: 'Money Basics', te: 'డబ్బు ప్రాథమికాంశాలు', hi: 'पैसे की बुनियादी बातें' },
    title: {
      en: 'Managing Festival & Seasonal Spikes',
      te: 'పండుగలు మరియు సీజనల్ ఖర్చుల నిర్వహణ',
      hi: 'त्योहारों और मौसमी खर्चों का प्रबंधन',
    },
    summary: {
      en: 'Avoid taking high-interest moneylender loans for festivals, marriages, and sowing season.',
      te: 'పండుగలు మరియు పెళ్లిళ్ల కోసం వడ్డీ వ్యాపారుల వద్ద అప్పులు చేయకుండా ముందుగానే ప్లాన్ చేసుకోండి.',
      hi: 'त्योहारों, शादियों और बुवाई के लिए साहूकार से कर्ज लेने से बचें।',
    },
    explanation: {
      en: 'In rural households, festivals like Sankranti, Diwali, Dussehra, and family weddings create huge sudden expenses. Taking a ₹20,000 moneylender loan at festival time traps families in high interest for years. Instead, save ₹500 every month in a dedicated festival pot so festival time brings joy, not debt.',
      te: 'సంక్రాంతి, దసరా, దీపావళి లేదా వివాహాల సమయంలో గ్రామీణ కుటుంబాల్లో ఆకస్మిక ఖర్చులు పెరుగుతాయి. పండుగ కోసం వడ్డీ వ్యాపారి వద్ద ₹20,000 అప్పు తెస్తే ఏళ్ల తరబడి వడ్డీ కట్టాల్సి వస్తుంది. నెలకు ₹500 చొప్పున ముందుగానే దాచుకుంటే పండుగ సంతోషాన్నిస్తుంది.',
      hi: 'त्योहारों या शादियों के समय अचानक बड़ा खर्च आता है। ऐसे में साहूकार से ₹20,000 का कर्ज लेना सालों तक मुसीबत बन जाता है। हर महीने ₹500 अलग जोड़ें ताकि त्योहार बिना कर्ज के मने।',
    },
    keyTakeaways: {
      en: [
        'Save ₹500/month in a separate Goal Pot for festivals.',
        'Never take 36% APR private credit for clothes or feasts.',
        'Plan festival budgets 6 months in advance.',
      ],
      te: [
        'పండుగల కోసం ప్రత్యేక కలల కుండలో నెలకు ₹500 దాచండి.',
        'బట్టలు లేదా విందుల కోసం 36% అధిక వడ్డీకి అప్పు తీసుకోకండి.',
        '6 నెలల ముందు నుంచే పండుగ బడ్జెట్ ప్లాన్ చేసుకోండి.',
      ],
      hi: [
        'त्योहारों के लिए अलग बचत घड़े में ₹500 हर महीने डालें।',
        'कपड़ों या दावत के लिए साहूकार से महंगा कर्ज कभी न लें।',
        '6 महीने पहले से त्योहार के बजट की तैयारी करें।',
      ],
    },
    iconName: 'celebration',
  },
  {
    levelNumber: 6,
    tierId: 1,
    tierName: { en: 'Money Basics', te: 'డబ్బు ప్రాథమికాంశాలు', hi: 'పैसे की बुनियादी बातें' },
    title: {
      en: 'Milestone 1: The Cashflow Master',
      te: 'మైలురాయి 1: నగదు నిర్వహణ విజేత',
      hi: 'पड़ाव 1: बजट और आय-व्यय के विजेता',
    },
    summary: {
      en: 'Review your complete cashflow mastery and celebrate completing Tier 1.',
      te: 'మొదటి దశ విజయవంతంగా పూర్తి చేసుకున్నందుకు అభినందనలు!',
      hi: 'पहला स्तर सफलतापूर्वक पूरा करने पर बधाई!',
    },
    explanation: {
      en: 'Congratulations on completing Tier 1! You now understand the difference between gross revenue and true net income, the power of keeping needs under 70%, the danger of daily cash leaks, and how to plan for seasonal expenses. You are ready to build your personal Emergency Safety Shield in Tier 2!',
      te: 'మొదటి దశను విజయవంతంగా పూర్తి చేసినందుకు అభినందనలు! నికర ఆదాయం లెక్కించడం, 70/30 సూత్రం, రోజువారీ ఖర్చుల నమోదు మరియు పండుగల ప్రణాళికలపై మీకు స్పష్టత వచ్చింది. ఇప్పుడు దశ 2 లో అత్యవసర రక్షణ నిధి ఏర్పాటును నేర్చుకుందాం!',
      hi: 'पहला स्तर पूरा करने पर हार्दिक बधाई! अब आप शुद्ध आय, 70/30 नियम और खर्चों के नियंत्रण को समझ चुके हैं। अब हम स्तर 2 में अपना आपातकालीन सुरक्षा कवच बनाएंगे!',
    },
    keyTakeaways: {
      en: [
        'Tier 1 Completed: Strong cashflow foundation established.',
        'Always track before you spend.',
        'Proceed to Tier 2: Emergency Safety Shield.',
      ],
      te: [
        'దశ 1 పూర్తి: బలమైన ఆర్థిక పునాది ఏర్పడింది.',
        'ఖర్చు పెట్టే ముందే ఆలోచించండి మరియు రాయండి.',
        'దశ 2: అత్యవసర రక్షణ కవచం వైపు అడుగు వేయండి.',
      ],
      hi: [
        'स्तर 1 पूर्ण: आपकी वित्तीय नींव मजबूत हो गई है।',
        'खर्च करने से पहले हिसाब जरूर रखें।',
        'स्तर 2 की ओर बढ़ें: आपातकालीन सुरक्षा कवच।',
      ],
    },
    iconName: 'military-tech',
  },

  // ==========================================
  // TIER 2: SAVINGS & EMERGENCY SHIELD (Levels 7-13)
  // ==========================================
  {
    levelNumber: 7,
    tierId: 2,
    tierName: { en: 'Savings & Shield', te: 'పొదుపు & రక్షణ నిధి', hi: 'बचत और सुरक्षा कवच' },
    title: {
      en: 'Why We Save: The Power of Tiny Habits',
      te: 'చిన్న పొదుపు - పెద్ద భవిష్యత్తు',
      hi: 'बचत क्यों जरूरी है: छोटी आदत का बड़ा असर',
    },
    summary: {
      en: 'Saving even ₹20 every single day creates immense peace of mind over time.',
      te: 'రోజూ కేవలం ₹20 పొదుపు చేసినా అది కాలక్రమేణా గొప్ప భరోసానిస్తుంది.',
      hi: 'रोज सिर्फ ₹20 बचाने से समय के साथ बड़ी सुरक्षा बनती है।',
    },
    explanation: {
      en: 'Saving is not about having lots of money; it is a habit. Even if your daily income is modest, setting aside ₹20 every day gives you ₹600 a month and over ₹7,000 in a year. When medical or house repair emergencies happen, this money stands like a solid wall protecting your dignity.',
      te: 'పొదుపు అనేది ఎక్కువ డబ్బు ఉన్నవాళ్లే చేయాలని లేదు; అదొక మంచి అలవాటు. రోజుకు ₹20 పక్కన పెట్టినా నెలకు ₹600, ఏడాదికి ₹7,000 పైగా అవుతుంది. అత్యవసర పరిస్థితులు వచ్చినప్పుడు ఈ పొదుపే మీకు కొండంత అండగా నిలుస్తుంది.',
      hi: 'बचत ज्यादा पैसे होने से नहीं, अच्छी आदत से होती है। रोज सिर्फ ₹20 अलग रखने पर महीने में ₹600 और साल में ₹7,000 से ज्यादा जमा हो जाते हैं। अचानक बीमारी या जरूरत में यही पैसा आपकी इज्जत बचाता है।',
    },
    keyTakeaways: {
      en: [
        'Save first when money comes in, spend what is left.',
        '₹20 daily habit builds ₹7,200 yearly shield.',
        'Consistency is more powerful than waiting for a big lump sum.',
      ],
      te: [
        'డబ్బు రాగానే ముందే కొంత పొదుపు చేయండి, మిగిలినదే ఖర్చు పెట్టండి.',
        'రోజుకు ₹20 తో ఏడాదికి ₹7,200 రక్షణ నిధి తయారవుతుంది.',
        'ఒకేసారి పెద్ద మొత్తం కన్నా రోజూ క్రమం తప్పకుండా పొదుపు చేయడం ముఖ్యం.',
      ],
      hi: [
        'पैसा आते ही पहले बचत निकालें, फिर बाकी खर्च करें।',
        'रोज ₹20 की बचत से साल में ₹7,200 का सुरक्षा कवच बनता है।',
        'बड़ी रकम का इंतजार करने से अच्छा है रोज थोड़ा-थोड़ा बचाना।',
      ],
    },
    iconName: 'savings',
  },
  {
    levelNumber: 8,
    tierId: 2,
    tierName: { en: 'Savings & Shield', te: 'పొదుపు & రక్షణ నిధి', hi: 'बचत और सुरक्षा कवच' },
    title: {
      en: 'The 3-Month Emergency Safety Shield',
      te: '3 నెలల అత్యవసర రక్షణ కవచం',
      hi: '3 महीने का सुरक्षा कवच इमरजेंसी फंड',
    },
    summary: {
      en: 'How to calculate and build your 3-month survival expense protection fund.',
      te: 'కుటుంబానికి 3 నెలల ఖర్చుల రక్షణ నిధిని ఎలా సమకూర్చుకోవాలో తెలుసుకోండి.',
      hi: 'परिवार के 3 महीने के खर्च का सुरक्षा कोष कैसे तैयार करें।',
    },
    explanation: {
      en: 'If family monthly basic kitchen and utility expenses are ₹8,000, your Emergency Safety Shield target is ₹24,000 (3 months). This safety shield ensures that if illness, crop failure, or sudden loss of work happens, your family does not need to beg moneylenders or sell gold.',
      te: 'మీ కుటుంబ కనీస నిత్యావసర ఖర్చులు నెలకు ₹8,000 అయితే, మీ 3 నెలల రక్షణ నిధి లక్ష్యం ₹24,000. జబ్బు చేసినా లేదా పని లేకపోయినా ఈ నిధి ఉండడం వల్ల ఎవరి దగ్గరా చేతులు చాచాల్సిన అవసరం రాదు, బంగారం తాకట్టు పెట్టక్కర్లేదు.',
      hi: 'अगर घर का मासिक खर्च ₹8,000 है, तो आपका इमरजेंसी फंड ₹24,000 (3 महीने का खर्च) होना चाहिए। इससे अचानक बीमारी या काम रुकने पर गहने गिरवी रखने या साहूकार के आगे हाथ फैलाने की नौबत नहीं आती।',
    },
    keyTakeaways: {
      en: [
        'Target Shield = Monthly Essential Expenses × 3.',
        'Never touch this fund for shopping or functions.',
        'Use it strictly for genuine medical or survival emergencies.',
      ],
      te: [
        'లక్ష్యం = నెలవారీ నిత్యావసర ఖర్చులు × 3.',
        'ఈ నిధిని షాపింగ్ లేదా వేడుకల కోసం ఎట్టిపరిస్థితుల్లోనూ వాడకండి.',
        'కేవలం అత్యవసర వైద్యం లేదా సంక్షోభ సమయాల్లోనే ఉపయోగించండి.',
      ],
      hi: [
        'लक्ष्य = जरूरी मासिक खर्च × 3।',
        'इस पैसे को शादी या खरीदारी में कभी खर्च न करें।',
        'इसका उपयोग केवल आपातकालीन बीमारी या संकट में ही करें।',
      ],
    },
    iconName: 'shield',
    backendLessonId: 'les-2-1-why-emergency-fund',
  },
  {
    levelNumber: 9,
    tierId: 2,
    tierName: { en: 'Savings & Shield', te: 'పొదుపు & రక్షణ నిధి', hi: 'बचत और सुरक्षा कवच' },
    title: {
      en: 'Where to Keep Emergency Cash Safely',
      te: 'అత్యవసర నిధిని ఎక్కడ దాచుకోవాలి?',
      hi: 'इमरजेंसी फंड कहां सुरक्षित रखें?',
    },
    summary: {
      en: 'Choose safe bank or post office accounts over informal risky chit funds.',
      te: 'ప్రమాదకరమైన అనధికార చిట్టీల కన్నా బ్యాంకు లేదా పోస్టాఫీసు ఖాతాల్లో భద్రపరచండి.',
      hi: 'अनधिकृत बीसी या चिट फंड की जगह बैंक या डाकघर में पैसा सुरक्षित रखें।',
    },
    explanation: {
      en: 'Never keep your emergency shield in private informal chit funds or cash under the mattress. Cash at home gets spent on petty impulses, and private village chits can collapse. Keep it in a formal nationalized bank account with an ATM card or a Post Office Savings account where it is 100% government guaranteed.',
      te: 'అత్యవసర నిధిని ఇంట్లో బీరువాలోనో లేదా అనధికార చిట్టీలలోనో పెట్టకండి. ఇంట్లో ఉంటే ఖర్చయిపోతుంది, ప్రైవేట్ చిట్టీలు మునిగిపోయే ప్రమాదం ఉంది. ఏటీఎం సౌకర్యం ఉన్న బ్యాంకు ఖాతాలో లేదా పోస్టాఫీసులో దాచుకుంటే 100% ప్రభుత్వ భద్రత ఉంటుంది.',
      hi: 'इमरजेंसी का पैसा घर में तकिए के नीचे या अनधिकृत चिटफंड में न रखें। घर का पैसा खर्च हो जाता है और निजी चिटफंड डूब सकते हैं। इसे बैंक खाते या डाकघर में रखें, जहां सरकार की पूरी गारंटी होती है।',
    },
    keyTakeaways: {
      en: [
        '100% safe in Post Office & Nationalized Banks.',
        'Ensure 24x7 ATM card access for midnight medical emergencies.',
        'Avoid unregulated unregistered village committee chits.',
      ],
      te: [
        'పోస్టాఫీస్ & బ్యాంకుల్లో 100% ప్రభుత్వ భద్రత.',
        'రాత్రి సమయాల్లో అత్యవసరమైతే తీసుకోవడానికి ఏటీఎం కార్డు ఉండేలా చూసుకోండి.',
        'రిజిస్ట్రేషన్ లేని ప్రైవేట్ చిట్టీలకు దూరంగా ఉండండి.',
      ],
      hi: [
        'डाकघर और सरकारी बैंकों में 100% सुरक्षा।',
        'रात-बिरात जरूरत पड़ने पर निकालने के लिए एटीएम चालू रखें।',
        'बिना रजिस्ट्रेशन वाले निजी चिटफंड से हमेशा बचें।',
      ],
    },
    iconName: 'account-balance',
    backendLessonId: 'les-2-2-where-to-keep-it',
  },
  {
    levelNumber: 10,
    tierId: 2,
    tierName: { en: 'Savings & Shield', te: 'పొదుపు & రక్షణ నిధి', hi: 'बचत और सुरक्षा कवच' },
    title: {
      en: 'Post Office Savings vs Bank Accounts',
      te: 'పోస్టాఫీస్ మరియు బ్యాంకు ఖాతాల తేడాలు',
      hi: 'डाकघर और बैंक बचत खाते का सही उपयोग',
    },
    summary: {
      en: 'Understand how Post Office branch savings provide secure rural branch access.',
      te: 'గ్రామీణ ప్రాంతాల్లో పోస్టాఫీస్ పొదుపు ఖాతాల సౌలభ్యాలు మరియు వడ్డీ ప్రయోజనాలు.',
      hi: 'ग्रामीण इलाकों में डाकघर बचत खाते के फायदे और सुरक्षा।',
    },
    explanation: {
      en: 'India Post has branch post offices in almost every gram panchayat. You can open a Post Office Savings Account (POSA) with as little as ₹500. They offer reliable interest rates, passbook facilities, and doorstep services through the village Gramin Dak Sevak (GDS), making it ideal for women without easy bank access.',
      te: 'ప్రతి గ్రామంలోనూ పోస్టాఫీస్ అందుబాటులో ఉంటుంది. కేవలం ₹500 తో పోస్టాఫీస్ సేవింగ్స్ ఖాతా తెరవవచ్చు. గ్రామీణ డాక్ సేవక్ ద్వారా ఇంటి వద్దకే సేవలందుతాయి. బ్యాంకులు దూరంగా ఉన్న గ్రామీణ మహిళలకు ఇది చాలా అనుకూలం.',
      hi: 'हर गांव में डाकघर की शाखा होती है। सिर्फ ₹500 में डाकघर बचत खाता खुल जाता है। ग्रामीण डाक सेवक के जरिए गांव में ही लेन-देन हो जाता है, जिससे बैंक दूर होने पर भी महिलाओं को सुविधा मिलती है।',
    },
    keyTakeaways: {
      en: [
        'Open with minimum ₹500 initial deposit.',
        'Convenient doorstep banking with village Postman / GDS.',
        'Passbook provides clear physical proof of all deposits.',
      ],
      te: [
        'కనీసం ₹500 తో సులభంగా ఖాతా ప్రారంభించవచ్చు.',
        'గ్రామ పోస్ట్‌మ్యాన్ ద్వారా ఇంటి వద్దనే సేవలు.',
        'పాస్‌బుక్ ద్వారా డిపాజిట్ల పూర్తి లెక్క స్పష్టంగా ఉంటుంది.',
      ],
      hi: [
        'सिर्फ ₹500 में खाता शुरू किया जा सकता है।',
        'डाकिया के माध्यम से गांव में ही जमा-निकासी संभव।',
        'पासबुक में हर जमा राशि का पक्का हिसाब रहता है।',
      ],
    },
    iconName: 'local-post-office',
  },
  {
    levelNumber: 11,
    tierId: 2,
    tierName: { en: 'Savings & Shield', te: 'పొదుపు & రక్షణ నిధి', hi: 'बचत और सुरक्षा कवच' },
    title: {
      en: 'Recurring Deposits (RD) for Steady Growth',
      te: 'రికరింగ్ డిపాజిట్ (RD) తో క్రమబద్ధమైన పొదుపు',
      hi: 'आवर्ती जमा (RD) से हर महीने पक्की बचत',
    },
    summary: {
      en: 'Lock in monthly savings discipline with a 1-year or 3-year RD account.',
      te: 'నెలకు ₹500 లేదా ₹1,000 చొప్పున 1-3 ఏళ్ల పాటు స్థిరమైన వడ్డీతో పొదుపు చేయండి.',
      hi: 'हर महीने ₹500 या ₹1,000 की आरडी करके निश्चित ब्याज कमाएं।',
    },
    explanation: {
      en: 'A Recurring Deposit (RD) is an agreement where you deposit a fixed sum—like ₹500 or ₹1,000—every month into a bank or post office for a fixed period (1 to 5 years). The bank adds guaranteed compound interest. Because money is locked for a period, it stops you from spending it on frivolous wants.',
      te: 'రికరింగ్ డిపాజిట్ (RD) అంటే ప్రతి నెలా ₹500 లేదా ₹1,000 చొప్పున నిర్ణీత కాలం (1 నుండి 5 ఏళ్లు) బ్యాంకు లేదా పోస్టాఫీసులో జమ చేయడం. దీనికి చక్రవడ్డీ లభిస్తుంది. నిర్ణీత కాలం వరకు డబ్బు లాక్ అయి ఉండడం వల్ల చేతి ఖర్చులను అరికట్టవచ్చు.',
      hi: 'आरडी (RD) का मतलब है हर महीने तय रकम (जैसे ₹500 या ₹1,000) बैंक या डाकघर में 1 से 5 साल तक जमा करना। इस पर पक्का ब्याज मिलता है और पैसा सुरक्षित रहने से गैर-जरूरी खर्चों पर रोक लगती है।',
    },
    keyTakeaways: {
      en: [
        'Start with as low as ₹100 or ₹500 per month.',
        'Guaranteed interest rate locked for the entire tenure.',
        'Builds disciplined habit without market risk.',
      ],
      te: [
        'నెలకు కనీసం ₹100 లేదా ₹500 తో ప్రారంభించవచ్చు.',
        'మొత్తం కాలానికి స్థిరమైన హామీతో కూడిన వడ్డీ.',
        'ఎటువంటి నష్టభయం లేకుండా పొదుపు క్రమశిక్షణ అలవడుతుంది.',
      ],
      hi: [
        'महीने में सिर्फ ₹100 या ₹500 से शुरुआत कर सकते हैं।',
        'पूरी अवधि के लिए निश्चित और सुरक्षित ब्याज दर।',
        'बिना किसी जोखिम के बचत की अच्छी आदत बनती है।',
      ],
    },
    iconName: 'trending-up',
  },
  {
    levelNumber: 12,
    tierId: 2,
    tierName: { en: 'Savings & Shield', te: 'పొదుపు & రక్షణ నిధి', hi: 'बचत और सुरक्षा कवच' },
    title: {
      en: 'Creating Dedicated Goal Pots (Dream Pots)',
      te: 'లక్ష్యాల కోసం కలల కుండల పొదుపు',
      hi: 'सपनों के घड़े: लक्ष्य आधारित अलग बचत',
    },
    summary: {
      en: 'Name your savings pots to make goals tangible and emotionally protected.',
      te: 'పిల్లల చదువు, పండుగలు, అత్యవసరాల కోసం ప్రత్యేకంగా కలల కుండలను ఏర్పాటు చేయండి.',
      hi: 'बच्चों की पढ़ाई या दुकान के लिए अलग-अलग बचत घड़े बनाएं।',
    },
    explanation: {
      en: 'When all money is in one mixed pot, it easily leaks away. In Sakhi, you create named "Dream Pots"—such as "Daughter’s College Admission", "Sewing Machine Purchase", or "Emergency Shield". Naming your goal gives you psychological strength: you will think twice before breaking a pot labeled with your child’s education!',
      te: 'డబ్బునంతా ఒకే చోట కలిపి ఉంచితే త్వరగా ఖర్చయిపోతుంది. సఖిలో "పిల్లల చదువు", "కుట్టు మిషన్ కొనుగోలు", "రక్షణ నిధి" అని ప్రత్యేక కుండలుగా విభజించుకోవచ్చు. పిల్లల చదువు పేరుతో ఉన్న నిధిని అనవసర ఖర్చులకు వాడడానికి మనసు ఒప్పుకోదు!',
      hi: 'जब सारा पैसा एक साथ रहता है तो जल्दी खर्च हो जाता है। सखी में अलग-अलग घड़े बनाएं जैसे "बेटी की पढ़ाई", "सिलाई मशीन" या "सुरक्षा कवच"। जब पैसे पर बच्चे का नाम जुड़ा होता है तो उसे फिजूलखर्ची में निकालने का मन नहीं करता!',
    },
    keyTakeaways: {
      en: [
        'Create separate visual pots for short-term and long-term dreams.',
        'Allocate surplus automatically across active pots.',
        'Celebrate visual progress milestones in Sakhi Goals tab.',
      ],
      te: [
        'స్వల్పకాలిక మరియు దీర్ఘకాలిక కలల కోసం వేర్వేరు కుండలు సృష్టించండి.',
        'నెలవారీ మిగులును ఆయా కుండలకు విభజించండి.',
        'లక్ష్యం చేరే ప్రతి అడుగును సఖిలో ట్రాక్ చేయండి.',
      ],
      hi: [
        'छोटे और बड़े लक्ष्यों के लिए अलग-अलग घड़े बनाएं।',
        'हर महीने की बचत को इन घड़ों में बांटें।',
        'सखी के गोल्स टैब में अपनी प्रगति देखें।',
      ],
    },
    iconName: 'ads-click',
  },
  {
    levelNumber: 13,
    tierId: 2,
    tierName: { en: 'Savings & Shield', te: 'పొదుపు & రక్షణ నిధి', hi: 'बचत और सुरक्षा कवच' },
    title: {
      en: 'Milestone 2: Safety Shield Activated',
      te: 'మైలురాయి 2: కుటుంబ రక్షణ కవచం పూర్తి',
      hi: 'पड़ाव 2: सुरक्षा कवच तैयार',
    },
    summary: {
      en: 'Tier 2 complete: You are now protected against unforeseen life shocks.',
      te: 'దశ 2 పూర్తి: ఆకస్మిక ఆర్థిక సంక్షోభాల నుండి మీ కుటుంబానికి రక్షణ లభించింది.',
      hi: 'स्तर 2 पूर्ण: आपका परिवार अब आपातकालीन झटकों से सुरक्षित है।',
    },
    explanation: {
      en: 'Wonderful achievement! You now understand the power of micro-savings, the 3-month survival formula, secure Post Office and Bank RD accounts, and mental accounting with Dream Pots. Next, in Tier 3, we master modern Digital Banking and UPI safety!',
      te: 'అద్భుతమైన విజయం! రోజూ చిన్న పొదుపు, 3 నెలల రక్షణ నిధి గణన, పోస్టాఫీస్ మరియు బ్యాంకు RD ఖాతాలు, కలల కుండల ప్రయోజనాలపై మీకు పూర్తి అవగాహన వచ్చింది. తర్వాతి దశ 3 లో డిజిటల్ బ్యాంకింగ్ మరియు యూపీఐ భద్రతను నేర్చుకుందాం!',
      hi: 'शानदार उपलब्धि! अब आप छोटी बचत, 3 महीने के सुरक्षा कवच, डाकघर-बैंक आरडी और बचत घड़ों का महत्व समझ चुके हैं। अगले स्तर 3 में हम डिजिटल बैंकिंग और सुरक्षित यूपीआई सीखेंगे!',
    },
    keyTakeaways: {
      en: [
        'Tier 2 Complete: 3-month safety buffer established.',
        'Your family is insulated against private borrowing traps.',
        'Ready for Tier 3: Banking & Digital Payments.',
      ],
      te: [
        'దశ 2 పూర్తి: 3 నెలల అత్యవసర రక్షణ కవచం సిద్ధమైంది.',
        'వడ్డీ వ్యాపారుల ఉచ్చులో పడకుండా కుటుంబానికి రక్షణ లభించింది.',
        'దశ 3: డిజిటల్ బ్యాంకింగ్ వైపు పయనించండి.',
      ],
      hi: [
        'स्तर 2 पूर्ण: 3 महीने का सुरक्षा कवच तैयार।',
        'साहूकारी कर्ज के जाल से परिवार को बचाया जा चुका है।',
        'स्तर 3 के लिए तैयार: बैंकिंग और डिजिटल भुगतान।',
      ],
    },
    iconName: 'verified',
  },

  // ==========================================
  // TIER 3: BANKING, ATM & DIGITAL LITERACY (Levels 14-19)
  // ==========================================
  {
    levelNumber: 14,
    tierId: 3,
    tierName: { en: 'Digital Banking', te: 'డిజిటల్ బ్యాంకింగ్', hi: 'डिजिटल बैंकिंग' },
    title: {
      en: 'PM Jan Dhan Account & Zero Balance Benefits',
      te: 'ప్రధాన్ మంత్రి జన్ ధన్ ఖాతా ప్రయోజనాలు',
      hi: 'प्रधानमंत्री जन धन खाता और जीरो बैलेंस के लाभ',
    },
    summary: {
      en: 'Unlock zero minimum balance penalty protection and RuPay card facilities.',
      te: 'జీరో బ్యాలెన్స్ పెనాల్టీ లేని జన్ ధన్ ఖాతా మరియు రూపే కార్డ్ ప్రయోజనాలు.',
      hi: 'जीरो बैलेंस खाता, बिना किसी पेनल्टी और मुफ्त रूपे कार्ड की सुविधा।',
    },
    explanation: {
      en: 'A Pradhan Mantri Jan Dhan Yojana (PMJDY) account is a basic bank savings account available to every citizen with zero minimum balance requirement. Banks cannot charge penalty fines even if your balance drops to zero. It also provides a free RuPay debit card and in-built accident insurance cover.',
      te: 'పీఎం జన్ ధన్ యోజన ఖాతాలో కనీస నిల్వ (మినిమమ్ బ్యాలెన్స్) ఉంచాల్సిన అవసరం లేదు. ఖాతాలో బ్యాలెన్స్ సున్నా అయినా బ్యాంకులు జరిమానా విధించవు. దీనితో పాటు ఉచిత రూపే డెబిట్ కార్డు మరియు ప్రమాద బీమా సౌకర్యం లభిస్తాయి.',
      hi: 'प्रधानमंत्री जन धन खाता एक जीरो बैलेंस खाता है जिसमें कोई न्यूनतम राशि रखने की मजबूरी नहीं होती। बैलेंस शून्य होने पर भी बैंक कोई जुर्माना नहीं काटता। इसके साथ मुफ्त रूपे डेबिट कार्ड और दुर्घटना बीमा मिलता है।',
    },
    keyTakeaways: {
      en: [
        'Zero balance maintenance penalty.',
        'Free RuPay debit card provided.',
        'Direct gateway for government DBT welfare transfers.',
      ],
      te: [
        'జీరో బ్యాలెన్స్ పై ఎటువంటి పెనాల్టీ ఉండదు.',
        'ఉచిత రూపే డెబిట్ కార్డు సౌకర్యం.',
        'ప్రభుత్వ సంక్షేమ నిధులు (DBT) నేరుగా ఖాతాలోకే జమ అవుతాయి.',
      ],
      hi: [
        'जीरो बैलेंस पर कोई पेनल्टी नहीं कटती।',
        'मुफ्त रूपे डेबिट कार्ड की सुविधा।',
        'सरकारी योजनाओं का पैसा सीधे खाते में (DBT) आता है।',
      ],
    },
    iconName: 'credit-card',
  },
  {
    levelNumber: 15,
    tierId: 3,
    tierName: { en: 'Digital Banking', te: 'డిజిటల్ బ్యాంకింగ్', hi: 'डिजिटल बैंकिंग' },
    title: {
      en: 'ATM Card Rules & 4-Digit PIN Security',
      te: 'ఏటీఎం కార్డ్ మరియు 4-అంకెల పిన్ భద్రత',
      hi: 'एटीएम कार्ड और 4-अंकों के पिन की सुरक्षा',
    },
    summary: {
      en: 'Never write your PIN on the card or share it with strangers or shopkeepers.',
      te: 'ఏటీఎం పిన్ నంబర్ ను ఎప్పుడూ కార్డుపై రాయవద్దు లేదా ఇతరులకు చెప్పవద్దు.',
      hi: 'एटीएम पिन कभी कार्ड पर न लिखें और न ही किसी अजनबी को बताएं।',
    },
    explanation: {
      en: 'Your ATM PIN is the secret key to your life savings. Never write the 4-digit PIN on the back of your card, in a passbook, or on a piece of paper kept in your purse. When entering the PIN at an ATM or village BC point, cover the keypad with your hand so nobody behind you can see.',
      te: 'మీ ఏటీఎం పిన్ మీ కష్టార్జితానికి తాళం చెవి లాంటిది. 4 అంకెల పిన్ నంబర్ ను ఎప్పుడూ కార్డు వెనుక లేదా పాస్‌బుక్‌లో రాయకండి. ఏటీఎం లేదా బ్యాంకింగ్ కరస్పాండెంట్ (BC) కేంద్రాల వద్ద పిన్ నొక్కేటప్పుడు చేతిని అడ్డుపెట్టుకోండి.',
      hi: 'एटीएम पिन आपकी जमा पूंजी की चाबी है। 4 अंकों का पिन कभी कार्ड के पीछे, पासबुक या पर्ची पर न लिखें। एटीएम या ग्राहक सेवा केंद्र (BC) पर पिन डालते समय कीपैड को हाथ से ढक लें।',
    },
    keyTakeaways: {
      en: [
        'Never write PIN on the card or pouch.',
        'Cover keypad with your hand while typing.',
        'Never hand your card and PIN to a stranger to withdraw cash for you.',
      ],
      te: [
        'పిన్ నంబర్‌ను కార్డుపై లేదా పర్సులో ఎక్కడా రాయకండి.',
        'పిన్ నొక్కేటప్పుడు వేరే వాళ్లకు కనబడకుండా చేతిని అడ్డుపెట్టండి.',
        'డబ్బు తీయడానికి కార్డు మరియు పిన్ ను అపరిచితులకు ఎప్పుడూ ఇవ్వకండి.',
      ],
      hi: [
        'पिन को कार्ड या पर्स में कहीं भी न लिखें।',
        'पिन डालते समय कीपैड को हाथ से हमेशा ढकें।',
        'पैसे निकालने के लिए अपना कार्ड और पिन किसी अजनबी को न दें।',
      ],
    },
    iconName: 'lock',
  },
  {
    levelNumber: 16,
    tierId: 3,
    tierName: { en: 'Digital Banking', te: 'డిజిటల్ బ్యాంకింగ్', hi: 'डिजिटल बैंकिंग' },
    title: {
      en: 'How UPI & QR Code Payments Work',
      te: 'యూపీఐ మరియు క్యూఆర్ కోడ్ చెల్లింపుల విధానం',
      hi: 'यूपीआई और क्यूआर कोड से सुरक्षित भुगतान',
    },
    summary: {
      en: 'Understand that PIN is entered ONLY to SEND money, never to RECEIVE money.',
      te: 'డబ్బు పంపేటప్పుడు మాత్రమే పిన్ నొక్కాలి, డబ్బు స్వీకరించడానికి పిన్ అవసరం లేదు.',
      hi: 'याद रखें: पिन केवल पैसे भेजने के लिए होता है, पैसे पाने के लिए कभी नहीं।',
    },
    explanation: {
      en: 'UPI allows instant money transfers between bank accounts using a mobile phone. Golden Rule of UPI: You enter your UPI PIN ONLY when YOU are SENDING money from your account. If someone tells you "enter your PIN to receive government bonus or lottery prize", it is 100% a scam to steal your money.',
      te: 'యూపీఐ ద్వారా ఫోన్ నుండే బ్యాంకు ఖాతాల మధ్య క్షణాల్లో డబ్బు పంపవచ్చు. ముఖ్యమైన సూత్రం: మీరు ఎవరికైనా డబ్బు పంపుతున్నప్పుడు మాత్రమే యూపీఐ పిన్ నొక్కాలి. ప్రభుత్వ పథకం డబ్బు వస్తుందని లేదా బహుమతి వచ్చిందని పిన్ నొక్కమంటే అది మోసం!',
      hi: 'यूपीआई से मोबाइल द्वारा सीधे बैंक खाते में पैसा ट्रांसफर होता है। सबसे जरूरी नियम: यूपीआई पिन केवल तभी डाला जाता है जब आप किसी को पैसे भेज रहे हों। पैसे पाने के लिए पिन डालने को कहे तो वह 100% ठगी है।',
    },
    keyTakeaways: {
      en: [
        'PIN is entered ONLY to SEND money.',
        'You NEVER need to enter PIN to receive money.',
        'Always check the recipient name on screen before confirming.',
      ],
      te: [
        'డబ్బు పంపేటప్పుడు మాత్రమే పిన్ నొక్కాలి.',
        'డబ్బు తీసుకోవడానికి పిన్ ఎప్పటికీ అవసరం లేదు.',
        'చెల్లింపు చేసే ముందు స్క్రీన్‌పై వారి పేరు సరిచూసుకోండి.',
      ],
      hi: [
        'पिन सिर्फ पैसे भेजने के लिए डाला जाता है।',
        'पैसे पाने के लिए कभी पिन नहीं डालना होता।',
        'भुगतान करने से पहले स्क्रीन पर नाम जरूर चेक करें।',
      ],
    },
    iconName: 'qr-code-scanner',
  },
  {
    levelNumber: 17,
    tierId: 3,
    tierName: { en: 'Digital Banking', te: 'డిజిటల్ బ్యాంకింగ్', hi: 'डिजिटल बैंकिंग' },
    title: {
      en: 'Spotting Phone Calls & OTP Scams',
      te: 'ఫోన్ కాల్ మోసాలు & ఓటీపీ రక్షణ',
      hi: 'फर्जी फोन कॉल और ओटीपी (OTP) से बचाव',
    },
    summary: {
      en: 'Banks and officials NEVER call to ask for your OTP, ATM number, or passwords.',
      te: 'బ్యాంకు అధికారులు ఎప్పుడూ ఫోన్ చేసి ఓటీపీ లేదా ఏటీఎం నంబర్లు అడగరు.',
      hi: 'बैंक या अधिकारी कभी फोन पर ओटीपी, एटीएम नंबर या पासवर्ड नहीं मांगते।',
    },
    explanation: {
      en: 'Scammers often call claiming: "Your bank account is blocked, tell me your OTP to unblock" or "Your Aadhaar is suspended". Real bank managers, police officers, and government departments NEVER ask for OTPs or PINs over the phone. If anyone asks for an SMS code (OTP), immediately cut the call.',
      te: 'మోసగాళ్లు ఫోన్ చేసి "మీ బ్యాంక్ ఖాతా బ్లాక్ అయింది, ఓటీపీ చెప్పండి" అని నమ్మిస్తుంటారు. బ్యాంక్ మేనేజర్లు, పోలీసులు లేదా ప్రభుత్వ అధికారులు ఫోన్ చేసి ఓటీపీ లేదా పిన్ ఎప్పుడూ అడగరు. ఎవరైనా ఫోన్ లో ఓటీపీ అడిగితే వెంటనే కాల్ కట్ చేయండి.',
      hi: 'ठग फोन करके कहते हैं कि "आपका खाता बंद हो गया है, ओटीपी बताओ" या "आधार ब्लॉक हो गया है"। कोई भी असली बैंक मैनेजर या अधिकारी फोन पर ओटीपी नहीं मांगता। कोई भी कोड पूछे तो तुरंत फोन काट दें।',
    },
    keyTakeaways: {
      en: [
        'Never share SMS OTP with anyone on phone calls.',
        'Banks never call asking for PIN or passwords.',
        'Cut the call and visit your local bank branch directly if in doubt.',
      ],
      te: [
        'ఫోన్ కాల్స్‌లో ఎవరికీ ఎస్‌ఎంఎస్ ఓటీపీ చెప్పవద్దు.',
        'బ్యాంకులు ఎప్పుడూ పిన్ లేదా పాస్‌వర్డ్స్ అడగవు.',
        'అనుమానం వస్తే నేరుగా మీ బ్యాంక్ బ్రాంచ్‌కు వెళ్లి విచారించండి.',
      ],
      hi: [
        'फोन पर किसी को भी एसएमएस का ओटीपी न बताएं।',
        'बैंक कभी पिन या पासवर्ड फोन पर नहीं पूछता।',
        'कोई भी शक हो तो सीधे अपने बैंक शाखा में जाकर बात करें।',
      ],
    },
    iconName: 'phonelink-lock',
  },
  {
    levelNumber: 18,
    tierId: 3,
    tierName: { en: 'Digital Banking', te: 'డిజిటల్ బ్యాంకింగ్', hi: 'डिजिटल बैंकिंग' },
    title: {
      en: 'Direct Benefit Transfer (DBT) & Aadhaar Seeding',
      te: 'ప్రభుత్వ నగదు బదిలీ (DBT) & ఆధార్ అనుసంధానం',
      hi: 'डीबीटी (DBT) और आधार से बैंक खाता लिंक करना',
    },
    summary: {
      en: 'Link your Aadhaar with NPCI mapping to receive government subsidies without middlemen.',
      te: 'ప్రభుత్వ సబ్సిడీలు, సంక్షేమ నిధులు దళారులు లేకుండా నేరుగా అందడానికి ఆధార్ అనుసంధానం చేయండి.',
      hi: 'सरकारी योजनाओं का पैसा बिना बिचौलियों के सीधे पाने के लिए आधार लिंक करें।',
    },
    explanation: {
      en: 'Direct Benefit Transfer (DBT) sends welfare money—like PM-Kisan, Rythu Bharosa, gas subsidy, or scholarship funds—straight into your bank account. To ensure funds arrive without getting stuck, visit your bank branch and ask them to perform "Aadhaar NPCI Mapping" on your primary savings account.',
      te: 'డీబీటీ ద్వారా పీఎం-కిసాన్, రైతు భరోసా, గ్యాస్ సబ్సిడీ లేదా స్కాలర్‌షిప్ నిధులు దళారుల ప్రమేయం లేకుండా నేరుగా మీ ఖాతాలో పడతాయి. ఈ డబ్బు ఆగకుండా రావడానికి మీ బ్యాంకులో "ఆధార్ ఎన్‌పీసీఐ మ్యాపింగ్" (NPCI Seeding) చేయించుకోండి.',
      hi: 'डीबीटी (DBT) से पीएम-किसान, छात्रवृत्ति और गैस सब्सिडी का पैसा बिना बिचौलियों के सीधे बैंक में आता है। इसके लिए अपने बैंक में जाकर खाते को "आधार एनपीसीआई (NPCI) मैप" जरूर करवाएं।',
    },
    keyTakeaways: {
      en: [
        'DBT eliminates commission deductions by middlemen.',
        'Ensure Aadhaar is NPCI seeded in your primary bank account.',
        'Check DBT credit status via SMS or passbook entry.',
      ],
      te: [
        'డీబీటీ వల్ల దళారుల కమీషన్ల బెడద తప్పుతుంది.',
        'ప్రధాన బ్యాంక్ ఖాతాకు ఆధార్ ఎన్‌పీసీఐ సీడింగ్ ఉండేలా చూసుకోండి.',
        'ఎస్‌ఎంఎస్ లేదా పాస్‌బుక్ ద్వారా నిధులు జమ అయిన వివరాలు తెలుసుకోవచ్చు.',
      ],
      hi: [
        'डीबीटी से बिचौलियों की कमीशनखोरी खत्म होती है।',
        'मुख्य बैंक खाते में आधार एनपीसीआई लिंक करवाएं।',
        'पैसा आने पर एसएमएस या पासबुक एंट्री से जांच करें।',
      ],
    },
    iconName: 'fingerprint',
  },
  {
    levelNumber: 19,
    tierId: 3,
    tierName: { en: 'Digital Banking', te: 'డిజిటల్ బ్యాంకింగ్', hi: 'डिजिटल बैंकिंग' },
    title: {
      en: 'Milestone 3: Digital Banking Confident',
      te: 'మైలురాయి 3: డిజిటల్ బ్యాంకింగ్ విజేత',
      hi: 'पड़ाव 3: डिजिटल बैंकिंग में आत्मनिर्भर',
    },
    summary: {
      en: 'Tier 3 complete: You can now operate digital banking and protect your PIN & OTP.',
      te: 'దశ 3 పూర్తి: డిజిటల్ లావాదేవీలు మరియు పిన్ భద్రతపై మీకు పూర్తి పట్టు సాధించారు.',
      hi: 'स्तर 3 पूर्ण: अब आप डिजिटल बैंकिंग और साइबर सुरक्षा में पूरी तरह कुशल हैं।',
    },
    explanation: {
      en: 'Outstanding progress! You now understand PM Jan Dhan accounts, ATM PIN safety, the golden rule of UPI PIN entry, how to instantly spot telephone scammers, and how DBT government funds flow securely. Next, in Tier 4, we tackle Debt Elimination and stopping high-interest moneylender drains!',
      te: 'అభినందనలు! జన్ ధన్ ఖాతా ప్రయోజనాలు, ఏటీఎం పిన్ భద్రత, యూపీఐ నియమాలు, ఫోన్ మోసాలను గుర్తించడం మరియు డీబీటీ అనుసంధానంపై మీకు పూర్తి అవగాహన వచ్చింది. తర్వాతి దశ 4 లో అధిక వడ్డీ అప్పుల విముక్తిని నేర్చుకుందాం!',
      hi: 'शानदार प्रगति! अब आप जन धन खाता, एटीएम पिन सुरक्षा, यूपीआई के सही नियम और फोन ठगी से बचाव समझ चुके हैं। अगले स्तर 4 में हम महंगे कर्ज से आजादी और साहूकारी जाल तोड़ने के उपाय सीखेंगे!',
    },
    keyTakeaways: {
      en: [
        'Tier 3 Complete: Full digital literacy achieved.',
        'Your digital banking fortress is secure.',
        'Proceed to Tier 4: Debt Elimination & Smart Loans.',
      ],
      te: [
        'దశ 3 పూర్తి: డిజిటల్ బ్యాంకింగ్‌పై పూర్తి అవగాహన.',
        'మీ ఖాతాలు సైబర్ మోసాల నుండి సురక్షితం.',
        'దశ 4: అప్పుల విముక్తి వైపు అడుగు వేయండి.',
      ],
      hi: [
        'स्तर 3 पूर्ण: डिजिटल बैंकिंग में पूरी समझ बनी।',
        'आपके खाते अब साइबर ठगों से सुरक्षित हैं।',
        'स्तर 4 की ओर बढ़ें: कर्ज मुक्ति और सस्ते ऋण।',
      ],
    },
    iconName: 'verified-user',
  },

  // ==========================================
  // TIER 4: DEBT ELIMINATION & SMART BORROWING (Levels 20-26)
  // ==========================================
  {
    levelNumber: 20,
    tierId: 4,
    tierName: { en: 'Debt Elimination', te: 'అప్పుల విముక్తి', hi: 'कर्ज मुक्ति' },
    title: {
      en: 'The Hidden Trap of ₹3/Month Interest',
      te: 'నెలకు ₹3 వడ్డీలోని భారీ నష్టాలు',
      hi: '₹3 सैकड़ा ब्याज का असली भारी नुकसान',
    },
    summary: {
      en: 'Why ₹3 per hundred every month actually means a staggering 36% annual interest drain.',
      te: 'నెలకు ₹3 వడ్డీ అంటే ఏడాదికి 36% చక్రవడ్డీ ఊబి అని గణితం ద్వారా తెలుసుకోండి.',
      hi: 'महीने का ₹3 सैकड़ा असल में साल का 36% भारी ब्याज होता है।',
    },
    explanation: {
      en: 'Village moneylenders say: "It is only ₹3 per hundred rupees a month". But multiply ₹3 by 12 months = 36% per year! If you borrow ₹50,000 at ₹3/month, you pay ₹18,000 every year just to keep the loan alive—and the original ₹50,000 debt never reduces. That is enough money to buy cattle or pay 2 years of college fees.',
      te: 'వడ్డీ వ్యాపారులు "వందకు నెలకు ₹3 మాత్రమే" అంటారు. కానీ 12 నెలలకు లెక్కేస్తే అది ఏడాదికి 36% అవుతుంది! ₹50,000 అప్పుకు ఏడాదికి ₹18,000 వడ్డీ మాత్రమే కడుతున్నారు, అసలు అలాగే ఉంటుంది. ఆ డబ్బుతో పాడి ఆవును కొనవచ్చు లేదా పిల్లల చదువు ఫీజులు కట్టవచ్చు.',
      hi: 'साहूकार कहता है कि "सिर्फ ₹3 सैकड़ा महीना है"। लेकिन 12 महीने में यह 36% सालाना बनता है! ₹50,000 के कर्ज पर आप साल में ₹18,000 केवल ब्याज भरते हैं और मूलधन वैसा का वैसा रहता है। इतने पैसे में एक गाय खरीदी जा सकती है।',
    },
    keyTakeaways: {
      en: [
        '₹3/month = 36% APR (Extremely dangerous).',
        '₹50,000 loan drains ₹1,500 every single month in pure interest.',
        'Never take private moneylender loans for lifestyle expenses.',
      ],
      te: [
        'నెలకు ₹3 వడ్డీ = ఏడాదికి 36% (చాలా ప్రమాదకరం).',
        '₹50,000 అప్పుకు నెలకు ₹1,500 వడ్డీ మాత్రమే వృథా అవుతుంది.',
        'కోరికల కోసం ప్రైవేట్ వడ్డీ వ్యాపారుల వద్ద అప్పు చేయకండి.',
      ],
      hi: [
        '₹3 सैकड़ा महीना = 36% सालाना भारी ब्याज।',
        '₹50,000 पर हर महीने ₹1,500 सिर्फ ब्याज में बर्बाद होते हैं।',
        'दिखावे के लिए साहूकार से कभी कर्ज न लें।',
      ],
    },
    iconName: 'trending-down',
    backendLessonId: 'les-3-1-interest-drain-math',
  },
  {
    levelNumber: 21,
    tierId: 4,
    tierName: { en: 'Debt Elimination', te: 'అప్పుల విముక్తి', hi: 'कर्ज मुक्ति' },
    title: {
      en: 'Comparing Loan Costs: 36% vs 12%',
      te: 'వడ్డీ రేట్ల సరైన గణన: 36% vs 12%',
      hi: 'ऋण लागत की तुलना: 36% बनाम 12%',
    },
    summary: {
      en: 'See how switching from moneylender to bank/SHG credit saves thousands immediately.',
      te: 'ప్రైవేట్ అప్పును బ్యాంకు లేదా సంఘం అప్పుగా మార్చడం ద్వారా వేల రూపాయలు ఎలా ఆదా అవుతాయో చూడండి.',
      hi: 'साहूकारी कर्ज को बैंक या समूह ऋण में बदलने से हजारों की बचत कैसे होती है।',
    },
    explanation: {
      en: 'Compare the exact numbers: On a ₹30,000 loan, a private moneylender charges ₹10,800 interest per year (36%). An SHG bank linkage loan charges only ₹3,600 interest per year (12%). By replacing the private loan with an SHG loan, you save ₹7,200 every single year!',
      te: 'ఖచ్చితమైన లెక్కలు చూడండి: ₹30,000 అప్పుపై ప్రైవేట్ వ్యాపారి ఏడాదికి ₹10,800 వడ్డీ (36%) తీసుకుంటాడు. అదే మహిళా సంఘం బ్యాంకు రుణంపై ఏడాదికి కేవలం ₹3,600 వడ్డీ (12%) మాత్రమే అవుతుంది. రుణ మార్పిడి ద్వారా ఏటా ₹7,200 నేరుగా ఆదా అవుతుంది!',
      hi: 'सटीक हिसाब देखिए: ₹30,000 के कर्ज पर साहूकार साल में ₹10,800 ब्याज (36%) लेता है। वही समूह बैंक लिंकेज ऋण पर साल में सिर्फ ₹3,600 ब्याज (12%) लगता है। कर्ज बदलने से हर साल ₹7,200 की सीधी बचत होती है!',
    },
    keyTakeaways: {
      en: [
        'Moneylender: 36%–60% APR (Wealth destroyer).',
        'SHG Bank Linkage / Stree Nidhi: 9%–12% APR.',
        'Refinance private debt immediately using institutional loans.',
      ],
      te: [
        'వడ్డీ వ్యాపారి: 36%–60% వార్షిక వడ్డీ (కుటుంబాన్ని నాశనం చేస్తుంది).',
        'మహిళా సంఘం / స్త్రీ నిధి రుణం: కేవలం 9%–12% వార్షిక వడ్డీ.',
        'తక్కువ వడ్డీ రుణాలతో ప్రైవేట్ అప్పులను వెంటనే తీర్చివేయండి.',
      ],
      hi: [
        'साहूकार: 36% से 60% सालाना (आर्थिक बर्बादी)।',
        'समूह बैंक ऋण / स्त्री निधि: 9% से 12% सालाना।',
        'संस्थागत ऋण लेकर साहूकार का कर्ज तुरंत खत्म करें।',
      ],
    },
    iconName: 'compare-arrows',
  },
  {
    levelNumber: 22,
    tierId: 4,
    tierName: { en: 'Debt Elimination', te: 'అప్పుల విముక్తి', hi: 'कर्ज मुक्ति' },
    title: {
      en: 'Refinancing via SHG & Stree Nidhi Credit',
      te: 'మహిళా సంఘం (SHG) & స్త్రీ నిధి ద్వారా రుణ మార్పిడి',
      hi: 'स्वयं सहायता समूह और स्त्री निधि से सस्ता कर्ज',
    },
    summary: {
      en: 'Step-by-step guidance on applying for VO / SHG internal loans to pay off high-cost debt.',
      te: 'గ్రామైఖ్య సంఘం (VO) లేదా స్త్రీ నిధి ద్వారా తక్కువ వడ్డీ రుణం పొందే విధానం.',
      hi: 'ग्राम संगठन (VO) या समूह से ऋण लेकर महंगा कर्ज चुकाने की प्रक्रिया।',
    },
    explanation: {
      en: 'Talk to your SHG group leader or Village Organization (VO) coordinator. Request an internal lending loan or a Stree Nidhi credit allocation specifically for high-cost debt swap. Take the disbursed loan money directly to the moneylender, pay off the full principal, get your signed promissory note back, and destroy it.',
      te: 'మీ సంఘం లీడర్ లేదా విలేజ్ ఆర్గనైజేషన్ (VO) ప్రతినిధితో మాట్లాడండి. అధిక వడ్డీ అప్పులను తీర్చడానికి సంఘం అంతర్గత రుణం లేదా స్త్రీ నిధి రుణాన్ని అడగండి. వచ్చిన డబ్బుతో వడ్డీ వ్యాపారికి అసలు చెల్లించి, మీ ప్రామిసరీ నోటును వెనక్కి తీసుకుని చింపేయండి.',
      hi: 'अपनी समूह सखी या ग्राम संगठन (VO) से बात करें। महंगे कर्ज को खत्म करने के लिए समूह ऋण या स्त्री निधि की मांग करें। मिले पैसे से साहूकार का पूरा मूलधन चुकाकर अपना प्रॉमिसरी नोट वापस लेकर नष्ट करें।',
    },
    keyTakeaways: {
      en: [
        'Request an official "Debt Swap" loan from your SHG / VO.',
        'Pay off moneylender principal in one single shot.',
        'Collect and destroy all signed blank papers or promissory notes.',
      ],
      te: [
        'సంఘం నుండి ప్రత్యేక రుణ మార్పిడి (Debt Swap) రుణం తీసుకోండి.',
        'వడ్డీ వ్యాపారికి ఒకేసారి అసలు చెల్లించండి.',
        'సంతకం పెట్టిన ఖాళీ కాగితాలు, ప్రామిసరీ నోట్లను తప్పనిసరిగా వెనక్కి తీసుకోండి.',
      ],
      hi: [
        'समूह से "डेट स्वैप" (ऋण बदलाव) लोन की मांग करें।',
        'साहूकार को एक बार में पूरा मूलधन देकर रसीद लें।',
        'हस्ताक्षर किए हुए खाली कागज और नोट वापस लेकर फाड़ दें।',
      ],
    },
    iconName: 'groups',
    backendLessonId: 'les-3-2-shg-refinance-step',
  },
  {
    levelNumber: 23,
    tierId: 4,
    tierName: { en: 'Debt Elimination', te: 'అప్పుల విముక్తి', hi: 'कर्ज मुक्ति' },
    title: {
      en: 'The Debt Snowball Payoff Method',
      te: 'అప్పుల విముక్తికి స్నోబాల్ పద్ధతి',
      hi: 'कर्ज मुक्ति की स्नोबॉल तकनीक',
    },
    summary: {
      en: 'Order all your debts from smallest to largest and eliminate them one by one.',
      te: 'అప్పులన్నింటినీ చిన్న మొత్తం నుండి పెద్ద మొత్తం వరకు క్రమబద్ధీకరించి ఒక్కొక్కటిగా తీర్చివేయండి.',
      hi: 'सभी कर्जों को छोटे से बड़े क्रम में लिखकर एक-एक करके खत्म करें।',
    },
    explanation: {
      en: 'The Snowball method is the world’s most effective psychological debt repayment technique. List all debts from smallest balance to largest. Pay minimum dues on all large loans, but throw every spare rupee of surplus onto the smallest loan. When the smallest loan hits zero, roll that entire payment amount onto the next loan!',
      te: 'స్నోబాల్ పద్ధతి అప్పుల విముక్తికి అత్యంత శక్తివంతమైన మార్గం. మీ అప్పులన్నింటినీ చిన్న మొత్తం నుండి పెద్ద మొత్తం వరకు రాయండి. అన్నింటికీ కనీస కిస్తీలు కడుతూ, మిగిలిన మిగులు మొత్తాన్ని చిన్న అప్పుపై వేయండి. చిన్న అప్పు తీరగానే ఆ కిస్తీ డబ్బును తర్వాతి అప్పుకు కలిపి వేగంగా తీర్చండి!',
      hi: 'स्नोबॉल तकनीक से कर्ज तेजी से खत्म होता है। सबसे छोटे कर्ज से लेकर सबसे बड़े कर्ज की सूची बनाएं। सबमें न्यूनतम किस्त दें, लेकिन जो बचत हो उसे सबसे छोटे कर्ज में लगाकर पहले उसे शून्य करें। फिर वही राशि अगले कर्ज में जोड़ दें!',
    },
    keyTakeaways: {
      en: [
        'List debts by balance amount (Smallest to Largest).',
        'Attack the smallest debt with maximum surplus.',
        'Each cleared loan frees up more monthly cashflow.',
      ],
      te: [
        'అప్పులను చిన్న మొత్తం నుండి పెద్ద మొత్తం వరకు జాబితా చేయండి.',
        'మిగులు డబ్బుతో ముందుగా చిన్న అప్పును పూర్తిగా తీర్చివేయండి.',
        'ఒక్కో అప్పు తీరే కొద్దీ నెలవారీ మిగులు పెరుగుతుంది.',
      ],
      hi: [
        'कर्ज को छोटी रकम से बड़ी रकम के क्रम में लिखें।',
        'पूरी बचत लगाकर सबसे पहले छोटे कर्ज को खत्म करें।',
        'हर कर्ज खत्म होने पर महीने का बोझ हल्का होता जाता है।',
      ],
    },
    iconName: 'ac-unit',
  },
  {
    levelNumber: 24,
    tierId: 4,
    tierName: { en: 'Debt Elimination', te: 'అప్పుల విముక్తి', hi: 'कर्ज मुक्ति' },
    title: {
      en: 'Gold Loans: Bank vs Pawn Broker',
      te: 'బంగారు రుణాలు: బ్యాంక్ vs తాకట్టు వ్యాపారి',
      hi: 'गोल्ड लोन: बैंक बनाम सुनार/साहूकार',
    },
    summary: {
      en: 'Never pledge gold with local pawn brokers charging 24%-36% when banks offer 9% agricultural gold loans.',
      te: 'వడ్డీ వ్యాపారుల వద్ద 24%-36% కి కాకుండా బ్యాంకుల్లో 8.5%-9% తక్కువ వడ్డీతో గోల్డ్ లోన్ పొందండి.',
      hi: 'सुनार को 24%-36% ब्याज देने के बजाय बैंक से 9% पर सुरक्षित गोल्ड लोन लें।',
    },
    explanation: {
      en: 'Local pawn brokers and pawnbrokers charge ₹2 to ₹3 per hundred (24%–36% APR) and can misplace or undervalue your jewelry. Nationalized banks and rural regional banks (like APGVB / TGB) offer Agricultural Gold Loans at only 8.5% to 9.5% APR in safe strongroom lockers with computerized weight receipts.',
      te: 'స్థానిక తాకట్టు వ్యాపారులు నెలకు ₹2 నుండి ₹3 (24%–36%) వడ్డీ వసూలు చేస్తారు. జాతీయ బ్యాంకులు మరియు గ్రామీణ వికాస్ బ్యాంకులు కేవలం 8.5% నుండి 9.5% తక్కువ వార్షిక వడ్డీతో వ్యవసాయ బంగారు రుణాలు ఇస్తాయి. బ్యాంకు లాకర్లలో మీ బంగారం 100% సురక్షితం.',
      hi: 'स्थानीय सुनार 24% से 36% तक ब्याज लेते हैं और गहनों की सुरक्षा का भी भरोसा नहीं होता। सरकारी और ग्रामीण बैंक मात्र 8.5% से 9.5% ब्याज पर सुरक्षित गोल्ड लोन देते हैं, जहां पक्की रसीद और लॉकर सुरक्षा मिलती है।',
    },
    keyTakeaways: {
      en: [
        'Bank Agricultural Gold Loan: ~8.5%–9.5% APR.',
        'Private Pawn Broker: 24%–36% APR (Heavy drain).',
        'Bank lockers provide verified computerized insurance.',
      ],
      te: [
        'బ్యాంక్ వ్యవసాయ గోల్డ్ లోన్: ~8.5%–9.5% వార్షిక వడ్డీ.',
        'ప్రైవేట్ తాకట్టు: 24%–36% భారీ నష్టం.',
        'బ్యాంకుల్లో బంగారం భద్రతకు బీమా మరియు కంప్యూటర్ రసీదు ఉంటుంది.',
      ],
      hi: [
        'बैंक कृषि गोल्ड लोन: मात्र 8.5% से 9.5% सालाना ब्याज।',
        'निजी सुनार: 24% से 36% सालाना भारी नुकसान।',
        'बैंक में पक्की रसीद और सोने का पूरा बीमा होता है।',
      ],
    },
    iconName: 'monetization-on',
  },
  {
    levelNumber: 25,
    tierId: 4,
    tierName: { en: 'Debt Elimination', te: 'అప్పుల విముక్తి', hi: 'कर्ज मुक्ति' },
    title: {
      en: 'What is a CIBIL Credit Score?',
      te: 'క్రెడిట్ స్కోరు (CIBIL) ప్రాముఖ్యత',
      hi: 'सिबिल (CIBIL) क्रेडिट स्कोर क्या है?',
    },
    summary: {
      en: 'Understand how timely SHG and bank loan repayments open doors to large low-cost business loans.',
      te: 'సకాలంలో కిస్తీలు చెల్లించడం వల్ల భవిష్యత్తులో తక్కువ వడ్డీతో పెద్ద రుణాలు ఎలా లభిస్తాయో తెలుసుకోండి.',
      hi: 'समय पर किस्त भरने से बड़ा और सस्ता बैंक लोन कैसे आसानी से मिलता है।',
    },
    explanation: {
      en: 'A CIBIL credit score is a 3-digit number (between 300 and 900) that shows banks how trustworthy you are. When you repay SHG loans, MUDRA loans, or tractor EMIs on time before the due date, your score rises above 750. A high score means banks will gladly give you low-interest business loans whenever you need them.',
      te: 'సిబిల్ స్కోర్ (300 నుండి 900 వరకు) అనేది మీ నిజాయితీని తెలియజేసే సంఖ్య. సంఘం రుణాలు లేదా ముద్రా రుణాల కిస్తీలను గడువు తేదీలోపు క్రమం తప్పకుండా కడితే మీ స్కోర్ 750 దాటుతుంది. మంచి స్కోర్ ఉంటే బ్యాంకులు భవిష్యత్తులో పెద్ద వ్యాపార రుణాలను తక్కువ వడ్డీతో వెంటనే మంజూరు చేస్తాయి.',
      hi: 'सिबिल स्कोर (300 से 900) यह बताता है कि आप समय पर कर्ज चुकाने में कितने ईमानदार हैं। समूह या बैंक लोन की किस्तें समय पर भरने से स्कोर 750 से ऊपर जाता है। अच्छा स्कोर होने पर बैंक कम ब्याज पर बड़ा बिजनेस लोन तुरंत देते हैं।',
    },
    keyTakeaways: {
      en: [
        'Score above 750 unlocks lowest bank interest rates.',
        'Never delay monthly loan EMIs even by a few days.',
        'Timely repayment builds lifetime financial reputation.',
      ],
      te: [
        '750 కంటే ఎక్కువ స్కోర్ ఉంటే తక్కువ వడ్డీ రుణాలు లభిస్తాయి.',
        'నెలవారీ కిస్తీలను కొన్ని రోజులు కూడా ఆలస్యం చేయకండి.',
        'సకాలంలో చెల్లింపు మీ జీవితకాల ఆర్థిక పరపతిని పెంచుతుంది.',
      ],
      hi: [
        '750 से ऊपर का स्कोर सबसे कम ब्याज दर दिलाता है।',
        'लोन की किस्त कभी भी एक दिन भी लेट न करें।',
        'समय पर भुगतान से बैंक में आपकी साख मजबूत होती है।',
      ],
    },
    iconName: 'speed',
  },
  {
    levelNumber: 26,
    tierId: 4,
    tierName: { en: 'Debt Elimination', te: 'అప్పుల విముక్తి', hi: 'कर्ज मुक्ति' },
    title: {
      en: 'Milestone 4: Debt-Free Champion',
      te: 'మైలురాయి 4: అప్పుల రహిత ఛాంపియన్',
      hi: 'पड़ाव 4: कर्ज मुक्ति के विजेता',
    },
    summary: {
      en: 'Tier 4 complete: You have mastered debt refinancing, the snowball method, and credit scores.',
      te: 'దశ 4 పూర్తి: ప్రైవేట్ అప్పుల విముక్తి మరియు రుణ నిర్వహణపై పూర్తి పట్టు సాధించారు.',
      hi: 'स्तर 4 पूर्ण: साहूकारी कर्ज से मुक्ति और ऋण प्रबंधन में पूरी सफलता।',
    },
    explanation: {
      en: 'Huge milestone! You now know how to crush 36% moneylender traps, use SHG debt swap mechanisms, execute the debt snowball strategy, access low-cost bank gold loans, and protect your CIBIL score. In Tier 5, we transition from debt freedom to active wealth building and compounding investments!',
      te: 'అద్భుతమైన విజయం! 36% అధిక వడ్డీ నష్టాలు, సంఘం ద్వారా రుణ మార్పిడి, స్నోబాల్ పద్ధతి, తక్కువ వడ్డీ గోల్డ్ లోన్స్ మరియు సిబిల్ స్కోర్ ప్రాముఖ్యతపై మీకు స్పష్టత వచ్చింది. తర్వాతి దశ 5 లో సంపద సృష్టి మరియు చక్రవడ్డీ పెట్టుబడుల గురించి తెలుసుకుందాం!',
      hi: 'शानदार पड़ाव! अब आप 36% ब्याज का जाल तोड़ना, समूह ऋण से कर्ज बदलना, स्नोबॉल तकनीक, सुरक्षित गोल्ड लोन और सिबिल स्कोर का महत्व सीख चुके हैं। स्तर 5 में हम संचित बचत से धन वृद्धि और निवेश सीखेंगे!',
    },
    keyTakeaways: {
      en: [
        'Tier 4 Complete: Complete debt freedom roadmap unlocked.',
        'High-interest debt drain eliminated.',
        'Proceed to Tier 5: Wealth Growth & Compounding.',
      ],
      te: [
        'దశ 4 పూర్తి: అప్పుల విముక్తి ప్రణాళిక సిద్ధమైంది.',
        'అధిక వడ్డీ నష్టాలకు పూర్తిగా అడ్డుకట్ట పడింది.',
        'దశ 5: సంపద వృద్ధి వైపు పయనించండి.',
      ],
      hi: [
        'स्तर 4 पूर्ण: कर्ज से मुक्ति का रास्ता साफ।',
        'महंगे ब्याज की बर्बादी पूरी तरह बंद।',
        'स्तर 5 की ओर बढ़ें: धन वृद्धि और निवेश।',
      ],
    },
    iconName: 'emoji-events',
  },

  // ==========================================
  // TIER 5: GROWING WEALTH & INVESTMENTS (Levels 27-33)
  // ==========================================
  {
    levelNumber: 27,
    tierId: 5,
    tierName: { en: 'Wealth Growth', te: 'సంపద వృద్ధి', hi: 'धन वृद्धि' },
    title: {
      en: 'Inflation: Why Idle Cash Loses Value',
      te: 'ద్రవ్యోల్బణం: ఇంట్లో ఉంచిన డబ్బు విలువ ఎలా తగ్గుతుంది?',
      hi: 'महंगाई: घर में रखा पैसा अपनी कीमत क्यों खो देता है?',
    },
    summary: {
      en: 'Understand how rising prices silently erode cash kept in home almirahs.',
      te: 'ధరల పెరుగుదల వల్ల ఇంట్లో దాచిన నగదు విలువ కాలక్రమేణా ఎలా తగ్గిపోతుందో తెలుసుకోండి.',
      hi: 'महंगाई के कारण अलमारी में रखा नकद पैसा कैसे कमजोर हो जाता है।',
    },
    explanation: {
      en: 'Inflation means prices increase over time. Ten years ago, 1 liter of cooking oil cost ₹60; today it costs ₹140. If you keep ₹10,000 cash locked in a box at home for 5 years, it is still ₹10,000 in paper, but it will buy only half as many groceries. Money must be invested in assets that grow faster than inflation.',
      te: 'ద్రవ్యోల్బణం అంటే కాలక్రమేణా నిత్యావసరాల ధరలు పెరగడం. పదేళ్ల క్రితం లీటర్ నూనె ₹60 ఉంటే, ఇప్పుడు ₹140 అయింది. మీరు ₹10,000 నగదును ఇంట్లో బీరువాలో 5 ఏళ్లు అలాగే ఉంచితే, కాగితం లెక్కకు అదే ₹10,000 ఉంటుంది కానీ కొనుగోలు శక్తి సగానికి తగ్గిపోతుంది. అందుకే డబ్బును వృద్ధి చెందే పథకాల్లో పెట్టుబడి పెట్టాలి.',
      hi: 'महंगाई का मतलब है चीजों के दाम बढ़ना। दस साल पहले जो तेल ₹60 का था, आज ₹140 का है। अगर आप ₹10,000 घर में बक्से में 5 साल रखेंगे तो वह कागज में ₹10,000 ही रहेगा लेकिन उससे आधा ही सामान आएगा। इसलिए पैसे को सही जगह बढ़ाना जरूरी है।',
    },
    keyTakeaways: {
      en: [
        'Cash in a box loses purchasing power every year (~6% inflation).',
        'Grow money in assets that beat the rising price of food and fuel.',
        'Idle cash is silent loss.',
      ],
      te: [
        'ఇంట్లో ఉంచిన నగదు కొనుగోలు శక్తి ఏటా ~6% తగ్గిపోతుంది.',
        'ధరల పెరుగుదల కంటే వేగంగా పెరిగే పథకాల్లో మదుపు చేయండి.',
        'పెట్టుబడి పెట్టని నగదు నిశ్శబ్ద నష్టం.',
      ],
      hi: [
        'घर में रखे पैसे की ताकत हर साल 6% घट जाती है।',
        'पैसे को ऐसी जगह लगाएं जो महंगाई दर से ज्यादा बढ़े।',
        'पैसे को बेकार रखना एक अदृश्य नुकसान है।',
      ],
    },
    iconName: 'price-change',
  },
  {
    levelNumber: 28,
    tierId: 5,
    tierName: { en: 'Wealth Growth', te: 'సంపద వృద్ధి', hi: 'धन वृद्धि' },
    title: {
      en: 'Fixed Deposits (FD) for Guaranteed Return',
      te: 'ఫిక్స్‌డ్ డిపాజిట్ (FD) తో స్థిరమైన గ్యారెంటీ రాబడి',
      hi: 'फिक्स्ड डिपॉजिट (FD) से सुरक्षित पक्का ब्याज',
    },
    summary: {
      en: 'Lock lump-sum savings in bank or post office FDs with 100% principal safety.',
      te: 'పెద్ద మొత్తంలో ఉన్న సొమ్మును బ్యాంకు లేదా పోస్టాఫీస్ FD లో పెట్టి పూర్తి భద్రతతో రాబడి పొందండి.',
      hi: 'एकमुश्त रकम को बैंक या डाकघर की एफडी में रखकर 100% सुरक्षा के साथ ब्याज पाएं।',
    },
    explanation: {
      en: 'A Fixed Deposit (FD) is a savings instrument where you deposit a lump sum—like ₹10,000 or ₹50,000—for a fixed period (1 to 5 years). The bank guarantees your principal and pays 6.5% to 7.5% annual interest. Senior citizens get an extra 0.5% bonus interest. It is 100% risk-free up to ₹5 Lakhs under government deposit insurance.',
      te: 'ఫిక్స్‌డ్ డిపాజిట్ (FD) అంటే ₹10,000 లేదా ₹50,000 లాంటి పెద్ద మొత్తాన్ని 1 నుండి 5 ఏళ్ల కాలానికి బ్యాంకులో భద్రపరచడం. బ్యాంకు మీ అసలుకు పూర్తి గ్యారెంటీ ఇస్తూ ఏడాదికి 6.5% నుండి 7.5% స్థిరమైన వడ్డీని చెల్లిస్తుంది. ప్రభుత్వ నిబంధనల ప్రకారం ₹5 లక్షల వరకు డిపాజిట్లకు పూర్తి బీమా రక్షణ ఉంటుంది.',
      hi: 'फिक्स्ड डिपॉजिट (FD) में ₹10,000 या ₹50,000 जैसी एकमुश्त रकम 1 से 5 साल के लिए जमा की जाती है। बैंक मूलधन की पूरी गारंटी देते हुए 6.5% से 7.5% पक्का सालाना ब्याज देता है। सरकारी नियम अनुसार ₹5 लाख तक का डिपॉजिट पूरी तरह सुरक्षित होता है।',
    },
    keyTakeaways: {
      en: [
        '100% principal safety up to ₹5 Lakhs under DICGC.',
        'Guaranteed fixed interest unaffected by market swings.',
        'Senior citizens receive extra 0.5% interest bonus.',
      ],
      te: [
        'ప్రభుత్వ డిపాజిట్ బీమా (DICGC) కింద ₹5 లక్షల వరకు 100% భద్రత.',
        'మార్కెట్ ఒడిదుడుకులతో సంబంధం లేని స్థిరమైన వడ్డీ.',
        'వయోవృద్ధులకు అదనంగా 0.5% ఎక్కువ వడ్డీ లభిస్తుంది.',
      ],
      hi: [
        'सरकारी गारंटी (DICGC) के तहत ₹5 लाख तक का डिपॉजिट 100% सुरक्षित।',
        'बाजार के उतार-चढ़ाव से मुक्त पक्का ब्याज।',
        'वरिष्ठ नागरिकों को 0.5% अतिरिक्त ब्याज मिलता है।',
      ],
    },
    iconName: 'lock-clock',
  },
  {
    levelNumber: 29,
    tierId: 5,
    tierName: { en: 'Wealth Growth', te: 'సంపద వృద్ధి', hi: 'धन वृद्धि' },
    title: {
      en: 'Gold as an Asset: Physical vs Sovereign Bonds',
      te: 'బంగారంపై పెట్టుబడి: నగల రూపం vs సావరిన్ గోల్డ్ బాండ్లు',
      hi: 'सोने में समझदार निवेश: आभूषण बनाम सॉवरेन गोल्ड बॉन्ड',
    },
    summary: {
      en: 'Avoid high jewelry making charges (15%-25%) when investing in gold for future security.',
      te: 'నగలు చేయించేటప్పుడు పోయే 15%-25% తరుగు/తయారీ కూలీల నష్టాలను నివారించండి.',
      hi: 'सोने के गहने बनवाने पर 15%-25% की मेकिंग चार्ज की बर्बादी से बचें।',
    },
    explanation: {
      en: 'When you buy physical gold jewelry, jewelers charge 15% to 25% extra for "making charges and wastage" (tariugu). If you sell it back, you lose that entire 20%. For pure investment, consider buying BIS Hallmark 999 24K gold coins from banks or RBI Sovereign Gold Bonds (SGB) which pay 2.5% annual cash interest on top of gold price appreciation with zero making loss.',
      te: 'బంగారు నగలు కొన్నప్పుడు తయారీ కూలీ, తరుగు పేరిట 15% నుండి 25% అదనంగా ఖర్చవుతుంది. తిరిగి అమ్మినప్పుడు ఆ తరుగు డబ్బు రాదు. కేవలం పెట్టుబడి కోసమైతే బ్యాంకు గోల్డ్ కాయిన్లు లేదా ఆర్బీఐ సావరిన్ గోల్డ్ బాండ్లు (SGB) తీసుకోవడం మంచిది. బాండ్లపై బంగారం ధర పెరగడంతో పాటు ఏటా 2.5% అదనపు వడ్డీ కూడా లభిస్తుంది.',
      hi: 'सोने के गहने खरीदने पर 15% से 25% मेकिंग चार्ज और घिसाई का पैसा कट जाता है जो बेचने पर वापस नहीं मिलता। निवेश के लिए 24 कैरेट हॉलमार्क सोने के सिक्के या आरबीआई सॉवरेन गोल्ड बॉन्ड (SGB) बेहतर हैं, जिसमें सोने की बढ़ती कीमत के साथ हर साल 2.5% अतिरिक्त ब्याज मिलता है।',
    },
    keyTakeaways: {
      en: [
        'Jewelry making charges (15%–25%) are pure expense, not investment.',
        'Always check for mandatory BIS 916 Hallmark on any gold purchase.',
        'RBI Sovereign Gold Bonds pay +2.5% yearly bonus interest with zero GST.',
      ],
      te: [
        'నగల తయారీ కూలీ (15%–25%) వృథా ఖర్చు, పెట్టుబడి కాదు.',
        'ఏ బంగారం కొన్నా ఖచ్చితంగా BIS 916 హాల్‌మార్క్ ముద్ర చూసుకోండి.',
        'సావరిన్ గోల్డ్ బాండ్లపై బంగారం పెరుగుదలతో పాటు ఏటా 2.5% బోనస్ వడ్డీ లభిస్తుంది.',
      ],
      hi: [
        'गहनों की मेकिंग चार्ज (15%–25%) शुद्ध खर्चा है, निवेश नहीं।',
        'सोना खरीदते समय बीआईएस (BIS) 916 हॉलमार्क जरूर देखें।',
        'सॉवरेन गोल्ड बॉन्ड में सोने के भाव के साथ 2.5% सालाना अतिरिक्त ब्याज मिलता है।',
      ],
    },
    iconName: 'diamond',
  },
  {
    levelNumber: 30,
    tierId: 5,
    tierName: { en: 'Wealth Growth', te: 'సంపద వృద్ధి', hi: 'धन वृद्धि' },
    title: {
      en: 'What is a Systematic Investment Plan (SIP)?',
      te: 'సిస్టమాటిక్ ఇన్వెస్ట్‌మెంట్ ప్లాన్ (SIP) అంటే ఏమిటి?',
      hi: 'एसआईपी (SIP) क्या है: छोटी मासिक बचत से बड़ा फंड',
    },
    summary: {
      en: 'Invest as little as ₹250 or ₹500 every month in diversified mutual fund baskets.',
      te: 'నెలకు కేవలం ₹250 లేదా ₹500 తో మ్యూచువల్ ఫండ్లలో క్రమబద్ధంగా మదుపు చేయండి.',
      hi: 'हर महीने सिर्फ ₹250 या ₹500 से म्यूचुअल फंड में सुरक्षित निवेश शुरू करें।',
    },
    explanation: {
      en: 'A Systematic Investment Plan (SIP) allows you to invest a small fixed sum—like ₹500 every month—into India’s top companies through professional mutual funds. Instead of trying to guess when share prices go up or down, SIP automatically buys when prices are cheap and when prices are high, averaging out the cost and generating solid long-term wealth.',
      te: 'సిస్టమాటిక్ ఇన్వెస్ట్‌మెంట్ ప్లాన్ (SIP) ద్వారా నెలకు ₹500 చొప్పున దేశంలోని అగ్రశ్రేణి కంపెనీల్లో నిపుణుల ద్వారా మదుపు చేయవచ్చు. మార్కెట్ ఒడిదుడుకులతో సంబంధం లేకుండా క్రమం తప్పకుండా పెట్టుబడి పెట్టడం వల్ల దీర్ఘకాలంలో మంచి లాభాలు లభిస్తాయి.',
      hi: 'एसआईपी (SIP) के जरिए आप हर महीने सिर्फ ₹500 जैसी छोटी रकम से देश की शीर्ष कंपनियों में पेशेवर प्रबंधकों द्वारा निवेश कर सकते हैं। समय के साथ यह छोटी मासिक बचत बढ़कर एक बहुत बड़ा फंड बन जाती है।',
    },
    keyTakeaways: {
      en: [
        'Start with as low as ₹250 or ₹500 per month.',
        'Disciplined auto-debit directly from your bank account.',
        'Averages market price fluctuations automatically.',
      ],
      te: [
        'నెలకు కనీసం ₹250 లేదా ₹500 తో ప్రారంభించవచ్చు.',
        'బ్యాంక్ ఖాతా నుండి ఆటోమేటిక్‌గా క్రమం తప్పకుండా మదుపు అవుతుంది.',
        'మార్కెట్ ధరల హెచ్చుతగ్గుల నష్టాన్ని తగ్గిస్తుంది.',
      ],
      hi: [
        'महीने में सिर्फ ₹250 या ₹500 से शुरू कर सकते हैं।',
        'बैंक खाते से हर महीने तय तारीख पर अपने आप जमा।',
        'बाजार के उतार-चढ़ाव का जोखिम कम करता है।',
      ],
    },
    iconName: 'insights',
  },
  {
    levelNumber: 31,
    tierId: 5,
    tierName: { en: 'Wealth Growth', te: 'సంపద వృద్ధి', hi: 'धन वृद्धि' },
    title: {
      en: 'The Eighth Wonder: Power of Compounding',
      te: 'చక్రవడ్డీ అద్భుత శక్తి (Power of Compounding)',
      hi: 'दुनिया का आठवां अजूबा: चक्रवृद्धि ब्याज की ताकत',
    },
    summary: {
      en: 'See how earning interest on your interest creates explosive exponential wealth over 10-15 years.',
      te: 'వడ్డీ మీద వడ్డీ పెరగడం వల్ల 10-15 ఏళ్లలో చిన్న పొదుపు ఎలా కోట్లు సంపాదిస్తుందో చూడండి.',
      hi: 'ब्याज पर ब्याज मिलने से 10-15 साल में छोटी बचत कैसे विशाल धन बनती है।',
    },
    explanation: {
      en: 'Compounding happens when the interest you earn starts earning interest of its own. If you save ₹1,000 every month for 15 years at 12% return: You deposit a total of ₹1.8 Lakhs, but compounding gives you back more than ₹5 Lakhs! The real magic happens in the final 5 years as the snowball grows huge.',
      te: 'చక్రవడ్డీ అంటే మీరు సంపాదించిన వడ్డీకి కూడా మళ్లీ వడ్డీ రావడం. మీరు నెలకు ₹1,000 చొప్పున 15 ఏళ్ల పాటు 12% రాబడితో మదుపు చేస్తే: మీరు కట్టిన మొత్తం ₹1.8 లక్షలు, కానీ చక్రవడ్డీతో మీ చేతికి వచ్చేది ₹5 లక్షలకు పైగా! ఎంత ఎక్కువ కాలం ఉంచితే అంత ఎక్కువ సంపద సృష్టి జరుగుతుంది.',
      hi: 'चक्रवृद्धि का मतलब है कमाए हुए ब्याज पर भी दोबारा ब्याज मिलना। अगर आप हर महीने ₹1,000 की बचत 15 साल तक 12% पर करते हैं: तो आपकी कुल जमा रकम ₹1.8 लाख होगी, लेकिन चक्रवृद्धि के कारण आपको ₹5 लाख से ज्यादा मिलेंगे! समय जितना लंबा होगा, फायदा उतना ही बड़ा होगा।',
    },
    keyTakeaways: {
      en: [
        'Time in the market is more important than timing the market.',
        '₹1,000/month over 15 years grows from ₹1.8L deposit to ₹5L+.',
        'Start early, even with tiny amounts.',
      ],
      te: [
        'ఎక్కువ కాలం పెట్టుబడిని కొనసాగించడమే అసలైన రహస్యం.',
        'నెలకు ₹1,000 తో 15 ఏళ్లలో ₹1.8 లక్షల డిపాజిట్ ₹5 లక్షలకు పైగా పెరుగుతుంది.',
        'ఎంత చిన్న మొత్తమైనా ఎంత త్వరగా ప్రారంభిస్తే అంత మంచిది.',
      ],
      hi: [
        'जितना लंबा समय देंगे, धन उतना तेजी से बढ़ेगा।',
        '₹1,000 महीने की बचत 15 साल में ₹1.8 लाख से ₹5 लाख+ बन जाती है।',
        'छोटी रकम से भी जितनी जल्दी हो सके शुरुआत करें।',
      ],
    },
    iconName: 'auto-graph',
  },
  {
    levelNumber: 32,
    tierId: 5,
    tierName: { en: 'Wealth Growth', te: 'సంపద వృద్ధి', hi: 'धन वृद्धि' },
    title: {
      en: 'Diversification: Don’t Put All Eggs in One Basket',
      te: 'పెట్టుబడుల విభజన (Diversification)',
      hi: 'निवेश का संतुलन: सारे अंडे एक टोकरी में न रखें',
    },
    summary: {
      en: 'Balance your money across bank FDs, post office schemes, gold, and mutual funds.',
      te: 'డబ్బునంతా ఒకే చోట పెట్టకుండా బ్యాంక్, పోస్టాఫీస్, బంగారం, ఫండ్లలో సమతుల్యంగా విభజించండి.',
      hi: 'पैसे को सिर्फ एक जगह न लगाकर बैंक, डाकघर, सोना और फंड में सुरक्षित बांटें।',
    },
    explanation: {
      en: 'If you carry all 10 eggs in one single basket and drop the basket, every egg breaks. In finance, never put 100% of your savings into just one place—whether it is gold, land, or chits. Keep 40% in safe bank/post office FDs, 30% in gold assets, and 30% in growth funds. If one sector slows down, your other assets keep growing steadily.',
      te: 'అన్ని గుడ్లను ఒకే బుట్టలో పెట్టి ఆ బుట్ట కింద పడితే అన్నీ పగిలిపోతాయి. అలాగే మీ డబ్బునంతా ఒకే చోట (కేవలం బంగారం లేదా కేవలం భూమి) పెట్టకండి. 40% సురక్షితమైన బ్యాంక్/పోస్టాఫీస్ డిపాజిట్లలో, 30% బంగారంలో, 30% గ్రోత్ ఫండ్లలో ఉంచితే ఒకదానిలో రాబడి తగ్గినా మిగిలినవి మీ కుటుంబాన్ని కాపాడతాయి.',
      hi: 'सारे अंडे एक ही टोकरी में रखने पर टोकरी गिरे तो सब फूट जाते हैं। अपनी पूरी बचत किसी एक जगह (केवल जमीन या केवल चिटफंड) में न लगाएं। 40% बैंक/डाकघर में, 30% सोने में और 30% ग्रोथ फंड में रखें ताकि आपका पैसा हमेशा सुरक्षित रहे।',
    },
    keyTakeaways: {
      en: [
        'Split savings: Safe Liquid (40%) + Gold (30%) + Long-Term Growth (30%).',
        'Never invest in schemes that promise to double money in 1 or 2 years.',
        'High return always comes with high risk—stay diversified.',
      ],
      te: [
        'పొదుపు విభజన: సురక్షిత డిపాజిట్లు (40%) + బంగారం (30%) + దీర్ఘకాలిక ఫండ్లు (30%).',
        'ఒకటి రెండేళ్లలో డబ్బు రెట్టింపు చేస్తామనే మోసపూరిత పథకాల్లో ఎప్పుడూ చేరకండి.',
        'అధిక రాబడి హామీ ఇచ్చే వాటిలో ఎక్కువ రిస్క్ ఉంటుంది, జాగ్రత్తగా ఉండండి.',
      ],
      hi: [
        'बचत का बंटवारा: सुरक्षित बैंक जमा (40%) + सोना (30%) + दीर्घकालिक फंड (30%)।',
        '1 या 2 साल में पैसा डबल करने का दावा करने वाली फर्जी योजनाओं से बचें।',
        'पैसे को कई सुरक्षित विकल्पों में बांटकर रखना ही समझदारी है।',
      ],
    },
    iconName: 'category',
  },
  {
    levelNumber: 33,
    tierId: 5,
    tierName: { en: 'Wealth Growth', te: 'సంపద వృద్ధి', hi: 'धन वृद्धि' },
    title: {
      en: 'Milestone 5: Wealth Builder',
      te: 'మైలురాయి 5: సంపద సృష్టికర్త',
      hi: 'पड़ाव 5: धन निर्माण में सफलता',
    },
    summary: {
      en: 'Tier 5 complete: You understand inflation, FDs, gold assets, SIPs, and compounding.',
      te: 'దశ 5 పూర్తి: ద్రవ్యోల్బణం, ఫిక్స్‌డ్ డిపాజిట్, బంగారం బాండ్లు, సిప్ మరియు చక్రవడ్డీలపై మీకు సంపూర్ణ అవగాహన లభించింది.',
      hi: 'स्तर 5 पूर्ण: महंगाई, एफडी, गोल्ड बॉन्ड, एसआईपी और चक्रवृद्धि ब्याज में महारत।',
    },
    explanation: {
      en: 'Tremendous achievement! You have transformed from basic cashflow awareness to a smart investor who understands how inflation eats idle cash, how FDs secure capital, the reality of gold making charges, and the life-changing power of 15-year compounding SIPs. Next, in Tier 6, we explore Insurance and Family Protection!',
      te: 'గొప్ప ఘనత! ద్రవ్యోల్బణం నుండి డబ్బును కాపాడుకోవడం, స్థిరమైన FD రాబడి, బంగారు నగల తరుగు నష్టాలు, మరియు 15 ఏళ్ల చక్రవడ్డీ SIP లద్వారా సంపద సృష్టించే రహస్యాలు మీకు తెలిశాయి. తర్వాతి దశ 6 లో కుటుంబ బీమా భద్రతా పథకాలను నేర్చుకుందాం!',
      hi: 'अद्भुत उपलब्धि! अब आप समझ चुके हैं कि महंगाई से पैसे कैसे बचाएं, एफडी से पक्का ब्याज कैसे पाएं और 15 साल की एसआईपी से चक्रवृद्धि का लाभ कैसे उठाएं। स्तर 6 में हम परिवार की सुरक्षा और बीमा योजनाओं को समझेंगे!',
    },
    keyTakeaways: {
      en: [
        'Tier 5 Complete: Wealth creation engine running.',
        'Compounding is working in your favor.',
        'Proceed to Tier 6: Insurance & Family Protection.',
      ],
      te: [
        'దశ 5 పూర్తి: సంపద వృద్ధి ప్రయాణం ప్రారంభమైంది.',
        'చక్రవడ్డీ శక్తి మీ వైపు పనిచేస్తోంది.',
        'దశ 6: కుటుంబ బీమా రక్షణ వైపు అడుగు వేయండి.',
      ],
      hi: [
        'स्तर 5 पूर्ण: धन निर्माण का रास्ता खुल गया।',
        'चक्रवृद्धि ब्याज की ताकत आपके साथ है।',
        'स्तर 6 की ओर बढ़ें: बीमा और परिवार की सुरक्षा।',
      ],
    },
    iconName: 'workspace-premium',
  },

  // ==========================================
  // TIER 6: INSURANCE & FAMILY PROTECTION (Levels 34-39)
  // ==========================================
  {
    levelNumber: 34,
    tierId: 6,
    tierName: { en: 'Insurance & Safety', te: 'బీమా & భద్రత', hi: 'बीमा और सुरक्षा' },
    title: {
      en: 'Life Insurance Basics: Pure Term Cover',
      te: 'జీవిత బీమా ప్రాథమికాంశాలు: టర్మ్ ఇన్సూరెన్స్',
      hi: 'जीवन बीमा की समझ: टर्म इंश्योरेंस का महत्व',
    },
    summary: {
      en: 'Understand why life insurance protects the family’s future income if the main earner passes away.',
      te: 'కుటుంబ సంపాదకుడు అకాల మరణం చెందితే పిల్లల భవిష్యత్తును కాపాడే టర్మ్ ఇన్సూరెన్స్ ప్రాముఖ్యత.',
      hi: 'परिवार के कमाने वाले को कुछ होने पर बच्चों का भविष्य सुरक्षित रखने वाला जीवन बीमा।',
    },
    explanation: {
      en: 'Life insurance is not an investment; it is income replacement. If the primary earning member of the family passes away suddenly, pure term life insurance pays a large lump sum—like ₹10 Lakhs to ₹25 Lakhs—directly to the nominee, ensuring the family does not fall into debt or extreme poverty.',
      te: 'జీవిత బీమా అనేది లాభాల కోసం కాదు; కుటుంబ ఆదాయానికి రక్షణ కవచం. కుటుంబ ప్రధాన సంపాదకుడు ఆకస్మికంగా మరణిస్తే, టర్మ్ ఇన్సూరెన్స్ ద్వారా నామినీకి ₹10 లక్షల నుండి ₹25 లక్షల వరకు పరిహారం అందుతుంది, తద్వారా కుటుంబం వీధిన పడకుండా పిల్లల చదువు కొనసాగుతుంది.',
      hi: 'जीवन बीमा मुनाफा कमाने के लिए नहीं, परिवार के भरण-पोषण के लिए होता है। अगर घर के कमाने वाले सदस्य की असमय मृत्यु हो जाए, तो टर्म इंश्योरेंस से नॉमिनी को ₹10 से ₹25 लाख की एकमुश्त सहायता मिलती है जिससे परिवार कर्ज या गरीबी में नहीं डूबता।',
    },
    keyTakeaways: {
      en: [
        'Insure the main earning members first.',
        'Term cover provides maximum payout for the lowest annual premium.',
        'Always ensure nominee details are up to date in bank records.',
      ],
      te: [
        'ముందుగా కుటుంబ ప్రధాన సంపాదకుడికి బీమా చేయించండి.',
        'తక్కువ ప్రీమియంతో ఎక్కువ రక్షణ ఇచ్చేదే ప్యూర్ టర్మ్ ఇన్సూరెన్స్.',
        'బ్యాంక్ రికార్డుల్లో నామినీ పేరు సరిగ్గా ఉండేలా చూసుకోండి.',
      ],
      hi: [
        'सबसे पहले घर के मुख्य कमाने वाले का बीमा कराएं।',
        'टर्म प्लान में सबसे कम प्रीमियम पर सबसे ज्यादा सुरक्षा मिलती है।',
        'बैंक रिकॉर्ड में नॉमिनी का नाम हमेशा सही रखें।',
      ],
    },
    iconName: 'health-and-safety',
  },
  {
    levelNumber: 35,
    tierId: 6,
    tierName: { en: 'Insurance & Safety', te: 'బీమా & భద్రత', hi: 'बीमा और सुरक्षा' },
    title: {
      en: 'Health Insurance: Ayushman Bharat & Aarogyasri',
      te: 'ఆరోగ్య బీమా: ఆరోగ్యశ్రీ & ఆయుష్మాన్ భారత్',
      hi: 'स्वास्थ्य बीमा: आयुष्मान भारत और आरोग्यश्री योजना',
    },
    summary: {
      en: 'Access ₹5 Lakh to ₹10 Lakh cashless hospital surgery coverage for your entire family.',
      te: 'కుటుంబం మొత్తానికి ₹5 నుండి ₹10 లక్షల వరకు ఉచిత ఆసుపత్రి శస్త్రచికిత్సల సదుపాయం.',
      hi: 'पूरे परिवार के लिए ₹5 लाख से ₹10 लाख तक का मुफ्त अस्पताल इलाज।',
    },
    explanation: {
      en: 'Medical hospitalization is the #1 reason rural families fall into moneylender debt traps. Government health welfare schemes—like PM Ayushman Bharat (PM-JAY) and state Aarogyasri schemes—provide up to ₹5 to ₹10 Lakhs per year in free cashless treatment at empanelled network hospitals. Keep your Ayushman card active and updated.',
      te: 'గ్రామీణ కుటుంబాలు అప్పుల ఊబిలో పడడానికి అతిపెద్ద కారణం ఆసుపత్రి ఖర్చులు. పీఎం ఆయుష్మాన్ భారత్ (PM-JAY) మరియు రాష్ట్ర ఆరోగ్యశ్రీ పథకాల ద్వారా నెట్‌వర్క్ ఆసుపత్రుల్లో ఏడాదికి ₹5 నుండి ₹10 లక్షల వరకు ఉచిత శస్త్రచికిత్సలు అందుతాయి. మీ ఆరోగ్యశ్రీ/ఆయుష్మాన్ కార్డులను ఎప్పుడూ సిద్ధంగా ఉంచుకోండి.',
      hi: 'ग्रामीण परिवारों के कर्ज में डूबने का सबसे बड़ा कारण अचानक बीमारी और अस्पताल का खर्च है। आयुष्मान भारत (PM-JAY) और राज्य आरोग्यश्री योजना से हर साल ₹5 से ₹10 लाख तक का मुफ्त कैशलेस इलाज मिलता है। अपना आयुष्मान कार्ड हमेशा चालू रखें।',
    },
    keyTakeaways: {
      en: [
        'Provides up to ₹5 Lakh/family/year cashless hospital cover.',
        'Covers surgery, medicine, diagnostic tests, and hospital stay.',
        'Present your PM-JAY / Aarogyasri card at hospital help desk.',
      ],
      te: [
        'ఏడాదికి కుటుంబానికి ₹5 నుండి ₹10 లక్షల వరకు ఉచిత క్యాష్‌లెస్ చికిత్స.',
        'శస్త్రచికిత్సలు, మందులు, పరీక్షలు మరియు బెడ్ చార్జీలు వర్తిస్తాయి.',
        'ఆసుపత్రిలోని ఆరోగ్య మిత్ర హెల్ప్ డెస్క్ వద్ద కార్డును చూపించండి.',
      ],
      hi: [
        'हर साल परिवार को ₹5 लाख तक का मुफ्त अस्पताल इलाज।',
        'ऑपरेशन, दवाई, जांच और भर्ती का पूरा खर्च शामिल।',
        'अस्पताल के हेल्प डेस्क पर आयुष्मान कार्ड दिखाकर इलाज कराएं।',
      ],
    },
    iconName: 'local-hospital',
  },
  {
    levelNumber: 36,
    tierId: 6,
    tierName: { en: 'Insurance & Safety', te: 'బీమా & భద్రత', hi: 'बीमा और सुरक्षा' },
    title: {
      en: 'Government Micro-Insurance: PMJJBY & PMSBY',
      te: 'ప్రభుత్వ మైక్రో-ఇన్సూరెన్స్: PMJJBY & PMSBY',
      hi: 'सरकारी माइक्रो-इंश्योरेंस: PMJJBY और PMSBY मात्र ₹456/वर्ष',
    },
    summary: {
      en: 'Get ₹4 Lakh combined life and accidental cover for just ₹456 per year total.',
      te: 'ఏడాదికి కేవలం ₹456 తో ₹4 లక్షల జీవిత మరియు ప్రమాద బీమా రక్షణ పొందండి.',
      hi: 'साल में सिर्फ ₹456 देकर पाएं पूरे ₹4 लाख का जीवन व दुर्घटना बीमा।',
    },
    explanation: {
      en: 'The Government of India provides two incredible micro-insurance schemes linked to bank savings accounts: 1) PM Jeevan Jyoti Bima Yojana (PMJJBY) gives ₹2 Lakh life cover for ₹436/year. 2) PM Suraksha Bima Yojana (PMSBY) gives ₹2 Lakh accidental disability/death cover for just ₹20/year. For ₹456 a year (~₹1.25/day), your family gets ₹4 Lakhs of total protection.',
      te: 'కేంద్ర ప్రభుత్వం బ్యాంక్ ఖాతాదారుల కోసం రెండు అద్భుతమైన బీమా పథకాలను అందిస్తోంది: 1) పీఎం జీవన్ జ్యోతి బీమా యోజన (PMJJBY): ఏడాదికి ₹436 ప్రీమియంతో ₹2 లక్షల జీవిత బీమా. 2) పీఎం సురక్షా బీమా యోజన (PMSBY): ఏడాదికి కేవలం ₹20 తో ₹2 లక్షల ప్రమాద బీమా. రోజుకు ₹1.25 చొప్పున ఏడాదికి ₹456 తో మొత్తం ₹4 లక్షల రక్షణ లభిస్తుంది.',
      hi: 'भारत सरकार बैंक खाताधारकों को दो शानदार योजनाएं देती है: 1) पीएम जीवन ज्योति बीमा योजना (PMJJBY): ₹436/साल में ₹2 लाख का जीवन बीमा। 2) पीएम सुरक्षा बीमा योजना (PMSBY): मात्र ₹20/साल में ₹2 लाख का दुर्घटना बीमा। कुल ₹456/साल (सवा रुपया रोज) में ₹4 लाख का सुरक्षा कवच!',
    },
    keyTakeaways: {
      en: [
        'PMJJBY: ₹436/yr for ₹2 Lakh Life Cover (Any cause of death).',
        'PMSBY: ₹20/yr for ₹2 Lakh Accidental Death/Disability Cover.',
        'Auto-debited from your bank account every May.',
      ],
      te: [
        'PMJJBY: ఏడాదికి ₹436 తో ₹2 లక్షల జీవిత బీమా.',
        'PMSBY: ఏడాదికి కేవలం ₹20 తో ₹2 లక్షల ప్రమాద బీమా.',
        'ప్రతి మే నెలలో మీ బ్యాంక్ ఖాతా నుండి ఆటోమేటిక్‌గా రెన్యూవల్ అవుతుంది.',
      ],
      hi: [
        'PMJJBY: ₹436/साल में ₹2 लाख का जीवन बीमा।',
        'PMSBY: मात्र ₹20/साल में ₹2 लाख का दुर्घटना बीमा।',
        'हर साल मई के महीने में बैंक खाते से अपने आप रिन्यू होता है।',
      ],
    },
    iconName: 'security',
  },
  {
    levelNumber: 37,
    tierId: 6,
    tierName: { en: 'Insurance & Safety', te: 'బీమా & భద్రత', hi: 'बीमा और सुरक्षा' },
    title: {
      en: 'Crop & Livestock Insurance (PMFBY & Pashu Bima)',
      te: 'పంట మరియు పశువుల బీమా (PMFBY & పశు బీమా)',
      hi: 'फसल और पशु बीमा: आजीविका की सुरक्षा',
    },
    summary: {
      en: 'Protect your farming investments and dairy cattle against drought, flood, and disease.',
      te: 'కరువు, వరదలు లేదా వ్యాధుల వల్ల పంటలు మరియు పాడి పశువులు నష్టపోకుండా రక్షణ పొందండి.',
      hi: 'सूखा, बाढ़ या बीमारी से फसल और दुधारू पशुओं के नुकसान की भरपाई।',
    },
    explanation: {
      en: 'For rural households dependent on agriculture or dairy, the loss of a milch buffalo (worth ₹60,000) or crop failure due to untimely rains can push a family into debt for years. Pradhan Mantri Fasal Bima Yojana (PMFBY) subsidizes crop insurance at 1.5%-2% premium, while Livestock Insurance schemes reimburse 70%-100% of animal market value upon illness or death.',
      te: 'వ్యవసాయం లేదా పాల వ్యాపారంపై ఆధారపడిన రైతు కుటుంబాల్లో పాడి గేదె చనిపోయినా లేదా అకాల వర్షాలతో పంట నష్టపోయినా కోలుకోవడం కష్టమవుతుంది. పీఎం ఫసల్ బీమా యోజన (PMFBY) ద్వారా తక్కువ ప్రీమియంతో పంట నష్టపరిహారం, మరియు పశువుల బీమా ద్వారా గేదె లేదా ఆవు చనిపోతే పూర్తి పరిహారం లభిస్తుంది.',
      hi: 'खेती या दूध के काम में लगी भैंस की अचानक मौत या बेमौसम बारिश से फसल बर्बाद होना परिवार को कर्ज में धकेल देता है। प्रधानमंत्री फसल बीमा योजना (PMFBY) और पशुधन बीमा से बहुत कम प्रीमियम में नुकसान की पूरी भरपाई सरकारी सहायता से होती है।',
    },
    keyTakeaways: {
      en: [
        'PMFBY crop premium: only 1.5% for Rabi, 2% for Kharif.',
        'Tag your dairy cattle with ear tags to claim livestock insurance.',
        'Notify the local agriculture/veterinary officer within 72 hours of damage.',
      ],
      te: [
        'PMFBY పంట ప్రీమియం: రబీకి కేవలం 1.5%, ఖరీఫ్‌కు 2%.',
        'పశువుల బీమా కోసం చెవికి ట్యాగ్ (Ear Tag) తప్పనిసరిగా వేయించండి.',
        'నష్టం జరిగిన 72 గంటల్లోగా స్థానిక వ్యవసాయ/పశువైద్య అధికారికి సమాచారం ఇవ్వండి.',
      ],
      hi: [
        'फसल बीमा प्रीमियम: रबी के लिए मात्र 1.5%, खरीफ के लिए 2%।',
        'पशु बीमा के लिए पशु के कान में सरकारी टैग जरूर लगवाएं।',
        'नुकसान होने के 72 घंटे के अंदर कृषि या पशुपालन अधिकारी को सूचना दें।',
      ],
    },
    iconName: 'agriculture',
  },
  {
    levelNumber: 38,
    tierId: 6,
    tierName: { en: 'Insurance & Safety', te: 'బీమా & భద్రత', hi: 'बीमा और सुरक्षा' },
    title: {
      en: 'Securing the Family Breadwinner',
      te: 'కుటుంబ సంపాదకుడికి పూర్తి రక్షణ కల్పించడం',
      hi: 'घर के मुख्य कमाने वाले की संपूर्ण सुरक्षा',
    },
    summary: {
      en: 'Prioritize insuring the primary wage earner before purchasing children investment policies.',
      te: 'పిల్లల పాలసీల కన్నా ముందుగా ఇంటికి ఆదాయం తెచ్చే సంపాదకుడికి పూర్తి బీమా ఉండేలా చూడండి.',
      hi: 'बच्चों की पॉलिसी से पहले घर के कमाने वाले का पूरा बीमा कराएं।',
    },
    explanation: {
      en: 'A common mistake made by rural families is buying savings insurance policies for small children while the father or mother working in construction or driving an auto has ZERO insurance. If the child falls ill, parents can work to pay medical bills; but if the breadwinner passes away, the entire family’s income stops forever. Always insure the breadwinner first.',
      te: 'చాలామంది చిన్న పిల్లల పేరు మీద పొదుపు పాలసీలు తీసుకుంటారు కానీ ఆటో నడిపే లేదా కూలీ పనులకు వెళ్లే తండ్రికి ఎటువంటి బీమా చేయించరు. సంపాదించే వ్యక్తికి ఏదైనా జరిగితే కుటుంబ ఆదాయం పూర్తిగా ఆగిపోతుంది. కాబట్టి ముందుగా ఇంటి పెద్దకు, సంపాదకుడికి పూర్తి బీమా చేయించడం అత్యంత ముఖ్యం.',
      hi: 'अक्सर लोग छोटे बच्चों के नाम पर बीमा करा लेते हैं लेकिन घर के कमाने वाले का कोई बीमा नहीं होता। अगर कमाने वाले को कुछ हो जाए तो पूरा घर बर्बाद हो जाता है। इसलिए सबसे पहले घर के मुख्य कमाने वाले का बड़ा बीमा होना अनिवार्य है।',
    },
    keyTakeaways: {
      en: [
        'Insure the person who brings home the monthly income.',
        'Target coverage: At least 5 to 10 times the annual household income.',
        'Keep policy receipts in a safe plastic folder known to the family.',
      ],
      te: [
        'కుటుంబానికి ఆదాయం తెచ్చే వ్యక్తికే మొదట బీమా చేయించండి.',
        'కనీసం వార్షిక ఆదాయానికి 5 నుండి 10 రెట్లు బీమా కవరేజ్ ఉండేలా చూసుకోండి.',
        'బీమా బాండ్ పత్రాలను కుటుంబ సభ్యులకు తెలిసేలా సురక్షితంగా భద్రపరచండి.',
      ],
      hi: [
        'जो व्यक्ति घर में कमाई लाता है, सबसे पहले उसका बीमा कराएं।',
        'सालाना आमदनी का कम से कम 5 से 10 गुना बीमा कवर रखें।',
        'बीमा पॉलिसी के कागज घर में सबको बताकर सुरक्षित स्थान पर रखें।',
      ],
    },
    iconName: 'supervisor-account',
  },
  {
    levelNumber: 39,
    tierId: 6,
    tierName: { en: 'Insurance & Safety', te: 'బీమా & భద్రత', hi: 'బీమా మరియు భద్రత' },
    title: {
      en: 'Milestone 6: Shield of Total Resilience',
      te: 'మైలురాయి 6: సంపూర్ణ కుటుంబ రక్షణ కవచం',
      hi: 'पड़ाव 6: संपूर्ण सुरक्षा कवच विजेता',
    },
    summary: {
      en: 'Tier 6 complete: Your family is fully safeguarded with Life, Health, PMJJBY, and Crop/Livestock cover.',
      te: 'దశ 6 పూర్తి: జీవిత, ఆరోగ్య, ప్రమాద మరియు పశు బీమా పథకాలతో మీ కుటుంబానికి రక్షణ లభించింది.',
      hi: 'स्तर 6 पूर्ण: जीवन, स्वास्थ्य, दुर्घटना और आजीविका बीमा से परिवार पूरी तरह सुरक्षित।',
    },
    explanation: {
      en: 'Magnificent achievement! You have built a fortress of protection. With Ayushman health cover, PMJJBY/PMSBY micro-insurance, term cover for the breadwinner, and crop/livestock insurance, no sudden shock can drag your family back into poverty. In Tier 7, we move to Women Entrepreneurship, Business Finance & Lakhpati Didi mastery!',
      te: 'అద్భుతమైన విజయం! మీ కుటుంబానికి పూర్తి రక్షణ కవచం సిద్ధమైంది. ఆయుష్మాన్ ఆరోగ్యశ్రీ, పీఎంజేజేబీవై/పీఎంఎస్‌బీవై, సంపాదకుడికి బీమా, మరియు పశువుల బీమాతో ఏ ఆకస్మిక సంక్షోభం వచ్చినా మీ కుటుంబం ధైర్యంగా నిలబడగలదు. తర్వాతి దశ 7 లో మహిళా వ్యాపారం మరియు లఖ్‌పతి దీదీ ప్రణాళికను నేర్చుకుందాం!',
      hi: 'शानदार उपलब्धि! आपका सुरक्षा किला तैयार है। आयुष्मान भारत, पीएमजेजेबीवाई/पीएमएसबीवाई, जीवन बीमा और पशुधन बीमा से आपका परिवार हर संकट से सुरक्षित है। स्तर 7 में हम महिला उद्यम, व्यापार प्रबंधन और लखपति दीदी योजना सीखेंगे!',
    },
    keyTakeaways: {
      en: [
        'Tier 6 Complete: Multi-layered insurance protection active.',
        'Zero risk of bankruptcy from health or accidents.',
        'Proceed to Tier 7: Women Enterprise & SHG Finance.',
      ],
      te: [
        'దశ 6 పూర్తి: పూర్తిస్థాయి కుటుంబ బీమా రక్షణ సిద్ధం.',
        'ఆసుపత్రి లేదా ప్రమాద ఖర్చుల వల్ల అప్పులపాలయ్యే ప్రమాదం తప్పింది.',
        'దశ 7: మహిళా వ్యాపారం వైపు అడుగు వేయండి.',
      ],
      hi: [
        'स्तर 6 पूर्ण: चौतरफा बीमा सुरक्षा तैयार।',
        'अस्पताल या दुर्घटना के कारण कर्ज में डूबने का खतरा खत्म।',
        'स्तर 7 की ओर बढ़ें: महिला उद्यम और लखपति दीदी।',
      ],
    },
    iconName: 'workspace-premium',
  },

  // ==========================================
  // TIER 7: WOMEN ENTERPRISE & SHG FINANCE (Levels 40-45)
  // ==========================================
  {
    levelNumber: 40,
    tierId: 7,
    tierName: { en: 'Women Enterprise', te: 'మహిళా వ్యాపారం', hi: 'महिला उद्यम' },
    title: {
      en: 'SHG Record Keeping & Internal Lending',
      te: 'సంఘం రికార్డుల నిర్వహణ & అంతర్గత అప్పులు',
      hi: 'समूह का बही-खाता और आंतरिक ऋण प्रबंधन',
    },
    summary: {
      en: 'Maintain transparency in savings, attendance, loan ledgers, and interest collections.',
      te: 'పొదుపు సంఘం మినిట్స్ బుక్, లెడ్జర్ మరియు వడ్డీ వసూళ్లలో పారదర్శకతను పాటించండి.',
      hi: 'समूह की बैठकों, बचत रजिस्टर, ऋण बही और ब्याज वसूली में पूरी पारदर्शिता।',
    },
    explanation: {
      en: 'Strong Self-Help Groups (SHGs) run on five core principles (Panchasutra): 1) Regular weekly meetings, 2) Regular savings, 3) Regular internal lending, 4) Timely loan repayment, and 5) Updated transparent books of accounts. When all members understand the ledger, no money is misappropriated and banks gladly sanction higher loan limits.',
      te: 'బలమైన స్వయం సహాయక సంఘాలు (SHG) పంచసూత్రాలపై నడుస్తాయి: 1) క్రమం తప్పకుండా సమావేశాలు, 2) క్రమం తప్పని పొదుపు, 3) అంతర్గత రుణాలు, 4) సకాలంలో రుణాల రికవరీ, 5) పారదర్శక రికార్డుల నిర్వహణ. అందరు సభ్యులకు లెక్కలు తెలిస్తే నిధులు దుర్వినియోగం కావు మరియు బ్యాంకులు పెద్ద మొత్తంలో రుణాలు మంజూరు చేస్తాయి.',
      hi: 'मजबूत स्वयं सहायता समूह पंचसूत्र पर चलते हैं: 1) नियमित बैठक, 2) नियमित बचत, 3) नियमित आंतरिक ऋण, 4) समय पर ऋण वापसी, और 5) सही बही-खाता। जब सब महिलाएं रजिस्टर समझती हैं तो समूह में विश्वास बढ़ता है और बैंक बड़ा लोन तुरंत देते हैं।',
    },
    keyTakeaways: {
      en: [
        'Follow Panchasutra: Meeting, Savings, Lending, Repayment, Accounts.',
        'Ensure every deposit is entered in individual member passbooks.',
        'Rotate leadership and audit internal loan records annually.',
      ],
      te: [
        'పంచసూత్రాలను ఖచ్చితంగా పాటించండి: సమావేశం, పొదుపు, అప్పు, చెల్లింపు, లెక్కలు.',
        'ప్రతి డిపాజిట్‌ను సభ్యురాలి వ్యక్తిగత పాస్‌బుక్‌లో నమోదు చేయించండి.',
        'వార్షికంగా లెక్కల ఆడిట్ నిర్వహించండి.',
      ],
      hi: [
        'पंचसूत्र का पालन करें: बैठक, बचत, ऋण, वापसी और बही-खाता।',
        'हर सदस्य की पासबुक में जमा राशि तुरंत दर्ज करवाएं।',
        'हर साल समूह के सभी खातों की पारदर्शी जांच करें।',
      ],
    },
    iconName: 'menu-book',
  },
  {
    levelNumber: 41,
    tierId: 7,
    tierName: { en: 'Women Enterprise', te: 'మహిళా వ్యాపారం', hi: 'महिला उद्यम' },
    title: {
      en: 'Calculating Business Profit & Working Capital',
      te: 'చిన్న వ్యాపార లాభనష్టాలు & వర్కింగ్ క్యాపిటల్',
      hi: 'व्यापार का मुनाफा और कार्यशील पूंजी (Working Capital)',
    },
    summary: {
      en: 'Track raw material costs, labor time, transport, and reinvest profits wisely.',
      te: 'ముడిసరుకు, శ్రమ, రవాణా ఖర్చులను లెక్కించి వ్యాపార లాభాలను తిరిగి పెట్టుబడిగా పెట్టండి.',
      hi: 'लागत, मजदूरी और भाड़ा घटाकर असली मुनाफा निकालें और व्यापार बढ़ाएं।',
    },
    explanation: {
      en: 'Working capital is the everyday cash needed to run your small enterprise—buying tailoring cloth, packaging bags, spices, or goat fodder. To find your true profit: Deduct material costs, transport, electricity, and your own fair labor wage from total sales revenue. Reinvest 40% of net profits back into working capital to expand.',
      te: 'వర్కింగ్ క్యాపిటల్ అంటే వ్యాపారం రోజూ నడవడానికి అవసరమయ్యే నగదు—ముడిసరుకు, ప్యాకింగ్, రవాణా ఖర్చులు. నిజమైన లాభం లెక్కించడానికి: అమ్మకాల ఆదాయం నుండి సరుకు ఖర్చులు, రవాణా, మరియు మీ సొంత శ్రమకు కూలీ తీసివేయండి. నికర లాభంలో 40% తిరిగి వ్యాపారంలో పెడితే వ్యాపారం విస్తరిస్తుంది.',
      hi: 'वर्किंग कैपिटल वह रोज का पैसा है जो धंधा चलाने के लिए कच्चा माल, पैकिंग या भाड़े में लगता है। असली मुनाफा निकालने के लिए कुल बिक्री में से लागत और अपनी खुद की मजदूरी घटाएं। मुनाफे का 40% वापस व्यापार में लगाकर धंधा बड़ा करें।',
    },
    keyTakeaways: {
      en: [
        'True Profit = Total Sales - (Materials + Rent + Transport + Self-Labor).',
        'Pay yourself a fixed monthly salary from the business.',
        'Reinvest a portion of profits to buy bulk inventory at wholesale discounts.',
      ],
      te: [
        'నిజమైన లాభం = మొత్తం అమ్మకాలు - (సరుకు + రవాణా + కరెంటు + మీ కూలీ).',
        'వ్యాపారం నుండి మీకు మీరే ఒక స్థిరమైన నెల జీతం నిర్ణయించుకోండి.',
        'లాభంలో కొంత భాగంతో హోల్‌సేల్ సరుకులు కొని ఖర్చు తగ్గించండి.',
      ],
      hi: [
        'असली मुनाफा = कुल बिक्री - (लागत + भाड़ा + बिजली + अपनी मजदूरी)।',
        'व्यापार से अपने लिए एक तय मासिक वेतन निकालें।',
        'मुनाफे का हिस्सा थोक में सस्ता माल खरीदने में लगाएं।',
      ],
    },
    iconName: 'storefront',
  },
  {
    levelNumber: 42,
    tierId: 7,
    tierName: { en: 'Women Enterprise', te: 'మహిళా వ్యాపారం', hi: 'महिला उद्यम' },
    title: {
      en: 'MUDRA & PM SVANidhi Street Vendor Loans',
      te: 'ముద్రా & పీఎం స్వనిధి ప్రభుత్వ వ్యాపార రుణాలు',
      hi: 'मुद्रा (MUDRA) और पीएम स्वनिधि ऋण योजना',
    },
    summary: {
      en: 'Access collateral-free business loans from ₹10,000 up to ₹50,000 without property pledge.',
      te: 'ఎటువంటి ఆస్తి తాకట్టు లేకుండా ₹10,000 నుండి ₹50,000 వరకు వ్యాపార రుణాలు పొందండి.',
      hi: 'बिना कोई संपत्ति गिरवी रखे ₹10,000 से ₹50,000 तक का बिजनेस लोन।',
    },
    explanation: {
      en: 'The government offers two major collateral-free loan schemes for small micro-enterprises: 1) PM SVANidhi gives street vendors and vegetable/tiffin sellers ₹10,000 first, upgrading to ₹20,000 and ₹50,000 upon timely digital repayment with 7% interest subsidy. 2) PM MUDRA (Shishu category) provides up to ₹50,000 for tailoring, beauty parlors, or dairy setups with zero collateral.',
      te: 'చిన్న వ్యాపారాల కోసం ప్రభుత్వం పూచీకత్తు లేని రుణాలు అందిస్తోంది: 1) పీఎం స్వనిధి: చిరువ్యాపారులకు మొదట ₹10,000, సకాలంలో కడితే ₹20,000 మరియు ₹50,000 వరకు 7% వడ్డీ సబ్సిడీతో లభిస్తుంది. 2) పీఎం ముద్రా (శిశు కేటగిరీ): కుట్టు పనులు, బ్యూటీ పార్లర్, పాడి పరిశ్రమలకు ₹50,000 వరకు ఆస్తి తాకట్టు లేకుండా రుణం ఇస్తారు.',
      hi: 'छोटे काम-धंधों के लिए सरकार बिना गारंटी के लोन देती है: 1) पीएम स्वनिधि: रेहड़ी-पटरी और फेरी वालों को ₹10,000, सही भुगतान पर ₹20,000 और ₹50,000 तक 7% ब्याज सब्सिडी के साथ। 2) पीएम मुद्रा (शिशु लोन): सिलाई, ब्यूटी पार्लर या डेयरी के लिए ₹50,000 तक बिना गारंटी का लोन।',
    },
    keyTakeaways: {
      en: [
        'PM SVANidhi: ₹10K $\\rightarrow$ ₹20K $\\rightarrow$ ₹50K with 7% interest cashback.',
        'MUDRA Shishu: Up to ₹50,000 with zero collateral required.',
        'Apply directly through bank branches or Udyam Mitra portal.',
      ],
      te: [
        'పీఎం స్వనిధి: ₹10 వేలు $\\rightarrow$ ₹20 వేలు $\\rightarrow$ ₹50 వేల వరకు 7% వడ్డీ సబ్సిడీ.',
        'ముద్రా శిశు: ₹50,000 వరకు ఎటువంటి ఆస్తి తాకట్టు లేకుండా రుణం.',
        'బ్యాంక్ బ్రాంచ్ లేదా ఉద్యమ్ మిత్ర పోర్టల్ ద్వారా దరఖాస్తు చేసుకోవచ్చు.',
      ],
      hi: [
        'पीएम स्वनिधि: ₹10 हजार $\\rightarrow$ ₹20 हजार $\\rightarrow$ ₹50 हजार (7% ब्याज सब्सिडी)।',
        'मुद्रा शिशु ऋण: ₹50,000 तक बिना किसी गारंटी के बैंक लोन।',
        'नजदीकी बैंक शाखा या उद्यम मित्र पोर्टल से सीधे आवेदन करें।',
      ],
    },
    iconName: 'store',
  },
  {
    levelNumber: 43,
    tierId: 7,
    tierName: { en: 'Women Enterprise', te: 'మహిళా వ్యాపారం', hi: 'महिला उद्यम' },
    title: {
      en: 'The Lakhpati Didi Roadmap: Earning ₹1 Lakh/Year',
      te: 'లఖ్‌పతి దీదీ ప్రణాళిక: ఏటా ₹1 లక్ష స్థిర ఆదాయం',
      hi: 'लखपति दीदी रोडमैप: सालाना ₹1 लाख+ की पक्की कमाई',
    },
    summary: {
      en: 'Learn how to combine 2-3 income streams (agriculture + dairy + tailoring) to reach ₹10,000/month.',
      te: 'వ్యవసాయం, పాడి, కుట్టు పనులను సమన్వయం చేసుకుంటూ నెలకు ₹10,000+ స్థిర ఆదాయాన్ని సాధించండి.',
      hi: 'खेती, पशुपालन और सिलाई जैसे 2-3 कामों को जोड़कर महीने में ₹10,000+ कमाएं।',
    },
    explanation: {
      en: 'The government’s Lakhpati Didi initiative aims to enable every rural SHG woman to earn at least ₹1 Lakh sustainable net income per year (~₹8,500 to ₹10,000 monthly). The secret is multiple diversified livelihood streams: 1) Seasonal crops or vegetables (₹3,000/mo), 2) Dairy milk sales from 2 cows/buffaloes (₹4,000/mo), and 3) Micro-enterprise like tailoring or pickle making (₹3,000/mo).',
      te: 'ప్రభుత్వ "లఖ్‌పతి దీదీ" లక్ష్యం ప్రతి గ్రామీణ మహిళ ఏటా కనీసం ₹1 లక్ష నికర ఆదాయం (నెలకు ₹8,500 నుండి ₹10,000) సంపాదించేలా చేయడం. దీనికి రహస్యం బహుళ ఆదాయ మార్గాలు: 1) కూరగాయలు లేదా పంటలు (నెలకు ₹3,000), 2) పాడి గేదెల పాల అమ్మకం (నెలకు ₹4,000), మరియు 3) కుట్టు లేదా పచ్చళ్ల తయారీ (నెలకు ₹3,000).',
      hi: 'सरकार की "लखपति दीदी" योजना का लक्ष्य हर ग्रामीण महिला की सालाना शुद्ध कमाई ₹1 लाख (महीने का ₹8,500 से ₹10,000) पहुंचाना है। इसका तरीका है 2-3 कामों को एक साथ करना: 1) सब्जी या खेती (₹3,000/माह), 2) 2 दुधारू पशुओं से दूध बिक्री (₹4,000/माह), और 3) सिलाई या आचार का काम (₹3,000/माह)।',
    },
    keyTakeaways: {
      en: [
        'Combine 2 to 3 complementary livelihood activities.',
        'Reduces dependency on single seasonal crop failure.',
        'Target: ₹10,000+ sustainable monthly household surplus.',
      ],
      te: [
        '2 నుండి 3 ఆదాయ మార్గాలను సమన్వయం చేసుకోండి.',
        'ఒక పంట నష్టపోయినా ఇతర వ్యాపారాలు ఆదుకుంటాయి.',
        'లక్ష్యం: నెలకు ₹10,000+ స్థిరమైన కుటుంబ మిగులు ఆదాయం.',
      ],
      hi: [
        '2 से 3 अलग-अलग काम एक साथ मिलाकर करें।',
        'एक काम में मंदी आने पर दूसरा काम सहारा देता है।',
        'लक्ष्य: महीने में ₹10,000+ की पक्की और टिकाऊ आमदनी।',
      ],
    },
    iconName: 'stars',
  },
  {
    levelNumber: 44,
    tierId: 7,
    tierName: { en: 'Women Enterprise', te: 'మహిళా వ్యాపారం', hi: 'महिला उद्यम' },
    title: {
      en: 'Product Pricing & Negotiating Wholesale',
      te: 'సరుకుల సరైన ధరల నిర్ణయం & హోల్‌సేల్ బేరసారాలు',
      hi: 'उत्पादों की सही कीमत और थोक खरीदारी में बचत',
    },
    summary: {
      en: 'Never underprice your handmade goods or sell on indefinite unrecovered credit.',
      te: 'మీ ఉత్పత్తులకు తక్కువ ధర నిర్ణయించవద్దు మరియు వసూలు కాని బాకీలకు సరుకు ఇవ్వకండి.',
      hi: 'अपने सामान को कम दाम में न बेचें और उधारी पर लगाम लगाएं।',
    },
    explanation: {
      en: 'Two biggest reasons women micro-enterprises struggle: 1) Underpricing goods without counting their own hours of hard labor, and 2) Giving too much uncollected credit (udhari) to neighbors. Price your products with a minimum 25%-30% profit margin, and establish a polite "Cash on Delivery" rule for all retail customers.',
      te: 'మహిళా వ్యాపారాలు నష్టపోవడానికి రెండు కారణాలు: 1) తమ శ్రమను లెక్కించకుండా తక్కువ ధర నిర్ణయించడం, 2) చుట్టుపక్కల వారికి ఎక్కువ బాకీలు (ఉద్దెర) ఇవ్వడం. మీ ఉత్పత్తులకు కనీసం 25%-30% లాభం ఉండేలా ధర నిర్ణయించండి మరియు బాకీలు లేకుండా నగదు చెల్లింపులకే ప్రాధాన్యత ఇవ్వండి.',
      hi: 'महिला उद्यमों के नुकसान के दो कारण: 1) अपनी मेहनत की मजदूरी जोड़े बिना सस्ता बेचना, और 2) पड़ोसियों को बहुत ज्यादा उधारी देना। सामान पर कम से कम 25%-30% का सही मुनाफा जोड़ें और नकद भुगतान पर ही जोर दें।',
    },
    keyTakeaways: {
      en: [
        'Always include fair labor wages in your cost sheet.',
        'Restrict customer credit (udhari) strictly to prevent working capital freeze.',
        'Buy packaging and raw materials collectively in SHG groups for bulk discounts.',
      ],
      te: [
        'ఖర్చుల లెక్కలో మీ సొంత శ్రమకు తగిన కూలీని తప్పక కలపండి.',
        'వర్కింగ్ క్యాపిటల్ ఆగకుండా ఉండడానికి బాకీలను పరిమితం చేయండి.',
        'సంఘం సభ్యులతో కలిసి హోల్‌సేల్‌లో ముడిసరుకు కొని ఖర్చు తగ్గించండి.',
      ],
      hi: [
        'सामान की लागत में अपनी मेहनत का मेहनताना जरूर जोड़ें।',
        'उधारी पर नियंत्रण रखें ताकि रोज का काम न रुके।',
        'समूह की महिलाओं के साथ मिलकर थोक में सस्ता कच्चा माल खरीदें।',
      ],
    },
    iconName: 'sell',
  },
  {
    levelNumber: 45,
    tierId: 7,
    tierName: { en: 'Women Enterprise', te: 'మహిళా వ్యాపారం', hi: 'महिला उद्यम' },
    title: {
      en: 'Milestone 7: Village Enterprise Leader',
      te: 'మైలురాయి 7: గ్రామీణ మహిళా వ్యాపార వేత్త',
      hi: 'पड़ाव 7: ग्रामीण महिला उद्यमी',
    },
    summary: {
      en: 'Tier 7 complete: You have mastered SHG finance, profit calculation, MUDRA loans, and Lakhpati Didi roadmaps.',
      te: 'దశ 7 పూర్తి: సంఘం నిర్వహణ, వ్యాపార లాభాలు, ముద్రా రుణాలు, మరియు లఖ్‌పతి దీదీ ప్రణాళికపై పూర్తి ప్రావీణ్యం సాధించారు.',
      hi: 'स्तर 7 पूर्ण: समूह प्रबंधन, मुनाफा गणना, मुद्रा लोन और लखपति दीदी बनने की पूरी तैयारी।',
    },
    explanation: {
      en: 'Incredible achievement! You are now equipped with the business acumen of a true village entrepreneur. You understand working capital, MUDRA and SVANidhi government loans, multiple income streams for the Lakhpati Didi standard, and disciplined pricing. In Tier 8, we explore Government Welfare Schemes and Final Financial Mastery!',
      te: 'అభినందనలు! మీరు విజయవంతమైన గ్రామీణ మహిళా వ్యాపారవేత్తగా ఎదిగారు. వర్కింగ్ క్యాపిటల్, ముద్రా మరియు స్వనిధి రుణాలు, లఖ్‌పతి దీదీ ఆదాయ మార్గాలు, మరియు లాభాల నిర్వహణపై మీకు పూర్తి పట్టు వచ్చింది. చివరి దశ 8 లో ప్రభుత్వ సంక్షేమ పథకాలు మరియు సంపూర్ణ ఆర్థిక స్వావలంబనను సాధిద్దాం!',
      hi: 'अद्भुत उपलब्धि! अब आप एक कुशल ग्रामीण महिला उद्यमी बन चुकी हैं। वर्किंग कैपिटल, मुद्रा व स्वनिधि ऋण, लखपति दीदी के 3 आमदनी स्रोत और सही मूल्य निर्धारण आपके नियंत्रण में हैं। अंतिम स्तर 8 में हम सरकारी योजनाएं और पूर्ण आत्मनिर्भरता सीखेंगे!',
    },
    keyTakeaways: {
      en: [
        'Tier 7 Complete: Entrepreneurial financial engine running.',
        'Roadmap to ₹1 Lakh annual income established.',
        'Proceed to Tier 8: Government Schemes & Long-Term Mastery.',
      ],
      te: [
        'దశ 7 పూర్తి: వ్యాపార ఆర్థిక ప్రణాళిక సిద్ధమైంది.',
        'ఏటా ₹1 లక్ష సంపాదన లక్ష్యానికి మార్గం సుగమం.',
        'దశ 8: ప్రభుత్వ సంక్షేమం & పూర్తి స్వావలంబన వైపు అడుగు వేయండి.',
      ],
      hi: [
        'स्तर 7 पूर्ण: सफल उद्यमी बनने की राह तैयार।',
        'सालाना ₹1 लाख की पक्की आमदनी का लक्ष्य।',
        'स्तर 8 की ओर बढ़ें: सरकारी योजनाएं और पूर्ण वित्तीय स्वतंत्रता।',
      ],
    },
    iconName: 'emoji-events',
  },

  // ==========================================
  // TIER 8: GOVERNMENT SCHEMES & MASTERY (Levels 46-50)
  // ==========================================
  {
    levelNumber: 46,
    tierId: 8,
    tierName: { en: 'Government Schemes', te: 'ప్రభుత్వ సంక్షేమ పథకాలు', hi: 'सरकारी योजनाएं' },
    title: {
      en: 'Sukanya Samriddhi Yojana (SSY) for Daughters',
      te: 'సుకన్య సమృద్ధి యోజన: ఆడపిల్లల బంగారు భవిష్యత్తు',
      hi: 'सुकन्या समृद्धि योजना: बेटियों की उच्च शिक्षा और भविष्य',
    },
    summary: {
      en: 'Open an SSY account for girls under 10 years and earn highest ~8.2% tax-free compound interest.',
      te: '10 ఏళ్ల లోపు ఆడపిల్లల పేరున అత్యధిక ~8.2% పన్ను లేని వడ్డీతో సుకన్య సమృద్ధి ఖాతా ప్రారంభించండి.',
      hi: '10 वर्ष से कम उम्र की बेटी के लिए सबसे ज्यादा 8.2% ब्याज वाली सुकन्या योजना।',
    },
    explanation: {
      en: 'Sukanya Samriddhi Yojana (SSY) is the government’s flagship savings scheme for girls aged 0 to 10 years. You can deposit starting from ₹250 up to ₹1.5 Lakhs per year. It provides the highest government interest rate (~8.2%), 100% tax exemption, and matures when the girl turns 21, ensuring complete funds for college degrees or career launch.',
      te: 'సుకన్య సమృద్ధి యోజన (SSY) 0 నుండి 10 ఏళ్ల లోపు ఆడపిల్లల కోసం ప్రభుత్వం అందించే అత్యుత్తమ పథకం. ఏడాదికి కనీసం ₹250 నుండి గరిష్టంగా ₹1.5 లక్షల వరకు పోస్టాఫీస్ లేదా బ్యాంకుల్లో జమ చేయవచ్చు. అత్యధికంగా ~8.2% వడ్డీ లభిస్తుంది మరియు అమ్మాయికి 21 ఏళ్లు వచ్చేసరికి ఉన్నత చదువులకు పెద్ద మొత్తం చేతికి అందుతుంది.',
      hi: 'सुकन्या समृद्धि योजना 10 साल से कम उम्र की बेटियों के लिए सबसे बेहतरीन सरकारी बचत योजना है। इसमें साल में कम से कम ₹250 से ₹1.5 लाख तक जमा कर सकते हैं। इस पर सबसे ज्यादा ~8.2% ब्याज मिलता है और 21 साल की उम्र में बेटी की उच्च शिक्षा के लिए बड़ा फंड तैयार होता है।',
    },
    keyTakeaways: {
      en: [
        'Open at any Post Office or Bank for daughters under 10 years.',
        'Deposit starting from just ₹250 per year.',
        'Highest government guaranteed ~8.2% compound interest rate.',
      ],
      te: [
        '10 ఏళ్ల లోపు ఆడపిల్లల కోసం ఏ పోస్టాఫీస్ లేదా బ్యాంకులోనైనా తెరవవచ్చు.',
        'ఏడాదికి కేవలం ₹250 తో ప్రారంభించవచ్చు.',
        'అత్యధికంగా ~8.2% ప్రభుత్వ గ్యారెంటీ చక్రవడ్డీ లభిస్తుంది.',
      ],
      hi: [
        '10 साल से कम उम्र की बेटी के लिए किसी भी डाकघर या बैंक में खोलें।',
        'साल में मात्र ₹250 से भी शुरुआत कर सकते हैं।',
        'सबसे ज्यादा ~8.2% सरकारी चक्रवृद्धि ब्याज की गारंटी।',
      ],
    },
    iconName: 'female',
  },
  {
    levelNumber: 47,
    tierId: 8,
    tierName: { en: 'Government Schemes', te: 'ప్రభుత్వ సంక్షేమ పథకాలు', hi: 'सरकारी योजनाएं' },
    title: {
      en: 'Atal Pension Yojana (APY) for Old Age Dignity',
      te: 'అటల్ పెన్షన్ యోజన: వృద్ధాప్యంలో నెలకు ₹1,000-₹5,000 పింఛన్',
      hi: 'अटल पेंशन योजना (APY): बुढ़ापे में ₹1,000 से ₹5,000 की पक्की पेंशन',
    },
    summary: {
      en: 'Secure ₹1,000 to ₹5,000 guaranteed monthly government pension from age 60 for low monthly contributions.',
      te: 'చిన్న వయసు నుండే తక్కువ ప్రీమియంతో 60 ఏళ్ల తర్వాత జీవితాంతం ప్రభుత్వ పింఛన్ పొందండి.',
      hi: 'कम उम्र से छोटी मासिक बचत कर 60 वर्ष के बाद आजीवन मासिक पेंशन पाएं।',
    },
    explanation: {
      en: 'Atal Pension Yojana (APY) is a guaranteed pension scheme for unorganized rural workers aged 18 to 40 years. By contributing a small sum (e.g., ₹210/month if starting at age 18), the government guarantees a lifetime monthly pension of ₹5,000 every single month from age 60 onwards. After your lifetime, the same pension continues to your spouse!',
      te: 'అటల్ పెన్షన్ యోజన (APY) 18 నుండి 40 ఏళ్ల లోపు గ్రామీణ మహిళలు మరియు కార్మికుల కోసం రూపొందించిన అద్భుత పథకం. నెలకు కొద్ది మొత్తం (18 ఏళ్ల వయసులో నెలకు ₹210) జమ చేస్తే, 60 ఏళ్లు దాటిన తర్వాత జీవితాంతం నెలకు ₹5,000 ప్రభుత్వ పింఛన్ గ్యారెంటీగా వస్తుంది. మీ తర్వాత మీ జీవిత భాగస్వామికి కూడా అదే పింఛన్ అందుతుంది!',
      hi: 'अटल पेंशन योजना (APY) 18 से 40 वर्ष की आयु के असंगठित कामगारों के लिए है। हर महीने थोड़ी रकम (जैसे 18 की उम्र में ₹210/माह) जमा करने पर 60 साल की उम्र के बाद जीवनभर ₹5,000 मासिक पेंशन की सरकारी गारंटी मिलती है। आपके बाद यह पेंशन जीवनसाथी को मिलती रहती है।',
    },
    keyTakeaways: {
      en: [
        'Guaranteed monthly pension of ₹1,000, ₹2,000, or ₹5,000 from age 60.',
        'Spouse continues to receive identical pension after subscriber’s death.',
        'Full accumulated pension wealth returned to nominee afterwards.',
      ],
      te: [
        '60 ఏళ్ల తర్వాత నెలకు ₹1,000 నుండి ₹5,000 గ్యారెంటీ పింఛన్.',
        'సభ్యురాలి మరణానంతరం జీవిత భాగస్వామికి అదే పింఛన్ కొనసాగుతుంది.',
        'ఆ తర్వాత నామినీకి మొత్తం కార్పస్ ఫండ్ తిరిగి చెల్లిస్తారు.',
      ],
      hi: [
        '60 वर्ष की उम्र से ₹1,000 से ₹5,000 की पक्की मासिक पेंशन।',
        'ग्राहक के बाद जीवनसाथी को भी वही पूरी पेंशन मिलती रहती है।',
        'अंत में पूरा जमा फंड बच्चों/नॉमिनी को वापस मिल जाता है।',
      ],
    },
    iconName: 'elderly',
  },
  {
    levelNumber: 48,
    tierId: 8,
    tierName: { en: 'Government Schemes', te: 'ప్రభుత్వ సంక్షేమ పథకాలు', hi: 'सरकारी योजनाएं' },
    title: {
      en: 'PM Awas Yojana & Rural Housing Assistance',
      te: 'పీఎం ఆవాస్ యోజన: సొంతింటి నిర్మాణ సహాయం',
      hi: 'प्रधानमंत्री आवास योजना (PMAY): पक्के मकान का सपना',
    },
    summary: {
      en: 'Avail up to ₹1.2 Lakh to ₹1.5 Lakh direct government construction subsidy for pucca houses.',
      te: 'పక్కా ఇంటి నిర్మాణం కోసం ₹1.2 నుండి ₹1.5 లక్షల వరకు ప్రభుత్వ ప్రత్యక్ష సబ్సిడీని పొందండి.',
      hi: 'पक्के मकान के निर्माण के लिए ₹1.2 से ₹1.5 लाख की सरकारी आर्थिक सहायता।',
    },
    explanation: {
      en: 'Under Pradhan Mantri Awas Yojana - Gramin (PMAY-G), eligible rural families without a pucca house receive up to ₹1.20 Lakhs (plain areas) to ₹1.30 Lakhs (hilly areas) directly into their bank account in installments linked to construction stages, plus 90 days of MGNREGA wages and ₹12,000 toilet assistance.',
      te: 'పీఎం ఆవాస్ యోజన గ్రామీణ్ (PMAY-G) కింద పక్కా ఇల్లు లేని అర్హులైన గ్రామీణ కుటుంబాలకు నేరుగా బ్యాంక్ ఖాతాలో ₹1.20 లక్షల నుండి ₹1.30 లక్షల వరకు నిర్మాణ దశల వారీగా జమ చేస్తారు. దీనితో పాటు ఉపాధి హామీ పథకం కింద 90 రోజుల కూలీ మరియు మరుగుదొడ్డి నిర్మాణానికి ₹12,000 అదనపు సాయం అందుతాయి.',
      hi: 'प्रधानमंत्री आवास योजना ग्रामीण (PMAY-G) के तहत कच्चे मकान वाले पात्र परिवारों को ₹1.20 लाख से ₹1.30 लाख सीधे बैंक खाते में किस्तों में दिए जाते हैं। इसके साथ मनरेगा के 90 दिन की मजदूरी और शौचालय के लिए ₹12,000 अलग से मिलते हैं।',
    },
    keyTakeaways: {
      en: [
        'Direct bank transfer linked to geo-tagged building foundation, lintel, and roof stages.',
        'Combined with MGNREGA wage support and Swachh Bharat toilet grant.',
        'Ownership registered jointly in the woman’s name for female empowerment.',
      ],
      te: [
        'నిర్మాణ దశల (పునాది, గోడలు, శ్లాబ్) ఫోటోల ఆధారంగా నేరుగా బ్యాంక్ ఖాతాలో నిధుల జమ.',
        'ఉపాధి హామీ కూలీ మరియు స్వచ్ఛ భారత్ మరుగుదొడ్డి నిధుల సమన్వయం.',
        'మహిళా సాధికారత కోసం ఇంటి పట్టా మహిళ పేరు మీద లేదా ఉమ్మడిగా రిజిస్ట్రేషన్.',
      ],
      hi: [
        'मकान के काम की फोटो (जियो-टैगिंग) के आधार पर सीधे बैंक में किस्तें।',
        'मनरेगा मजदूरी और शौचालय निर्माण की अतिरिक्त राशि का लाभ।',
        'महिला सशक्तिकरण के लिए मकान का पट्टा महिला के नाम पर अनिवार्य।',
      ],
    },
    iconName: 'house',
  },
  {
    levelNumber: 49,
    tierId: 8,
    tierName: { en: 'Government Schemes', te: 'ప్రభుత్వ సంక్షేమ పథకాలు', hi: 'सरकारी योजनाएं' },
    title: {
      en: 'Bank Nominations & Family Financial Wills',
      te: 'బ్యాంక్ నామినేషన్ & కుటుంబ ఆస్తుల వీలునామా',
      hi: 'बैंक नॉमिनेशन और परिवार के लिए संपत्ति का स्पष्ट बंटवारा',
    },
    summary: {
      en: 'Ensure every bank account, FD, insurance, and land title has updated nominee registrations.',
      te: 'ప్రతి బ్యాంక్ ఖాతా, FD, బీమా మరియు భూమి రికార్డుల్లో నామినీ వివరాలను సరిగ్గా నమోదు చేయండి.',
      hi: 'हर बैंक खाते, एफडी, बीमा और जमीन में नॉमिनी का नाम हमेशा अपडेट रखें।',
    },
    explanation: {
      en: 'Tragically, thousands of crores of rupees lie unclaimed in banks because deceased account holders never registered a nominee. Ensure your husband, children, or trusted family member is officially registered as the "Nominee" on every bank account, Post Office deposit, and insurance policy. This prevents painful court battles and ensures your family receives your life savings without hassle.',
      te: 'ఖాతాదారుడు మరణించినప్పుడు నామినీ పేరు లేకపోవడం వల్ల వేల కోట్ల రూపాయలు బ్యాంకుల్లో నిరుపయోగంగా ఉండిపోతున్నాయి. మీ ప్రతి బ్యాంక్ ఖాతా, పోస్టాఫీస్ డిపాజిట్, మరియు బీమా పాలసీలో భర్త లేదా పిల్లల పేరును "నామినీ" గా నమోదు చేయండి. దీనివల్ల కోర్టుల చుట్టూ తిరిగే శ్రమ లేకుండా మీ కష్టార్జితం మీ కుటుంబానికి వెంటనే అందుతుంది.',
      hi: 'बैंकों में हजारों करोड़ रुपये बिना दावे के पड़े हैं क्योंकि लोगों ने खातों में नॉमिनी का नाम नहीं डाला था। अपने हर बैंक खाते, डाकघर जमा और बीमा में पति या बच्चों का नाम नॉमिनी के रूप में जरूर दर्ज कराएं ताकि भविष्य में परिवार को बिना किसी अदालती झंझट के सारा पैसा तुरंत मिल सके।',
    },
    keyTakeaways: {
      en: [
        'Check passbook to verify nominee name is printed on every account.',
        'Update nomination immediately after marriage or child birth.',
        'Keeps family inheritance smooth, dispute-free, and legally protected.',
      ],
      te: [
        'ప్రతి ఖాతా పాస్‌బుక్‌పై నామినీ పేరు ముద్రించబడిందో లేదో సరిచూసుకోండి.',
        'వివాహం లేదా పిల్లలు పుట్టినప్పుడు నామినీ వివరాలను వెంటనే అప్‌డేట్ చేయండి.',
        'కుటుంబ ఆస్తుల బదిలీ ఎటువంటి వివాదాలు లేకుండా సజావుగా జరుగుతుంది.',
      ],
      hi: [
        'पासबुक चेक करें कि हर खाते में नॉमिनी का नाम दर्ज है या नहीं।',
        'शादी या बच्चे के जन्म के बाद नॉमिनी का नाम तुरंत अपडेट करवाएं।',
        'परिवार को बिना किसी विवाद के कानूनी रूप से पूरी जमा पूंजी मिलती है।',
      ],
    },
    iconName: 'assignment-ind',
  },
  {
    levelNumber: 50,
    tierId: 8,
    tierName: { en: 'Government Schemes', te: 'ప్రభుత్వ సంక్షేమ పథకాలు', hi: 'सरकारी योजनाएं' },
    title: {
      en: 'Grand Milestone: Sakhi Certified Financial Leader 🎓',
      te: 'మహా మైలురాయి: సఖి సంపూర్ణ ఆర్థిక స్వావలంబన సాధకురాలు 🎓',
      hi: 'महा पड़ाव: सखी प्रमाणित वित्तीय आत्मनिर्भरता लीडर 🎓',
    },
    summary: {
      en: 'Grand congratulations! You have completed all 50 levels of the Sakhi Financial Learning Journey.',
      te: 'హృదయపూర్వక అభినందనలు! సఖి 50-దశల ఆర్థిక ప్రయాణాన్ని సంపూర్ణంగా పూర్తి చేశారు.',
      hi: 'हार्दिक बधाई! आपने सखी के सभी 50 स्तरों को सफलतापूर्वक पूरा कर लिया है।',
    },
    explanation: {
      en: 'Namaste Leader! You have walked the complete financial roadmap—from basic daily budgeting, 3-month emergency safety shields, and digital UPI safety, through crushing 36% moneylender debt, compounding SIPs, and insurance protection, to women enterprise and government welfare mastery. You are now a certified Sakhi Financial Leader in your village and family. Spread this light of financial confidence to all your sisters and neighbors!',
      te: 'నమస్తే లీడర్! మీరు ప్రాథమిక బడ్జెట్, 3 నెలల రక్షణ నిధి, డిజిటల్ యూపీఐ భద్రత, 36% వడ్డీ అప్పుల విముక్తి, చక్రవడ్డీ SIP పెట్టుబడులు, కుటుంబ బీమా పథకాలు, మహిళా వ్యాపారం మరియు ప్రభుత్వ సంక్షేమ పథకాలపై 50 లెవెల్స్ పూర్తి చేసి సంపూర్ణ ప్రావీణ్యం సాధించారు. మీరు ఇప్పుడు మీ గ్రామంలో మరియు కుటుంబంలో ఒక గొప్ప ఆర్థిక నాయకురాలు. ఈ జ్ఞానాన్ని మీ తోటి మహిళలందరికీ పంచండి!',
      hi: 'नमस्ते लीडर! आपने 50 स्तरों की पूरी वित्तीय यात्रा सफलतापूर्वक तय कर ली है—दैनिक बजट, 3 महीने का सुरक्षा कवच, डिजिटल यूपीआई सुरक्षा, साहूकारी कर्ज से मुक्ति, एसआईपी निवेश, संपूर्ण बीमा, महिला उद्यम और सरकारी योजनाएं। अब आप अपने परिवार और गांव की प्रमाणित वित्तीय लीडर हैं। इस ज्ञान और आत्मविश्वास की रोशनी अपनी सभी बहनों और सहेलियों में फैलाएं!',
    },
    keyTakeaways: {
      en: [
        'All 50 Financial Journey Levels Completed with Distinction.',
        'Empowered with lifelong financial literacy, dignity, and independence.',
        'Replay any level audio explanation anytime from the Journey Map.',
      ],
      te: [
        'సఖి 50 ఆర్థిక ప్రయాణ దశలు విజయవంతంగా పూర్తియ్యాయి.',
        'జీవితకాల ఆర్థిక అక్షరాస్యత, ఆత్మగౌరవం మరియు స్వావలంబన సాధించారు.',
        'ఏ లెవెల్ ఆడియో వివరణనైనా ఎప్పుడైనా మళ్లీ వినవచ్చు.',
      ],
      hi: [
        'सखी के सभी 50 वित्तीय स्तर सफलतापूर्वक पूरे हुए।',
        'आजीवन वित्तीय साक्षरता, सम्मान और आत्मनिर्भरता की प्राप्ति।',
        'किसी भी स्तर का ऑडियो स्पष्टीकरण कभी भी दोबारा सुन सकते हैं।',
      ],
    },
    iconName: 'school',
  },
];
