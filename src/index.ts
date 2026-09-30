import { toBigrams } from "./tokenize";

/** A candidate string paired with its similarity to the target. */
export interface Match {
  /** The candidate string. */
  _text: string;
  /** Similarity to the target, from `0` (nothing in common) to `1` (identical). */
  similarity: number;
}

function assertString(value: unknown, name: string, fn: string): asserts value is string {
  if (typeof value !== "string") {
    throw new TypeError(`${fn}: ${name} must be a string, got ${typeof value}`);
  }
}

function assertStringArray(value: unknown, name: string, fn: string): asserts value is string[] {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    throw new TypeError(`${fn}: ${name} must be an array of strings`);
  }
}

/** Sørensen–Dice coefficient over the (case-insensitive) phoneme bigrams of two strings. */
function dice(a: string, b: string): number {
  const left = toBigrams(a.toLowerCase());
  const right: (string | null)[] = toBigrams(b.toLowerCase());
  const total = left.length + right.length;
  let intersections = 0;

  for (const bigram of left) {
    const index = right.indexOf(bigram);
    if (index !== -1) {
      intersections++;
      right[index] = null; // each bigram can only be matched once
    }
  }

  return (2 * intersections) / total;
}

/**
 * Returns how similar two strings are, from `0` to `1`.
 *
 * Hangul syllables are decomposed into jamo (초성·중성·종성) before comparing,
 * so typos inside a syllable ("안녕하세요" vs "안뇽하세여") still score
 * high. Comparison is case-insensitive.
 *
 * @param target - The first string.
 * @param compared - The second string.
 * @returns A number between `0` (nothing in common) and `1` (identical).
 * @throws {TypeError} If either argument is not a string.
 *
 * @example
 * compareTwoStrings("각난닫", "각난닫"); // => 1
 * compareTwoStrings("각난닫", "톹풒흏"); // => 0
 */
export function compareTwoStrings(target: string, compared: string): number {
  assertString(target, "target", "compareTwoStrings");
  assertString(compared, "compared", "compareTwoStrings");
  return dice(target, compared);
}

/**
 * Scores every candidate against `target` and sorts them, most similar first.
 * Candidates with equal scores keep their original order.
 *
 * @param target - The string to compare against.
 * @param candidates - The strings to rank.
 * @returns A new array of {@link Match} objects in descending order of similarity.
 * @throws {TypeError} If `target` is not a string or `candidates` is not an array of strings.
 *
 * @example
 * arrangeBySimilarity("사과", ["바나나", "사과", "사자"]);
 * // => [{ _text: "사과", similarity: 1 },
 * //     { _text: "사자", similarity: 0.5 },
 * //     { _text: "바나나", similarity: 0.26666666666666666 }]
 */
export function arrangeBySimilarity(target: string, candidates: readonly string[]): Match[] {
  assertString(target, "target", "arrangeBySimilarity");
  assertStringArray(candidates, "candidates", "arrangeBySimilarity");
  return candidates
    .map((text) => ({ _text: text, similarity: dice(target, text) }))
    .sort((a, b) => b.similarity - a.similarity);
}

/**
 * Finds the candidate most similar to `target`.
 * If several candidates tie, the first one in `candidates` wins.
 *
 * @param target - The string to compare against.
 * @param candidates - The strings to search.
 * @returns The best {@link Match}, or `undefined` if `candidates` is empty.
 * @throws {TypeError} If `target` is not a string or `candidates` is not an array of strings.
 *
 * @example
 * findBestMatch("사과", ["바나나", "사과", "사자"]);
 * // => { _text: "사과", similarity: 1 }
 */
export function findBestMatch(target: string, candidates: readonly string[]): Match | undefined {
  assertString(target, "target", "findBestMatch");
  assertStringArray(candidates, "candidates", "findBestMatch");
  return arrangeBySimilarity(target, candidates)[0];
}
