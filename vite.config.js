import pug from '@vituum/vite-plugin-pug';
import { minify } from 'html-minifier-terser';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import vituum from 'vituum';

function htmlOptimizerPlugin() {
  return {
    name: 'html-optimizer-plugin',
    enforce: 'post',
    async generateBundle(options, bundle) {
      const htmlFile = Object.values(bundle).find(f => f.fileName.endsWith('.html'));
      const cssFile = Object.values(bundle).find(f => f.fileName.endsWith('.css'));
      if (htmlFile) {
        let html = typeof htmlFile.source === 'string' ? htmlFile.source : htmlFile.source.toString('utf8');

        if (cssFile) {
          const cssContent = typeof cssFile.source === 'string' ? cssFile.source : cssFile.source.toString('utf8');
          const escapedFileName = cssFile.fileName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          const cssRegex = new RegExp(`<link[^>]*href=["'][^"']*${escapedFileName}["'][^>]*>`, 'g');
          html = html.replace(cssRegex, () => `<style>${cssContent}</style>`);
          delete bundle[cssFile.fileName];
        }

        htmlFile.source = await minify(html, {
          removeComments: true,
          minifyCSS: true,
          minifyJS: true,
          processScripts: ['application/ld+json'],
          collapseWhitespace: false
        });
      }
    }
  };
}

export default defineConfig({
  root: resolve(import.meta.dirname, 'sources/html'),
  plugins: [
    vituum({
      pages: {
        dir: './',
        root: './'
      }
    }),
    pug(),
    htmlOptimizerPlugin(),
  ],
  publicDir: resolve(import.meta.dirname, 'public'),
  build: {
    modulePreload: { polyfill: false },
    minify: 'terser',
    terserOptions: {
      compress: {
        passes: 3,
        unsafe_arrows: true
      },
      format: {
        comments: false
      }
    },
    outDir: resolve(import.meta.dirname, 'dist'),
    assetsDir: '',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(import.meta.dirname, 'sources/html/index.pug')
    }
  },
  resolve: {
    alias: {
      '/sources': resolve(import.meta.dirname, 'sources'),
      '/assets': resolve(import.meta.dirname, 'public/assets'),
    },
  },
});
