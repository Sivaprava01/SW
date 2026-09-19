/**
 * 15-Level Core Financial Education Journey Catalog for Sakhi.
 * Structured across 3 progressive tiers from basic cashflow awareness to banking, UPI, and debt freedom.
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
  backendLessonId?: string;
}

export const FINANCIAL_TIERS: { id: number; name: LocalizedString; levelRange: string; color: string }[] = [
  {
    id: 1,
    name: {
      en: 'Tier 1: Money & Cashflow Basics',
      te: 'దశ 1: డబ్బు & దైనందిన నగదు నిర్వహణ',
      hi: 'स्तर 1: आय, खर्च और बजट की बुनियादी समझ',
    },
    levelRange: 'Levels 1–5',
    color: '#9d4300',
  },
  {
    id: 2,
    name: {
      en: 'Tier 2: Savings & Emergency Shield',
      te: 'దశ 2: పొదుపు & రక్షణ కవచం',
      hi: 'स्तर 2: बचत और सुरक्षा कवच',
    },
    levelRange: 'Levels 6–10',
    color: '#b3291b',
  },
  {
    id: 3,
    name: {
      en: 'Tier 3: Banking, UPI & Debt Freedom',
      te: 'దశ 3: బ్యాంకింగ్, యూపీఐ & అప్పుల విముక్తి',
      hi: 'स्तर 3: बैंकिंग, सुरक्षित यूपीआई और कर्ज मुक्ति',
    },
    levelRange: 'Levels 11–15',
    color: '#9d4135',
  },
];

export const JOURNEY_LEVELS: JourneyLevelData[] = [
  // ==========================================
  // TIER 1: MONEY & CASHFLOW BASICS (Levels 1-5)
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
    tierName: { en: 'Money Basics', te: 'డబ్బు ప్రాథమికాంశాలు', hi: 'పैसे की बुनियादी बातें' },
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
    tierName: { en: 'Money Basics', te: 'డబ్బు ప్రాథమికాంశాలు', hi: 'పैसे की बुनियादी बातें' },
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
    tierName: { en: 'Money Basics', te: 'డబ్బు ప్రాథమికాంశాలు', hi: 'పैसे की बुनियादी बातें' },
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
    tierName: { en: 'Money Basics', te: 'డబ్బు ప్రాథమికాంశాలు', hi: 'పैसे की बुनियादी बातें' },
    title: {
      en: 'Milestone 1: The Cashflow Master 🏆',
      te: 'మైలురాయి 1: నగదు నిర్వహణ విజేత 🏆',
      hi: 'पड़ाव 1: बजट और आय-व्यय के विजेता 🏆',
    },
    summary: {
      en: 'Review your complete cashflow mastery and celebrate completing Tier 1.',
      te: 'మొదటి దశ విజయవంతంగా పూర్తి చేసుకున్నందుకు అభినందనలు!',
      hi: 'पहला स्तर सफलतापूर्वक पूरा करने पर बधाई!',
    },
    explanation: {
      en: 'Congratulations on completing Tier 1! You now understand the difference between gross revenue and true net income, the power of keeping needs under 70%, the danger of daily cash leaks, and how to calculate your safe-to-save surplus. You are ready to build your personal Emergency Safety Shield in Tier 2!',
      te: 'మొదటి దశను విజయవంతంగా పూర్తి చేసినందుకు అభినందనలు! నికర ఆదాయం లెక్కించడం, 70/30 సూత్రం, రోజువారీ ఖర్చుల నమోదు మరియు మిగులు గణనపై మీకు స్పష్టత వచ్చింది. ఇప్పుడు దశ 2 లో అత్యవసర రక్షణ నిధి ఏర్పాటును నేర్చుకుందాం!',
      hi: 'पहला स्तर पूरा करने पर हार्दिक बधाई! अब आप शुद्ध आय, 70/30 नियम, दैनिक खर्चों के नियंत्रण और सुरक्षित बचत राशि को समझ चुके हैं। अब हम स्तर 2 में अपना आपातकालीन सुरक्षा कवच बनाएंगे!',
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
  // TIER 2: SAVINGS & EMERGENCY SHIELD (Levels 6-10)
  // ==========================================
  {
    levelNumber: 6,
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
      en: 'Saving is not about having lots of money; it is a habit. Even if your daily income is modest, setting aside ₹20 every day gives you ₹600 a month and over ₹7,000 in a year. When medical or house repair emergencies happen, this money stands like a solid wall protecting your family.',
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
    levelNumber: 7,
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
    levelNumber: 8,
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
    levelNumber: 9,
    tierId: 2,
    tierName: { en: 'Savings & Shield', te: 'పొదుపు & రక్షణ నిధి', hi: 'बचत और सुरक्षा कवच' },
    title: {
      en: 'Recurring Deposits (RD) for Steady Growth',
      te: 'రికరింగ్ డిపాజిట్ (RD) తో క్రమబద్ధమైన పొదుపు',
      hi: 'आवर्ती जमा (RD) से हर महीने पक्की बचत',
    },
    summary: {
      en: 'Lock in monthly savings discipline with a 1-year or 3-year RD account.',
      te: 'నెలకు ₹500 లేదా ₹1,000 చొప్పున స్థిరమైన వడ్డీతో పొదుపు చేయండి.',
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
    levelNumber: 10,
    tierId: 2,
    tierName: { en: 'Savings & Shield', te: 'పొదుపు & రక్షణ నిధి', hi: 'बचत और सुरक्षा कवच' },
    title: {
      en: 'Milestone 2: Safety Shield Activated 🛡️',
      te: 'మైలురాయి 2: కుటుంబ రక్షణ కవచం పూర్తి 🛡️',
      hi: 'पड़ाव 2: सुरक्षा कवच तैयार 🛡️',
    },
    summary: {
      en: 'Tier 2 complete: You are now protected against unforeseen life shocks.',
      te: 'దశ 2 పూర్తి: ఆకస్మిక ఆర్థిక సంక్షోభాల నుండి మీ కుటుంబానికి రక్షణ లభించింది.',
      hi: 'स्तर 2 पूर्ण: आपका परिवार अब आपातकालीन झटकों से सुरक्षित है।',
    },
    explanation: {
      en: 'Wonderful achievement! You now understand the power of micro-savings, the 3-month survival formula, secure Post Office and Bank RD accounts, and mental accounting with Dream Pots. Next, in Tier 3, we master modern Digital Banking, UPI security, and Debt Freedom!',
      te: 'అద్భుతమైన విజయం! రోజూ చిన్న పొదుపు, 3 నెలల రక్షణ నిధి గణన, పోస్టాఫీస్ మరియు బ్యాంకు RD ఖాతాలు, కలల కుండల ప్రయోజనాలపై మీకు పూర్తి అవగాహన వచ్చింది. తర్వాతి దశ 3 లో డిజిటల్ బ్యాంకింగ్, యూపీఐ భద్రత మరియు అప్పుల విముక్తిని నేర్చుకుందాం!',
      hi: 'शानदार उपलब्धि! अब आप छोटी बचत, 3 महीने के सुरक्षा कवच, डाकघर-बैंक आरडी और बचत घड़ों का महत्व समझ चुके हैं। अगले स्तर 3 में हम डिजिटल बैंकिंग, सुरक्षित यूपीआई और कर्ज मुक्ति सीखेंगे!',
    },
    keyTakeaways: {
      en: [
        'Tier 2 Complete: 3-month safety buffer established.',
        'Your family is insulated against private borrowing traps.',
        'Ready for Tier 3: Banking, UPI & Debt Freedom.',
      ],
      te: [
        'దశ 2 పూర్తి: 3 నెలల అత్యవసర రక్షణ కవచం సిద్ధమైంది.',
        'వడ్డీ వ్యాపారుల ఉచ్చులో పడకుండా కుటుంబానికి రక్షణ లభించింది.',
        'దశ 3: డిజిటల్ బ్యాంకింగ్ & అప్పుల విముక్తి వైపు పయనించండి.',
      ],
      hi: [
        'स्तर 2 पूर्ण: 3 महीने का सुरक्षा कवच तैयार।',
        'साहूकारी कर्ज के जाल से परिवार को बचाया जा चुका है।',
        'स्तर 3 के लिए तैयार: बैंकिंग, यूपीआई और कर्ज मुक्ति।',
      ],
    },
    iconName: 'verified',
  },

  // ==========================================
  // TIER 3: BANKING, UPI & DEBT FREEDOM (Levels 11-15)
  // ==========================================
  {
    levelNumber: 11,
    tierId: 3,
    tierName: { en: 'Banking & Debt Freedom', te: 'బ్యాంకింగ్ & అప్పుల విముక్తి', hi: 'बैंकिंग और कर्ज मुक्ति' },
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
    levelNumber: 12,
    tierId: 3,
    tierName: { en: 'Banking & Debt Freedom', te: 'బ్యాంకింగ్ & అప్పుల విముక్తి', hi: 'बैंकिंग और कर्ज मुक्ति' },
    title: {
      en: 'How UPI Works & Spotting OTP Scams',
      te: 'యూపీఐ చెల్లింపుల సూత్రం & ఓటీపీ మోసాల నివారణ',
      hi: 'यूपीआई का नियम और फोन/ओटीपी ठगी से बचाव',
    },
    summary: {
      en: 'Enter PIN ONLY to SEND money, never to receive. Never share SMS OTP with callers.',
      te: 'డబ్బు పంపేటప్పుడు మాత్రమే పిన్ నొక్కాలి. ఫోన్ కాల్స్‌లో ఎవరికీ ఓటీపీ చెప్పవద్దు.',
      hi: 'पिन सिर्फ पैसे भेजने के लिए होता है। फोन पर किसी को भी ओटीपी न बताएं।',
    },
    explanation: {
      en: 'Golden Rule of UPI: You enter your UPI PIN ONLY when YOU are SENDING money from your account. You NEVER need to enter a PIN or share an OTP to receive money or government benefits. Real bank managers, police, and government departments NEVER ask for OTPs or PINs over the phone. If anyone asks, immediately disconnect.',
      te: 'యూపీఐ ముఖ్య సూత్రం: మీరు ఎవరికైనా డబ్బు పంపుతున్నప్పుడు మాత్రమే యూపీఐ పిన్ నొక్కాలి. డబ్బు స్వీకరించడానికి పిన్ ఎప్పటికీ అవసరం లేదు. బ్యాంక్ అధికారులు లేదా ప్రభుత్వ ప్రతినిధులు ఫోన్ లో ఓటీపీ ఎప్పుడూ అడగరు. ఎవరైనా అడిగితే వెంటనే కాల్ కట్ చేయండి.',
      hi: 'यूपीआई का सबसे जरूरी नियम: पिन केवल तभी डाला जाता है जब आप किसी को पैसे भेज रहे हों। पैसे पाने के लिए कभी पिन नहीं डालना होता। कोई भी बैंक मैनेजर फोन पर ओटीपी नहीं मांगता। फोन पर कोड पूछने वालों को तुरंत मना करें।',
    },
    keyTakeaways: {
      en: [
        'PIN is entered ONLY to SEND money.',
        'Never share SMS OTP or ATM PIN on phone calls.',
        'Check recipient name on screen before entering PIN.',
      ],
      te: [
        'డబ్బు పంపేటప్పుడు మాత్రమే పిన్ నొక్కాలి.',
        'ఫోన్ లో ఎవరికీ ఓటీపీ లేదా ఏటీఎం పిన్ చెప్పవద్దు.',
        'డబ్బు పంపే ముందు స్క్రీన్‌పై పేరును సరిచూసుకోండి.',
      ],
      hi: [
        'पिन सिर्फ पैसे भेजने के लिए डाला जाता है।',
        'फोन पर किसी को भी ओटीपी या पिन न बताएं।',
        'पैसे भेजने से पहले स्क्रीन पर नाम जरूर चेक करें।',
      ],
    },
    iconName: 'qr-code-scanner',
  },
  {
    levelNumber: 13,
    tierId: 3,
    tierName: { en: 'Banking & Debt Freedom', te: 'బ్యాంకింగ్ & అప్పుల విముక్తి', hi: 'बैंकिंग और कर्ज मुक्ति' },
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
    levelNumber: 14,
    tierId: 3,
    tierName: { en: 'Banking & Debt Freedom', te: 'బ్యాంకింగ్ & అప్పుల విముక్తి', hi: 'बैंकिंग और कर्ज मुक्ति' },
    title: {
      en: 'Refinancing via SHG Credit & Snowball Payoff',
      te: 'మహిళా సంఘం (SHG) ద్వారా రుణ మార్పిడి & స్నోబాల్ పద్ధతి',
      hi: 'स्वयं सहायता समूह से सस्ता कर्ज और स्నోबॉल तकनीक',
    },
    summary: {
      en: 'Swap 36% moneylender debt for 12% SHG institutional loans and pay off smallest debts first.',
      te: '36% ప్రైవేట్ అప్పును 12% సంఘం రుణం ద్వారా మార్చి స్నోబాల్ పద్ధతిలో వేగంగా తీర్చండి.',
      hi: '36% साहूकारी कर्ज को 12% समूह ऋण से बदलकर छोटे से बड़े क्रम में खत्म करें।',
    },
    explanation: {
      en: 'Talk to your SHG group leader or Village Organization (VO) coordinator. Request a low-cost internal lending loan (12% APR) specifically to pay off the private moneylender completely. Then use the Snowball method: Attack your smallest debts with your spare surplus while paying minimum dues on others. Each cleared loan gives you more cashflow to eliminate the next!',
      te: 'మీ సంఘం లీడర్ లేదా విలేజ్ ఆర్గనైజేషన్ (VO) ప్రతినిధితో మాట్లాడండి. తక్కువ వడ్డీ సంఘం రుణం (12%) తీసుకుని ప్రైవేట్ వడ్డీ వ్యాపారికి అసలు చెల్లించి ప్రామిసరీ నోటును వెనక్కి తీసుకోండి. ఆపై స్నోబాల్ పద్ధతిలో చిన్న అప్పులను ఒక్కొక్కటిగా తీర్చివేస్తూ ఆర్థిక స్వేచ్ఛను సాధించండి.',
      hi: 'अपनी समूह सखी से बात करके 12% ब्याज पर समूह ऋण लें और साहूकार का पूरा कर्ज चुकता करें। फिर स्नोबॉल तकनीक अपनाएं: सबसे छोटे कर्ज को पूरी बचत लगाकर पहले खत्म करें, फिर अगले कर्ज को। इससे कर्ज का बोझ तेजी से खत्म होता है।',
    },
    keyTakeaways: {
      en: [
        'Replace 36% private debt with 12% SHG / Stree Nidhi credit.',
        'Snowball method: Clear smallest debt first to gain momentum.',
        'Collect and destroy all signed blank promissory notes.',
      ],
      te: [
        '36% ప్రైవేట్ అప్పును 12% సంఘం / స్త్రీ నిధి రుణంతో మార్చండి.',
        'స్నోబాల్ పద్ధతి: ముందుగా చిన్న అప్పును పూర్తిగా తీర్చివేయండి.',
        'సంతకం పెట్టిన ప్రామిసరీ నోట్లను తప్పనిసరిగా వెనక్కి తీసుకోండి.',
      ],
      hi: [
        '36% साहूकारी कर्ज को 12% समूह ऋण में बदलें।',
        'स्नोबॉल तकनीक: सबसे छोटे कर्ज को पहले निपटाएं।',
        'हस्ताक्षर किए हुए खाली कागज और प्रॉमिसरी नोट वापस लेकर नष्ट करें।',
      ],
    },
    iconName: 'groups',
    backendLessonId: 'les-3-2-shg-refinance-step',
  },
  {
    levelNumber: 15,
    tierId: 3,
    tierName: { en: 'Banking & Debt Freedom', te: 'బ్యాంకింగ్ & అప్పుల విముక్తి', hi: 'बैंकिंग और कर्ज मुक्ति' },
    title: {
      en: 'Grand Milestone: Sakhi Financial Graduate 🎓',
      te: 'మహా మైలురాయి: సఖి ఆర్థిక పట్టభద్రురాలు 🎓',
      hi: 'महा पड़ाव: सखी वित्तीय आत्मनिर्भरता ग्रेजुएट 🎓',
    },
    summary: {
      en: 'Grand congratulations! You have completed all 15 core levels of the Sakhi Financial Learning Journey.',
      te: 'హృదయపూర్వక అభినందనలు! సఖి 15-దశల ఆర్థిక ప్రయాణాన్ని సంపూర్ణంగా పూర్తి చేశారు.',
      hi: 'हार्दिक बधाई! आपने सखी के सभी 15 स्तरों को सफलतापूर्वक पूरा कर लिया है।',
    },
    explanation: {
      en: 'Namaste Leader! You have walked the complete core financial roadmap—from daily kitchen cashflow budgeting, 3-month emergency safety shields, and digital UPI scam security, through crushing 36% moneylender debt and SHG snowball payoffs. You are now empowered with lifelong financial dignity and self-reliance. Spread this confidence to all your sisters and neighbors!',
      te: 'నమస్తే లీడర్! మీరు ప్రాథమిక బడ్జెట్, 3 నెలల రక్షణ నిధి, డిజిటల్ యూపీఐ భద్రత, 36% వడ్డీ అప్పుల విముక్తి, మరియు సంఘం రుణ మార్పిడిపై 15 లెవెల్స్ పూర్తి చేసి సంపూర్ణ ప్రావీణ్యం సాధించారు. మీరు ఇప్పుడు మీ గ్రామంలో మరియు కుటుంబంలో ఒక గొప్ప ఆర్థిక నాయకురాలు. ఈ జ్ఞానాన్ని మీ తోటి మహిళలందరికీ పంచండి!',
      hi: 'नमस्ते लीडर! आपने 15 स्तरों की पूरी वित्तीय यात्रा सफलतापूर्वक तय कर ली है—दैनिक बजट, 3 महीने का सुरक्षा कवच, डिजिटल यूपीआई सुरक्षा, साहूकारी कर्ज से मुक्ति और समूह ऋण तकनीक। अब आप अपने परिवार और गांव की प्रमाणित वित्तीय लीडर हैं। इस ज्ञान और आत्मविश्वास की रोशनी अपनी सभी बहनों में फैलाएं!',
    },
    keyTakeaways: {
      en: [
        'All 15 Core Financial Journey Levels Completed with Distinction.',
        'Empowered with lifelong financial literacy, dignity, and independence.',
        'Replay any level audio explanation anytime from the Journey Map.',
      ],
      te: [
        'సఖి 15 ఆర్థిక ప్రయాణ దశలు విజయవంతంగా పూర్తియ్యాయి.',
        'జీవితకాల ఆర్థిక అక్షరాస్యత, ఆత్మగౌరవం మరియు స్వావలంబన సాధించారు.',
        'ఏ లెవెల్ ఆడియో వివరణనైనా ఎప్పుడైనా మళ్లీ వినవచ్చు.',
      ],
      hi: [
        'सखी के सभी 15 वित्तीय स्तर सफलतापूर्वक पूरे हुए।',
        'आजीवन वित्तीय साक्षरता, सम्मान और आत्मनिर्भरता की प्राप्ति।',
        'किसी भी स्तर का ऑडियो स्पष्टीकरण कभी भी दोबारा सुन सकते हैं।',
      ],
    },
    iconName: 'school',
  },
];
