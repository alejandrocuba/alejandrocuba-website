import pug from '@vituum/vite-plugin-pug';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import vituum from 'vituum';
import { highlightCode } from './sources/builder/prism-ssr.js';
import { inlineCssPlugin } from './sources/builder/inline-css.js';

export default defineConfig({
  root: resolve(__dirname, 'sources/html'),
  plugins: [
    vituum({
      pages: {
        dir: './',
        root: './'
      }
    }),
    pug({
      globals: {
        highlight: highlightCode
      },
      filters: {
        'highlight-jade': (text) => highlightCode(text, 'jade'),
      }
    }),
    inlineCssPlugin(),
  ],
  publicDir: resolve(__dirname, 'public'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    assetsDir: '',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'sources/html/index.pug')
    }
  },
  resolve: {
    alias: {
      '/sources': resolve(__dirname, 'sources'),
      '/assets': resolve(__dirname, 'public/assets'),
    },
  },
});
