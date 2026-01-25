import rss from '@astrojs/rss';
import { fetchAwsBuilderContent } from '../utils/aws-builder-fetcher.js';
import { metaData } from '../config';

export async function GET(context) {
  try {
    // Fetch software content only
    const softwareFeed = await fetchAwsBuilderContent();

    return rss({
      title: metaData.title,
      description: metaData.description,
      site: context.site,
      items: softwareFeed.map((item) => ({
        title: `[Software] ${item.title}`,
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
