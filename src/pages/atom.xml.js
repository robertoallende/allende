import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { metaData } from "./../config";

export async function GET(context) {
  // No blog posts - return empty RSS feed
  const posts = [];
  return rss({
    title: metaData.title,
    description: metaData.description,
    site: context.site,
    items: posts.map((post) => ({
      ...post.data,
      link: `/posts/${post.slug}/`,
    })),
  });
}
