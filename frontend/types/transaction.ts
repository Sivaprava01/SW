/**
 * Sakhi Transaction Schemas & Contracts.
 * Strictly synchronized with backend/app/schemas/transaction.py.
 */

export interface TransactionBase {
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string; // YYYY-MM-DD
  description?: string | null;
}

export interface TransactionCreate extends TransactionBase {}

export interface TransactionResponse extends TransactionBase {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}
