/**
 * Sakhi Localization Utility.
 * Resolves multilingual backend objects ({ en, te, hi }) safely falling back to English.
 */

import { LocalizedText } from '../types/knowledge';

export type SupportedLanguage = 'te' | 'hi' | 'en';

/**
 * Extracts the localized string from a backend LocalizedText object or string,
 * falling back gracefully to English or empty string.
 */
export function getLocalizedText(
  value?: LocalizedText | string | null,
  lang: SupportedLanguage = 'en'
): string {
  if (!value) return '';
  if (typeof value === 'string') return value;

  const resolved = value[lang];
  if (resolved && resolved.trim().length > 0) {
    return resolved;
  }

  // Fallback to English, then Telugu, then Hindi
  return value.en || value.te || value.hi || '';
}
