import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import tailwindcss from '@tailwindcss/vite';

const SURFACE = '#121722';
const BORDER = '#1E2530';

// https://astro.build
export default defineConfig({
  site: 'https://rodrigomendez.dev',
  devToolbar: { enabled: false },
  integrations: [
    expressiveCode({
      themes: ['github-dark-default'],
      plugins: [pluginLineNumbers()],
      defaultProps: {
        showLineNumbers: true,
        wrap: false,
      },
      styleOverrides: {
        borderRadius: '12px',
        borderColor: BORDER,
        codeFontFamily: "'JetBrains Mono Variable', ui-monospace, monospace",
        uiFontFamily: "'JetBrains Mono Variable', ui-monospace, monospace",
        codeBackground: SURFACE,
        frames: {
          editorBackground: SURFACE,
          editorActiveTabBackground: SURFACE,
          editorTabBarBackground: SURFACE,
          editorActiveTabIndicatorTopColor: '#37D5E7',
          editorActiveTabIndicatorBottomColor: 'transparent',
          editorActiveTabBorderColor: BORDER,
          editorTabBarBorderBottomColor: BORDER,
          terminalBackground: SURFACE,
          terminalTitlebarBackground: SURFACE,
          terminalTitlebarBorderBottomColor: BORDER,
          shadowColor: 'transparent',
        },
        lineNumbers: {
          foreground: '#4A5568',
        },
      },
    }),
    mdx(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
