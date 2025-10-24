import {Github} from "lucide-react";
import {Button} from "@/components/ui/button";
import {LanguageSwitcher} from "@/components/LanguageSwitcher";
import {useTranslation} from "react-i18next";

export function Header() {
	const {t} = useTranslation();

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-16 max-w-screen-2xl items-center">
				<div className="mr-4 hidden md:flex">
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
							<span className="text-primary-foreground font-bold text-sm">
								G
							</span>
						</div>
						<span className="text-xl font-bold text-foreground">
							{t("app.title")}
						</span>
					</div>
				</div>

				<div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
					<div className="w-full flex-1 md:w-auto md:flex-none">
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center md:hidden">
								<span className="text-primary-foreground font-bold text-sm">
									G
								</span>
							</div>
							<span className="text-xl font-bold text-foreground md:hidden">
								{t("app.title")}
							</span>
						</div>
					</div>

					<nav className="flex items-center gap-2">
						<Button variant="ghost" size="sm" asChild>
							<a
								href={`https://github.com/${import.meta.env.VITE_GITHUB_OWNER}/easy-to-gif`}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2"
							>
								<Github className="h-4 w-4" />
								<span className="hidden sm:inline">
									{t("header.github")}
								</span>
							</a>
						</Button>
						<LanguageSwitcher />
					</nav>
				</div>
			</div>
		</header>
	);
}
