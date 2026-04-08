const CHANNEL_ID = 'UCTZxiCiz5ehczZFjyEU4h5A';
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

function stripCdata(value = '') {
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
}

function decodeXml(value = '') {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function pick(entry, pattern) {
  const match = entry.match(pattern);
  return match ? decodeXml(stripCdata(match[1])) : '';
}

function parseFeed(xml) {
  return xml
    .split(/<entry>/g)
    .slice(1)
    .map((chunk) => ({
      title: pick(chunk, /<title>([\s\S]*?)<\/title>/i),
      url: pick(chunk, /<link[^>]*href="([^"]+)"/i),
      videoId: pick(chunk, /<yt:videoId>([\s\S]*?)<\/yt:videoId>/i),
      publishedRaw: pick(chunk, /<published>([\s\S]*?)<\/published>/i),
    }))
    .filter((item) => item.videoId && item.url)
    .map((item) => ({
      ...item,
      published: item.publishedRaw ? new Date(item.publishedRaw).toLocaleDateString('vi-VN') : '',
      thumb: `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`,
    }));
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=300');

  try {
    const response = await fetch(FEED_URL, {
      headers: {
        'User-Agent': 'Escbase/1.0 (+https://www.escbase.xyz)',
        Accept: 'application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8',
      },
    });

    if (!response.ok) {
      throw new Error(`YouTube feed request failed: ${response.status}`);
    }

    const xml = await response.text();
    const videos = parseFeed(xml).slice(0, 12);

    return res.status(200).json({
      source: 'youtube-rss',
      updatedAt: new Date().toISOString(),
      videos,
    });
  } catch (error) {
    return res.status(200).json({
      source: 'fallback',
      updatedAt: new Date().toISOString(),
      videos: [],
      error: 'Không thể tải feed YouTube lúc này.',
      detail: error instanceof Error ? error.message : 'unknown_error',
    });
  }
}
