"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type Theme = "default" | "dark" | "colorful" | "professional"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  themes: Array<{
    id: Theme
    name: string
    description: string
  }>
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("default")

  const themes = [
    {
      id: "default" as Theme,
      name: "Default",
      description: "Clean and modern design"
    },
    {
      id: "dark" as Theme,
      name: "Dark Mode",
      description: "Sleek dark interface"
    },
    {
      id: "colorful" as Theme,
      name: "Colorful",
      description: "Vibrant gradients"
    },
    {
      id: "professional" as Theme,
      name: "Professional",
      description: "Minimal and sophisticated"
    }
  ]

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
