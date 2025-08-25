"use client";

import { useLocalRuntime, AssistantRuntimeProvider } from "@assistant-ui/react";
import type { ChatModelAdapter } from "@assistant-ui/react";
import { ReactNode, createContext, useContext, useState } from "react";
import { loadAllContent } from "@/content/loader";
import { contentConfig } from "@/content/config";
import { getAppConfig } from "@/app/config";
import { getContentMatcher } from "@/services/content-matcher";
import { ChatInputProvider } from "@/contexts/chat-input-context";

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

  // Enhanced chat model adapter with topic routing and content matching
  const multiTopicChatAdapter: ChatModelAdapter = {
    async *run({ messages }) {
      // Get the last user message
      const lastMessage = messages[messages.length - 1];
      const userMessage = lastMessage?.content?.[0]?.type === 'text' ? lastMessage.content[0].text : '';
      
      // Check for content matches first
      if (userMessage) {
        try {
          const contentMatcher = await getContentMatcher();
          const matchResult = await contentMatcher.loadMatchedContent(userMessage);
          
          if (matchResult) {
            // Handle email conversations
            if ('isEmail' in matchResult) {
              const emailResult = matchResult;
              
              // Stream email response
              const words = emailResult.response.split(' ');
              let currentContent = '';
              
              for (let i = 0; i < words.length; i++) {
                currentContent += (i > 0 ? ' ' : '') + words[i];
                
                yield {
                  content: [
                    {
                      type: "text" as const,
                      text: currentContent,
                    },
                  ],
                  metadata: {
                    custom: {
                      topic: activeTopic,
                      isEmailConversation: true,
                      emailAction: emailResult.action,
                    },
                  },
                };
                
                await new Promise(resolve => setTimeout(resolve, 50));
              }
              
              // If this was a successful email send, we could trigger actual email sending here
              if (emailResult.action === 'SEND_EMAIL') {
                const emailState = (await import('@/services/email-conversation-handler')).getEmailConversationState();
                console.log('Email would be sent here:', {
                  message: emailState.userMessage,
                  replyTo: emailState.userEmail,
                  originalTrigger: emailResult.originalMessage
                });
                // TODO: Implement actual email sending in future unit
              }
              
              return;
            }
            
            // Handle regular content matches
            const fullContent = matchResult.content;
            
            // Simulate streaming by yielding chunks
            const words = fullContent.split(' ');
            let currentContent = '';
            
            for (let i = 0; i < words.length; i++) {
              currentContent += (i > 0 ? ' ' : '') + words[i];
              
              yield {
                content: [
                  {
                    type: "text" as const,
                    text: currentContent,
                  },
                ],
                metadata: {
                  custom: {
                    topic: activeTopic,
                    isContentMatch: true,
                    matchedRule: matchResult.rule,
                  },
                },
              };
              
              // Small delay to simulate streaming
              await new Promise(resolve => setTimeout(resolve, 30));
            }
            
            return;
          }
        } catch (error) {
          console.error('Error in content matching:', error);
          // Continue with normal flow if content matching fails
        }
      }
      
      // Use the active topic from context for normal responses
      const topic = activeTopic;
      
      // Initialize response index for this topic if not exists
      if (!responseIndex[topic]) {
        responseIndex[topic] = 0;
      }
      
      // Get conversation data for the topic
      const conversation = topicConversations[topic as keyof typeof topicConversations];
      
      // Safety check for conversation existence
      if (!conversation || !conversation.responses) {
        const errorMessage = `I don't have specific responses configured for the "${topic}" topic yet. Feel free to ask me anything!`;
        
        // Stream the error message too
        const words = errorMessage.split(' ');
        let currentContent = '';
        
        for (let i = 0; i < words.length; i++) {
          currentContent += (i > 0 ? ' ' : '') + words[i];
          
          yield {
            content: [
              {
                type: "text" as const,
                text: currentContent,
              },
            ],
            metadata: {
              custom: {
                topic,
                followUps: [],
              },
            },
          };
          
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        return;
      }
      
      const response = conversation.responses[responseIndex[topic] % conversation.responses.length];
      
      // Increment response index for next interaction
      responseIndex[topic]++;
      
      // Stream the normal response
      const words = response.split(' ');
      let currentContent = '';
      
      for (let i = 0; i < words.length; i++) {
        currentContent += (i > 0 ? ' ' : '') + words[i];
        
        yield {
          content: [
            {
              type: "text" as const,
              text: currentContent,
            },
          ],
          metadata: {
            custom: {
              topic,
              followUps: conversation.followUps,
            },
          },
        };
        
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    },
  };

  const runtime = useLocalRuntime(multiTopicChatAdapter);

  return (
    <ChatInputProvider>
      <TopicContext.Provider value={{ activeTopic, setActiveTopic }}>
        <AssistantRuntimeProvider runtime={runtime}>
          {children}
        </AssistantRuntimeProvider>
      </TopicContext.Provider>
    </ChatInputProvider>
  );
}
