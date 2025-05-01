import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/integrations/supabase/client';

const BASE_URL = 'https://blog420.site';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Fetch all blog posts (for /post/:slug)
  const { data: blogPosts, error: blogError } = await supabase
    .from('posts')
    .select('slug');

  // Fetch all forum posts (for /forum/post/:id)
  const { data: forumPosts, error: forumError } = await supabase
    .from('forum_posts')
    .select('id');

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static pages
  const staticPages = [
    '',
    'login',
    'signup',
    'profile',
    'forum',
    'admin',
    'admin/posts',
    'admin/users',
  ];
  staticPages.forEach(page => {
    sitemap += `\n      <url>\n        <loc>${BASE_URL}/${page}</loc>\n      </url>`;
  });

  // Blog posts
  if (blogPosts && !blogError) {
    blogPosts.forEach((post: { slug: string }) => {
      sitemap += `\n      <url>\n        <loc>${BASE_URL}/post/${post.slug}</loc>\n      </url>`;
    });
  }

  // Forum posts
  if (forumPosts && !forumError) {
    forumPosts.forEach((post: { id: string }) => {
      sitemap += `\n      <url>\n        <loc>${BASE_URL}/forum/post/${post.id}</loc>\n      </url>`;
    });
  }

  sitemap += `\n</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.status(200).send(sitemap);
}
