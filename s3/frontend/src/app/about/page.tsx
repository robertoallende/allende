import { Metadata } from 'next';
import { ChatInterface } from '@/components/chat/chat-interface';
import { loadAllContent } from '@/content/loader';

export const metadata: Metadata = {
  title: 'About Roberto Allende - Software Engineer & Technical Leader',
  description: 'Learn about Roberto Allende\'s background in AWS cloud architecture, AI development, technical leadership, and football coaching. AWS Builder with 5+ years building scalable systems.',
  keywords: ['Roberto Allende', 'Software Engineer', 'Cloud Architecture', 'AI Development', 'Technical Leadership', 'Football Coaching', 'AWS Builder'],
  openGraph: {
    title: 'About Roberto Allende - Software Engineer & Technical Leader',
    description: 'AWS Builder specializing in cloud architecture, AI development, and technical leadership. Also passionate about football coaching.',
    url: 'https://allende.nz/about',
    type: 'profile',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Roberto Allende - Software Engineer'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Roberto Allende - Software Engineer',
    description: 'AWS Builder specializing in cloud architecture, AI development, and technical leadership',
    images: ['/twitter-image.jpg']
  }
};

// Generate SEO content from existing markdown files
async function generateSEOContent() {
  const content = await loadAllContent();
  const aboutContent = content.about;
  
  return {
    title: "About Roberto Allende - Software Engineer & Technical Leader",
    content: aboutContent.initialMessage,
    responses: aboutContent.responses
  };
}

export default async function AboutPage() {
  const seoContent = await generateSEOContent();
  
  return (
    <>
      {/* SEO-friendly static content generated from existing markdown */}
      <div className="sr-only">
        <h1>{seoContent.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: seoContent.content }} />
        
        {/* Additional SEO context */}
        <h2>Professional Background</h2>
        <p>AWS Solutions Architect, AI Development, Technical Leadership, Football Coaching</p>
        
        <h2>Technical Expertise</h2>
        <p>AWS Cloud Services, TypeScript, Python, Next.js, React, AI/ML, DevOps</p>
      </div>
      
      {/* Same chat interface as homepage, pre-loaded with about topic */}
      <ChatInterface initialTopic="about" />
    </>
  );
}
