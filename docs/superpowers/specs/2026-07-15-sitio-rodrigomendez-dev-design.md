# rodrigomendez.dev — Diseño del sitio y del loop de contenido

- **Fecha:** 2026-07-15
- **Estado:** Aprobado (diseño visual completo) — listo para plan de implementación
- **Repo:** `D:/rmendezdev/site` (nuevo, separado de `marketer` y `my-video`)
- **Diseños de referencia:** `docs/design/home.pdf`, `docs/design/blog-list.pdf`, `docs/design/blog-post.pdf`

## 1. Objetivo

Rehacer el sitio personal **rodrigomendez.dev** desde cero, con un **blog funcional** al
que la **fábrica de contenido** (`D:/rmendezdev/marketer`) pueda **agregar entradas de forma
automática**. El blog es el activo propio que da **SEO / buscabilidad** (ataca el problema de
descubrimiento del canal de YouTube) y tráfico que no depende de IG/FB.

### El loop de contenido (el "por qué")

Una investigación de la fábrica produce **tres salidas** desde la misma base:

```
investigación (factual) ──► carrusel (IG/FB)
                        ├──► DM híbrido (comment→DM): valor directo + link a la guía
                        └──► entrada de blog (.mdx) ──► SEO + activo propio
```

El **DM es híbrido**: da valor directo (la lista con URLs) **y** enlaza a la guía más profunda
del blog. No manda solo al sitio (se siente bait): valor primero + razón real para el click.

## 2. Decisiones tomadas (locked)

| Decisión | Elección |
|---|---|
| Alcance del spec | Sitio completo (home + páginas + blog + integración) de una |
| Stack | **Astro + MDX** (islas de React solo si hacen falta) |
| Deploy | **Cloudflare Pages** (git push → build → deploy) |
| Estética | Dark-tech con guiños de editor de código (hermano del kit de carruseles/videos) |
| Acento de marca | **Cian eléctrico `#37D5E7`** (reemplaza al verde menta previo) |
| Publicación del blog | Atada a la **aprobación del carrusel en Telegram** (una sola compuerta) |
| Piezas que generan post | Solo las **factuales con investigación** (listicle/comparativa/"top X") |
| Tema | **Dark-only** en v1 (toggle claro = follow-up) |
| Contenido base | Copy/bio/foto derivados del sitio vivo (el código fuente no está local) |

## 3. Sistema de diseño

Fuente de verdad visual: los tres PDFs en `docs/design/`. Tokens y motivos derivados de ahí.

### Tokens de color

```
--bg:           #0B0E14   /* fondo principal */
--surface:      #121722   /* cards, paneles, bloques de código */
--ink:          #E6E9EF   /* texto */
--muted:        #8A93A6   /* metadata, excerpts, captions */
--border:       #1E2530   /* líneas 1px, separadores */
--accent:       #37D5E7   /* cian — links, tags, CTA, "dev", highlights, marcas ## */
--accent-deep:  #22B8CC   /* hover / gradientes del acento */
--accent-soft:  rgba(55,213,231,0.12)  /* fondos de chip/badge/callout/inline-code */
```

El acento se usa **con moderación**: es el protagonista, no el relleno. Ningún color fuera de
esta paleta salvo el syntax highlighting del código.

### Tipografía

- **Sans (títulos + cuerpo):** Outfit (headings 600–700, cuerpo 400–500).
- **Mono (kickers, metadata, nav, código, fechas, tags):** JetBrains Mono.
- Artículo: interlineado ~1.7, ancho de lectura ~68ch, jerarquía h2/h3 clara.

### Motivos "editor de código" (firma de marca)

- Nav con labels tipo archivo: `inicio.tsx · sobre.md · blog/ · videos/ · contacto`.
- Wordmark `rodrigomendez` + `dev` (el `dev` en acento).
- Kickers de sección en mono con doble slash: `// stack`, `// blog`, `// relacionados`.
- Headings de artículo prefijados con `##` en acento.
- Cards de código con barra superior (3 traffic lights + nombre de archivo) + números de línea.
- Metadata siempre en mono. Chips/tags en mono. Bordes 1px sutiles, mucho aire.

## 4. Estructura del sitio

Astro genera estático. **El home es one-page** con secciones ancladas; **el blog son rutas
reales** (imprescindible para SEO).

```
/                     Home (one-page): hero + sobre-mí + stack + últimos posts + videos + contacto
/blog                 Lista de posts (con filtro por tag, destacado, cargar más)
/blog/[slug]          Página de artículo (lectura + código + TOC + relacionados)
/rss.xml              Feed RSS (generado)
/sitemap-index.xml    Sitemap (generado por @astrojs/sitemap)
```

