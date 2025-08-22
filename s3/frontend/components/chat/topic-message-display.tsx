"use client";

import { useTopicContext } from "./multi-thread-runtime";

// Topic-specific initial messages
const topicInitialMessages = {
  about: "# About Roberto\n\nHello! I'm Roberto, a passionate software engineer with a love for building innovative solutions. I specialize in **TypeScript**, **React**, and **AWS** technologies.\n\n## My Background\n- 🎓 Computer Science background\n- 💼 Full-stack development experience\n- 🚀 Passionate about modern web technologies\n- 🌟 Always learning and exploring new tech\n\nWhat would you like to know about my experience?",
  blog: "# My Blog\n\nI write about software development, technology trends, and lessons learned from building applications.\n\n## Recent Posts\n\n### 🚀 \"Building Scalable React Applications\"\nExploring patterns and practices for large-scale React apps with TypeScript and modern tooling.\n\n### ☁️ \"Serverless Architecture Patterns\"\nDeep dive into AWS Lambda, API Gateway, and building cost-effective serverless solutions.\n\n### 🎨 \"The Art of Clean Code\"\nPrinciples and practices for writing maintainable, readable code that stands the test of time.\n\nWhat would you like to read about?",
  projects: "# My Projects\n\nHere are some of the projects I've built and contributed to:\n\n## 🌐 Personal Website\n**Tech Stack**: Next.js, TypeScript, Tailwind CSS, Assistant-UI\n- Chat-based interface for engaging user experience\n- Multiple themes with CSS variables\n- Responsive design and accessibility\n\n## ☁️ Serverless API Platform\n**Tech Stack**: AWS Lambda, API Gateway, DynamoDB, TypeScript\n- High-performance REST APIs\n- Auto-scaling serverless architecture\n- Comprehensive monitoring and logging\n\nWhich project interests you most?",
  poetry: "# Poetry & Creative Writing\n\nI enjoy expressing creativity through words, often blending technical themes with artistic expression.\n\n## Code Poetry\n\n*\"In functions pure and variables clean,*  \n*Logic flows like a mountain stream.*  \n*Each bracket placed with careful thought,*  \n*Beauty in the code I've wrought.\"*\n\n## Technical Haikus\n\n*Async functions wait*  \n*Promises resolve in time*  \n*Callbacks are past*\n\nWhat kind of creative writing interests you?",
  contact: "# Let's Connect!\n\nI'm always interested in connecting with fellow developers, potential collaborators, and anyone passionate about technology.\n\n## 📧 Professional Contact\n- **Email**: roberto@allende.ai\n- **LinkedIn**: [Roberto Allende](https://linkedin.com/in/robertoallende)\n- **GitHub**: [@robertoallende](https://github.com/robertoallende)\n\n## 💼 Collaboration Opportunities\nI'm open to:\n- Technical consulting projects\n- Open source contributions\n- Speaking at conferences or meetups\n- Mentoring and knowledge sharing\n\nHow can I help you?",
};

export function TopicMessageDisplay() {
  const { activeTopic } = useTopicContext();
  
  const message = topicInitialMessages[activeTopic as keyof typeof topicInitialMessages];
  
  return (
    <div className="mb-4 flex justify-start">
      <div className="bg-background border border-border p-4 rounded-lg max-w-2xl">
        <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
          {message}
        </div>
      </div>
    </div>
  );
}
