"use client"

import { useState, useEffect } from "react"
import { MessageRenderer } from "@/components/chat/message-renderer"
import { ThemeProvider, useTheme } from "@/lib/theme-context"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { KeyboardThemeSwitcher } from "@/components/keyboard-theme-switcher"
import type { ConversationData, ConversationMessage } from "@/data/conversations/schema"

// Import generated conversation index
import conversationIndex from "@/data/conversations/_index.json"

function DynamicThemedChat() {
  const { theme } = useTheme()
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: ConversationMessage = {
      id: "welcome",
      role: "assistant",
      content: `# Welcome to Dynamic Themes! 🎨\n\nI'm **Roberto Allende**. You can switch themes using the dropdown above or keyboard shortcuts!\n\n**Keyboard Shortcuts:**\n- ⌘⇧1 - Default Theme\n- ⌘⇧2 - Dark Theme  \n- ⌘⇧3 - Colorful Theme\n- ⌘⇧4 - Professional Theme\n- ⌘⇧T - Cycle Themes\n\nCurrently using: **${theme}** theme\n\nWhat would you like to know about?`,
      metadata: {
        follow_ups: conversationIndex.conversations.map(conv => 
          `Tell me about ${conv.title.toLowerCase()}`
        )
      }
    }
    setMessages([welcomeMessage])
  }, [theme])

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  const handleFollowUp = (followUpText: string) => {
    setInput(followUpText)
  }

  const handleSend = async () => {
    if (!input.trim()) return
    
    // Add user message
    const userMessage: ConversationMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input
    }
    
    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput("")
    setIsTyping(true)

    // Determine which conversation to load based on user input
    const userInput = currentInput.toLowerCase()
    let targetConversation = "about" // default
    
    if (userInput.includes("project") || userInput.includes("built") || userInput.includes("work") || userInput.includes("portfolio")) {
      targetConversation = "projects"
    } else if (userInput.includes("blog") || userInput.includes("write") || userInput.includes("article") || userInput.includes("post")) {
      targetConversation = "blog"
    } else if (userInput.includes("poetry") || userInput.includes("poem") || userInput.includes("creative") || userInput.includes("truth")) {
      targetConversation = "poetry"
    } else if (userInput.includes("contact") || userInput.includes("reach") || userInput.includes("email") || userInput.includes("touch") || userInput.includes("hire")) {
      targetConversation = "contact"
    } else if (userInput.includes("theme") || userInput.includes("switch") || userInput.includes("color")) {
      // Theme-related response
      const themeResponse: ConversationMessage = {
        id: `theme-${Date.now()}`,
        role: "assistant",
        content: `# Theme Switching 🎨\n\nYou're currently using the **${theme}** theme! Here's how to switch:\n\n## **Dropdown Method**\nClick the palette icon (🎨) in the top-right corner to see all available themes.\n\n## **Keyboard Shortcuts**\n- **⌘⇧1** → Default Theme\n- **⌘⇧2** → Dark Theme\n- **⌘⇧3** → Colorful Theme  \n- **⌘⇧4** → Professional Theme\n- **⌘⇧T** → Cycle through all themes\n\n## **Available Themes**\n- **Default**: Clean and modern design\n- **Dark**: Sleek dark interface for night coding\n- **Colorful**: Vibrant gradients and playful colors\n- **Professional**: Minimal and sophisticated\n\nTry switching themes and see how the entire interface adapts!`,
        metadata: {
          follow_ups: [
            "Tell me about yourself",
            "Show me your projects",
            "What do you write about?"
          ]
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsTyping(false)
      setMessages(prev => [...prev, themeResponse])
      return
    }

    // Load the appropriate conversation
    try {
      const conversationModule = await import(`@/data/conversations/${targetConversation}.json`)
      const conversationData = conversationModule.default as ConversationData
      
      // Get the main assistant message from the conversation
      const mainConversation = conversationData.conversations[0]
      let responseMessage: ConversationMessage | null = null
      
      if (mainConversation && mainConversation.messages.length > 1) {
        const originalMessage = mainConversation.messages[1]
        responseMessage = {
          ...originalMessage,
          id: `${originalMessage.id}-${Date.now()}`,
          content: originalMessage.content + `\n\n*Currently viewing in **${theme}** theme - try switching themes to see how the content adapts!*`
        }
      }

      // Fallback response
      if (!responseMessage) {
        responseMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: `Thanks for your question about "${currentInput}". I'd be happy to help! You can also try switching themes using the dropdown or keyboard shortcuts.`,
          metadata: {
            follow_ups: [
              "Tell me about yourself",
              "Show me your projects",
              "How do I switch themes?"
            ]
          }
        }
      }

      // Simulate typing delay
      const typingDelay = responseMessage.metadata?.typing_delay || 1500
      await new Promise(resolve => setTimeout(resolve, typingDelay))
      
      setIsTyping(false)
      setMessages(prev => [...prev, responseMessage!])
      
    } catch (error) {
      console.error(`Failed to load ${targetConversation} conversation:`, error)
      
      const errorResponse: ConversationMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "I'm sorry, I had trouble loading that information. Try asking about my background, projects, or how to switch themes!",
        metadata: {
          follow_ups: [
            "Tell me about yourself",
            "Show me your projects",
            "How do I switch themes?"
          ]
        }
      }
      
      setIsTyping(false)
      setMessages(prev => [...prev, errorResponse])
    }
  }

  // Theme-specific styles
  const themeStyles = {
    default: "h-screen flex flex-col bg-background",
    dark: "h-screen flex flex-col bg-slate-900 text-slate-100",
    colorful: "h-screen flex flex-col bg-gradient-to-br from-purple-50 to-pink-50",
    professional: "h-screen flex flex-col bg-gray-50"
  }

  const headerStyles = {
    default: "p-4 border-b bg-background",
    dark: "p-4 border-b border-slate-700 bg-slate-800",
    colorful: "p-4 border-b border-purple-200 bg-gradient-to-r from-purple-500 to-pink-500 text-white",
    professional: "p-6 border-b border-gray-200 bg-white"
  }

  return (
    <div className={themeStyles[theme as keyof typeof themeStyles]}>
      {/* Keyboard Shortcuts */}
      <KeyboardThemeSwitcher />
      
      {/* Header with Theme Switcher */}
      <div className={headerStyles[theme as keyof typeof headerStyles]}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Roberto Allende</h1>
            <p className="text-sm opacity-80">
              Dynamic Themes Demo - Currently: {theme}
            </p>
          </div>
          <ThemeSwitcher />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Show conversation suggestions only if minimal messages */}
        {messages.length === 1 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-6">
              Try switching themes and asking questions!
            </p>
            
            {/* Dynamic Conversation Suggestions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
              {conversationIndex.conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => handleSuggestionClick(`Tell me about ${conversation.title.toLowerCase()}`)}
                  className="p-4 border rounded-lg hover:bg-muted/80 transition-colors text-left bg-background"
                >
                  <h3 className="font-semibold mb-2 text-foreground">
                    {conversation.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {conversation.subtitle}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        {messages.map((message) => (
          <MessageRenderer 
            key={message.id} 
            message={message}
            onFollowUpClick={handleFollowUp}
          />
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-background border rounded-lg px-4 py-2 max-w-xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-background">
        <div className="flex gap-2 max-w-2xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me anything or try switching themes..."
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default function DynamicThemes() {
  return (
    <ThemeProvider>
      <DynamicThemedChat />
    </ThemeProvider>
  )
}
