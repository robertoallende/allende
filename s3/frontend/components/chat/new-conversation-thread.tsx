"use client";

import { useEffect } from "react";
import { ThreadPrimitive, useAssistantRuntime } from "@assistant-ui/react";
import { EnhancedUserMessage, EnhancedAssistantMessage } from "./enhanced-message";
import { ClaudeCenteredComposer } from "./claude-centered-composer";
import { ControlledComposer } from "./controlled-composer";

export function NewConversationThread() {
  const runtime = useAssistantRuntime();

  // Create a new thread when this component mounts
  useEffect(() => {
    runtime.switchToNewThread();
  }, [runtime]);

  return (
    <div className="flex flex-col h-full min-h-0">
      <ThreadPrimitive.Root className="flex flex-col h-full min-h-0">
        <ThreadPrimitive.Viewport className="flex-1 overflow-y-auto min-h-0">
          {/* Empty state with centered input (Claude-style) */}
          <ThreadPrimitive.Empty>
            <ClaudeCenteredComposer />
          </ThreadPrimitive.Empty>
          
          {/* Messages view with proper top padding when conversation exists */}
          <div className="p-4 pt-6">
            <ThreadPrimitive.Messages
              components={{
                UserMessage: EnhancedUserMessage,
                AssistantMessage: EnhancedAssistantMessage,
              }}
            />
          </div>
        </ThreadPrimitive.Viewport>
        
        {/* Bottom composer - only shows when there are messages */}
        <ThreadPrimitive.If empty={false}>
          <div className="flex-shrink-0">
            <ControlledComposer />
          </div>
        </ThreadPrimitive.If>
      </ThreadPrimitive.Root>
    </div>
  );
}
