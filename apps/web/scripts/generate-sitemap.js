import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, '../public');

const posts = JSON.parse(readFileSync(resolve(publicDir, 'blog.json'), 'utf-8'));
const SITE = 'https://escbase.xyz';

const staticPages = [
  { loc: '/', priority: '1.0', changefreq: 'daily' },
  { loc: '/blog', priority: '0.9', changefreq: 'daily' },
  { loc: '/videos', priority: '0.7', changefreq: 'daily' },
];

function toISODate(dateStr) {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  } catch {}
  return new Date().toISOString().split('T')[0];
}

const urls = [
  ...staticPages.map(
    (p) =>
      `  <url>\n    <loc>${SITE}${p.loc}</loc>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`
  ),
  ...posts.map(
    (post) =>
      `  <url>\n    <loc>${SITE}${post.url}</loc>\n    <lastmod>${toISODate(post.date)}</lastmod>\n    <priority>0.8</priority>\n  </url>`
  ),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

writeFileSync(resolve(publicDir, 'sitemap.xml'), sitemap, 'utf-8');
console.log(`✓ sitemap.xml generated — ${posts.length} posts + ${staticPages.length} static pages`);
