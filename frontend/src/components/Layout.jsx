import React, { useState } from 'react';
import { Home, Wallet, Compass, Target, Shield, BookOpen, Bot, User, Sparkles, RefreshCw } from 'lucide-react';
import { useUser } from '../context/UserContext';
import AskSakhiModal from './AskSakhiModal';

export default function Layout({ activeTab, setActiveTab, children }) {
  const { user, loadDemoUser, logoutUser } = useUser();
  const [showAskSakhi, setShowAskSakhi] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'money', label: 'My Money', icon: Wallet },
    { id: 'journey', label: 'Journey', icon: Compass },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'benefits', label: 'Benefits', icon: Shield },
    { id: 'learn', label: 'Learn', icon: BookOpen },
  ];

  return (
    <div className="app-container">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-linear-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-lg shadow-xs">
            स
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base tracking-tight text-slate-900">Sakhi</span>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-full">
                सखी
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-500">
              {user ? `Namaste, ${user.name}` : 'Your Financial Companion'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {user ? (
            <button
              onClick={() => setShowAskSakhi(true)}
              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
            >
              <Bot size={15} className="text-amber-300" />
              <span>Ask Sakhi</span>
            </button>
          ) : (
            <button
              onClick={loadDemoUser}
              className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black transition flex items-center gap-1 shadow-xs"
            >
              <Sparkles size={14} />
              <span>Demo (Lakshmi)</span>
            </button>
          )}

          {user && (
            <button
              onClick={loadDemoUser}
              title="Reset to Lakshmi Demo"
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <RefreshCw size={15} />
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-24 px-4 pt-4 overflow-y-auto">
        {children}
      </main>

      {/* Floating Ask Sakhi button on mobile */}
      {user && (
        <button
          onClick={() => setShowAskSakhi(true)}
          className="fixed bottom-20 right-4 sm:right-[max(1rem,calc(50%-220px))] z-40 px-3.5 py-2.5 bg-linear-to-r from-emerald-600 to-teal-700 text-white font-bold rounded-2xl shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all border border-emerald-400/40"
        >
          <Bot size={18} className="text-amber-300" />
          <span className="text-xs">Talk to Sakhi</span>
        </button>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 sm:max-w-[480px] sm:mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 px-2 py-1.5 flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${
                isActive
                  ? 'text-emerald-700 font-bold'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <Icon size={20} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Ask Sakhi Modal */}
      <AskSakhiModal
        isOpen={showAskSakhi}
        onClose={() => setShowAskSakhi(false)}
      />
    </div>
  );
}
