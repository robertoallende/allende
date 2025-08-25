"use client";

import { MessagePrimitive } from "@assistant-ui/react";
import { MarkdownTextPrimitive } from "@assistant-ui/react-markdown";

export function EnhancedUserMessage() {
  return (
    <MessagePrimitive.Root className="mb-1 flex justify-center">
      <div className="max-w-4xl w-full p-4">
        <div className="bg-black text-white p-3 rounded-lg inline-block">
          <MessagePrimitive.Content />
        </div>
      </div>
    </MessagePrimitive.Root>
  );
}

export function EnhancedAssistantMessage() {
  return (
    <MessagePrimitive.Root className="mb-1 flex justify-center">
      <div className="bg-background p-4 max-w-4xl w-full">
        <MessagePrimitive.Content 
          components={{
            Text: () => (
              <MarkdownTextPrimitive 
                smooth={true}
                className="prose prose-sm max-w-none dark:prose-invert [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:my-4 [&_blockquote]:bg-muted/20 [&_blockquote]:py-2 [&_blockquote]:rounded-r-md"
              />
            ),
          }}
        />
        <FollowUpSuggestions />
      </div>
    </MessagePrimitive.Root>
  );
}

function FollowUpSuggestions() {
  // Disabled for cleaner content matching experience
  return null;
}
