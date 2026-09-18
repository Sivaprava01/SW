"""
Sakhi Voice Schemas Module.

Defines Pydantic models for Indic text-to-speech synthesis, speech transcription,
language metadata, and full voice assistant query flows.
"""

from typing import List, Optional
from pydantic import BaseModel, Field
from app.schemas.ai import GroundingMetrics


class VoiceLanguage(BaseModel):
    """Metadata representing a supported Indic voice language."""
    code: str = Field(..., description="Short ISO 639-1 code ('te', 'hi', 'en')")
    bcp47: str = Field(..., description="BCP 47 language tag ('te-IN', 'hi-IN', 'en-IN')")
    name: str = Field(..., description="English display name ('Telugu', 'Hindi', 'English')")
    native_name: str = Field(..., description="Native localized script name ('తెలుగు', 'हिंदी', 'English')")
    speaker_name: str = Field(..., description="Friendly persona name ('సఖి అక్క', 'सखी दीदी', 'Sakhi Didi')")
    gender: str = Field("female", description="Voice gender timbre ('female', 'male')")
    sample_rate: int = Field(24000, description="Audio sample rate in Hz")
    description: str = Field(..., description="Dialect or accent description")


class SupportedLanguagesResponse(BaseModel):
    """Response containing all supported Indic voice models and default configuration."""
    languages: List[VoiceLanguage]
    default_language: str = Field("te", description="Default primary Indic language")
    total_supported: int


class VoiceSynthesisRequest(BaseModel):
    """Request payload for text-to-speech audio synthesis."""
    text: str = Field(..., min_length=1, max_length=3000, description="Plain text or Indic script to synthesize")
    language: str = Field("te", description="Language code ('te', 'hi', 'en')")
    speed: float = Field(1.0, ge=0.5, le=2.0, description="Speech rate speed factor (0.5 to 2.0)")
    audio_format: str = Field("mp3", description="Desired audio output format ('mp3', 'wav')")


class VoiceSynthesisResponse(BaseModel):
    """Response payload containing generated speech audio data and metadata."""
    audio_base64: str = Field(..., description="Base64-encoded audio byte stream")
    audio_format: str = Field("mp3", description="Audio encoding format ('mp3', 'wav')")
    duration_seconds: float = Field(..., description="Estimated or exact duration of synthesized audio in seconds")
    sample_rate: int = Field(24000, description="Audio sample rate in Hz")
    character_count: int = Field(..., description="Length of synthesized text characters")
    language: str = Field(..., description="Language code used for synthesis")
    voice_name: str = Field(..., description="Voice model identifier or speaker persona")
    is_cached: bool = Field(False, description="Whether audio was served from local cache")


class VoiceTranscriptionRequest(BaseModel):
    """Request payload for speech recognition / transcription."""
    audio_base64: str = Field(..., description="Base64-encoded user microphone audio stream")
    language: Optional[str] = Field(None, description="Expected language code or None for auto-detection")
    audio_format: str = Field("webm", description="Source audio container ('webm', 'wav', 'mp3', 'ogg')")


class VoiceTranscriptionResponse(BaseModel):
    """Response payload containing speech recognition transcript."""
    transcript: str = Field(..., description="Transcribed spoken text")
    detected_language: str = Field(..., description="Detected language code ('te', 'hi', 'en')")
    confidence: float = Field(1.0, ge=0.0, le=1.0, description="Recognition confidence score")
    duration_seconds: float = Field(0.0, description="Audio input duration in seconds")


class VoiceAssistantQueryRequest(BaseModel):
    """Request payload for an interactive voice conversation loop."""
    user_id: int = Field(..., description="ID of the user interacting with Sakhi")
    message: Optional[str] = Field(None, description="Optional text query if already transcribed by browser WebSpeech")
    audio_base64: Optional[str] = Field(None, description="Optional raw audio base64 if audio was recorded")
    language: str = Field("te", description="Target Indic language ('te', 'hi', 'en')")
    generate_speech: bool = Field(True, description="Whether to generate audio speech reply alongside text")


class VoiceAssistantQueryResponse(BaseModel):
    """Response payload containing Ask Sakhi AI reply and synthesized voice narration."""
    user_id: int
    query_text: str = Field(..., description="Processed user query")
    reply_text: str = Field(..., description="Ask Sakhi companion response text")
    language: str
    is_fallback: bool
    grounding_metrics: Optional[GroundingMetrics] = None
    suggested_followups: List[str] = []
    audio_base64: Optional[str] = Field(None, description="Base64 synthesized audio response if requested")
    audio_format: Optional[str] = "mp3"


class LessonAudioResponse(BaseModel):
    """Audio narration payload for a financial learning lesson."""
    lesson_id: int
    stage_id: int
    title: str
    language: str
    audio_base64: str
    audio_format: str = "mp3"
    duration_seconds: float
    is_cached: bool
