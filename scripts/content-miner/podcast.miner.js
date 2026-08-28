import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { fetchXml, extractText, cleanHtmlEntities } from './utils.js';

const YOUTUBE_CHANNEL_ID = 'UCt-RapUjjh1cfbZJRrUgtEA';

export async function processPodcastEpisode({ rootDir, channelId = YOUTUBE_CHANNEL_ID }) {
  const podcastDataFile = path.join(rootDir, 'sources/html/_data/podcast.pug');
  const podcastImgDir = path.join(rootDir, 'public/assets/images/podcast');
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

  console.log('Fetching YouTube feed for Angularidades...');
  const data = await fetchXml(feedUrl);
  const entries = Array.isArray(data.feed?.entry)
    ? data.feed.entry
    : data.feed?.entry ? [data.feed.entry] : [];

  if (entries.length === 0) {
    throw new Error('No entries found in YouTube feed');
  }

  let latestEpisodeEntry = null;
  let detectedEpNumber = null;

  for (const entry of entries) {
    const title = extractText(entry.title);
    const epMatch = title.match(/#(\d+)|(?:Episode|Episodio)\s*(\d+)/i);
    if (epMatch) {
      latestEpisodeEntry = entry;
      detectedEpNumber = parseInt(epMatch[1] || epMatch[2], 10);
      break;
    }
  }

  if (!latestEpisodeEntry) {
    latestEpisodeEntry = entries[0];
  }

  const videoId = extractText(latestEpisodeEntry['yt:videoId']);
  const title = cleanHtmlEntities(extractText(latestEpisodeEntry.title));
  const epNumber = detectedEpNumber || 84;

  console.log(`Latest Episode: #${epNumber} (${videoId}) - "${title}"`);

  if (!fs.existsSync(podcastImgDir)) {
    fs.mkdirSync(podcastImgDir, { recursive: true });
  }

  const baseImageName = `ep${epNumber}`;
  const targetWebpPath = path.join(podcastImgDir, `${baseImageName}.webp`);
  const targetWebp720Path = path.join(podcastImgDir, `${baseImageName}-720w.webp`);
  const targetWebp480Path = path.join(podcastImgDir, `${baseImageName}-480w.webp`);

  const imagesExist =
    fs.existsSync(targetWebpPath) &&
    fs.existsSync(targetWebp720Path) &&
    fs.existsSync(targetWebp480Path);

  if (!imagesExist) {
    console.log(`Downloading and optimizing thumbnail for video ${videoId}...`);
    const maxResUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
    const hqResUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

    let thumbRes = await fetch(maxResUrl);
    if (!thumbRes.ok) {
      thumbRes = await fetch(hqResUrl);
    }
    if (!thumbRes.ok) {
      throw new Error(`Failed to download YouTube thumbnail for ${videoId}`);
    }
    const thumbBuffer = Buffer.from(await thumbRes.arrayBuffer());

    await sharp(thumbBuffer)
      .resize(1280, 720, { fit: 'cover' })
      .webp({ quality: 85 })
      .toFile(targetWebpPath);

    await sharp(thumbBuffer)
      .resize(720, 405, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(targetWebp720Path);

    await sharp(thumbBuffer)
      .resize(480, 270, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(targetWebp480Path);

    console.log(`Generated responsive WebP images for ${baseImageName}`);
  } else {
    console.log(`Images for ${baseImageName} already exist.`);
  }

  // Clean up old episode thumbnails
  const existingFiles = fs.readdirSync(podcastImgDir);
  for (const file of existingFiles) {
    if (file.startsWith('ep') && file.endsWith('.webp')) {
      if (
        file !== `${baseImageName}.webp` &&
        file !== `${baseImageName}-720w.webp` &&
        file !== `${baseImageName}-480w.webp`
      ) {
        console.log(`Cleaning up old thumbnail: ${file}`);
        fs.unlinkSync(path.join(podcastImgDir, file));
      }
    }
  }

  const episode = {
    videoId,
    title,
    epNumber,
    image: `podcast/${baseImageName}.webp`
  };

  const newPodcastPug = `-
  var podcast = {
    episodes: [
      {
        videoId: "${episode.videoId}",
        title: "${episode.title.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}",
        image: "${episode.image}"
      }
    ],
    stats: [
      { number: "${episode.epNumber}", label: "Episodes" },
      { number: "80+", label: "Guests" },
      { number: "20+", label: "Countries" }
    ],
    links: {
      youtube: "https://www.youtube.com/@angularidades/videos",
      spotify: "https://open.spotify.com/show/0jrfxcnCrD7N9tlA0BGJp5",
      apple: "https://podcasts.apple.com/podcast/angularidades/id1653896173"
    }
  }
`;

  const currentPodcastPug = fs.existsSync(podcastDataFile) ? fs.readFileSync(podcastDataFile, 'utf8') : '';
  const hasChanges = newPodcastPug.trim() !== currentPodcastPug.trim();

  if (hasChanges) {
    fs.writeFileSync(podcastDataFile, newPodcastPug, 'utf8');
    console.log('Updated sources/html/_data/podcast.pug');
  } else {
    console.log('podcast.pug is already up to date.');
  }

  return { hasChanges, episode };
}
