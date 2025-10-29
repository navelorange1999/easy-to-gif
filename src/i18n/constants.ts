// Language configuration constants
export type LanguageCode = "en" | "zh" | "ja";

export interface LanguageConfig {
	code: LanguageCode;
	i18nCode: string;
	label: string;
	flag: string;
	path: string;
}

export const LANGUAGES: LanguageConfig[] = [
	{
		code: "en",
		i18nCode: "en-US",
		label: "English",
		flag: "🇺🇸",
		path: "/",
	},
	{
		code: "zh",
		i18nCode: "zh-CN",
		label: "中文",
		flag: "🇨🇳",
		path: "/zh/",
	},
	{
		code: "ja",
		i18nCode: "ja-JP",
		label: "日本語",
		flag: "🇯🇵",
		path: "/ja/",
	},
];

// Helper maps for easy lookup
export const LANGUAGE_MAP = LANGUAGES.reduce(
	(acc, lang) => {
		acc[lang.code] = lang;
		return acc;
	},
	{} as Record<LanguageCode, LanguageConfig>
);

export const CODE_TO_I18N_MAP = LANGUAGES.reduce(
	(acc, lang) => {
		acc[lang.code] = lang.i18nCode;
		return acc;
	},
	{} as Record<LanguageCode, string>
);

export const CODE_TO_PATH_MAP = LANGUAGES.reduce(
	(acc, lang) => {
		acc[lang.code] = lang.path;
		return acc;
	},
	{} as Record<LanguageCode, string>
);

export const DEFAULT_LANGUAGE: LanguageCode = "en";
