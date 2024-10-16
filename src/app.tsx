import { useState } from "preact/hooks";
import Footer from "./footer.tsx";
import { pick, pseudoWords, ruleApplies, type Rules } from "./word-gen.ts";

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

	const appliedRules = ruleApplies(new Set(letters), excludedWords);
	const activeRulesCount = Object.values(appliedRules).filter(Boolean).length;

	return (
		<div class="prose max-w-full w-screen h-screen p-8 flex flex-col gap-8">
			<h1 class="grow-0 shrink-0 m-0 ">Pseudo Word Generator</h1>

			<div class="grow-0 shrink-0 relative h-16">
				<details
					class="absolute top-0 left-0 shrink collapse collapse-plus bg-base-200"
					style={{ width: "calc(50% - 1rem)" }}>
					<summary class="collapse-title">
						<h2 class="m-0">Inputs</h2>
					</summary>
					<div class="collapse-content">
						<div class="grid grid-cols-3 gap-4 items-center">
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
								onInput={e => setWordCount(Math.min(0, e.currentTarget.valueAsNumber || 0))}
							/>
							<label class="flex">
								<input
									type="checkbox"
									class="checkbox checkbox-primary"
									checked={repeat}
									onInput={e => setRepeat(e.currentTarget.checked)}
								/>
								&nbsp;
								Repeat words
							</label>
							<textarea
								class="textarea textarea-bordered w-full col-span-3"
								placeholder="Excluded words (separated by non-letter)"
								value={excludedWordsInput}
								onInput={e => setExcludedWordsInput(e.currentTarget.value)}
							/>
						</div>
					</div>
				</details>

				<details
					class="absolute top-0 right-0 shrink collapse collapse-plus bg-base-200"
					style={{ width: "calc(50% - 1rem)" }}>
					<summary class="collapse-title">
						<h2 class="m-0">Rules</h2>
					</summary>
					<div class="collapse-content">
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
						<p>
							<i>Vowel-Consonant + Consonant-Vowel-Consonant</i>
						</p>
					</div>
				</details>
			</div>

			<div class="grow shrink-0 flex flex-col gap-2">
				<h2 class="grow-0 shrink-0 mt-0">Words</h2>
				<p class="grow-0 shrink-0">
					<b>
						{!words.length && "No words found"}
						{!!words.length && <>{words.length} words generated</>}
					</b>
				</p>
				{<ul class="grow shrink-0 columns-5">
					{words.map((word, i) => <>
						<li
							key={word + i + words.length}
							class="text-2xl">{word}</li>
					</>)}
				</ul>}
			</div>

			<Footer />
		</div>
	);
}
