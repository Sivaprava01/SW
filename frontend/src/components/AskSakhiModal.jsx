import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, X, Bot, Sparkles, AlertCircle, Volume2, User as UserIcon } from 'lucide-react';
import { api } from '../services/api';
import { useUser } from '../context/UserContext';

const EXAMPLE_QUESTIONS = [
  "How much should I save every month?",
  "I have ₹20,000 debt. What should I do?",
  "I want to start a tailoring business. What help is available?",
  "What is my Emergency Fund target?"
];

export default function AskSakhiModal({ isOpen, onClose }) {
  const { user, financialHealth } = useUser();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message from Sakhi
      const name = user?.name || 'Sister';
      setMessages([
        {
          sender: 'sakhi',
          text: `Namaste, ${name}! I am Sakhi, your personal financial companion. You can ask me anything about your household money, saving for your goals, managing loans, or government schemes.`,
          isFallback: false
        }
      ]);
    }
  }, [isOpen, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (queryText = input) => {
    const text = queryText.trim();
    if (!text || !user) return;

    setInput('');
    const newMessages = [...messages, { sender: 'user', text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await api.askSakhi(user.id, text);
      setMessages([
        ...newMessages,
        {
          sender: 'sakhi',
          text: response.reply,
          isFallback: response.is_fallback
        }
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          sender: 'sakhi',
          text: "Sakhi AI is temporarily unavailable. Your financial information is still safe and accessible in your dashboard.",
          isFallback: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleMic = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice input is not supported in this browser. Please type your question.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    if (!isListening) {
      setIsListening(true);
      recognition.start();
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } else {
      setIsListening(false);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-md h-[90vh] sm:h-[650px] sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4">
        
        {/* Header */}
        <div className="bg-linear-to-r from-emerald-800 to-teal-900 text-white p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Bot size={22} className="text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-black text-base tracking-tight">Ask Sakhi</h3>
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
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Live Context Banner */}
        {financialHealth && (
          <div className="bg-amber-50/90 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-[11px] text-amber-950">
            <span>
              Monthly Surplus: <strong>₹{Number(financialHealth.surplus).toLocaleString('en-IN')}</strong>
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
            return (
              <div
                key={idx}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-1">
                    स
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-br-none shadow-xs font-medium'
                      : 'bg-white border border-slate-200 text-slate-900 rounded-bl-none shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  
                  {!isUser && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Verified calculations</span>
                      <button
                        onClick={() => speakText(m.text)}
                        className="hover:text-emerald-700 flex items-center gap-1 text-emerald-600 font-bold"
                      >
                        <Volume2 size={13} /> Listen
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

        {/* Quick Question Prompts */}
        <div className="p-2.5 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
          {EXAMPLE_QUESTIONS.map((q, idx) => (
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
            className={`p-2.5 rounded-2xl transition ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Voice input"
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
            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-2xl shadow-xs transition"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
