"use client";

import { useLocalRuntime, AssistantRuntimeProvider } from "@assistant-ui/react";
import type { ChatModelAdapter } from "@assistant-ui/react";
import { ReactNode, createContext, useContext, useState } from "react";

// Topic context for managing active topic
const TopicContext = createContext<{
  activeTopic: string;
  setActiveTopic: (topic: string) => void;
}>({
  activeTopic: "about",
  setActiveTopic: () => {},
});

export const useTopicContext = () => useContext(TopicContext);

// Topic-specific conversation data
const topicConversations = {
  about: {
    title: "About Roberto",
    initialMessage: "# About Roberto\n\nHello! I'm Roberto, a passionate software engineer with a love for building innovative solutions. I specialize in **TypeScript**, **React**, and **AWS** technologies.\n\n## My Background\n- 🎓 Computer Science background\n- 💼 Full-stack development experience\n- 🚀 Passionate about modern web technologies\n- 🌟 Always learning and exploring new tech\n\nWhat would you like to know about my experience?",
    responses: [
      "## My Experience\n\nI've worked on various projects ranging from:\n\n- **Frontend Development**: React, Next.js, TypeScript\n- **Backend Systems**: Node.js, AWS Lambda, APIs\n- **Cloud Infrastructure**: AWS, serverless architectures\n- **DevOps**: CI/CD, containerization, monitoring\n\nI believe in writing clean, maintainable code and building user-centric applications.",
      "## Technologies I Love\n\n```typescript\nconst myStack = {\n  frontend: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],\n  backend: ['Node.js', 'Python', 'AWS Lambda'],\n  cloud: ['AWS', 'Serverless Framework'],\n  tools: ['Git', 'Docker', 'VS Code']\n};\n```\n\nI'm always excited to learn new technologies and apply them to solve real-world problems!",
    ],
    followUps: [
      "What projects have you worked on?",
      "Tell me about your technical skills",
      "What's your development philosophy?",
      "How can I contact you?",
    ],
  },
  blog: {
    title: "Blog Posts",
    initialMessage: "# My Blog\n\nI write about software development, technology trends, and lessons learned from building applications.\n\n## Recent Posts\n\n### 🚀 \"Building Scalable React Applications\"\nExploring patterns and practices for large-scale React apps with TypeScript and modern tooling.\n\n### ☁️ \"Serverless Architecture Patterns\"\nDeep dive into AWS Lambda, API Gateway, and building cost-effective serverless solutions.\n\n### 🎨 \"The Art of Clean Code\"\nPrinciples and practices for writing maintainable, readable code that stands the test of time.\n\nWhat would you like to read about?",
    responses: [
      "## Technical Deep Dives\n\nI enjoy writing detailed technical articles about:\n\n- **React Patterns**: Hooks, context, state management\n- **TypeScript Tips**: Advanced types, generics, utility types\n- **AWS Solutions**: Lambda, DynamoDB, CloudFormation\n- **Performance**: Optimization techniques and monitoring\n\nEach post includes practical examples and real-world applications.",
      "## Writing Philosophy\n\nI believe in:\n- 📝 **Clear explanations** with practical examples\n- 🔍 **Deep technical content** that goes beyond surface level\n- 🛠️ **Actionable insights** you can apply immediately\n- 🌟 **Sharing lessons learned** from real projects\n\nWant to read more? Check out my latest posts!",
    ],
    followUps: [
      "Show me your latest blog post",
      "What do you write about?",
      "Do you have any React tutorials?",
      "Tell me about your AWS articles",
    ],
  },
  projects: {
    title: "Projects",
    initialMessage: "# My Projects\n\nHere are some of the projects I've built and contributed to:\n\n## 🌐 Personal Website\n**Tech Stack**: Next.js, TypeScript, Tailwind CSS, Assistant-UI\n- Chat-based interface for engaging user experience\n- Multiple themes with CSS variables\n- Responsive design and accessibility\n\n## ☁️ Serverless API Platform\n**Tech Stack**: AWS Lambda, API Gateway, DynamoDB, TypeScript\n- High-performance REST APIs\n- Auto-scaling serverless architecture\n- Comprehensive monitoring and logging\n\nWhich project interests you most?",
    responses: [
      "## 🚀 React Component Library\n**Tech Stack**: React, TypeScript, Storybook, Rollup\n- Reusable UI components with TypeScript support\n- Comprehensive documentation and examples\n- Automated testing and CI/CD pipeline\n\n## 📊 Data Visualization Dashboard\n**Tech Stack**: React, D3.js, Node.js, PostgreSQL\n- Interactive charts and real-time data updates\n- Custom visualization components\n- Performance optimized for large datasets",
      "## 🛠️ Development Tools\n\nI also build tools to improve developer experience:\n\n- **CLI Tools**: Node.js utilities for project scaffolding\n- **VS Code Extensions**: Custom productivity extensions\n- **GitHub Actions**: Automated workflows and deployment\n\nEach project focuses on solving real problems with clean, maintainable code.",
    ],
    followUps: [
      "Tell me more about your website",
      "Show me your GitHub",
      "What's your favorite project?",
      "Do you have any open source contributions?",
    ],
  },
  poetry: {
    title: "Poetry",
    initialMessage: "# Poetry & Creative Writing\n\nI enjoy expressing creativity through words, often blending technical themes with artistic expression.\n\n## Code Poetry\n\n*\"In functions pure and variables clean,*  \n*Logic flows like a mountain stream.*  \n*Each bracket placed with careful thought,*  \n*Beauty in the code I've wrought.\"*\n\n## Technical Haikus\n\n*Async functions wait*  \n*Promises resolve in time*  \n*Callbacks are past*\n\nWhat kind of creative writing interests you?",
    responses: [
      "## Reflections on Technology\n\n### \"The Developer's Journey\"\n\n*We start with simple loops and if-then statements,*  \n*Building castles in the digital sand.*  \n*Each bug a lesson, each feature a triumph,*  \n*Crafting experiences with keyboard and mind.*\n\n*In the quiet hours before dawn,*  \n*When the world sleeps and servers hum,*  \n*We write the future, line by line,*  \n*Creating magic from logic and time.*",
      "## Creative Coding\n\nI find poetry in:\n- 🎨 **Clean Architecture**: The elegance of well-structured code\n- 🌊 **Data Flow**: How information moves through systems\n- 🔄 **Algorithms**: The dance of logic and efficiency\n- 🌟 **User Experience**: Crafting delightful interactions\n\n*\"Code is poetry in motion,*  \n*Each function a verse,*  \n*Each module a stanza,*  \n*In the epic of software.\"*",
    ],
    followUps: [
      "Share more technical poetry",
      "Do you write about coding?",
      "What inspires your writing?",
      "Tell me about creative coding",
    ],
  },
  contact: {
    title: "Contact",
    initialMessage: "# Let's Connect!\n\nI'm always interested in connecting with fellow developers, potential collaborators, and anyone passionate about technology.\n\n## 📧 Professional Contact\n- **Email**: roberto@allende.ai\n- **LinkedIn**: [Roberto Allende](https://linkedin.com/in/robertoallende)\n- **GitHub**: [@robertoallende](https://github.com/robertoallende)\n\n## 💼 Collaboration Opportunities\nI'm open to:\n- Technical consulting projects\n- Open source contributions\n- Speaking at conferences or meetups\n- Mentoring and knowledge sharing\n\nHow can I help you?",
    responses: [
      "## 🤝 What I'm Looking For\n\n### Project Collaborations\n- **React/TypeScript** applications\n- **AWS serverless** solutions\n- **Developer tools** and productivity apps\n- **Open source** contributions\n\n### Speaking Opportunities\n- Technical conferences\n- Developer meetups\n- Workshops and training sessions\n- Podcast appearances\n\nFeel free to reach out if you have an interesting project or opportunity!",
      "## 📅 Availability\n\n**Current Status**: Available for new projects\n\n**Response Time**: I typically respond to emails within 24-48 hours\n\n**Time Zone**: Based in [Your Location]\n\n**Preferred Communication**: \n- Email for formal inquiries\n- LinkedIn for professional networking\n- GitHub for technical discussions\n\nLooking forward to hearing from you! 🚀",
    ],
    followUps: [
      "What's your email address?",
      "Are you available for projects?",
      "Do you do consulting work?",
      "How can I see your work?",
    ],
  },
};

