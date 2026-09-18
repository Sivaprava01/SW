"""
Sakhi Financial Knowledge Service & Verified Concept Repository.

Provides structured, authentic Indian financial literacy concepts,
Golden Rules, and multilingual guidance in Telugu, Hindi, and English.
"""

from typing import List, Optional
from app.schemas.knowledge import FinancialConceptResponse, GoldenRuleResponse, LocalizedText


CONCEPTS_DATA = [
    FinancialConceptResponse(
        id="fc-1",
        slug="suraksha-kavach-emergency-buffer",
        category="Safety & Emergency",
        title=LocalizedText(
            en="Emergency Buffer (Suraksha Kavach)",
            te="అత్యవసర రక్షణ నిధి (సురక్ష కవచ్)",
            hi="आपातकालीन सुरक्षा कवच",
        ),
        summary=LocalizedText(
            en="Save 3 months of basic kitchen and household expenses in a safe bank account before taking any investment risks.",
            te="పెట్టుబడులు లేదా రిస్క్ తీసుకునే ముందు 3 నెలల నిత్యావసర ఖర్చులను బ్యాంకు లేదా పోస్టాఫీసులో సిద్ధంగా ఉంచుకోండి.",
            hi="कोई भी निवेश या जोखिम लेने से पहले 3 महीने के जरूरी घरेलू खर्चों को सुरक्षित बैंक या डाकघर में रखें।",
        ),
        plain_language_explanation=LocalizedText(
            en="Life is unpredictable. Health emergencies, crop failures, or livestock illness happen without notice. Having ₹20,000 to ₹25,000 saved protects your dignity and prevents borrowing from moneylenders at 36% interest.",
            te="అనుకోని ఆస్పత్రి ఖర్చులు లేదా పంట నష్టం వచ్చినప్పుడు ఇతరుల దగ్గర చేతులు చాచకుండా కాపాడేదే అత్యవసర నిధి. ఇది మీ ఆత్మగౌరవాన్ని కాపాడుతుంది.",
            hi="अचानक बीमारी या नुकसान के समय किसी साहूकार से ऊंचे ब्याज पर कर्ज लेने से बचाने वाला सुरक्षा कवच ही इमरजेंसी फंड है।",
        ),
        practical_action=LocalizedText(
            en="Keep this money in a Post Office Savings Account or Bank Savings Account with an ATM card for instant access.",
            te="ఈ డబ్బును పోస్టాఫీస్ సేవింగ్స్ లేదా ఏటీఎం సౌకర్యం ఉన్న బ్యాంకు ఖాతాలో భద్రపరచండి.",
            hi="इस राशि को डाकघर बचत खाते या एटीएम सुविधा वाले बैंक खाते में सुरक्षित रखें।",
        ),
        warning_or_pitfall=LocalizedText(
            en="Never lock your emergency fund in unregistered chit funds, gold ornaments in pawnshops, or illiquid land.",
            te="అత్యవసర నిధిని రిజిస్టర్ కాని చిట్టీలలో లేదా మార్చడానికి వీలుకాని స్థలాలలో పెట్టకండి.",
            hi="आपातकालीन पैसे को गैर-पंजीकृत चिटफंड या ऐसी जगह न फंसाएं जहां से तुरंत निकालना संभव न हो।",
        ),
    ),
    FinancialConceptResponse(
        id="fc-2",
        slug="debt-snowball-moneylender-escape",
        category="Debt Management",
        title=LocalizedText(
            en="Escape Informal Moneylender Debt (Snowball Payoff)",
            te="అధిక వడ్డీ అప్పుల విముక్తి (స్నోబాల్ విధానం)",
            hi="साहूकारी कर्ज से मुक्ति (स्नोबॉल तरीका)",
        ),
        summary=LocalizedText(
            en="Informal moneylenders charging ₹3 per ₹100/month drain 36% to 60% APR. Clear the smallest loan first to build psychological momentum.",
            te="నెలకు ₹3 వడ్డీ అంటే ఏడాదికి 36% నష్టం. ముందుగా చిన్న అప్పులను పూర్తిగా తీర్చి అప్పుల భారాన్ని తగ్గించుకోండి.",
            hi="₹3 प्रति सैकड़ा ब्याज का मतलब सालाना 36% का नुकसान है। सबसे पहले छोटे कर्ज चुकाकर मानसिक तनाव कम करें।",
        ),
        plain_language_explanation=LocalizedText(
            en="When you owe money to multiple people, pay minimums on all and throw every extra rupee at the smallest balance. Once the first is gone, take that freed-up payment and attack the next.",
            te="అన్ని అప్పులకు కనీస చెల్లింపులు చేస్తూ, మీ వద్ద ఉన్న అదనపు మిగులుతో అతి చిన్న అప్పును మొదట తీర్చివేయండి.",
            hi="सभी कर्जों की न्यूनतम किश्त देते हुए बची हुई पूरी बचत से सबसे छोटे कर्ज को पहले खत्म करें।",
        ),
        practical_action=LocalizedText(
            en="Approach your SHG (Self-Help Group) or Stree Nidhi to refinance private debt at 12% annual interest.",
            te="మీ పొదుపు సంఘం (SHG) లేదా స్త్రీ నిధి ద్వారా 12% తక్కువ వడ్డీతో రుణం తీసుకుని ప్రైవేట్ అప్పులను తీర్చండి.",
            hi="अपने स्वयं सहायता समूह (SHG) या बैंक से 12% वार्षिक ब्याज पर ऋण लेकर साहूकार का महंगा कर्ज चुकाएं।",
        ),
    ),
    FinancialConceptResponse(
        id="fc-3",
        slug="pay-yourself-first-recurring-savings",
        category="Savings & Wealth",
        title=LocalizedText(
            en="Pay Yourself First (Habitual Micro-Savings)",
            te="మీ కోసం మొదట పొదుపు (రోజూవారీ లేదా నెలవారీ పొదుపు)",
            hi="पहले अपनी बचत (नियमित छोटी बचत)",
        ),
        summary=LocalizedText(
            en="Don't save what is left after spending; spend what is left after saving.",
            te="ఖర్చులు అయిపోయాక మిగిలింది పొదుపు చేయడం కాదు; మొదట పొదుపు పక్కన పెట్టి మిగిలినదే ఖర్చు చేయాలి.",
            hi="खर्च करने के बाद जो बचे उसे बचाना नहीं, बल्कि पहले बचत अलग करके बाकी पैसे से खर्च चलाना सीखें।",
        ),
        plain_language_explanation=LocalizedText(
            en="The moment income arrives (crop sale, tailoring payment, wages), immediately deposit ₹500 or ₹1,000 into your Post Office Recurring Deposit before opening household spending.",
            te="ఆదాయం చేతికి రాగానే మొదట ₹500 లేదా ₹1,000 రికరింగ్ డిపాజిట్ (RD) లో వేయండి. ఇది చిన్న మొత్తాల్లో పెద్ద నిధిని సృష్టిస్తుంది.",
            hi="आमदनी आते ही सबसे पहले ₹500 या ₹1,000 डाकघर आरडी (RD) में जमा करें, फिर घर का खर्च शुरू करें।",
        ),
        practical_action=LocalizedText(
            en="Open a 5-year Post Office Recurring Deposit (PORD) at 6.7% guaranteed government interest.",
            te="పోస్టాఫీసులో 6.7% హామీ ఉన్న రికరింగ్ డిపాజిట్ (PORD) ఖాతాను ప్రారంభించండి.",
            hi="डाकघर में 6.7% गारंटीशुदा ब्याज वाली 5-वर्षीय आरडी (PORD) शुरू करें।",
        ),
    ),
    FinancialConceptResponse(
        id="fc-4",
        slug="social-security-micro-insurance",
        category="Insurance & Protection",
        title=LocalizedText(
            en="Government Micro-Insurance Shield (PMSBY & PMJJBY)",
            te="ప్రభుత్వ మైక్రో బీమా రక్షణ (PMSBY & PMJJBY)",
            hi="सरकारी सुरक्षा बीमा (PMSBY एवं PMJJBY)",
        ),
        summary=LocalizedText(
            en="Protect your family with ₹4 Lakh total life and accident insurance for less than ₹40 per month.",
            te="నెలకు ₹40 కన్నా తక్కువ ఖర్చుతో మీ కుటుంబానికి ₹4 లక్షల ప్రమాద మరియు జీవిత బీమా రక్షణ పొందండి.",
            hi="महीने में ₹40 से भी कम खर्च में अपने परिवार को ₹4 लाख का जीवन व दुर्घटना बीमा सुरक्षा दें।",
        ),
        plain_language_explanation=LocalizedText(
            en="PMSBY provides ₹2 Lakh accident coverage for just ₹20 per year. PMJJBY provides ₹2 Lakh life coverage for ₹436 per year. If something happens to the primary earner, this money keeps children in school.",
            te="PMSBY ఏడాదికి కేవలం ₹20 తో ₹2 లక్షల ప్రమాద బీమా, PMJJBY ఏడాదికి ₹436 తో ₹2 లక్షల జీవిత బీమా అందిస్తాయి.",
            hi="PMSBY मात्र ₹20/वर्ष में ₹2 लाख का दुर्घटना बीमा और PMJJBY ₹436/वर्ष में ₹2 लाख का जीवन बीमा प्रदान करती है।",
        ),
        practical_action=LocalizedText(
            en="Visit your bank branch or ask your Bank Mitra (BC) to enable auto-debit for PMSBY and PMJJBY on your savings account.",
            te="మీ సేవింగ్స్ బ్యాంక్ ఖాతాలో PMSBY మరియు PMJJBY కోసం ఆటో-డెబిట్ ఆప్షన్ ఆన్ చేసుకోండి.",
            hi="अपने बैंक खाते में PMSBY और PMJJBY के लिए ऑटो-डेबिट सुविधा तुरंत चालू करवाएं।",
        ),
    ),
    FinancialConceptResponse(
        id="fc-5",
        slug="productive-vs-unproductive-borrowing",
        category="Smart Borrowing",
        title=LocalizedText(
            en="Productive vs Consumption Borrowing",
            te="ఉత్పాదక రుణాలు vs ఖర్చుల అప్పులు",
            hi="उत्पादक कर्ज बनाम अनुत्पादक कर्ज",
        ),
        summary=LocalizedText(
            en="Borrow only for assets that generate income (livestock, sewing machine, business inventory), never for festivals or vanity.",
            te="ఆదాయాన్ని పెంచే సాధనాల కోసమే (కుట్టు మిషన్, పశువులు, వ్యాపార సరుకు) అప్పు చేయండి; ఆడంబరాల కోసం కాదు.",
            hi="कर्ज केवल आय बढ़ाने वाली चीजों (सिलाई मशीन, पशु, दुकान का सामान) के लिए लें, दिखावे या फिजूलखर्च के लिए नहीं।",
        ),
        plain_language_explanation=LocalizedText(
            en="A loan for a second sewing machine generates ₹4,000/month extra tailoring income to easily pay the EMI. A loan for an expensive festival dress generates ₹0 and drains your kitchen budget for years.",
            te="కుట్టు మిషన్ కోసం తీసుకునే రుణం ప్రతి నెలా అదనపు సంపాదనను ఇస్తుంది. పండుగ దుస్తుల కోసం చేసే అప్పు జీవితాంతం భారం అవుతుంది.",
            hi="व्यापार के उपकरण के लिए लिया गया कर्ज हर महीने कमाई बढ़ाता है, जबकि फिजूलखर्ची के लिए लिया गया कर्ज सिर्फ बोझ बनता है।",
        ),
        practical_action=LocalizedText(
            en="Before taking any loan, calculate: 'Will this loan put money in my pocket every month after paying the installment?'",
            te="ఏ రుణం తీసుకునే ముందైనా: 'ఈ రుణం ద్వారా నాకు నెలవారీ ఆదాయం పెరుగుతుందా?' అని ఆలోచించండి.",
            hi="कोई भी कर्ज लेने से पहले सोचें: 'क्या इस कर्ज से मेरी हर महीने कमाई बढ़ेगी?'",
        ),
    ),
]


