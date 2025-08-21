"use client"

import { useState } from "react"

export default function ProfessionalTheme() {
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
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <h1 className="text-3xl font-light text-gray-900">Roberto Allende</h1>
        <p className="text-gray-500 font-light">Software Engineer & Cloud Architect</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="text-center py-16">
            <h2 className="text-2xl font-light mb-6 text-gray-800">How can I assist you today?</h2>
            <p className="text-gray-600 mb-12 font-light">Select a topic or ask me anything</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <button
                onClick={() => setInput("Tell me about yourself")}
                className="p-6 border border-gray-200 rounded-none hover:bg-gray-50 transition-colors text-left bg-white shadow-sm"
              >
                <h3 className="font-medium mb-2 text-gray-900">Professional Background</h3>
                <p className="text-sm text-gray-600 font-light">Experience and expertise</p>
              </button>
              
              <button
                onClick={() => setInput("Show me your projects")}
                className="p-6 border border-gray-200 rounded-none hover:bg-gray-50 transition-colors text-left bg-white shadow-sm"
              >
                <h3 className="font-medium mb-2 text-gray-900">Portfolio</h3>
                <p className="text-sm text-gray-600 font-light">Recent work and projects</p>
              </button>
              
              <button
                onClick={() => setInput("How can I contact you?")}
                className="p-6 border border-gray-200 rounded-none hover:bg-gray-50 transition-colors text-left bg-white shadow-sm"
              >
                <h3 className="font-medium mb-2 text-gray-900">Contact Information</h3>
                <p className="text-sm text-gray-600 font-light">Get in touch</p>
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
              className={`max-w-2xl px-6 py-4 ${
                message.role === "user"
                  ? "bg-gray-900 text-white rounded-none"
                  : "bg-white border border-gray-200 font-mono text-gray-900 rounded-none shadow-sm"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-gray-200 bg-white">
        <div className="flex gap-4 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:border-gray-900 bg-white font-light"
          />
          <button
            onClick={handleSend}
            className="px-8 py-3 bg-gray-900 text-white rounded-none hover:bg-gray-800 font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
