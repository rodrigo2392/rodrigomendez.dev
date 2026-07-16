import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

const MESES = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
];

/** "14 jul 2026" */
export function formatDate(date: Date): string {
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${d} ${MESES[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/** ISO para <time datetime> y JSON-LD */
export function isoDate(date: Date): string {
  return date.toISOString();
}

/** Minutos de lectura a partir del cuerpo del post. */
export function readingMinutes(body: string | undefined, override?: number): number {
  if (override) return override;
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Posts publicados, ordenados por fecha desc. */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

/** Tags únicos presentes en los posts publicados, en orden de frecuencia. */
export function collectTags(posts: Post[]): string[] {
  const counts = new Map<string, number>();
  for (const p of posts) {
    for (const t of p.data.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
}

/** El slug/URL determinista de un post. */
export function postUrl(post: Post): string {
  return `/blog/${post.id}/`;
}
