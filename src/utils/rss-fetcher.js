// RSS feed fetcher for build-time integration
// Hard fails if feeds are unavailable

export async function fetchRSSFeed(url, maxItems = 5) {
  try {
    console.log(`Fetching RSS feed: ${url}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status} ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type') || '';
    const text = await response.text();
    
    let items;
    if (url.endsWith('.json') || contentType.includes('application/json')) {
      // Parse JSON feed
      items = parseJSONFeed(text, maxItems);
    } else {
      // Parse RSS XML
      items = parseRSSItems(text, maxItems);
    }
    
    console.log(`Successfully fetched ${items.length} items from ${url}`);
    return items;
    
  } catch (error) {
    console.error(`RSS Feed Error: ${error.message}`);
    throw new Error(`RSS feed unavailable: ${url} - ${error.message}`);
  }
}

function parseRSSItems(xmlText, maxItems) {
  const items = [];
  
  // Simple regex-based RSS parsing (sufficient for build-time use)
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  const titleRegex = /<title[^>]*><!\[CDATA\[(.*?)\]\]><\/title>|<title[^>]*>(.*?)<\/title>/i;
  const descRegex = /<description[^>]*><!\[CDATA\[(.*?)\]\]><\/description>|<description[^>]*>(.*?)<\/description>/i;
  const linkRegex = /<link[^>]*>(.*?)<\/link>/i;
  const dateRegex = /<pubDate[^>]*>(.*?)<\/pubDate>/i;
  
  let match;
  let count = 0;
  
  while ((match = itemRegex.exec(xmlText)) !== null && count < maxItems) {
    const itemXml = match[1];
    
    const titleMatch = titleRegex.exec(itemXml);
    const descMatch = descRegex.exec(itemXml);
    const linkMatch = linkRegex.exec(itemXml);
    const dateMatch = dateRegex.exec(itemXml);
    
    const title = (titleMatch?.[1] || titleMatch?.[2] || '').trim();
    const description = (descMatch?.[1] || descMatch?.[2] || '').trim();
    const link = (linkMatch?.[1] || '').trim();
    const pubDate = (dateMatch?.[1] || '').trim();
    
    if (title && link) {
      items.push({
        title: cleanHtml(title),
        description: cleanHtml(description),
        link: link,
        pubDate: pubDate,
        date: parseDate(pubDate)
      });
      count++;
    }
  }
  
  return items;
}

function cleanHtml(text) {
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&hellip;/g, '...')
    .trim();
}

function parseDate(dateString) {
  if (!dateString) return null;
  
  try {
    return new Date(dateString);
  } catch {
    return null;
  }
}

function parseJSONFeed(jsonText, maxItems) {
  try {
    const feed = JSON.parse(jsonText);
    const items = [];
    
    const feedItems = feed.items || [];
    
    for (let i = 0; i < Math.min(feedItems.length, maxItems); i++) {
      const item = feedItems[i];
      
      items.push({
        title: cleanHtml(item.title || 'Untitled'),
        link: item.url || item.link || '#',
        description: cleanHtml(item.summary || item.content_text || item.content_html || ''),
        pubDate: parseDate(item.date_published || item.date_modified)
      });
    }
    
    return items;
  } catch (error) {
    throw new Error(`Failed to parse JSON feed: ${error.message}`);
  }
}

// RSS feed URLs
export const RSS_FEEDS = {
  software: 'https://aws.amazon.com/about-aws/whats-new/recent/feed/', // AWS What's New feed
};
