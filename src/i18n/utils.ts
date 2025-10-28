import translationsEN from "./locales/en-US.json";
import translationsZH from "./locales/zh-CN.json";

export const languages = {
	en: "English",
	zh: "中文",
};

export const defaultLang = "en";

export function getLangFromUrl(url: URL) {
	const [, lang] = url.pathname.split("/");
	if (lang in languages) return lang as keyof typeof languages;
	return defaultLang;
}

export const translations = {
	en: translationsEN,
	zh: translationsZH,
} as const;

export function useTranslations(lang: keyof typeof translations) {
	return function t(key: string) {
		const keys = key.split(".");
		let value: Record<string, unknown> = translations[lang];
		for (const k of keys) {
			if (value && typeof value === "object" && k in value) {
				value = value[k] as Record<string, unknown>;
			} else {
				// Fallback to default language
				value = translations[defaultLang];
				for (const k2 of keys) {
					if (value && typeof value === "object" && k2 in value) {
						value = value[k2] as Record<string, unknown>;
					}
				}
				break;
			}
		}

		return value || key;
	};
}
