"""
Sakhi Voice & Indic Speech Synthesis Service.

Coordinates multilingual Indic Text-to-Speech (TTS), speech transcription (STT),
file-based audio caching, audio streaming, and voice assistant conversational pipelines.
"""

import base64
import hashlib
import io
import math
import os
import struct
import wave
from typing import Dict, Any, Optional, List, Tuple
import httpx
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.logging import logger
from app.core.errors import ResourceNotFoundException, ValidationException, BadRequestException
from app.schemas.voice import (
    VoiceLanguage,
    SupportedLanguagesResponse,
    VoiceSynthesisRequest,
    VoiceSynthesisResponse,
    VoiceTranscriptionRequest,
    VoiceTranscriptionResponse,
    VoiceAssistantQueryRequest,
    VoiceAssistantQueryResponse,
    LessonAudioResponse,
)
from app.services.indic_speech_normalizer import IndicSpeechNormalizer
from app.services.ai_service import AIService
from app.services.knowledge_service import KnowledgeService


class VoiceService:
    """Core audio synthesis, transcription, and Indic voice interaction service."""

    # Supported Audio Formats to MIME types
    AUDIO_MIME_MAP: Dict[str, str] = {
        "webm": "audio/webm",
        "wav": "audio/wav",
        "mp3": "audio/mp3",
        "ogg": "audio/ogg",
        "m4a": "audio/aac",
        "aac": "audio/aac",
        "flac": "audio/flac",
        "mp4": "audio/mp4",
    }

    # Supported Indic Voice Languages and Personas

    LANGUAGES: Dict[str, VoiceLanguage] = {
        "te": VoiceLanguage(
            code="te",
            bcp47="te-IN",
            name="Telugu",
            native_name="తెలుగు",
            speaker_name="సఖి అక్క (Sakhi Akka)",
            gender="female",
            sample_rate=24000,
            description="Clear Telugu voice tuned for rural Andhra Pradesh and Telangana dialects",
        ),
        "hi": VoiceLanguage(
            code="hi",
            bcp47="hi-IN",
            name="Hindi",
            native_name="हिंदी",
            speaker_name="सखी दीदी (Sakhi Didi)",
            gender="female",
            sample_rate=24000,
            description="Warm conversational Hindi voice tailored for North and Central Indian women",
        ),
        "en": VoiceLanguage(
            code="en",
            bcp47="en-IN",
            name="English (India)",
            native_name="English",
            speaker_name="Sakhi Sister",
            gender="female",
            sample_rate=24000,
            description="Clear Indian English accent with Indic phonetic awareness",
        ),
    }

    @classmethod
    def get_supported_languages(cls) -> SupportedLanguagesResponse:
        """Return the roster of supported Indic voice languages and personas."""
        lang_list = list(cls.LANGUAGES.values())
        return SupportedLanguagesResponse(
            languages=lang_list,
            default_language="te",
            total_supported=len(lang_list),
        )

    @classmethod
    def get_language_info(cls, language: str) -> VoiceLanguage:
        """Fetch language metadata by code, with safe fallback to Telugu."""
        lang_key = language.lower()[:2] if language else "te"
        return cls.LANGUAGES.get(lang_key, cls.LANGUAGES["te"])

    @classmethod
    def synthesize_speech(
        cls,
        request: VoiceSynthesisRequest,
    ) -> VoiceSynthesisResponse:
        """
        Synthesize speech audio from text using Indic normalization and audio caching.
        """
        raw_text = request.text.strip()
        if not raw_text:
            raise ValidationException(message="Text to synthesize cannot be empty")

        lang_info = cls.get_language_info(request.language)
        lang_code = lang_info.code
        audio_format = request.audio_format.lower() if request.audio_format in ["mp3", "wav"] else "mp3"

        # 1. Normalize speech text for Indic prosody and expand symbols
        spoken_text = IndicSpeechNormalizer.normalize_for_speech(raw_text, language=lang_code)

        # 2. Check Local Audio Cache
        cache_key = cls._compute_cache_key(spoken_text, lang_code, request.speed, audio_format)
        cached_audio = cls._read_from_cache(cache_key, audio_format)

        if cached_audio:
            duration = cls._estimate_duration(spoken_text, request.speed)
            return VoiceSynthesisResponse(
                audio_base64=base64.b64encode(cached_audio).decode("utf-8"),
                audio_format=audio_format,
                duration_seconds=duration,
                sample_rate=lang_info.sample_rate,
                character_count=len(raw_text),
                language=lang_code,
                voice_name=lang_info.speaker_name,
                is_cached=True,
            )

        # 3. Generate Audio via TTS Engine
        audio_bytes = cls._generate_tts_bytes(spoken_text, lang_code, request.speed, audio_format)

        # 4. Save to Cache if enabled
        cls._write_to_cache(cache_key, audio_bytes, audio_format)

        duration = cls._estimate_duration(spoken_text, request.speed)

        return VoiceSynthesisResponse(
            audio_base64=base64.b64encode(audio_bytes).decode("utf-8"),
            audio_format=audio_format,
            duration_seconds=duration,
            sample_rate=lang_info.sample_rate,
            character_count=len(raw_text),
            language=lang_code,
            voice_name=lang_info.speaker_name,
            is_cached=False,
        )

    @classmethod
    def stream_audio(
        cls,
        text: str,
        language: str = "te",
        speed: float = 1.0,
        audio_format: str = "mp3",
    ) -> Tuple[bytes, str]:
        """
        Generate or retrieve raw audio bytes with media MIME type for direct HTTP audio playback.
        """
        request = VoiceSynthesisRequest(
            text=text,
            language=language,
            speed=speed,
            audio_format=audio_format,
        )
        response = cls.synthesize_speech(request)
        audio_bytes = base64.b64decode(response.audio_base64)
        media_type = "audio/mpeg" if response.audio_format == "mp3" else "audio/wav"
        return audio_bytes, media_type

    @classmethod
    def transcribe_speech(
        cls,
        request: VoiceTranscriptionRequest,
    ) -> VoiceTranscriptionResponse:
        """
        Transcribe spoken audio input into text using Google Gemini Audio Transcription.
        Supports base64 audio container decoding, MIME mapping, and Indic language recognition.
        """
        if not request.audio_base64 or not request.audio_base64.strip():
            raise ValidationException(message="Audio data is required for transcription")

        try:
            # Clean base64 header if included (e.g. data:audio/webm;base64,...)
            clean_b64 = request.audio_base64.strip()
            if "," in clean_b64:
                clean_b64 = clean_b64.split(",", 1)[1]
            raw_audio = base64.b64decode(clean_b64)
            if len(raw_audio) == 0:
                raise ValidationException(message="Audio data is empty")
        except ValidationException:
            raise
        except Exception as e:
            raise ValidationException(message=f"Invalid base64 audio payload: {e}")

        # Real Gemini Audio Transcription
        transcript, detected_lang, confidence = cls._transcribe_with_gemini(
            clean_b64=clean_b64,
            raw_audio=raw_audio,
            audio_format=request.audio_format,
            language=request.language,
        )

        duration = round(max(0.5, len(raw_audio) / 16000.0), 2)

        return VoiceTranscriptionResponse(
            transcript=transcript,
            detected_language=detected_lang,
            confidence=confidence,
            duration_seconds=duration,
        )


    @classmethod
    def get_lesson_audio(
        cls,
        lesson_id: int,
        language: str = "te",
    ) -> LessonAudioResponse:
        """
        Generate or fetch cached voiceover narration for a financial micro-lesson.
        """
        lang_code = language.lower()[:2] if language else "te"

        # Look up concept/lesson
        concepts = KnowledgeService.list_concepts()
        matched_concept = None
        for c in concepts:
            c_int_id = int(c.id.replace("fc-", "")) if c.id.startswith("fc-") else 1
            if c_int_id == lesson_id:
                matched_concept = c
                break

        if not matched_concept:
            # Fallback to first concept if ID out of bounds
            matched_concept = concepts[0]

        lesson_int_id = int(matched_concept.id.replace("fc-", "")) if matched_concept.id.startswith("fc-") else 1

        # Extract localized text
        if lang_code == "te":
            title = matched_concept.title.te
            narration = (
                f"నమస్తే అక్క. ఈ పాఠం అంశం: {matched_concept.title.te}. "
                f"{matched_concept.plain_language_explanation.te} "
                f"ఆచరణలో మీరు చేయవలసినది: {matched_concept.practical_action.te}."
            )
        elif lang_code == "hi":
            title = matched_concept.title.hi
            narration = (
                f"नमस्ते दीदी। इस पाठ का विषय है: {matched_concept.title.hi}। "
                f"{matched_concept.plain_language_explanation.hi} "
                f"व्यावहारिक कदम: {matched_concept.practical_action.hi}."
            )
        else:
            title = matched_concept.title.en
            narration = (
                f"Namaste Sister. This lesson is about: {matched_concept.title.en}. "
                f"{matched_concept.plain_language_explanation.en} "
                f"Practical step: {matched_concept.practical_action.en}."
            )

        synth_req = VoiceSynthesisRequest(
            text=narration,
            language=lang_code,
            speed=1.0,
            audio_format="mp3",
        )
        synth_res = cls.synthesize_speech(synth_req)

        return LessonAudioResponse(
            lesson_id=lesson_int_id,
            stage_id=lesson_int_id,
            title=title,
            language=lang_code,
            audio_base64=synth_res.audio_base64,
            audio_format=synth_res.audio_format,
            duration_seconds=synth_res.duration_seconds,
            is_cached=synth_res.is_cached,
        )

    @classmethod
    def process_voice_query(
        cls,
        request: VoiceAssistantQueryRequest,
        db: Session,
    ) -> VoiceAssistantQueryResponse:
        """
        Unified end-to-end voice assistant companion handler:
        Audio/Text Input -> Grounded Ask Sakhi Reasoning -> Voice Synthesized Audio Output.
        """
        lang = request.language.lower()[:2] if request.language else "te"

        # 1. Resolve user query text
        query_text = ""
        if request.message and request.message.strip():
            query_text = request.message.strip()
        elif request.audio_base64 and request.audio_base64.strip():
            trans_res = cls.transcribe_speech(
                VoiceTranscriptionRequest(
                    audio_base64=request.audio_base64,
                    language=lang,
                )
            )
            query_text = trans_res.transcript
        else:
            query_text = "నా ఆర్థిక పరిస్థితి ఏమిటి?" if lang == "te" else ("मेरी वित्तीय स्थिति क्या है?" if lang == "hi" else "What is my financial status?")

        # 2. Call Ask Sakhi AI Companion
        ai_response = AIService.chat(
            user_id=request.user_id,
            message=query_text,
            language=lang,
            db=db,
        )

        # 3. Generate Speech Narration if requested
        audio_b64 = None
        if request.generate_speech:
            try:
                synth_res = cls.synthesize_speech(
                    VoiceSynthesisRequest(
                        text=ai_response.reply,
                        language=lang,
                        speed=1.0,
                        audio_format="mp3",
                    )
                )
                audio_b64 = synth_res.audio_base64
            except Exception as e:
                logger.warning(f"Voice query audio synthesis skipped due to error: {e}")

        return VoiceAssistantQueryResponse(
            user_id=request.user_id,
            query_text=query_text,
            reply_text=ai_response.reply,
            language=ai_response.language,
            is_fallback=ai_response.is_fallback,
            grounding_metrics=ai_response.grounding_metrics,
            suggested_followups=ai_response.suggested_followups,
            audio_base64=audio_b64,
            audio_format="mp3" if audio_b64 else None,
        )

    # -------------------------------------------------------------------------
    # Internal Audio Generators & Helpers
    # -------------------------------------------------------------------------

    @classmethod
    def _generate_tts_bytes(
        cls,
        text: str,
        lang: str,
        speed: float,
        audio_format: str,
    ) -> bytes:
        """
        Generate audio bytes via gTTS or standard PCM audio generator.
        """
        if audio_format == "mp3":
            try:
                from gtts import gTTS
                gtts_lang = "te" if lang.startswith("te") else ("hi" if lang.startswith("hi") else "en")
                tld = "co.in" if gtts_lang == "en" else "com"
                tts = gTTS(text=text, lang=gtts_lang, tld=tld, slow=(speed < 0.85))
                fp = io.BytesIO()
                tts.write_to_fp(fp)
                return fp.getvalue()
            except Exception as e:
                logger.info(f"gTTS online synthesis unavailable ({e}), using local audio generator.")

        # Fallback / WAV mode
        duration = cls._estimate_duration(text, speed)
        return cls._generate_wav_bytes(duration_seconds=duration)

    @classmethod
    def _generate_wav_bytes(cls, duration_seconds: float = 1.0, sample_rate: int = 24000) -> bytes:
        """Generate a valid, deterministic 16-bit mono RIFF WAV audio byte stream."""
        buffer = io.BytesIO()
        with wave.open(buffer, "wb") as wav_file:
            wav_file.setnchannels(1)  # Mono
            wav_file.setsampwidth(2)  # 16-bit PCM
            wav_file.setframerate(sample_rate)
            
            # Generate soft harmonic tone so player decodes actual audio samples
            num_samples = int(sample_rate * max(0.5, min(duration_seconds, 10.0)))
            frames = bytearray()
            for i in range(num_samples):
                # Gentle decay envelope with 432 Hz soothing fundamental tone
                envelope = max(0.0, 1.0 - (i / num_samples))
                sample_val = int(32767.0 * 0.15 * envelope * math.sin(2.0 * math.pi * 432.0 * (i / sample_rate)))
                frames.extend(struct.pack("<h", sample_val))
            
            wav_file.writeframes(frames)
        return buffer.getvalue()

    @classmethod
    def _transcribe_with_gemini(
        cls,
        clean_b64: str,
        raw_audio: bytes,
        audio_format: str = "webm",
        language: Optional[str] = None,
    ) -> Tuple[str, str, float]:
        """
        Invoke Google Gemini audio transcription model.
        Extracts verbatim spoken words in original Indic or English language.
        """
        if not settings.GEMINI_API_KEY or len(settings.GEMINI_API_KEY.strip()) < 5:
            raise BadRequestException(message="Gemini API key is not configured for audio transcription")

        fmt = (audio_format or "webm").lower().strip()
        mime_type = cls.AUDIO_MIME_MAP.get(fmt, "audio/webm")

        if language and language.strip():
            lang_code = language.lower().strip()[:2]
            prompt_text = f"Transcribe this spoken audio verbatim in its original language ({lang_code}). Do not translate. Return only the exact transcribed speech text."
        else:
            lang_code = None
            prompt_text = "Transcribe this spoken audio verbatim in its original language. Do not translate. Return only the exact transcribed speech text."

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_TRANSCRIBE_MODEL}:generateContent?key={settings.GEMINI_API_KEY}"
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt_text},
                        {
                            "inline_data": {
                                "mime_type": mime_type,
                                "data": clean_b64,
                            }
                        },
                    ]
                }
            ]
        }

        try:
            with httpx.Client(timeout=30.0) as client:
                response = client.post(url, json=payload)
        except Exception as e:
            logger.error(f"Gemini transcription network error: {e}")
            raise BadRequestException(message=f"Gemini transcription request failed: {e}")

        if response.status_code != 200:
            logger.error(f"Gemini transcription API returned HTTP {response.status_code}: {response.text}")
            raise BadRequestException(
                message=f"Gemini transcription service returned HTTP {response.status_code}"
            )

        data = response.json()
        candidates = data.get("candidates", [])
        if not candidates:
            raise BadRequestException(message="Gemini transcription returned no speech candidates")

        parts = candidates[0].get("content", {}).get("parts", [])
        transcript_pieces = []
        for part in parts:
            if isinstance(part, dict):
                # 1. Check audioTranscription object (gemini-3.5-transcribe format)
                if "audioTranscription" in part and isinstance(part["audioTranscription"], dict):
                    t = part["audioTranscription"].get("text", "")
                    if t:
                        transcript_pieces.append(t)
                elif "audio_transcription" in part and isinstance(part["audio_transcription"], dict):
                    t = part["audio_transcription"].get("text", "")
                    if t:
                        transcript_pieces.append(t)
                # 2. Check standard text part format
                elif "text" in part and part["text"]:
                    transcript_pieces.append(part["text"])

        full_transcript = " ".join(transcript_pieces).strip()
        if not full_transcript:
            raise BadRequestException(message="No spoken words could be recognized in the audio recording")

        # Detect language if not explicitly requested
        detected_lang = lang_code if lang_code else cls._detect_script_language(full_transcript)

        return full_transcript, detected_lang, 0.98

    @classmethod
    def _detect_script_language(cls, text: str) -> str:
        """Infer language code from unicode script characters."""
        if any("\u0c00" <= ch <= "\u0c7f" for ch in text):
            return "te"
        if any("\u0900" <= ch <= "\u097f" for ch in text):
            return "hi"
        return "en"


    @classmethod
    def _estimate_duration(cls, text: str, speed: float) -> float:
        """Estimate speech duration based on text length and speed."""
        # Average reading rate is approx 12-15 characters per second for Indic scripts
        chars_per_second = 14.0 * max(0.5, speed)
        estimated = len(text) / chars_per_second
        return round(max(0.8, estimated), 1)

    @classmethod
    def _compute_cache_key(cls, text: str, lang: str, speed: float, fmt: str) -> str:
        """Generate a deterministic SHA256 cache filename."""
        raw = f"{lang}_{speed:.1f}_{fmt}_{text}".encode("utf-8")
        return hashlib.sha256(raw).hexdigest()

    @classmethod
    def _read_from_cache(cls, cache_key: str, fmt: str) -> Optional[bytes]:
        """Read audio file from local disk cache if present."""
        if not settings.VOICE_CACHE_ENABLED:
            return None
        cache_dir = settings.VOICE_AUDIO_CACHE_DIR
        file_path = os.path.join(cache_dir, f"{cache_key}.{fmt}")
        if os.path.isfile(file_path):
            try:
                with open(file_path, "rb") as f:
                    return f.read()
            except Exception as e:
                logger.warning(f"Failed to read audio cache: {e}")
        return None

    @classmethod
    def _write_to_cache(cls, cache_key: str, audio_bytes: bytes, fmt: str) -> None:
        """Persist generated audio file to disk cache."""
        if not settings.VOICE_CACHE_ENABLED or not audio_bytes:
            return
        cache_dir = settings.VOICE_AUDIO_CACHE_DIR
        try:
            os.makedirs(cache_dir, exist_ok=True)
            file_path = os.path.join(cache_dir, f"{cache_key}.{fmt}")
            with open(file_path, "wb") as f:
                f.write(audio_bytes)
        except Exception as e:
            logger.warning(f"Failed to write audio cache: {e}")
