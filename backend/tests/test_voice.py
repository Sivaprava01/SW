"""
Sakhi Voice & Indic Speech Integration Tests.

Validates Indic phonetic text normalization, Text-to-Speech (TTS) synthesis,
speech transcription, disk audio caching, audio streaming, lesson voiceovers,
and end-to-end voice assistant companion loops.
"""

import base64
import pytest
from fastapi.testclient import TestClient
from app.services.indic_speech_normalizer import IndicSpeechNormalizer
from app.services.voice_service import VoiceService


def test_get_supported_languages(client: TestClient):
    """Verify that supported Indic voice models and personas are correctly reported."""
    response = client.get("/api/v1/voice/languages")
    assert response.status_code == 200
    data = response.json()
    assert data["total_supported"] == 3
    assert data["default_language"] == "te"

    codes = [lang["code"] for lang in data["languages"]]
    assert "te" in codes
    assert "hi" in codes
    assert "en" in codes

    # Check Telugu persona
    te_lang = next(l for l in data["languages"] if l["code"] == "te")
    assert te_lang["bcp47"] == "te-IN"
    assert te_lang["native_name"] == "తెలుగు"
    assert "సఖి" in te_lang["speaker_name"]


def test_indic_speech_normalizer_telugu():
    """Verify Telugu phonetic normalization, currency expansion, and markdown stripping."""
    input_text = "### నమస్తే **లక్ష్మి** అక్క!\n- మీ 3 నెలల నిధి **₹21,000**.\n- SHG సంఘం వడ్డీ 12% APR."
    normalized = IndicSpeechNormalizer.normalize_for_speech(input_text, language="te")
    
    assert "**" not in normalized
    assert "###" not in normalized
    assert "21,000 రూపాయలు" in normalized
    assert "12 శాతం" in normalized
    assert "ఎస్.హెచ్.జి సంఘం" in normalized


def test_indic_speech_normalizer_hindi():
    """Verify Hindi phonetic normalization, currency expansion, and scheme names."""
    input_text = "**नमस्ते दीदी**! आपका कर्ज़ ₹5,000 है। PMSBY में नामांकन करें (12% ब्याज)।"
    normalized = IndicSpeechNormalizer.normalize_for_speech(input_text, language="hi")
    
    assert "**" not in normalized
    assert "5,000 रुपये" in normalized
    assert "12 प्रतिशत" in normalized
    assert "प्रधानमंत्री सुरक्षा बीमा योजना" in normalized


def test_indic_speech_normalizer_english():
    """Verify Indian English phonetic normalization."""
    input_text = "Your emergency target is **₹21,000** with 12% APR from SHG."
    normalized = IndicSpeechNormalizer.normalize_for_speech(input_text, language="en")
    
    assert "**" not in normalized
    assert "21,000 rupees" in normalized
    assert "12 percent" in normalized
    assert "Self Help Group" in normalized


