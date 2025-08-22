"use client";

import { useLocalRuntime, AssistantRuntimeProvider } from "@assistant-ui/react";
import type { ChatModelAdapter } from "@assistant-ui/react";
import { ReactNode } from "react";

// Simple static conversation data
const staticResponses = [
  "Hello! I'm Roberto. What would you like to know about me?",
  "I'm a software engineer passionate about building great products. I work with TypeScript, React, and AWS.",
  "I love working on challenging technical problems and creating solutions that make a difference.",
  "Feel free to ask me about my projects, experience, or anything else you'd like to know!",
];

let responseIndex = 0;

// Enhanced chat model adapter with simple conversation flow
const conversationChatAdapter: ChatModelAdapter = {
  async run() {
    // Cycle through static responses
    const response = staticResponses[responseIndex % staticResponses.length];
    responseIndex++;

    return {
      content: [
        {
          type: "text" as const,
          text: response,
        },
      ],
    };
  },
};

interface StaticRuntimeProviderProps {
  children: ReactNode;
}

export function StaticRuntimeProvider({ children }: StaticRuntimeProviderProps) {
  const runtime = useLocalRuntime(conversationChatAdapter);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