const responseIndex: Record<string, number> = {};

interface MultiThreadRuntimeProviderProps {
  children: ReactNode;
}

export function MultiThreadRuntimeProvider({ children }: MultiThreadRuntimeProviderProps) {
  const [activeTopic, setActiveTopic] = useState("about");

  // Enhanced chat model adapter with topic routing
  const multiTopicChatAdapter: ChatModelAdapter = {
    async run() {
      // Use the active topic from context
      const topic = activeTopic;
      
      // Initialize response index for this topic if not exists
      if (!responseIndex[topic]) {
        responseIndex[topic] = 0;
      }
      
      // Get conversation data for the topic
      const conversation = topicConversations[topic as keyof typeof topicConversations];
      const response = conversation.responses[responseIndex[topic] % conversation.responses.length];
      
      // Increment response index for next interaction
      responseIndex[topic]++;
      
      return {
        content: [
          {
            type: "text" as const,
            text: response,
          },
        ],
        metadata: {
          custom: {
            topic,
            followUps: conversation.followUps,
          },
        },
      };
    },
  };

  const runtime = useLocalRuntime(multiTopicChatAdapter);

  return (
    <TopicContext.Provider value={{ activeTopic, setActiveTopic }}>
      <AssistantRuntimeProvider runtime={runtime}>
        {children}
      </AssistantRuntimeProvider>
    </TopicContext.Provider>
  );
}
