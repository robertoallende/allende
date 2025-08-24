"use client";

import { UserIcon, BookOpenIcon, CodeIcon, PlusIcon, ZapIcon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { getAppConfig } from "@/app/config";
import { contentConfig } from "@/content/config";

// Icon mapping
const iconMap = {
  BookOpenIcon,
  CodeIcon,
  UserIcon,
  ZapIcon,
};

interface TopicThread {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  lastMessage: string;
}

// Generate topics from configuration
const topicThreads: TopicThread[] = Object.entries(contentConfig).map(([id, config]) => ({
  id,
  title: config.title,
  description: config.description,
  icon: iconMap[config.icon as keyof typeof iconMap] || UserIcon,
  lastMessage: config.description, // Use description from config instead of first line from markdown
}));

interface TopicSidebarProps {
  activeTopicId?: string;
  onTopicSelect: (topicId: string) => void;
  onNewConversation: () => void;
  isNewConversationActive?: boolean;
}

export function TopicSidebar({ activeTopicId, onTopicSelect, onNewConversation, isNewConversationActive = false }: TopicSidebarProps) {
  const { theme, setTheme, themes } = useTheme();
  const config = getAppConfig();

  return (
    <div className="flex flex-col h-screen bg-muted/30">
      {/* Header */}
      <div className="p-4 flex-shrink-0">
        <h2 className="font-semibold text-lg">Roberto Allende</h2>
        <p className="text-sm text-muted-foreground">Enthusiastic and tireless maker</p>
      </div>

      {/* New Conversation Button */}
      <div className="p-2 flex-shrink-0">
        <button 
          onClick={onNewConversation}
          className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors text-left ${
            isNewConversationActive
              ? "bg-primary/10 text-foreground"
              : "hover:bg-muted"
          }`}
        >
          <PlusIcon className={`w-4 h-4 ${isNewConversationActive ? "text-primary" : "text-muted-foreground"}`} />
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
              className={`flex items-start gap-3 w-full p-3 rounded-lg transition-colors text-left ${
                isActive
                  ? "bg-primary/10 text-foreground"
                  : "hover:bg-muted"
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

      {/* Theme Selector - Bottom Right */}
      {config.ui.showThemeSelector && (
        <div className="p-2 flex justify-end flex-shrink-0">
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as "default" | "dark" | "claude")}
            className="px-2 py-1 text-xs rounded bg-background text-foreground hover:bg-muted transition-colors"
          >
            {themes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
