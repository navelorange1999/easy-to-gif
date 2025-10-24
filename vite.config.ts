import {defineConfig, loadEnv} from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import {fileURLToPath} from "node:url";

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
	const env = loadEnv(mode, process.cwd(), "");

	// In Cloudflare Pages builds, environment variables are injected via process.env
	// We need to pass these variables to Vite's define configuration
	const githubOwner = env.VITE_GITHUB_OWNER || process.env.VITE_GITHUB_OWNER;

	return {
		plugins: [react()],
		resolve: {
			alias: {
				"@": path.resolve(
					path.dirname(fileURLToPath(import.meta.url)),
					"./src"
				),
			},
		},
		server: {
			port: 3000,
			headers: {
				"Cross-Origin-Embedder-Policy": "require-corp",
				"Cross-Origin-Opener-Policy": "same-origin",
			},
		},
		build: {
			outDir: "dist",
			sourcemap: false,
		},
		optimizeDeps: {
			exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
		},
		define: {
			global: "globalThis",
			// environment variables - prioritize Cloudflare Pages injected variables
			"import.meta.env.VITE_GITHUB_OWNER": JSON.stringify(githubOwner),
		},
	};
});
