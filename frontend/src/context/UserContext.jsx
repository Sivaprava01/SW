import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [financialHealth, setFinancialHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshFinancialData = async (userId = user?.id) => {
    if (!userId) return;
    try {
      const data = await api.getFinancialHealth(userId);
      setFinancialHealth(data);
    } catch (err) {
      console.error('Failed to refresh financial health:', err);
    }
  };

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('sakhi_user_id', userData.id);
    refreshFinancialData(userData.id);
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
        loginUser,
        logoutUser,
        loadDemoUser,
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
