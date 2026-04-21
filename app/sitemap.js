export default function sitemap() {
  return [
    { url: 'https://corecafe.in',       lastModified: new Date(), changeFrequency: 'weekly',  priority: 1 },
    { url: 'https://corecafe.in/menu',  lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: 'https://corecafe.in/login', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://corecafe.in/order', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];
}
