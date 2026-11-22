import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

const demoRelease = process.env.DEMO_RELEASE;
if (demoRelease && !/^[a-f0-9]{40}$/.test(demoRelease)) {
	throw new Error('DEMO_RELEASE must be a full Git commit SHA.');
}
const demoBase = '/easy2gif';

export default defineConfig({
	integrations: [
		react(),
		tailwind({ applyBaseStyles: false }),
		...(demoRelease
			? []
			: [sitemap({
				i18n: {
					defaultLocale: 'en',
					locales: { en: 'en', zh: 'zh', ja: 'ja' },
				},
			})]),
	],
	output: 'static',
	site: demoRelease ? 'https://demos.chankay.com' : 'https://easy2gif.chankay.com',
	base: demoRelease ? demoBase : '/',
	build: {
		assets: demoRelease ? 'assets' : '_astro',
		assetsPrefix: demoRelease ? `${demoBase}/_r/${demoRelease}` : undefined,
	},
	i18n: {
		defaultLocale: 'en',
		locales: ['en', 'zh', 'ja'],
		routing: {
			prefixDefaultLocale: false
		}
	},
	server: {
		headers: {
			'Cross-Origin-Opener-Policy': 'same-origin',
			'Cross-Origin-Embedder-Policy': 'require-corp',
		},
	},
	vite: {
		optimizeDeps: {
			exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
		},
	},
});
