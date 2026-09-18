import { useState, useCallback } from 'react';
import { useUser } from '../context/UserContext';

export function useSTT() {
  const { language, t } = useUser();
  const [isListening, setIsListening] = useState(false);
  const [listeningField, setListeningField] = useState(null);
  const [errorNotice, setErrorNotice] = useState('');

  const isSupported = typeof window !== 'undefined' &&
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  const startListening = useCallback((onResult, fieldId = 'default') => {
    if (!isSupported) {
      setErrorNotice(t('voice_not_supported') || 'Voice input is not supported in this browser.');
      setTimeout(() => setErrorNotice(''), 3000);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    let langCode = 'en-IN';
    if (language === 'hi') langCode = 'hi-IN';
    if (language === 'te') langCode = 'te-IN';

    recognition.lang = langCode;
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsListening(true);
    setListeningField(fieldId);
    setErrorNotice('');

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript && onResult) {
        onResult(transcript);
      }
      setIsListening(false);
      setListeningField(null);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setListeningField(null);
    };

    recognition.onend = () => {
      setIsListening(false);
      setListeningField(null);
    };

    try {
      recognition.start();
    } catch {
      setIsListening(false);
      setListeningField(null);
    }
  }, [isSupported, language, t]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    setListeningField(null);
  }, []);

  return {
    isSupported,
    isListening,
    listeningField,
    errorNotice,
    startListening,
    stopListening,
  };
}
