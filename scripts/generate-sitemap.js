import fs from 'fs';
import path from 'path';

const domain = 'https://vantasolutions.tech';
const routes = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/servicios/crm', priority: '0.8', changefreq: 'weekly' },
  { url: '/servicios/crm/8943712', priority: '0.7', changefreq: 'monthly' },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(r => `  <url>
    <loc>${domain}${r.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

const outputPath = path.resolve('public', 'sitemap.xml');
fs.writeFileSync(outputPath, sitemap);
console.log(`✅ Sitemap created successfully at: ${outputPath}`);
