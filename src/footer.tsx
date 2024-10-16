import type { JSX } from "preact/jsx-runtime";
import GithubLogo from "./assets/github.svg?react";

export default function Footer({ }: FooterProps) {
	return (
		<footer class=" grow-0 shrink-0 footer bg-neutral text-neutral-content items-center px-4 py-2">
			<div class="grid-flow-col items-center">
				<p class="text-current">Made by Ascor8522</p>
			</div>
			<nav class="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
				<a href="https://github.com/Ascor8522/pseudo-word-generator">
					<GithubLogo />
				</a>
			</nav>
		</footer>
	);
}

interface FooterProps extends JSX.HTMLAttributes<HTMLDivElement> {

}
