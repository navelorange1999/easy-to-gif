import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {LANGUAGES, type LanguageCode} from "@/i18n/constants";

interface LanguageSwitcherProps {
	lang: LanguageCode;
}

export function LanguageSwitcher({lang}: LanguageSwitcherProps) {
	const handleLanguageChange = (value: string) => {
		const language = LANGUAGES.find(({code}) => code === value);
		if (language) window.location.assign(language.path);
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
