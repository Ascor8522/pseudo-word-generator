export function* pseudoWords(letters: Set<string>, maxWords = Infinity, excludedWords: Set<string> = new Set([])): Generator<string, void, unknown> {
	if([...letters].some(letter => !/^[a-z]$/.test(letter))) throw new Error("Invalid letter");

	// No q
	const excludedLetters = new Set("q");
	const allowedLetters = letters.difference(excludedLetters);


	const vowels = new Set("aeiou");
	const allowedVowels = allowedLetters.intersection(vowels);
	const allowedConsonants = allowedLetters.difference(vowels);


	// No x in the initial position
	const excludedInitialLetters = new Set("x");


	// No h in the final position
	// No j in the final position
	// No w in the final position
	// No y in the final position
	const excludedFinalLetters = new Set("hjwy");


	// No a before l
	// No c before e, i, or y
	// No k before a, o, or u
	// No w before a
	const excludedPatterns = new Set([
		"al",
		"ce", "ci", "cy",
		"ka", "ko", "ku",
		"wa",
	]);


	// No bad words or pseudo bad words (words that would be a bad word but spelled wrong)


	let wordsYielded = 0;

	// vowel-consonant words
	{
		const allowedInitialLetters = allowedVowels.difference(excludedInitialLetters);
		const allowedFinalLetters = allowedConsonants.difference(excludedFinalLetters);

		for(const letter1 of allowedInitialLetters) {
			for(const letter2 of allowedFinalLetters) {
				const word = letter1 + letter2;
				if([...excludedPatterns].some(pattern => word.includes(pattern))) continue;
				if(excludedWords.has(word)) continue;
				yield word;
				++wordsYielded;
				if(wordsYielded >= maxWords) return;
			}
		}
	}

	// consonant-vowel-consonant words
	{
		const allowedInitialLetters = allowedConsonants.difference(excludedInitialLetters);
		const allowedMiddleLetters = allowedVowels;
		const allowedFinalLetters = allowedConsonants.difference(excludedFinalLetters);

		for(const letter1 of allowedInitialLetters) {
			for(const letter2 of allowedMiddleLetters) {
				for(const letter3 of allowedFinalLetters) {
					const word = letter1 + letter2 + letter3;
					if([...excludedPatterns].some(pattern => word.includes(pattern))) continue;
					if(excludedWords.has(word)) continue;
					yield word;
					++wordsYielded;
					if(wordsYielded >= maxWords) return;
				}
			}
		}
	}
}

export function pick<T>(amount: number, gen: () => Generator<T, void, unknown>): T[] {
	const elements = [...gen()];
	if(!elements.length) return [];
	const additional = new Array(amount - elements.length).fill(null).map(_ => elements[Math.floor(Math.random() * elements.length)]);
	return elements.concat(additional);
}

export function ruleApplies(letters: Set<string>, excludedWords: Set<string>) {
	const noQ = false;

	const noInitialX = letters.has("x");

	const noFinalH = letters.has("h");
	const noFinalJ = letters.has("j");
	const noFinalW = letters.has("w");
	const noFinalY = letters.has("y");

	const noABeforeL = letters.has("a") && (letters.has("l"));
	const noCBeforeEIY = letters.has("c") && (letters.has("e") || letters.has("i") || letters.has("y"));
	const noKBeforeAOU = letters.has("k") && (letters.has("a") || letters.has("o") || letters.has("u"));
	const noWBeforeA = letters.has("w") && (letters.has("a"));

	const noBadWords = [...excludedWords].some(word => [...word].every(letter => letters.has(letter)));
	return {
		noQ,
		noInitialX,
		noFinalH,
		noFinalJ,
		noFinalW,
		noFinalY,
		noABeforeL,
		noCBeforeEIY,
		noKBeforeAOU,
		noWBeforeA,
		noBadWords,
	};
}

export type Rules = keyof ReturnType<typeof ruleApplies>;
