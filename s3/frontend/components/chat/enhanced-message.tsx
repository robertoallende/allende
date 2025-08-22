"use client";

import { MessagePrimitive } from "@assistant-ui/react";

export function EnhancedUserMessage() {
  return (
    <MessagePrimitive.Root className="mb-4 flex justify-end">
      <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-md">
        <MessagePrimitive.Content />
      </div>
    </MessagePrimitive.Root>
  );
}

export function EnhancedAssistantMessage() {
  return (
    <MessagePrimitive.Root className="mb-4 flex justify-start">
      <div className="bg-background border border-border p-4 rounded-lg max-w-2xl">
        <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
          <MessagePrimitive.Content />
        </div>
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
    <div className="mt-3 pt-3 border-t border-border">
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
