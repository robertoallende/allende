"use client";

import { ComposerPrimitive } from "@assistant-ui/react";
import { ArrowUp } from "lucide-react";
import { useChatInputContext } from "@/contexts/chat-input-context";

export function ClaudeCenteredComposer() {
  const { isInputEnabled, inputPlaceholder } = useChatInputContext();

  return (
    <div className="flex items-center justify-center h-full p-4">
      <div className="w-full max-w-3xl -mt-16">
        <ComposerPrimitive.Root className="relative">
          <ComposerPrimitive.Input 
            className={`w-full px-6 py-4 rounded-2xl border transition-all duration-200 resize-none text-base leading-relaxed min-h-[120px] ${
              isInputEnabled 
                ? "bg-background text-foreground border-border focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 cursor-text shadow-sm hover:shadow-md" 
                : "bg-muted text-muted-foreground border-muted cursor-not-allowed opacity-60"
            }`}
            placeholder={inputPlaceholder}
            rows={4}
            disabled={!isInputEnabled}
            aria-disabled={!isInputEnabled}
            style={{
              // Ensure proper text wrapping and spacing
              lineHeight: '1.6',
              fontFamily: 'inherit'
            }}
          />
          <ComposerPrimitive.Send 
            className={`absolute bottom-3 right-3 p-2 rounded-xl transition-all duration-200 ${
              isInputEnabled
                ? "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-sm hover:shadow-md"
                : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
            }`}
            disabled={!isInputEnabled}
            aria-disabled={!isInputEnabled}
          >
            <ArrowUp className="w-5 h-5" />
          </ComposerPrimitive.Send>
        </ComposerPrimitive.Root>
        
        {/* Optional: Add Claude-style suggestions or hints */}
        {isInputEnabled && (
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Ask me anything about my background, projects, or interests
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
