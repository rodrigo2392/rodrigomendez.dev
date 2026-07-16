# rodrigomendez.dev

Sitio personal de Rodrigo Méndez (dark-tech con guiños de editor de código) con un **blog**
al que la [fábrica de contenido](../marketer) agrega entradas de forma automática.

- **Stack:** Astro 5 + MDX + Tailwind v4 + [Expressive Code]. Output **estático**.
- **Deploy:** Cloudflare Pages.
- **Acento de marca:** cian `#37D5E7`. Fuentes: Outfit + JetBrains Mono.
- **Diseño de referencia:** `docs/design/*.pdf`. Spec: `docs/superpowers/specs/`.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # genera dist/ (estático)
npm run preview    # sirve dist/
```

## Estructura

```
src/
  content/
    blog/            # .mdx  ← aquí escribe la fábrica (una entrada por post)
  content.config.ts  # el CONTRATO del frontmatter (Zod). Si un .mdx es inválido, el build falla.
  components/         # Nav, Footer, PostRow, VideoCard, CodeCard, mdx/{Nota,Figura}
  layouts/BaseLayout.astro
  pages/
    index.astro          # Home (one-page): hero · sobre-mí · stack · blog · videos · contacto
    blog/index.astro     # Lista (filtro por tag, destacado, cargar más)
    blog/[slug].astro    # Artículo (TOC, código estilo editor, callouts, relacionados)
    rss.xml.ts           # RSS
  styles/{global,prose}.css
public/                  # favicon, og-default, robots, _headers, img/
```

## Escribir un post a mano

Crea `src/content/blog/<slug>.mdx` con el frontmatter del contrato:

```yaml
---
title: "Título fuerte"
description: "1 frase (meta SEO + excerpt)."
pubDate: 2026-07-15
tags: ["react"]
draft: false
# opcionales: updatedDate, heroImage, heroCaption, featured, readingTime, sourcePiece
---
```

En el cuerpo (MDX) puedes usar, sin importar nada: bloques ` ```tsx title="archivo.tsx" `,
`<Nota>…</Nota>`, `<Figura caption="fig. 1 — ..." />`, headings `##`/`###`, blockquotes y listas.

## Publicación automática desde la fábrica

Cuando una pieza factual con investigación se aprueba y publica en Telegram, la fábrica
(`../marketer`) copia su `.mdx` a `src/content/blog/`, hace commit y **push**, y Cloudflare Pages
despliega. Ver `../marketer/scripts/publish-blog.mjs` y el agente `blog-writer`.

## Deploy en Cloudflare Pages

1. Sube este repo a GitHub (o GitLab).
2. En Cloudflare → **Workers & Pages → Create → Pages → Connect to Git**, elige el repo.
3. Build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - **Environment variable:** `NODE_VERSION = 22` (o usa el `.nvmrc` incluido)
4. Deploy. Cada push a `main` reconstruye y publica.
5. **Dominio:** en el proyecto de Pages → **Custom domains** agrega `rodrigomendez.dev`
   (y `www`). Como el DNS ya está en Cloudflare, apunta el registro al proyecto de Pages
   (reemplaza el destino actual del sitio viejo).

> Nota: para que la fábrica publique sola, su `SITE_DIR` debe apuntar a este repo (default `../site`)
> y este repo debe tener el remoto de GitHub configurado para que `git push` dispare el deploy.

## Más features

- **Proyectos** (`/proyectos`) y **`/uses`** — showcase de Piclink/Cronowork y el setup.
- **Tags** (`/blog/tag/<tag>`) — páginas indexables por etiqueta.
- **Buscador** — Pagefind indexa `dist` en el build (`astro build && pagefind --site dist`) y el `/blog` monta la UI.
- **OG dinámicas** — `src/pages/og/[...route].ts` genera una imagen por post (título + tag, dark-tech) con `astro-og-canvas`.
- **Command palette** — ⌘/Ctrl+K (o `/`) para navegar.

### Variables de entorno (opcionales, ver `.env.example`)
- `PUBLIC_CF_BEACON_TOKEN` — activa Cloudflare Web Analytics (token del dashboard).
- `PUBLIC_NEWSLETTER_ENDPOINT` — endpoint del proveedor de newsletter (Buttondown/Formspree). Sin él, el form cae a "escríbeme por correo".
