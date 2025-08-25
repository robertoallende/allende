"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { TopicSidebar } from "./topic-sidebar";
import { MultiThreadRuntimeProvider, useTopicContext } from "./multi-thread-runtime";
import { TopicThread } from "./topic-thread";
import { NewConversationThread } from "./new-conversation-thread";
import { useChatInputContext } from "@/contexts/chat-input-context";

function ChatInterfaceContent() {
  const { activeTopic, setActiveTopic } = useTopicContext();
  const { enableInput } = useChatInputContext();
  const [conversationMode, setConversationMode] = useState<'topic' | 'new'>('topic');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Initialize chat input as enabled for new conversations
  useEffect(() => {
    if (conversationMode === 'new') {
      enableInput();
    }
  }, [conversationMode, enableInput]);

  const handleTopicSelect = (topicId: string) => {
    setActiveTopic(topicId);
    setConversationMode('topic');
    // Close sidebar on mobile after selection
    setIsSidebarOpen(false);
    // No need to disable input - composer won't render in topic sections
  };

  const handleNewConversation = () => {
    setConversationMode('new');
    setActiveTopic(''); // Clear active topic
    // Close sidebar on mobile after selection
    setIsSidebarOpen(false);
    // Enable chat input for new conversations
    enableInput();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen bg-background text-foreground flex relative">
      {/* Mobile Header with Hamburger Menu */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
          <h1 className="text-lg font-semibold">Roberto Allende</h1>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Left sidebar - Topic Threads */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:flex-shrink-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <TopicSidebar 
          activeTopicId={conversationMode === 'topic' ? activeTopic : undefined}
          onTopicSelect={handleTopicSelect}
          onNewConversation={handleNewConversation}
          isNewConversationActive={conversationMode === 'new'}
        />
      </div>
      
      {/* Right area - Current Thread - Takes remaining space */}
      <div className="flex-1 lg:ml-0 pt-16 lg:pt-0">
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
