// Central configuration for language settings

/**
 * Interface for the language configuration
 */
export interface LanguageConfig {
  /** All supported language codes */
  SUPPORTED_LANGUAGES: string[];

  /** Default language (no prefix in URL) */
  DEFAULT_LANGUAGE: string;

  /** Display names for each language in the UI */
  LANGUAGE_NAMES: Record<string, string>;

  /** File suffix separator (e.g., post-1.vi.md uses "." as separator) */
  SUFFIX_SEPARATOR: string;
}

/**
 * Configuration for supported languages and default language
 */
export const LANGUAGE_CONFIG: LanguageConfig = {
  // All supported languages
  SUPPORTED_LANGUAGES: ["en", "vi"],

  // Default language (no prefix in URL)
  DEFAULT_LANGUAGE: "en",

  // Language display names for UI
  LANGUAGE_NAMES: {
    en: "English",
    vi: "Tiếng Việt",
  },

  // File suffix separator (e.g., post-1.vi.md uses "." as separator)
  SUFFIX_SEPARATOR: ".",
};

/**
 * Get non-default languages
 * @returns Array of non-default language codes
 */
export function getNonDefaultLanguages(): string[] {
  return LANGUAGE_CONFIG.SUPPORTED_LANGUAGES.filter(
    (lang) => lang !== LANGUAGE_CONFIG.DEFAULT_LANGUAGE
  );
}

/**
 * Generate URL path for a given language
 * @param path - The base path without language prefix
 * @param language - The language code
 * @returns URL path with appropriate language handling
 */
export function getLanguagePath(path: string, language: string): string {
  // If it's the default language, don't add a prefix
  if (language === LANGUAGE_CONFIG.DEFAULT_LANGUAGE) {
    return path;
  }

  // Otherwise, add the language prefix
  return `/${language}${path}`;
}

/**
 * Get the alternate language
 * @param currentLanguage - The current language
 * @returns The alternate language
 */
export function getAlternateLanguage(currentLanguage: string): string {
  const { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } = LANGUAGE_CONFIG;

  // If there are only two languages, just return the other one
  if (SUPPORTED_LANGUAGES.length === 2) {
    return currentLanguage === SUPPORTED_LANGUAGES[0]
      ? SUPPORTED_LANGUAGES[1]
      : SUPPORTED_LANGUAGES[0];
  }

  // If there are more than two languages, return the default language
  // or the first non-default language
  return currentLanguage === DEFAULT_LANGUAGE
    ? SUPPORTED_LANGUAGES.find((lang) => lang !== DEFAULT_LANGUAGE) ||
        DEFAULT_LANGUAGE
    : DEFAULT_LANGUAGE;
}

/**
 * Get the display name for a language code
 * @param code Language code
 * @returns Display name for the language
 */
export function getLanguageName(code: string): string {
  return LANGUAGE_CONFIG.LANGUAGE_NAMES[code] || code.toUpperCase();
}
