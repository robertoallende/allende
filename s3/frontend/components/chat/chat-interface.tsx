"use client";

import { TopicSidebar } from "./topic-sidebar";
import { MultiThreadRuntimeProvider, useTopicContext } from "./multi-thread-runtime";
import { TopicThread } from "./topic-thread";

function ChatInterfaceContent() {
  const { activeTopic, setActiveTopic } = useTopicContext();

  const handleTopicSelect = (topicId: string) => {
    setActiveTopic(topicId);
  };

  return (
    <div className="h-screen bg-background text-foreground flex">
      {/* Left sidebar - Topic Threads - Fixed width */}
      <div className="w-80 flex-shrink-0">
        <TopicSidebar 
          activeTopicId={activeTopic}
          onTopicSelect={handleTopicSelect}
        />
      </div>
      
      {/* Right area - Current Thread - Takes remaining space */}
      <div className="flex-1">
        <TopicThread />
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
