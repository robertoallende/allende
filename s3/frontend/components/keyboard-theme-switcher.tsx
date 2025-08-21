"use client"

import { useEffect } from "react"
import { useTheme } from "@/lib/theme-context"

export function KeyboardThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme()

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only trigger if Cmd/Ctrl + Shift + number is pressed
      if ((event.metaKey || event.ctrlKey) && event.shiftKey) {
        switch (event.key) {
          case "1":
            event.preventDefault()
            setTheme("default")
            break
          case "2":
            event.preventDefault()
            setTheme("dark")
            break
          case "3":
            event.preventDefault()
            setTheme("colorful")
            break
          case "4":
            event.preventDefault()
            setTheme("professional")
            break
          case "t":
          case "T":
            event.preventDefault()
            // Cycle through themes
            const currentIndex = themes.findIndex(t => t.id === theme)
            const nextIndex = (currentIndex + 1) % themes.length
            setTheme(themes[nextIndex].id)
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [theme, setTheme, themes])

  return (
    <div className="fixed bottom-4 right-4 bg-background/80 backdrop-blur-sm border rounded-lg p-3 text-xs text-muted-foreground">
      <div className="space-y-1">
        <div className="font-medium mb-2">Keyboard Shortcuts:</div>
        <div>⌘⇧1 - Default Theme</div>
        <div>⌘⇧2 - Dark Theme</div>
        <div>⌘⇧3 - Colorful Theme</div>
        <div>⌘⇧4 - Professional Theme</div>
        <div>⌘⇧T - Cycle Themes</div>
      </div>
    </div>
  )
}
