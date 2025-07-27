"use client";

import React, { useEffect } from "react";
import useThemeStore from "../lib/store/useThemeStore";

type Theme = "light" | "dark";

export const useTheme = () => {
  const {
    theme,
    setTheme: setStoreTheme,
    toggleTheme: toggleStoreTheme,
  } = useThemeStore();

  const applyTheme = (newTheme: string) => {
    if (typeof window !== "undefined") {
      const html = document.documentElement;
      html.classList.remove("light", "dark");
      html.classList.add(newTheme);
    }
  };

  const setTheme = (newTheme: Theme) => {
    setStoreTheme(newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    toggleStoreTheme();
    // Apply the new theme after toggle
    const newTheme = theme === "light" ? "dark" : "light";
    applyTheme(newTheme);
  };

  return {
    theme: theme as Theme,
    setTheme,
    toggleTheme,
  };
};

type ThemeProviderProps = {
  children: React.ReactNode;
};

// Simplified provider that just handles initial theme application
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme } = useThemeStore();

  // Apply theme on mount and when theme changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const html = document.documentElement;

      // Read the theme that was already applied by the inline script
      const appliedTheme = html.classList.contains("dark") ? "dark" : "light";

      // If store theme doesn't match applied theme, apply the store theme
      if (theme !== appliedTheme) {
        html.classList.remove("light", "dark");
        html.classList.add(theme);
      }
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if no theme is stored in localStorage
      const storedTheme = localStorage.getItem("theme-storage");
      if (!storedTheme) {
        const newTheme = e.matches ? "dark" : "light";
        useThemeStore.getState().setTheme(newTheme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return <>{children}</>;
};
