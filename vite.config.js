import pug from '@vituum/vite-plugin-pug';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import vituum from 'vituum';

export default defineConfig({
  root: resolve(__dirname, 'sources/html'),
  plugins: [
    vituum({
      pages: {
        dir: './',
        root: './'
      }
    }),
    pug(),
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
