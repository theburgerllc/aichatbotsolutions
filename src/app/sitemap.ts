
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const host = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const now = new Date();
  return [
    { url: `${host}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${host}/pricing`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${host}/demo`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${host}/book`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${host}/thank-you`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];
}
