"use client";

import {
  ThreadPrimitive,
  MessagePrimitive,
  ComposerPrimitive,
} from "@assistant-ui/react";
import { useTheme } from "@/components/theme-provider";
import { StaticRuntimeProvider } from "./static-runtime-provider";

function ThreadComponent() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* Theme switcher header */}
      <div className="border-b border-border p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Roberto Allende</h1>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as "default" | "dark" | "claude")}
          className="px-3 py-1 border border-border rounded bg-background text-foreground"
        >
          {themes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <ThreadPrimitive.Root className="flex h-full flex-col">
        <ThreadPrimitive.Viewport className="flex-1 overflow-y-auto p-4">
          <ThreadPrimitive.Messages
            components={{
              UserMessage: () => (
                <MessagePrimitive.Root className="mb-4">
                  <div className="bg-muted text-muted-foreground p-3 rounded-lg max-w-md ml-auto">
                    <MessagePrimitive.Content />
                  </div>
                </MessagePrimitive.Root>
              ),
              AssistantMessage: () => (
                <MessagePrimitive.Root className="mb-4">
                  <div className="bg-background border border-border p-3 rounded-lg max-w-md font-mono">
                    <MessagePrimitive.Content />
                  </div>
                </MessagePrimitive.Root>
              ),
            }}
          />
        </ThreadPrimitive.Viewport>
        
        <div className="border-t border-border p-4">
          <ComposerPrimitive.Root className="flex gap-2">
            <ComposerPrimitive.Input 
              className="flex-1 px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
              placeholder="Ask me anything..."
            />
            <ComposerPrimitive.Send className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
              Send
            </ComposerPrimitive.Send>
          </ComposerPrimitive.Root>
        </div>
      </ThreadPrimitive.Root>
    </div>
  );
}

export function AssistantThread() {
  return (
    <StaticRuntimeProvider>
      <ThreadComponent />
    </StaticRuntimeProvider>
  );
}
