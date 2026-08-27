import pug from '@vituum/vite-plugin-pug';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import vituum from 'vituum';
import { inlineCssPlugin } from './sources/builder/inline-css.js';

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
    inlineCssPlugin(),
  ],
  publicDir: resolve(import.meta.dirname, 'public'),
  build: {
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

