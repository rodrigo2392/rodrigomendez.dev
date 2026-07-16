import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../consts';
import { getPublishedPosts, postUrl } from '../lib/blog';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();
  return rss({
    title: `${SITE.title} — Blog`,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: postUrl(post),
      categories: post.data.tags,
    })),
    customData: `<language>${SITE.lang}</language>`,
  });
}
