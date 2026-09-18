/**
 * Sakhi Financial Knowledge & Golden Rules Schemas.
 * Strictly synchronized with backend/app/schemas/knowledge.py.
 */

export interface LocalizedText {
  en: string;
  te: string;
  hi: string;
}

export interface FinancialConceptResponse {
  id: string;
  slug: string;
  category: string;
  title: LocalizedText;
  summary: LocalizedText;
  plain_language_explanation: LocalizedText;
  practical_action: LocalizedText;
  warning_or_pitfall?: LocalizedText | null;
}

export interface GoldenRuleResponse {
  rule_number: number;
  rule_key: string;
  title: LocalizedText;
  short_formula: string;
  explanation: LocalizedText;
  example: LocalizedText;
}