Nav (sticky): `inicio.tsx`(→ `/`) · `sobre.md`(ancla) · `blog/`(→ `/blog`) · `videos/`(ancla) ·
`contacto`(ancla) + pill **Suscríbete →**. Footer: wordmark + "Código, IA e ingeniería" +
links (YouTube, GitHub, X).

### Home — secciones (ver `home.pdf`)

1. **Hero:** kicker `// FULLSTACK PRODUCT DEVELOPER`, nombre, one-liner, CTAs
   (**Suscríbete en YouTube** primario + **Lee el blog** secundario), línea de metadata
   (Guadalajara, MX · +11 años · @rodrigomendezdev), y un **code-card `rodrigo.ts`** que se
   "presenta".
2. **Sobre mí (`// sobre-mi`):** foto retrato dark + narrativa en 1ª persona, voz cálida.
3. **Stack (`// stack`):** chips (React, React Native, Next/Astro, Node, Nest, Tailwind, AWS).
4. **Blog (`// blog — últimos posts`):** 3 posts recientes como filas + "ver todos →".
5. **Videos (`// videos`):** grid de 3 videos con thumbnail, duración y play → YouTube.
6. **Contacto (`// contacto`):** correo `hola@rodrigomendez.dev` + redes.

### Blog — lista (ver `blog-list.pdf`)

- Encabezado `// blog` + "El blog" + intro en la voz de Rodrigo.
- **Card DESTACADO** (post más reciente): hero + metadata + título + excerpt + "leer →".
- **Filtro por tag** (chips mono): `todos` (activo, en acento) · react · astro · negocio · ia · devops.
- **Lista de posts:** filas `fecha · min · tag` + título (hover acento) + excerpt + thumbnail,
  separadas por línea 1px, todo el row clickeable.
- **Cargar más** (paginación discreta en mono).

### Blog — post (ver `blog-post.pdf`)

- Breadcrumb file-tab: `blog / <slug>.md`.
- Metadata mono (`fecha · min · tag`), título grande, bajada/dek.
- **Bloque de autor:** foto + "Rodrigo Méndez / Fullstack Product Developer".
- Hero image opcional con **caption** (`fig. 1 — ...`) en mono muted.
- **TOC sticky** a la derecha ("EN ESTA PÁGINA"), heading activo en acento; se oculta en móvil.
- Cuerpo: párrafos ~68ch, headings con `##` en acento, listas, **inline code** como badge,
  **callout NOTA** (barra izquierda en acento), **bloque de código** editor (traffic lights +
  nombre de archivo + números de línea + botón **copiar** + syntax highlighting on-brand),
  **blockquote** destacado (barra de acento).
- Cierre: card de autor con CTA **Suscríbete en YouTube**, nav **anterior/siguiente**,
  sección `// relacionados` (2–3 cards).
- Barra de progreso de lectura fina opcional (en acento).

## 5. El contrato de contenido (corazón del loop)

Astro content collection `blog`. Este esquema es **el contrato** que la fábrica debe respetar;
si el `.mdx` trae frontmatter inválido, **el build de Astro falla** (validación gratis).

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),            // meta SEO + excerpt en la lista/DM
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).min(1),   // react | astro | node | negocio | ia | devops | ...
    heroImage: z.string().optional(),   // ruta a imagen (puede reusar portada del carrusel)
    heroCaption: z.string().optional(),
    draft: z.boolean().default(false),
    // procedencia desde la fábrica
    sourcePiece: z.string().optional(), // id de la pieza en marketer/state/content-plan.json
    readingTime: z.number().optional(), // min; si falta, se calcula en build
  }),
});

