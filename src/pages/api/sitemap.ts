import { supabase } from '@/integrations/supabase/client';

// Add helper functions
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

export async function GET() {
  const urls = [
    // Static pages
    { loc: 'https://www.blog420.site/', priority: '1.0', changefreq: 'daily' },
    { loc: 'https://www.blog420.site/about', priority: '0.8', changefreq: 'monthly' },
    { loc: 'https://www.blog420.site/contact', priority: '0.8', changefreq: 'monthly' },
    { loc: 'https://www.blog420.site/forum', priority: '0.9', changefreq: 'daily' },
  ];

  try {
    // Blog posts
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('slug, updated_at')
      .order('created_at', { ascending: false });

    if (postsError) throw postsError;

    posts?.forEach(post => {
      urls.push({
        loc: `https://www.blog420.site/post/${post.slug}`,
        lastmod: formatDate(post.updated_at),
        priority: '0.8',
        changefreq: 'daily',
      });
    });

    // Forum posts
    const { data: forumPosts, error: forumError } = await supabase
      .from('forum_posts')
      .select('id, updated_at')
      .order('created_at', { ascending: false });

    if (forumError) throw forumError;

    forumPosts?.forEach(post => {
      urls.push({
        loc: `https://www.blog420.site/forum/${post.id}`,
        lastmod: formatDate(post.updated_at),
        priority: '0.6',
        changefreq: 'weekly',
      });
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.map(url => `  <url>
    <loc>${escapeXml(url.loc)}</loc>${url.lastmod ? `
    <lastmod>${url.lastmod}</lastmod>` : ''}${url.changefreq ? `
    <changefreq>${url.changefreq}</changefreq>` : ''}${url.priority ? `
    <priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

    return new Response(xml.trim(), {
      headers: {
        'Content-Type': 'application/xml; charset=UTF-8',
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'max-age=0, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}
