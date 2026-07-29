// Metadatos y datos compartidos del sitio.

export const SITE = {
  title: 'Rodrigo Méndez',
  wordmark: 'rodrigomendez',
  tld: 'dev',
  url: 'https://rodrigomendez.dev',
  description:
    'Dev con +11 años compartiendo lo que aprende construyendo productos reales, de forma fácil. Código, IA e ingeniería.',
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
  instagram: 'https://instagram.com/rodrigomendezdev',
  tiktok: 'https://tiktok.com/@rodrigomendezdev',
} as const;

export const NAV = [
  { label: 'inicio.tsx', href: '/' },
  { label: 'sobre.md', href: '/#sobre' },
  { label: 'proyectos/', href: '/proyectos' },
  { label: 'blog/', href: '/blog' },
  { label: 'videos/', href: '/#videos' },
  { label: 'contacto', href: '/#contacto' },
] as const;

// Proyectos mostrados en /proyectos.
export const PROJECTS = [
  {
    name: 'Piclink',
    tagline: 'SaaS para fotógrafos',
    description:
      'Galerías profesionales para que los fotógrafos entreguen sus fotos listas para vender. En producción, con gente pagando.',
    url: 'https://piclink.mx',
    repo: null,
    stack: ['React', 'React Native', 'Node', 'AWS'],
    status: 'En producción',
    accent: 'live',
  },
  {
    name: 'Cronowork',
    tagline: 'Mi propio Jira, con IA',
    description:
      'Gestor de tareas minimalista (Kanban + Scrum) que genera tareas con IA vía MCP y corre self-hosted. Gratis y open source.',
    url: 'https://cronowork.app',
    repo: 'https://github.com/rodrigo2392/cronowork',
    stack: ['React', 'NestJS', 'MongoDB', 'MCP'],
    status: 'Live · Open source',
    accent: 'oss',
  },
  {
    name: 'Cross The Chicken',
    tagline: 'Un Crossy Road en 3D',
    description:
      'Juego 3D que corre en el navegador y se instala como app. Ranking global y los demás jugadores moviéndose en tiempo real.',
    url: 'https://crossthechicken.rodrigomendez.dev',
    repo: null,
    stack: ['React', 'Three.js', 'Firebase', 'PWA'],
    status: 'Live · Juego',
    accent: 'lab',
  },
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
