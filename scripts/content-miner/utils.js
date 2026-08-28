import { XMLParser } from 'fast-xml-parser';

export const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function cleanHtmlEntities(text) {
  if (!text) return '';
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

export function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+([.,;:!?])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

export function formatDate(dateObj) {
  const year = dateObj.getUTCFullYear();
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getUTCDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  const monthName = MONTH_NAMES[dateObj.getUTCMonth()];
  const formattedDay = dateObj.getUTCDate();
  const dateFormatted = `${monthName} ${formattedDay}, ${year}`;

  return { date: dateStr, dateFormatted };
}

export async function fetchXml(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; AlejandroCubaContentMiner/1.0)'
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  const xml = await response.text();
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    cdataPropName: '__cdata'
  });
  return parser.parse(xml);
}

export function extractText(val) {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    if (val.__cdata) return val.__cdata;
    if (val['#text']) return val['#text'];
  }
  return String(val);
}

const SPANISH_FUNCTION_WORDS = new Set([
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
  'de', 'del', 'al', 'a', 'en', 'con', 'por', 'para', 'sin', 'sobre',
  'y', 'e', 'o', 'u', 'pero', 'mas', 'que', 'como', 'si'
]);

const ENGLISH_FUNCTION_WORDS = new Set([
  'the', 'a', 'an',
  'of', 'in', 'to', 'for', 'with', 'on', 'at', 'from', 'by', 'about', 'into', 'through', 'after',
  'and', 'but', 'or', 'so', 'yet', 'if', 'as', 'than', 'that', 'this', 'these', 'those'
]);

export function isEnglishContent(title, description = '') {
  const text = `${title} ${description}`.toLowerCase();
  const words = text.replace(/[^a-záéíóúñü\s]/g, ' ').split(/\s+/).filter(Boolean);

  let esCount = 0;
  let enCount = 0;

  for (const w of words) {
    if (SPANISH_FUNCTION_WORDS.has(w)) esCount++;
    if (ENGLISH_FUNCTION_WORDS.has(w)) enCount++;
  }

  return enCount >= esCount;
}
