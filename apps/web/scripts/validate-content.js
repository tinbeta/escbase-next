import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, '../public');
const SITE = 'https://news.escbase.xyz';
const STRICT = process.env.STRICT_CONTENT === '1';

const errors = [];
const warnings = [];

function addIssue(collection, type, message) {
  collection.push({ type, message });
}

function error(type, message) {
  addIssue(errors, type, message);
}

function warn(type, message) {
  addIssue(STRICT ? errors : warnings, type, message);
}

function toProjectPath(path) {
  return relative(resolve(__dirname, '../../..'), path);
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (err) {
    error('json_parse', `${toProjectPath(path)}: ${err.message}`);
    return null;
  }
}

function walkFiles(dir, predicate, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(path, predicate, acc);
    } else if (!predicate || predicate(path)) {
      acc.push(path);
    }
  }
  return acc;
}

function resolvePublicPath(urlPath) {
  if (!urlPath || !urlPath.startsWith('/')) return null;
  return join(publicDir, urlPath.replace(/^\/+/, ''));
}

function isValidDateString(value) {
  const raw = String(value || '').trim();
  if (!raw) return false;
  if (/^\d{4}$/.test(raw)) return !STRICT;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return !Number.isNaN(new Date(raw).getTime());
  if (/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{1,2}, \d{4}$/.test(raw)) {
    return !Number.isNaN(new Date(raw).getTime());
  }
  return false;
}

function validateBlogJson() {
  const blogJsonPath = join(publicDir, 'blog.json');
  const posts = readJson(blogJsonPath);
  if (!Array.isArray(posts)) {
    error('blog_json_shape', 'apps/web/public/blog.json must be a JSON array');
    return [];
  }

  const seenUrls = new Set();

  posts.forEach((post, index) => {
    const label = `blog.json[${index}]`;
    if (!post || typeof post !== 'object') {
      error('post_shape', `${label} must be an object`);
      return;
    }

    if (!post.url) {
      error('post_url_missing', `${label} is missing url`);
    } else {
      if (seenUrls.has(post.url)) error('post_url_duplicate', `${post.url}`);
      seenUrls.add(post.url);

      if (!post.url.startsWith('/blog/')) {
        error('post_url_prefix', `${post.url} must start with /blog/`);
      }
      if (!post.url.endsWith('/')) {
        error('post_url_trailing_slash', `${post.url} must end with /`);
      }

      const pagePath = join(publicDir, post.url.replace(/^\/+/, ''), 'index.html');
      if (!existsSync(pagePath)) {
        error('post_page_missing', `${post.url} -> missing ${toProjectPath(pagePath)}`);
      }
    }

    ['title', 'excerpt', 'date', 'tag', 'readTime'].forEach((field) => {
      if (!String(post[field] || '').trim()) {
        error('post_field_missing', `${label} ${post.url || ''} is missing ${field}`);
      }
    });

    if (post.date && !isValidDateString(post.date)) {
      warn('post_date_legacy', `${post.url || label} has non-standard date "${post.date}"`);
    }

    if (post.image) {
      if (!post.image.startsWith('/')) {
        warn('post_image_external', `${post.url || label} image is not a local public path: ${post.image}`);
      } else {
        const imagePath = resolvePublicPath(post.image);
        if (!imagePath || !existsSync(imagePath) || !statSync(imagePath).isFile()) {
          error('post_image_missing', `${post.url || label} -> missing ${post.image}`);
        }
      }
    }
  });

  return posts;
}

function validateDomainUsage() {
  const searchable = walkFiles(publicDir, (path) => {
    const ext = extname(path).toLowerCase();
    return ['.html', '.json', '.xml', '.js', '.txt'].includes(ext);
  });

  searchable.forEach((path) => {
    const content = readFileSync(path, 'utf8');
    if (/https?:\/\/escbase\.xyz\b/.test(content)) {
      error('old_domain', `${toProjectPath(path)} still references escbase.xyz`);
    }
  });
}

function validateBlogMeta(posts) {
  const postsByUrl = new Map(posts.map((post) => [post.url, post]));

  for (const [url, post] of postsByUrl.entries()) {
    const pagePath = join(publicDir, url.replace(/^\/+/, ''), 'index.html');
    if (!existsSync(pagePath)) continue;

    const html = readFileSync(pagePath, 'utf8');
    const ogUrl = html.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']/i)?.[1];

    if (!ogUrl) {
      warn('og_url_missing', `${toProjectPath(pagePath)} is missing og:url`);
      continue;
    }

    const expected = `${SITE}${post.url}`;
    if (ogUrl !== expected) {
      warn('og_url_mismatch', `${toProjectPath(pagePath)} has ${ogUrl}; expected ${expected}`);
    }

    const ogImage = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i)?.[1];
    if (ogImage?.endsWith('.svg')) {
      warn('og_image_svg', `${toProjectPath(pagePath)} og:image points to SVG`);
    }
  }
}

function validateGeneratedConfig() {
  const vercelPath = resolve(__dirname, '../vercel.json');
  const vercel = readJson(vercelPath);
  if (vercel?.trailingSlash === false) {
    warn('vercel_trailing_slash', 'apps/web/vercel.json sets trailingSlash:false while blog canonical URLs use trailing slash');
  }

  walkFiles(publicDir, (path) => path.endsWith('.DS_Store')).forEach((path) => {
    warn('ds_store', `${toProjectPath(path)} should not be published`);
  });
}

function printIssues(label, issues) {
  if (!issues.length) return;

  const grouped = new Map();
  issues.forEach((issue) => {
    if (!grouped.has(issue.type)) grouped.set(issue.type, []);
    grouped.get(issue.type).push(issue.message);
  });

  console.log(`\n${label}: ${issues.length}`);
  for (const [type, messages] of grouped.entries()) {
    console.log(`- ${type}: ${messages.length}`);
    messages.slice(0, 8).forEach((message) => console.log(`  ${message}`));
    if (messages.length > 8) console.log(`  ...and ${messages.length - 8} more`);
  }
}

const posts = validateBlogJson();
validateDomainUsage();
validateBlogMeta(posts);
validateGeneratedConfig();

printIssues('Warnings', warnings);
printIssues('Errors', errors);

if (errors.length) {
  console.error(`\nContent validation failed with ${errors.length} error(s).`);
  process.exit(1);
}

console.log(`Content validation passed: ${posts.length} posts checked.`);
