/**
 * 15-Level Financial Education Curriculum for Sakhi.
 * Single source of truth for all 15 active learning levels.
 * Each level contains concise, practical financial education with 1 clear paragraph
 * across English, Telugu, and Hindi.
 */

export interface LocalizedString {
  en: string;
  te: string;
  hi: string;
}

export interface LearnLevelData {
  id: string;
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

export const LEARN_TIERS: { id: number; name: LocalizedString; levelRange: string; color: string }[] = [
  {
    id: 1,
    name: {
      en: 'Tier 1: Money & Budgeting Basics',
      te: 'దశ 1: డబ్బు & బడ్జెట్ ప్రాథమిక అంశాలు',
      hi: 'स्तर 1: आय, खर्च और बजट की समझ',
    },
    levelRange: 'Levels 1–5',
    color: '#9d4300',
  },
  {
    id: 2,
    name: {
      en: 'Tier 2: Savings & Safety Shield',
      te: 'దశ 2: పొదుపు & రక్షణ కవచం',
      hi: 'स्तर 2: बचत और सुरक्षा कवच',
    },
    levelRange: 'Levels 6–7',
    color: '#b3291b',
  },
  {
    id: 3,
    name: {
      en: 'Tier 3: Banking & Debt Freedom',
      te: 'దశ 3: బ్యాంకింగ్ & అప్పుల విముక్తి',
      hi: 'स्तर 3: बैंकिंग और कर्जमुक्ति',
    },
    levelRange: 'Levels 8–10',
    color: '#d9534f',
  },
  {
    id: 4,
    name: {
      en: 'Tier 4: Wealth & Family Protection',
      te: 'దశ 4: సంపద సృష్టి & కుటుంబ రక్షణ',
      hi: 'स्तर 4: धन वृद्धि और परिवार सुरक्षा',
    },
    levelRange: 'Levels 11–13',
    color: '#e67e22',
  },
  {
    id: 5,
    name: {
      en: 'Tier 5: Enterprise & Financial Future',
      te: 'దశ 5: మహిళా వ్యాపారం & ఆర్థిక భవిష్యత్తు',
      hi: 'स्तर 5: महिला उद्यम और वित्तीय भविष्य',
    },
    levelRange: 'Levels 14–15',
    color: '#8e44ad',
  },
];

export const LEARN_LEVELS: LearnLevelData[] = [
  // ==========================================
  // TIER 1: MONEY & BUDGETING BASICS (Levels 1–5)
  // ==========================================
  {
    id: 'lvl-1',
    levelNumber: 1,
    tierId: 1,
    tierName: { en: 'Money Basics', te: 'డబ్బు ప్రాథమికాంశాలు', hi: 'पैसे की बुनियादी समझ' },
    title: {
      en: 'Understanding Your Money',
      te: 'మీ డబ్బును అర్థం చేసుకోవడం',
      hi: 'अपने पैसे को समझें',
    },
    summary: {
      en: 'Understand income, expenses, and where your household money goes.',
      te: 'ఆదాయం, ఖర్చులు మరియు ఇంటి డబ్బు ఎక్కడికి వెళ్తుందో తెలుసుకోండి.',
      hi: 'अपनी आय, खर्च और घर के पैसे का सही हिसाब समझें।',
    },
    explanation: {
      en: "Money is a tool to support your family's daily needs and future dreams. Understanding where every rupee comes from and where it goes is the first step toward financial peace. When you clearly separate your total income from your monthly expenses, you can avoid unnecessary debt and make informed choices for your household.",
      te: 'డబ్బు అనేది మీ కుటుంబ అవసరాలు మరియు భవిష్యత్తు కలలను నెరవేర్చే ఒక సాధనం. ప్రతి రూపాయి ఎక్కడి నుంచి వస్తోంది, ఎక్కడికి ఖర్చవుతోంది అని అర్థం చేసుకోవడమే ఆర్థిక ప్రశాంతతకు మొదటి అడుగు. మీ నెలవారీ ఆదాయం మరియు ఖర్చులను స్పష్టంగా తెలుసుకున్నప్పుడు, అనవసరమైన అప్పులు చేయకుండా కుటుంబానికి సరైన నిర్ణయాలు తీసుకోగలరు.',
      hi: 'पैसा आपके परिवार की दैनिक जरूरतों और भविष्य के सपनों को पूरा करने का एक साधन है। हर रुपया कहां से आता है और कहां खर्च होता है, इसे समझना वित्तीय शांति की पहली सीढ़ी है। जब आप अपनी कुल आय और खर्चों का सही हिसाब समझते हैं, तो आप बेवजह के कर्ज से बचकर सही आर्थिक फैसले ले सकते हैं।',
    },
    keyTakeaways: {
      en: [
        'Understand total monthly income and expenses clearly.',
        'Track every rupee to avoid unnecessary borrowing.',
        'Build financial peace through mindful money choices.',
      ],
      te: [
        'నెలవారీ ఆదాయం మరియు ఖర్చులను స్పష్టంగా తెలుసుకోండి.',
        'అనవసర అప్పులను నివారించడానికి ప్రతి రూపాయిని లెక్కించండి.',
        'స్పష్టమైన ఆర్థిక నిర్ణయాలతో మనశ్శాంతిని పొందండి.',
      ],
      hi: [
        'मासिक आय और खर्च को स्पष्ट रूप से समझें।',
        'बेवजह के कर्ज से बचने के लिए हर रुपये का ध्यान रखें।',
        'सही आर्थिक फैसलों से परिवार में वित्तीय शांति लाएं।',
      ],
    },
    iconName: 'account-balance-wallet',
    backendLessonId: 'les-1-1-income-expense',
  },
  {
    id: 'lvl-2',
    levelNumber: 2,
    tierId: 1,
    tierName: { en: 'Money Basics', te: 'డబ్బు ప్రాథమికాంశాలు', hi: 'पैसे की बुनियादी समझ' },
    title: {
      en: 'Know Your Income',
      te: 'మీ ఆదాయ మార్గాలను తెలుసుకోండి',
      hi: 'अपनी आमदनी को पहचानें',
    },
    summary: {
      en: 'Understand regular and irregular sources of income.',
      te: 'స్థిర మరియు హెచ్చుతగ్గులు ఉండే ఆదాయ మార్గాలను అర్థం చేసుకోండి.',
      hi: 'नियमित और मौसमी आमदनी के स्रोतों को पहचानें।',
    },
    explanation: {
      en: 'Household income can be regular, such as monthly wages, or seasonal, such as farming, dairy, or festival sales. Writing down all sources of income helps you calculate your true monthly earning. For irregular earnings, plan around your lowest expected income so you always have enough for essential needs.',
      te: 'కుటుంబ ఆదాయం అనేది నెలవారీ జీతం లాంటి స్థిర ఆదాయం కావచ్చు, లేదా వ్యవసాయం, పాడి, పండుగల వ్యాపారం వంటి కాలానుగుణ ఆదాయం కావచ్చు. మీ అన్ని ఆదాయ మార్గాలను రాసి ఉంచుకోవడం వల్ల అసలైన నెలవారీ సంపాదన తెలుస్తుంది. హెచ్చుతగ్గులు ఉండే ఆదాయం ఉన్నప్పుడు, కనీస సంపాదనను బట్టి ప్రణాళిక వేసుకుంటే నిత్యావసరాలకు ఇబ్బంది కలగదు.',
      hi: 'परिवार की आमदनी नियमित वेतन जैसी हो सकती है या खेती, पशुपालन व मौसमी काम जैसी अनियमित। अपनी आमदनी के सभी स्रोतों को नोट करने से आपकी वास्तविक मासिक कमाई का पता चलता है। अनिश्चित कमाई के समय हमेशा न्यूनतम आमदनी को आधार मानकर योजना बनाएं ताकि जरूरी खर्च कभी न रुकें।',
    },
    keyTakeaways: {
      en: [
        'List all wage, farm, dairy, and business earnings.',
        'Plan around base income during seasonal fluctuation.',
        'Separate gross sales revenue from true net profit.',
      ],
      te: [
        'కూలీ, వ్యవసాయం, పాడి, వ్యాపార ఆదాయాలన్నింటినీ నమోదు చేయండి.',
        'ఆదాయంలో హెచ్చుతగ్గులు ఉన్నప్పుడు కనీస ఆదాయాన్నే ప్రాతిపదికగా తీసుకోండి.',
        'మొత్తం అమ్మకాల నగదును అసలైన నికర లాభం నుండి వేరుగా ఉంచండి.',
      ],
      hi: [
        'मजदूरी, खेती, डेयरी और कारोबार की सारी कमाई लिखें।',
        'उतार-चढ़ाव के समय न्यूनतम आमदनी के अनुसार बजट बनाएं।',
        'दुकान या काम के पैसे को घर के खर्च से अलग रखें।',
      ],
    },
    iconName: 'payments',
    backendLessonId: 'les-1-1-income-sources',
  },
  {
    id: 'lvl-3',
    levelNumber: 3,
    tierId: 1,
    tierName: { en: 'Money Basics', te: 'డబ్బు ప్రాథమికాంశాలు', hi: 'పैसे की बुनियादी समझ' },
    title: {
      en: 'Track Your Expenses',
      te: 'రోజువారీ ఖర్చులను నమోదు చేయండి',
      hi: 'अपने खर्चों का हिसाब रखें',
    },
    summary: {
      en: 'Learn to record daily spending and understand spending patterns.',
      te: 'రోజువారీ ఖర్చులను లెక్కించడం మరియు ఖర్చు విధానాలను గుర్తించడం నేర్చుకోండి.',
      hi: 'दैनिक खर्चों को लिखना सीखें और फिजूलखर्ची पर रोक लगाएं।',
    },
    explanation: {
      en: 'Small daily spending on tea, snacks, or minor impulse buys can add up to thousands of rupees every month. Recording every expense daily in Sakhi or a small notebook brings clarity to where money leaks happen. When you see your real spending habits, saving money becomes much easier.',
      te: 'టీ, చిరుతిండ్లు, లేదా చిన్నచిన్న కొనుగోళ్ల రూపంలో చేసే రోజువారీ ఖర్చులు నెలకు వేల రూపాయలు అవుతాయి. ప్రతి ఖర్చును రోజూ సఖి యాప్‌లో లేదా ఒక చిన్న పుస్తకంలో నమోదు చేయడం వల్ల డబ్బు ఎక్కడ వృథా అవుతోందో తెలుస్తుంది. మీ ఖర్చుల అలవాట్లు కంటికి కనిపించినప్పుడు పొదుపు చేయడం చాలా సులభం అవుతుంది.',
      hi: 'चाय-नाश्ता या रोजमर्रा की छोटी-मोटी खरीदारी मिलकर महीने में हजारों रुपये बन जाती है। हर खर्च को रोजाना सखी ऐप या डायरी में दर्ज करने से पता चलता है कि पैसा कहां बेवजह जा रहा है। जब आप अपने खर्च करने के तरीके को देखते हैं, तो बचत करना बेहद आसान हो जाता है।',
    },
    keyTakeaways: {
      en: [
        'Log small daily spends to uncover hidden financial leaks.',
        'Use Sakhi voice or text notes to record expenses instantly.',
        'Review monthly totals to find areas where you can save.',
      ],
      te: [
        'చిన్న ఖర్చులను కూడా నమోదు చేసి వృథాను అరికట్టండి.',
        'సఖి వాయిస్ లేదా టెక్స్ట్ ద్వారా వెంటనే ఖర్చులను రాయండి.',
        'నెల చివరలో ఖర్చులను సమీక్షించి పొదుపు అవకాశాలను గుర్తించండి.',
      ],
      hi: [
        'छोटे-छोटे खर्चों को दर्ज करके पैसे का रिसाव रोकें।',
        'सखी ऐप में बोलकर या लिखकर तुरंत खर्च दर्ज करें।',
        'महीने के अंत में हिसाब देखकर बचत की योजना बनाएं।',
      ],
    },
    iconName: 'receipt-long',
    backendLessonId: 'les-1-2-expense-tracking',
  },
  {
    id: 'lvl-4',
    levelNumber: 4,
    tierId: 1,
    tierName: { en: 'Money Basics', te: 'డబ్బు ప్రాథమికాంశాలు', hi: 'పैसे की बुनियादी समझ' },
    title: {
      en: 'Needs vs Wants',
      te: 'అవసరాలు vs కోరికలు',
      hi: 'जरूरत बनाम चाहत',
    },
    summary: {
      en: 'Learn to distinguish essential expenses from non-essential spending.',
      te: 'తప్పనిసరి అవసరాలను వాయిదా వేయగల కోరికల నుండి వేరు చేయడం నేర్చుకోండి.',
      hi: 'अनिवार्य जरूरतों और टलने वाली इच्छाओं में अंतर समझें।',
    },
    explanation: {
      en: 'Needs are essentials you cannot live without, such as food, rent, school fees, and medicine. Wants are comfort items like new clothes, entertainment, or expensive gadgets that can wait. Paying for essential needs first before spending on desires prevents financial shortages at the end of the month.',
      te: 'ఆహారం, అద్దె, పిల్లల చదువు, మందుల వంటివి జీవించడానికి తప్పనిసరి అయిన అవసరాలు. కొత్త బట్టలు, వేడుకలు, ఖరీదైన వస్తువులు వంటివి వాయిదా వేయగల కోరికలు. ముందుగా తప్పనిసరి అవసరాలను తీర్చుకున్న తర్వాతే మిగిలిన డబ్బును కోరికల కోసం ఖర్చు చేస్తే నెల చివరలో డబ్బు కొరత రాదు.',
      hi: 'भोजन, मकान किराया, बच्चों की स्कूल फीस और दवाइयां ऐसी चीजें हैं जो जीवन के लिए बेहद जरूरी हैं। नए कपड़े या महंगे शौक ऐसी चाहतें हैं जिन्हें टाला जा सकता है। पहले आवश्यक जरूरतों को पूरा करने के बाद ही बचे हुए पैसे से शौक पूरे करने चाहिए, जिससे महीने के अंत में तंगी न हो।',
    },
    keyTakeaways: {
      en: [
        'Needs: Rations, shelter, health, and children education.',
        'Wants: Impulse purchases and non-essential lifestyle items.',
        'Cover essential needs first before spending on wants.',
      ],
      te: [
        'అవసరాలు: ఆహారం, అద్దె, ఆరోగ్యం, పిల్లల చదువు.',
        'కోరికలు: ఆడంబరాలు, వినోదం, వాయిదా వేయగల వస్తువులు.',
        'ముందుగా అవసరాలను తీర్చిన తర్వాతే కోరికలకు ఖర్చు చేయండి.',
      ],
      hi: [
        'जरूरतें: राशन, घर, दवा और बच्चों की पढ़ाई।',
        'चाहतें: नए शौक, गहने और गैर-जरूरी खरीदारी।',
        'पहले जरूरी काम पूरे करें, फिर बचे पैसे से शौक पूरे करें।',
      ],
    },
    iconName: 'pie-chart',
    backendLessonId: 'les-1-2-need-vs-want',
  },
  {
    id: 'lvl-5',
    levelNumber: 5,
    tierId: 1,
    tierName: { en: 'Money Basics', te: 'డబ్బు ప్రాథమికాంశాలు', hi: 'పैसे की बुनियादी समझ' },
    title: {
      en: 'Build a Simple Budget',
      te: 'సులభమైన బడ్జెట్‌ను రూపొందించండి',
      hi: 'एक सरल बजट बनाएं',
    },
    summary: {
      en: 'Create a practical monthly budget based on income and expenses.',
      te: 'ఆదాయం మరియు ఖర్చుల ఆధారంగా ఆచరణాత్మక నెలవారీ బడ్జెట్‌ను వేయండి.',
      hi: 'अपनी कमाई और खर्च के अनुसार एक व्यावहारिक मासिक बजट बनाएं।',
    },
    explanation: {
      en: 'A monthly budget is a clear spending plan before the month begins. Allocate your income across fixed needs, daily expenses, debt payments, and a small savings target. Sticking to a budget ensures you never spend more than you earn and gives you full control over your money.',
      te: 'నెలకు ఒక బడ్జెట్ వేసుకోవడం అంటే నెల ప్రారంభంలోనే డబ్బును ఎలా ఉపయోగించాలో నిర్ణయించుకోవడం. మీ ఆదాయాన్ని అవసరాలు, రోజువారీ ఖర్చులు, అప్పు వాయిదాలు మరియు చిన్న పొదుపు మొత్తానికి కేటాయించండి. బడ్జెట్ ప్రకారం నడుచుకుంటే ఆదాయం కంటే ఎక్కువ ఖర్చు చేయకుండా ఆర్థిక నియంత్రణ సాధించవచ్చు.',
      hi: 'मासिक बजट का मतलब है महीना शुरू होने से पहले ही पैसे के सही इस्तेमाल की योजना बनाना। अपनी आमदनी को जरूरी खर्च, दैनिक जरूरतों, कर्ज की किस्तों और थोड़ी बचत में बांटें। बजट पर टिके रहने से आप अपनी कमाई से ज्यादा खर्च करने से बचेंगे और पूरा नियंत्रण आपके हाथ में रहेगा।',
    },
    keyTakeaways: {
      en: [
        'Set your monthly spending plan before the month starts.',
        'Ensure total expenses never exceed your net income.',
        'Allocate a small surplus for savings every month.',
      ],
      te: [
        'నెల ప్రారంభంలోనే ఖర్చుల ప్రణాళికను సిద్ధం చేసుకోండి.',
        'మొత్తం ఖర్చులు ఎప్పుడూ ఆదాయాన్ని మించకుండా చూసుకోండి.',
        'ప్రతి నెలా కొంత మిగులు మొత్తాన్ని పొదుపుకు కేటాయించండి.',
      ],
      hi: [
        'महीना शुरू होने से पहले ही खर्च की सीमा तय करें।',
        'ध्यान रखें कि कुल खर्च कभी कमाई से ज्यादा न हो।',
        'हर महीने थोड़ी बचत को बजट में पहली प्राथमिकता दें।',
      ],
    },
    iconName: 'calculate',
    backendLessonId: 'les-1-3-budgeting',
  },

  // ==========================================
  // TIER 2: SAVINGS & SAFETY SHIELD (Levels 6–7)
  // ==========================================
  {
    id: 'lvl-6',
    levelNumber: 6,
    tierId: 2,
    tierName: { en: 'Savings & Shield', te: 'పొదుపు & రక్షణ కవచం', hi: 'बचत और सुरक्षा कवच' },
    title: {
      en: 'Start Saving Regularly',
      te: 'క్రమం తప్పకుండా పొదుపు ప్రారంభించండి',
      hi: 'नियमित बचत शुरू करें',
    },
    summary: {
      en: 'Understand why consistent saving matters and how to build the habit.',
      te: 'నిరంతర పొదుపు ఎందుకు ముఖ్యం మరియు ఆ అలవాటును ఎలా పెంచుకోవాలో తెలుసుకోండి.',
      hi: 'लगातार बचत करने का महत्व समझें और रोजाना बचत की आदत डालें।',
    },
    explanation: {
      en: 'Saving is not what is left over at the end of the month; it is setting aside a small fixed amount the day you earn. Even saving ₹20 or ₹50 daily in a bank account or SHG builds a solid habit. Consistent small savings grow over time into a reliable cushion for your family’s future.',
      te: 'పొదుపు అంటే నెల చివరలో మిగిలింది దాచుకోవడం కాదు; ఆదాయం వచ్చిన రోజే ముందుగా కొంత భాగాన్ని పక్కన పెట్టడం. రోజూ ₹20 లేదా ₹50 బ్యాంకులో లేదా మహిళా సంఘంలో దాచడం మొదలుపెట్టినా గొప్ప అలవాటుగా మారుతుంది. క్రమం తప్పకుండా చేసే చిన్న పొదుపులే కాలక్రమేణా మీ కుటుంబ భవిష్యత్తుకు పెద్ద రక్షణగా నిలుస్తాయి.',
      hi: 'बचत वह नहीं है जो महीने के अंत में बच जाए, बल्कि आमदनी आते ही पहले एक निश्चित हिस्सा अलग रखना है। रोजाना 20 या 50 रुपये बैंक या महिला समूह में बचाना भी एक बेहतरीन आदत है। नियमित रूप से की गई छोटी-छोटी बचत समय के साथ आपके परिवार के लिए एक मजबूत सहारा बन जाती है।',
    },
    keyTakeaways: {
      en: [
        'Save first when you earn, rather than saving what is left.',
        'Even ₹20 to ₹50 daily builds long-term security.',
        'Deposit savings safely in a bank or SHG group.',
      ],
      te: [
        'డబ్బు రాగానే ముందుగా పొదుపు చేసి, మిగిలినది ఖర్చు చేయండి.',
        'రోజూ ₹20 నుండి ₹50 దాచినా దీర్ఘకాలిక భద్రత లభిస్తుంది.',
        'పొదుపు సొమ్మును బ్యాంకు లేదా సంఘం ఖాతాలో భద్రపరచండి.',
      ],
      hi: [
        'कमाई आते ही पहले बचत अलग करें, फिर बाकी खर्च करें।',
        'रोजाना 20 से 50 रुपये बचाना भी बड़ा बदलाव लाता है।',
        'बचत के पैसे को बैंक या महिला समूह में सुरक्षित रखें।',
      ],
    },
    iconName: 'savings',
    backendLessonId: 'les-2-1-saving-regularly',
  },
  {
    id: 'lvl-7',
    levelNumber: 7,
    tierId: 2,
    tierName: { en: 'Savings & Shield', te: 'పొదుపు & రక్షణ కవచం', hi: 'बचत और सुरक्षा कवच' },
    title: {
      en: 'Build an Emergency Fund',
      te: 'అత్యవసర నిధిని ఏర్పాటు చేయండి',
      hi: 'आपातकालीन निधि बनाएं',
    },
    summary: {
      en: 'Understand emergency savings and why unexpected expenses should not become debt.',
      te: 'అత్యవసర నిధి ప్రాముఖ్యత మరియు ఆకస్మిక ఖర్చులు అప్పుగా మారకుండా ఎలా ఆపాలో తెలుసుకోండి.',
      hi: 'आपातकालीन बचत को समझें ताकि अचानक आए खर्च कर्ज न बनें।',
    },
    explanation: {
      en: 'An emergency fund is money kept aside for unexpected expenses such as medical needs, urgent repairs or temporary loss of income. Starting with a small amount and gradually building toward a few months of essential expenses can help you handle emergencies without immediately borrowing money.',
      te: 'ఆకస్మిక అనారోగ్యం, ఇంటి మరమ్మతులు లేదా తాత్కాలిక ఆదాయ నష్టం వంటి అత్యవసర సమయాల కోసం పక్కన పెట్టే డబ్బే అత్యవసర నిధి. నెమ్మదిగా కనీసం 3 నెలల ప్రాథమిక ఖర్చులకు సరిపడా నిధిని సమకూర్చుకుంటే, అత్యవసరాల్లో ఎక్కువ వడ్డీ వ్యాపారుల వద్ద అప్పులు చేయాల్సిన అవసరం రాదు.',
      hi: 'आपातकालीन निधि (इमरजेंसी फंड) वह सुरक्षित पैसा है जो अचानक बीमारी, घर की मरम्मत या काम रुकने पर काम आता है। धीरे-धीरे 3 महीने के जरूरी खर्च के बराबर बचत तैयार कर लेने से मुश्किल वक्त में साहूकारों से भारी ब्याज पर कर्ज लेने की नौबत नहीं आती।',
    },
    keyTakeaways: {
      en: [
        'Keep 3 months of basic living expenses for emergencies.',
        'Store in a liquid bank account for instant access.',
        'Never touch emergency funds for non-urgent wants.',
      ],
      te: [
        'కనీసం 3 నెలల నిత్యావసర ఖర్చులకు సమానమైన నిధిని ఏర్పాటు చేయండి.',
        'వెంటనే తీసుకునేలా బ్యాంకు పొదుపు ఖాతాలో ఉంచండి.',
        'అత్యవసరం కాని ఇతర పనులకు ఈ నిధిని ముట్టకండి.',
      ],
      hi: [
        'कम से कम 3 महीने के खर्च के बराबर आपातकालीन फंड बनाएं।',
        'इस पैसे को बचत बैंक खाते में रखें ताकि तुरंत निकाला जा सके।',
        'बिना किसी वास्तविक आपातकाल के इस पैसे को खर्च न करें।',
      ],
    },
    iconName: 'shield',
    backendLessonId: 'les-2-2-emergency-fund',
  },

  // ==========================================
  // TIER 3: BANKING & DEBT FREEDOM (Levels 8–10)
  // ==========================================
  {
    id: 'lvl-8',
    levelNumber: 8,
    tierId: 3,
    tierName: { en: 'Banking & Debt', te: 'బ్యాంకింగ్ & అప్పుల విముక్తి', hi: 'बैंकिंग और कर्जमुक्ति' },
    title: {
      en: 'Understand Bank Accounts & Digital Payments',
      te: 'బ్యాంక్ ఖాతాలు & డిజిటల్ చెల్లింపుల భద్రత',
      hi: 'बैंक खाते और डिजिटल पेमेंट सुरक्षा',
    },
    summary: {
      en: 'Learn basic banking, ATM/debit card safety, and safe UPI usage.',
      te: 'ప్రాథమిక బ్యాంకింగ్, ఏటీఎం కార్డు భద్రత మరియు సురక్షిత యూపీఐ వినియోగం నేర్చుకోండి.',
      hi: 'बुनियादी बैंकिंग, एटीएम सुरक्षा और सुरक्षित यूपीआई इस्तेमाल सीखें।',
    },
    explanation: {
      en: 'Keeping money in a formal bank account keeps it safe, earns interest, and builds your official financial history. While using UPI and ATM cards for quick transactions, always keep your UPI PIN and OTP strictly secret, and never click unknown links sent on your phone.',
      te: 'బ్యాంకు ఖాతాలో డబ్బు దాచుకోవడం వల్ల భద్రత ఉంటుంది, వడ్డీ వస్తుంది మరియు మీ అధికారిక ఆర్థిక రికార్డు తయారవుతుంది. యూపీఐ (UPI), ఏటీఎం కార్డులు సులభమైన చెల్లింపులకు ఉపయోగపడుతున్నప్పుడు, మీ యూపీఐ పిన్ (PIN), ఓటీపీ (OTP) రహస్యంగా ఉంచాలి మరియు తెలియని లింక్‌లను ఎప్పుడూ నొక్కకూడదు.',
      hi: 'बैंक खाते में पैसा रखने से वह सुरक्षित रहता है, ब्याज मिलता है और आपका वित्तीय रिकॉर्ड बनता है। यूपीआई और एटीएम का इस्तेमाल करते समय अपना यूपीआई पिन (PIN) और ओटीपी (OTP) हमेशा गोपनीय रखें और फोन पर आए किसी भी अनजान लिंक को कभी न खोलें।',
    },
    keyTakeaways: {
      en: [
        'Store savings in a bank account for safety and interest.',
        'Never share your UPI PIN, ATM PIN, or OTP with anyone.',
        'Do not click suspicious SMS or WhatsApp payment links.',
      ],
      te: [
        'భద్రత మరియు వడ్డీ కోసం డబ్బును బ్యాంకు ఖాతాలో దాచండి.',
        'మీ యూపీఐ పిన్, ఏటీఎం పిన్ లేదా ఓటీపీని ఎవరితోనూ పంచుకోకండి.',
        'అనుమానాస్పద లింక్‌లు లేదా సందేశాలను ఎప్పుడూ తెరవకండి.',
      ],
      hi: [
        'सुरक्षा और ब्याज के लिए पैसा हमेशा बैंक खाते में रखें।',
        'अपना यूपीआई पिन, एटीएम पिन या ओटीपी किसी को न बताएं।',
        'फोन पर आए अनजान लिंक या मैसेज पर कभी क्लिक न करें।',
      ],
    },
    iconName: 'account-balance',
    backendLessonId: 'les-3-1-banking-upi',
  },
  {
    id: 'lvl-9',
    levelNumber: 9,
    tierId: 3,
    tierName: { en: 'Banking & Debt', te: 'బ్యాంకింగ్ & అప్పుల విముక్తి', hi: 'बैंकिंग और कर्जमुक्ति' },
    title: {
      en: 'Understand Debt & Interest',
      te: 'అప్పులు & వడ్డీ భారాన్ని అర్థం చేసుకోండి',
      hi: 'कर्ज और ब्याज को समझें',
    },
    summary: {
      en: 'Understand borrowing, interest rates, and the real cost of loans.',
      te: 'అప్పులు, వడ్డీ రేట్లు మరియు రుణాల అసలైన ఖర్చును అర్థం చేసుకోండి.',
      hi: 'उधार, ब्याज दर और कर्ज की वास्तविक लागत को समझें।',
    },
    explanation: {
      en: 'Borrowing money comes at a cost called interest. High-interest loans from informal moneylenders can quickly trap you in a cycle of debt where most of your income goes toward interest alone. Always prioritize low-interest loans from banks, SHGs, or government schemes and know the total repayment amount before borrowing.',
      te: 'రుణం తీసుకోవడానికి చెల్లించే అదనపు ఖర్చే వడ్డీ. ప్రైవేట్ వడ్డీ వ్యాపారుల వద్ద తీసుకునే ఎక్కువ వడ్డీ రుణాలు మీ ఆదాయాన్ని వడ్డీలకే హరించివేస్తాయి. ఎల్లప్పుడూ బ్యాంకులు, స్వయం సహాయక సంఘాలు లేదా ప్రభుత్వ పథకాల ద్వారా తక్కువ వడ్డీ రుణాలకే ప్రాధాన్యత ఇవ్వండి మరియు మొత్తం తిరిగి చెల్లించాల్సిన మొత్తాన్ని ముందుగానే తెలుసుకోండి.',
      hi: 'उधार लिए गए पैसे पर लगने वाला अतिरिक्त शुल्क ब्याज है। साहूकारों से लिया गया महंगे ब्याज का कर्ज आपको ऐसे चक्र में फंसा सकता है जहां आपकी अधिकांश कमाई केवल ब्याज चुकाने में चली जाती है। हमेशा बैंक, महिला समूह या सरकारी योजनाओं से कम ब्याज पर कर्ज लें और कुल वापसी राशि को पहले समझें।',
    },
    keyTakeaways: {
      en: [
        'Avoid high-interest private moneylender loans (36%+ APR).',
        'Choose low-interest SHG, Mudra, or bank credit lines.',
        'Calculate total interest paid before taking any loan.',
      ],
      te: [
        'ఎక్కువ వడ్డీ ప్రైవేట్ వ్యాపారుల అప్పులకు దూరంగా ఉండండి.',
        'మహిళా సంఘం, ముద్ర లేదా బ్యాంక్ తక్కువ వడ్డీ రుణాలను ఎంచుకోండి.',
        'అప్పు తీసుకునే ముందే మొత్తం చెల్లించాల్సిన వడ్డీని లెక్కించండి.',
      ],
      hi: [
        'साहूकारों के महंगे ब्याज (36%+) वाले कर्ज से बचें।',
        'महिला समूह या बैंक से कम ब्याज वाले ऋण को प्राथमिकता दें।',
        'कर्ज लेने से पहले यह जान लें कि कुल कितना ब्याज देना होगा।',
      ],
    },
    iconName: 'trending-down',
    backendLessonId: 'les-4-1-debt-interest',
  },
  {
    id: 'lvl-10',
    levelNumber: 10,
    tierId: 3,
    tierName: { en: 'Banking & Debt', te: 'బ్యాంకింగ్ & అప్పుల విముక్తి', hi: 'बैंकिंग और कर्जमुक्ति' },
    title: {
      en: 'Become Debt-Free',
      te: 'అప్పుల విముక్తి మార్గం',
      hi: 'कर्जमुक्ति की राह',
    },
    summary: {
      en: 'Learn responsible repayment and the basic debt-snowball approach.',
      te: 'బాధ్యతాయుతమైన రుణ చెల్లింపు మరియు స్నోబాల్ పద్ధతిని నేర్చుకోండి.',
      hi: 'जिम्मेदारी से किस्तें चुकाना और स्नोबॉल तरीके से कर्ज खत्म करना सीखें।',
    },
    explanation: {
      en: 'Becoming debt-free requires a disciplined repayment plan. Focus on paying off the loan with the highest interest rate first, or clear the smallest loan first to build confidence (the snowball method). Pay all EMIs on time each month and avoid taking new loans until your existing debt is cleared.',
      te: 'అప్పుల భారం నుంచి బయటపడటానికి క్రమశిక్షణతో కూడిన ప్రణాళిక అవసరం. అత్యధిక వడ్డీ ఉన్న అప్పులను ముందుగా తీర్చడం లేదా చిన్న అప్పులను వరుసగా తీర్చి ఆత్మవిశ్వాసం పెంచుకోవడం (స్నోబాల్ విధానం) ఉత్తమం. ప్రతి నెలా వాయిదాలను సమయానికి చెల్లించండి మరియు పాత అప్పులు తీరేవరకు కొత్త రుణాలు తీసుకోకండి.',
      hi: 'कर्ज से मुक्त होने के लिए एक अनुशासित योजना की जरूरत होती है। सबसे ज्यादा ब्याज वाले कर्ज को पहले चुकाएं या आत्मविश्वास बढ़ाने के लिए सबसे छोटे कर्ज को पहले खत्म करें। हर महीने समय पर किस्तें भरें और जब तक पुराना कर्ज खत्म न हो जाए, तब तक नया कर्ज लेने से बचें।',
    },
    keyTakeaways: {
      en: [
        'Pay off high-interest debts first to save interest money.',
        'Use debt snowball to clear smaller loans and gain momentum.',
        'Never borrow new debt to pay off old personal loans.',
      ],
      te: [
        'వడ్డీ భారం తగ్గించుకోవడానికి ఎక్కువ వడ్డీ ఉన్న అప్పును ముందే తీర్చండి.',
        'చిన్న అప్పులను వరుసగా తీర్చి ఆత్మవిశ్వాసాన్ని పెంచుకోండి.',
        'పాత అప్పులు తీర్చడానికి మళ్లీ కొత్త అప్పులు చేయకండి.',
      ],
      hi: [
        'ब्याज बचाने के लिए सबसे महंगे कर्ज को पहले समाप्त करें।',
        'छोटे कर्जों को एक-एक करके निपटाएं और हिम्मत बढ़ाएं।',
        'पुराना कर्ज चुकाने के लिए नया कर्ज लेने से बचें।',
      ],
    },
    iconName: 'check-circle',
    backendLessonId: 'les-4-2-debt-free',
  },

  // ==========================================
  // TIER 4: WEALTH & FAMILY PROTECTION (Levels 11–13)
  // ==========================================
  {
    id: 'lvl-11',
    levelNumber: 11,
    tierId: 4,
    tierName: { en: 'Wealth & Protection', te: 'సంపద & కుటుంబ రక్షణ', hi: 'धन वृद्धि और परिवार सुरक्षा' },
    title: {
      en: 'Saving vs Investing',
      te: 'పొదుపు vs పెట్టుబడి తేడా',
      hi: 'बचत बनाम निवेश',
    },
    summary: {
      en: 'Understand the difference between saving for safety and investing for long-term growth.',
      te: 'భద్రత కోసం చేసే పొదుపు మరియు దీర్ఘకాలిక వృద్ధి కోసం చేసే పెట్టుబడి తేడాను తెలుసుకోండి.',
      hi: 'सुरक्षा के लिए बचत और भविष्य की तरक्की के लिए निवेश का अंतर समझें।',
    },
    explanation: {
      en: 'Saving is storing money safely in a bank or post office for short-term needs and emergencies. Investing is putting money into productive assets like government savings certificates, gold, or business expansion to earn returns and beat rising prices over the long term.',
      te: 'స్వల్పకాలిక అవసరాలు మరియు అత్యవసరాల కోసం బ్యాంకు లేదా పోస్టాఫీసులో డబ్బును సురక్షితంగా దాచుకోవడం పొదుపు. భవిష్యత్తులో ధరల పెరుగుదలను తట్టుకుని ఎక్కువ రాబడి పొందడానికి ప్రభుత్వ పొదుపు పథకాలు, బంగారం లేదా వ్యాపార విస్తరణలో డబ్బు పెట్టడం పెట్టుబడి.',
      hi: 'छोटी अवधि की जरूरतों और आपातकाल के लिए बैंक या डाकघर में सुरक्षित पैसा रखना बचत है। भविष्य में महंगाई को मात देकर बेहतर रिटर्न पाने के लिए सरकारी योजनाओं, सोने या व्यापार बढ़ाने में पैसा लगाना निवेश कहलाता है।',
    },
    keyTakeaways: {
      en: [
        'Saving protects money for immediate needs and emergencies.',
        'Investing grows wealth to beat inflation over time.',
        'Use government schemes like Post Office RD, PPF, or Gold bonds.',
      ],
      te: [
        'తక్షణ అవసరాలు మరియు అత్యవసరాల కోసం పొదుపు రక్షణగా నిలుస్తుంది.',
        'ధరల పెరుగుదలను అధిగమించడానికి దీర్ఘకాలిక పెట్టుబడులు అవసరం.',
        'పోస్టాఫీస్ ఆర్డీ, పీపీఎఫ్ వంటి నమ్మకమైన పథకాలను ఉపయోగించండి.',
      ],
      hi: [
        'बचत तुरंत जरूरत और आपातकाल में काम आती है।',
        'निवेश भविष्य में महंगाई को हराकर पैसा बढ़ाता है।',
        'डाकघर आरडी या सरकारी बचत योजनाओं में निवेश करें।',
      ],
    },
    iconName: 'show-chart',
    backendLessonId: 'les-5-1-saving-vs-investing',
  },
  {
    id: 'lvl-12',
    levelNumber: 12,
    tierId: 4,
    tierName: { en: 'Wealth & Protection', te: 'సంపద & కుటుంబ రక్షణ', hi: 'धन वृद्धि और परिवार सुरक्षा' },
    title: {
      en: 'Understand Compounding',
      te: 'చక్రవడ్డీ అద్భుత శక్తి',
      hi: 'चक्रवृद्धि ब्याज का जादू',
    },
    summary: {
      en: 'Learn how money can grow exponentially over time through compounding.',
      te: 'చక్రవడ్డీ ద్వారా కాలక్రమేణా మీ డబ్బు ఎలా బహుళ రెట్లు పెరుగుతుందో తెలుసుకోండి.',
      hi: 'चक्रवृद्धि ब्याज से समय के साथ पैसे की तेज बढ़ोतरी को समझें।',
    },
    explanation: {
      en: 'Compounding means earning interest not just on your initial money, but also on the accumulated interest earned over time. When you invest money for many years without withdrawing the gains, your wealth multiplies exponentially. Starting early, even with small monthly sums, creates substantial long-term wealth.',
      te: 'చక్రవడ్డీ అంటే మీరు దాచిన అసలు మీద మాత్రమే కాకుండా, వచ్చిన వడ్డీ మీద కూడా మళ్లీ వడ్డీ రావడం. సంపాదించిన రాబడిని తీయకుండా ఎక్కువ కాలం కొనసాగిస్తే, మీ డబ్బు వేగంగా పెరుగుతుంది. చిన్న మొత్తంతో అయినా చిన్న వయసులోనే పెట్టుబడి ప్రారంభించడం వల్ల దీర్ఘకాలంలో పెద్ద సంపద సమకూరుతుంది.',
      hi: 'चक्रवृद्धि ब्याज (कंपाउंडिंग) का मतलब है केवल मूलधन पर ही नहीं, बल्कि कमाए गए ब्याज पर भी ब्याज मिलना। जब आप कई सालों तक पैसा जमा रखते हैं, तो आपका धन तेजी से बढ़ता है। छोटी रकम से भी जल्दी शुरुआत करना भविष्य में एक बड़ा फंड तैयार कर देता है।',
    },
    keyTakeaways: {
      en: [
        'Compounding earns interest on previously earned interest.',
        'Time in the market is more powerful than the initial amount.',
        'Reinvest returns rather than spending them early.',
      ],
      te: [
        'చక్రవడ్డీలో అసలుతో పాటు వచ్చిన వడ్డీ మీద కూడా లాభం లభిస్తుంది.',
        'పెట్టుబడి కాలం ఎంత ఎక్కువ ఉంటే సంపద అంత వేగంగా పెరుగుతుంది.',
        'వచ్చిన రాబడిని మధ్యలోనే ఖర్చు చేయకుండా కొనసాగించండి.',
      ],
      hi: [
        'चक्रवृद्धि में कमाए गए ब्याज पर भी नया ब्याज मिलता है।',
        'जितने लंबे समय तक निवेश रहेगा, उतना बड़ा लाभ होगा।',
        'कमाए गए मुनाफे को बीच में निकालने के बजाय जमा रहने दें।',
      ],
    },
    iconName: 'auto-graph',
    backendLessonId: 'les-5-2-compounding',
  },
  {
    id: 'lvl-13',
    levelNumber: 13,
    tierId: 4,
    tierName: { en: 'Wealth & Protection', te: 'సంపద & కుటుంబ రక్షణ', hi: 'धन वृद्धि और परिवार सुरक्षा' },
    title: {
      en: 'Protect Your Family',
      te: 'బీమాతో కుటుంబానికి రక్షణ',
      hi: 'बीमा से परिवार की सुरक्षा',
    },
    summary: {
      en: 'Understand the basic role of insurance and financial protection for your family.',
      te: 'కుటుంబ ఆర్థిక భద్రతలో బీమా రక్షణ ప్రాముఖ్యతను అర్థం చేసుకోండి.',
      hi: 'परिवार की आर्थिक सुरक्षा में सरकारी बीमा योजनाओं का महत्व समझें।',
    },
    explanation: {
      en: 'Unexpected sickness, accidents, or loss of an earning member can instantly wipe out years of hard-earned savings. Affordable government insurance schemes like PMJJBY (life insurance), PMSBY (accident cover), and Ayushman Bharat (health cover) provide a crucial financial safety net for your loved ones for just a few rupees a year.',
      te: 'ఆకస్మిక అనారోగ్యం, ప్రమాదాలు లేదా కుటుంబ సంపాదించే వ్యక్తికి ఏదైనా జరిగితే ఎన్నో ఏళ్ల కష్టార్జితం ఒక్కసారిగా కరిగిపోతుంది. పీఎంజేజేబీవై (జీవిత బీమా), పీఎంఎస్‌బీవై (ప్రమాద బీమా), ఆయుష్మాన్ భారత్ (ఆరోగ్య బీమా) వంటి ప్రభుత్వ పథకాలు ఏడాదికి కొద్ది రూపాయల ఖర్చుతోనే కుటుంబానికి పటిష్టమైన ఆర్థిక రక్షణ కల్పిస్తాయి.',
      hi: 'अचानक बीमारी, दुर्घटना या घर के कमाऊ सदस्य के साथ अनहोनी होने पर वर्षों की बचत एक झटके में खत्म हो सकती है। पीएम सुरक्षा बीमा, पीएम जीवन ज्योति और आयुष्मान भारत जैसी सस्ती सरकारी बीमा योजनाएं बहुत कम खर्च में आपके परिवार को बड़ा सुरक्षा कवच देती हैं।',
    },
    keyTakeaways: {
      en: [
        'Enroll in PMJJBY (Life) & PMSBY (Accident) for nominal yearly fee.',
        'Use Ayushman Bharat health card to cover hospital treatments.',
        'Ensure bank account has active nominee registration.',
      ],
      te: [
        'పీఎంజేజేబీవై (జీవిత బీమా), పీఎంఎస్‌బీవై (ప్రమాద బీమా) నమోదు చేసుకోండి.',
        'ఆసుపత్రి ఖర్చుల కోసం ఆయుష్మాన్ భారత్ కార్డును వినియోగించండి.',
        'బ్యాంకు ఖాతాలో నామినీ పేరు ఖచ్చితంగా నమోదు చేయించండి.',
      ],
      hi: [
        'सालाना मामूली शुल्क पर पीएम जीवन ज्योति और सुरक्षा बीमा लें।',
        'अस्पताल के खर्चों के लिए आयुष्मान भारत कार्ड का उपयोग करें।',
        'बैंक खाते में नॉमिनी का नाम हमेशा अपडेट रखें।',
      ],
    },
    iconName: 'health-and-safety',
    backendLessonId: 'les-6-1-family-insurance',
  },

  // ==========================================
  // TIER 5: ENTERPRISE & FINANCIAL FUTURE (Levels 14–15)
  // ==========================================
  {
    id: 'lvl-14',
    levelNumber: 14,
    tierId: 5,
    tierName: { en: 'Enterprise & Future', te: 'మహిళా వ్యాపారం & భవిష్యత్తు', hi: 'महिला उद्यम और वित्तीय भविष्य' },
    title: {
      en: 'Grow Through Business & SHGs',
      te: 'స్వయం సహాయక సంఘాలు & వ్యాపార వృద్ధి',
      hi: 'महिला समूह और व्यापार में तरक्की',
    },
    summary: {
      en: 'Understand basic business finances, SHG finance, income, expenses, and working capital.',
      te: 'మహిళా సంఘాలు, వ్యాపార ఆదాయ-వ్యయాలు మరియు వర్కింగ్ క్యాపిటల్ నిర్వహణ తెలుసుకోండి.',
      hi: 'महिला समूह, कार्यशील पूंजी और व्यापार के आय-व्यय की समझ बढ़ाएं।',
    },
    explanation: {
      en: 'Self Help Groups (SHGs) empower women through collective savings, low-cost internal lending, and access to bank enterprise loans. By understanding working capital, pricing your products wisely, and keeping business money separate from household expenses, you can grow a sustainable small business and achieve financial independence.',
      te: 'మహిళా స్వయం సహాయక సంఘాలు (SHG) సామూహిక పొదుపు, తక్కువ వడ్డీ రుణాలు మరియు బ్యాంక్ లింకేజ్ ద్వారా మహిళలకు ఆర్థిక శక్తినిస్తాయి. వ్యాపార ఖర్చులు, సరైన ధర నిర్ణయం మరియు వ్యాపార ఆదాయాన్ని ఇంటి ఖర్చులతో కలపకుండా ప్రత్యేకంగా ఉంచడం ద్వారా చిన్న వ్యాపారాలను విజయవంతంగా విస్తరించి ఆర్థిక స్వావలంబన పొందవచ్చు.',
      hi: 'स्वयं सहायता समूह (SHG) सामूहिक बचत, कम ब्याज पर ऋण और बैंक योजनाओं के जरिए महिलाओं को आत्मनिर्भर बनाते हैं। कार्यशील पूंजी को समझकर, उत्पादों का सही दाम तय करके और व्यापार के पैसे को घर के खर्च से अलग रखकर आप अपने व्यवसाय को सफलतापूर्वक आगे बढ़ा सकती हैं।',
    },
    keyTakeaways: {
      en: [
        'Utilize SHG collective savings and low-cost credit for business.',
        'Keep separate books for enterprise revenue and kitchen expenses.',
        'Reinvest profits into working capital to scale your business.',
      ],
      te: [
        'వ్యాపార విస్తరణ కోసం మహిళా సంఘం పొదుపు మరియు రుణాలను ఉపయోగించండి.',
        'వ్యాపార లెక్కలను ఇంటి ఖర్చులతో కలపకుండా విడిగా నమోదు చేయండి.',
        'వచ్చిన లాభాలను తిరిగి వ్యాపారంలో పెట్టి ఆదాయాన్ని పెంచుకోండి.',
      ],
      hi: [
        'व्यापार बढ़ाने के लिए समूह की कम ब्याज वाली योजनाओं का लाभ लें।',
        'काम के पैसों का हिसाब घर के खर्चों से हमेशा अलग रखें।',
        'मुनाफे को दोबारा व्यापार में लगाकर आमदनी बढ़ाएं।',
      ],
    },
    iconName: 'groups',
    backendLessonId: 'les-7-1-shg-business',
  },
  {
    id: 'lvl-15',
    levelNumber: 15,
    tierId: 5,
    tierName: { en: 'Enterprise & Future', te: 'మహిళా వ్యాపారం & భవిష్యత్తు', hi: 'महिला उद्यम और वित्तीय भविष्य' },
    title: {
      en: 'Build Your Financial Future',
      te: 'సంపూర్ణ ఆర్థిక భవిష్యత్తు నిర్మాణం',
      hi: 'एक मजबूत वित्तीय भविष्य का निर्माण',
    },
    summary: {
      en: 'Bring budgeting, saving, debt management, protection, and long-term planning together.',
      te: 'బడ్జెట్, పొదుపు, అప్పుల విముక్తి, బీమా మరియు దీర్ఘకాలిక లక్ష్యాలను సమన్వయం చేసుకోండి.',
      hi: 'बजट, बचत, कर्जमुक्ति, बीमा और भविष्य की योजना को एक साथ जोड़ें।',
    },
    explanation: {
      en: 'True financial freedom brings together budgeting, consistent saving, debt elimination, family insurance, and goal-based investing. By reviewing your money plan regularly with Sakhi and setting clear milestones for education, home, and retirement, you take complete control of your family’s prosperous future.',
      te: 'సరైన బడ్జెట్, నిరంతర పొదుపు, అప్పుల విముక్తి, కుటుంబ బీమా మరియు లక్ష్య ఆధారిత పెట్టుబడుల కలయికే నిజమైన ఆర్థిక స్వాతంత్ర్యం. సఖి యాప్ సహాయంతో మీ ఆర్థిక ప్రణాళికను క్రమం తప్పకుండా సమీక్షించుకుంటూ పిల్లల చదువు, సొంత ఇల్లు మరియు వృద్ధాప్య భద్రత దిశగా ముందడుగు వేసి ఉజ్వల భవిష్యత్తును నిర్మించుకోండి.',
      hi: 'सही बजट, नियमित बचत, कर्जमुक्ति, परिवार का बीमा और लक्ष्य-आधारित निवेश मिलकर ही सच्ची वित्तीय स्वतंत्रता बनाते हैं। सखी ऐप के साथ समय-समय पर अपने आर्थिक लक्ष्यों की समीक्षा करें और बच्चों की शिक्षा, घर व सुरक्षित भविष्य के लिए आत्मविश्वास से आगे बढ़ें।',
    },
    keyTakeaways: {
      en: [
        'Combine budgeting, savings, debt freedom, and family insurance.',
        'Review your household money health monthly with Sakhi.',
        'Achieve complete financial independence and dignity for your family.',
      ],
      te: [
        'బడ్జెట్, పొదుపు, అప్పుల విముక్తి మరియు బీమాను సమన్వయం చేయండి.',
        'సఖి యాప్ ద్వారా ప్రతి నెలా మీ ఆర్థిక ఆరోగ్యాన్ని సమీక్షించుకోండి.',
        'మీ కుటుంబానికి సంపూర్ణ ఆర్థిక స్వావలంబన, ఆత్మగౌరవాన్ని సాధించండి.',
      ],
      hi: [
        'बजट, बचत, कर्जमुक्ति और बीमा को मिलाकर सुरक्षित भविष्य बनाएं।',
        'सखी ऐप की मदद से हर महीने अपनी वित्तीय सेहत की समीक्षा करें।',
        'अपने परिवार के लिए पूर्ण वित्तीय आत्मनिर्भरता और सम्मान हासिल करें।',
      ],
    },
    iconName: 'military-tech',
    backendLessonId: 'les-8-1-financial-mastery',
  },
];
