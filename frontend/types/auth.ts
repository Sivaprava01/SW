/**
 * Sakhi Authentication Type Definitions.
 */

import { UserResponse } from './api';

export interface LoginPayload {
  mobile?: string;
  phone_number?: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  mobile?: string;
  phone_number?: string;
  password: string;
  age?: number;
  gender?: string;
  state?: string;
  district?: string;
  locality_type?: string;
  primary_language?: string;
  is_shg_member?: boolean;
  shg_name?: string;
  occupation?: string;
  monthly_income?: number;
  monthly_expenses?: number;
  initial_savings?: number;
  initial_debt?: number;
}

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
  user: UserResponse;
}

export interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface LogoutResponse {
  message: string;
}
