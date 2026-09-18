import React, { useState, useEffect, useRef } from 'react';
import {
  IconMicrophone,
  IconSend,
  IconX,
  IconSparkles,
  IconVolume,
  IconVolumeOff,
  IconPlayerPlay,
  IconPlayerPause,
  IconCheck,
  IconShieldCheck,
  IconKeyboard,
  IconMessageDots,
  IconHelp,
  IconBuildingBank,
  IconPigMoney,
  IconShoppingCart,
} from '@tabler/icons-react';
import { api } from '../services/api';
import { useUser } from '../context/UserContext';
import { useSpeech } from '../hooks/useSpeech';

const EXAMPLE_QUESTIONS = {
  en: [
    { text: "How to apply for Lakhpati Didi?", icon: IconSparkles },
    { text: "Should I take an SHG loan?", icon: IconBuildingBank },
    { text: "How much should I save every month?", icon: IconPigMoney },
    { text: "Explain PM Suraksha Bima Yojana", icon: IconShieldCheck },
    { text: "What if my grocery bill increases?", icon: IconShoppingCart },
    { text: "What is my Emergency Shield target?", icon: IconHelp }
  ],
  hi: [
    { text: "लखपति दीदी योजना में आवेदन कैसे करें?", icon: IconSparkles },
    { text: "क्या मुझे SHG ऋण लेना चाहिए?", icon: IconBuildingBank },
    { text: "मुझे हर महीने कितना बचाना चाहिए?", icon: IconPigMoney },
    { text: "प्रधानमंत्री सुरक्षा बीमा योजना समझाएं", icon: IconShieldCheck },
    { text: "अगर राशन का खर्च बढ़ जाए तो क्या करें?", icon: IconShoppingCart },
    { text: "मेरा सुरक्षा कवच लक्ष्य कितना है?", icon: IconHelp }
  ],
  te: [
    { text: "లఖ్‌పతి దీదీ పథకానికి ఎలా దరఖాస్తు చేయాలి?", icon: IconSparkles },
    { text: "నేను SHG రుణం తీసుకోవాలా?", icon: IconBuildingBank },
    { text: "నేను ప్రతి నెలా ఎంత పొదుపు చేయాలి?", icon: IconPigMoney },
    { text: "ప్రధానమంత్రి సురక్షా బీమా యోజన వివరించండి", icon: IconShieldCheck },
    { text: "కిరాణా ఖర్చులు పెరిగితే ఏమి చేయాలి?", icon: IconShoppingCart },
    { text: "నా అత్యవసర నిధి రక్షణ లక్ష్యం ఎంత?", icon: IconHelp }
  ]
};

