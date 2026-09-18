"""
Sakhi AI Companion Service.

Coordinates real-time financial grounding, safety guardrail inspection,
Google Gemini Generative AI communication, and localized deterministic fallbacks.
"""

from typing import Dict, Any, Optional, List
import httpx
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.logging import logger
from app.core.errors import ResourceNotFoundException
from app.models.user import User
from app.schemas.ai import (
    AIChatResponse,
    GroundingMetrics,
    ExplainConceptResponse,
)
from app.services.ai_context_builder import AIContextBuilder
from app.services.ai_guardrails import AIGuardrails
from app.services.knowledge_service import KnowledgeService


class AIService:
    """Core AI Companion and conversational reasoning service."""

    @classmethod
    def chat(
        cls,
        user_id: int,
        message: str,
        language: str = "en",
        db: Session = None,
    ) -> AIChatResponse:
        """
        Main chat handler for Ask Sakhi.
        Inspects safety, compiles live financial grounding context, calls Gemini LLM,
        or generates a deterministic grounded response.
        """
        # 1. Build Grounding Context
        grounding_data = AIContextBuilder.build_grounding_context(db=db, user_id=user_id)
        if not grounding_data:
            raise ResourceNotFoundException(message=f"User with ID {user_id} not found")

        metrics: GroundingMetrics = grounding_data["metrics"]
        followups = AIGuardrails.get_contextual_followups(language=language)

        # 2. Check Input Safety
        is_safe, safety_warning = AIGuardrails.inspect_query_safety(message=message, language=language)
        if not is_safe:
            return AIChatResponse(
                reply=safety_warning,
                language=language,
                is_fallback=True,
                grounding_metrics=metrics,
                suggested_followups=followups,
            )

        # 3. Attempt Gemini API Call if API Key configured
        if settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY.strip()) > 5:
            try:
                ai_reply = cls._call_gemini_api(
                    message=message,
                    grounding_data=grounding_data,
                    language=language,
                )
                if ai_reply:
                    return AIChatResponse(
                        reply=ai_reply,
                        language=language,
                        is_fallback=False,
                        grounding_metrics=metrics,
                        suggested_followups=followups,
                    )
            except Exception as e:
                logger.warning(f"Gemini API invocation failed, falling back to deterministic engine: {e}")

        # 4. Deterministic Grounded Fallback Response
        fallback_reply = cls._generate_grounded_fallback(
            message=message,
            grounding_data=grounding_data,
            language=language,
        )

        return AIChatResponse(
            reply=fallback_reply,
            language=language,
            is_fallback=True,
            grounding_metrics=metrics,
            suggested_followups=followups,
        )

    @classmethod
    def _call_gemini_api(
        cls,
        message: str,
        grounding_data: Dict[str, Any],
        language: str = "en",
    ) -> Optional[str]:
        """Invoke Google Gemini REST API with system instructions and grounding prompt."""
        system_instruction = AIGuardrails.get_system_prompt(language=language)
        grounding_prompt = AIContextBuilder.format_grounding_prompt(context=grounding_data)

        full_user_content = f"{grounding_prompt}\n\n### USER QUESTION:\n{message}"

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:generateContent?key={settings.GEMINI_API_KEY}"
        
        payload = {
            "system_instruction": {
                "parts": [{"text": system_instruction}]
            },
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": full_user_content}]
                }
            ],
            "generationConfig": {
                "temperature": 0.2,
                "maxOutputTokens": 600,
            }
        }

        with httpx.Client(timeout=25.0) as client:
            response = client.post(url, json=payload)
            if response.status_code == 200:
                data = response.json()
                candidates = data.get("candidates", [])
                if candidates and "content" in candidates[0]:
                    parts = candidates[0]["content"].get("parts", [])
                    if parts:
                        return parts[0].get("text", "").strip()
            else:
                logger.warning(f"Gemini API returned status {response.status_code}: {response.text}")
        
        return None

    @classmethod
    def _generate_grounded_fallback(
        cls,
        message: str,
        grounding_data: Dict[str, Any],
        language: str = "en",
    ) -> str:
        """
        Generate a rich, deterministic, mathematically accurate response based on user facts.
        """
        user: User = grounding_data["user"]
        m: GroundingMetrics = grounding_data["metrics"]
        debts = grounding_data["debts"]
        q_lower = message.lower()

        # Intent 1: Emergency Shield / Savings / Buffer
        if any(w in q_lower for w in ["saving", "savings", "balance", "emergency", "shield", "suraksha", "buffer", "ఆపత్కాల", "రక్షణ", "పొదుపు", "నిల్వ", "कवच", "आपातकालीन", "बचत"]):
            if language == "te":
                return (
                    f"నమస్తే {user.name} అక్క! మీ ప్రస్తుత పొదుపు నిల్వ **రూ. {m.current_savings:,.0f}**.\n\n"
                    f"మీ నెలవారీ ఖర్చులు రూ. {m.monthly_expenses:,.0f} కాబట్టి, మీ 3 నెలల అత్యవసర రక్షణ కవచం లక్ష్యం **రూ. {m.emergency_fund_target:,.0f}** "
                    f"({m.emergency_fund_progress_percentage:.1f}% పూర్తయింది).\n"
                    f"మీ నెలవారీ మిగులు రూ. {m.monthly_surplus:,.0f} నుండి ప్రతి నెలా రూ. {min(m.monthly_surplus, 2000):,.0f} "
                    f"పోస్టాఫీసు లేదా బ్యాంకులో జమ చేస్తే సులభంగా రక్షణ కవచం చేరుకోవచ్చు!"
                )
            elif language == "hi":
                return (
                    f"नमस्ते {user.name} दीदी! आपकी वर्तमान बचत **₹{m.current_savings:,.0f}** है।\n\n"
                    f"आपके मासिक खर्च ₹{m.monthly_expenses:,.0f} के आधार पर आपका 3 महीने का सुरक्षा कवच लक्ष्य **₹{m.emergency_fund_target:,.0f}** "
                    f"({m.emergency_fund_progress_percentage:.1f}% पूर्ण) है।\n"
                    f"अपनी मासिक बचत (₹{m.monthly_surplus:,.0f}) में से डाकघर बचत खाते या बैंक में नियमित रूप से जमा करके इसे पूरा करें।"
                )
            return (
                f"Namaste {user.name}! Your current savings balance is **₹{m.current_savings:,.0f}**.\n\n"
                f"Based on your monthly living expenses of ₹{m.monthly_expenses:,.0f}, your 3-month Emergency Shield buffer target is **₹{m.emergency_fund_target:,.0f}** "
                f"({m.emergency_fund_progress_percentage:.1f}% reached). "
                f"With your monthly disposable surplus of ₹{m.monthly_surplus:,.0f}, you can allocate a disciplined portion to reach full safety quickly!"
            )

        # Intent 2: Debt / Moneylender / Interest / Loan / SHG Refinance
        if any(w in q_lower for w in ["debt", "moneylender", "loan", "interest", "refinance", "రుణం", "అప్పు", "వడ్డీ", "कर्ज़", "ब्याज"]):
            if debts:
                highest_debt = max(debts, key=lambda d: d.annual_interest_rate)
                if language == "te":
                    return (
                        f"అక్క, ప్రస్తుతం మీ మొత్తం అప్పు **రూ. {m.total_debt:,.0f}**, దీనికి నెలకు సుమారు రూ. {m.monthly_interest_drain:,.0f} వడ్డీ ఖర్చవుతోంది.\n\n"
                        f"ముఖ్యంగా '{highest_debt.lender_name}' అప్పుపై {highest_debt.annual_interest_rate:.1f}% వడ్డీ పడుతోంది. "
                        f"దీనిని మీ SHG సంఘం ద్వారా 12% వార్షిక వడ్డీకి మార్చుకుంటే నెలకు వందల రూపాయల వడ్డీ ఆదా అవుతుంది!"
                    )
                elif language == "hi":
                    return (
                        f"दीदी, वर्तमान में आपका कुल कर्ज़ **₹{m.total_debt:,.0f}** है, जिस पर हर महीने लगभग ₹{m.monthly_interest_drain:,.0f} ब्याज कट रहा है।\n\n"
                        f"विशेष रूप से '{highest_debt.lender_name}' का कर्ज़ {highest_debt.annual_interest_rate:.1f}% ब्याज दर पर है। "
                        f"इसे स्वयं सहायता समूह (SHG) के 12% सस्ते ऋण से तुरंत चुकाने का प्रयास करें।"
                    )
                return (
                    f"Sister, you currently have **₹{m.total_debt:,.0f}** in active debt with a monthly interest drain of ₹{m.monthly_interest_drain:,.0f}/mo.\n\n"
                    f"Your highest interest loan is with '{highest_debt.lender_name}' at {highest_debt.annual_interest_rate:.1f}% APR. "
                    f"By refinancing this debt through your SHG Sangham at 12% APR, you can save significant monthly interest and become debt-free faster!"
                )
            elif m.total_debt > 0:
                if language == "te":
                    return (
                        f"అక్క, మీ ప్రొఫైల్ ప్రకారం మీ మొత్తం అప్పు **రూ. {m.total_debt:,.0f}** గా నమోదై ఉంది.\n\n"
                        f"ఖచ్చితమైన వడ్డీ రేట్లు మరియు సంఘం ద్వారా రీఫైనాన్స్ ప్రణాళికను పొందడానికి మీ అప్పు వివరాలను నమోదు చేయండి."
                    )
                elif language == "hi":
                    return (
                        f"दीदी, आपकी प्रोफ़ाइल के अनुसार आपका कुल कर्ज़ **₹{m.total_debt:,.0f}** दर्ज है।\n\n"
                        f"सटीक ब्याज दर और बचत योजना जानने के लिए अपने कर्ज़ का विस्तृत विवरण जोड़ें।"
                    )
                return (
                    f"Sister, your profile records a total outstanding debt of **₹{m.total_debt:,.0f}**.\n\n"
                    f"To see a personalized payoff and SHG refinancing plan, you can log the specific loan details in your debt tracker."
                )
            else:
                if language == "te":
                    return f"అభినందనలు {user.name} అక్క! మీకు ఎటువంటి అప్పులు లేవు. మీ మిగులు రూ. {m.monthly_surplus:,.0f} ను లక్ష్యాల కోసం పొదుపు చేయవచ్చు."
                elif language == "hi":
                    return f"बधाई हो {user.name} दीदी! आप पर कोई कर्ज़ नहीं है। आप अपनी मासिक बचत ₹{m.monthly_surplus:,.0f} को अपने लक्ष्यों के लिए जोड़ सकती हैं।"
                return f"Wonderful news, {user.name}! You currently have zero debt. You can direct your monthly surplus of ₹{m.monthly_surplus:,.0f} toward your savings goals."


        # Intent 3: Government Schemes / Insurance / Entitlements
        if any(w in q_lower for w in ["scheme", "pmsby", "pmjjby", "stree nidhi", "mudra", "పథకం", "బీమా", "योजना", "बीमा"]):
            if language == "te":
                return (
                    f"{user.name} అక్క, మీ ప్రొఫైల్ ప్రకారం మీరు **{m.matched_schemes_count} ప్రభుత్వ మరియు సంఘ పథకాలకు** 100% అర్హులు!\n\n"
                    f"1. **PMSBY (రూ. 20/సంవత్సరం)**: రూ. 2 లక్షల ప్రమాద బీమా.\n"
                    f"2. **PMJJBY (రూ. 436/సంవత్సరం)**: రూ. 2 లక్షల జీవిత బీమా.\n"
                    f"3. **స్త్రీనిధి / వెలుగు SHG లోన్**: వ్యాపారం కోసం 11%-12% తక్కువ వడ్డీ రుణం.\n"
                    f"మీ సమీప బ్యాంక్ మిత్ర లేదా గ్రామ సంఘం (VO) లో దరఖాస్తు చేసుకోవచ్చు."
                )
            elif language == "hi":
                return (
                    f"{user.name} दीदी, आपकी जानकारी के अनुसार आप **{m.matched_schemes_count} सरकारी व SHG योजनाओं** के लिए 100% पात्र हैं!\n\n"
                    f"1. **PMSBY (₹20/वर्ष)**: ₹2 लाख का दुर्घटना सुरक्षा बीमा।\n"
                    f"2. **PMJJBY (₹436/वर्ष)**: ₹2 लाख का जीवन बीमा।\n"
                    f"3. **पीएम मुद्रा व स्त्री निधि**: आजीविका बढ़ाने के लिए सस्ता ऋण।\n"
                    f"अपने नज़दीकी बैंक मित्र या सीएससी केंद्र से संपर्क करें।"
                )
            return (
                f"{user.name}, you are 100% matched for **{m.matched_schemes_count} verified Government & SHG welfare schemes**!\n\n"
                f"1. **PMSBY (₹20 / year)**: ₹2 Lakh Accidental Death & Disability Cover.\n"
                f"2. **PMJJBY (₹436 / year)**: ₹2 Lakh Life Insurance.\n"
                f"3. **Stree Nidhi / Mudra**: Subsidized low-interest business & SHG micro-credit.\n"
                f"You can enroll immediately at your nearest Bank Mitra (CSP) or Gram Panchayat office."
            )

        # Default / Cashflow / General advice
        if language == "te":
            return (
                f"నమస్తే {user.name} అక్క! మీరు ప్రస్తుతం ఆర్థిక ప్రయాణంలో **స్టేజ్ {m.current_stage} ({m.current_stage_title})** లో ఉన్నారు.\n\n"
                f"- నెలవారీ ఆదాయం: రూ. {m.monthly_income:,.0f}\n"
                f"- ఖర్చులు: రూ. {m.monthly_expenses:,.0f}\n"
                f"- చేతిలో మిగిలే మిగులు: **రూ. {m.monthly_surplus:,.0f} / నెల**\n\n"
                f"మీ పొదుపు, అప్పుల విముక్తి లేదా ప్రభుత్వ పథకాల గురించి నన్ను ఏదైనా అడగవచ్చు!"
            )
        elif language == "hi":
            return (
                f"नमस्ते {user.name} दीदी! आप वित्तीय स्वतंत्रता की **स्टेज {m.current_stage} ({m.current_stage_title})** पर हैं।\n\n"
                f"- मासिक आय: ₹{m.monthly_income:,.0f}\n"
                f"- मासिक खर्च: ₹{m.monthly_expenses:,.0f}\n"
                f"- बचत हेतु उपलब्ध अधिशेष: **₹{m.monthly_surplus:,.0f} / महीना**\n\n"
                f"आप मुझसे बचत, कर्ज़ मुक्ति या सरकारी योजनाओं के बारे में कोई भी सवाल पूछ सकती हैं!"
            )
        return (
            f"Namaste {user.name}! You are currently at **Stage {m.current_stage} ({m.current_stage_title})** on your Financial Freedom Roadmap.\n\n"
            f"- Monthly Income: ₹{m.monthly_income:,.0f}\n"
            f"- Monthly Expenses: ₹{m.monthly_expenses:,.0f}\n"
            f"- Disposable Monthly Surplus: **₹{m.monthly_surplus:,.0f} / month**\n\n"
            f"Feel free to ask me anything about building your Emergency Shield, refinancing high-interest moneylender debts, or claiming government welfare benefits!"
        )

    @classmethod
    def explain_concept(
        cls,
        concept_slug: str,
        language: str = "en",
    ) -> ExplainConceptResponse:
        """Provide a simplified, conversational explanation of a financial concept."""
        concept = KnowledgeService.get_concept_by_slug(concept_slug)
        if not concept:
            raise ResourceNotFoundException(message=f"Financial concept '{concept_slug}' not found")

        lang = language.lower()
        if lang.startswith("te"):
            title = concept.title.te
            expl = concept.plain_language_explanation.te
            eg = concept.practical_action.te
        elif lang.startswith("hi"):
            title = concept.title.hi
            expl = concept.plain_language_explanation.hi
            eg = concept.practical_action.hi
        else:
            title = concept.title.en
            expl = concept.plain_language_explanation.en
            eg = concept.practical_action.en

        golden_rule_text = None
        # Link related golden rules
        rules = KnowledgeService.get_golden_rules()
        if concept.slug == "suraksha-kavach-emergency-buffer":
            r = rules[0]
            golden_rule_text = f"Golden Rule #1: {r.short_formula}"
        elif concept.slug == "debt-snowball-moneylender-escape":
            r = rules[1]
            golden_rule_text = f"Golden Rule #2: {r.short_formula}"
        elif concept.slug == "pay-yourself-first-recurring-savings":
            r = rules[2]
            golden_rule_text = f"Golden Rule #3: {r.short_formula}"
        elif concept.slug == "social-security-micro-insurance":
            r = rules[3]
            golden_rule_text = f"Golden Rule #4: {r.short_formula}"
        elif concept.slug == "productive-vs-unproductive-borrowing":
            r = rules[4]
            golden_rule_text = f"Golden Rule #5: {r.short_formula}"

        return ExplainConceptResponse(
            concept_slug=concept.slug,
            title=title,
            explanation=expl,
            practical_example=eg,
            golden_rule=golden_rule_text,
            language=language,
        )

