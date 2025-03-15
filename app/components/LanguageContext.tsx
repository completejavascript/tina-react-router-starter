import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { useLocation, useNavigate } from "react-router";
import {
  LANGUAGE_CONFIG,
  getNonDefaultLanguages,
  getLanguagePath,
} from "../language-config";

const { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } = LANGUAGE_CONFIG;

/**
 * Interface for the Language Context value
 */
interface LanguageContextType {
  /** Current language code */
  language: string;

  /** Function to change the current language */
  setLanguage: (language: string) => void;

  /** Function to translate a path to another language */
  translatePath: (path: string, targetLang?: string) => string;

  /** Whether the current language is the default language */
  isDefaultLanguage: boolean;
}

/**
 * Interface for the Language Provider props
 */
interface LanguageProviderProps {
  children: React.ReactNode;
}

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  translatePath: (path) => path,
  isDefaultLanguage: true,
});

/**
 * Hook to access the language context
 */
export const useLanguage = () => useContext(LanguageContext);

/**
 * Provider component for language context
 */
export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [language, setLanguageState] = useState<string>(DEFAULT_LANGUAGE);

  // Extract language from URL path when component mounts or URL changes
  useEffect(() => {
    const pathParts = location.pathname.split("/").filter(Boolean);
    const langFromUrl = pathParts[0];

    if (SUPPORTED_LANGUAGES.includes(langFromUrl)) {
      setLanguageState(langFromUrl);
    } else {
      // If no language in URL, assume default language
      setLanguageState(DEFAULT_LANGUAGE);
    }
  }, [location.pathname]);

  // Function to change language
  const setLanguage = (newLanguage: string) => {
    if (!SUPPORTED_LANGUAGES.includes(newLanguage)) return;

    setLanguageState(newLanguage);

    // Update URL to reflect new language
    const pathParts = location.pathname.split("/").filter(Boolean);
    const currentLang = pathParts[0];

    if (SUPPORTED_LANGUAGES.includes(currentLang)) {
      // Replace current language with new one
      if (newLanguage === DEFAULT_LANGUAGE) {
        // Remove language prefix for default language
        navigate("/" + pathParts.slice(1).join("/"));
      } else {
        // Replace language prefix
        pathParts[0] = newLanguage;
        navigate("/" + pathParts.join("/"));
      }
    } else {
      // Add language prefix if not present (only for non-default languages)
      if (newLanguage !== DEFAULT_LANGUAGE) {
        navigate(`/${newLanguage}/${pathParts.join("/")}`);
      }
    }
  };

  // Function to translate paths between languages
  const translatePath = (
    path: string,
    targetLang: string = language
  ): string => {
    const pathParts = path.split("/").filter(Boolean);
    const firstPart = pathParts[0];

    // Special handling for default language
    if (targetLang === DEFAULT_LANGUAGE) {
      // If the first part is a language code, remove it
      if (SUPPORTED_LANGUAGES.includes(firstPart)) {
        return "/" + pathParts.slice(1).join("/");
      }
    } else {
      // For non-default languages
      if (SUPPORTED_LANGUAGES.includes(firstPart)) {
        // Replace language code
        pathParts[0] = targetLang;
      } else {
        // Add language code
        pathParts.unshift(targetLang);
      }
    }

    return "/" + pathParts.join("/");
  };

  const isDefaultLanguage = language === DEFAULT_LANGUAGE;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        translatePath,
        isDefaultLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
