
export const BLOG_CATEGORIES = [
  { name: 'Technology', slug: 'technology' },
  { name: 'Lifestyle', slug: 'lifestyle' },
  { name: 'Business', slug: 'business' },
  { name: 'Travel', slug: 'travel' },
  { name: 'Health & Wellness', slug: 'health' },
  { name: 'Education', slug: 'education' },
  { name: 'Entertainment', slug: 'entertainment' },
  { name: 'Food', slug: 'food' },
  { name: 'Personal Development', slug: 'personal-development' },
  { name: 'Sports', slug: 'sports' },
  { name: 'News', slug: 'news' },
  { name: 'Politics', slug: 'politics' }
] as const;

export type BlogCategory = typeof BLOG_CATEGORIES[number]['slug'];
