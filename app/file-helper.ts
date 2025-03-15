// Helper functions for managing language-suffixed files
import { LANGUAGE_CONFIG, getLanguagePath } from "./language-config";

const { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, SUFFIX_SEPARATOR } =
  LANGUAGE_CONFIG;

/**
 * Interface for the result of parsing a filename
 */
export interface ParsedFilename {
  /** Base name of the file without language suffix */
  baseName: string;

  /** Language code extracted from the filename */
  language: string;
}

/**
 * Extracts the base name and language from a filename
 * @param filename - Filename with potential language suffix (e.g., "post-1.en")
 * @returns Object containing baseName and language
 */
export function parseFilename(filename: string): ParsedFilename {
  if (!filename) return { baseName: "", language: DEFAULT_LANGUAGE };

  // Create a regex pattern based on the suffix separator and supported languages
  // For example, with "." as separator and "vi", "en" as languages: \.(?:vi|en)$
  const langPattern = SUPPORTED_LANGUAGES.join("|");
  const escSeparator = SUFFIX_SEPARATOR.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special characters
  const suffixPattern = new RegExp(`${escSeparator}(${langPattern})$`);
  const match = filename.match(suffixPattern);

  if (match) {
    const lang = match[1];
    // Calculate base name by removing the suffix (including separator)
    const suffixWithSeparator = SUFFIX_SEPARATOR + lang;
    const baseName = filename.slice(0, -suffixWithSeparator.length);
    return {
      baseName,
      language: lang,
    };
  }

  // Default to default language for files without language suffix
  return {
    baseName: filename,
    language: DEFAULT_LANGUAGE,
  };
}

/**
 * Generates the correct URL for a post based on its base name and language
 * @param baseName - Base name of the post (without language suffix)
 * @param language - Language code
 * @returns URL for the post
 */
export function getPostUrl(baseName: string, language: string): string {
  return getLanguagePath(`/posts/${baseName}`, language);
}

/**
 * Creates a filename with language suffix
 * @param baseName - Base name of the post
 * @param language - Language code
 * @returns Filename with language suffix
 */
export function createFilename(baseName: string, language: string): string {
  return `${baseName}${SUFFIX_SEPARATOR}${language}`;
}

/**
 * Gets the alternate language code
 * @param language - Current language code
 * @returns Alternate language code
 */
export function getAlternateLanguage(language: string): string {
  // If we only have two languages, just return the other one
  if (SUPPORTED_LANGUAGES.length === 2) {
    return language === SUPPORTED_LANGUAGES[0]
      ? SUPPORTED_LANGUAGES[1]
      : SUPPORTED_LANGUAGES[0];
  }

  // If we have more languages, return the default or first non-default
  return language === DEFAULT_LANGUAGE
    ? SUPPORTED_LANGUAGES.find((lang) => lang !== DEFAULT_LANGUAGE) ||
        DEFAULT_LANGUAGE
    : DEFAULT_LANGUAGE;
}

/**
 * Gets the URL for the same content in the alternate language
 * @param baseName - Base name of the post
 * @param currentLanguage - Current language code
 * @returns URL for the same content in the alternate language
 */
export function getAlternateLanguageUrl(
  baseName: string,
  currentLanguage: string
): string {
  const alternateLanguage = getAlternateLanguage(currentLanguage);
  return getPostUrl(baseName, alternateLanguage);
}
