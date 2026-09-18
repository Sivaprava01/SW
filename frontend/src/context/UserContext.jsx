import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { translations } from '../utils/translations';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [financialHealth, setFinancialHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Language state
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('sakhi_language') || 'en';
  });

  // Theme state: 'light' | 'dark'
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('sakhi_theme') || 'light';
  });

  // Interactive tutorial state
  const [showTutorial, setShowTutorial] = useState(false);

  // Startup splash screen state
  const [showSplash, setShowSplash] = useState(true);

  const replaySplash = () => {
    setShowSplash(true);
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('sakhi_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const setLanguage = (newLang) => {
    setLanguageState(newLang);
    localStorage.setItem('sakhi_language', newLang);
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  const startTutorial = () => {
    setShowTutorial(true);
  };

  const completeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('sakhi_tutorial_completed', 'true');
  };

  const refreshFinancialData = async (userId = user?.id) => {
    if (!userId) return;
    try {
      const data = await api.getFinancialHealth(userId);
      setFinancialHealth(data);
    } catch (err) {
      console.error('Failed to refresh financial health:', err);
    }
  };

  const updateUserLocally = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('sakhi_user_id', userData.id);
    if (userData.preferred_language && !localStorage.getItem('sakhi_language')) {
      setLanguage(userData.preferred_language);
    }
    refreshFinancialData(userData.id);

    // Check if tutorial has been completed
    if (!localStorage.getItem('sakhi_tutorial_completed')) {
      setShowTutorial(true);
    }
  };

  const logoutUser = () => {
    setUser(null);
    setFinancialHealth(null);
    localStorage.removeItem('sakhi_user_id');
  };

  const loadDemoUser = async () => {
    setLoading(true);
    try {
      const demo = await api.loadDemoLakshmi();
      loginUser(demo);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      const savedId = localStorage.getItem('sakhi_user_id');
      if (savedId) {
        try {
          const u = await api.getUser(savedId);
          setUser(u);
          await refreshFinancialData(u.id);
        } catch {
          // If user not found, clear
          localStorage.removeItem('sakhi_user_id');
        }
      }
      setLoading(false);
    }
    init();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        financialHealth,
        loading,
        error,
        language,
        setLanguage,
        theme,
        setTheme,
        showTutorial,
        startTutorial,
        completeTutorial,
        showSplash,
        setShowSplash,
        replaySplash,
        t,
        loginUser,
        logoutUser,
        loadDemoUser,
        updateUserLocally,
        refreshFinancialData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}