export default function AskSakhiModal({ isOpen, onClose }) {
  const { user, financialHealth, language, setLanguage, t } = useUser();
  const { isSpeaking, speakingId, speak, stop, isSupported: isTtsSupported } = useSpeech();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [sttSupported, setSttSupported] = useState(true);
  const [sttNotice, setSttNotice] = useState('');
  const [showKeypad, setShowKeypad] = useState(true);
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
      let greeting = `Namaste, ${name}! I am Sakhi, your personal AI financial companion. You can ask me anything in Telugu, Hindi or English about your budget, loans, savings, or government schemes.`;
      if (language === 'hi') {
        greeting = `नमस्ते, ${name}! मैं आपकी सखी हूँ। आप मुझसे तेलुगु, हिंदी या अंग्रेजी में कर्ज़, बचत या सरकारी योजनाओं के बारे में कोई भी सवाल पूछ सकती हैं।`;
      } else if (language === 'te') {
        greeting = `నమస్తే, ${name}! నేను మీ సఖిని. మీరు తెలుగు, హిందీ లేదా ఇంగ్లీషులో పొదుపు, అప్పులు లేదా ప్రభుత్వ పథకాల గురించి ఏమైనా అడగవచ్చు.`;
      }

      setMessages([
        {
          sender: 'sakhi',
          text: greeting,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isFallback: false
        }
      ]);
    }
  }, [isOpen, user, language, financialHealth]);

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
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessages = [...messages, { sender: 'user', text, time: currentTime }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await api.askSakhi(user.id, text, language);
      setMessages([
        ...newMessages,
        {
          sender: 'sakhi',
          text: response.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isFallback: response.is_fallback
        }
      ]);
    } catch {
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
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isFallback: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleMic = () => {
    if (!sttSupported) {
      setSttNotice(t('voice_not_supported') || 'Voice input is not supported in this browser. Please use text typing.');
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
      className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div className="bg-[#fff8f3] dark:bg-[#14110F] text-[#221a0e] dark:text-[#FFF5EB] w-full sm:max-w-md h-[95vh] sm:h-[700px] rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden border border-amber-200/60 dark:border-[#3D332B] animate-in slide-in-from-bottom-4">
        
        {/* Identity Header */}
        <div className="bg-[#fff1e3] dark:bg-[#1e1b19] border-b border-amber-200/70 dark:border-[#28211C] px-4 py-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-md font-black text-lg border-2 border-white/60 dark:border-[#3D332B]">
                स
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-[#fff1e3] dark:ring-[#1e1b19] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-emerald-950 animate-ping"></span>
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 id="sakhi-dialog-title" className="font-bold text-base text-[#221a0e] dark:text-[#FFF5EB] truncate">
                  {language === 'te' ? 'Bol Sakhi (బోల్ సఖీ)' : language === 'hi' ? 'बोल सखी (Bol Sakhi)' : 'Ask Sakhi'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-orange-600 text-white text-[10px] font-bold tracking-wide shadow-xs">
                  AI Companion
                </span>
              </div>
              <p className="text-[11px] text-orange-700 dark:text-[#ffb690] font-semibold flex items-center gap-1 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Online • Telugu, Hindi & English
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Close Button */}
            <button
              onClick={() => {
                stop();
                onClose();
              }}
              aria-label="Close Ask Sakhi"
              className="w-8 h-8 rounded-full bg-stone-200/70 dark:bg-[#28211C] hover:bg-stone-300 dark:hover:bg-[#383431] text-stone-700 dark:text-[#D4C4B5] flex items-center justify-center transition active:scale-95 cursor-pointer"
            >
              <IconX size={18} />
            </button>
          </div>
        </div>

        {/* Multi-Dialect Language Selector Chips */}
        <div className="flex items-center gap-1.5 px-3 pt-2.5 pb-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setLanguage('te')}
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shrink-0 transition active:scale-95 cursor-pointer ${
              language === 'te'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-stone-200/70 dark:bg-[#28211C] text-stone-700 dark:text-[#D4C4B5] hover:bg-stone-300 dark:hover:bg-[#383431]'
            }`}
          >
            {language === 'te' && <IconCheck size={13} />}
            తెలుగు (Telugu)
          </button>

          <button
            onClick={() => setLanguage('hi')}
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shrink-0 transition active:scale-95 cursor-pointer ${
              language === 'hi'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-stone-200/70 dark:bg-[#28211C] text-stone-700 dark:text-[#D4C4B5] hover:bg-stone-300 dark:hover:bg-[#383431]'
            }`}
          >
            {language === 'hi' && <IconCheck size={13} />}
            हिंदी (Hindi)
          </button>

          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shrink-0 transition active:scale-95 cursor-pointer ${
              language === 'en'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-stone-200/70 dark:bg-[#28211C] text-stone-700 dark:text-[#D4C4B5] hover:bg-stone-300 dark:hover:bg-[#383431]'
            }`}
          >
            {language === 'en' && <IconCheck size={13} />}
            English
          </button>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#fffaf5]/40 dark:bg-[#100e0c]/50">
          {/* Date separator */}
          <div className="flex items-center justify-center my-1">
            <span className="px-3 py-0.5 rounded-full bg-[#fcebd7] dark:bg-[#1e1b19] text-stone-600 dark:text-[#A8988A] text-[10px] font-bold tracking-wider uppercase border border-amber-200/50 dark:border-[#28211C]">
              Household & SHG Financial Guidance
            </span>
          </div>

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
                  <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center shrink-0 text-xs font-black mt-1 shadow-xs border border-white/50 dark:border-[#3D332B]">
                    स
                  </div>
                )}

                <div className="flex flex-col space-y-1 max-w-[86%]">
                  {/* Sender Name & Time */}
                  <div className={`flex items-center gap-1 px-1 text-[11px] ${isUser ? 'justify-end text-stone-500 dark:text-[#A8988A]' : 'text-orange-700 dark:text-[#ffb690] font-bold'}`}>
                    {!isUser && <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>}
                    <span>{isUser ? `${user?.name || 'You'}` : 'Sakhi Sister'}</span>
                    <span className="text-[10px] text-stone-400 dark:text-[#A8988A] font-normal">
                      {m.time || 'Just now'}
                    </span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-tr-xs font-medium'
                        : 'bg-[#fff1e3] dark:bg-[#1e1b19] text-[#221a0e] dark:text-[#e9e1dd] rounded-tl-xs border border-amber-200/50 dark:border-[#28211C]'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{m.text}</p>

                    {/* AI Structured Audio Narration & Calculations Badge */}
                    {!isUser && isTtsSupported && (
                      <div className="mt-3 pt-2.5 border-t border-amber-200/40 dark:border-[#28211C] flex items-center justify-between gap-2 flex-wrap">
                        {/* Audio TTS Button */}
                        <button
                          onClick={() => speak(m.text, msgId)}
                          aria-label={isItemSpeaking ? t('stop_listening') : t('listen')}
                          className={`px-3 py-1.5 rounded-full font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs border ${
                            isItemSpeaking
                              ? 'bg-amber-200 dark:bg-amber-950 text-amber-950 dark:text-amber-200 border-amber-300'
                              : 'bg-white dark:bg-[#28211C] text-orange-900 dark:text-[#ffb690] hover:bg-orange-50 dark:hover:bg-[#383431] border-orange-200/70 dark:border-[#3D332B]'
                          }`}
                        >
                          {isItemSpeaking ? (
                            <>
                              <IconPlayerPause size={14} className="text-amber-700 dark:text-amber-400" />
                              <span>{t('stop_listening')}</span>
                            </>
                          ) : (
                            <>
                              <IconVolume size={14} className="text-orange-700 dark:text-[#ffb690]" />
                              <span>🔊 {language === 'te' ? 'వినండి (Listen)' : language === 'hi' ? 'सुनिए (Listen)' : 'Listen'}</span>
                              {/* Audio animated equalizer bars */}
                              <span className="flex items-center gap-0.5 h-2.5 ml-0.5">
                                <span className="w-0.5 h-1.5 bg-orange-600 dark:bg-[#ffb690] rounded-full animate-bounce"></span>
                                <span className="w-0.5 h-2.5 bg-orange-600 dark:bg-[#ffb690] rounded-full animate-bounce [animation-delay:0.15s]"></span>
                                <span className="w-0.5 h-1 bg-orange-600 dark:bg-[#ffb690] rounded-full animate-bounce [animation-delay:0.3s]"></span>
                              </span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading / Thinking indicator */}
          {loading && (
            <div className="flex gap-2.5 items-center">
              <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center shrink-0 text-xs font-black animate-pulse">
                स
              </div>
              <div className="bg-[#fff1e3] dark:bg-[#1e1b19] border border-amber-200/50 dark:border-[#28211C] rounded-2xl rounded-tl-xs px-4 py-3 text-xs text-stone-600 dark:text-stone-300 flex items-center gap-2 shadow-xs">
                <span className="inline-block w-2 h-2 bg-orange-500 rounded-full animate-bounce" />
                <span className="inline-block w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="inline-block w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                <span className="font-semibold text-orange-950 dark:text-orange-200">
                  {language === 'te' ? 'సఖి మీ వివరాలను పరిశీలిస్తోంది...' : language === 'hi' ? 'सखी आपकी वित्तीय जानकारी समझ रही है...' : 'Sakhi is understanding your finances...'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* STT Notice if voice input is unsupported */}
        {sttNotice && (
          <div className="bg-amber-50 dark:bg-amber-950/80 border-t border-amber-200 dark:border-amber-800 px-4 py-1.5 text-xs text-amber-900 dark:text-amber-300 font-semibold">
            ℹ️ {sttNotice}
          </div>
        )}

        {/* Suggested Quick Question Prompts Carousel */}
        <div className="px-3 py-2 bg-[#fff1e3]/60 dark:bg-[#1e1b19] border-t border-amber-200/50 dark:border-[#28211C] flex flex-col gap-1">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] uppercase tracking-wider text-stone-500 dark:text-[#A8988A] font-bold">
              Suggested Questions
            </span>
            <button
              onClick={() => setShowKeypad(!showKeypad)}
              className="text-[10px] text-orange-700 dark:text-[#ffb690] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <IconKeyboard size={12} />
              {showKeypad ? 'Voice Focus' : 'Show Keypad'}
            </button>
          </div>

          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {currentQuestions.map((q, idx) => {
              const Icon = q.icon || IconMessageDots;
              return (
                <button
                  key={idx}
                  onClick={() => handleSend(q.text)}
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-800 dark:text-[#FFF5EB] bg-white dark:bg-[#28211C] hover:bg-orange-50 dark:hover:bg-[#383431] border border-amber-200/70 dark:border-[#3D332B] px-3 py-1.5 rounded-full whitespace-nowrap transition cursor-pointer active:scale-95 shadow-xs"
                >
                  <Icon size={13} className="text-orange-600 dark:text-[#ffb690] shrink-0" />
                  <span>{q.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Interaction Dock (Voice + Keypad) */}
        <div className="p-3 bg-[#fff1e3] dark:bg-[#1e1b19] border-t border-amber-200/70 dark:border-[#28211C] flex flex-col gap-2.5">
          
          {/* Main Giant Glowing Mic or Keypad Input */}
          {!showKeypad ? (
            /* Voice-Centric Focus Mode */
            <div className="flex flex-col items-center justify-center py-2 relative">
              <div className="relative flex items-center justify-center">
                {isListening && (
                  <>
                    <span className="absolute w-20 h-20 rounded-full bg-orange-500/30 animate-ping pointer-events-none" />
                    <span className="absolute w-24 h-24 rounded-full bg-orange-500/15 animate-pulse pointer-events-none" />
                  </>
                )}
                <button
                  type="button"
                  onClick={toggleMic}
                  aria-label="Tap to speak voice button"
                  className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(249,115,22,0.45)] active:scale-90 transition-transform cursor-pointer ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-orange-600 hover:bg-orange-700 text-white'
                  }`}
                >
                  <IconMicrophone size={30} />
                </button>
              </div>

              <span className="text-xs font-bold text-stone-700 dark:text-[#D4C4B5] mt-2 text-center tracking-wide">
                {isListening
                  ? (language === 'te' ? 'Listening... మాట్లాడండి' : language === 'hi' ? 'सुन रहे हैं... बोलिए' : 'Listening... speak now')
                  : (language === 'te' ? 'తెలుగు లేదా హిందీలో మాట్లాడటానికి నొక్కండి' : language === 'hi' ? 'हिंदी या तेलुगु में बोलने के लिए टैप करें' : 'Tap to speak in Telugu, Hindi or English')}
              </span>
            </div>
          ) : (
            /* Text Keypad Input with Integrated Voice & Send */
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMic}
                className={`p-2.5 rounded-2xl transition min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer shadow-xs border ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse border-rose-600'
                    : 'bg-white dark:bg-[#28211C] hover:bg-orange-50 dark:hover:bg-[#383431] text-orange-700 dark:text-[#ffb690] border-amber-200/70 dark:border-[#3D332B]'
                }`}
                title={sttSupported ? "Voice input" : t('voice_not_supported')}
              >
                <IconMicrophone size={20} />
              </button>

              <input
                type="text"
                placeholder={
                  isListening
                    ? (language === 'te' ? "వినబడుతోంది... మాట్లాడండి" : language === 'hi' ? "सुन रहे हैं... बोलिए" : "Listening... speak now")
                    : (language === 'te' ? "పొదుపు, అప్పులు, పథకాల గురించి అడగండి..." : language === 'hi' ? "बचत, कर्ज़, योजनाओं के बारे में पूछें..." : "Ask about savings, debt, schemes...")
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={loading}
                className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 bg-white dark:bg-[#100e0c] border border-amber-200/80 dark:border-[#3D332B] rounded-2xl text-[#221a0e] dark:text-[#FFF5EB] placeholder:text-stone-400 dark:placeholder:text-[#A8988A] focus:outline-hidden focus:ring-2 focus:ring-orange-500 shadow-inner font-medium"
              />

              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="p-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white rounded-2xl shadow-md transition min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer active:scale-95"
              >
                <IconSend size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