def test_synthesize_speech_endpoint(client: TestClient):
    """Verify TTS synthesis endpoint returns valid Base64 audio byte stream."""
    payload = {
        "text": "నమస్తే లక్ష్మి అక్క! మీ పొదుపు చాలా బాగుంది.",
        "language": "te",
        "speed": 1.0,
        "audio_format": "mp3",
    }
    response = client.post("/api/v1/voice/synthesize", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "audio_base64" in data
    assert data["audio_format"] == "mp3"
    assert data["language"] == "te"
    assert data["duration_seconds"] > 0
    assert data["character_count"] == len(payload["text"])

    # Ensure audio can be decoded
    audio_bytes = base64.b64decode(data["audio_base64"])
    assert len(audio_bytes) > 0


def test_synthesize_speech_wav_format(client: TestClient):
    """Verify WAV format synthesis produces valid RIFF WAV audio bytes."""
    payload = {
        "text": "Emergency Shield savings goal reached.",
        "language": "en",
        "speed": 1.0,
        "audio_format": "wav",
    }
    response = client.post("/api/v1/voice/synthesize", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["audio_format"] == "wav"

    audio_bytes = base64.b64decode(data["audio_base64"])
    assert audio_bytes[:4] == b"RIFF"  # Standard WAV header check


def test_synthesize_speech_audio_caching(client: TestClient):
    """Verify that recurring identical speech queries leverage the local disk cache."""
    payload = {
        "text": "ఆపత్కాల నిధి మొదటి నియమం.",
        "language": "te",
        "speed": 1.0,
        "audio_format": "wav",
    }
    # First call (generates audio)
    res1 = client.post("/api/v1/voice/synthesize", json=payload)
    assert res1.status_code == 200
    
    # Second call (must be served from cache)
    res2 = client.post("/api/v1/voice/synthesize", json=payload)
    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["is_cached"] is True


def test_stream_audio_endpoint(client: TestClient):
    """Verify direct binary audio streaming endpoint for HTML5 audio elements."""
    response = client.get("/api/v1/voice/stream?text=నమస్తే&language=te&format=wav")
    assert response.status_code == 200
    assert response.headers["content-type"] == "audio/wav"
    assert response.content[:4] == b"RIFF"


def test_transcribe_speech_endpoint_success(client: TestClient):
    """Verify speech recognition / transcription endpoint with mock Gemini response."""
    from unittest.mock import patch
    dummy_audio_b64 = base64.b64encode(b"RIFF\x00\x00\x00\x00WAVEfmt \x10\x00\x00\x00" + b"\x00" * 32000).decode("utf-8")
    payload = {
        "audio_base64": dummy_audio_b64,
        "language": "te",
        "audio_format": "wav",
    }
    
    with patch.object(VoiceService, "_transcribe_with_gemini", return_value=("నా అత్యవసర రక్షణ నిధి లక్ష్యం ఎంత?", "te", 0.95)):
        response = client.post("/api/v1/voice/transcribe", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["detected_language"] == "te"
        assert "లక్ష్యం" in data["transcript"]
        assert data["confidence"] > 0.9


def test_transcribe_speech_supported_formats(client: TestClient):
    """Verify transcription endpoint accepts various audio container formats (mp3, webm, ogg, etc.)."""
    from unittest.mock import patch
    dummy_audio_b64 = base64.b64encode(b"ID3\x03\x00\x00\x00\x00\x00\x00" + b"\x00" * 1000).decode("utf-8")
    
    for fmt in ["mp3", "webm", "ogg", "wav", "m4a"]:
        with patch.object(VoiceService, "_transcribe_with_gemini", return_value=("What is my current savings balance?", "en", 0.95)):
            payload = {
                "audio_base64": dummy_audio_b64,
                "language": "en",
                "audio_format": fmt,
            }
            response = client.post("/api/v1/voice/transcribe", json=payload)
            assert response.status_code == 200
            assert "savings balance" in response.json()["transcript"]


def test_transcribe_speech_gemini_api_error(client: TestClient):
    """Verify error handling when Gemini returns HTTP 500 or quota exceeded."""
    from unittest.mock import patch
    from app.core.errors import BadRequestException
    dummy_audio_b64 = base64.b64encode(b"RIFF\x00\x00\x00\x00WAVE" + b"\x00" * 100).decode("utf-8")
    payload = {
        "audio_base64": dummy_audio_b64,
        "language": "en",
        "audio_format": "wav",
    }
    
    with patch.object(VoiceService, "_transcribe_with_gemini", side_effect=BadRequestException(message="Gemini transcription service returned HTTP 500")):
        response = client.post("/api/v1/voice/transcribe", json=payload)
        assert response.status_code == 400


def test_transcribe_speech_empty_transcription(client: TestClient):
    """Verify error handling when Gemini recognizes no words / silent audio."""
    from unittest.mock import patch
    from app.core.errors import BadRequestException
    dummy_audio_b64 = base64.b64encode(b"RIFF\x00\x00\x00\x00WAVE" + b"\x00" * 100).decode("utf-8")
    payload = {
        "audio_base64": dummy_audio_b64,
        "language": "en",
        "audio_format": "wav",
    }
    
    with patch.object(VoiceService, "_transcribe_with_gemini", side_effect=BadRequestException(message="Gemini transcription returned no speech candidates")):
        response = client.post("/api/v1/voice/transcribe", json=payload)
        assert response.status_code == 400



def test_lesson_audio_endpoint(client: TestClient):
    """Verify micro-lesson voiceover narration generation."""
    response = client.post("/api/v1/voice/lesson/1?language=te")
    assert response.status_code == 200
    data = response.json()
    assert data["lesson_id"] == 1
    assert data["language"] == "te"
    assert "audio_base64" in data
    assert len(data["audio_base64"]) > 0


def test_voice_assistant_query_companion_loop(client: TestClient):
    """Verify end-to-end voice query combining grounded Ask Sakhi AI with audio synthesis."""
    # 1. Seed demo persona Lakshmi
    demo_res = client.get("/api/v1/users/demo/lakshmi")
    assert demo_res.status_code == 200
    lakshmi = demo_res.json()
    user_id = lakshmi["id"]

    # 2. Add sample debt
    client.post(
        f"/api/v1/users/{user_id}/debts",
        json={
            "lender_name": "Private Moneylender",
            "lender_type": "moneylender",
            "principal_amount": 20000.0,
            "current_balance": 20000.0,
            "monthly_interest_rate": 3.0,
            "monthly_emi_payment": 600.0,
        },
    )

    # 3. Issue interactive voice query
    payload = {
        "user_id": user_id,
        "message": "నాకు ఎంత అప్పు ఉంది?",
        "language": "te",
        "generate_speech": True,
    }
    response = client.post("/api/v1/voice/assistant/query", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["user_id"] == user_id
    assert "రూ. 20,000" in data["reply_text"] or "20,000" in data["reply_text"]
    assert data["grounding_metrics"] is not None
    assert data["grounding_metrics"]["total_debt"] == 20000.0
    assert data["audio_base64"] is not None
    assert data["audio_format"] == "mp3"


def test_voice_validation_errors(client: TestClient):
    """Verify appropriate validation error codes on invalid audio/text payloads."""
    # Empty text
    res1 = client.post("/api/v1/voice/synthesize", json={"text": "", "language": "te"})
    assert res1.status_code == 422

    # Invalid speed factor out of range (0.5 - 2.0)
    res2 = client.post("/api/v1/voice/synthesize", json={"text": "హలో", "speed": 5.0})
    assert res2.status_code == 422

    # Missing audio for transcription
    res3 = client.post("/api/v1/voice/transcribe", json={"audio_base64": ""})
    assert res3.status_code == 400 or res3.status_code == 422
