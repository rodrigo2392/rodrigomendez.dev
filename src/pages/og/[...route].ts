import { OGImageRoute } from 'astro-og-canvas';
import { getCollection } from 'astro:content';

const posts = await getCollection('blog', ({ data }) => !data.draft);
const pages = Object.fromEntries(posts.map((p) => [p.id, p.data]));

export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'route',
  pages,
  getImageOptions: (_id, page: (typeof pages)[string]) => ({
    title: page.title,
    description: `#${page.tags[0]}  ·  rodrigomendez.dev`,
    bgGradient: [
      [11, 14, 20],
      [18, 23, 34],
    ],
    border: { color: [55, 213, 231], width: 10, side: 'inline-start' },
    padding: 70,
    font: {
      title: {
        color: [230, 233, 239],
        size: 62,
        weight: 'ExtraBold',
        lineHeight: 1.18,
        families: ['Outfit'],
      },
      description: {
        color: [90, 200, 214],
        size: 28,
        weight: 'Normal',
        families: ['JetBrains Mono'],
      },
    },
    fonts: [
      './node_modules/@fontsource/outfit/files/outfit-latin-800-normal.woff',
      './node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff',
    ],
  }),
});