export const collections = { blog };
```

### Formato de autoría del `.mdx`

Los posts se escriben en **MDX** para poder usar los componentes de marca. Elementos soportados
(mapeados a componentes/estilos del diseño):

- Headings `##`/`###` (con marca `##` en acento).
- Párrafos, listas, links (en acento), `inline code` (badge), blockquote (barra de acento).
- `<Nota>…</Nota>` → callout NOTA.
- Bloques de código con **meta de nombre de archivo**, p.ej. ` ```tsx title="useEffect.tsx" `,
  render con barra de traffic lights + números de línea + botón copiar (Shiki + rehype).
- `<Figura src caption />` → imagen con caption en mono.

## 6. Integración con la fábrica (`marketer`)

Ambos repos viven bajo `D:/rmendezdev/`, así que la fábrica escribe directo en el repo del
sitio (path relativo `../site`) y hace commit + push.

### Cambios en `marketer`

1. **`content-strategist`** (agente): en piezas **factuales con investigación**, marca la pieza
   en `state/content-plan.json` con `blog: true` y una referencia a la investigación
   (`researchRef`), conservando `id` y `scheduledAt`. Genera un `slug` determinista.
2. **Nuevo agente `blog-writer`** (`.claude/agents/blog-writer.md`): toma la misma investigación
   y escribe la **guía MDX completa** (más profunda que el carrusel), respetando el contrato del
   §5 y la voz de Rodrigo (`docs/voz-de-rodrigo.md`). Guarda el borrador en
   `out/drafts/<id>/post.mdx` (todavía **no** lo publica).
3. **Nuevo script `scripts/publish-blog.mjs`**: al **publicarse** la pieza (lo dispara
   `listen.mjs` cuando el carrusel se aprueba con ✅ y llega su hora), copia
   `out/drafts/<id>/post.mdx` → `../site/src/content/blog/<slug>.mdx`, hace `git add/commit/push`
   en el repo del sitio → Cloudflare Pages despliega. Idempotente y con `--dry-run`.
4. **DM híbrido:** como el `slug`/URL es determinista, el `commentDM` de la pieza ya incluye el
   link al post (`https://rodrigomendez.dev/blog/<slug>`) junto al valor directo.

### Reglas de robustez

- **Aislamiento de fallos:** un error al escribir/pushear el blog **no bloquea** la publicación
  social; se loguea en `logs/` y se avisa por Telegram.
- **Colisión de slugs:** `publish-blog.mjs` verifica contra los `.mdx` existentes y
  `state/used-topics.json`; si colisiona, sufija o reporta.
- **Una sola compuerta humana:** la aprobación en Telegram gobierna carrusel **y** blog juntos.
  El post entra en vivo cuando el carrusel se publica (así el DM que lo enlaza ya es válido).

## 7. SEO y rendimiento

- Meta + **OpenGraph**/Twitter Card por página; `canonical`; `<title>`/`description` desde el
  frontmatter en los posts.
- **JSON-LD `Article`** en cada post (headline, datePublished, author, image).
- **Sitemap** (`@astrojs/sitemap`) y **RSS** (`@astrojs/rss`).
- **Reading time** calculado en build si falta en el frontmatter.
- Output estático, imágenes optimizadas (`astro:assets`), Core Web Vitals altos, sin JS
  innecesario (islas solo donde haya interacción: TOC activo, copiar código, filtro de tags).

## 8. Manejo de errores y pruebas

- **El `astro build` es la prueba principal:** valida el schema del content collection y links
  rotos; si un `.mdx` de la fábrica está mal, el build (y el deploy) falla de forma visible.
- **Post fixture:** un post de ejemplo real ("Dejé de usar useEffect para todo…") verifica el
  pipeline visual end-to-end (lista + post + código + callout + TOC) antes de conectar la fábrica.
- **`publish-blog.mjs`:** modo `--dry-run` y prueba de que escribe el archivo correcto, respeta
  slugs y no rompe si el push falla.
- Chequeo de accesibilidad básico (contraste AA sobre `#0B0E14`, foco visible, headings en orden,
  `alt` en imágenes) y `prefers-reduced-motion` respetado.

## 9. Fuera de alcance (v1) / follow-ups

- **Migrar el kit de carruseles/videos** del verde menta al cian `#37D5E7` (coherencia de marca)
  — tarea aparte en `marketer`/`my-video` después de que el sitio esté vivo.
- Toggle de tema claro.
- Comentarios en el blog, búsqueda full-text, newsletter con formulario propio.
- Reactivar la auto-generación pausada de la fábrica (este spec deja el gancho listo).

## 10. Fases sugeridas (para el plan)

1. **Andamiaje:** Astro + MDX + Tailwind (tokens como variables CSS), layout base, nav, footer,
   deploy a Cloudflare Pages (dominio se reapunta al final).
2. **Home** (one-page con las 6 secciones) con contenido derivado del sitio vivo.
3. **Sistema del blog:** content collection + schema, `/blog` (lista + filtro + destacado),
   `/blog/[slug]` (artículo, código, callouts, TOC, relacionados), RSS + sitemap + JSON-LD.
4. **Post fixture** y verificación visual end-to-end contra los PDFs de diseño.
5. **Integración fábrica:** `content-strategist` (flag `blog`), agente `blog-writer`,
   `publish-blog.mjs`, DM híbrido; prueba con `--dry-run`.
6. **Publicación:** reapuntar `rodrigomendez.dev` en Cloudflare.
