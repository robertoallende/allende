"use client";

import { ComposerPrimitive } from "@assistant-ui/react";
import { ArrowUp } from "lucide-react";
import { useChatInputContext } from "@/contexts/chat-input-context";
import { useEffect, useRef } from "react";
import { RandomDisclaimer } from "@/components/ui/random-disclaimer";

export function ClaudeCenteredComposer() {
  const { isInputEnabled, inputPlaceholder } = useChatInputContext();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus when the component mounts and input is enabled
  useEffect(() => {
    if (isInputEnabled && inputRef.current) {
      // Small delay to ensure the component is fully rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isInputEnabled]);

  return (
    <div className="flex items-center justify-center h-full p-4">
      <div className="w-full max-w-3xl -mt-16">
        <ComposerPrimitive.Root className="relative">
          <ComposerPrimitive.Input 
            ref={inputRef}
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
        
        {/* Random disclaimer instead of static hint text */}
        {isInputEnabled && (
          <div className="mt-4 text-center">
            <RandomDisclaimer />
          </div>
        )}
      </div>
    </div>
  );
}
