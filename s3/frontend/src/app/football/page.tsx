import { Metadata } from 'next';
import { ChatInterface } from '@/components/chat/chat-interface';
import { loadAllContent } from '@/content/loader';

export const metadata: Metadata = {
  title: 'Football Insights - Tactical Analysis & Coaching | Roberto Allende',
  description: 'Football tactical analysis, coaching insights, and reflections from Roberto Allende. Covering modern football tactics, player development, and coaching philosophy.',
  keywords: ['Football Tactics', 'Coaching', 'Tactical Analysis', 'Football Coaching', 'Player Development', 'Football Philosophy', 'Soccer Tactics'],
  openGraph: {
    title: 'Football Insights by Roberto Allende',
    description: 'Tactical analysis, coaching insights, and football philosophy from an experienced coach and player',
    url: 'https://allende.nz/football',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Roberto Allende Football Insights'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Football Insights by Roberto Allende',
    description: 'Tactical analysis and coaching philosophy',
    images: ['/twitter-image.jpg']
  }
};

// Generate SEO content from existing content files
async function generateSEOContent() {
  const content = await loadAllContent();
  const footballContent = content.football;
  
  return {
    title: "Football Notes by Roberto Allende",
    content: footballContent.initialMessage,
    responses: footballContent.responses
  };
}

export default async function FootballPage() {
  const seoContent = await generateSEOContent();
  
  return (
    <>
      {/* SEO-friendly static content generated from existing markdown */}
      <div className="sr-only">
        <h1>{seoContent.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: seoContent.content }} />
        
        {/* Additional SEO context */}
        <h2>Football Topics Covered</h2>
        <ul>
          <li>Modern Football Tactical Analysis</li>
          <li>Coaching Philosophy and Player Development</li>
          <li>Formation Analysis and Tactical Systems</li>
          <li>Pressing Strategies and Defensive Organization</li>
          <li>Youth Football Development and Training</li>
          <li>Football Technology and Analytics</li>
          <li>Coaching Tools and Methodologies</li>
        </ul>
        
        <h2>Coaching Experience</h2>
        <ul>
          <li>Amateur football player and team captain</li>
          <li>Junior football coach and mentor</li>
          <li>Tactical analysis and game preparation</li>
          <li>Player development and team building</li>
          <li>Football app development (Astuten)</li>
        </ul>
      </div>
      
      {/* Same chat interface as homepage, pre-loaded with football topic */}
      <ChatInterface initialTopic="football" />
    </>
  );
}
