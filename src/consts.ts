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
  { label: 'demos/', href: '/demos' },
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

// Demos de landings para negocios locales, mostrados en /demos.
// Los sitios estáticos se generan con dev-templates/scripts/build-demos.mjs
// y viven en public/demos/<slug>/. Los colores son la paleta de cada plantilla.
export const DEMOS = [
  {
    slug: 'restaurante',
    giro: 'restaurante',
    nombre: 'La Braza',
    lema: 'Cocina al carbón',
    descripcion: 'Menú por secciones, platillo estrella y reservas directo a WhatsApp.',
    colores: { fondo: '#F7F1E3', tinta: '#261D15', marca: '#BC4B26', acento: '#E89A3C' },
  },
  {
    slug: 'clinica',
    giro: 'clínica dental',
    nombre: 'Clínica Dental Sonría',
    lema: 'Odontología sin miedo',
    descripcion: 'Servicios, doctores y respuestas para el paciente que llega nervioso.',
    colores: { fondo: '#F3FAFB', tinta: '#123B53', marca: '#1793A6', acento: '#F26B5E' },
  },
  {
    slug: 'boutique',
    giro: 'boutique de ropa',
    nombre: 'Alma',
    lema: 'Moda mexicana hecha a mano',
    descripcion: 'Colección de temporada, catálogo y pedidos pieza por pieza.',
    colores: { fondo: '#F6F1E9', tinta: '#33261E', marca: '#C2255C', acento: '#B4633A' },
  },
  {
    slug: 'estetica',
    giro: 'estética y salón',
    nombre: 'Studio Valentina',
    lema: 'Salón de belleza',
    descripcion: 'Servicios del salón, galería de resultados y promo del mes.',
    colores: { fondo: '#FAF5F8', tinta: '#3B2140', marca: '#A3489B', acento: '#C6913B' },
  },
  {
    slug: 'farmacia',
    giro: 'farmacia',
    nombre: 'Farmacia San Rafael',
    lema: 'La farmacia del barrio',
    descripcion: 'Entregas a domicilio, recetas y consultorio adjunto.',
    colores: { fondo: '#F3F9F4', tinta: '#14332B', marca: '#178A58', acento: '#2E5FB0' },
  },
  {
    slug: 'mascotas',
    giro: 'veterinaria y spa',
    nombre: 'Peludos',
    lema: 'Clínica veterinaria y estética canina',
    descripcion: 'Consulta, estética canina, paquetes mensuales y urgencias.',
    colores: { fondo: '#FFF6E9', tinta: '#33356B', marca: '#E2611B', acento: '#2E9DC4' },
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
