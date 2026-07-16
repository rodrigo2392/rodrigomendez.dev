import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// El schema es el CONTRATO que la fábrica de contenido debe respetar al escribir
// un .mdx en src/content/blog/. Si el frontmatter es inválido, el build falla.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).min(1),
    heroImage: z.string().optional(),
    heroCaption: z.string().optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    // procedencia desde la fábrica (opcional)
    sourcePiece: z.string().optional(),
    readingTime: z.number().optional(),
  }),
});

export const collections = { blog };
