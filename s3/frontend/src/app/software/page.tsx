import { Metadata } from 'next';
import { ChatInterface } from '@/components/chat/chat-interface';
import { loadAllContent } from '@/content/loader';

export const metadata: Metadata = {
  title: 'Software Engineering Notes - AWS Architecture & AI Development | Roberto Allende',
  description: 'Software engineering articles on AWS cloud architecture, AI-first development, and technical leadership by Roberto Allende, AWS Builder. Insights on serverless patterns, AI development, and technical leadership.',
  keywords: ['Software Engineering', 'AWS Articles', 'Cloud Architecture', 'AI Development', 'Serverless Patterns', 'Technical Leadership', 'AWS Builder', 'MMDD', 'Micromanaged Driven Development'],
  openGraph: {
    title: 'Software Engineering Notes by Roberto Allende - AWS Builder',
    description: 'Insights on AWS architecture, AI development, and technical leadership from an experienced solutions architect',
    url: 'https://allende.nz/software',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Roberto Allende Software Engineering Notes'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Software Engineering Notes by Roberto Allende',
    description: 'AWS architecture, AI development, and technical leadership insights',
    images: ['/twitter-image.jpg']
  }
};

// Generate SEO content from existing content files
async function generateSEOContent() {
  const content = await loadAllContent();
  const softwareContent = content.software;
  
  return {
    title: "Software Engineering Notes by Roberto Allende",
    content: softwareContent.initialMessage,
    responses: softwareContent.responses
  };
}

export default async function ArticlesPage() {
  const seoContent = await generateSEOContent();
  
  return (
    <>
      {/* SEO-friendly static content generated from existing markdown */}
      <div className="sr-only">
        <h1>{seoContent.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: seoContent.content }} />
        
        {/* Additional SEO context */}
        <h2>Technical Topics Covered</h2>
        <ul>
          <li>AWS Cloud Architecture and Serverless Patterns</li>
          <li>AI-First Development Methodologies</li>
          <li>Micromanaged Driven Development (MMDD)</li>
          <li>Technical Leadership and Team Management</li>
          <li>Amazon Q and Generative AI Applications</li>
          <li>Digital Transformation Strategies</li>
          <li>Software Engineering Best Practices</li>
        </ul>
      </div>
      
      {/* Same chat interface as homepage, pre-loaded with software topic */}
      <ChatInterface initialTopic="software" />
    </>
  );
}
