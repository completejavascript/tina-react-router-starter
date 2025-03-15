import viTranslations from "./locales/vi";
import enTranslations from "./locales/en";
import { LANGUAGE_CONFIG } from "./language-config";

// Type for translation resources
type TranslationDictionary = {
  [key: string]: TranslationDictionary | string;
};

// All translations combined
const translations: Record<string, TranslationDictionary> = {
  vi: viTranslations,
  en: enTranslations,
};

/**
 * Get a translation by key and language
 *
 * @param key Dot-notation path to the translation (e.g., 'common.submit')
 * @param language Language code
 * @param replacements Object with replacement values
 * @returns Translated string or the key if translation not found
 */
export const getTranslation = (
  key: string,
  language: string = LANGUAGE_CONFIG.DEFAULT_LANGUAGE,
  replacements?: Record<string, string>
): string => {
  // Get the translation object for the language
  const languageTranslations =
    translations[language] || translations[LANGUAGE_CONFIG.DEFAULT_LANGUAGE];

  // Navigate through the translation object using the key path
  const keyParts = key.split(".");
  let currentObj: any = languageTranslations;

  for (const part of keyParts) {
    if (currentObj && typeof currentObj === "object" && part in currentObj) {
      currentObj = currentObj[part];
    } else {
      // Key not found, return the key itself
      return key;
    }
  }

  // If we found a string, return it
  if (typeof currentObj === "string") {
    let result = currentObj;

    // Replace placeholders if replacements are provided
    if (replacements) {
      Object.entries(replacements).forEach(([placeholder, value]) => {
        result = result.replace(new RegExp(`{{${placeholder}}}`, "g"), value);
      });
    }

    return result;
  }

  // If we didn't find a string, return the key
  return key;
};
