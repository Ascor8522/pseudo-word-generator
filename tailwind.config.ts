import typography from "@tailwindcss/typography";
import daisyui from "daisyui";
import type { Config } from "tailwindcss";

export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {},
	},
	plugins: [
		typography,
		daisyui
	],
} satisfies Config;
