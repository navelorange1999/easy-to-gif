import React, {useState, useEffect} from "react";
import {Moon, Sun} from "lucide-react";

export const ThemeToggle: React.FC = () => {
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		// Check if dark mode is already set
		const isDarkMode = document.documentElement.classList.contains("dark");
		setIsDark(isDarkMode);
	}, []);

	const toggleTheme = () => {
		const newIsDark = !isDark;
		setIsDark(newIsDark);

		if (newIsDark) {
			document.documentElement.classList.add("dark");
			window.localStorage.setItem("theme", "dark");
		} else {
			document.documentElement.classList.remove("dark");
			window.localStorage.setItem("theme", "light");
		}
	};

	useEffect(() => {
		// Check for saved theme preference or default to light mode
		const savedTheme = window.localStorage.getItem("theme");
		const prefersDark = window.matchMedia(
			"(prefers-color-scheme: dark)"
		).matches;

		if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
			document.documentElement.classList.add("dark");
			setIsDark(true);
		} else {
			document.documentElement.classList.remove("dark");
			setIsDark(false);
		}
	}, []);

	return (
		<button
			onClick={toggleTheme}
			className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
			aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
		>
			<div className="flex items-center gap-2">
				{isDark ? (
					<Sun className="h-4 w-4" />
				) : (
					<Moon className="h-4 w-4" />
				)}
				<span className="hidden sm:inline">
					{isDark ? "Light" : "Dark"}
				</span>
			</div>
		</button>
	);
};
