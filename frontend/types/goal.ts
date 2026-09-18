/**
 * Sakhi Goal Schemas & Contracts.
 * Strictly synchronized with backend/app/schemas/goal.py.
 */

export interface GoalBase {
  name: string;
  target_amount: number;
  current_amount: number;
  target_months: number;
  target_date?: string | null;
  category: string;
  priority: number;
  is_completed: boolean;
}

export interface GoalCreate {
  name: string;
  target_amount: number;
  current_amount?: number;
  target_months?: number;
  target_date?: string | null;
  category?: string;
  priority?: number;
}

export interface GoalUpdate {
  name?: string;
  target_amount?: number;
  current_amount?: number;
  target_months?: number;
  target_date?: string | null;
  category?: string;
  priority?: number;
  is_completed?: boolean;
}

export interface GoalDepositRequest {
  amount: number;
}

export interface GoalResponse extends GoalBase {
  id: number;
  user_id: number;
  remaining_amount: number;
  progress_percentage: number;
  required_monthly_savings: number;
  created_at: string;
  updated_at: string;
}
