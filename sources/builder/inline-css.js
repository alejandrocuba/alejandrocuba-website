// Inlines critical CSS into the HTML file to address render-blocking issues for better LCP
export function inlineCssPlugin() {
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
