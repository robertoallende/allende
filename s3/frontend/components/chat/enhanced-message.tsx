"use client";

import { MessagePrimitive } from "@assistant-ui/react";
import { MarkdownTextPrimitive } from "@assistant-ui/react-markdown";

export function EnhancedUserMessage() {
  return (
    <MessagePrimitive.Root className="mb-4 flex justify-end">
      <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-lg">
        <MessagePrimitive.Content />
      </div>
    </MessagePrimitive.Root>
  );
}

export function EnhancedAssistantMessage() {
  return (
    <MessagePrimitive.Root className="mb-4 flex justify-center">
      <div className="bg-background p-4 max-w-4xl w-full">
        <MessagePrimitive.Content 
          components={{
            Text: () => (
              <MarkdownTextPrimitive 
                smooth={true}
                className="prose prose-sm max-w-none dark:prose-invert"
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
  // This would get follow-ups from message metadata
  // For now, we'll show some example suggestions
  const suggestions = [
    "Tell me more",
    "What else?",
    "Show me examples",
  ];

  return (
    <div className="mt-3 pt-3">
      <p className="text-xs text-muted-foreground mb-2">Suggestions:</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="text-xs px-2 py-1 bg-muted hover:bg-muted/80 rounded-md transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
