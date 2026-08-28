#!/usr/bin/env node

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { processPodcastEpisode } from './podcast.miner.js';
import { processMediumArticles } from './articles.miner.js';
import { updateSitemapLastmod } from './sitemap.updater.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

async function main() {
  try {
    console.log('🚀 Starting content mining...');

    const [podcastResult, articlesResult] = await Promise.all([
      processPodcastEpisode({ rootDir }),
      processMediumArticles({ rootDir })
    ]);

    const hasChanges = podcastResult.hasChanges || articlesResult.hasChanges;

    if (hasChanges) {
      updateSitemapLastmod({ rootDir });
      console.log('✨ Content successfully updated!');
    } else {
      console.log('✅ All content is already up to date.');
    }
  } catch (error) {
    console.error('❌ Error during content mining:', error);
    process.exit(1);
  }
}

main();
