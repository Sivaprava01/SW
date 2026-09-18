import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, X, Bot, Sparkles, AlertCircle, Volume2, VolumeX, User as UserIcon } from 'lucide-react';
import { api } from '../services/api';
import { useUser } from '../context/UserContext';
import { useSpeech } from '../hooks/useSpeech';

const EXAMPLE_QUESTIONS = {
  en: [
    "How much should I save every month?",
    "I have debt. What is the best way to clear it?",
    "What government support can help my work?",
    "What is my Emergency Fund safety target?"
  ],
  hi: [
    "मुझे हर महीने कितना बचाना चाहिए?",
    "कर्ज़ चुकाने का सबसे अच्छा तरीका क्या है?",
    "मेरे काम के लिए कौन सी सरकारी योजनाएं हैं?",
    "मेरा सुरक्षा कवच (इमरजेंसी फंड) कितना होना चाहिए?"
  ],
  te: [
    "నేను ప్రతి నెలా ఎంత పొదుపు చేయాలి?",
    "అప్పు తీర్చడానికి సరైన మార్గం ఏమిటి?",
    "నా పనికి ఏ ప్రభుత్వ పథకాలు సహాయపడతాయి?",
    "నా అత్యవసర నిధి రక్షణ లక్ష్యం ఎంత?"
  ]
};

export default function AskSakhiModal({ isOpen, onClose }) {
  const { user, financialHealth, language, t } = useUser();
  const { isSpeaking, speakingId, speak, stop, isSupported: isTtsSupported } = useSpeech();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [sttSupported, setSttSupported] = useState(true);
  const [sttNotice, setSttNotice] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasStt = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
      setSttSupported(hasStt);
    }
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const name = user?.name || 'Sister';
      let greeting = `Namaste, ${name}! I am Sakhi, your personal financial companion. You can ask me anything about your household money, saving for your goals, managing loans, or government schemes.`;
      if (language === 'hi') {
        greeting = `नमस्ते, ${name}! मैं आपकी सखी हूँ। आप मुझसे अपनी घरेलू बचत, कर्ज़ प्रबंधन या सरकारी योजनाओं के बारे में कोई भी सवाल पूछ सकती हैं।`;
      } else if (language === 'te') {
        greeting = `నమస్తే, ${name}! నేను మీ సఖిని. మీరు మీ పొదుపు, ఖర్చులు, అప్పులు లేదా ప్రభుత్వ పథకాల గురించి ఏమైనా అడగవచ్చు.`;
      }

      setMessages([
        {
          sender: 'sakhi',
          text: greeting,
          isFallback: false
        }
      ]);
    }
  }, [isOpen, user, language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (!isOpen) {
      stop();
    }
  }, [isOpen, stop]);

  if (!isOpen) return null;

  const handleSend = async (queryText = input) => {
    const text = queryText.trim();
    if (!text || !user) return;

    stop();
    setInput('');
    setSttNotice('');
    const newMessages = [...messages, { sender: 'user', text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await api.askSakhi(user.id, text, language);
      setMessages([
        ...newMessages,
        {
          sender: 'sakhi',
          text: response.reply,
          isFallback: response.is_fallback
        }
      ]);
    } catch (err) {
      let fallbackErr = "Sakhi AI is temporarily offline. Your financial information is still safe and accessible in your dashboard.";
      if (language === 'hi') {
        fallbackErr = "सखी सहायक अभी ऑफलाइन है। आपकी वित्तीय जानकारी डैशबोर्ड में सुरक्षित है।";
      } else if (language === 'te') {
        fallbackErr = "సఖి సహాయకురాలు ప్రస్తుతం ఆఫ్‌లైన్‌లో ఉంది. మీ ఆర్థిక వివరాలు సురక్షితంగా ఉన్నాయి.";
      }
      setMessages([
        ...newMessages,
        {
          sender: 'sakhi',
          text: fallbackErr,
          isFallback: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleMic = () => {
    if (!sttSupported) {
      setSttNotice(t('voice_not_supported'));
      setTimeout(() => setSttNotice(''), 4000);
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

    if (!isListening) {
      setIsListening(true);
      setSttNotice('');
      try {
        recognition.start();
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
      } catch {
        setIsListening(false);
      }
    } else {
      setIsListening(false);
    }
  };

  const currentQuestions = EXAMPLE_QUESTIONS[language] || EXAMPLE_QUESTIONS['en'];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sakhi-dialog-title"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div className="bg-white w-full sm:max-w-md h-[92vh] sm:h-[650px] rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4">
        
        {/* Header */}
        <div className="bg-linear-to-r from-emerald-800 to-teal-900 text-white p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Bot size={22} className="text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 id="sakhi-dialog-title" className="font-black text-base tracking-tight">Ask Sakhi</h3>
                <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-full">
                  AI Companion
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                Simple answers about your money & schemes
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stop();
              onClose();
            }}
            aria-label="Close Ask Sakhi"
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X size={20} />
          </button>
        </div>

        {/* Live Context Banner */}
        {financialHealth && (
          <div className="bg-amber-50/90 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-[11px] text-amber-950">
            <span>
              Surplus: <strong>₹{Number(financialHealth.surplus).toLocaleString('en-IN')}</strong>
            </span>
            <span>
              Debt: <strong>₹{Number(financialHealth.debt).toLocaleString('en-IN')}</strong>
            </span>
            <span>
              Savings: <strong>₹{Number(financialHealth.savings).toLocaleString('en-IN')}</strong>
            </span>
          </div>
        )}

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {messages.map((m, idx) => {
            const isUser = m.sender === 'user';
            const msgId = `ask-msg-${idx}`;
            const isItemSpeaking = isSpeaking && speakingId === msgId;
            return (
              <div
                key={idx}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-1 shadow-xs">
                    स
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-br-none shadow-xs font-medium'
                      : 'bg-white border border-slate-200 text-slate-900 rounded-bl-none shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  
                  {!isUser && isTtsSupported && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-400 font-medium">
                        Verified calculations
                      </span>
                      <button
                        onClick={() => speak(m.text, msgId)}
                        aria-label={isItemSpeaking ? t('stop_listening') : t('listen')}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer min-h-[38px] border ${
                          isItemSpeaking
                            ? 'bg-amber-100 text-amber-950 border-amber-300 shadow-xs'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {isItemSpeaking ? (
                          <>
                            <VolumeX size={16} className="text-amber-700" />
                            <span>{t('stop_listening')}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 size={16} className="text-emerald-700" />
                            <span>🔊 {t('listen')}</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-2.5 items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 text-xs font-bold animate-pulse">
                स
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
                <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                <span className="font-medium">Sakhi is understanding your finances...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* STT Notice if user clicks unsupported mic */}
        {sttNotice && (
          <div className="bg-amber-50 border-t border-amber-200 px-4 py-1.5 text-xs text-amber-900 font-medium">
            ℹ️ {sttNotice}
          </div>
        )}

        {/* Quick Question Prompts */}
        <div className="p-2.5 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
          {currentQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 px-3 py-1.5 rounded-full whitespace-nowrap transition"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <button
            type="button"
            onClick={toggleMic}
            className={`p-2.5 rounded-2xl transition min-h-[44px] min-w-[44px] flex items-center justify-center ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title={sttSupported ? "Voice input" : t('voice_not_supported')}
          >
            <Mic size={18} />
          </button>

          <input
            type="text"
            placeholder={isListening ? "Listening... speak now" : "Ask about savings, debt, schemes..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
            className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />

          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-2xl shadow-xs transition min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

