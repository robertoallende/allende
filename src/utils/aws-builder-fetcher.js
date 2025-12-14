// AWS Builder content fetcher for Roberto Allende's articles
// Based on original allende.ai implementation

export async function fetchAwsBuilderContent(maxItems = 5) {
  try {
    console.log('Fetching AWS Builder content...');
    
    const response = await fetch('https://api.builder.aws.com/cs/content/user', {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'content-type': 'application/json',
        'builder-session-token': 'dummy',
        'origin': 'https://builder.aws.com',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      },
      body: JSON.stringify({
        "contentType": "ARTICLE",
        "pageSize": maxItems,
        "sort": {"article": {"sortOrder": "NEWEST"}},
        "userId": "e0a0031c-8900-4789-addf-e95154dc95a8"
      })
    });

    if (!response.ok) {
      throw new Error(`AWS Builder API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.feedContents) {
      throw new Error('Invalid AWS Builder response format');
    }

    // Filter LIVE articles and convert to RSS-like format
    const articles = data.feedContents
      .filter(item => item.status === 'LIVE' && item.contentType === 'ARTICLE')
      .slice(0, maxItems)
      .map(item => ({
        title: stripHtml(item.title) || 'Untitled',
        link: `https://community.aws${item.contentId}`,
        description: item.contentTypeSpecificResponse?.article?.description || 'No description available.',
        pubDate: new Date(item.lastPublishedAt)
      }));

    console.log(`Successfully fetched ${articles.length} AWS Builder articles`);
    return articles;

  } catch (error) {
    console.error(`AWS Builder fetch error: ${error.message}`);
    throw new Error(`AWS Builder content unavailable: ${error.message}`);
  }
}

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&hellip;/g, '...')
    .trim();
}
