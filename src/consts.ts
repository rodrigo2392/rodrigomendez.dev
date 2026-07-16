// Metadatos y datos compartidos del sitio.

export const SITE = {
  title: 'Rodrigo Méndez',
  wordmark: 'rodrigomendez',
  tld: 'dev',
  url: 'https://rodrigomendez.dev',
  description:
    'Dev con +11 años compartiendo lo que aprende construyendo productos reales, en cristiano. Código, IA e ingeniería.',
  tagline: 'Código, IA e ingeniería',
  lang: 'es-MX',
  locale: 'es_MX',
} as const;

export const AUTHOR = {
  name: 'Rodrigo Méndez',
  handle: '@rodrigomendezdev',
  role: 'Fullstack Product Developer',
  location: 'Guadalajara, MX',
  years: 11,
  oneLiner:
    'Software Developer con más de 11 años de experiencia. Compartiendo, aprendiendo y construyendo productos de software.',
  email: 'hola@rodrigomendez.dev',
  photo: '/img/rodrigo-portrait.jpg',
  avatar: '/img/rodrigo-avatar.jpg',
} as const;

export const SOCIALS = {
  youtube: 'https://youtube.com/@rodrigomendezdev',
  github: 'https://github.com/rodrigo2392',
  x: 'https://x.com/rodrigomendezdev',
  instagram: 'https://instagram.com/rodrigomendezdev',
  tiktok: 'https://tiktok.com/@rodrigomendezdev',
} as const;

export const NAV = [
  { label: 'inicio.tsx', href: '/' },
  { label: 'sobre.md', href: '/#sobre' },
  { label: 'blog/', href: '/blog' },
  { label: 'videos/', href: '/#videos' },
  { label: 'contacto', href: '/#contacto' },
] as const;

// Stack mostrado en el home.
export const STACK = [
  'React',
  'React Native',
  'Next / Astro',
  'Node',
  'Nest',
  'Tailwind',
  'AWS',
] as const;

// Los videos viven en src/data/videos.json (generado por scripts/pull-youtube.mjs).
