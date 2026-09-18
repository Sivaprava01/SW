import { TutorialDefinition } from '@/types/tutorial';

export const TUTORIAL_DEFINITIONS: Record<string, TutorialDefinition> = {
  // Tutorial 1: Sakhi Basics (Main first-time walkthrough)
  basics: {
    id: 'basics',
    name: {
      te: 'సఖి పరిచయం (Sakhi Basics)',
      hi: 'सखी परिचय (Sakhi Basics)',
      en: 'Sakhi Basics Tour',
    },
    description: {
      te: 'సఖి ముఖ్యమైన ఫీచర్లను సులభంగా నేర్చుకోండి.',
      hi: 'सखी की मुख्य विशेषताओं को आसानी से सीखें।',
      en: 'Learn the primary features of Sakhi in a few simple taps.',
    },
    icon: 'explore',
    category: 'core',
    estimatedSeconds: 60,
    steps: [
      {
        id: 'basics-home-summary',
        targetId: 'home-summary-card',
        route: '/(tabs)',
        title: {
          te: 'ఆర్థిక సారాంశం',
          hi: 'वित्तीय सारांश',
          en: 'Financial Snapshot',
        },
        text: {
          te: 'ఇక్కడ మీ నెలవారీ ఆదాయం మరియు మిగులు పొదుపు సురక్షితంగా లెక్కించబడుతుంది.',
          hi: 'यहाँ आपकी मासिक आय और बचत का सुरक्षित हिसाब दिखता है।',
          en: 'Here you see your monthly income and safe-to-save surplus.',
        },
        tip: {
          te: 'ఖర్చులన్నీ పోగా మిగిలిన సొమ్ము ఇది.',
          hi: 'यह सभी खर्चों के बाद बची हुई राशि है।',
          en: 'This is the surplus remaining after your household expenses.',
        },
        action: 'next',
        position: 'bottom',
        voiceEnabled: true,
      },
      {
        id: 'basics-home-money',
        targetId: 'home-money-card',
        route: '/(tabs)',
        title: {
          te: 'నా డబ్బు (My Money)',
          hi: 'मेरा पैसा (My Money)',
          en: 'My Money & Ledger',
        },
        text: {
          te: 'మీ రోజువారీ ఖర్చులు, అప్పులు చూడటానికి "My Money" పై నొక్కండి.',
          hi: 'अपने दैनिक खर्च और ऋण देखने के लिए "My Money" पर टैप करें।',
          en: 'Tap "My Money" to view daily expenses, income, and debts.',
        },
        action: 'tap',
        position: 'bottom',
        voiceEnabled: true,
      },
      {
        id: 'basics-home-goals',
        targetId: 'home-goals-card',
        route: '/(tabs)',
        title: {
          te: 'కలల కుండలు (Dream Pots)',
          hi: 'सपनों के घड़े (Dream Pots)',
          en: 'Dream Pots & Goals',
        },
        text: {
          te: 'పిల్లల చదువు లేదా వ్యాపార పొదుపుల కోసం "My Goals" పై నొక్కండి.',
          hi: 'बच्चों की पढ़ाई या व्यवसाय के लक्ष्यों के लिए "My Goals" पर टैप करें।',
          en: 'Tap "My Goals" to view or create goal-based savings pots.',
        },
        action: 'tap',
        position: 'bottom',
        voiceEnabled: true,
      },
      {
        id: 'basics-home-benefits',
        targetId: 'home-benefits-card',
        route: '/(tabs)',
        title: {
          te: 'ప్రభుత్వ పథకాలు (Benefits)',
          hi: 'सरकारी योजनाएं (Benefits)',
          en: 'Government Benefits',
        },
        text: {
          te: 'మీకు సరిపోయే ఉచిత ప్రభుత్వ పథకాలు చూడటానికి "Benefits" పై నొక్కండి.',
          hi: 'अपने लिए उपयुक्त सरकारी योजनाएं देखने के लिए "Benefits" पर टैप करें।',
          en: 'Tap "Benefits" to discover government schemes matched for you.',
        },
        action: 'tap',
        position: 'bottom',
        voiceEnabled: true,
      },
      {
        id: 'basics-home-journey',
        targetId: 'home-journey-card',
        route: '/(tabs)',
        title: {
          te: 'మీ ప్రయాణం (Journey)',
          hi: 'आपकी यात्रा (Journey)',
          en: 'Financial Journey',
        },
        text: {
          te: 'మీ ఆర్థిక స్వయం సమృద్ధి మైలురాళ్లను "My Journey" లో చూడండి.',
          hi: 'अपनी वित्तीय प्रगति और पड़ाव "My Journey" में देखें।',
          en: 'Tap "My Journey" to see your financial milestone roadmap.',
        },
        action: 'tap',
        position: 'bottom',
        voiceEnabled: true,
      },
      {
        id: 'basics-home-learn',
        targetId: 'home-learn-card',
        route: '/(tabs)',
        title: {
          te: 'ఆర్థిక పాఠాలు (Learn)',
          hi: 'वित्तीय सीख (Learn)',
          en: 'Learn Money Skills',
        },
        text: {
          te: 'సులభమైన ఆడియో పాఠాలు మరియు క్విజ్‌ల కోసం "Learn" పై నొక్కండి.',
          hi: 'सरल ऑडियो पाठ और प्रश्नोत्तरी के लिए "Learn" पर टैप करें।',
          en: 'Tap "Learn" to listen to short audio lessons and quizzes.',
        },
        action: 'tap',
        position: 'top',
        voiceEnabled: true,
      },
      {
        id: 'basics-home-sakhi',
        targetId: 'home-ask-sakhi-card',
        route: '/(tabs)',
        title: {
          te: 'సఖితో మాట్లాడండి (Talk to Sakhi)',
          hi: 'सखी से बात करें (Talk to Sakhi)',
          en: 'Talk to Sakhi AI',
        },
        text: {
          te: 'మీ భాషలో వాయిస్ ద్వారా ఏదైనా అడగడానికి ఇక్కడ నొక్కండి.',
          hi: 'अपनी भाषा में बोलकर कुछ भी पूछने के लिए यहाँ टैप करें।',
          en: 'Tap here to ask Sakhi any question using your voice in your mother tongue.',
        },
        action: 'tap',
        position: 'bottom',
        voiceEnabled: true,
      },
    ],
  },

  // Tutorial 2: Money & Ledger
  money: {
    id: 'money',
    name: {
      te: 'నా డబ్బు నిర్వహణ (My Money)',
      hi: 'पैसों का हिसाब (My Money)',
      en: 'My Money & Transactions',
    },
    description: {
      te: 'లావాదేవీలు మరియు ఆదాయ-వ్యయాల నమోదు నేర్చుకోండి.',
      hi: 'लेन-देन और आय-व्यय दर्ज करना सीखें।',
      en: 'Learn how to track income, daily expenses, and SHG debts.',
    },
    icon: 'account-balance-wallet',
    category: 'finance',
    estimatedSeconds: 45,
    steps: [
      {
        id: 'money-surplus-header',
        targetId: 'money-surplus-card',
        route: '/(tabs)/money',
        title: {
          te: 'మిగులు సారాంశం',
          hi: 'मासिक बचत शेष',
          en: 'Net Monthly Surplus',
        },
        text: {
          te: 'మీ నెలవారీ రాబడి మరియు ఖర్చుల మధ్య నికర వ్యత్యాసం ఇక్కడ కనిపిస్తుంది.',
          hi: 'आपकी मासिक आय और खर्च के बाद बची राशि यहाँ दिखाई देती है।',
          en: 'Here is your net monthly surplus after all logged expenses.',
        },
        action: 'next',
        position: 'bottom',
        voiceEnabled: true,
      },
      {
        id: 'money-filter-bar',
        targetId: 'money-filters',
        route: '/(tabs)/money',
        title: {
          te: 'వర్గీకరణ ఫిల్టర్లు',
          hi: 'श्रेणी फ़िल्टर',
          en: 'Filter Transactions',
        },
        text: {
          te: 'ఆదాయం లేదా ఖర్చులను మాత్రమే వేరు చేసి చూడటానికి ఇక్కడ నొక్కండి.',
          hi: 'केवल आय या खर्च को अलग से देखने के लिए यहाँ टैप करें।',
          en: 'Tap to filter transactions between Income and Expenses.',
        },
        action: 'next',
        position: 'bottom',
        voiceEnabled: true,
      },
      {
        id: 'money-add-button',
        targetId: 'money-add-btn',
        route: '/(tabs)/money',
        title: {
          te: 'కొత్త లావాదేవీ నమోదు',
          hi: 'नया लेन-देन जोड़ें',
          en: 'Add Transaction',
        },
        text: {
          te: 'కొత్త ఖర్చు లేదా రాబడిని చేర్చడానికి ఈ బటన్ పై నొక్కండి.',
          hi: 'नया खर्च या आय जोड़ने के लिए इस बटन पर टैप करें।',
          en: 'Tap this button to log a new income or expense transaction.',
        },
        action: 'tap',
        position: 'top',
        voiceEnabled: true,
      },
    ],
  },

  // Tutorial 3: Goals & Dream Pots
  goals: {
    id: 'goals',
    name: {
      te: 'కలల కుండల లక్ష్యాలు (Dream Pots)',
      hi: 'सपनों के घड़े (Dream Pots)',
      en: 'Dream Pots & Goals',
    },
    description: {
      te: 'లక్ష్యాల కోసం చిన్న మొత్తాలు ఎలా పొదుపు చేయాలో నేర్చుకోండి.',
      hi: 'अपने लक्ष्यों के लिए छोटी बचत करना सीखें।',
      en: 'Learn how to set up and deposit into targeted Dream Pots.',
    },
    icon: 'ads-click',
    category: 'finance',
    estimatedSeconds: 40,
    steps: [
      {
        id: 'goals-summary-banner',
        targetId: 'goals-summary-card',
        route: '/(tabs)/goals',
        title: {
          te: 'లక్ష్యాల సారాంశం',
          hi: 'लक्ष्यों का अवलोकन',
          en: 'Goals Overview',
        },
        text: {
          te: 'మీ అన్ని కలల కుండల్లో కలిపి మొత్తం ఎంత జమ అయ్యిందో ఇక్కడ తెలుస్తుంది.',
          hi: 'आपके सभी सपनों के घड़ों में कुल कितनी बचत हुई है, यहाँ देखें।',
          en: 'See your total cumulative savings across all active Dream Pots.',
        },
        action: 'next',
        position: 'bottom',
        voiceEnabled: true,
      },
      {
        id: 'goals-create-btn',
        targetId: 'goals-create-action',
        route: '/(tabs)/goals',
        title: {
          te: 'కొత్త కలల కుండను సృష్టించండి',
          hi: 'नया सपनों का घड़ा बनाएं',
          en: 'Create Dream Pot',
        },
        text: {
          te: 'కొత్త పొదుపు లక్ష్యాన్ని మొదలుపెట్టడానికి ఇక్కడ నొక్కండి.',
          hi: 'नया बचत लक्ष्य शुरू करने के लिए यहाँ टैप करें।',
          en: 'Tap here to start a new savings goal for family or business.',
        },
        action: 'tap',
        position: 'bottom',
        voiceEnabled: true,
      },
    ],
  },

  // Tutorial 4: Schemes & Government Benefits
  schemes: {
    id: 'schemes',
    name: {
      te: 'ప్రభుత్వ పథకాలు (Schemes)',
      hi: 'सरकारी योजनाएं (Schemes)',
      en: 'Government Schemes',
    },
    description: {
      te: 'మీకు అర్హత ఉన్న ప్రభుత్వ సంక్షేమ పథకాలను కనుగొనండి.',
      hi: 'अपनी पात्रता वाली सरकारी कल्याणकारी योजनाएं खोजें।',
      en: 'Discover and check eligibility for matched welfare schemes.',
    },
    icon: 'verified-user',
    category: 'benefits',
    estimatedSeconds: 45,
    steps: [
      {
        id: 'schemes-search-bar',
        targetId: 'schemes-search-box',
        route: '/(tabs)/benefits',
        title: {
          te: 'పథకాల శోధన',
          hi: 'योजना खोजें',
          en: 'Search Schemes',
        },
        text: {
          te: 'లఖ్‌పతి దీదీ, సుకన్య సమృద్ధి వంటి పథకాలను పేరుతో వెతకండి.',
          hi: 'लखपति दीदी, सुकन्या समृद्धि जैसी योजनाएं नाम से खोजें।',
          en: 'Search schemes by keyword or program name directly.',
        },
        action: 'next',
        position: 'bottom',
        voiceEnabled: true,
      },
      {
        id: 'schemes-match-card',
        targetId: 'schemes-first-card',
        route: '/(tabs)/benefits',
        title: {
          te: 'అర్హతగల పథకం వివరాలు',
          hi: 'योजना का विवरण',
          en: 'Matched Scheme Details',
        },
        text: {
          te: 'పథకం ప్రయోజనాలు, అర్హతలు మరియు దరఖాస్తు పద్ధతి చూడటానికి కార్డ్ పై నొక్కండి.',
          hi: 'योजना के लाभ, पात्रता और आवेदन प्रक्रिया देखने के लिए कार्ड पर टैप करें।',
          en: 'Tap on any scheme card to see full eligibility criteria and benefits.',
        },
        action: 'tap',
        position: 'top',
        voiceEnabled: true,
      },
    ],
  },

  // Tutorial 5: Financial Journey
  journey: {
    id: 'journey',
    name: {
      te: 'ఆర్థిక ప్రయాణం (Journey)',
      hi: 'वित्तीय यात्रा (Journey)',
      en: 'Financial Journey',
    },
    description: {
      te: 'మీ ఆర్థిక స్థాయిని దశలవారీగా మెరుగుపరుచుకోండి.',
      hi: 'अपने वित्तीय स्तर को चरणबद्ध तरीके से बढ़ाएं।',
      en: 'Understand your path from stability to Lakhpati Didi.',
    },
    icon: 'explore',
    category: 'core',
    estimatedSeconds: 35,
    steps: [
      {
        id: 'journey-stage-header',
        targetId: 'journey-stage-banner',
        route: '/(tabs)/journey',
        title: {
          te: 'ప్రస్తుత ఆర్థిక దశ',
          hi: 'वर्तमान वित्तीय चरण',
          en: 'Current Stage',
        },
        text: {
          te: 'మీరు ప్రస్తుతం ఏ దశలో ఉన్నారో, తదుపరి లక్ష్యం ఏమిటో ఇక్కడ చూడండి.',
          hi: 'आप वर्तमान में किस चरण में हैं और अगला पड़ाव क्या है, यहाँ देखें।',
          en: 'Track your current financial milestone stage and progress.',
        },
        action: 'next',
        position: 'bottom',
        voiceEnabled: true,
      },
      {
        id: 'journey-milestone-action',
        targetId: 'journey-active-milestone',
        route: '/(tabs)/journey',
        title: {
          te: 'తదుపరి మైలురాయి',
          hi: 'अगला पड़ाव',
          en: 'Next Milestone',
        },
        text: {
          te: 'ఈ మైలురాయిని పూర్తి చేయడానికి సూచించిన చర్యను గమనించండి.',
          hi: 'इस पड़ाव को पूरा करने के लिए सुझाया गया कार्य देखें।',
          en: 'Review the recommended action to complete this milestone.',
        },
        action: 'next',
        position: 'top',
        voiceEnabled: true,
      },
    ],
  },

  // Tutorial 6: Learn Skills
  learn: {
    id: 'learn',
    name: {
      te: 'ఆర్థిక పాఠాలు (Learn)',
      hi: 'वित्तीय सीख (Learn)',
      en: 'Financial Learning',
    },
    description: {
      te: 'ఆడియో పాఠాలు విని చిన్న క్విజ్‌లు పూర్తి చేయండి.',
      hi: 'ऑडियो पाठ सुनें और छोटी प्रश्नोत्तरी हल करें।',
      en: 'Listen to byte-sized audio lessons and take interactive quizzes.',
    },
    icon: 'menu-book',
    category: 'core',
    estimatedSeconds: 40,
    steps: [
      {
        id: 'learn-module-card',
        targetId: 'learn-first-module',
        route: '/(tabs)/learn',
        title: {
          te: 'పాఠ్యాంశ మాడ్యూల్',
          hi: 'सीखने का मॉड्यूल',
          en: 'Learning Module',
        },
        text: {
          te: 'అత్యవసర నిధి, పొదుపు పద్ధతులు నేర్చుకోవడానికి మాడ్యూల్ పై నొక్కండి.',
          hi: 'आपातकालीन कोष और बचत के तरीके सीखने के लिए मॉड्यूल पर टैप करें।',
          en: 'Tap on a module to expand its short audio lessons.',
        },
        action: 'tap',
        position: 'bottom',
        voiceEnabled: true,
      },
      {
        id: 'learn-golden-rules',
        targetId: 'learn-rules-card',
        route: '/(tabs)/learn',
        title: {
          te: 'బంగారు సూత్రాలు',
          hi: 'सखी के स्वर्णिम नियम',
          en: 'Golden Rules',
        },
        text: {
          te: 'గ్రామీణ మహిళల కోసం సఖి సిద్ధం చేసిన ముఖ్యమైన ఆర్థిక సూత్రాలు ఇవి.',
          hi: 'ग्रामीण महिलाओं के लिए सखी के महत्वपूर्ण वित्तीय नियम यहाँ पढ़ें।',
          en: 'Review essential financial golden rules tailored for SHG sisters.',
        },
        action: 'next',
        position: 'top',
        voiceEnabled: true,
      },
    ],
  },

  // Tutorial 7: Ask Sakhi AI Voice Assistant
  asksakhi: {
    id: 'asksakhi',
    name: {
      te: 'సఖి వాయిస్ సహాయకురాలు (Ask Sakhi)',
      hi: 'सखी वॉयस सहायक (Ask Sakhi)',
      en: 'Ask Sakhi AI Voice',
    },
    description: {
      te: 'మీ మాతృభాషలో మాట్లాడి ఆర్థిక సలహాలు పొందండి.',
      hi: 'अपनी मातृभाषा में बोलकर वित्तीय सलाह लें।',
      en: 'Speak naturally in Telugu, Hindi, or English to get instant answers.',
    },
    icon: 'record-voice-over',
    category: 'ai',
    estimatedSeconds: 35,
    steps: [
      {
        id: 'sakhi-voice-mic',
        targetId: 'sakhi-mic-button',
        title: {
          te: 'మైక్రోఫోన్ బటన్',
          hi: 'माइक्रोफ़ोन बटन',
          en: 'Voice Microphone',
        },
        text: {
          te: 'మాట్లాడటానికి మైక్ బటన్ నొక్కి పట్టుకోండి లేదా ప్రశ్న అడగండి.',
          hi: 'बोलने के लिए माइक बटन दबाएं और अपना सवाल पूछें।',
          en: 'Tap the mic button to speak your financial question naturally.',
        },
        action: 'next',
        position: 'top',
        voiceEnabled: true,
      },
      {
        id: 'sakhi-quick-questions',
        targetId: 'sakhi-suggested-chips',
        title: {
          te: 'త్వరిత ప్రశ్నలు',
          hi: 'सुझाए गए सवाल',
          en: 'Quick Questions',
        },
        text: {
          te: 'త్వరగా సమాధానం పొందడానికి సూచించిన ప్రశ్నల్లో దేనినైనా ఎంచుకోండి.',
          hi: 'तुरंत उत्तर पाने के लिए किसी भी सुझाए गए सवाल पर टैप करें।',
          en: 'Tap any suggested chip to quickly query your balance or SHG loans.',
        },
        action: 'next',
        position: 'bottom',
        voiceEnabled: true,
      },
    ],
  },
};
