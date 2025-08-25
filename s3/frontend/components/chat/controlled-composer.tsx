"use client";

import { ComposerPrimitive } from "@assistant-ui/react";
import { ArrowUp } from "lucide-react";
import { useChatInputContext } from "@/contexts/chat-input-context";
import { useEffect, useRef } from "react";

export function ControlledComposer() {
  const { isInputEnabled, inputPlaceholder } = useChatInputContext();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus when the composer becomes enabled
  useEffect(() => {
    if (isInputEnabled && inputRef.current) {
      // Small delay to ensure the component is fully rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isInputEnabled]);

  return (
    <div 
      className="p-4 bg-background/95 backdrop-blur"
      style={{ 
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' 
      }}
    >
      <ComposerPrimitive.Root className="flex gap-2">
        <ComposerPrimitive.Input 
          ref={inputRef}
          className={`flex-1 px-4 py-3 rounded-lg border transition-all duration-200 resize-none ${
            isInputEnabled 
              ? "bg-input text-foreground border-border focus:border-ring focus:outline-none cursor-text" 
              : "bg-muted text-muted-foreground border-muted cursor-not-allowed opacity-60"
          }`}
          placeholder={inputPlaceholder}
          rows={1}
          disabled={!isInputEnabled}
          aria-disabled={!isInputEnabled}
        />
        <ComposerPrimitive.Send 
          className={`px-3 py-3 rounded-lg font-medium flex items-center justify-center transition-all duration-200 ${
            isInputEnabled
              ? "bg-primary text-primary-foreground hover:opacity-90 cursor-pointer"
              : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
          }`}
          disabled={!isInputEnabled}
          aria-disabled={!isInputEnabled}
        >
          <ArrowUp className="w-4 h-4" />
        </ComposerPrimitive.Send>
      </ComposerPrimitive.Root>
    </div>
  );
}
