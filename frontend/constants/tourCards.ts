export interface TourCardData {
  id: string;
  index: number;
  iconName: string;
  category: {
    en: string;
    te: string;
    hi: string;
  };
  title: {
    en: string;
    te: string;
    hi: string;
  };
  description: {
    en: string;
    te: string;
    hi: string;
  };
  highlightBadge: {
    en: string;
    te: string;
    hi: string;
  };
  points: {
    en: string[];
    te: string[];
    hi: string[];
  };
}

export const TOUR_CARDS: TourCardData[] = [
  {
    id: 'tour-card-1',
    index: 1,
    iconName: 'volunteer-activism',
    category: {
      en: 'WELCOME',
      te: 'స్వాగతం',
      hi: 'स्वागत है',
    },
    title: {
      en: 'Welcome to Sakhi 👋',
      te: 'సఖికి స్వాగతం 👋',
      hi: 'सखी में स्वागत है 👋',
    },
    description: {
      en: 'Your trusted AI financial companion, built to help you grow savings, manage money, and achieve financial independence.',
      te: 'మీ నమ్మకమైన ఆర్థిక సహాయకురాలు. పొదుపు పెంచుకోవడానికి, డబ్బు నిర్వహించడానికి మరియు స్వయం సమృద్ధి సాధించడానికి సఖి తోడుంటుంది.',
      hi: 'आपकी भरोसेमंद वित्तीय साथी। बचत बढ़ाने, पैसों का हिसाब रखने और आत्मनिर्भर बनने में सखी आपकी मदद करेगी।',
    },
    highlightBadge: {
      en: 'Personalized & Safe',
      te: 'వ్యక్తిగతం & సురక్షితం',
      hi: 'व्यक्तिगत और सुरक्षित',
    },
    points: {
      en: [
        'Mother-tongue voice assistance (Telugu, Hindi, English)',
        '100% private and secure financial tracking',
        'Customized for rural women and SHG members',
      ],
      te: [
        'మాతృభాషలో వాయిస్ సదుపాయం (తెలుగు, హిందీ, ఇంగ్లీష్)',
        '100% సురక్షితమైన మరియు ప్రైవేట్ ఖాతా',
        'మహిళా సంఘాలు మరియు కుటుంబాల కోసం ప్రత్యేక రూపకల్పన',
      ],
      hi: [
        'अपनी मातृभाषा में बोलकर मार्गदर्शन (हिंदी, तेलुगु, अंग्रेजी)',
        '100% सुरक्षित और गोपनीय वित्तीय हिसाब',
        'महिला स्वयं सहायता समूहों और परिवारों के लिए समर्पित',
      ],
    },
  },
  {
    id: 'tour-card-2',
    index: 2,
    iconName: 'account-balance-wallet',
    category: {
      en: 'MY MONEY',
      te: 'నా డబ్బు',
      hi: 'मेरा पैसा',
    },
    title: {
      en: 'Understand Your Money 💰',
      te: 'మీ డబ్బు నిర్వహణ 💰',
      hi: 'पैसों का सही हिसाब 💰',
    },
    description: {
      en: 'Track daily earnings, household expenses, and SHG debts. Automatically calculate your monthly surplus.',
      te: 'రోజువారీ ఆదాయం, ఇంటి ఖర్చులు, సంఘం అప్పులను సులభంగా లెక్కించి మీ నెలవారీ మిగులు పొదుపును తెలుసుకోండి.',
      hi: 'दैनिक कमाई, घरेलू खर्च और समूह के कर्ज़ का हिसाब रखें। अपनी मासिक बचत का सही अनुमान लगाएं।',
    },
    highlightBadge: {
      en: 'Cashflow Clarity',
      te: 'స్పష్టమైన ఆదాయ-వ్యయాలు',
      hi: 'स्पष्ट आय-व्यय',
    },
    points: {
      en: [
        'Log income and expenses in seconds',
        'Track private moneylender and SHG loans',
        'Calculate safe-to-save monthly surplus',
      ],
      te: [
        'క్షణాల్లో ఆదాయం మరియు ఖర్చుల నమోదు',
        'వడ్డీ వ్యాపారుల మరియు సంఘం అప్పుల ట్రాకింగ్',
        'ఖర్చులు పోగా మిగిలే పొదుపు లెక్క',
      ],
      hi: [
        'सेकंडों में आय और खर्च दर्ज करें',
        'साहूकार और बैंक/समूह कर्ज़ का हिसाब',
        'खर्चों के बाद सुरक्षित बचत राशि जानें',
      ],
    },
  },
  {
    id: 'tour-card-3',
    index: 3,
    iconName: 'savings',
    category: {
      en: 'GOALS & DREAMS',
      te: 'కలల కుండలు',
      hi: 'सपनों के घड़े',
    },
    title: {
      en: 'Build Towards Your Goals 🎯',
      te: 'కలల కుండల లక్ష్యాలు 🎯',
      hi: 'सपनों के घड़े और लक्ष्य 🎯',
    },
    description: {
      en: 'Create targeted Dream Pots for children’s education, emergency safety shield, or small enterprise goals.',
      te: 'పిల్లల చదువు, కుటుంబ అత్యవసర రక్షణ లేదా చిన్న వ్యాపారం కోసం కలల కుండలను సృష్టించి పొదుపు చేయండి.',
      hi: 'बच्चों की पढ़ाई, आपातकालीन सुरक्षा या छोटे व्यवसाय के लिए सपनों के घड़े बनाएं और लक्ष्य पूरा करें।',
    },
    highlightBadge: {
      en: 'Milestone Tracking',
      te: 'లక్ష్యాల సాధన',
      hi: 'लक्ष्य प्राप्ति',
    },
    points: {
      en: [
        '3-Month Emergency Shield protection buffer',
        'Dream Pots with customizable milestones and targets',
        'Celebrate visual progress with every deposit',
      ],
      te: [
        '3 నెలల అత్యవసర రక్షణ కవచ నిధి ఏర్పాటు',
        'పిల్లల భవిష్యత్తు కోసం కలల కుండల పొదుపు',
        'ప్రతి డిపాజిట్‌తో పురోగతిని చూడండి',
      ],
      hi: [
        '3 महीने का सुरक्षा कवच आपातकालीन कोष',
        'भविष्य के लिए मनपसंद बचत घड़े',
        'हर बचत के साथ लक्ष्य के करीब पहुंचें',
      ],
    },
  },
  {
    id: 'tour-card-4',
    index: 4,
    iconName: 'verified-user',
    category: {
      en: 'BENEFITS',
      te: 'ప్రభుత్వ పథకాలు',
      hi: 'सरकारी योजनाएं',
    },
    title: {
      en: 'Discover Benefits & Schemes 📜',
      te: 'సంక్షేమ పథకాల శోధన 📜',
      hi: 'कल्याणकारी योजनाएं 📜',
    },
    description: {
      en: 'Instantly check eligibility for central and state government schemes tailored to women entrepreneurs and SHGs.',
      te: 'మహిళా సంఘాలు మరియు స్వయం ఉపాధి కోసం రూపొందించిన కేంద్ర, రాష్ట్ర ప్రభుత్వ సంక్షేమ పథకాలను కనుగొనండి.',
      hi: 'महिला उद्यमियों और सहायता समूहों के लिए बनाई गई सरकारी योजनाओं की पात्रता तुरंत जांचें।',
    },
    highlightBadge: {
      en: 'Direct Welfare Match',
      te: 'నేరుగా అర్హత గుర్తింపు',
      hi: 'सीधा योजना मिलान',
    },
    points: {
      en: [
        'Matched schemes based on age, income & state',
        'Step-by-step application guidance and portal links',
        'Lakhpati Didi, PM SVANidhi, Sukanya Samriddhi & more',
      ],
      te: [
        'వయస్సు, ఆదాయం మరియు రాష్ట్రం ఆధారంగా పథకాలు',
        'దరఖాస్తు విధానం మరియు అవసరమైన పత్రాల జాబితా',
        'లఖ్‌పతి దీదీ, సుకన్య సమృద్ధి వంటి పథకాలు',
      ],
      hi: [
        'उम्र, आय और राज्य के आधार पर सटीक योजनाएं',
        'आवेदन प्रक्रिया और आवश्यक दस्तावेजों की जानकारी',
        'लखपति दीदी, सुकन्या समृद्धि आदि योजनाओं के लाभ',
      ],
    },
  },
  {
    id: 'tour-card-5',
    index: 5,
    iconName: 'record-voice-over',
    category: {
      en: 'ASK SAKHI AI',
      te: 'సఖితో మాట్లాడండి',
      hi: 'सखी से पूछें',
    },
    title: {
      en: 'Ask Sakhi AI Voice 🎙️',
      te: 'సఖి వాయిస్ సహాయకురాలు 🎙️',
      hi: 'सखी वॉयस सहायक 🎙️',
    },
    description: {
      en: 'Speak naturally in Telugu, Hindi, or English. Ask about loan interest, savings strategies, or welfare schemes.',
      te: 'తెలుగు, హిందీ లేదా ఇంగ్లీషులో వాయిస్ ద్వారా మాట్లాడి మీ ఆర్థిక ప్రశ్నలకు సరైన సలహాలను పొందండి.',
      hi: 'हिंदी, तेलुगु या अंग्रेजी में बोलकर सवाल पूछें और अपनी बचत व कर्ज़ से जुड़े सही सुझाव पाएं।',
    },
    highlightBadge: {
      en: 'Indic Voice Intelligence',
      te: 'మాతృభాషలో సమాధానాలు',
      hi: 'मातृभाषा में उत्तर',
    },
    points: {
      en: [
        'Speak via microphone button with instant speech recognition',
        'Grounded specifically in your personal financial health',
        'No complicated financial jargon — simple, warm explanations',
      ],
      te: [
        'మైక్రోఫోన్ బటన్ నొక్కి సూటిగా మాట్లాడండి',
        'మీ వాస్తవ ఆర్థిక పరిస్థితి ఆధారంగా సలహాలు',
        'కఠినమైన పదాలు లేకుండా సులభమైన వివరణలు',
      ],
      hi: [
        'माइक बटन दबाकर सरलता से अपनी भाषा में बोलें',
        'आपकी वास्तविक वित्तीय स्थिति पर आधारित सलाह',
        'बिना किसी कठिन शब्दों के आसान बातचीत',
      ],
    },
  },
  {
    id: 'tour-card-6',
    index: 6,
    iconName: 'explore',
    category: {
      en: 'JOURNEY & LEARNING',
      te: 'ఆర్థిక ప్రయాణం',
      hi: 'वित्तीय यात्रा',
    },
    title: {
      en: 'Your 7-Stage Roadmap 🗺️',
      te: '7-దశల ఆర్థిక ప్రయాణం 🗺️',
      hi: '7-चरणीय वित्तीय यात्रा 🗺️',
    },
    description: {
      en: 'Follow our structured milestone journey towards becoming a Lakhpati Didi, with bite-sized audio lessons.',
      te: 'లఖ్‌పతి దీదీ స్థాయికి చేరుకోవడానికి 7-దశల ప్రయాణాన్ని అనుసరిస్తూ, చిన్న ఆడియో పాఠాలతో కొత్త విషయాలు నేర్చుకోండి.',
      hi: 'लखपति दीदी बनने की दिशा में 7-चरणीय यात्रा का पालन करें और सरल ऑडियो पाठों से सीखें।',
    },
    highlightBadge: {
      en: 'Financial Confidence',
      te: 'ఆర్థిక స్వయం సమృద్ధి',
      hi: 'वित्तीय आत्मनिर्भरता',
    },
    points: {
      en: [
        '7 clearly structured financial milestones',
        'Short 1-minute audio lessons with quick quizzes',
        'Track debt snowball payoffs and growing wealth',
      ],
      te: [
        'స్పష్టమైన 7 మైలురాళ్ల ఆర్థిక ప్రణాళిక',
        '1-నిమిషం ఆడియో పాఠాలు మరియు చిన్న క్విజ్‌లు',
        'అప్పుల విముక్తి మరియు సంపద వృద్ధి ట్రాకింగ్',
      ],
      hi: [
        '7 स्पष्ट वित्तीय पड़ावों की रूपरेखा',
        '1-मिनट के ऑडियो पाठ और छोटी प्रश्नोत्तरी',
        'कर्ज़ मुक्ति और बचत में लगातार बढ़ोतरी',
      ],
    },
  },
  {
    id: 'tour-card-7',
    index: 7,
    iconName: 'rocket-launch',
    category: {
      en: 'READY TO START',
      te: 'మొదలుపెడదాం',
      hi: 'शुरू करें',
    },
    title: {
      en: "You're All Set! 🚀",
      te: 'మీరు సిద్ధంగా ఉన్నారు! 🚀',
      hi: 'आप तैयार हैं! 🚀',
    },
    description: {
      en: 'Take control of your household money and business dreams today. Let’s take the first step together with Sakhi!',
      te: 'మీ కుటుంబ ఆర్థిక భవిష్యత్తును మరియు కలలను మీరే నిర్మించుకోండి. రండి, సఖితో కలిసి మొదటి అడుగు వేద్దాం!',
      hi: 'अपने परिवार के वित्तीय भविष्य और सपनों को साकार करें। आइए, सखी के साथ मिलकर पहला कदम बढ़ाएं!',
    },
    highlightBadge: {
      en: 'Welcome to the Family',
      te: 'సఖి కుటుంబంలోకి స్వాగతం',
      hi: 'सखी परिवार में स्वागत है',
    },
    points: {
      en: [
        'Explore your live Dashboard summary',
        'Add your first transaction or dream goal',
        'Replay this tour anytime from Settings (☰)',
      ],
      te: [
        'మీ హోమ్ డ్యాష్‌బోర్డ్ సారాంశాన్ని చూడండి',
        'మీ మొదటి లావాదేవీ లేదా పొదుపు లక్ష్యాన్ని జోడించండి',
        'సెట్టింగ్స్ (☰) నుండి ఈ టూర్‌ను ఎప్పుడైనా మళ్లీ చూడవచ్చు',
      ],
      hi: [
        'अपना होम डैशबोर्ड और वित्तीय स्थिति देखें',
        'अपना पहला लेन-देन या बचत लक्ष्य जोड़ें',
        'सेटिंग्स (☰) से इस टूर को कभी भी दोबारा देख सकते हैं',
      ],
    },
  },
];
