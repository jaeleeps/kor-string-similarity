# kor-string-similarity

Korean-aware string similarity for JavaScript and TypeScript.

It scores how alike two strings are, from `0` to `1`, using the [Sørensen–Dice coefficient][dice]. Most Dice libraries compare whole characters. This one first splits each Hangul syllable into its jamo (초성·중성·종성), so strings that differ only inside a syllable still score as close:

| a            | b            | score  |
| ------------ | ------------ | ------ |
| `안녕하세요` | `안녕하세요` | `1`    |
| `안녕하세요` | `안뇽하세여` | `0.73` |
| `사과`       | `사자`       | `0.5`  |
| `각난닫`     | `톹풒흏`     | `0`    |

Other characters (Latin letters, digits, symbols, spaces) are compared as they are, and comparison ignores case, so Korean, English and mixed text all work.

## Install

```bash
npm install kor-string-similarity
```

Requires Node.js 18 or newer. TypeScript types are included.

## Usage

```ts
import { compareTwoStrings, findBestMatch, arrangeBySimilarity } from "kor-string-similarity";
// or: const { compareTwoStrings } = require("kor-string-similarity");

compareTwoStrings("다람쥐 헌 쳇바퀴에 타고파", "고양이 새 쳇바퀴에 안 타고파");
// => 0.6578947368421053

findBestMatch("다람쥐 헌 쳇바퀴에 타고파", [
  "고양이 새 쳇바퀴에 안 타고파",
  "다람쥐 헌 쳇바퀴에 타고파",
]);
// => { _text: "다람쥐 헌 쳇바퀴에 타고파", similarity: 1 }

arrangeBySimilarity("다람쥐 헌 쳇바퀴에 타고파", [
  "다람쥐 헌 쳇바퀴에 타고파",
  "고양이 새 쳇바퀴에 안 타고파",
  "생쥐 새 쳇바퀴에 타고파",
]);
// => [
//   { _text: "다람쥐 헌 쳇바퀴에 타고파", similarity: 1 },
//   { _text: "생쥐 새 쳇바퀴에 타고파", similarity: 0.7536231884057971 },
//   { _text: "고양이 새 쳇바퀴에 안 타고파", similarity: 0.6578947368421053 },
// ]
```

## API

### `compareTwoStrings(target: string, compared: string): number`

Returns the similarity between two strings, from `0` (nothing in common) to `1` (identical).

### `findBestMatch(target: string, candidates: string[]): Match | undefined`

Returns the candidate most similar to `target`. If several candidates tie, the first one wins. Returns `undefined` if `candidates` is empty.

### `arrangeBySimilarity(target: string, candidates: string[]): Match[]`

Returns every candidate with its score, most similar first. Candidates with equal scores keep their original order. The input array is not changed.

### `Match`

```ts
interface Match {
  _text: string;      // the candidate string
  similarity: number; // 0 to 1
}
```

### Errors

Every function throws a `TypeError` if `target` is not a string, or if `candidates` is not an array of strings.

## How it works

1. **Split into phonemes.** The input is first [NFC-normalized][nfc], so decomposed Hangul (common in macOS filenames) matches ordinary text. Each Hangul syllable then becomes three tokens: its initial consonant, vowel and final consonant. A syllable with no final consonant gets an empty placeholder. Every other character is one token of its own.
   `"각a"` → `ㄱ ㅏ ㄱ a`
2. **Build bigrams.** Each token is paired with the one after it. The last token is paired with an end marker, so even a one-letter string has one bigram.
   `ㄱ ㅏ ㄱ a` → `ㄱㅏ`, `ㅏㄱ`, `ㄱa`, `a⟨end⟩`
3. **Score.** The result is the Dice coefficient of the two bigram lists: `2 × shared bigrams / (bigrams in a + bigrams in b)`. Each bigram can be matched only once.

Because the text is compared at the jamo level, changing one vowel or final consonant affects only a few bigrams instead of the whole syllable.

## Migrating from 1.x

2.0 gives the same scores as 1.x for ordinary text. What changed:

- Decomposed (NFD) Hangul is now normalized, so it scores the same as precomposed text. In 1.x it was not recognized as Hangul.

- Invalid input now **throws** a `TypeError`. In 1.x the functions *returned* an `Error` object.
- `candidates` must be an array of strings. In 1.x any object was accepted, and non-string items were converted to strings.
- Deep imports such as `kor-string-similarity/strSeparator.js` are gone. Import from the package root only.
- Node.js 18 or newer is required.

## Development

```bash
npm install
npm test   # builds with tsc, then runs the tests in test/ using node:test
```

## License

ISC

[dice]: https://en.wikipedia.org/wiki/S%C3%B8rensen%E2%80%93Dice_coefficient
[nfc]: https://unicode.org/reports/tr15/
