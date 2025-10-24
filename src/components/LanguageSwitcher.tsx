import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button";
import {Globe} from "lucide-react";

export function LanguageSwitcher() {
	const {i18n} = useTranslation();

	const toggleLanguage = () => {
		const newLang = i18n.language === "zh-CN" ? "en-US" : "zh-CN";
		i18n.changeLanguage(newLang);
	};

	const getCurrentLanguage = () => {
		return i18n.language === "zh-CN" ? "中文" : "English";
	};

	return (
		<Button
			variant="ghost"
			size="sm"
			onClick={toggleLanguage}
			className="flex items-center gap-2"
		>
			<Globe className="h-4 w-4" />
			<span className="hidden sm:inline">{getCurrentLanguage()}</span>
		</Button>
	);
}
