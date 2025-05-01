import { supabase } from '@/integrations/supabase/client';

export async function GET() {
  const urls = [
    // Static pages
    { loc: 'https://www.blog420.site/', priority: '1.0', changefreq: 'daily' },
    { loc: 'https://www.blog420.site/about', priority: '0.8', changefreq: 'monthly' },
    { loc: 'https://www.blog420.site/contact', priority: '0.8', changefreq: 'monthly' },
    { loc: 'https://www.blog420.site/forum', priority: '0.9', changefreq: 'daily' },
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
          loc: `https://www.blog420.site/post/${post.slug}`,
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
          loc: `https://www.blog420.site/forum/${post.id}`,
          lastmod: post.updated_at,
          priority: '0.6',
          changefreq: 'weekly'
        });
      });
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
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

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'max-age=0, s-maxage=3600'
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}
