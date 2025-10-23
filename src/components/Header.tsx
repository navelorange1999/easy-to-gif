import {Github, Heart} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";

export function Header() {
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
							Easy to GIF
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
								Easy to GIF
							</span>
						</div>
					</div>

					<nav className="flex items-center gap-2">
						<Button variant="ghost" size="sm" asChild>
							<a
								href="https://github.com/your-username/easy-to-gif"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2"
							>
								<Github className="h-4 w-4" />
								<span className="hidden sm:inline">GitHub</span>
							</a>
						</Button>
						<Separator orientation="vertical" className="h-6" />
						<div className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground">
							<span>Made with</span>
							<Heart className="h-4 w-4 text-destructive" />
							<span>for creators</span>
						</div>
					</nav>
				</div>
			</div>
		</header>
	);
}
