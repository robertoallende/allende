"use client"

import { useState } from "react"

export default function ColorfulTheme() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return
    
    const userMessage = { role: "user", content: input }
    const botResponse = { role: "assistant", content: `Thanks for your message: "${input}". This is a demo response!` }
    
    setMessages(prev => [...prev, userMessage, botResponse])
    setInput("")
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="p-4 border-b border-purple-200 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <h1 className="text-2xl font-bold">Roberto Allende</h1>
        <p className="text-purple-100">Colorful Chat Interface</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4 text-purple-800">Welcome!</h2>
            <p className="text-purple-600 mb-8">Ask me about my background, projects, or anything else!</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <button
                onClick={() => setInput("Tell me about yourself")}
                className="p-4 border-2 border-purple-300 rounded-xl hover:bg-purple-100 transition-colors text-left bg-white/70 backdrop-blur-sm shadow-lg"
              >
                <h3 className="font-semibold mb-2 text-purple-800">About</h3>
                <p className="text-sm text-purple-600">Learn about my background</p>
              </button>
              
              <button
                onClick={() => setInput("Show me your projects")}
                className="p-4 border-2 border-pink-300 rounded-xl hover:bg-pink-100 transition-colors text-left bg-white/70 backdrop-blur-sm shadow-lg"
              >
                <h3 className="font-semibold mb-2 text-pink-800">Projects</h3>
                <p className="text-sm text-pink-600">Explore what I&apos;ve built</p>
              </button>
              
              <button
                onClick={() => setInput("How can I contact you?")}
                className="p-4 border-2 border-blue-300 rounded-xl hover:bg-blue-100 transition-colors text-left bg-white/70 backdrop-blur-sm shadow-lg"
              >
                <h3 className="font-semibold mb-2 text-blue-800">Contact</h3>
                <p className="text-sm text-blue-600">Get in touch</p>
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
              className={`max-w-xl px-4 py-2 rounded-2xl shadow-lg ${
                message.role === "user"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : "bg-white/80 backdrop-blur-sm border border-purple-200 font-mono text-purple-900"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-purple-200 bg-white/50 backdrop-blur-sm">
        <div className="flex gap-2 max-w-2xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 px-3 py-2 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/80 backdrop-blur-sm"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 shadow-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
