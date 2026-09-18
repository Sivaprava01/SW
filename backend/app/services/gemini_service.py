import os
import asyncio
import logging
import json
from typing import Optional
from app.config import settings
from app.schemas.ai import FinancialContextPayload, AIChatResponse
from app.services.ai_service import SYSTEM_PROMPT, generate_fallback_reply

logger = logging.getLogger("sakhi.gemini")

class GeminiService:
    """
    Dedicated backend Gemini AI Service using Google's official 'google-genai' SDK.
    Strictly isolated to the backend. Never exposes API keys or secrets in logs, responses, or client payloads.
    Handles timeouts, rate limits, provider exceptions, and falls back gracefully to deterministic math calculations.
    """
    def __init__(self):
        self.api_key: str = settings.GEMINI_API_KEY
        self.model: str = settings.GEMINI_MODEL or "gemini-2.5-flash"
        self._client = None
        self._initialize_client()

    def _initialize_client(self):
        if self.api_key and self.api_key.strip():
            try:
                from google import genai
                self._client = genai.Client(api_key=self.api_key.strip())
                logger.info(f"Gemini client initialized with model '{self.model}'.")
            except Exception as e:
                logger.warning(f"Failed to initialize Gemini client: {e}")
                self._client = None
        else:
            logger.info("Gemini API key not configured. Falling back to grounded deterministic engine.")
            self._client = None

    def is_configured(self) -> bool:
        return self._client is not None and bool(self.api_key.strip())

    async def generate_explanation(
        self,
        user_message: str,
        context: FinancialContextPayload,
        language: str = "en",
        timeout_seconds: float = 12.0
    ) -> AIChatResponse:
        """
        Executes an AI explanation request through Gemini with timeout and error handling.
        Preserves the exact AIChatResponse schema contract.
        """
        # If client not configured, immediately use grounded deterministic explainer
        if not self.is_configured():
            reply = generate_fallback_reply(user_message, context, language=language)
            return AIChatResponse(
                reply=reply,
                context_used=context,
                is_fallback=True
            )

        context_dict = context.model_dump()
        context_prompt = (
            f"AUTHORITATIVE USER FINANCIAL CONTEXT (DO NOT ALTER CALCULATIONS):\n"
            f"{json.dumps(context_dict, indent=2)}\n\n"
            f"User Demographics: State={context.state}, Age={context.age}, SHG Member={context.is_shg_member}\n"
            f"User Response Language: {language}\n"
            f"User Question: {user_message}\n\n"
            f"Please provide a warm, concise, and clear response addressing the user's question, "
            f"using the calculated figures above in the requested language ({language})."
        )
        full_contents = f"{SYSTEM_PROMPT}\n\n{context_prompt}"

        def _call_gemini():
            return self._client.models.generate_content(
                model=self.model,
                contents=full_contents
            )

        try:
            # Wrap SDK call in asyncio.to_thread with timeout to prevent hung worker threads
            response = await asyncio.wait_for(
                asyncio.to_thread(_call_gemini),
                timeout=timeout_seconds
            )

            if response and response.text:
                return AIChatResponse(
                    reply=response.text.strip(),
                    context_used=context,
                    is_fallback=False
                )
            else:
                logger.warning("Gemini returned empty response text. Using deterministic explainer.")
        except asyncio.TimeoutError:
            logger.warning(f"Gemini API call timed out after {timeout_seconds}s. Falling back to deterministic explainer.")
        except Exception as e:
            # Log error safely without dumping any API key or secret variables
            err_msg = str(e)
            if self.api_key and self.api_key in err_msg:
                err_msg = err_msg.replace(self.api_key, "[REDACTED_API_KEY]")
            logger.warning(f"Gemini API request failed: {err_msg}. Using grounded fallback.")

        # Fallback on any failure
        reply = generate_fallback_reply(user_message, context, language=language)
        return AIChatResponse(
            reply=reply,
            context_used=context,
            is_fallback=True
        )

gemini_service = GeminiService()
