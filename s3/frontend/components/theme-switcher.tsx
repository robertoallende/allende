"use client"

import { useTheme } from "@/lib/theme-context"
import { Button } from "@/components/ui/button"
import { ChevronDownIcon, PaletteIcon } from "lucide-react"
import { useState } from "react"

export function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const currentTheme = themes.find(t => t.id === theme)

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <PaletteIcon className="h-4 w-4" />
        {currentTheme?.name}
        <ChevronDownIcon className="h-4 w-4" />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-2 w-64 bg-background border rounded-lg shadow-lg z-20">
            <div className="p-2">
              <div className="text-sm font-medium text-muted-foreground px-2 py-1 mb-1">
                Choose Theme
              </div>
              {themes.map((themeOption) => (
                <button
                  key={themeOption.id}
                  onClick={() => {
                    setTheme(themeOption.id)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-2 py-2 rounded hover:bg-muted transition-colors ${
                    theme === themeOption.id ? "bg-muted" : ""
                  }`}
                >
                  <div className="font-medium">{themeOption.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {themeOption.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
