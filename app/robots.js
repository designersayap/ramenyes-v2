export const runtime = 'edge';
export const dynamic = 'force-static'; // ✅ Compatible with output: 'export'

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: '*',
        allow: '/_next/static/',
      },
    ],
    sitemap: 'https://berkah-umroh.sabunkrimekonomi.id/sitemap.xml',
  };
}