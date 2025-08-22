"use client";

import {
  ThreadListPrimitive,
  ThreadListItemPrimitive,
} from "@assistant-ui/react";
import { PlusIcon, UserIcon } from "lucide-react";

export function ThreadList() {
  return (
    <div className="flex flex-col h-full bg-muted/30 border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-lg">Conversations</h2>
        <p className="text-sm text-muted-foreground">Chat about different topics</p>
      </div>

      {/* Thread List */}
      <div className="flex-1 overflow-y-auto p-2">
        <ThreadListPrimitive.Root className="flex flex-col gap-1">
          <NewThreadButton />
          <ThreadListPrimitive.Items 
            components={{ ThreadListItem: TopicThreadItem }}
          />
        </ThreadListPrimitive.Root>
      </div>
    </div>
  );
}

function NewThreadButton() {
  return (
    <ThreadListPrimitive.New asChild>
      <button className="flex items-center gap-2 w-full p-3 rounded-lg hover:bg-muted transition-colors text-left border border-dashed border-border hover:border-primary/50">
        <PlusIcon className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">New Conversation</span>
      </button>
    </ThreadListPrimitive.New>
  );
}

function TopicThreadItem() {
  return (
    <ThreadListItemPrimitive.Root className="group">
      <ThreadListItemPrimitive.Trigger className="flex items-start gap-3 w-full p-3 rounded-lg hover:bg-muted transition-colors text-left data-[active]:bg-primary/10 data-[active]:border-primary/20 border border-transparent">
        <div className="flex-shrink-0 mt-0.5">
          <ThreadIcon />
        </div>
        <div className="flex-1 min-w-0">
          <ThreadListItemPrimitive.Title 
            fallback="New Chat"
          />
          <ThreadDescription />
        </div>
      </ThreadListItemPrimitive.Trigger>
    </ThreadListItemPrimitive.Root>
  );
}

function ThreadIcon() {
  // This would ideally get the topic from thread metadata
  // For now, we'll use a default icon
  return <UserIcon className="w-4 h-4 text-muted-foreground" />;
}

function ThreadDescription() {
  // This would get description from thread metadata
  return (
    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
      Click to start conversation
    </p>
  );
}
