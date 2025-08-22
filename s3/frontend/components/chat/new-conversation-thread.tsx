"use client";

import { useEffect } from "react";
import { ThreadPrimitive, ComposerPrimitive, useAssistantRuntime } from "@assistant-ui/react";
import { useTheme } from "@/components/theme-provider";
import { EnhancedUserMessage, EnhancedAssistantMessage } from "./enhanced-message";

function NewConversationHeader() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="border-b border-border p-4 flex justify-between items-center bg-background/95 backdrop-blur">
      <div>
        <h1 className="text-xl font-bold">New Conversation</h1>
        <p className="text-sm text-muted-foreground">Start a fresh conversation about anything</p>
      </div>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as "default" | "dark" | "claude")}
        className="px-3 py-1 border border-border rounded bg-background text-foreground text-sm"
      >
        {themes.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export function NewConversationThread() {
  const runtime = useAssistantRuntime();

  // Create a new thread when this component mounts
  useEffect(() => {
    runtime.switchToNewThread();
  }, [runtime]);

  return (
    <div className="flex flex-col h-full">
      <NewConversationHeader />
      
      <ThreadPrimitive.Root className="flex flex-col h-full">
        <ThreadPrimitive.Viewport className="flex-1 overflow-y-auto p-4">
          {/* Empty state - no initial message */}
          <div className="flex items-center justify-center h-full text-center">
            <div className="max-w-md">
              <h2 className="text-lg font-medium text-muted-foreground mb-2">
                Ready for a new conversation?
              </h2>
              <p className="text-sm text-muted-foreground">
                Ask me anything about my work, projects, or thoughts on technology.
              </p>
            </div>
          </div>
          
          <ThreadPrimitive.Messages
            components={{
              UserMessage: EnhancedUserMessage,
              AssistantMessage: EnhancedAssistantMessage,
            }}
          />
        </ThreadPrimitive.Viewport>
        
        <div className="border-t border-border p-4 bg-background/95 backdrop-blur">
          <ComposerPrimitive.Root className="flex gap-2">
            <ComposerPrimitive.Input 
              className="flex-1 px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              placeholder="Write Truth Is Like Poetry..."
              rows={1}
            />
            <ComposerPrimitive.Send className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium">
              Send
            </ComposerPrimitive.Send>
          </ComposerPrimitive.Root>
        </div>
      </ThreadPrimitive.Root>
    </div>
  );
}
