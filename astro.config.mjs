import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
	integrations: [
		react(),
		tailwind({ applyBaseStyles: false }),
		sitemap({
		i18n: {
			defaultLocale: 'en',
			locales: {
				en: 'en',
				zh: 'zh'
			}
		}
	})
	],
	output: 'static',
	site: 'https://easy-to-gif.pages.dev',
	i18n: {
		defaultLocale: 'en',
		locales: ['en', 'zh'],
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
