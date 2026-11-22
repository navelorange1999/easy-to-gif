function token(name) {
	return ({opacityValue}) =>
		opacityValue === undefined
			? `var(--${name})`
			: `color-mix(in srgb, var(--${name}) calc(${opacityValue} * 100%), transparent)`;
}

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				border: token("border"),
				input: token("input"),
				ring: token("ring"),
				background: token("background"),
				foreground: token("foreground"),
				primary: {
					DEFAULT: token("primary"),
					foreground: token("primary-foreground"),
				},
				secondary: {
					DEFAULT: token("secondary"),
					foreground: token("secondary-foreground"),
				},
				destructive: {
					DEFAULT: token("destructive"),
					foreground: token("destructive-foreground"),
				},
				muted: {
					DEFAULT: token("muted"),
					foreground: token("muted-foreground"),
				},
				accent: {
					DEFAULT: token("accent"),
					foreground: token("accent-foreground"),
				},
				popover: {
					DEFAULT: token("popover"),
					foreground: token("popover-foreground"),
				},
				card: {
					DEFAULT: token("card"),
					foreground: token("card-foreground"),
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: {height: "0"},
					to: {height: "var(--radix-accordion-content-height)"},
				},
				"accordion-up": {
					from: {height: "var(--radix-accordion-content-height)"},
					to: {height: "0"},
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};
