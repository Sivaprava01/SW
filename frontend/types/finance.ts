/**
 * Sakhi Financial Health & Summary Contracts.
 * Strictly synchronized with backend/app/schemas/finance.py.
 */

export interface CategoryBreakdown {
  category: string;
  total_amount: number;
  percentage: number;
}

export interface FinancialSummaryResponse {
  user_id: number;
  user_name: string;
  primary_language: string;

  // Income, Expenses & Disposable Surplus
  monthly_income: number;
  monthly_expenses: number;
  monthly_surplus: number;

  // Financial Ratios & Key Indicators
  savings_ratio: number;
  expense_ratio: number;

  // Balances
  total_savings: number;
  total_debt: number;

  // Emergency Fund Baseline Metric (Suraksha Kavach)
  emergency_target: number;
  emergency_progress_percentage: number;

  // Categorization & Plain-Language Summary
  health_status: 'Healthy Surplus' | 'Tight Budget' | 'Negative Cashflow / Deficit';
  health_summary: string;

  // Breakdown
  expense_breakdown: CategoryBreakdown[];
  income_breakdown: CategoryBreakdown[];
}
