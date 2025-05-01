import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const WEBSITE_URL = 'https://www.blog420.site';

type SitemapURL = {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
};

const generateSitemapXML = (urls: SitemapURL[]) => {
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls.map(url => `
        <url>
          <loc>${url.loc}</loc>
          ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
          ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
          ${url.priority ? `<priority>${url.priority}</priority>` : ''}
        </url>
      `).join('')}
    </urlset>`;

  return xmlContent;
};

const Sitemap = () => {
  useEffect(() => {
    const generateSitemap = async () => {
      const urls: SitemapURL[] = [
        // Static pages
        { loc: `${WEBSITE_URL}/`, priority: '1.0', changefreq: 'daily' },
        { loc: `${WEBSITE_URL}/about`, priority: '0.8', changefreq: 'monthly' },
        { loc: `${WEBSITE_URL}/contact`, priority: '0.8', changefreq: 'monthly' },
        { loc: `${WEBSITE_URL}/forum`, priority: '0.9', changefreq: 'daily' },
      ];

      try {
        // Fetch all blog posts
        const { data: posts } = await supabase
          .from('posts')
          .select('slug, updated_at')
          .order('created_at', { ascending: false });

        if (posts) {
          posts.forEach(post => {
            urls.push({
              loc: `${WEBSITE_URL}/post/${post.slug}`,
              lastmod: post.updated_at,
              priority: '0.7',
              changefreq: 'weekly'
            });
          });
        }

        // Fetch all forum posts
        const { data: forumPosts } = await supabase
          .from('forum_posts')
          .select('id, updated_at')
          .order('created_at', { ascending: false });

        if (forumPosts) {
          forumPosts.forEach(post => {
            urls.push({
              loc: `${WEBSITE_URL}/forum/${post.id}`,
              lastmod: post.updated_at,
              priority: '0.6',
              changefreq: 'weekly'
            });
          });
        }

        // Generate XML
        const xml = generateSitemapXML(urls);

        // Set the content type and send the response
        const blob = new Blob([xml], { type: 'text/xml' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sitemap.xml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

      } catch (error) {
        console.error('Error generating sitemap:', error);
      }
    };

    generateSitemap();
  }, []);

  return null;
};

export default Sitemap;
