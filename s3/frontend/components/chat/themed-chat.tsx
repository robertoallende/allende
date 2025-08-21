"use client"

import { useState } from "react"
import { useTheme } from "@/lib/theme-context"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { KeyboardThemeSwitcher } from "@/components/keyboard-theme-switcher"

export function ThemedChat() {
  const { theme } = useTheme()
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return
    
    const userMessage = { role: "user", content: input }
    const botResponse = { role: "assistant", content: `Thanks for your message: "${input}". This is a demo response!` }
    
    setMessages(prev => [...prev, userMessage, botResponse])
    setInput("")
  }

  // Theme-specific styles
  const themeStyles = {
    default: {
      container: "h-screen flex flex-col bg-background",
      header: "p-4 border-b bg-background",
      headerTitle: "text-2xl font-bold text-foreground",
      headerSubtitle: "text-muted-foreground",
      messages: "flex-1 overflow-y-auto p-4 space-y-4",
      welcomeTitle: "text-xl font-semibold mb-4 text-foreground",
      welcomeSubtitle: "text-muted-foreground mb-8",
      suggestionCard: "p-4 border rounded-lg hover:bg-muted/80 transition-colors text-left bg-background",
      suggestionTitle: "font-semibold mb-2 text-foreground",
      suggestionText: "text-sm text-muted-foreground",
      userMessage: "bg-muted text-foreground",
      assistantMessage: "bg-background border font-mono text-foreground",
      input: "p-4 border-t bg-background",
      inputField: "flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground",
      sendButton: "px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
    },
    dark: {
      container: "h-screen flex flex-col bg-slate-900 text-slate-100",
      header: "p-4 border-b border-slate-700 bg-slate-800",
      headerTitle: "text-2xl font-bold text-slate-100",
      headerSubtitle: "text-slate-400",
      messages: "flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900",
      welcomeTitle: "text-xl font-semibold mb-4 text-slate-100",
      welcomeSubtitle: "text-slate-400 mb-8",
      suggestionCard: "p-4 border border-slate-600 rounded-lg hover:bg-slate-800 transition-colors text-left bg-slate-800/50",
      suggestionTitle: "font-semibold mb-2 text-slate-100",
      suggestionText: "text-sm text-slate-400",
      userMessage: "bg-blue-600 text-white",
      assistantMessage: "bg-slate-800 border border-slate-600 font-mono text-slate-100",
      input: "p-4 border-t border-slate-700 bg-slate-800",
      inputField: "flex-1 px-3 py-2 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-700 text-slate-100 placeholder-slate-400",
      sendButton: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    },
    colorful: {
      container: "h-screen flex flex-col bg-gradient-to-br from-purple-50 to-pink-50",
      header: "p-4 border-b border-purple-200 bg-gradient-to-r from-purple-500 to-pink-500 text-white",
      headerTitle: "text-2xl font-bold",
      headerSubtitle: "text-purple-100",
      messages: "flex-1 overflow-y-auto p-4 space-y-4",
      welcomeTitle: "text-xl font-semibold mb-4 text-purple-800",
      welcomeSubtitle: "text-purple-600 mb-8",
      suggestionCard: "p-4 border-2 border-purple-300 rounded-xl hover:bg-purple-100 transition-colors text-left bg-white/70 backdrop-blur-sm shadow-lg",
      suggestionTitle: "font-semibold mb-2 text-purple-800",
      suggestionText: "text-sm text-purple-600",
      userMessage: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
      assistantMessage: "bg-white/80 backdrop-blur-sm border border-purple-200 font-mono text-purple-900",
      input: "p-4 border-t border-purple-200 bg-white/50 backdrop-blur-sm",
      inputField: "flex-1 px-3 py-2 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/80 backdrop-blur-sm",
      sendButton: "px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 shadow-lg"
    },
    professional: {
      container: "h-screen flex flex-col bg-gray-50",
      header: "p-6 border-b border-gray-200 bg-white",
      headerTitle: "text-3xl font-light text-gray-900",
      headerSubtitle: "text-gray-500 font-light",
      messages: "flex-1 overflow-y-auto p-6 space-y-6",
      welcomeTitle: "text-2xl font-light mb-6 text-gray-800",
      welcomeSubtitle: "text-gray-600 mb-12 font-light",
      suggestionCard: "p-6 border border-gray-200 rounded-none hover:bg-gray-50 transition-colors text-left bg-white shadow-sm",
      suggestionTitle: "font-medium mb-2 text-gray-900",
      suggestionText: "text-sm text-gray-600 font-light",
      userMessage: "bg-gray-900 text-white rounded-none",
      assistantMessage: "bg-white border border-gray-200 font-mono text-gray-900 rounded-none shadow-sm",
      input: "p-6 border-t border-gray-200 bg-white",
      inputField: "flex-1 px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:border-gray-900 bg-white font-light",
      sendButton: "px-8 py-3 bg-gray-900 text-white rounded-none hover:bg-gray-800 font-medium"
    }
  }

  const styles = themeStyles[theme]

  return (
    <div className={styles.container}>
      {/* Keyboard Shortcuts */}
      <KeyboardThemeSwitcher />
      
      {/* Header with Theme Switcher */}
      <div className={styles.header}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={styles.headerTitle}>Roberto Allende</h1>
            <p className={styles.headerSubtitle}>Personal Website - {theme} theme</p>
          </div>
          <ThemeSwitcher />
        </div>
      </div>

      {/* Messages */}
      <div className={styles.messages}>
        {messages.length === 0 && (
          <div className="text-center py-12">
            <h2 className={styles.welcomeTitle}>Welcome!</h2>
            <p className={styles.welcomeSubtitle}>Ask me about my background, projects, or anything else!</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <button
                onClick={() => setInput("Tell me about yourself")}
                className={styles.suggestionCard}
              >
                <h3 className={styles.suggestionTitle}>About</h3>
                <p className={styles.suggestionText}>Learn about my background</p>
              </button>
              
              <button
                onClick={() => setInput("Show me your projects")}
                className={styles.suggestionCard}
              >
                <h3 className={styles.suggestionTitle}>Projects</h3>
                <p className={styles.suggestionText}>Explore what I&apos;ve built</p>
              </button>
              
              <button
                onClick={() => setInput("How can I contact you?")}
                className={styles.suggestionCard}
              >
                <h3 className={styles.suggestionTitle}>Contact</h3>
                <p className={styles.suggestionText}>Get in touch</p>
              </button>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xl px-4 py-2 rounded-lg ${
                message.role === "user" ? styles.userMessage : styles.assistantMessage
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className={styles.input}>
        <div className="flex gap-2 max-w-2xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me anything..."
            className={styles.inputField}
          />
          <button
            onClick={handleSend}
            className={styles.sendButton}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
