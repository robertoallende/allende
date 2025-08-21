"use client"

import { useState } from "react"

export default function DarkTheme() {
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
    <div className="h-screen flex flex-col bg-slate-900 text-slate-100">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 bg-slate-800">
        <h1 className="text-2xl font-bold text-slate-100">Roberto Allende</h1>
        <p className="text-slate-400">Dark Theme Chat Interface</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4 text-slate-100">Welcome!</h2>
            <p className="text-slate-400 mb-8">Ask me about my background, projects, or anything else!</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <button
                onClick={() => setInput("Tell me about yourself")}
                className="p-4 border border-slate-600 rounded-lg hover:bg-slate-800 transition-colors text-left bg-slate-800/50"
              >
                <h3 className="font-semibold mb-2 text-slate-100">About</h3>
                <p className="text-sm text-slate-400">Learn about my background</p>
              </button>
              
              <button
                onClick={() => setInput("Show me your projects")}
                className="p-4 border border-slate-600 rounded-lg hover:bg-slate-800 transition-colors text-left bg-slate-800/50"
              >
                <h3 className="font-semibold mb-2 text-slate-100">Projects</h3>
                <p className="text-sm text-slate-400">Explore what I&apos;ve built</p>
              </button>
              
              <button
                onClick={() => setInput("How can I contact you?")}
                className="p-4 border border-slate-600 rounded-lg hover:bg-slate-800 transition-colors text-left bg-slate-800/50"
              >
                <h3 className="font-semibold mb-2 text-slate-100">Contact</h3>
                <p className="text-sm text-slate-400">Get in touch</p>
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
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 border border-slate-600 font-mono text-slate-100"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-700 bg-slate-800">
        <div className="flex gap-2 max-w-2xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 px-3 py-2 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-700 text-slate-100 placeholder-slate-400"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
