import logging
import json
from typing import Dict, Any, Optional
from app.config import settings
from app.schemas.ai import FinancialContextPayload, AIChatResponse

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are Sakhi, a warm, caring, and trustworthy financial education companion designed specifically for rural women and people with limited financial literacy in India.

Your Core Role:
- Help users understand their financial situation in simple, respectful, and reassuring language.
- You are NOT a bank, financial advisor, investment broker, or government authority.
- The backend financial calculations provided to you in the context are authoritative and 100% accurate.

Strict Rules:
1. NEVER invent, modify, or independently recalculate financial numbers. Always use the numbers from the user's Financial Context (income, expenses, surplus, savings, debt, goal, monthly required savings).
2. Use clear, simple, jargon-free words. If you mention a term like "Emergency Fund" or "Surplus", explain it like a village elder or sister would (e.g., "Aapka Suraksha Kavach - emergency money kept safe in the bank", "Surplus is what remains after household expenses").
3. When discussing government schemes, clearly state that Sakhi provides a preliminary match, and encourage verification at official sources (Gram Panchayat, bank, or official portal).
4. Be empathetic and supportive. When debt is high, do not panic the user; gently encourage prioritizing clearing high-interest debt with a portion of their surplus.
5. Keep answers short, direct, and actionable (maximum 3-4 short paragraphs or bullet points).
"""

def generate_fallback_reply(message: str, ctx: FinancialContextPayload, language: str = "en") -> str:
    """
    High quality deterministic fallback explanation when external AI APIs are not configured or offline.
    Uses exact backend-calculated financial metrics and supports en, hi, te languages.
    """
    msg_lower = message.lower()
    name = ctx.name
    surplus = int(ctx.surplus)
    debt = int(ctx.debt)
    savings = int(ctx.savings)
    income = int(ctx.income)
    expenses = int(ctx.expenses)
    stage = ctx.current_journey_stage
    state = ctx.state or "All India"
    is_shg = ctx.is_shg_member
    lang = (language or ctx.language or "en").lower()

    # Determine topic
    is_debt = any(k in msg_lower for k in ["debt", "karz", "loan", "rnam", "udhhar", "byaj", "vaddi"])
    is_saving = any(k in msg_lower for k in ["save", "saving", "bachat", "surplus", "podupu", "goal", "target"])
    is_scheme_or_biz = any(k in msg_lower for k in ["business", "tailor", "shop", "mudra", "scheme", "yojana", "pathakam", "sarkar", "government", "shg", "sangham", "lakhpati", "support", "help"])
    is_emergency = any(k in msg_lower for k in ["emergency", "kavach", "safety", "apathkarana", "suraksha"])

    repayment_suggestion = min(surplus, max(1000, int(surplus * 0.6))) if surplus > 0 else 500
    ef_target = int(ctx.emergency_fund.get("target", 0))
    ef_remaining = int(ctx.emergency_fund.get("remaining", 0))

    goal_name = ctx.primary_goal.get("name", "your goal") if ctx.primary_goal else ""
    goal_target = int(ctx.primary_goal.get("target_amount", 0)) if ctx.primary_goal else 0
    monthly_req = int(ctx.primary_goal.get("monthly_saving_required", 0)) if ctx.primary_goal else 0

    # HINDI TEMPLATES
    if lang == "hi":
        if is_debt:
            if debt > 0:
                return (
                    f"नमस्ते {name}! आपके पास अभी ₹{debt:,} का कर्ज़ दर्ज है। "
                    f"आपकी मासिक बचत (सरप्लस) ₹{surplus:,} है, इसलिए आप हर महीने लगभग ₹{repayment_suggestion:,} "
                    f"कर्ज़ चुकाने के लिए अलग रख सकती हैं। हमेशा अधिक ब्याज वाले कर्ज़ को पहले चुकाएं।"
                )
            return f"नमस्ते {name}! बहुत अच्छी बात है: आपके पास कोई कर्ज़ दर्ज नहीं है। आप अपनी पूरी बचत अपने लक्ष्यों और सुरक्षा कवच में लगा सकती हैं!"

        if is_saving:
            if ctx.primary_goal:
                return (
                    f"नमस्ते {name}! आपकी मासिक आय ₹{income:,} और खर्च ₹{expenses:,} है, जिससे ₹{surplus:,} की बचत होती है। "
                    f"आपके लक्ष्य '{goal_name}' (कुल ₹{goal_target:,}) के लिए आपको हर महीने **₹{monthly_req:,}** बचाने की आवश्यकता है। "
                    f"यह आपकी बचत से आसानी से संभव है और इसके बाद भी आपके पास ₹{max(0, surplus - monthly_req):,} बचेंगे।"
                )
            return (
                f"नमस्ते {name}! आप ₹{income:,} कमाती हैं और ₹{expenses:,} खर्च करती हैं, जिससे ₹{surplus:,} बचते हैं। "
                f"इसमें से कम से कम ₹{int(surplus / 2):,} अपने सुरक्षा कवच (इमरजेंसी फंड) के लिए बैंक या पोस्ट ऑफिस में सुरक्षित रखें।"
            )

        if is_scheme_or_biz:
            shg_text = "आपके स्वयं सहायता समूह (SHG) के माध्यम से लखपति दीदी पहल" if is_shg else "प्रधानमंत्री मुद्रा योजना"
            state_text = " तथा तेलंगाना में स्त्री निधि योजना" if "telangana" in state.lower() else ""
            return (
                f"नमस्ते {name}! महिलाओं के आर्थिक सशक्तिकरण के लिए कई सरकारी योजनाएं उपलब्ध हैं। "
                f"आप **{shg_text}**{state_text} का लाभ उठा सकती हैं। "
                f"विस्तृत पात्रता और आधिकारिक लिंक के लिए ऐप के 'सरकारी योजनाएं' टैब पर जाएं।"
            )

        if is_emergency:
            return (
                f"नमस्ते {name}! आपातकालीन सुरक्षा कवच आपके परिवार की ढाल है। "
                f"आपके ₹{expenses:,} मासिक खर्च के आधार पर 3 महीने का सुरक्षा कवच ₹{ef_target:,} होना चाहिए। "
                f"आपके पास ₹{savings:,} जमा हैं, पूरी सुरक्षा के लिए केवल ₹{ef_remaining:,} और चाहिए।"
            )

        # Hindi General
        goal_txt = f" और आप '{goal_name}' लक्ष्य पर काम कर रही हैं" if ctx.primary_goal else ""
        return (
            f"नमस्ते {name}! मैं आपकी सखी हूँ। "
            f"आपकी मासिक आय ₹{income:,} और खर्च ₹{expenses:,} है, जिससे ₹{surplus:,} की बचत होती है। "
            f"आप अपनी वित्तीय यात्रा के **{stage}** चरण पर हैं{goal_txt}। "
            f"मैं आपके पैसे, बचत या सरकारी योजनाओं को समझने में कैसे मदद कर सकती हूँ?"
        )

    # TELUGU TEMPLATES
    if lang == "te":
        if is_debt:
            if debt > 0:
                return (
                    f"నమస్తే {name}! మీకు ప్రస్తుతం ₹{debt:,} అప్పు ఉంది. "
                    f"మీ నెలవారీ మిగులు ₹{surplus:,} కాబట్టి, ప్రతి నెలా సుమారు ₹{repayment_suggestion:,} "
                    f"అప్పు తీర్చడానికి కేటాయించవచ్చు. ఎక్కువ వడ్డీ ఉన్న అప్పులను ముందుగా చెల్లించండి."
                )
            return f"నమస్తే {name}! శుభవార్త: మీపై ఎటువంటి అప్పులు లేవు. మీరు మీ పూర్తి పొదుపును అత్యవసర నిధి మరియు కలల కోసం ఉపయోగించవచ్చు!"

        if is_saving:
            if ctx.primary_goal:
                return (
                    f"నమస్తే {name}! మీ నెలవారీ ఆదాయం ₹{income:,}, ఖర్చులు ₹{expenses:,}, మిగులు ₹{surplus:,}. "
                    f"మీ లక్ష్యం '{goal_name}' (మొత్తం ₹{goal_target:,}) కోసం నెలకు **₹{monthly_req:,}** పొదుపు చేయాలి. "
                    f"ఇది మీరు సులభంగా సాధించవచ్చు. దీని తర్వాత కూడా మీకు ₹{max(0, surplus - monthly_req):,} మిగులు ఉంటుంది."
                )
            return (
                f"నమస్తే {name}! మీ నెల ఆదాయం ₹{income:,}, ఖర్చులు ₹{expenses:,}. నెలకు ₹{surplus:,} మిగులుతుంది. "
                f"ఇందులో కనీసం సగం (₹{int(surplus / 2):,}) మీ అత్యవసర నిధి కోసం పోస్ట్ ఆఫీస్ లేదా బ్యాంకులో దాచుకోండి."
            )

        if is_scheme_or_biz:
            shg_text = "మీ స్వయం సహాయక సంఘం (SHG) ద్వారా లఖ్‌పతి దీదీ మరియు స్త్రీ నిధి" if is_shg else "ప్రధాన మంత్రి ముద్ర యోజన"
            state_text = " (తెలంగాణ పథకాలు)" if "telangana" in state.lower() else ""
            return (
                f"నమస్తే {name}! కొత్త పని లేదా వ్యాపారానికి ప్రభుత్వం అనేక సహాయ పథకాలను అందిస్తోంది. "
                f"మీరు **{shg_text}**{state_text} పథకాలను పరిశీలించవచ్చు. "
                f"అధికారిక వివరాలు మరియు దరఖాస్తు కోసం 'పథకాలు' ట్యాబ్ చూడండి."
            )

        if is_emergency:
            return (
                f"నమస్తే {name}! అత్యవసర నిధి మీ కుటుంబానికి రక్షణ కవచం. "
                f"మీ ₹{expenses:,} నెలవారీ ఖర్చుల ఆధారంగా 3 నెలల రక్షణ నిధి ₹{ef_target:,} ఉండాలి. "
                f"మీ వద్ద ఇప్పటికే ₹{savings:,} ఉన్నాయి. పూర్తి రక్షణ కోసం ఇంకా ₹{ef_remaining:,} మాత్రమే అవసరం."
            )

        # Telugu General
        goal_txt = f" మరియు మీరు '{goal_name}' లక్ష్యం వైపు సాగుతున్నారు" if ctx.primary_goal else ""
        return (
            f"నమస్తే {name}! నేను మీ సఖిని. "
            f"మీ నెలవారీ ఆదాయం ₹{income:,}, ఖర్చులు ₹{expenses:,}, మిగులు ₹{surplus:,}. "
            f"మీరు ప్రస్తుతం మీ ఆర్థిక ప్రయాణంలో **{stage}** దశలో ఉన్నారు{goal_txt}। "
            f"నేను మీ పొదుపు, ఖర్చులు లేదా ప్రభుత్వ పథకాల గురించి ఎలా సహాయపడగలను?"
        )

    # ENGLISH TEMPLATES (Default)
    if is_debt:
        if debt > 0:
            return (
                f"Namaste {name}! You currently have ₹{debt:,} in debt. "
                f"Since your monthly surplus is ₹{surplus:,}, you can comfortably put aside about ₹{repayment_suggestion:,} "
                f"each month towards clearing this debt faster. "
                f"Always prioritize loans with the highest interest first (like private moneylenders), and try not to take new debt until this is cleared."
            )
        return f"Namaste {name}! Wonderful news: you currently have zero recorded debt. Your focus can be entirely on building your emergency savings and dreams!"

    if is_saving:
        if ctx.primary_goal:
            return (
                f"Namaste {name}! From your monthly income of ₹{income:,} and expenses of ₹{expenses:,}, "
                f"you have a healthy surplus of ₹{surplus:,} every month.\n\n"
                f"For your goal '{goal_name}' (Target: ₹{goal_target:,}), our calculation shows you need to save "
                f"**₹{monthly_req:,} per month**. Because your surplus is ₹{surplus:,}, this is very achievable! "
                f"You will still have ₹{max(0, surplus - monthly_req):,} left over as a buffer."
            )
        return (
            f"Namaste {name}! You earn ₹{income:,} and spend ₹{expenses:,}, giving you ₹{surplus:,} surplus each month. "
            f"A good practice is to save at least half of this (₹{int(surplus / 2):,}) in a secure Post Office or bank account for your Emergency Fund."
        )

    if is_scheme_or_biz:
        shg_mention = "through your Self-Help Group (SHG)" if is_shg else "at your local bank"
        state_mention = " If you are in Telangana, the Stree Nidhi cooperative provides quick low-cost loans." if "telangana" in state.lower() else ""
        return (
            f"Namaste {name}! Starting or expanding your own work is an empowering step. "
            f"You can explore the **Pradhan Mantri MUDRA Yojana (loans up to ₹50,000)** or the **Lakhpati Didi Initiative** {shg_mention}.{state_mention} "
            f"Visit our 'Benefits' tab to see eligibility details and official government portal links!"
        )

    if is_emergency:
        return (
            f"Namaste {name}! An Emergency Fund is your family's safety shield. "
            f"Based on your monthly household expenses of ₹{expenses:,}, your recommended 3-month safety shield is ₹{ef_target:,}. "
            f"You have ₹{savings:,} saved, so you only need ₹{ef_remaining:,} more to be fully protected."
        )

    # General supportive answer incorporating full context
    goal_info = f" and you are working towards '{ctx.primary_goal['name']}'" if ctx.primary_goal else ""
    return (
        f"Namaste {name}! I am Sakhi, here with you. "
        f"Right now, your monthly income is ₹{income:,}, expenses are ₹{expenses:,}, and your surplus is ₹{surplus:,}. "
        f"You are currently at the **{stage}** stage of your financial journey{goal_info}. "
        f"How can I help you understand your money, savings, or government benefits today?"
    )

async def explain_finances_with_ai(
    user_message: str,
    context: FinancialContextPayload,
    language: str = "en"
) -> AIChatResponse:
    """
    Sends structured financial context + user query to configured AI provider (Gemini or OpenAI),
    falling back smoothly to the deterministic explainer if offline or API key is absent.
    """
    context_dict = context.model_dump()
    context_prompt = (
        f"AUTHORITATIVE USER FINANCIAL CONTEXT (DO NOT ALTER CALCULATIONS):\n"
        f"{json.dumps(context_dict, indent=2)}\n\n"
        f"User Demographics: State={context.state}, Age={context.age}, SHG Member={context.is_shg_member}\n"
        f"User Response Language: {language}\n"
        f"User Question: {user_message}\n\n"
        f"Please provide a warm, concise, and clear response addressing the user's question, using the calculated figures above in the requested language ({language})."
    )

    # 1. Try Gemini API if configured
    if settings.AI_PROVIDER == "gemini" and settings.GEMINI_API_KEY:
        try:
            from google import genai
            client = genai.Client(api_key=settings.GEMINI_API_KEY)
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=f"{SYSTEM_PROMPT}\n\n{context_prompt}"
            )
            if response and response.text:
                return AIChatResponse(
                    reply=response.text.strip(),
                    context_used=context,
                    is_fallback=False
                )
        except Exception as e:
            logger.warning(f"Gemini API call failed: {e}. Falling back to deterministic explainer.")

    # 2. Try OpenAI API if configured
    if settings.AI_PROVIDER == "openai" and settings.OPENAI_API_KEY:
        try:
            from openai import AsyncOpenAI
            client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            completion = await client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": context_prompt}
                ],
                max_tokens=400,
                temperature=0.3
            )
            content = completion.choices[0].message.content
            if content:
                return AIChatResponse(
                    reply=content.strip(),
                    context_used=context,
                    is_fallback=False
                )
        except Exception as e:
            logger.warning(f"OpenAI API call failed: {e}. Falling back to deterministic explainer.")

    # 3. Fallback to smart deterministic multilingual explainer
    reply = generate_fallback_reply(user_message, context, language=language)
    return AIChatResponse(
        reply=reply,
        context_used=context,
        is_fallback=True
    )
