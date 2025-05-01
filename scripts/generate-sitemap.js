import fs from 'fs';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://dlgxxyndsvrniilnfrod.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsZ3h4eW5kc3ZybmlpbG5mcm9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MDc4OTEsImV4cCI6MjA2MDE4Mzg5MX0.1B5Ua-R8ADtCBOmnlGSaB1wahl1UaHbaYYxipva4mE4";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const baseUrl = 'https://blog420.site';

const staticRoutes = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/post', changefreq: 'weekly', priority: 0.9 },
  { url: '/about', changefreq: 'monthly', priority: 0.7 },
  { url: '/contact', changefreq: 'monthly', priority: 0.6 },
];

async function generateSitemap() {
  try {
    // Fetch blog post slugs
    const { data: posts, error } = await supabase
      .from('posts')
      .select('slug, updated_at');

    if (error) throw error;

    const blogRoutes = posts.map(post => ({
      url: `/post/${post.slug}`,
      lastmod: post.updated_at,
      changefreq: 'weekly',
      priority: 0.7,
    }));

    const allRoutes = [...staticRoutes, ...blogRoutes];

    const stream = new SitemapStream({ hostname: baseUrl });
    const xml = await streamToPromise(Readable.from(allRoutes).pipe(stream)).then(d => d.toString());

    if (!fs.existsSync('public')) fs.mkdirSync('public', { recursive: true });
    fs.writeFileSync('public/sitemap.xml', xml);

    console.log(`✅ Sitemap generated with ${allRoutes.length} routes.`);
  } catch (err) {
    console.error('❌ Error generating sitemap:', err.message);
    process.exit(1);
  }
}

generateSitemap();
