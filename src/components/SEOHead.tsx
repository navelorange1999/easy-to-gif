import {useEffect} from "react";
import {useTranslation} from "react-i18next";

export function SEOHead() {
	const {t, i18n} = useTranslation();

	useEffect(() => {
		// 更新页面标题
		document.title = `${t("app.title")} - ${t("app.description")}`;

		// 更新页面语言
		document.documentElement.lang = i18n.language;

		// 更新meta描述
		const metaDescription = document.querySelector(
			'meta[name="description"]'
		);
		if (metaDescription) {
			metaDescription.setAttribute("content", t("app.description"));
		}

		// 更新keywords
		const keywords =
			i18n.language === "zh-CN"
				? "视频转GIF,在线转换,免费工具,视频处理,FFmpeg"
				: "video to gif,online converter,free tool,video processing,FFmpeg";
		const metaKeywords = document.querySelector('meta[name="keywords"]');
		if (metaKeywords) {
			metaKeywords.setAttribute("content", keywords);
		}

		// 更新Open Graph标签
		const ogTitle = document.querySelector('meta[property="og:title"]');
		if (ogTitle) {
			ogTitle.setAttribute(
				"content",
				`${t("app.title")} - ${t("app.description")}`
			);
		}

		const ogDescription = document.querySelector(
			'meta[property="og:description"]'
		);
		if (ogDescription) {
			ogDescription.setAttribute("content", t("app.description"));
		}

		// 更新Twitter Card
		const twitterTitle = document.querySelector(
			'meta[name="twitter:title"]'
		);
		if (twitterTitle) {
			twitterTitle.setAttribute(
				"content",
				`${t("app.title")} - ${t("app.description")}`
			);
		}

		const twitterDescription = document.querySelector(
			'meta[name="twitter:description"]'
		);
		if (twitterDescription) {
			twitterDescription.setAttribute("content", t("app.description"));
		}
	}, [t, i18n.language]);

	return null;
}
