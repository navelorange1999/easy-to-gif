import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";
import pluginTs from "@typescript-eslint/eslint-plugin";
import parserTs from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
	pluginJs.configs.recommended,
	{
		ignores: ["dist/**/*"],
	},
	{
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			parser: parserTs,
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
				ecmaFeatures: {
					jsx: true,
				},
			},
			globals: {
				// Browser globals
				window: "readonly",
				document: "readonly",
				navigator: "readonly",
				console: "readonly",
				URL: "readonly",
				File: "readonly",
				Blob: "readonly",
				HTMLInputElement: "readonly",
				HTMLDivElement: "readonly",
				HTMLButtonElement: "readonly",
				HTMLTextAreaElement: "readonly",
				HTMLParagraphElement: "readonly",
				HTMLHeadingElement: "readonly",
				// React globals
				React: "readonly",
			},
		},
		plugins: {
			"@typescript-eslint": pluginTs,
			react: pluginReact,
			"react-hooks": pluginReactHooks,
			"react-refresh": pluginReactRefresh,
		},
		rules: {
			...pluginTs.configs.recommended.rules,
			...pluginReact.configs.recommended.rules,
			...pluginReactHooks.configs.recommended.rules,
			"react-refresh/only-export-components": "off",
			"@typescript-eslint/no-unused-vars": "warn",
			"@typescript-eslint/no-explicit-any": "warn",
			// Disable React import requirement for React 17+
			"react/react-in-jsx-scope": "off",
			"react/jsx-uses-react": "off",
		},
		settings: {
			react: {
				version: "detect",
			},
		},
	},
	{
		files: ["**/*.js"],
		languageOptions: {
			globals: {
				require: "readonly",
				__dirname: "readonly",
				module: "readonly",
				exports: "readonly",
			},
		},
	},
	eslintConfigPrettier,
];
