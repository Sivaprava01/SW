# Phase B9: Voice Processing, Indic STT & Text-to-Speech (TTS) Integration

## 1. Overview & Objectives
Phase B9 delivers the complete voice processing, Indic phonetic text normalization, and audio synthesis layer for Sakhi. It is specifically designed to empower rural and semi-urban women, SHG members, and micro-entrepreneurs who rely on voice-first interactions in their native languages: **Telugu (`te-IN`)**, **Hindi (`hi-IN`)**, and **Indian English (`en-IN`)**.

---

## 2. Core Architectural Components

### 2.1 Configuration (`app/core/config.py`)
- `VOICE_TTS_PROVIDER`: `"gtts"` (with dynamic fallback to standard PCM WAV builder).
- `VOICE_CACHE_ENABLED`: `True` (caches synthesized audio on disk to eliminate re-generation latency).
- `VOICE_AUDIO_CACHE_DIR`: `"./audio_cache"`.
- `VOICE_DEFAULT_SPEED`: `1.0`.

### 2.2 Indic Speech Normalizer (`app/services/indic_speech_normalizer.py`)
Pre-processes complex financial text and markdown into clean, natural spoken cadence:
1. **Markdown Stripping**: Removes asterisks, headers, bullets, and URLs.
2. **Currency Expansion**:
   - `Telugu`: `₹21,000` / `రూ. 21,000` $\rightarrow$ `21,000 రూపాయలు`
   - `Hindi`: `₹21,000` / `रु. 21,000` $\rightarrow$ `21,000 रुपये`
   - `English`: `₹21,000` $\rightarrow$ `21,000 rupees`
3. **Percentage Expansion**:
   - `12%` $\rightarrow$ `12 శాతం` (te) / `12 प्रतिशत` (hi) / `12 percent` (en).
4. **Financial Acronyms**:
   - `SHG` $\rightarrow$ `ఎస్.హెచ్.జి సంఘం` (te) / `स्वयं सहायता समूह` (hi) / `Self Help Group` (en).
   - `PMSBY` $\rightarrow$ `పి.ఎం సురక్షా బీమా యోజన` (te) / `प्रधानमंत्री सुरक्षा बीमा योजना` (hi).
   - `PMJJBY` $\rightarrow$ `పి.ఎం జీవన్ జ్యోతి బీమా యోజన` (te) / `प्रधानमंत्री जीवन ज्योति बीमा योजना` (hi).
5. **Cadence & Pauses**: Normalizes linebreaks and multiple punctuation marks into clean natural pauses.

### 2.3 Voice Service (`app/services/voice_service.py`)
- **Indic Speaker Personas**:
  - `te` / `te-IN`: "సఖి అక్క (Sakhi Akka)" — Warm, clear Telugu female voice.
  - `hi` / `hi-IN`: "सखी दीदी (Sakhi Didi)" — Conversational Hindi female voice.
  - `en` / `en-IN`: "Sakhi Sister" — Clear Indian English female voice.
- **Audio Engine with Dual-Mode Resilience**:
  - Primary: `gTTS` for natural accents.
  - Resilient Fallback: Built-in 16-bit PCM 24kHz mono WAV synthesizer so unit tests and offline deployments run deterministically with zero internet dependency.
- **Local SHA256 Audio Caching**: Caches audio files on disk (`./audio_cache/{sha256}.{fmt}`) for instant repeated playback of static lesson narrations and financial guidelines.
- **Speech Transcription (STT)**: Decodes base64 microphone streams and transcribes with Indic language tagging.
- **Voice Companion Query Pipeline**: Links voice recording $\rightarrow$ speech recognition $\rightarrow$ grounded Ask Sakhi reasoning (`AIService.chat`) $\rightarrow$ synthesized audio speech reply.

---

## 3. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/voice/languages` | Lists supported Indic voice models, sample rates, speaker personas |
| `POST` | `/api/v1/voice/synthesize` | Synthesizes text into Base64 audio byte stream with metadata |
| `GET` | `/api/v1/voice/stream` | Streams raw binary audio (`audio/mpeg` or `audio/wav`) for HTML5 `<audio>` |
| `POST` | `/api/v1/voice/transcribe` | Transcribes audio recording into text with confidence score |
| `POST` | `/api/v1/voice/lesson/{lesson_id}` | Generates/retrieves cached spoken voiceover for a financial lesson |
| `POST` | `/api/v1/voice/assistant/query` | End-to-end voice query combining grounded Ask Sakhi reasoning and voice synthesis |

---

## 4. Verification & Testing

- Automated test suite: `backend/tests/test_voice.py`
  - 12 comprehensive unit and integration tests covering language metadata, phonetic normalizers, TTS synthesis, audio caching, direct streaming, transcription, lesson narration, and voice assistant companion loops.
- Full backend regression suite: **69/69 automated tests passing**.
