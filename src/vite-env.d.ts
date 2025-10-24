/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_GITHUB_OWNER: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
