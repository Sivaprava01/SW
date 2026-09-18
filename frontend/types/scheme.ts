/**
 * Sakhi Government Scheme Schemas.
 * Strictly synchronized with backend/app/schemas/scheme.py.
 */

export interface SchemeBase {
  slug: string;
  name: string;
  short_name: string;
  category: string;
  jurisdiction: string;
  benefit_amount_display: string;
  cost_or_premium: string;
  min_age: number;
  max_age: number;
  gender_eligibility: 'female_only' | 'all' | 'male_only';
  rural_urban: 'rural' | 'urban' | 'all';
  requires_shg: boolean;
  max_annual_income?: number | null;
  description: string;
  what_it_provides: string;
  target_beneficiaries: string;
  required_documents: string[];
  offline_application_process: string;
  official_portal_url?: string | null;
  is_active?: boolean;
}

export interface SchemeResponse extends SchemeBase {
  id: number;
}

export interface SchemeMatchResponse extends SchemeResponse {
  match_score: number;
  is_eligible: boolean;
  eligibility_reasons: string[];
  missing_requirements: string[];
  user_application_status?: string | null;
}

export interface BookmarkRequest {
  is_bookmarked?: boolean;
  application_status?: 'discovered' | 'applied' | 'enrolled' | 'dismissed';
  notes?: string | null;
}

export interface BookmarkResponse {
  id: number;
  user_id: number;
  scheme_id: number;
  is_bookmarked: boolean;
  application_status: string;
  notes?: string | null;
  scheme: SchemeResponse;
}
