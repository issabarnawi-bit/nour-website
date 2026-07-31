"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";

import { usePersistentState } from "../hooks";

export type AdminTheme = "light" | "dark";

type ThemeContextValue = {
  theme: AdminTheme;
  isDark: boolean;
  setTheme: (theme: AdminTheme) => void;
  toggleTheme: () => void;
};

const ThemeContext =
  createContext<ThemeContextValue | null>(null);

type ThemeProviderProps = {
  children: ReactNode;
};

export default function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const [theme, setTheme] =
    usePersistentState<AdminTheme>(
      "admin-theme",
      "light",
    );

  const isDark = theme === "dark";

  useEffect(() => {
    document.documentElement.dataset.adminTheme =
      theme;
  }, [theme]);

  const contextValue =
    useMemo<ThemeContextValue>(
      () => ({
        theme,
        isDark,
        setTheme,
        toggleTheme: () => {
          setTheme((currentTheme) =>
            currentTheme === "light"
              ? "dark"
              : "light",
          );
        },
      }),
      [isDark, setTheme, theme],
    );

  return (
    <ThemeContext.Provider value={contextValue}>
      <div
        className={`nr-admin-theme nr-admin-theme--${theme}`}
        data-theme={theme}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider.",
    );
  }

  return context;
}