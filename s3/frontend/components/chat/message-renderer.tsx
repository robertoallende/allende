"use client"

import { SimpleMarkdown } from "./simple-markdown"
import type { ConversationMessage } from "@/data/conversations/schema"

interface MessageRendererProps {
  message: ConversationMessage
  className?: string
  onFollowUpClick?: (followUp: string) => void
}

export function MessageRenderer({ message, className, onFollowUpClick }: MessageRendererProps) {
  const isUser = message.role === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xl px-4 py-2 rounded-lg ${
          isUser
            ? "bg-muted text-foreground"
            : "bg-background border font-mono text-foreground"
        } ${className || ""}`}
      >
        {/* Main message content */}
        <SimpleMarkdown content={message.content} />

        {/* Links if present */}
        {message.metadata?.links && message.metadata.links.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.metadata.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md transition-colors ${
                  link.type === "github"
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : link.type === "demo"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {link.type === "github" && (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                )}
                {link.type === "demo" && (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                )}
                {link.text}
              </a>
            ))}
          </div>
        )}

        {/* Follow-up suggestions for assistant messages */}
        {!isUser && message.metadata?.follow_ups && message.metadata.follow_ups.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="text-xs text-muted-foreground font-medium">
              You might also ask:
            </div>
            <div className="flex flex-wrap gap-2">
              {message.metadata.follow_ups.map((followUp, index) => (
                <button
                  key={index}
                  className="text-xs px-2 py-1 bg-muted hover:bg-muted/80 rounded-md transition-colors text-left"
                  onClick={() => {
                    if (onFollowUpClick) {
                      onFollowUpClick(followUp)
                    }
                  }}
                >
                  {followUp}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
