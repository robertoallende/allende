import rss from '@astrojs/rss';
import { fetchRSSFeed, RSS_FEEDS } from '../utils/rss-fetcher.js';
import { fetchAwsBuilderContent } from '../utils/aws-builder-fetcher.js';
import { metaData } from '../config';

export async function GET(context) {
  try {
    // Fetch both content sources
    const [footballFeed, softwareFeed] = await Promise.all([
      fetchRSSFeed(RSS_FEEDS.football),
      fetchAwsBuilderContent()
    ]);

    // Combine and sort by date (newest first)
    const allItems = [
      ...footballFeed.map(item => ({
        title: item.title,
        link: item.link,
        description: item.description,
        pubDate: item.pubDate,
        category: 'Football'
      })),
      ...softwareFeed.map(item => ({
        title: item.title,
        link: item.link,
        description: item.description,
        pubDate: item.pubDate,
        category: 'Software'
      }))
    ].sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    return rss({
      title: metaData.title,
      description: metaData.description,
      site: context.site,
      items: allItems.map((item) => ({
        title: `[${item.category}] ${item.title}`,
        link: item.link,
        description: item.description,
        pubDate: item.pubDate,
      })),
    });
  } catch (error) {
    console.error('RSS generation error:', error);
    // Return empty RSS feed on error
    return rss({
      title: metaData.title,
      description: metaData.description,
      site: context.site,
      items: [],
    });
  }
}
