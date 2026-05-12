const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || 'UCj79nJeT8U_bWVC92LUR5lA';
const CHANNEL_HANDLE = process.env.YOUTUBE_CHANNEL_HANDLE || '@ESCBase';
const DEBUG_API_ERRORS = process.env.DEBUG_API_ERRORS === '1';

function decodeXml(value) {
  return String(value || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function textBetween(xml, tagName) {
  const match = xml.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i'));
  return decodeXml(match?.[1] || '').trim();
}

function getEntries(xml) {
  return [...xml.matchAll(/<entry[\s\S]*?<\/entry>/gi)].map((match) => match[0]);
}

function extractVideoId(entry) {
  const ytId = textBetween(entry, 'yt:videoId');
  if (ytId) return ytId;

  const link = entry.match(/<link[^>]+href=["']([^"']+)["']/i)?.[1] || '';
  try {
    const url = new URL(decodeXml(link));
    return url.searchParams.get('v') || '';
  } catch (_) {
    return '';
  }
}

function extractVideosFromRss(xml) {
  return getEntries(xml)
    .map((entry) => {
      const id = extractVideoId(entry);
      if (!id) return null;

      const title = textBetween(entry, 'title') || 'Video Escbase';
      const published = textBetween(entry, 'published') || textBetween(entry, 'updated');
      const mediaThumb = entry.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i)?.[1];

      return {
        id,
        title,
        url: `https://www.youtube.com/watch?v=${id}`,
        published: published ? new Date(published).toLocaleDateString('vi-VN') : '',
        thumb: decodeXml(mediaThumb || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`),
      };
    })
    .filter(Boolean);
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

function feedUrl() {
  return `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(CHANNEL_ID)}`;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=300');

  try {
    const response = await fetch(feedUrl(), {
      headers: {
        Accept: 'application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8',
      },
    });

    if (!response.ok) {
      throw new Error(`YouTube RSS request failed: ${response.status}`);
    }

    const xml = await response.text();
    const videos = extractVideosFromRss(xml).slice(0, 12);

    if (!videos.length) {
      throw new Error(`No videos found for ${CHANNEL_HANDLE}`);
    }

    return res.status(200).json({
      source: 'youtube-rss',
      updatedAt: new Date().toISOString(),
      videos,
    });
  } catch (error) {
    return res.status(200).json(publicError(error));
  }
}
