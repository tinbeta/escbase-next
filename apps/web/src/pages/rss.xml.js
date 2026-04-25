import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  const sortedPosts = posts
    .filter(p => !p.data.draft)
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
    .slice(0, 50);

  return rss({
    title: 'Escbase - Crypto Intelligence',
    description: 'Báo cáo thị trường Crypto hàng ngày, phân tích chuyên sâu về công nghệ Blockchain, và các xu hướng mới nhất trong Web3.',
    site: context.site,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      description: post.data.excerpt,
      link: `/blog/${post.slug}`,
      categories: [post.data.tag],
    })),
    customData: `<language>vi-VN</language>`,
  });
}
