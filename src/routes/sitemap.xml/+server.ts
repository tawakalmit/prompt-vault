import type { RequestHandler } from './$types';
import type { Prompt } from '$lib/types/database';

const SITE_URL = 'https://prompt.tawakalmit.my.id';

export const GET: RequestHandler = async ({ locals: { supabase } }) => {
	const { data: prompts } = await supabase
		.from('prompts')
		.select('slug, updated_at, image_url')
		.order('created_at', { ascending: false });

	const urls = (prompts ?? []) as Pick<Prompt, 'slug' | 'updated_at' | 'image_url'>[];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${SITE_URL}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
${urls
	.map(
		(p) => `  <url>
    <loc>${SITE_URL}/prompt/${p.slug}</loc>
    <lastmod>${new Date(p.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${
			p.image_url
				? `
    <image:image>
      <image:loc>${escapeXml(p.image_url)}</image:loc>
    </image:image>`
				: ''
		}
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};

function escapeXml(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}
