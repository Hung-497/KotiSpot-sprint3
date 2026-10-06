import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { apiRequest } from "../services/api";
import { applyThemeClass } from "../utils/applyTheme";

const DEFAULT_PREFERENCES = {
  theme: "system",
  emailNotifications: true,
  marketingEmails: false,
  smsNotifications: false,
};

const THEME_STORAGE_KEY = "kotispotTheme";

const getStoredTheme = () => {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
};

const usePreferences = (isLoggedIn) => {
  const [preferences, setPreferences] = useState(() => ({
    ...DEFAULT_PREFERENCES,
    theme: getStoredTheme() || DEFAULT_PREFERENCES.theme,
  }));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const hasAppliedTheme = useRef(false);

  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
    setError("");
    setMessage("");
  };

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const loadPreferences = async () => {
      setIsLoading(true);
      setError("");
      setMessage("");

      try {
        const data = await apiRequest("/users/me/preferences");
        setPreferences(data.preferences);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [isLoggedIn]);

  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const useDark =
        preferences.theme === "dark" ||
        (preferences.theme === "system" && mediaQuery.matches);

      // No cross-fade for the very first theme on page load
      applyThemeClass(useDark, { animate: hasAppliedTheme.current });
      hasAppliedTheme.current = true;
    };

    applyTheme();

    try {
      localStorage.setItem(THEME_STORAGE_KEY, preferences.theme);
    } catch {
      // Storage blocked: the theme still applies for this visit
    }

    if (preferences.theme === "system") {
      mediaQuery.addEventListener("change", applyTheme);

      return () => {
        mediaQuery.removeEventListener("change", applyTheme);
      };
    }
  }, [preferences.theme]);

  return {
    preferences,
    setPreferences,
    isLoading,
    error,
    setError,
    message,
    setMessage,
    resetPreferences,
  };
};

export default usePreferences;
