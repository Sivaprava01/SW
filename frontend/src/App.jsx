import React, { useState } from 'react';
import { UserProvider, useUser } from './context/UserContext';
import Layout from './components/Layout';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import MyMoney from './pages/MyMoney';
import Journey from './pages/Journey';
import Goals from './pages/Goals';
import Benefits from './pages/Benefits';
import Learn from './pages/Learn';
import AskSakhiModal from './components/AskSakhiModal';
import StartupGreeting from './components/StartupGreeting';
import InteractiveTutorial from './components/InteractiveTutorial';

function MainApp() {
  const { user, loading, showTutorial, completeTutorial, showSplash, setShowSplash } = useUser();
  const [activeTab, setActiveTab] = useState('home');
  const [showAskSakhi, setShowAskSakhi] = useState(false);

  // Render the selected tab
  const renderTab = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Home
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenAskSakhi={() => setShowAskSakhi(true)}
          />
        );
      case 'money':
        return <MyMoney />;
      case 'journey':
        return <Journey onOpenAskSakhi={() => setShowAskSakhi(true)} />;
      case 'goals':
        return <Goals />;
      case 'benefits':
        return <Benefits />;
      case 'learn':
        return <Learn onOpenAskSakhi={() => setShowAskSakhi(true)} />;
      default:
        return (
          <Home
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenAskSakhi={() => setShowAskSakhi(true)}
          />
        );
    }
  };

  return (
    <>
      {/* 1:1 Stitch Startup Splash & Greeting */}
      {showSplash && (
        <StartupGreeting 
          name={user?.name || 'Lakshmi'} 
          onComplete={() => setShowSplash(false)} 
        />
      )}

      {loading ? (
        <div className="min-h-screen bg-[#fff8f3] dark:bg-[#14110F] flex items-center justify-center p-4">
          <div className="text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-600 text-white font-black text-2xl flex items-center justify-center shadow-lg animate-pulse border-2 border-white/60 dark:border-stone-800">
              स
            </div>
            <p className="text-xs font-bold text-stone-600 dark:text-[#A8988A] mt-3">Loading Sakhi...</p>
          </div>
        </div>
      ) : !user ? (
        <div className="app-container">
          <div className="p-4 flex-1 flex flex-col justify-center">
            <Onboarding onComplete={() => setActiveTab('home')} />
          </div>
        </div>
      ) : (
        <Layout
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAskSakhi={() => setShowAskSakhi(true)}
        >
          {renderTab()}

          <AskSakhiModal
            isOpen={showAskSakhi}
            onClose={() => setShowAskSakhi(false)}
          />

          <InteractiveTutorial
            isOpen={showTutorial}
            onClose={completeTutorial}
          />
        </Layout>
      )}
    </>
  );
}

export default function App() {
  return (
    <UserProvider>
      <MainApp />
    </UserProvider>
  );
}
