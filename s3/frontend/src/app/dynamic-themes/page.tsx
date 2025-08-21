"use client"

import { ThemeProvider } from "@/lib/theme-context"
import { ThemedChat } from "@/components/chat/themed-chat"

export default function DynamicThemes() {
  return (
    <ThemeProvider>
      <ThemedChat />
    </ThemeProvider>
  )
}
