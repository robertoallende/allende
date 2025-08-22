// Types for static conversation data structure
export interface ConversationMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  metadata?: {
    follow_ups?: string[];
    links?: Array<{
      text: string;
      url: string;
      type: "external" | "internal";
    }>;
  };
}

export interface StaticConversation {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  messages: ConversationMessage[];
  category: string;
  order: number;
  enabled: boolean;
}

export interface ConversationIndex {
  conversations: Array<{
    id: string;
    title: string;
    subtitle: string;
    description: string;
    category: string;
    order: number;
    icon: string;
    enabled: boolean;
  }>;
  generated_at: string;
  total_conversations: number;
}
