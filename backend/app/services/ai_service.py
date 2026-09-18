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

def generate_fallback_reply(message: str, ctx: FinancialContextPayload) -> str:
    """
    High quality deterministic fallback explanation when external AI APIs are not configured or offline.
    Uses exact backend-calculated financial metrics.
    """
    msg_lower = message.lower()
    name = ctx.name
    surplus = int(ctx.surplus)
    debt = int(ctx.debt)
    savings = int(ctx.savings)
    income = int(ctx.income)
    expenses = int(ctx.expenses)
    stage = ctx.current_journey_stage

    if "debt" in msg_lower or "karz" in msg_lower or "loan" in msg_lower:
        if debt > 0:
            repayment_suggestion = min(surplus, max(1000, int(surplus * 0.6))) if surplus > 0 else 500
            return (
                f"Namaste {name}! You currently have ₹{debt:,} in debt. "
                f"Since your monthly surplus is ₹{surplus:,}, you can comfortably put aside about ₹{repayment_suggestion:,} "
                f"each month towards clearing this debt faster. "
                f"Always prioritize loans with the highest interest first (like private moneylenders), and try not to take new debt until this is cleared."
            )
        else:
            return f"Namaste {name}! Wonderful news: you currently have zero recorded debt. Your focus can be entirely on building your emergency savings and dreams!"

    if "save" in msg_lower or "saving" in msg_lower or "bachat" in msg_lower or "surplus" in msg_lower:
        if ctx.primary_goal:
            goal_name = ctx.primary_goal.get("name", "your goal")
            goal_target = int(ctx.primary_goal.get("target_amount", 0))
            monthly_req = int(ctx.primary_goal.get("monthly_saving_required", 0))
            return (
                f"Namaste {name}! From your monthly income of ₹{income:,} and expenses of ₹{expenses:,}, "
                f"you have a healthy surplus of ₹{surplus:,} every month.\n\n"
                f"For your goal '{goal_name}' (Target: ₹{goal_target:,}), our calculation shows you need to save "
                f"**₹{monthly_req:,} per month**. Because your surplus is ₹{surplus:,}, this is very achievable! "
                f"You will still have ₹{surplus - monthly_req:,} left over as a buffer."
            )
        else:
            return (
                f"Namaste {name}! You earn ₹{income:,} and spend ₹{expenses:,}, giving you ₹{surplus:,} surplus each month. "
                f"A good practice is to save at least half of this (₹{int(surplus / 2):,}) in a secure Post Office or bank account for your Emergency Fund."
            )

    if "business" in msg_lower or "tailor" in msg_lower or "shop" in msg_lower or "mudra" in msg_lower:
        return (
            f"Namaste {name}! Starting or expanding your own work is an empowering step. "
            f"You may explore the **Pradhan Mantri MUDRA Yojana (Shishu loan up to ₹50,000)** or the **Lakhpati Didi Initiative** "
            f"through your local Self-Help Group (SHG). If you are in Telangana, the **Stree Nidhi** program provides fast micro-credit. "
            f"Visit our 'Benefits' tab to see documents required and official application links!"
        )

    if "emergency" in msg_lower or "kavach" in msg_lower:
        ef_target = int(ctx.emergency_fund.get("target", 0))
        ef_remaining = int(ctx.emergency_fund.get("remaining", 0))
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
        f"User Language: {language}\n"
        f"User Question: {user_message}\n\n"
        f"Please provide a warm, concise, and clear response addressing the user's question, using the calculated figures above."
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

    # 3. Fallback to smart deterministic explainer
    reply = generate_fallback_reply(user_message, context)
    return AIChatResponse(
        reply=reply,
        context_used=context,
        is_fallback=True
    )
