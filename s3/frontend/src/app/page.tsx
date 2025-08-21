"use client"

import { useState, useEffect } from "react"
import { MessageRenderer } from "@/components/chat/message-renderer"
import type { ConversationData, ConversationMessage } from "@/data/conversations/schema"

// Import generated conversation index
import conversationIndex from "@/data/conversations/_index.json"

export default function Home() {
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: ConversationMessage = {
      id: "welcome",
      role: "assistant",
      content: "# Welcome! 👋\n\nI'm **Roberto Allende**. I have rich content about various topics. What would you like to know about?",
      metadata: {
        follow_ups: conversationIndex.conversations.map(conv => 
          `Tell me about ${conv.title.toLowerCase()}`
        )
      }
    }
    setMessages([welcomeMessage])
  }, [])

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
    const currentInput = input // Store before clearing
    setInput("")
    setIsTyping(true)

    // Determine which conversation to load based on user input
    const userInput = currentInput.toLowerCase()
    let targetConversation = "about" // default
    let responseType = "main" // main, summary, or specific
    
    // Enhanced keyword matching with response types
    if (userInput.includes("project") || userInput.includes("built") || userInput.includes("work") || userInput.includes("portfolio")) {
      targetConversation = "projects"
      if (userInput.includes("personal website") || userInput.includes("chat website")) {
        responseType = "website"
      } else if (userInput.includes("ai") || userInput.includes("document")) {
        responseType = "ai"
      } else if (userInput.includes("serverless") || userInput.includes("ecommerce")) {
        responseType = "serverless"
      }
    } else if (userInput.includes("blog") || userInput.includes("write") || userInput.includes("article") || userInput.includes("post")) {
      targetConversation = "blog"
      if (userInput.includes("aws") || userInput.includes("bedrock")) {
        responseType = "aws"
      } else if (userInput.includes("serverless") || userInput.includes("pattern")) {
        responseType = "serverless"
      }
    } else if (userInput.includes("poetry") || userInput.includes("poem") || userInput.includes("creative") || userInput.includes("truth")) {
      targetConversation = "poetry"
      if (userInput.includes("digital dreams")) {
        responseType = "dreams"
      } else if (userInput.includes("developer") || userInput.includes("lament")) {
        responseType = "lament"
      }
    } else if (userInput.includes("contact") || userInput.includes("reach") || userInput.includes("email") || userInput.includes("touch") || userInput.includes("hire")) {
      targetConversation = "contact"
      if (userInput.includes("rate") || userInput.includes("cost") || userInput.includes("price")) {
        responseType = "rates"
      } else if (userInput.includes("available") || userInput.includes("schedule")) {
        responseType = "availability"
      }
    } else if (userInput.includes("experience") || userInput.includes("skill") || userInput.includes("background")) {
      targetConversation = "about"
      responseType = "experience"
    } else if (userInput.includes("tech") || userInput.includes("technology") || userInput.includes("stack")) {
      targetConversation = "about"
      responseType = "tech"
    }

    // Load the appropriate conversation
    try {
      const conversationModule = await import(`@/data/conversations/${targetConversation}.json`)
      const conversationData = conversationModule.default as ConversationData
      
      // Get the main assistant message from the conversation
      const mainConversation = conversationData.conversations[0]
      let responseMessage: ConversationMessage | null = null
      
      if (mainConversation && mainConversation.messages.length > 1) {
        const originalMessage = mainConversation.messages[1] // The assistant response
        
        // Create different responses based on the type and previous context
        let customContent = originalMessage.content
        let customFollowUps = originalMessage.metadata?.follow_ups || []
        
        // Check if we've already shown the main content for this topic
        const hasShownMainContent = messages.some(msg => 
          msg.role === "assistant" && msg.content.includes(originalMessage.content.substring(0, 50))
        )
        
        if (hasShownMainContent) {
          // Provide follow-up responses instead of repeating main content
          customContent = generateFollowUpResponse(targetConversation, responseType)
          customFollowUps = generateFollowUpQuestions(targetConversation)
        }
        
        // Create a new message with a unique ID to avoid React key conflicts
        responseMessage = {
          ...originalMessage,
          id: `${originalMessage.id}-${Date.now()}`, // Make ID unique
          content: customContent,
          metadata: {
            ...originalMessage.metadata,
            follow_ups: customFollowUps
          }
        }
      }

      // Fallback response if no specific conversation found
      if (!responseMessage) {
        responseMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: generateContextualResponse(userInput),
          metadata: {
            follow_ups: [
              "Tell me about yourself",
              "Show me your projects",
              "What do you write about?",
              "Share some poetry",
              "How can I contact you?"
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
      
      // Fallback error response
      const errorResponse: ConversationMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "I'm sorry, I had trouble loading that information. Please try asking about my background, projects, blog, poetry, or contact information.",
        metadata: {
          follow_ups: [
            "Tell me about yourself",
            "Show me your projects", 
            "What do you write about?",
            "How can I contact you?"
          ]
        }
      }
      
      setIsTyping(false)
      setMessages(prev => [...prev, errorResponse])
    }
  }

  // Helper function to generate follow-up responses
  const generateFollowUpResponse = (topic: string, responseType: string): string => {
    const responses: Record<string, Record<string, string>> = {
      about: {
        experience: "## Professional Journey 🚀\n\nI'm a **Senior Software Engineer** with 8+ years of experience, focusing on:\n\n- **Cloud Architecture**: AWS-native solutions and serverless patterns\n- **AI Integration**: Building intelligent applications with modern AI APIs  \n- **Team Leadership**: Led cross-functional teams of 5-8 engineers\n- **Infrastructure**: Designed serverless architectures serving millions of requests\n\nI've been involved in scaling applications from startup to enterprise level.",
        tech: "## Technical Expertise 💻\n\n```typescript\nconst myStack = {\n  languages: ['TypeScript', 'JavaScript', 'Python', 'Go'],\n  frontend: ['React', 'Next.js', 'Tailwind CSS'],\n  backend: ['Node.js', 'FastAPI', 'GraphQL'],\n  cloud: ['AWS', 'Serverless Framework', 'Docker'],\n  ai: ['OpenAI API', 'AWS Bedrock', 'LangChain']\n}\n```\n\nI specialize in serverless architectures and AI/ML integration using AWS services.",
        main: "I'm always happy to share more about my background! I focus on cloud architecture, AI integration, and building developer tools. What specific aspect interests you?"
      },
      projects: {
        website: "## Personal Chat Website 💬\n\n*The project you're experiencing right now!*\n\n**Tech Stack**: Next.js 15, TypeScript, Tailwind CSS, assistant-ui\n\n**Key Features**:\n- 4 dynamic themes with real-time switching\n- Rich markdown content system\n- Mobile-optimized chat interface\n- Build-time content processing\n\nBuilt for the AWS Builder Challenge using MMDD methodology!",
        ai: "## AI Document Processor 🤖\n\n**Overview**: Enterprise document analysis with intelligent extraction\n\n**Results**:\n- 99.2% accuracy in information extraction\n- 90% reduction in manual processing time\n- Handles multiple file formats (PDF, Word, images)\n\n**Tech**: AWS Bedrock, Python, FastAPI, custom RAG pipeline\n\nOne of my most challenging and rewarding projects!",
        serverless: "## Serverless E-commerce Platform 🛒\n\n**Scale**: Handles 10K+ concurrent users with 99.99% uptime\n\n**Architecture**: Built entirely on AWS Lambda, DynamoDB, API Gateway\n\n**Benefits**:\n- 80% cost reduction vs traditional hosting\n- Automatic scaling with zero server management\n- Sub-200ms response times globally\n\nA complete marketplace with real-time inventory and payment processing.",
        main: "I've built several exciting projects! From AI-powered tools to serverless platforms. Which type of project interests you most?"
      },
      blog: {
        aws: "## \"Building with AWS Bedrock\" 📝\n\n**Key Topics**:\n- Model selection strategies (Titan vs Claude vs others)\n- Cost optimization techniques (90% reduction achieved!)\n- Performance patterns for streaming responses\n- Real-world integration examples\n\n**Results**: Helped teams reduce AI costs by 90% and improve response times by 3x.\n\nIncludes complete code examples and production-ready templates!",
        serverless: "## \"Serverless Architecture Patterns\" ⚡\n\n**Focus**: Production-ready patterns that actually work at scale\n\n**Covers**:\n- Cold start optimization techniques\n- Monitoring and observability strategies  \n- Cost management for 50+ Lambda functions\n- Event-driven architectures\n\n**Real Results**: 99.9% uptime across all production systems.\n\nBased on real experience, not just theory!",
        main: "I write practical, experience-based content about cloud architecture, AI integration, and developer experience. What type of technical content interests you?"
      },
      poetry: {
        dreams: "## \"Digital Dreams\" 🌙\n\n*A reflection on our connected world*\n\n> In circuits deep and data streams,\n> We chase our silicon dreams,\n> Where algorithms dance and play,\n> In the light of LED day...\n\nWritten during a late-night coding session, reflecting on how technology connects and sometimes disconnects us. It explores the balance between our digital and human selves.",
        lament: "## \"The Developer's Lament\" 🐛\n\n*On the eternal struggle with bugs*\n\n> Oh bug, you elusive sprite,\n> You haunt my code both day and night...\n\nEvery developer knows this feeling! Born from a particularly stubborn bug that took three days to find - turned out to be a single character error. The poem captures that mix of frustration and eventual triumph we all experience.",
        main: "I create technical poetry that blends programming concepts with creative expression. Each piece comes from real experiences in the tech world. Which style interests you?"
      },
      contact: {
        rates: "## Consulting Rates 💰\n\n**2025 Rates**:\n- Technical Consulting: $200-300/hour\n- Architecture Reviews: $250-350/hour  \n- Speaking Engagements: $2,500-5,000 + travel\n- Workshop Facilitation: $3,000-7,500/day\n\n**Discounts Available**: Non-profit and educational institutions\n\n**Preferred Engagements**: 2-6 month projects with 3-10 person teams",
        availability: "## Current Availability 📅\n\n**Status**: Limited spots for Q4 2025\n\n**Preferences**:\n- 2-6 month engagements\n- Teams of 3-10 engineers\n- Modern tech stacks (React, AWS, AI/ML)\n- Remote-friendly (SF Bay Area based)\n\n**Response Times**: LinkedIn (12-24h), Email (24-48h)\n\nBest for technical challenges and growth-stage companies!",
        main: "I'm open to consulting, speaking engagements, and collaboration opportunities. What type of work are you interested in discussing?"
      }
    }
    
    return responses[topic]?.[responseType] || 
           responses[topic]?.main || 
           `That's a great question about ${topic}! I'd be happy to elaborate on that.`
  }

  // Helper function to generate contextual follow-up questions
  const generateFollowUpQuestions = (topic: string): string[] => {
    const followUps = {
      about: [
        "What technologies do you specialize in?",
        "Tell me about your leadership experience",
        "What's your development philosophy?"
      ],
      projects: [
        "How do you approach project architecture?",
        "What's your biggest technical challenge?",
        "Tell me about your open source work"
      ],
      blog: [
        "What's your writing process like?",
        "Do you have any upcoming articles?",
        "How do you choose topics to write about?"
      ],
      poetry: [
        "Do you have more technical poetry?",
        "What inspires your creative writing?",
        "How do you blend tech and creativity?"
      ],
      contact: [
        "What's your preferred communication method?",
        "Are you available for speaking engagements?",
        "Do you offer mentoring services?"
      ]
    }
    
    return followUps[topic as keyof typeof followUps] || [
      "Tell me more about that",
      "What else would you like to know?",
      "How can I help you further?"
    ]
  }

  // Helper function for contextual responses
  const generateContextualResponse = (userInput: string): string => {
    if (userInput.includes("hello") || userInput.includes("hi")) {
      return "Hello! Great to meet you. I'm Roberto, and I love talking about technology, projects, and creative coding. What brings you here today?"
    }
    if (userInput.includes("help")) {
      return "I'd be happy to help! You can ask me about my professional background, technical projects, blog posts, creative writing, or how to get in touch. What interests you most?"
    }
    if (userInput.includes("thank")) {
      return "You're very welcome! I enjoy sharing my experiences and connecting with fellow developers. Is there anything else you'd like to know?"
    }
    return `Thanks for your question about "${userInput}". I'd be happy to help! Try asking me about my background, projects, blog posts, poetry, or how to contact me.`
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold text-foreground">Roberto Allende</h1>
        <p className="text-muted-foreground">Personal Website</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Show conversation suggestions only if no messages yet */}
        {messages.length === 1 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-6">
              Ask me about my background, projects, or anything else you&apos;d like to know!
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
