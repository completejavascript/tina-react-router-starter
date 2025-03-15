import React from "react";
import { useLanguage } from "./LanguageContext";
import { Menu, Button } from "@mantine/core";
import { useLocation, useNavigate } from "react-router";
import { LANGUAGE_CONFIG, getLanguageName } from "../language-config";

const { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } = LANGUAGE_CONFIG;

/**
 * Language Switcher component that allows switching between available languages
 * and preserves the current path when switching
 */
const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * Handle language switching generically for any path
   * @param newLanguage - The new language to switch to
   */
  const handleLanguageChange = (newLanguage: string): void => {
    if (
      !SUPPORTED_LANGUAGES.includes(newLanguage) ||
      newLanguage === language
    ) {
      return;
    }

    // Get the current path without any language prefix
    let currentPath = location.pathname;
    const pathParts = currentPath.split("/").filter(Boolean);

    // Check if the first part is a language code
    if (SUPPORTED_LANGUAGES.includes(pathParts[0])) {
      // Remove the language prefix
      currentPath = "/" + pathParts.slice(1).join("/");
    }

    // Generate the new path based on the language
    let newPath = currentPath;
    if (newLanguage !== DEFAULT_LANGUAGE) {
      // For non-default languages, add the language prefix
      newPath = `/${newLanguage}${currentPath}`;
    }

    // Navigate to the new path
    navigate(newPath);

    // Update the language state
    setLanguage(newLanguage);
  };

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button variant="subtle">{getLanguageName(language)}</Button>
      </Menu.Target>

      <Menu.Dropdown>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <Menu.Item
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            disabled={lang === language}
          >
            {getLanguageName(lang)}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default LanguageSwitcher;
