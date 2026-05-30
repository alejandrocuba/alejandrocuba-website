import pug from '@vituum/vite-plugin-pug';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import vituum from 'vituum';

// Inlines critical CSS into the HTML file to address render-blocking issues for better LCP
function inlineCssPlugin() {
  return {
    name: 'inline-css-plugin',
    enforce: 'post',
    generateBundle(options, bundle) {
      const htmlFile = Object.values(bundle).find(f => f.fileName.endsWith('.html'));
      const cssFile = Object.values(bundle).find(f => f.fileName.endsWith('.css'));
      if (htmlFile && cssFile) {
        const cssContent = cssFile.source;
        const escapedFileName = cssFile.fileName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const cssRegex = new RegExp(`<link[^>]*href=["'][^"']*${escapedFileName}["'][^>]*>`, 'g');
        htmlFile.source = htmlFile.source.replace(cssRegex, `<style>${cssContent}</style>`);
        delete bundle[cssFile.fileName];
      }
    }
  };
}

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
