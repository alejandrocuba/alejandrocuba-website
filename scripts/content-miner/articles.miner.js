import fs from 'node:fs';
import path from 'node:path';
import { fetchXml, extractText, cleanHtmlEntities, stripHtml, formatDate, isEnglishContent } from './utils.js';

const MEDIUM_USERNAME = 'alejandrocuba';
const ARTICLES_LIMIT = 3;

export function extractDescriptionExcerpt(contentEncoded, descriptionFallback) {
  if (!contentEncoded) {
    return cleanHtmlEntities(stripHtml(descriptionFallback || ''));
  }

  const h4Match = contentEncoded.match(/<h4[^>]*>([\s\S]*?)<\/h4>/i);
  if (h4Match) {
    const subtitle = cleanHtmlEntities(stripHtml(h4Match[1]));
    if (subtitle) {
      return subtitle.endsWith('.') ? subtitle : `${subtitle}.`;
    }
  }

  const pMatch = contentEncoded.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (pMatch) {
    const firstP = cleanHtmlEntities(stripHtml(pMatch[1]));
    if (firstP) {
      const pSentence = (firstP.match(/[^.!?]+[.!?]+/g) || [firstP])[0].trim();
      return pSentence.length > 180
        ? pSentence.slice(0, 177).replace(/\s+\S*$/, '') + '...'
        : (pSentence.endsWith('.') ? pSentence : `${pSentence}.`);
    }
  }

  const fallback = cleanHtmlEntities(stripHtml(descriptionFallback || ''));
  return fallback ? (fallback.endsWith('.') ? fallback : `${fallback}.`) : '';
}

function readExistingArticles(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  const articles = [];
  const regex = /\{\s*title:\s*"((?:\\"|[^"])+)",\s*description:\s*"((?:\\"|[^"])+)",\s*date:\s*"([^"]+)",\s*dateFormatted:\s*"([^"]+)",\s*url:\s*"([^"]+)"\s*\}/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    articles.push({
      title: match[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\'),
      description: match[2].replace(/\\"/g, '"').replace(/\\\\/g, '\\'),
      date: match[3],
      dateFormatted: match[4],
      url: match[5]
    });
  }
  return articles;
}

export async function processMediumArticles({
  rootDir,
  username = MEDIUM_USERNAME,
  limit = ARTICLES_LIMIT
}) {
  const articlesDataFile = path.join(rootDir, 'sources/html/_data/articles.pug');
  const feedUrl = `https://medium.com/feed/@${username}`;

  console.log(`Fetching Medium feed for @${username}...`);
  const data = await fetchXml(feedUrl);
  const items = Array.isArray(data.rss?.channel?.item)
    ? data.rss.channel.item
    : data.rss?.channel?.item ? [data.rss.channel.item] : [];

  if (items.length === 0) {
    throw new Error('No articles found in Medium feed');
  }

  const fetchedArticles = [];
  for (const item of items) {
    const title = cleanHtmlEntities(extractText(item.title));
    const rawLink = extractText(item.link);
    const url = rawLink.split('?')[0];

    const categoriesRaw = item.category ? (Array.isArray(item.category) ? item.category : [item.category]) : [];
    const categories = categoriesRaw.map(extractText);
    const contentEncoded = extractText(item['content:encoded']);
    const descriptionFallback = extractText(item.description);

    // Exclude podcast episode summaries/notes (they belong to Podcast section)
    const isPodcastNote =
      url.includes('/angularidades/') ||
      categories.some(c => c.toLowerCase() === 'podcast') ||
      (contentEncoded && contentEncoded.includes('Angularidades podcast'));

    if (isPodcastNote) {
      console.log(`Excluding podcast summary: "${title}"`);
      continue;
    }

    // Exclude Spanish translations
    if (!isEnglishContent(title, contentEncoded || descriptionFallback)) {
      console.log(`Excluding non-English article: "${title}"`);
      continue;
    }

    const pubDateStr = extractText(item.pubDate);
    const dateObj = new Date(pubDateStr);
    const { date, dateFormatted } = formatDate(dateObj);

    const description = extractDescriptionExcerpt(contentEncoded, descriptionFallback);

    fetchedArticles.push({
      title,
      description,
      date,
      dateFormatted,
      url
    });
  }

  console.log(`Found ${fetchedArticles.length} technical English articles from latest feed.`);

  // Merge with existing articles (to preserve historical articles from the list when feed only has recent items)
  const existingArticles = readExistingArticles(articlesDataFile);
  const combinedMap = new Map();

  for (const art of fetchedArticles) {
    combinedMap.set(art.url, art);
  }
  for (const art of existingArticles) {
    if (!combinedMap.has(art.url)) {
      combinedMap.set(art.url, art);
    }
  }

  // Sort by date descending and take top `limit`
  const articles = Array.from(combinedMap.values())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  console.log(`Selected top ${articles.length} frontend development articles.`);

  const pugItems = articles.map(art => `    {
      title: "${art.title.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}",
      description: "${art.description.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}",
      date: "${art.date}",
      dateFormatted: "${art.dateFormatted}",
      url: "${art.url}"
    }`).join(',\n');

  const newArticlesPug = `-
  var articles = [
${pugItems}
  ]
`;

  const currentArticlesPug = fs.existsSync(articlesDataFile) ? fs.readFileSync(articlesDataFile, 'utf8') : '';
  const hasChanges = newArticlesPug.trim() !== currentArticlesPug.trim();

  if (hasChanges) {
    fs.writeFileSync(articlesDataFile, newArticlesPug, 'utf8');
    console.log('Updated sources/html/_data/articles.pug');
  } else {
    console.log('articles.pug is already up to date.');
  }

  return { hasChanges, articles };
}
