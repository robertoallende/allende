"use client";

import { useLocalRuntime, AssistantRuntimeProvider } from "@assistant-ui/react";
import type { ChatModelAdapter } from "@assistant-ui/react";
import { ReactNode, createContext, useContext, useState } from "react";
import { loadAllContent } from "@/content/loader";
import { contentConfig } from "@/content/config";
import { getAppConfig } from "@/app/config";

// Topic context for managing active topic
const TopicContext = createContext<{
  activeTopic: string;
  setActiveTopic: (topic: string) => void;
}>({
  activeTopic: getAppConfig().defaultTopic,
  setActiveTopic: () => {},
});

export const useTopicContext = () => useContext(TopicContext);

// Load content at build time
const contentData = loadAllContent();

// Transform loaded content into conversation format
const topicConversations = Object.entries(contentData).reduce((acc, [topicId, content]) => {
  const config = contentConfig[topicId];
  acc[topicId] = {
    title: config.title,
    initialMessage: content.initialMessage,
    responses: content.responses,
    followUps: content.followUps,
  };
  return acc;
}, {} as Record<string, {
  title: string;
  initialMessage: string;
  responses: string[];
  followUps: string[];
}>);

const responseIndex: Record<string, number> = {};

interface MultiThreadRuntimeProviderProps {
  children: ReactNode;
}

export function MultiThreadRuntimeProvider({ children }: MultiThreadRuntimeProviderProps) {
  const config = getAppConfig();
  const [activeTopic, setActiveTopic] = useState(config.defaultTopic);

  // Enhanced chat model adapter with topic routing
  const multiTopicChatAdapter: ChatModelAdapter = {
    async run() {
      // Use the active topic from context
      const topic = activeTopic;
      
      // Initialize response index for this topic if not exists
      if (!responseIndex[topic]) {
        responseIndex[topic] = 0;
      }
      
      // Get conversation data for the topic
      const conversation = topicConversations[topic as keyof typeof topicConversations];
      const response = conversation.responses[responseIndex[topic] % conversation.responses.length];
      
      // Increment response index for next interaction
      responseIndex[topic]++;
      
      return {
        content: [
          {
            type: "text" as const,
            text: response,
          },
        ],
        metadata: {
          custom: {
            topic,
            followUps: conversation.followUps,
          },
        },
      };
    },
  };

  const runtime = useLocalRuntime(multiTopicChatAdapter);

  return (
    <TopicContext.Provider value={{ activeTopic, setActiveTopic }}>
      <AssistantRuntimeProvider runtime={runtime}>
        {children}
      </AssistantRuntimeProvider>
    </TopicContext.Provider>
  );
}
