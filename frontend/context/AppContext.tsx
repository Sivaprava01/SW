import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { UserResponse, UserUpdate } from '@/types/api';
import { FinancialSummaryResponse } from '@/types/finance';
import { TransactionResponse, TransactionCreate } from '@/types/transaction';
import { GoalResponse, GoalCreate, GoalUpdate } from '@/types/goal';
import { DebtResponse, DebtCreate, DebtUpdate, DebtSnowballAnalysisResponse } from '@/types/debt';
import { SchemeMatchResponse, BookmarkRequest, BookmarkResponse } from '@/types/scheme';
import { JourneyRoadmapResponse } from '@/types/journey';
import { UserLearningSummaryResponse, UserLessonProgressResponse } from '@/types/learning';
import { userService } from '@/services/userService';
import { authService } from '@/services/authService';
import { financeService } from '@/services/financeService';
import { transactionService } from '@/services/transactionService';
import { goalService } from '@/services/goalService';
import { debtService } from '@/services/debtService';
import { schemeService } from '@/services/schemeService';
import { journeyService } from '@/services/journeyService';
import { learningService } from '@/services/learningService';

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
  // User Session State
  currentUser: UserResponse | null;
  userId: number | null;
  isOnline: boolean;
  isLoading: boolean;
  error: string | null;
  bootstrapUser: () => Promise<void>;
  loginUser: (user: UserResponse) => Promise<void>;
  loginAsDemoLakshmi: () => Promise<UserResponse>;
  logoutUser: () => void;
  refreshUser: () => Promise<void>;
  updateUserPreferences: (update: UserUpdate) => Promise<UserResponse | null>;
  setCurrentUser: (user: UserResponse | null) => void;

  // Language & Location
  language: 'te' | 'hi' | 'en';
  setLanguage: (lang: 'te' | 'hi' | 'en') => void;
  operatingState: string;
  setOperatingState: (state: string) => void;

  // Financial Health State
  financialSummary: FinancialSummaryResponse | null;
  refreshFinancialSummary: () => Promise<void>;
  totalMonthlyExpenses: number;
  totalMonthlyIncome: number;
  totalMonthlySurplus: number;
  totalSavings: number;
  totalDebt: number;

  // Transactions State
  transactions: TransactionResponse[];
  refreshTransactions: (type?: 'income' | 'expense') => Promise<void>;
  logTransaction: (data: TransactionCreate) => Promise<TransactionResponse>;
  deleteTransaction: (transactionId: number) => Promise<void>;

  // Goals State
  goals: GoalResponse[];
  refreshGoals: () => Promise<void>;
  createGoal: (data: GoalCreate) => Promise<GoalResponse>;
  updateGoal: (goalId: number, data: GoalUpdate) => Promise<GoalResponse>;
  depositToGoal: (goalId: number, amount: number) => Promise<GoalResponse>;
  deleteGoal: (goalId: number) => Promise<void>;

  // Debt State
  debts: DebtResponse[];
  refreshDebts: () => Promise<void>;
  createDebt: (data: DebtCreate) => Promise<DebtResponse>;
  updateDebt: (debtId: number, data: DebtUpdate) => Promise<DebtResponse>;
  deleteDebt: (debtId: number) => Promise<void>;
  debtSnowball: DebtSnowballAnalysisResponse | null;
  refreshDebtSnowball: () => Promise<void>;

  // Government Schemes State (I4)
  matchedSchemes: SchemeMatchResponse[];
  refreshMatchedSchemes: () => Promise<void>;
  bookmarkScheme: (schemeId: number, data: BookmarkRequest) => Promise<BookmarkResponse>;

  // Journey Roadmap State (I4)
  journeyRoadmap: JourneyRoadmapResponse | null;
  refreshJourneyRoadmap: () => Promise<void>;

  // Learning Modules State (I4)
  learningProgress: UserLearningSummaryResponse | null;
  refreshLearningProgress: () => Promise<void>;
  completeLesson: (lessonId: string, quizScore?: number) => Promise<UserLessonProgressResponse>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [language, setLanguageState] = useState<'te' | 'hi' | 'en'>('te');
  const [operatingState, setOperatingState] = useState<string>('Telangana');

  const [financialSummary, setFinancialSummary] = useState<FinancialSummaryResponse | null>(null);
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [goals, setGoals] = useState<GoalResponse[]>([]);
  const [debts, setDebts] = useState<DebtResponse[]>([]);
  const [debtSnowball, setDebtSnowball] = useState<DebtSnowballAnalysisResponse | null>(null);

  // I4 State
  const [matchedSchemes, setMatchedSchemes] = useState<SchemeMatchResponse[]>([]);
  const [journeyRoadmap, setJourneyRoadmap] = useState<JourneyRoadmapResponse | null>(null);
  const [learningProgress, setLearningProgress] = useState<UserLearningSummaryResponse | null>(null);

  const userId = currentUser?.id ?? null;

  const totalMonthlyExpenses = useMemo(() => {
    const baseline = currentUser?.monthly_expenses ?? 0;
    const logged = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    return baseline + logged;
  }, [currentUser?.monthly_expenses, transactions]);

  const totalMonthlyIncome = useMemo(() => {
    const baseline = currentUser?.monthly_income ?? 0;
    const logged = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    return baseline + logged;
  }, [currentUser?.monthly_income, transactions]);

  const totalMonthlySurplus = useMemo(() => {
    return Math.max(0, totalMonthlyIncome - totalMonthlyExpenses);
  }, [totalMonthlyIncome, totalMonthlyExpenses]);

  const totalSavings = useMemo(() => {
    return financialSummary?.total_savings ?? currentUser?.initial_savings ?? 0;
  }, [financialSummary?.total_savings, currentUser?.initial_savings]);

  const totalDebt = useMemo(() => {
    return debtSnowball?.total_debt_balance ?? financialSummary?.total_debt ?? currentUser?.initial_debt ?? 0;
  }, [debtSnowball?.total_debt_balance, financialSummary?.total_debt, currentUser?.initial_debt]);

  const setLanguage = useCallback((lang: 'te' | 'hi' | 'en') => {
    setLanguageState(lang);
  }, []);

  // 1. Refresh Financial Health
  const refreshFinancialSummary = useCallback(async () => {
    if (!userId) return;
    try {
      const summary = await financeService.getFinancialHealth(userId);
      setFinancialSummary(summary);
    } catch (err: any) {
      if (__DEV__) console.warn('[AppContext] Failed to refresh financial health:', err);
    }
  }, [userId]);

  // 2. Refresh Transactions
  const refreshTransactions = useCallback(
    async (type?: 'income' | 'expense') => {
      if (!userId) return;
      try {
        const list = await transactionService.getTransactions(userId, type);
        setTransactions(list);
      } catch (err: any) {
        if (__DEV__) console.warn('[AppContext] Failed to refresh transactions:', err);
      }
    },
    [userId]
  );

  // 3. Refresh Goals
  const refreshGoals = useCallback(async () => {
    if (!userId) return;
    try {
      const list = await goalService.getGoals(userId);
      setGoals(list);
    } catch (err: any) {
      if (__DEV__) console.warn('[AppContext] Failed to refresh goals:', err);
    }
  }, [userId]);

  // 4. Refresh Debts & Snowball
  const refreshDebts = useCallback(async () => {
    if (!userId) return;
    try {
      const list = await debtService.getDebts(userId);
      setDebts(list);
    } catch (err: any) {
      if (__DEV__) console.warn('[AppContext] Failed to refresh debts:', err);
    }
  }, [userId]);

  const refreshDebtSnowball = useCallback(async () => {
    if (!userId) return;
    try {
      const analysis = await debtService.getDebtSnowballAnalysis(userId);
      setDebtSnowball(analysis);
    } catch (err: any) {
      if (__DEV__) console.warn('[AppContext] Failed to refresh debt snowball:', err);
    }
  }, [userId]);

  // 5. Refresh Schemes (I4)
  const refreshMatchedSchemes = useCallback(async () => {
    if (!userId) return;
    try {
      const matches = await schemeService.getMatchedSchemes(userId);
      setMatchedSchemes(matches);
    } catch (err: any) {
      if (__DEV__) console.warn('[AppContext] Failed to refresh matched schemes:', err);
    }
  }, [userId]);

  // 6. Refresh Journey Roadmap (I4)
  const refreshJourneyRoadmap = useCallback(async () => {
    if (!userId) return;
    try {
      const roadmap = await journeyService.getJourney(userId);
      setJourneyRoadmap(roadmap);
    } catch (err: any) {
      if (__DEV__) console.warn('[AppContext] Failed to refresh journey roadmap:', err);
    }
  }, [userId]);

  // 7. Refresh Learning Progress (I4)
  const refreshLearningProgress = useCallback(async () => {
    if (!userId) return;
    try {
      const progress = await learningService.getUserProgress(userId);
      setLearningProgress(progress);
    } catch (err: any) {
      if (__DEV__) console.warn('[AppContext] Failed to refresh learning progress:', err);
    }
  }, [userId]);

  // Login explicit user and load their complete domain data
  const loginUser = useCallback(async (user: UserResponse) => {
    setIsLoading(true);
    setError(null);
    setCurrentUser(user);
    if (user.state) {
      setOperatingState(user.state);
    }
    if (user.primary_language && ['te', 'hi', 'en'].includes(user.primary_language)) {
      setLanguageState(user.primary_language as 'te' | 'hi' | 'en');
    }

    try {
      const [finRes, txRes, goalRes, debtRes, snowballRes, schemeRes, journeyRes, learnRes] =
        await Promise.allSettled([
          financeService.getFinancialHealth(user.id),
          transactionService.getTransactions(user.id),
          goalService.getGoals(user.id),
          debtService.getDebts(user.id),
          debtService.getDebtSnowballAnalysis(user.id),
          schemeService.getMatchedSchemes(user.id),
          journeyService.getJourney(user.id),
          learningService.getUserProgress(user.id),
        ]);

      if (finRes.status === 'fulfilled') setFinancialSummary(finRes.value);
      if (txRes.status === 'fulfilled') setTransactions(txRes.value);
      if (goalRes.status === 'fulfilled') setGoals(goalRes.value);
      if (debtRes.status === 'fulfilled') setDebts(debtRes.value);
      if (snowballRes.status === 'fulfilled') setDebtSnowball(snowballRes.value);
      if (schemeRes.status === 'fulfilled') setMatchedSchemes(schemeRes.value);
      if (journeyRes.status === 'fulfilled') setJourneyRoadmap(journeyRes.value);
      if (learnRes.status === 'fulfilled') setLearningProgress(learnRes.value);
    } catch (err: any) {
      if (__DEV__) console.warn('[AppContext] Failed loading domain data for user:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login with standardized Lakshmi demo profile
  const loginAsDemoLakshmi = useCallback(async (): Promise<UserResponse> => {
    setIsLoading(true);
    try {
      const demoUser = await userService.getDemoLakshmi();
      await loginUser(demoUser);
      return demoUser;
    } catch (err: any) {
      setIsLoading(false);
      throw err;
    }
  }, [loginUser]);

  // Log out active user and reset all cached domain state & JWT tokens
  const logoutUser = useCallback(async () => {
    try {
      await authService.logout();
    } catch (e) {
      if (__DEV__) console.warn('[AppContext] Error during logout:', e);
    }
    setCurrentUser(null);
    setFinancialSummary(null);
    setTransactions([]);
    setGoals([]);
    setDebts([]);
    setDebtSnowball(null);
    setMatchedSchemes([]);
    setJourneyRoadmap(null);
    setLearningProgress(null);
  }, []);

  // Bootstrap initial liveness and restore authenticated JWT session on launch
  const bootstrapUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const health = await userService.checkHealth();
      if (health.status === 'ok') {
        setIsOnline(true);
      }
    } catch (err: any) {
      setIsOnline(false);
      setError(err.message || 'Failed to connect to backend server');
      if (__DEV__) {
        console.warn('[AppContext] Health check failed:', err);
      }
    }

    try {
      // Check stored JWT and validate session with backend /auth/me
      const restoredUser = await authService.restoreSession();
      if (restoredUser) {
        if (__DEV__) console.log('[AppContext] Authenticated session restored for:', restoredUser.name);
        await loginUser(restoredUser);
      } else {
        if (__DEV__) console.log('[AppContext] No active authenticated session found');
        setCurrentUser(null);
      }
    } catch (err) {
      if (__DEV__) console.warn('[AppContext] Session restoration error:', err);
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [loginUser]);

  const refreshUser = useCallback(async () => {
    if (!userId) return;
    try {
      const user = await userService.getUser(userId);
      setCurrentUser(user);
      if (user.state) {
        setOperatingState(user.state);
      }
      if (user.primary_language && ['te', 'hi', 'en'].includes(user.primary_language)) {
        setLanguageState(user.primary_language as 'te' | 'hi' | 'en');
      }
    } catch (err: any) {
      if (__DEV__) console.warn('[AppContext] Refresh user failed:', err);
    }
  }, [userId]);

  const updateUserPreferences = useCallback(
    async (update: UserUpdate): Promise<UserResponse | null> => {
      if (!userId) return null;
      try {
        const updated = await userService.updateUser(userId, update);
        setCurrentUser(updated);
        if (updated.state) {
          setOperatingState(updated.state);
        }
        if (updated.primary_language && ['te', 'hi', 'en'].includes(updated.primary_language)) {
          setLanguageState(updated.primary_language as 'te' | 'hi' | 'en');
        }
        await Promise.all([
          refreshFinancialSummary(),
          refreshMatchedSchemes(),
          refreshJourneyRoadmap(),
        ]);
        return updated;
      } catch (err: any) {
        if (__DEV__) console.warn('[AppContext] Update user failed:', err);
        throw err;
      }
    },
    [userId, refreshFinancialSummary, refreshMatchedSchemes, refreshJourneyRoadmap]
  );

  useEffect(() => {
    bootstrapUser();
  }, [bootstrapUser]);

  // Transaction mutations
  const logTransaction = async (data: TransactionCreate): Promise<TransactionResponse> => {
    if (!userId) throw new Error('User not loaded');
    const newTx = await transactionService.createTransaction(userId, data);
    await Promise.all([refreshTransactions(), refreshFinancialSummary(), refreshJourneyRoadmap()]);
    return newTx;
  };

  const deleteTransaction = async (transactionId: number): Promise<void> => {
    if (!userId) throw new Error('User not loaded');
    await transactionService.deleteTransaction(userId, transactionId);
    await Promise.all([refreshTransactions(), refreshFinancialSummary(), refreshJourneyRoadmap()]);
  };

  // Goal mutations
  const createGoal = async (data: GoalCreate): Promise<GoalResponse> => {
    if (!userId) throw new Error('User not loaded');
    const newGoal = await goalService.createGoal(userId, data);
    await Promise.all([refreshGoals(), refreshFinancialSummary(), refreshJourneyRoadmap()]);
    return newGoal;
  };

  const updateGoal = async (goalId: number, data: GoalUpdate): Promise<GoalResponse> => {
    if (!userId) throw new Error('User not loaded');
    const updated = await goalService.updateGoal(userId, goalId, data);
    await Promise.all([refreshGoals(), refreshFinancialSummary(), refreshJourneyRoadmap()]);
    return updated;
  };

  const depositToGoal = async (goalId: number, amount: number): Promise<GoalResponse> => {
    if (!userId) throw new Error('User not loaded');
    const updated = await goalService.depositToGoal(userId, goalId, amount);
    await Promise.all([refreshGoals(), refreshFinancialSummary(), refreshJourneyRoadmap()]);
    return updated;
  };

  const deleteGoal = async (goalId: number): Promise<void> => {
    if (!userId) throw new Error('User not loaded');
    await goalService.deleteGoal(userId, goalId);
    await Promise.all([refreshGoals(), refreshFinancialSummary(), refreshJourneyRoadmap()]);
  };

  // Debt mutations
  const createDebt = async (data: DebtCreate): Promise<DebtResponse> => {
    if (!userId) throw new Error('User not loaded');
    const newDebt = await debtService.createDebt(userId, data);
    await Promise.all([
      refreshDebts(),
      refreshDebtSnowball(),
      refreshFinancialSummary(),
      refreshJourneyRoadmap(),
    ]);
    return newDebt;
  };

  const updateDebt = async (debtId: number, data: DebtUpdate): Promise<DebtResponse> => {
    if (!userId) throw new Error('User not loaded');
    const updated = await debtService.updateDebt(userId, debtId, data);
    await Promise.all([
      refreshDebts(),
      refreshDebtSnowball(),
      refreshFinancialSummary(),
      refreshJourneyRoadmap(),
    ]);
    return updated;
  };

  const deleteDebt = async (debtId: number): Promise<void> => {
    if (!userId) throw new Error('User not loaded');
    await debtService.deleteDebt(userId, debtId);
    await Promise.all([
      refreshDebts(),
      refreshDebtSnowball(),
      refreshFinancialSummary(),
      refreshJourneyRoadmap(),
    ]);
  };

  // Schemes mutations (I4)
  const bookmarkScheme = async (
    schemeId: number,
    data: BookmarkRequest
  ): Promise<BookmarkResponse> => {
    if (!userId) throw new Error('User not loaded');
    const res = await schemeService.bookmarkScheme(userId, schemeId, data);
    await refreshMatchedSchemes();
    return res;
  };

  // Learning mutations (I4)
  const completeLesson = async (
    lessonId: string,
    quizScore?: number
  ): Promise<UserLessonProgressResponse> => {
    if (!userId) throw new Error('User not loaded');
    const res = await learningService.completeLesson(userId, lessonId, {
      quiz_score: quizScore,
    });
    await refreshLearningProgress();
    return res;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        userId,
        isOnline,
        isLoading,
        error,
        bootstrapUser,
        loginUser,
        loginAsDemoLakshmi,
        logoutUser,
        refreshUser,
        updateUserPreferences,
        setCurrentUser,

        language,
        setLanguage,
        operatingState,
        setOperatingState,

        financialSummary,
        refreshFinancialSummary,
        totalMonthlyExpenses,
        totalMonthlyIncome,
        totalMonthlySurplus,
        totalSavings,
        totalDebt,

        transactions,
        refreshTransactions,
        logTransaction,
        deleteTransaction,

        goals,
        refreshGoals,
        createGoal,
        updateGoal,
        depositToGoal,
        deleteGoal,

        debts,
        refreshDebts,
        createDebt,
        updateDebt,
        deleteDebt,
        debtSnowball,
        refreshDebtSnowball,

        matchedSchemes,
        refreshMatchedSchemes,
        bookmarkScheme,

        journeyRoadmap,
        refreshJourneyRoadmap,

        learningProgress,
        refreshLearningProgress,
        completeLesson,
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
