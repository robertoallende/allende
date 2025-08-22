"use client";

import { useState } from "react";
import { TopicSidebar } from "./topic-sidebar";
import { MultiThreadRuntimeProvider, useTopicContext } from "./multi-thread-runtime";
import { TopicThread } from "./topic-thread";
import { NewConversationThread } from "./new-conversation-thread";

function ChatInterfaceContent() {
  const { activeTopic, setActiveTopic } = useTopicContext();
  const [conversationMode, setConversationMode] = useState<'topic' | 'new'>('topic');

  const handleTopicSelect = (topicId: string) => {
    setActiveTopic(topicId);
    setConversationMode('topic');
  };

  const handleNewConversation = () => {
    setConversationMode('new');
    setActiveTopic(''); // Clear active topic
  };

  return (
    <div className="h-screen bg-background text-foreground flex">
      {/* Left sidebar - Topic Threads - Fixed width */}
      <div className="w-80 flex-shrink-0">
        <TopicSidebar 
          activeTopicId={conversationMode === 'topic' ? activeTopic : undefined}
          onTopicSelect={handleTopicSelect}
          onNewConversation={handleNewConversation}
        />
      </div>
      
      {/* Right area - Current Thread - Takes remaining space */}
      <div className="flex-1">
        {conversationMode === 'new' ? (
          <NewConversationThread />
        ) : (
          <TopicThread />
        )}
      </div>
    </div>
  );
}

export function ChatInterface() {
  return (
    <MultiThreadRuntimeProvider>
      <ChatInterfaceContent />
    </MultiThreadRuntimeProvider>
  );
}
