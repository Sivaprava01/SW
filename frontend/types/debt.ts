/**
 * Sakhi Debt & Snowball Analysis Schemas & Contracts.
 * Strictly synchronized with backend/app/schemas/debt.py.
 */

export type LenderType = 'moneylender' | 'shg' | 'bank' | 'family_friend';

export interface DebtBase {
  lender_name: string;
  lender_type: LenderType;
  principal_amount: number;
  current_balance: number;
  monthly_interest_rate: number;
  annual_interest_rate?: number | null;
  monthly_emi_payment: number;
  is_cleared: boolean;
  notes?: string | null;
}

export interface DebtCreate extends DebtBase {}

export interface DebtUpdate {
  lender_name?: string;
  lender_type?: LenderType;
  principal_amount?: number;
  current_balance?: number;
  monthly_interest_rate?: number;
  annual_interest_rate?: number | null;
  monthly_emi_payment?: number;
  is_cleared?: boolean;
  notes?: string | null;
}

export interface DebtResponse extends DebtBase {
  id: number;
  user_id: number;
  monthly_interest_drain: number;
  created_at: string;
  updated_at: string;
}

export interface DebtSnowballItem {
  debt_id: number;
  lender_name: string;
  lender_type: string;
  current_balance: number;
  monthly_interest_rate: number;
  annual_interest_rate: number;
  monthly_interest_drain: number;
  payoff_priority_rank: number;
}

export interface DebtSnowballAnalysisResponse {
  user_id: number;
  total_debt_balance: number;
  total_monthly_interest_drain: number;
  total_monthly_emi: number;
  informal_debt_balance: number;
  informal_monthly_interest: number;
  potential_shg_refinance_monthly_savings: number;
  potential_annual_refinance_savings: number;
  debts_snowball_order: DebtSnowballItem[];
  debts_avalanche_order: DebtSnowballItem[];
  actionable_recommendation: string;
}
