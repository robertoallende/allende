"use client";

import { useEffect } from "react";
import { ThreadPrimitive, useAssistantRuntime } from "@assistant-ui/react";
import { useTopicContext } from "./multi-thread-runtime";
import { EnhancedUserMessage, EnhancedAssistantMessage } from "./enhanced-message";
import { SimpleMarkdown } from "./simple-markdown";
import { loadAllContent } from "@/content/loader";

// Load content at module level
const contentData = loadAllContent();

// Component to show the initial message for each topic
function TopicInitialMessage({ activeTopic }: { activeTopic: string }) {
  // Get message from loaded content, with fallback
  const message = contentData[activeTopic]?.initialMessage || `# ${activeTopic}\n\nContent not found for this topic.`;
  
  return (
    <div className="mb-4 flex justify-center">
      <div className="bg-background p-4 max-w-4xl w-full">
        <SimpleMarkdown 
          key={activeTopic} // Reset animation when topic changes
          smooth={true}
          className="prose prose-sm max-w-none dark:prose-invert"
        >
          {message}
        </SimpleMarkdown>
      </div>
    </div>
  );
}

export function TopicThread() {
  const { activeTopic } = useTopicContext();
  const runtime = useAssistantRuntime();

  // Clear the thread when topic changes
  useEffect(() => {
    // Only create new thread if we have an active topic
    if (activeTopic) {
      runtime.switchToNewThread();
    }
  }, [activeTopic, runtime]);

  // Don't render if no active topic
  if (!activeTopic) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      {/* No ThreadHeader - direct to content for clean interface */}
      <ThreadPrimitive.Root className="flex flex-col h-full">
        <ThreadPrimitive.Viewport className="flex-1 overflow-y-auto p-4">
          {/* Show topic-specific initial message */}
          <TopicInitialMessage activeTopic={activeTopic} />
          
          <ThreadPrimitive.Messages
            components={{
              UserMessage: EnhancedUserMessage,
              AssistantMessage: EnhancedAssistantMessage,
            }}
          />
        </ThreadPrimitive.Viewport>
        
        {/* NO COMPOSER - Topic sections are read-only */}
      </ThreadPrimitive.Root>
    </div>
  );
}
