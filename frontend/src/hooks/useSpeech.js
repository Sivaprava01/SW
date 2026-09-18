import { useState, useEffect, useRef, useCallback } from 'react';
import { useUser } from '../context/UserContext';

// Global singleton audio controller so multiple components don't talk at the same time
let activeUtterance = null;

export function useSpeech() {
  const { language } = useUser();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingId, setSpeakingId] = useState(null);
  const [voices, setVoices] = useState([]);
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    if (!isSupported) return;

    const updateVoices = () => {
      try {
        const available = window.speechSynthesis.getVoices() || [];
        setVoices(available);
      } catch (err) {
        console.warn('Could not retrieve speech voices:', err);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [isSupported]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      activeUtterance = null;
      setIsSpeaking(false);
      setSpeakingId(null);
    }
  }, [isSupported]);

  const speak = useCallback((text, id = null, customLang = null) => {
    if (!isSupported || !text) return;

    // If already speaking this item, toggle stop
    if (isSpeaking && speakingId === id) {
      stop();
      return;
    }

    // Cancel any current utterance
    window.speechSynthesis.cancel();

    // Clean markdown/special characters from text for natural speech
    const cleanText = text
      .replace(/[*#_`~]/g, '')
      .replace(/₹/g, 'Rupees ')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const targetLang = customLang || language || 'en';

    // Set BCP-47 language tag
    let langCode = 'en-IN';
    if (targetLang === 'hi') langCode = 'hi-IN';
    if (targetLang === 'te') langCode = 'te-IN';

    utterance.lang = langCode;
    utterance.rate = 0.95; // slightly slower for better clarity and accessibility
    utterance.pitch = 1.0;

    // Find best matching voice
    if (voices.length > 0) {
      const match = voices.find(v => v.lang === langCode || v.lang.startsWith(langCode.split('-')[0]));
      if (match) {
        utterance.voice = match;
      }
    }

    utterance.onstart = () => {
      activeUtterance = utterance;
      setIsSpeaking(true);
      setSpeakingId(id);
    };

    utterance.onend = () => {
      activeUtterance = null;
      setIsSpeaking(false);
      setSpeakingId(null);
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis event:', e);
      activeUtterance = null;
      setIsSpeaking(false);
      setSpeakingId(null);
    };

    window.speechSynthesis.speak(utterance);
  }, [isSupported, language, voices, isSpeaking, speakingId, stop]);

  return {
    isSupported,
    isSpeaking,
    speakingId,
    speak,
    stop
  };
}
