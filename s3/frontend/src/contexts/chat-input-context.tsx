"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ChatInputState {
  enabled: boolean;
  placeholder: string;
  reason: 'new-conversation' | 'topic-selected' | 'disabled';
}

interface ChatInputContextType {
  isInputEnabled: boolean;
  inputPlaceholder: string;
  inputReason: string;
  enableInput: () => void;
  disableInput: (reason?: string) => void;
}

const ChatInputContext = createContext<ChatInputContextType | undefined>(undefined);

interface ChatInputProviderProps {
  children: ReactNode;
}

export function ChatInputProvider({ children }: ChatInputProviderProps) {
  const [chatInputState, setChatInputState] = useState<ChatInputState>({
    enabled: false,
    placeholder: "Switch to 'New Conversation' to start chatting",
    reason: 'topic-selected'
  });

  const enableInput = useCallback(() => {
    setChatInputState({
      enabled: true,
      placeholder: "Ask me anything about my background, projects, or interests — or try 'Send an Email to Roberto' ",
      reason: 'new-conversation'
    });
  }, []);

  const disableInput = useCallback((customReason?: string) => {
    setChatInputState({
      enabled: false,
      placeholder: customReason || "Switch to 'New Conversation' to start chatting",
      reason: 'topic-selected'
    });
  }, []);

  const contextValue: ChatInputContextType = {
    isInputEnabled: chatInputState.enabled,
    inputPlaceholder: chatInputState.placeholder,
    inputReason: chatInputState.reason,
    enableInput,
    disableInput
  };

  return (
    <ChatInputContext.Provider value={contextValue}>
      {children}
    </ChatInputContext.Provider>
  );
}

export function useChatInputContext(): ChatInputContextType {
  const context = useContext(ChatInputContext);
  if (context === undefined) {
    throw new Error('useChatInputContext must be used within a ChatInputProvider');
  }
  return context;
}

export type { ChatInputContextType, ChatInputState };
