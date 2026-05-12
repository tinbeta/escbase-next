const CHANNEL_VIDEOS_URL = 'https://www.youtube.com/@ESCBase/videos';
const DEBUG_API_ERRORS = process.env.DEBUG_API_ERRORS === '1';

function pickRunsText(node) {
  if (!node) return '';
  if (typeof node?.simpleText === 'string') return node.simpleText;
  if (Array.isArray(node?.runs)) return node.runs.map((r) => r.text || '').join('').trim();
  return '';
}

function findObjectsByKey(value, key, acc = []) {
  if (!value || typeof value !== 'object') return acc;
  if (Array.isArray(value)) {
    for (const item of value) findObjectsByKey(item, key, acc);
    return acc;
  }
  if (key in value) acc.push(value[key]);
  for (const item of Object.values(value)) findObjectsByKey(item, key, acc);
  return acc;
}

function extractInitialData(html) {
  const match = html.match(/var ytInitialData = (\{[\s\S]*?\});<\/script>/);
  if (!match) throw new Error('ytInitialData not found');
  return JSON.parse(match[1]);
}

function extractVideos(data) {
  const renderers = findObjectsByKey(data, 'videoRenderer');
  const seen = new Set();
  const videos = [];

  for (const video of renderers) {
    const id = video?.videoId;
    const title = pickRunsText(video?.title);
    if (!id || !title || seen.has(id)) continue;
    seen.add(id);

    const published =
      pickRunsText(video?.publishedTimeText) ||
      pickRunsText(video?.videoInfo?.runs?.[0]) ||
      '';

    const thumb = video?.thumbnail?.thumbnails?.slice(-1)?.[0]?.url || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

    videos.push({
      id,
      title,
      url: `https://www.youtube.com/watch?v=${id}`,
      published,
      thumb,
    });
  }

  return videos;
}

function publicError(error) {
  const payload = {
    source: 'fallback',
    updatedAt: new Date().toISOString(),
    videos: [],
    error: 'Không thể tải feed YouTube lúc này.',
  };

  if (DEBUG_API_ERRORS) {
    payload.detail = error instanceof Error ? error.message : 'unknown_error';
  }

  return payload;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=300');

  try {
    const response = await fetch(CHANNEL_VIDEOS_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    });

    if (!response.ok) {
      throw new Error(`YouTube page request failed: ${response.status}`);
    }

    const html = await response.text();
    const data = extractInitialData(html);
    const videos = extractVideos(data).slice(0, 12);

    if (!videos.length) {
      throw new Error('No videos found in ytInitialData');
    }

    return res.status(200).json({
      source: 'youtube-channel-page',
      updatedAt: new Date().toISOString(),
      videos,
    });
  } catch (error) {
    return res.status(200).json(publicError(error));
  }
}
