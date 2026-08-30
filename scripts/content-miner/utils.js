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

const DEFAULT_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
  'Accept': 'application/xml, text/xml, application/rss+xml, application/atom+xml, text/html;q=0.9, */*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9,es;q=0.8'
};

const RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504]);

export async function fetchWithRetry(url, options = {}) {
  const {
    retries = 3,
    initialDelayMs = 1500,
    backoffFactor = 2,
    maxDelayMs = 10000,
    jitterMs = 500,
    timeoutMs = 15000,
    headers = {},
    ...fetchOpts
  } = options;

  const mergedHeaders = {
    ...DEFAULT_HEADERS,
    ...headers
  };

  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(url, {
        ...fetchOpts,
        headers: mergedHeaders,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return response;
      }

      const isRetryable = RETRYABLE_STATUS_CODES.has(response.status) || response.status >= 500;
      const statusText = response.statusText || 'Error';
      const statusMsg = `HTTP ${response.status} ${statusText}`;

      if (!isRetryable || attempt === retries) {
        throw new Error(statusMsg);
      }

      lastError = new Error(statusMsg);
    } catch (err) {
      lastError = err;
      const isAbort = err.name === 'AbortError';
      const isNetwork = err.name === 'TypeError' || isAbort;

      if (attempt === retries || (!isNetwork && !lastError.message?.startsWith('HTTP '))) {
        throw new Error(`Failed to fetch ${url}: ${err.message}`);
      }
    }

    const delay = Math.min(
      initialDelayMs * Math.pow(backoffFactor, attempt) + Math.random() * jitterMs,
      maxDelayMs
    );

    console.warn(
      `[ContentMiner] Attempt ${attempt + 1}/${retries + 1} to fetch ${url} failed (${lastError.message}). Retrying in ${Math.round(delay)}ms...`
    );

    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  throw new Error(`Failed to fetch ${url}: ${lastError.message}`);
}

export async function fetchXml(url, options = {}) {
  const response = await fetchWithRetry(url, options);
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
