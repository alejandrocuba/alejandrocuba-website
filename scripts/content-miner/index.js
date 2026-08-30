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
  console.log('Starting content mining...');

  const [podcastSettled, articlesSettled] = await Promise.allSettled([
    processPodcastEpisode({ rootDir }),
    processMediumArticles({ rootDir })
  ]);

  let podcastResult = { hasChanges: false };
  let articlesResult = { hasChanges: false };
  let failureCount = 0;

  if (podcastSettled.status === 'fulfilled') {
    podcastResult = podcastSettled.value;
  } else {
    failureCount++;
    console.error('Podcast Miner encountered an error:', podcastSettled.reason.message);
  }

  if (articlesSettled.status === 'fulfilled') {
    articlesResult = articlesSettled.value;
  } else {
    failureCount++;
    console.error('Articles Miner encountered an error:', articlesSettled.reason.message);
  }

  if (failureCount === 2) {
    console.error('All content miners failed. Exiting with error.');
    process.exit(1);
  }

  const hasChanges = podcastResult.hasChanges || articlesResult.hasChanges;

  if (hasChanges) {
    updateSitemapLastmod({ rootDir });
    console.log('Content successfully updated!');
  } else {
    console.log('All content is already up to date.');
  }
}

main();
