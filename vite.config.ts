import {defineConfig, loadEnv} from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import {fileURLToPath} from "node:url";

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
	const env = loadEnv(mode, process.cwd(), "");

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
			// environment variables
			"import.meta.env.VITE_GITHUB_OWNER": JSON.stringify(
				env.VITE_GITHUB_OWNER
			),
		},
	};
});
