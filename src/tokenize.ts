/** Initial consonants (초성), indexed by their position in the Unicode Hangul syllable block. */
const CHOSEONG = [
  "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ",
  "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
];

/** Medial vowels (중성). */
const JUNGSEONG = [
  "ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ",
  "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ",
];

/** Final consonants (종성). Index 0 means the syllable has no final consonant. */
const JONGSEONG = [
  "", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ",
  "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ",
  "ㅍ", "ㅎ",
];

const HANGUL_FIRST = 0xac00; // 가
const HANGUL_LAST = 0xd7a3; // 힣

/**
 * Placeholder for an empty jamo slot (a syllable without a final consonant).
 * It is longer than one character, so it can never be confused with real input.
 */
const EMPTY = "empt";

/**
 * Marker appended to the last token when forming bigrams, so that the final
 * token (and single-token strings) still contribute a bigram.
 */
const END = "undefined";

/**
 * Splits a precomposed Hangul syllable into its three jamo.
 *
 * @example decomposeSyllable(0xac01) // "각" => ["ㄱ", "ㅏ", "ㄱ"]
 */
function decomposeSyllable(code: number): [string, string, string] {
  const offset = code - HANGUL_FIRST;
  const jong = offset % 28;
  const jung = Math.floor(offset / 28) % 21;
  const cho = Math.floor(offset / 28 / 21);
  return [CHOSEONG[cho], JUNGSEONG[jung], JONGSEONG[jong] || EMPTY];
}

/**
 * Breaks a string into phoneme-level tokens: every Hangul syllable becomes
 * three jamo tokens (initial, medial, final); every other UTF-16 code unit is
 * kept as-is.
 *
 * @example toPhonemes("각a") // => ["ㄱ", "ㅏ", "ㄱ", "a"]
 */
export function toPhonemes(str: string): string[] {
  const tokens: string[] = [];
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code >= HANGUL_FIRST && code <= HANGUL_LAST) {
      tokens.push(...decomposeSyllable(code));
    } else {
      tokens.push(str[i]);
    }
  }
  return tokens;
}

/**
 * Builds the phoneme bigrams used by the Dice coefficient. The last token is
 * paired with an end marker, and an empty string yields a single
 * empty-marker bigram, so every input produces at least one bigram.
 *
 * @example toBigrams("가") // => ["ㄱㅏ", "ㅏempt", "emptundefined"]
 */
export function toBigrams(str: string): string[] {
  const tokens = toPhonemes(str);
  if (tokens.length === 0) return [EMPTY + END];
  return tokens.map((token, i) => token + (tokens[i + 1] ?? END));
}
