import { useState, useEffect } from "react";
import { apiRequest } from "../services/api";

const DEFAULT_PREFERENCES = {
  theme: "system",
  emailNotifications: true,
  marketingEmails: false,
  smsNotifications: false,
};

const usePreferences = (isLoggedIn) => {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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

  useEffect(() => {
    const root = document.documentElement;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const useDark =
        preferences.theme === "dark" ||
        (preferences.theme === "system" && mediaQuery.matches);

      root.classList.toggle("dark", useDark);
    };

    applyTheme();

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
