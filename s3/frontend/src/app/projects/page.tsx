import { Metadata } from 'next';
import { ChatInterface } from '@/components/chat/chat-interface';
import { loadAllContent } from '@/content/loader';

export const metadata: Metadata = {
  title: 'Technical Projects - Cloud Architecture & AI Development | Roberto Allende',
  description: 'Technical projects showcasing AWS cloud architecture, AI development, and full-stack engineering by Roberto Allende. Including Code Ripple, MMDD methodology, reply.ai, and Astuten football app.',
  keywords: ['Technical Projects', 'AWS Lambda', 'AI Development', 'Code Ripple', 'MMDD', 'reply.ai', 'Astuten', 'Football App', 'Hackathon Winner'],
  openGraph: {
    title: 'Technical Projects by Roberto Allende',
    description: 'Showcase of cloud architecture, AI development, and engineering projects including hackathon winners and open-source methodologies',
    url: 'https://allende.nz/projects',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Roberto Allende Technical Projects'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Technical Projects by Roberto Allende',
    description: 'Cloud architecture, AI development, and engineering projects',
    images: ['/twitter-image.jpg']
  }
};

// Generate SEO content from existing content files
async function generateSEOContent() {
  const content = await loadAllContent();
  const projectsContent = content.projects;
  
  return {
    title: "Technical Projects by Roberto Allende",
    content: projectsContent.initialMessage,
    responses: projectsContent.responses
  };
}

export default async function ProjectsPage() {
  const seoContent = await generateSEOContent();
  
  return (
    <>
      {/* SEO-friendly static content generated from existing markdown */}
      <div className="sr-only">
        <h1>{seoContent.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: seoContent.content }} />
        
        {/* Additional SEO context */}
        <h2>Project Categories</h2>
        <ul>
          <li>AI-Assisted Development Tools and Methodologies</li>
          <li>AWS Serverless Applications and Architecture</li>
          <li>Generative AI and Productivity Applications</li>
          <li>Sports Technology and Coaching Tools</li>
          <li>Open Source Methodologies and Frameworks</li>
        </ul>
        
        <h2>Technical Achievements</h2>
        <ul>
          <li>Multiple hackathon wins with AI and cloud technologies</li>
          <li>Open-source methodology development (MMDD)</li>
          <li>Production applications serving real users</li>
          <li>Integration of cutting-edge AI services (Amazon Q, GenAI)</li>
          <li>Full-stack development from frontend to serverless backend</li>
        </ul>
      </div>
      
      {/* Same chat interface as homepage, pre-loaded with projects topic */}
      <ChatInterface initialTopic="projects" />
    </>
  );
}
