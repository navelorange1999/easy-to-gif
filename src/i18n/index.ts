import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// load locales
import zhCN from "./locales/zh-CN.json";
import enUS from "./locales/en-US.json";

const resources = {
	"zh-CN": {
		translation: zhCN,
	},
	"en-US": {
		translation: enUS,
	},
};

i18n.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng: "zh-CN",
		debug: import.meta.env.DEV,

		detection: {
			order: ["localStorage", "navigator", "htmlTag"],
			caches: ["localStorage"],
		},

		interpolation: {
			escapeValue: false,
		},
	});

export default i18n;
