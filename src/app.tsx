import { useState } from "preact/hooks";
import GithubLogo from "./assets/github.svg?react";
import { pick, pseudoWords, ruleApplies, type Rules } from "./word-gen.ts";

export function App() {
	const [letterInput, setLetterInput] = useState("f, a, m, h, t");
	const [wordCount, setWordCount] = useState(20);
	const [repeat, setRepeat] = useState(true);
	const [excludedWordsInput, setExcludedWordsInput] = useState("");

	const letters = letterInput.toLowerCase().replaceAll(/[^a-z]/g, "") || undefined;
	const excludedWords = new Set(excludedWordsInput.toLowerCase().split(/[^a-z]+/).filter(Boolean));
	const words = repeat
		? pick(wordCount, () => pseudoWords(new Set(letters), wordCount, excludedWords))
		: [...pseudoWords(new Set(letters), wordCount, excludedWords)];

	const rules: Record<Rules, string> = {
		noQ: "No 'q'",
		noInitialX: "No 'x' in the initial position",
		noFinalH: "No 'h' in the final position",
		noFinalJ: "No 'j' in the final position",
		noFinalW: "No 'w' in the final position",
		noFinalY: "No 'y' in the final position",
		noABeforeL: "No 'a' before 'l'",
		noCBeforeEIY: "No 'c' before 'e', 'i', or 'y'",
		noKBeforeAOU: "No 'k' before 'a', 'o', or 'u'",
		noWBeforeA: "No 'w' before 'a'",
		noBadWords: "No bad words*",
	};
	const appliedRules = ruleApplies(new Set(letters), excludedWords);
	const activeRulesCount = Object.values(appliedRules).filter(Boolean).length;

	return (
		<div class="prose flex flex-col gap-4 w-full max-w-full p-8">
			<h1 class="mb-0">Pseudo Word Generator</h1>
			<h2>Inputs</h2>
			<div class="flex flex-row gap-4 items-center">
				<input
					type="text"
					class="input input-bordered w-full max-w-xs"
					placeholder="Letters"
					value={letterInput}
					onInput={e => setLetterInput(e.currentTarget.value)}
				/>
				<input
					type="number"
					class="input input-bordered w-full max-w-xs"
					placeholder="Word count"
					value={wordCount}
					min={1}
					onInput={e => setWordCount(e.currentTarget.valueAsNumber)}
				/>
				<label>
					<input
						type="checkbox"
						class="checkbox checkbox-primary"
						checked={repeat}
						onInput={e => setRepeat(e.currentTarget.checked)}
					/>
					&nbsp;
					Repeat words
				</label>
			</div>
			<textarea
				class="textarea textarea-bordered w-full"
				placeholder="Excluded words (separated by non-letter)"
				value={excludedWordsInput}
				onInput={e => setExcludedWordsInput(e.currentTarget.value)}
			/>
			<div class="flex flex-row">
				<div class="basis-1/2">
					<h2>Words</h2>
					<p>
						<i>Vowel-Consonant + Consonant-Vowel-Consonant</i>
					</p>
					<p>
						<b>
							{!words.length && "No words found"}
							{words.length && <>{words.length} words found</>}
						</b>
					</p>
					<ul class="overflow-y-auto max-h-screen">
						{words.map((word, i) => <li key={word + i + words.length}>{word}</li>)}
					</ul>
				</div>
				<div>
					<h2>Rules</h2>
					<p>
						<b>
							{activeRulesCount === 0 && "No active rules"}
							{activeRulesCount === 1 && "1 active rule"}
							{activeRulesCount > 1 && <>{activeRulesCount} active rules</>}
						</b>
					</p>
					<ul>
						{Object
							.entries(appliedRules)
							.map(([ruleApplies, applies]) => <>
								<li class={applies ? "font-bold" : "font-light"}>
									{rules[ruleApplies as Rules]}
								</li>
							</>)
						}
					</ul>
				</div>
			</div>
			<footer class="footer bg-neutral text-neutral-content items-center p-4">
				<aside class="grid-flow-col items-center">
					<p>Made by Ascor8522</p>
				</aside>
				<nav class="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
					<a href="https://github.com/Ascor8522/pseudo-word-generator">
						<GithubLogo />
					</a>
				</nav>
			</footer>
		</div>
	);
}
