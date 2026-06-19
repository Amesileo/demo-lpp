import { defineConfig, type Plugin } from 'vite';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

/**
 * Dev-only: resolve extensionless URLs (e.g. /booking -> /booking.html) so the
 * local dev server matches the clean-URL behaviour served by .htaccess in prod.
 */
function cleanUrlsDev(): Plugin {
  return {
    name: 'clean-urls-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = req.url ?? '';
        if (!url.startsWith('/@') && !url.startsWith('/src/') && !url.startsWith('/node_modules')) {
          const [path, query] = url.split('?');
          if (path && path !== '/' && !path.includes('.')) {
            const rel = path.replace(/^\/+/, '').replace(/\/$/, '');
            if (existsSync(resolve(process.cwd(), `${rel}.html`))) {
              req.url = `/${rel}.html${query ? `?${query}` : ''}`;
            }
          }
        }
        next();
      });
    },
  };
}

/**
 * Tiny HTML include plugin so every page can share the same
 * <header> / <footer> markup: `<!-- @include "partials/header.html" -->`
 */
function htmlIncludes(): Plugin {
  return {
    name: 'html-includes',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.replace(/<!--\s*@include\s+"([^"]+)"\s*-->/g, (_, file) =>
          readFileSync(resolve(process.cwd(), file), 'utf-8')
        );
      },
    },
  };
}

export default defineConfig({
  plugins: [htmlIncludes(), cleanUrlsDev()],
  // Relative base so the same build works at a domain root (20i subdomain) and
  // under a subpath (GitHub Pages project URL, /demo-lpp/).
  base: './',

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: [
        'index.html',
        'characters.html',
        'packages.html',
        'booking.html',
        'contact.html',
      ],
    },
  },

  server: {
    port: 5174,
    open: true,
  },
});