GOLDEN_RULES_DATA = [
    GoldenRuleResponse(
        rule_number=1,
        rule_key="emergency_shield_first",
        title=LocalizedText(
            en="Rule 1: Build the 3-Month Emergency Shield First",
            te="సూత్రం 1: మొదట 3 నెలల అత్యవసర రక్షణ నిధి",
            hi="नियम 1: पहले 3 महीने का सुरक्षा कवच बनाएं",
        ),
        short_formula="Emergency Fund = Monthly Essential Expenses × 3",
        explanation=LocalizedText(
            en="Never invest in long-term assets or chit funds until you have 3 months of kitchen and living expenses in a bank account.",
            te="బ్యాంకులో 3 నెలల కనీస ఖర్చుల నిధి ఉండే వరకు ఎలాంటి రిస్క్ పెట్టుబడులు పెట్టకండి.",
            hi="जब तक 3 महीने का जरूरी घरेलू खर्च बैंक में न हो, तब तक कोई जोखिम भरा निवेश न करें।",
        ),
        example=LocalizedText(
            en="If monthly kitchen expenses are ₹7,000, your target shield is ₹21,000.",
            te="మీ నెలవారీ ఖర్చు ₹7,000 అయితే, మీ రక్షణ నిధి లక్ష్యం ₹21,000.",
            hi="यदि मासिक खर्च ₹7,000 है, तो सुरक्षा कवच का लक्ष्य ₹21,000 होगा।",
        ),
    ),
    GoldenRuleResponse(
        rule_number=2,
        rule_key="kill_high_interest_moneylenders",
        title=LocalizedText(
            en="Rule 2: Eliminate High-Cost Informal Moneylender Debt",
            te="సూత్రం 2: అధిక వడ్డీ ప్రైవేట్ అప్పుల నిర్మూలన",
            hi="नियम 2: ऊंचे ब्याज वाले साहूकारी कर्ज को खत्म करें",
        ),
        short_formula="Refinance 36%–60% Moneylender Debt → 12% SHG Loan",
        explanation=LocalizedText(
            en="Paying ₹3/₹100 monthly is a trap. Refinance high-interest debt with low-interest SHG / Stree Nidhi micro-credit.",
            te="నెలకు ₹3 వడ్డీ అప్పులను SHG లేదా స్త్రీ నిధి 12% తక్కువ వడ్డీ రుణాలతో మార్చి నెలకు వందల రూపాయల వడ్డీని ఆదా చేయండి.",
            hi="₹3 प्रति सैकड़ा वाले कर्ज को SHG या बैंक के 12% वार्षिक ऋण में बदलकर ब्याज का भारी नुकसान रोकें।",
        ),
        example=LocalizedText(
            en="Converting a ₹15,000 moneylender loan to an SHG loan saves ₹300 every month in interest.",
            te="₹15,000 ప్రైవేట్ అప్పును సంఘం రుణంగా మార్చితే నెలకు ₹300 వడ్డీ ఆదా అవుతుంది.",
            hi="₹15,000 के साहूकारी कर्ज को SHG में बदलने पर हर महीने ₹300 का ब्याज बचता है।",
        ),
    ),
    GoldenRuleResponse(
        rule_number=3,
        rule_key="pay_yourself_first",
        title=LocalizedText(
            en="Rule 3: Save Immediately on Income Day (Pay Yourself First)",
            te="సూత్రం 3: ఆదాయం చేతికి రాగానే ముందే పొదుపు",
            hi="नियम 3: कमाई आते ही सबसे पहले अपनी बचत अलग करें",
        ),
        short_formula="Surplus = Income - Expenses (Deposit First)",
        explanation=LocalizedText(
            en="Automate micro-savings on the day payments come in. Treat your savings as non-negotiable.",
            te="డబ్బులు చేతికి రాగానే మొదట కొంత మొత్తాన్ని రికరింగ్ డిపాజిట్ లో వేయండి.",
            hi="पैसे मिलते ही सबसे पहले अपनी आरडी या बचत खाते में तय रकम जमा करें।",
        ),
        example=LocalizedText(
            en="Putting ₹1,000/month into a Post Office RD builds ₹65,000+ in guaranteed capital over 5 years.",
            te="నెలకు ₹1,000 పోస్టాఫీస్ RD లో వేస్తే 5 ఏళ్లలో ₹65,000 పైగా గ్యారెంటీ నిధి సమకూరుతుంది.",
            hi="महीने में ₹1,000 डाकघर आरडी में डालने पर 5 साल में ₹65,000 से अधिक की पूंजी तैयार होती है।",
        ),
    ),
    GoldenRuleResponse(
        rule_number=4,
        rule_key="micro_insurance_safety",
        title=LocalizedText(
            en="Rule 4: Insure the Breadwinner for ₹40/Month",
            te="సూత్రం 4: నెలకు ₹40 తో కుటుంబానికి బీమా రక్షణ",
            hi="नियम 4: मात्र ₹40/माह में पूरे परिवार की सुरक्षा",
        ),
        short_formula="PMSBY (₹20/yr) + PMJJBY (₹436/yr) = ₹4 Lakh Coverage",
        explanation=LocalizedText(
            en="Never leave the family unprotected. Government micro-insurance costs less than a cup of tea per month.",
            te="ప్రభుత్వ PMSBY మరియు PMJJBY బీమా పథకాలతో ₹4 లక్షల రక్షణను బ్యాంకులో ఆటో-డెబిట్ ద్వారా పొందండి.",
            hi="PMSBY और PMJJBY से पूरे परिवार को ₹4 लाख का जीवन व दुर्घटना सुरक्षा कवच दें।",
        ),
        example=LocalizedText(
            en="An annual investment of ₹456 total provides ₹4,00,000 in security for your children.",
            te="ఏడాదికి ₹456 చెల్లింపుతో మీ పిల్లల భవిష్యత్తుకు ₹4,00,000 రక్షణ లభిస్తుంది.",
            hi="साल के मात्र ₹456 में बच्चों के भविष्य के लिए ₹4,00,000 की सुरक्षा मिलती है।",
        ),
    ),
    GoldenRuleResponse(
        rule_number=5,
        rule_key="borrow_only_for_income",
        title=LocalizedText(
            en="Rule 5: Borrow Only for Productive Income-Generating Assets",
            te="సూత్రం 5: ఆదాయాన్ని పెంచే సాధనాల కోసమే రుణం",
            hi="नियम 5: केवल कमाई बढ़ाने वाली संपत्ति के लिए ही कर्ज लें",
        ),
        short_formula="Asset Income > Loan EMI",
        explanation=LocalizedText(
            en="A good loan pays for itself through increased livelihood income. A bad loan drains kitchen savings.",
            te="మంచి రుణం ఆదాయాన్ని పెంచి కిస్తీని సులువుగా చెల్లిస్తుంది. చెడ్డ రుణం వంటగది బడ్జెట్ ను దెబ్బతీస్తుంది.",
            hi="सही कर्ज वह है जो आपकी कमाई बढ़ाकर अपनी किश्त खुद चुका दे।",
        ),
        example=LocalizedText(
            en="Borrowing ₹25,000 for a commercial sewing machine that earns ₹6,000/month is productive.",
            te="నెలకు ₹6,000 సంపాదించే కుట్టు మిషన్ కోసం ₹25,000 రుణం తీసుకోవడం సరైన నిర్ణయం.",
            hi="₹6,000 मासिक कमाई देने वाली सिलाई मशीन के लिए ₹25,000 का ऋण लेना समझदारी है।",
        ),
    ),
]


class KnowledgeService:
    """Service providing verified financial concepts and golden rules."""

    @staticmethod
    def list_concepts(category: Optional[str] = None) -> List[FinancialConceptResponse]:
        """List verified financial concepts with optional category filtering."""
        if category:
            return [c for c in CONCEPTS_DATA if c.category.lower() == category.lower()]
        return CONCEPTS_DATA

    @staticmethod
    def get_concept_by_slug(slug: str) -> Optional[FinancialConceptResponse]:
        """Get a specific financial concept by slug."""
        for c in CONCEPTS_DATA:
            if c.slug == slug or c.id == slug:
                return c
        return None

    @staticmethod
    def get_golden_rules() -> List[GoldenRuleResponse]:
        """Retrieve the official 5 Golden Rules of Sakhi."""
        return GOLDEN_RULES_DATA
