import fs from 'node:fs';
import path from 'node:path';

export function updateSitemapLastmod({ rootDir }) {
  const sitemapFile = path.join(rootDir, 'public/sitemap.xml');
  if (!fs.existsSync(sitemapFile)) return false;

  const today = new Date().toISOString().split('T')[0];
  let content = fs.readFileSync(sitemapFile, 'utf8');

  // Replace root url <lastmod>
  const updatedContent = content.replace(
    /(<loc>https:\/\/alejandrocuba\.com\/<\/loc>\s*<lastmod>)[^<]+(<\/lastmod>)/,
    `$1${today}$2`
  );

  if (content !== updatedContent) {
    fs.writeFileSync(sitemapFile, updatedContent, 'utf8');
    console.log(`Updated sitemap.xml <lastmod> to ${today}`);
    return true;
  }

  return false;
}
