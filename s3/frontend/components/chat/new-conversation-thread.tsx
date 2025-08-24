"use client";

import { useEffect } from "react";
import { ThreadPrimitive, ComposerPrimitive, useAssistantRuntime } from "@assistant-ui/react";
import { ArrowUp } from "lucide-react";
import { EnhancedUserMessage, EnhancedAssistantMessage } from "./enhanced-message";

export function NewConversationThread() {
  const runtime = useAssistantRuntime();

  // Create a new thread when this component mounts
  useEffect(() => {
    runtime.switchToNewThread();
  }, [runtime]);

  return (
    <div className="flex flex-col h-full">
      {/* No NewConversationHeader - direct to content for clean interface */}
      <ThreadPrimitive.Root className="flex flex-col h-full">
        <ThreadPrimitive.Viewport className="flex-1 overflow-y-auto p-4">
          {/* Empty state - only show when no messages */}
          <ThreadPrimitive.Empty>
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
          </ThreadPrimitive.Empty>
          
          <ThreadPrimitive.Messages
            components={{
              UserMessage: EnhancedUserMessage,
              AssistantMessage: EnhancedAssistantMessage,
            }}
          />
        </ThreadPrimitive.Viewport>
        
        <div className="p-4 bg-background/95 backdrop-blur">
          <ComposerPrimitive.Root className="flex gap-2">
            <ComposerPrimitive.Input 
              className="flex-1 px-4 py-3 rounded-lg bg-input text-foreground border border-border focus:border-ring focus:outline-none resize-none"
              placeholder="Write Truth Is Like Poetry..."
              rows={1}
            />
            <ComposerPrimitive.Send className="px-3 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center justify-center">
              <ArrowUp className="w-4 h-4" />
            </ComposerPrimitive.Send>
          </ComposerPrimitive.Root>
        </div>
      </ThreadPrimitive.Root>
    </div>
  );
}
