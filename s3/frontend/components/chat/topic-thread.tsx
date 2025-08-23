"use client";

import { useEffect } from "react";
import { ThreadPrimitive, ComposerPrimitive, useAssistantRuntime } from "@assistant-ui/react";
import { ArrowUp } from "lucide-react";
import { useTopicContext } from "./multi-thread-runtime";
import { EnhancedUserMessage, EnhancedAssistantMessage } from "./enhanced-message";
import { SimpleMarkdown } from "./simple-markdown";

// Component to show the initial message for each topic
function TopicInitialMessage({ activeTopic }: { activeTopic: string }) {
  const topicMessages = {
    blog: "# My Blog\n\nI write about software development, technology trends, and lessons learned from building applications.\n\n## Recent Posts\n\n### 🚀 \"Building Scalable React Applications\"\nExploring patterns and practices for large-scale React apps with TypeScript and modern tooling.\n\n### ☁️ \"Serverless Architecture Patterns\"\nDeep dive into AWS Lambda, API Gateway, and building cost-effective serverless solutions.\n\n### 🎨 \"The Art of Clean Code\"\nPrinciples and practices for writing maintainable, readable code that stands the test of time.\n\nWhat would you like to read about?",
    projects: "# My Projects\n\nHere are some of the projects I've built and contributed to:\n\n## 🌐 Personal Website\n**Tech Stack**: Next.js, TypeScript, Tailwind CSS, Assistant-UI\n- Chat-based interface for engaging user experience\n- Multiple themes with CSS variables\n- Responsive design and accessibility\n\n## ☁️ Serverless API Platform\n**Tech Stack**: AWS Lambda, API Gateway, DynamoDB, TypeScript\n- High-performance REST APIs\n- Auto-scaling serverless architecture\n- Comprehensive monitoring and logging\n\nWhich project interests you most?",
    about: "# About Roberto\n\nHello! I'm Roberto, a passionate software engineer with a love for building innovative solutions. I specialize in **TypeScript**, **React**, and **AWS** technologies.\n\n## My Background\n- 🎓 Computer Science background\n- 💼 Full-stack development experience\n- 🚀 Passionate about modern web technologies\n- 🌟 Always learning and exploring new tech\n\n## Let's Connect!\nI'm always interested in connecting with fellow developers and collaborators.\n\n**📧 Professional Contact:**\n- Email: roberto@allende.ai\n- LinkedIn: [Roberto Allende](https://linkedin.com/in/robertoallende)\n- GitHub: [@robertoallende](https://github.com/robertoallende)\n\n**🌐 Social Presence:**\n- Twitter/X: [@robertoallende](https://twitter.com/robertoallende)\n- I share technical insights, project updates, and industry thoughts\n\nHow would you like to connect?",
  };
  
  const message = topicMessages[activeTopic as keyof typeof topicMessages];
  
  return (
    <div className="mb-4 flex justify-start">
      <div className="bg-background p-4 max-w-2xl">
        <SimpleMarkdown 
          key={activeTopic} // Reset animation when topic changes
          smooth={true}
          className="prose prose-sm max-w-none dark:prose-invert"
        >
          {message}
        </SimpleMarkdown>
      </div>
    </div>
  );
}

export function TopicThread() {
  const { activeTopic } = useTopicContext();
  const runtime = useAssistantRuntime();

  // Clear the thread when topic changes
  useEffect(() => {
    // Only create new thread if we have an active topic
    if (activeTopic) {
      runtime.switchToNewThread();
    }
  }, [activeTopic, runtime]);

  // Don't render if no active topic
  if (!activeTopic) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      {/* No ThreadHeader - direct to content for clean interface */}
      <ThreadPrimitive.Root className="flex flex-col h-full">
        <ThreadPrimitive.Viewport className="flex-1 overflow-y-auto p-4">
          {/* Show topic-specific initial message */}
          <TopicInitialMessage activeTopic={activeTopic} />
          
          <ThreadPrimitive.Messages
            components={{
              UserMessage: EnhancedUserMessage,
              AssistantMessage: EnhancedAssistantMessage,
            }}
          />
        </ThreadPrimitive.Viewport>
        
        <div className="p-4 bg-background/95 backdrop-blur">
          <ComposerPrimitive.Root className="flex gap-2">
            <ComposerPrimitive.Input 
              className="flex-1 px-4 py-3 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring resize-none"
              placeholder={`Ask me about ${activeTopic === "about" ? "my background" : activeTopic}...`}
              rows={1}
            />
            <ComposerPrimitive.Send className="px-3 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center justify-center">
              <ArrowUp className="w-4 h-4" />
            </ComposerPrimitive.Send>
          </ComposerPrimitive.Root>
        </div>
      </ThreadPrimitive.Root>
    </div>
  );
}
