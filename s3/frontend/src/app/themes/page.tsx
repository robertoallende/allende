"use client"

import Link from "next/link"

export default function ThemeSelector() {
  const themes = [
    {
      name: "Dynamic Switcher",
      description: "Switch themes on-the-fly with dropdown or keyboard shortcuts",
      href: "/dynamic-themes",
      preview: "bg-gradient-to-r from-background via-muted to-background border text-foreground",
      accent: "bg-gradient-to-r from-primary via-secondary to-primary text-primary-foreground",
      featured: true
    },
    {
      name: "Default",
      description: "Clean and modern with your existing design system",
      href: "/",
      preview: "bg-background border text-foreground",
      accent: "bg-primary text-primary-foreground"
    },
    {
      name: "Dark Mode",
      description: "Sleek dark theme perfect for late-night coding",
      href: "/dark-theme",
      preview: "bg-slate-900 border-slate-700 text-slate-100",
      accent: "bg-blue-600 text-white"
    },
    {
      name: "Colorful",
      description: "Vibrant gradients and playful colors",
      href: "/colorful-theme",
      preview: "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 text-purple-900",
      accent: "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
    },
    {
      name: "Professional",
      description: "Minimal and sophisticated for business use",
      href: "/professional-theme",
      preview: "bg-gray-50 border-gray-200 text-gray-900",
      accent: "bg-gray-900 text-white"
    }
  ]

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Theme</h1>
          <p className="text-xl text-muted-foreground">
            Select a theme that matches your style and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {themes.map((theme) => (
            <Link
              key={theme.name}
              href={theme.href}
              className="group block"
            >
              <div className={`border rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${
                theme.featured ? "ring-2 ring-primary ring-offset-2" : ""
              }`}>
                {theme.featured && (
                  <div className="bg-primary text-primary-foreground px-3 py-1 text-sm font-medium">
                    ⭐ Recommended
                  </div>
                )}
                {/* Theme Preview */}
                <div className={`h-48 p-6 ${theme.preview} relative`}>
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Roberto Allende</h3>
                      <div className="w-3 h-3 rounded-full bg-current opacity-50"></div>
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-end">
                        <div className={`px-3 py-1 rounded-full text-sm ${theme.accent}`}>
                          Hello!
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="px-3 py-1 rounded border bg-opacity-50 text-sm font-mono">
                          Hi there! How can I help?
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-4">
                      <div className="flex-1 h-8 border rounded opacity-50"></div>
                      <div className={`w-8 h-8 rounded ${theme.accent} opacity-80`}></div>
                    </div>
                  </div>
                </div>

                {/* Theme Info */}
                <div className="p-6 bg-background">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {theme.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {theme.description}
                  </p>
                  <div className="mt-4 text-sm text-primary font-medium">
                    Try this theme →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-muted rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Want a Custom Theme?</h2>
            <p className="text-muted-foreground mb-4">
              All themes are built with Tailwind CSS and can be easily customized.
              You have full control over colors, spacing, typography, and animations.
            </p>
            <div className="text-sm text-muted-foreground">
              <strong>Customization options:</strong> Colors, fonts, spacing, animations, layouts, and more
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
