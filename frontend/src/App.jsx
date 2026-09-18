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

function MainApp() {
  const { user, loading } = useUser();
  const [activeTab, setActiveTab] = useState('home');
  const [showAskSakhi, setShowAskSakhi] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-2xl flex items-center justify-center mx-auto mb-3 shadow-md animate-pulse">
            स
          </div>
          <p className="text-xs font-bold text-slate-600">Loading Sakhi...</p>
        </div>
      </div>
    );
  }

  // If no user is logged in, show Onboarding
  if (!user) {
    return (
      <div className="app-container">
        <div className="p-4 flex-1 flex flex-col justify-center">
          <Onboarding onComplete={() => setActiveTab('home')} />
        </div>
      </div>
    );
  }

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
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderTab()}

      <AskSakhiModal
        isOpen={showAskSakhi}
        onClose={() => setShowAskSakhi(false)}
      />
    </Layout>
  );
}

export default function App() {
  return (
    <UserProvider>
      <MainApp />
    </UserProvider>
  );
}
