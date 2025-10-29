import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {LANGUAGES, CODE_TO_PATH_MAP, LanguageCode} from "@/i18n/constants";

interface LanguageSwitcherProps {
	lang: LanguageCode;
}

export function LanguageSwitcher({lang}: LanguageSwitcherProps) {
	const handleLanguageChange = (value: string) => {
		// Redirect to the corresponding page based on the selected language
		const path = CODE_TO_PATH_MAP[value as LanguageCode];
		window.location.href = path;
	};

	const currentLanguage = LANGUAGES.find((l) => l.code === lang);

	return (
		<Select value={lang} onValueChange={handleLanguageChange}>
			<SelectTrigger className="sm:w-[120px] w-[60px]">
				<SelectValue>
					<div className="flex items-center gap-2">
						<span>{currentLanguage?.flag}</span>
						<span className="hidden sm:inline">
							{currentLanguage?.label}
						</span>
					</div>
				</SelectValue>
			</SelectTrigger>

			<SelectContent>
				{LANGUAGES.map((language) => (
					<SelectItem key={language.code} value={language.code}>
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
