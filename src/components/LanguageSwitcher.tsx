import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface LanguageSwitcherProps {
	lang: "en" | "zh" | "ja";
}

const languages = [
	{value: "en", label: "English", flag: "🇺🇸"},
	{value: "zh", label: "中文", flag: "🇨🇳"},
	{value: "ja", label: "日本語", flag: "🇯🇵"},
];

export function LanguageSwitcher({lang}: LanguageSwitcherProps) {
	const handleLanguageChange = (value: string) => {
		// 根据选择的语言跳转到对应页面
		const paths = {
			en: "/",
			zh: "/zh/",
			ja: "/ja/",
		};

		window.location.href = paths[value as keyof typeof paths];
	};

	const currentLanguage = languages.find((l) => l.value === lang);

	return (
		<Select value={lang} onValueChange={handleLanguageChange}>
			<SelectTrigger className="w-[140px]">
				<SelectValue>
					<div className="flex items-center gap-2">
						<span>{currentLanguage?.flag}</span>
						<span>{currentLanguage?.label}</span>
					</div>
				</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{languages.map((language) => (
					<SelectItem key={language.value} value={language.value}>
						<div className="flex items-center gap-2">
							<span>{language.flag}</span>
							<span>{language.label}</span>
						</div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
