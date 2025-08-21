export interface ConversationMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp?: number
  metadata?: {
    typing_delay?: number
    follow_ups?: string[]
    links?: Array<{
      text: string
      url: string
      type?: "github" | "demo" | "article" | "external"
    }>
    code_blocks?: Array<{
      language: string
      code: string
      filename?: string
    }>
  }
}

export interface ConversationFlow {
  id: string
  title: string
  description: string
  category: "about" | "blog" | "projects" | "poetry" | "contact"
  messages: ConversationMessage[]
  suggested_follow_ups: string[]
  related_topics: string[]
}

export interface ConversationData {
  conversations: ConversationFlow[]
  quick_responses: Record<string, string>
  fallback_responses: string[]
}
