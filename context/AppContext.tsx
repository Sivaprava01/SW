import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Goal = {
  id: string;
  title: string;
  category: string;
  filterCat: 'education' | 'business' | 'emergency' | 'gold' | 'repair' | 'custom';
  timeline: string;
  icon: any;
  saved: number;
  target: number;
  percent: number;
  requiredMonthly: string;
  durationMonths: number;
  status: string;
  accentColor: string;
};

export const AVAILABLE_STATES = [
  'Telangana',
  'Andhra Pradesh',
  'Karnataka',
  'Maharashtra',
  'Tamil Nadu',
  'Odisha',
  'Madhya Pradesh',
  'Uttar Pradesh',
  'Bihar',
  'Rajasthan',
];

type AppContextType = {
  operatingState: string;
  setOperatingState: (state: string) => void;
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'saved' | 'percent' | 'status' | 'accentColor'>) => void;
  updateGoal: (id: string, updated: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
};

const defaultGoals: Goal[] = [
  {
    id: '1',
    title: "Daughter's College Admission",
    category: 'Education',
    filterCat: 'education',
    timeline: '12 months left',
    durationMonths: 12,
    icon: 'school',
    saved: 18000,
    target: 50000,
    percent: 36,
    requiredMonthly: '₹1,500/mo required',
    status: 'Very Achievable',
    accentColor: '#f97316',
  },
  {
    id: '2',
    title: 'Emergency Shield Savings',
    category: 'Safety',
    filterCat: 'emergency',
    timeline: '6 months left',
    durationMonths: 6,
    icon: 'shield',
    saved: 6300,
    target: 15000,
    percent: 42,
    requiredMonthly: '₹1,000/mo required',
    status: 'Very Achievable',
    accentColor: '#9d4300',
  },
  {
    id: '3',
    title: 'Second Sewing Machine',
    category: 'Small Enterprise',
    filterCat: 'business',
    timeline: '7 months left',
    durationMonths: 7,
    icon: 'storefront',
    saved: 2400,
    target: 8000,
    percent: 30,
    requiredMonthly: '₹800/mo required',
    status: 'Very Achievable',
    accentColor: '#f97316',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [operatingState, setOperatingState] = useState<string>('Telangana');
  const [goals, setGoals] = useState<Goal[]>(defaultGoals);

  const addGoal = (newGoalData: Omit<Goal, 'id' | 'saved' | 'percent' | 'status' | 'accentColor'>) => {
    const newId = Date.now().toString();
    const percent = Math.min(100, Math.round((0 / newGoalData.target) * 100));
    const newGoal: Goal = {
      ...newGoalData,
      id: newId,
      saved: 0,
      percent,
      status: 'On Track',
      accentColor: '#f97316',
    };
    setGoals((prev) => [newGoal, ...prev]);
  };

  const updateGoal = (id: string, updated: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const newTarget = updated.target ?? g.target;
        const newSaved = updated.saved ?? g.saved;
        const newPercent = Math.min(100, Math.round((newSaved / newTarget) * 100));
        return {
          ...g,
          ...updated,
          target: newTarget,
          saved: newSaved,
          percent: newPercent,
        };
      })
    );
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        operatingState,
        setOperatingState,
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
