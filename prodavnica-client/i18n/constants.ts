/**
 * Client-safe language constants and types
 * No server imports - safe to use in client and server components
 */

export type Language = 'sr' | 'en';

export const DEFAULT_LANGUAGE: Language = 'sr';
export const LANGUAGE_COOKIE = 'lang';

export function isSupportedLanguage(lang: unknown): lang is Language {
  return lang === 'sr' || lang === 'en';
}
