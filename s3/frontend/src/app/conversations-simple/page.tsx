"use client"

import { useState, useEffect } from "react"
import { ThemeProvider } from "@/lib/theme-context"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { MessageRenderer } from "@/components/chat/message-renderer"
import type { ConversationData, ConversationMessage } from "@/data/conversations/schema"

function ConversationChat() {
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [input, setInput] = useState("")
  const [conversationData, setConversationData] = useState<ConversationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isTyping, setIsTyping] = useState(false)

  // Load conversation data
  useEffect(() => {
    async function loadData() {
      try {
        // Load about data by default, but this could be dynamic based on URL params
        const aboutModule = await import("@/data/conversations/about.json")
        const aboutData = aboutModule.default as ConversationData
        setConversationData(aboutData)
        
        // Start with a welcome message that includes all available topics
        const welcomeMessage: ConversationMessage = {
          id: "welcome",
          role: "assistant",
          content: "# Welcome! 👋\n\nI'm Roberto Allende. I have rich content about various topics. Try asking me about:\n\n- **About**: My background and experience\n- **Projects**: What I've built and worked on\n- **Blog**: Technical insights and articles\n- **Poetry**: Creative writing and technical verses\n- **Contact**: How to get in touch\n\nWhat would you like to know about?",
          metadata: {
            follow_ups: [
              "Tell me about yourself",
              "Show me your projects", 
              "What do you write about?",
              "Share some of your poetry",
              "How can I contact you?"
            ]
          }
        }
        setMessages([welcomeMessage])
      } catch (error) {
        console.error("Failed to load conversation data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleSend = async () => {
    if (!input.trim() || !conversationData) return
    
    // Add user message
    const userMessage: ConversationMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Find appropriate response
    let responseMessage: ConversationMessage | null = null
    const userInput = input.toLowerCase()

    // Determine which conversation to load based on user input
    let targetConversation = "about" // default
    if (userInput.includes("project") || userInput.includes("built") || userInput.includes("work")) {
      targetConversation = "projects"
    } else if (userInput.includes("blog") || userInput.includes("write") || userInput.includes("article")) {
      targetConversation = "blog"
    } else if (userInput.includes("poetry") || userInput.includes("poem") || userInput.includes("creative")) {
      targetConversation = "poetry"
    } else if (userInput.includes("contact") || userInput.includes("reach") || userInput.includes("email")) {
      targetConversation = "contact"
    }

    // Load the appropriate conversation if it's different from current
    try {
      const conversationModule = await import(`@/data/conversations/${targetConversation}.json`)
      const conversationData = conversationModule.default as ConversationData
      
      // Get the main assistant message from the conversation
      const mainConversation = conversationData.conversations[0]
      if (mainConversation && mainConversation.messages.length > 1) {
        responseMessage = mainConversation.messages[1] // The assistant response
      }
    } catch (error) {
      console.error(`Failed to load ${targetConversation} conversation:`, error)
    }

    // Fallback response
    if (!responseMessage) {
      const quickResponse = Object.entries(conversationData.quick_responses).find(
        ([key]) => userInput.includes(key)
      )
      
      const content = quickResponse 
        ? quickResponse[1]
        : conversationData.fallback_responses[
            Math.floor(Math.random() * conversationData.fallback_responses.length)
          ]

      responseMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content,
        metadata: { typing_delay: 1000 }
      }
    }

    // Simulate typing delay
    const typingDelay = responseMessage.metadata?.typing_delay || 1500
    await new Promise(resolve => setTimeout(resolve, typingDelay))
    
    setIsTyping(false)
    setMessages(prev => [...prev, responseMessage!])
  }

  const handleFollowUp = (followUpText: string) => {
    setInput(followUpText)
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading conversation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-background p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div>
            <h1 className="text-xl font-semibold">Roberto Allende</h1>
            <p className="text-sm text-muted-foreground">
              Interactive Conversations - Rich Content Demo
            </p>
          </div>
          <ThemeSwitcher />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageRenderer 
            key={message.id} 
            message={message}
            onFollowUpClick={handleFollowUp}
          />
        ))}
        
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
            placeholder="Ask me anything..."
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

export default function ConversationsSimplePage() {
  return (
    <ThemeProvider>
      <ConversationChat />
    </ThemeProvider>
  )
}
