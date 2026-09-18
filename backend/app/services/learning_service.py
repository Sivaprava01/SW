"""
Sakhi Learning Service & Multilingual Educational Catalog.

Provides structured audio micro-lessons, quizzes, and tracks user progress.
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.learning import UserLearningProgress
from app.schemas.knowledge import LocalizedText
from app.schemas.learning import (
    ModuleResponse,
    LessonResponse,
    QuizQuestion,
    LessonCompleteRequest,
    UserLessonProgressResponse,
    UserLearningSummaryResponse,
)
from app.core.logging import logger


LEARNING_MODULES_CATALOG: List[ModuleResponse] = [
    ModuleResponse(
        module_id="mod-1-cashflow",
        category="Cashflow & Budgeting",
        title=LocalizedText(
            en="Daily Cashflow & Awareness",
            te="దైనందిన నగదు ప్రవాహం & అవగాహన",
            hi="दैनिक आय-व्यय और बजट प्रबंधन",
        ),
        description=LocalizedText(
            en="Master the habit of tracking every rupee that enters and leaves your household.",
            te="ఇంట్లోకి వచ్చే ప్రతి రూపాయిని, ఖర్చయ్యే ప్రతి పైసాని లెక్కలో ఉంచుకోవడం నేర్చుకోండి.",
            hi="घर में आने वाले हर रुपये और होने वाले हर खर्च का सही हिसाब रखना सीखें।",
        ),
        icon="wallet",
        total_lessons=2,
        lessons=[
            LessonResponse(
                lesson_id="les-1-1-income-expense",
                title=LocalizedText(
                    en="Separating Income from Expenses",
                    te="ఆదాయం మరియు ఖర్చుల విభజన",
                    hi="आय और खर्च को अलग करना",
                ),
                duration_minutes=3,
                audio_narration_script=LocalizedText(
                    en="Namaste! When you receive money from tailoring or milk sales, do not mix business cash with kitchen spending. Track your exact monthly income so you always know your true disposable surplus.",
                    te="నమస్తే! కుట్టు పనులు లేదా పాల అమ్మకాల ద్వారా వచ్చే ఆదాయాన్ని ఇంటి ఖర్చులతో కలపకండి. మీ నిజమైన నెలవారీ మిగులు ఎంతో తెలుసుకోవడానికి ఖర్చులను సరిగ్గా నమోదు చేయండి.",
                    hi="नमस्ते! सिलाई या दूध की बिक्री से आने वाले पैसे को घर के खर्च से अलग रखें। अपनी असली बचत जानने के लिए रोज का हिसाब डायरी में लिखें।",
                ),
                key_takeaways=[
                    LocalizedText(
                        en="Keep a small pocket notebook for daily vegetable, fuel, and grocery expenses.",
                        te="రోజువారీ కూరగాయలు, నిత్యావసరాల ఖర్చులను ఒక చిన్న పుస్తకంలో రాయండి.",
                        hi="रोज के छोटे-मोटे खर्चों के लिए एक छोटी डायरी रखें।",
                    ),
                    LocalizedText(
                        en="Disposable Surplus = Monthly Income - Monthly Essential Expenses.",
                        te="నెలవారీ మిగులు = నెలవారీ ఆదాయం - నిత్యావసర ఖర్చులు.",
                        hi="मासिक बचत = मासिक आमदनी - जरूरी मासिक खर्च।",
                    ),
                ],
                quiz=QuizQuestion(
                    question=LocalizedText(
                        en="What is Disposable Surplus?",
                        te="నెలవారీ మిగులు అంటే ఏమిటి?",
                        hi="मासिक बचत (डिस्पोजेबल सरप्लस) क्या है?",
                    ),
                    options=[
                        LocalizedText(en="Total monthly income without deducting expenses", te="ఖర్చులు తీసివేయకుండా మొత్తం ఆదాయం", hi="बिना खर्चे काटे कुल आमदनी"),
                        LocalizedText(en="Income minus essential household expenses", te="ఆదాయం నుండి నిత్యావసర ఖర్చులు తీసివేయగా మిగిలినది", hi="कुल आमदनी में से जरूरी खर्चे घटाने के बाद बची रकम"),
                        LocalizedText(en="Money borrowed from moneylenders", te="వడ్డీ వ్యాపారి నుండి తెచ్చిన అప్పు", hi="साहूकार से लिया गया कर्ज"),
                    ],
                    correct_option_index=1,
                    explanation=LocalizedText(
                        en="Correct! Surplus is the safe money left over after paying essential household bills.",
                        te="సరైన సమాధానం! కుటుంబ నిత్యావసరాలు పోగా మిగిలిన సురక్షితమైన మొత్తమే మిగులు.",
                        hi="सही उत्तर! जरूरी खर्चे निकालने के बाद जो बचता है, वही आपकी असली बचत है।",
                    ),
                ),
            ),
            LessonResponse(
                lesson_id="les-1-2-need-vs-want",
                title=LocalizedText(
                    en="Needs vs Wants (The 70/30 Rule)",
                    te="అవసరాలు vs కోరికలు (70/30 సూత్రం)",
                    hi="जरूरतें बनाम इच्छाएं (70/30 का नियम)",
                ),
                duration_minutes=3,
                audio_narration_script=LocalizedText(
                    en="Essential Needs are groceries, school fees, and rent. Wants are fancy clothes or festival splurges. Keep essential needs under 70% of your income so you have 30% available for savings.",
                    te="ఆహారం, పిల్లల చదువు, అద్దె అనేవి అవసరాలు. ఆడంబరాలు కోరికలు. నిత్యావసరాలను ఆదాయంలో 70% లోపే ఉంచండి, తద్వారా 30% పొదుపు చేయవచ్చు.",
                    hi="अन्न, बच्चों की फीस और किराया जरूरी हैं। दिखावा और फिजूलखर्ची इच्छाएं हैं। जरूरी खर्चों को आमदनी के 70% के अंदर रखें।",
                ),
                key_takeaways=[
                    LocalizedText(
                        en="Prioritize essential kitchen budget over impulse festival loans.",
                        te="పండుగల కోసం అప్పులు చేయకుండా కనీస బడ్జెట్ కు ప్రాధాన్యత ఇవ్వండి.",
                        hi="दिखावे के लिए कर्ज लेने से बचें और जरूरी चीजों को प्राथमिकता दें।",
                    ),
                ],
            ),
        ],
    ),
    ModuleResponse(
        module_id="mod-2-emergency-shield",
        category="Emergency Shield (Suraksha Kavach)",
        title=LocalizedText(
            en="Building Your Emergency Shield",
            te="అత్యవసర రక్షణ నిధి నిర్మాణం",
            hi="आपातकालीन सुरक्षा कवच का निर्माण",
        ),
        description=LocalizedText(
            en="How to create a 3-month living expense safety cushion in a Post Office or bank account.",
            te="పోస్టాఫీస్ లేదా బ్యాంకులో 3 నెలల ఖర్చుల రక్షణ నిధిని ఎలా సమకూర్చుకోవాలో తెలుసుకోండి.",
            hi="डाकघर या बैंक में 3 महीने के खर्च का सुरक्षा कोष कैसे तैयार करें।",
        ),
        icon="shield-check",
        total_lessons=2,
        lessons=[
            LessonResponse(
                lesson_id="les-2-1-why-emergency-fund",
                title=LocalizedText(
                    en="Why You Need 3 Months of Expenses",
                    te="3 నెలల రక్షణ నిధి ఎందుకు అవసరం?",
                    hi="3 महीने का इमरजेंसी फंड क्यों जरूरी है?",
                ),
                duration_minutes=4,
                audio_narration_script=LocalizedText(
                    en="When sudden illness occurs, families without savings are forced to borrow from moneylenders at 36% to 60% interest. Your emergency fund breaks this debt trap completely.",
                    te="ఆకస్మిక అనారోగ్యం వచ్చినప్పుడు పొదుపు లేకపోతే అధిక వడ్డీ వ్యాపారుల వద్ద అప్పు చేయాల్సి వస్తుంది. అత్యవసర నిధి మిమ్మల్ని ఈ అప్పుల ఊబి నుండి కాపాడుతుంది.",
                    hi="अचानक बीमारी आने पर बचत न होने के कारण साहूकार से भारी ब्याज पर कर्ज लेना पड़ता है। इमरजेंसी फंड आपको इस जाल से बचाता है।",
                ),
                key_takeaways=[
                    LocalizedText(
                        en="Target = Monthly Expenses × 3.",
                        te="లక్ష్యం = నెలవారీ ఖర్చులు × 3.",
                        hi="लक्ष्य = मासिक खर्च × 3।",
                    ),
                ],
            ),
            LessonResponse(
                lesson_id="les-2-2-where-to-keep-it",
                title=LocalizedText(
                    en="Where to Keep Your Emergency Fund",
                    te="అత్యవసర నిధిని ఎక్కడ దాచుకోవాలి?",
                    hi="इमरजेंसी फंड कहां रखें?",
                ),
                duration_minutes=3,
                audio_narration_script=LocalizedText(
                    en="Keep emergency cash in a formal bank account with ATM card or a Post Office Savings account. Never put it into speculative chit funds or unbanked cash that can get stolen or spent.",
                    te="ఈ నిధిని ఏటీఎం సౌకర్యం ఉన్న బ్యాంకు ఖాతాలో లేదా పోస్టాఫీసులో భద్రపరచండి. అనధికార చిట్టీలలో పెట్టకండి.",
                    hi="यह पैसा ऐसे बैंक खाते में रखें जहां एटीएम हो, ताकि जरूरत पड़ने पर तुरंत निकाला जा सके।",
                ),
                key_takeaways=[
                    LocalizedText(
                        en="Safety and immediate liquidity are more important than high return for emergency funds.",
                        te="అత్యవసర నిధి విషయంలో ఎక్కువ రాబడి కన్నా భద్రత, అవసరమైనప్పుడు వెంటనే అందడం ముఖ్యం.",
                        hi="इमरजेंसी फंड के लिए सुरक्षा और तुरंत उपलब्धता सबसे महत्वपूर्ण है।",
                    ),
                ],
            ),
        ],
    ),
    ModuleResponse(
        module_id="mod-3-debt-freedom",
        category="Debt Management",
        title=LocalizedText(
            en="Eliminating High-Cost Debt",
            te="అధిక వడ్డీ అప్పుల నుండి విముక్తి",
            hi="महंगे कर्ज से आजादी",
        ),
        description=LocalizedText(
            en="Techniques to refinance moneylender debt using SHG / Stree Nidhi credit and the snowball payoff method.",
            te="సంఘం (SHG) రుణాలు మరియు స్నోబాల్ పద్ధతి ద్వారా ప్రైవేట్ అప్పులను త్వరగా తీర్చే మార్గాలు.",
            hi="SHG ऋण और स्नोबॉल तकनीक से साहूकारी कर्ज तेजी से चुकाने के उपाय।",
        ),
        icon="trending-down",
        total_lessons=2,
        lessons=[
            LessonResponse(
                lesson_id="les-3-1-interest-drain-math",
                title=LocalizedText(
                    en="The Hidden Drain of ₹3/Month Interest",
                    te="నెలకు ₹3 వడ్డీలోని నష్టాలు",
                    hi="₹3 सैकड़ा ब्याज का असली नुकसान",
                ),
                duration_minutes=3,
                audio_narration_script=LocalizedText(
                    en="Borrowing ₹20,000 at ₹3 per ₹100 every month means you pay ₹7,200 every year just in interest! That is enough money to buy two commercial sewing machines.",
                    te="₹20,000 అప్పుకు నెలకు ₹3 వడ్డీ అంటే ఏడాదికి ₹7,200 వడ్డీ మాత్రమే చెల్లిస్తున్నారు! ఆ డబ్బుతో రెండు కుట్టు మిషన్లు కొనవచ్చు.",
                    hi="₹20,000 के कर्ज पर ₹3 प्रति सैकड़ा के हिसाब से आप साल में ₹7,200 सिर्फ ब्याज भरते हैं!",
                ),
                key_takeaways=[
                    LocalizedText(
                        en="Moneylender 3% monthly = 36% APR. SHG bank credit = 12% APR.",
                        te="వడ్డీ వ్యాపారి 3% నెలకు = ఏడాదికి 36%. సంఘం బ్యాంకు రుణం = ఏడాదికి కేవలం 12%.",
                        hi="साहूकार का 3% मासिक = 36% सालाना। SHG बैंक ऋण = मात्र 12% सालाना।",
                    ),
                ],
            ),
            LessonResponse(
                lesson_id="les-3-2-shg-refinance-step",
                title=LocalizedText(
                    en="How to Refinance via Your SHG",
                    te="మీ పొదుపు సంఘం (SHG) ద్వారా రుణం మార్పిడి",
                    hi="स्वयं सहायता समूह से सस्ता ऋण कैसे लें",
                ),
                duration_minutes=4,
                audio_narration_script=LocalizedText(
                    en="Speak to your SHG VO (Village Organization) or Stree Nidhi coordinator. Take a formal institutional loan at 12% APR to pay off the private moneylender completely.",
                    te="మీ గ్రామైఖ్య సంఘం (VO) లేదా స్త్రీ నిధి ప్రతినిధితో మాట్లాడి తక్కువ వడ్డీతో రుణం పొంది ప్రైవేట్ అప్పును ఒకేసారి చెల్లించండి.",
                    hi="अपनी समूह सखी या बैंक सखी से बात करके 12% ब्याज पर समूह ऋण लें और साहूकार का पूरा कर्ज चुकता करें।",
                ),
                key_takeaways=[
                    LocalizedText(
                        en="Refinancing saves ₹300–₹500 every month in interest drain.",
                        te="రుణ మార్పిడి ద్వారా నెలకు ₹300 నుండి ₹500 వరకు వడ్డీ ఆదా అవుతుంది.",
                        hi="कर्ज बदलने से हर महीने ₹300 से ₹500 की सीधी बचत होती है।",
                    ),
                ],
            ),
        ],
    ),
]


class LearningService:
    """Service handling learning modules catalog and progress persistence."""

    @staticmethod
    def list_modules() -> List[ModuleResponse]:
        """List all educational modules with their lessons."""
        return LEARNING_MODULES_CATALOG

    @staticmethod
    def get_module_by_id(module_id: str) -> Optional[ModuleResponse]:
        """Fetch a specific module by ID."""
        for m in LEARNING_MODULES_CATALOG:
            if m.module_id == module_id:
                return m
        return None

    @staticmethod
    def get_lesson_by_id(lesson_id: str) -> Optional[LessonResponse]:
        """Fetch a specific lesson across all modules."""
        for m in LEARNING_MODULES_CATALOG:
            for l in m.lessons:
                if l.lesson_id == lesson_id:
                    return l
        return None

    @staticmethod
    def mark_lesson_complete(
        db: Session,
        user_id: int,
        lesson_id: str,
        complete_in: LessonCompleteRequest,
    ) -> Optional[UserLessonProgressResponse]:
        """Record or update lesson completion for a user."""
        # Find which module contains this lesson
        module_id = None
        for m in LEARNING_MODULES_CATALOG:
            for l in m.lessons:
                if l.lesson_id == lesson_id:
                    module_id = m.module_id
                    break
            if module_id:
                break

        if not module_id:
            return None

        stmt = select(UserLearningProgress).where(
            UserLearningProgress.user_id == user_id,
            UserLearningProgress.lesson_id == lesson_id,
        )
        progress = db.execute(stmt).scalar_one_or_none()

        if not progress:
            progress = UserLearningProgress(
                user_id=user_id,
                module_id=module_id,
                lesson_id=lesson_id,
                is_completed=True,
                quiz_score=complete_in.quiz_score,
            )
            db.add(progress)
        else:
            progress.is_completed = True
            if complete_in.quiz_score is not None:
                progress.quiz_score = complete_in.quiz_score

        db.commit()
        db.refresh(progress)
        logger.info(f"User id={user_id} completed lesson '{lesson_id}' (Quiz Score: {progress.quiz_score})")
        return UserLessonProgressResponse.model_validate(progress)

    @staticmethod
    def get_user_learning_summary(db: Session, user_id: int) -> UserLearningSummaryResponse:
        """Calculate overall learning progress percentage across all available lessons."""
        total_lessons = sum(len(m.lessons) for m in LEARNING_MODULES_CATALOG)

        stmt = select(UserLearningProgress).where(
            UserLearningProgress.user_id == user_id,
            UserLearningProgress.is_completed == True,
        )
        completed_records = list(db.execute(stmt).scalars().all())
        completed_ids = [r.lesson_id for r in completed_records]
        completed_count = len(completed_ids)

        progress_pct = round((completed_count / total_lessons) * 100.0, 1) if total_lessons > 0 else 0.0

        return UserLearningSummaryResponse(
            user_id=user_id,
            total_available_lessons=total_lessons,
            completed_lessons_count=completed_count,
            overall_progress_percentage=progress_pct,
            completed_lesson_ids=completed_ids,
        )
