import { useLanguage } from "../components/LanguageContext";
import { getTranslation } from "../translation-service";

/**
 * Hook to access translations
 * @returns Object with translation functions
 */
export function useTranslation() {
  const { language } = useLanguage();

  /**
   * Translate a key to the current language
   * @param key Translation key (e.g., 'common.submit')
   * @param replacements Object with placeholder replacements
   * @returns Translated text
   */
  const t = (key: string, replacements?: Record<string, string>): string => {
    return getTranslation(key, language, replacements);
  };

  /**
   * Translate a key to a specific language
   * @param key Translation key (e.g., 'common.submit')
   * @param specificLanguage Language to translate to
   * @param replacements Object with placeholder replacements
   * @returns Translated text
   */
  const translateTo = (
    key: string,
    specificLanguage: string,
    replacements?: Record<string, string>
  ): string => {
    return getTranslation(key, specificLanguage, replacements);
  };

  return {
    t,
    translateTo,
    language,
  };
}
