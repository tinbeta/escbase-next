import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, '../public');

const posts = JSON.parse(readFileSync(resolve(publicDir, 'blog.json'), 'utf-8'));
const SITE = 'https://escbase.xyz';
const FEED_TITLE = 'Escbase — Phân Tích Crypto & Blockchain Hằng Ngày';
const FEED_DESC = 'Báo cáo thị trường Crypto hàng ngày, phân tích Blockchain, AI và những chuyển động đáng chú ý.';

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRFC822(dateStr) {
  if (!dateStr) return new Date().toUTCString();
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d.toUTCString();
  } catch {}
  return new Date().toUTCString();
}

function mimeFromExt(path) {
  if (path.endsWith('.svg')) return 'image/svg+xml';
  if (path.endsWith('.webp')) return 'image/webp';
  if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg';
  return 'image/png';
}

const items = posts.slice(0, 50).map((post) => {
  const imageTag = post.image
    ? `\n      <enclosure url="${escapeXml(`${SITE}${post.image}`)}" type="${mimeFromExt(post.image)}" length="0" />`
    : '';
  return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(`${SITE}${post.url}`)}</link>
      <guid isPermaLink="true">${escapeXml(`${SITE}${post.url}`)}</guid>
      <pubDate>${toRFC822(post.date)}</pubDate>
      <description>${escapeXml(post.excerpt || '')}</description>
      <category>${escapeXml(post.tag || '')}</category>${imageTag}
    </item>`;
});

const lastBuildDate = posts.length ? toRFC822(posts[0].date) : new Date().toUTCString();

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${SITE}</link>
    <description>${escapeXml(FEED_DESC)}</description>
    <language>vi</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />
${items.join('\n')}
  </channel>
</rss>
`;

writeFileSync(resolve(publicDir, 'feed.xml'), feed, 'utf-8');
console.log(`✓ feed.xml generated — ${items.length} items`);
