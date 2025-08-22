// Types for thread-based conversation system
export interface TopicThread {
  id: string;
  title: string;
  description: string;
  icon: string;
  responses: string[];
  followUps: string[];
  keywords: string[];
}

export interface ThreadConversation {
  topic: string;
  responses: string[];
  followUps: string[];
  currentIndex: number;
}

export interface ConversationMetadata {
  topic: string;
  followUps: string[];
  threadId?: string;
  responseIndex?: number;
}

export type TopicId = "about" | "blog" | "projects" | "poetry" | "contact";

export interface TopicThreadConfig {
  [key: string]: {
    responses: string[];
    followUps: string[];
    keywords: string[];
  };
}

// Assistant-UI compatible message metadata
export interface ThreadMessageMetadata {
  custom?: {
    topic: string;
    followUps: string[];
    threadId?: string;
  };
}
