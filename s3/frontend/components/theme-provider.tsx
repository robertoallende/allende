"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Theme = "default" | "dark" | "claude";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: Array<{
    id: Theme;
    name: string;
    description: string;
  }>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("default");

  const themes = [
    {
      id: "default" as Theme,
      name: "Default",
      description: "Clean and modern design",
    },
    {
      id: "dark" as Theme,
      name: "Dark",
      description: "Dark mode for comfortable viewing",
    },
    {
      id: "claude" as Theme,
      name: "Claude",
      description: "Inspired by Claude's elegant design",
    },
  ];

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove("dark", "claude-theme");
    
    // Apply current theme class
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "claude") {
      root.classList.add("claude-theme");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
