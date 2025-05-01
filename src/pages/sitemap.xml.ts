// pages/sitemap.xml.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/integrations/supabase/client';

function formatDate(date: string): string {
  return new Date(date).toISOString().split('T')[0];
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const baseUrl = 'https://www.blog420.site';
  const urls = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${baseUrl}/about`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/contact`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/forum`, priority: '0.9', changefreq: 'daily' },
  ];

  try {
    const { data: posts } = await supabase
      .from('posts')
      .select('slug, updated_at');

    posts?.forEach(post => {
      urls.push({
        loc: `${baseUrl}/post/${post.slug}`,
        lastmod: formatDate(post.updated_at),
        priority: '0.8',
        changefreq: 'daily',
      });
    });

    const { data: forumPosts } = await supabase
      .from('forum_posts')
      .select('id, updated_at');

    forumPosts?.forEach(post => {
      urls.push({
        loc: `${baseUrl}/forum/${post.id}`,
        lastmod: formatDate(post.updated_at),
        priority: '0.6',
        changefreq: 'weekly',
      });
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${escapeXml(url.loc)}</loc>${url.lastmod ? `
    <lastmod>${url.lastmod}</lastmod>` : ''}${url.changefreq ? `
    <changefreq>${url.changefreq}</changefreq>` : ''}${url.priority ? `
    <priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'max-age=0, s-maxage=3600');
    res.status(200).send(xml.trim());
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating sitemap');
  }
}
