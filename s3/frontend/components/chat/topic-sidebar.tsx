"use client";

import { UserIcon, BookOpenIcon, CodeIcon, PenToolIcon, MailIcon, PlusIcon } from "lucide-react";

interface TopicThread {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  lastMessage: string;
}

const topicThreads: TopicThread[] = [
  {
    id: "about",
    title: "About Roberto",
    description: "Personal background & experience",
    icon: UserIcon,
    lastMessage: "Hello! I'm Roberto, a passionate software engineer...",
  },
  {
    id: "blog",
    title: "Blog Posts",
    description: "Technical insights & thoughts",
    icon: BookOpenIcon,
    lastMessage: "I write about software development, technology trends...",
  },
  {
    id: "projects",
    title: "Projects",
    description: "Portfolio & showcases",
    icon: CodeIcon,
    lastMessage: "Here are some of the projects I've built...",
  },
  {
    id: "poetry",
    title: "Poetry",
    description: "Creative writing",
    icon: PenToolIcon,
    lastMessage: "I enjoy expressing creativity through words...",
  },
  {
    id: "contact",
    title: "Contact",
    description: "Get in touch",
    icon: MailIcon,
    lastMessage: "I'm always interested in connecting with fellow developers...",
  },
];

interface TopicSidebarProps {
  activeTopicId?: string;
  onTopicSelect: (topicId: string) => void;
}

export function TopicSidebar({ activeTopicId, onTopicSelect }: TopicSidebarProps) {
  return (
    <div className="flex flex-col h-screen bg-muted/30 border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border flex-shrink-0">
        <h2 className="font-semibold text-lg">Conversations</h2>
        <p className="text-sm text-muted-foreground">Chat about different topics</p>
      </div>

      {/* New Conversation Button */}
      <div className="p-2 flex-shrink-0">
        <button className="flex items-center gap-2 w-full p-3 rounded-lg hover:bg-muted transition-colors text-left border border-dashed border-border hover:border-primary/50">
          <PlusIcon className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">New Conversation</span>
        </button>
      </div>

      {/* Topic Threads */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {topicThreads.map((thread) => {
          const Icon = thread.icon;
          const isActive = activeTopicId === thread.id;
          
          return (
            <button
              key={thread.id}
              onClick={() => onTopicSelect(thread.id)}
              className={`flex items-start gap-3 w-full p-3 rounded-lg transition-colors text-left border ${
                isActive
                  ? "bg-primary/10 border-primary/20 text-foreground"
                  : "border-transparent hover:bg-muted"
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                <Icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm line-clamp-1 mb-1">
                  {thread.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {thread.lastMessage}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
