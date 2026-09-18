"""
Sakhi Voice & Indic Speech API Endpoints.

Provides REST interfaces for Text-to-Speech (TTS), speech transcription (STT),
direct audio streaming, lesson voiceovers, and full voice assistant queries.
"""

from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.voice import (
    SupportedLanguagesResponse,
    VoiceSynthesisRequest,
    VoiceSynthesisResponse,
    VoiceTranscriptionRequest,
    VoiceTranscriptionResponse,
    VoiceAssistantQueryRequest,
    VoiceAssistantQueryResponse,
    LessonAudioResponse,
)
from app.services.voice_service import VoiceService

router = APIRouter()


@router.get(
    "/languages",
    response_model=SupportedLanguagesResponse,
    summary="Get supported Indic voice models and languages",
    description="Returns metadata on supported Indic languages (Telugu, Hindi, English), personas, and sample rates.",
)
def get_supported_languages() -> SupportedLanguagesResponse:
    """Retrieve supported Indic voice languages and speaker personas."""
    return VoiceService.get_supported_languages()


@router.post(
    "/synthesize",
    response_model=VoiceSynthesisResponse,
    summary="Synthesize speech audio from text",
    description="Converts Indic text into speech audio bytes (Base64) with prosody normalization and caching.",
)
def synthesize_speech(
    request: VoiceSynthesisRequest,
) -> VoiceSynthesisResponse:
    """Generate audio speech from text."""
    return VoiceService.synthesize_speech(request=request)


@router.get(
    "/stream",
    summary="Stream raw speech audio directly",
    description="Streams audio binary stream (audio/mpeg or audio/wav) for direct HTML5 audio player playback.",
)
def stream_audio(
    text: str = Query(..., min_length=1, description="Text to synthesize"),
    language: str = Query("te", description="Language code ('te', 'hi', 'en')"),
    speed: float = Query(1.0, ge=0.5, le=2.0, description="Speech rate"),
    format: str = Query("mp3", description="Audio format ('mp3', 'wav')"),
) -> Response:
    """Stream synthesized audio bytes directly."""
    audio_bytes, media_type = VoiceService.stream_audio(
        text=text,
        language=language,
        speed=speed,
        audio_format=format,
    )
    return Response(
        content=audio_bytes,
        media_type=media_type,
        headers={
            "Content-Disposition": f'inline; filename="sakhi_speech.{format}"',
            "Cache-Control": "public, max-age=86400",
        },
    )


@router.post(
    "/transcribe",
    response_model=VoiceTranscriptionResponse,
    summary="Transcribe spoken audio input into text",
    description="Transcribes base64 encoded voice recording into text with Indic language tagging.",
)
def transcribe_speech(
    request: VoiceTranscriptionRequest,
) -> VoiceTranscriptionResponse:
    """Transcribe audio recording to text."""
    return VoiceService.transcribe_speech(request=request)


@router.post(
    "/lesson/{lesson_id}",
    response_model=LessonAudioResponse,
    summary="Get voiceover narration for a financial lesson",
    description="Generates or retrieves cached spoken audio for a learning lesson or financial concept.",
)
def get_lesson_audio(
    lesson_id: int,
    language: str = Query("te", description="Language code ('te', 'hi', 'en')"),
) -> LessonAudioResponse:
    """Fetch lesson audio narration."""
    return VoiceService.get_lesson_audio(lesson_id=lesson_id, language=language)


@router.post(
    "/assistant/query",
    response_model=VoiceAssistantQueryResponse,
    summary="Interactive Voice-to-Voice Companion Query",
    description="Processes spoken or text voice queries, performs grounded financial reasoning, and returns speech audio.",
)
def voice_assistant_query(
    request: VoiceAssistantQueryRequest,
    db: Session = Depends(get_db),
) -> VoiceAssistantQueryResponse:
    """Unified voice query handler."""
    return VoiceService.process_voice_query(request=request, db=db)
