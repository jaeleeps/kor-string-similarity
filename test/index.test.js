const { test } = require("node:test");
const assert = require("node:assert/strict");
const { compareTwoStrings, findBestMatch, arrangeBySimilarity } = require("..");
const { toPhonemes, toBigrams } = require("../dist/tokenize");

const TARGET = "다람쥐 헌 쳇바퀴에 타고파";

// Results carry both `text` and the deprecated `_text` with the same value.
const match = (text, similarity) => ({ text, _text: text, similarity });

test("toPhonemes decomposes Hangul syllables and keeps other characters", () => {
  assert.deepEqual(toPhonemes("각a"), ["ㄱ", "ㅏ", "ㄱ", "a"]);
  assert.deepEqual(toPhonemes("가"), ["ㄱ", "ㅏ", "empt"]);
  assert.deepEqual(toPhonemes("힣"), ["ㅎ", "ㅣ", "ㅎ"]);
});

test("toPhonemes treats decomposed (NFD) Hangul like precomposed", () => {
  assert.deepEqual(toPhonemes("각".normalize("NFD")), ["ㄱ", "ㅏ", "ㄱ"]);
});

test("toPhonemes keeps characters outside the BMP whole", () => {
  assert.deepEqual(toPhonemes("a😀"), ["a", "😀"]);
});

test("toBigrams always yields at least one bigram", () => {
  assert.deepEqual(toBigrams(""), ["emptundefined"]);
  assert.deepEqual(toBigrams("a"), ["aundefined"]);
  assert.deepEqual(toBigrams("ab"), ["ab", "bundefined"]);
});

test("compareTwoStrings", () => {
  assert.equal(compareTwoStrings("각난닫", "각난닫"), 1);
  assert.equal(compareTwoStrings("각난닫", "톹풒흏"), 0);
  assert.equal(compareTwoStrings(TARGET, "고양이 새 쳇바퀴에 안 타고파"), 0.6578947368421053);
  assert.equal(compareTwoStrings("가", "각"), 1 / 3);
  assert.equal(compareTwoStrings("Hello", "hallo"), 0.6);
  assert.equal(compareTwoStrings("a", "A"), 1);
  assert.equal(compareTwoStrings("", ""), 1);
  assert.equal(compareTwoStrings("안녕하세요".normalize("NFD"), "안녕하세요"), 1);
  assert.equal(compareTwoStrings("a😀", "a😁"), 0);
});

test("arrangeBySimilarity sorts by descending similarity", () => {
  assert.deepEqual(
    arrangeBySimilarity(TARGET, [TARGET, "고양이 새 쳇바퀴에 안 타고파", "생쥐 새 쳇바퀴에 타고파"]),
    [
      match(TARGET, 1),
      match("생쥐 새 쳇바퀴에 타고파", 0.7536231884057971),
      match("고양이 새 쳇바퀴에 안 타고파", 0.6578947368421053),
    ],
  );
});

test("findBestMatch", () => {
  assert.deepEqual(
    findBestMatch(TARGET, [TARGET, "고양이 새 쳇바퀴에 안 타고파", "햄스터 새 쳇바퀴에 타고파"]),
    match(TARGET, 1),
  );
  assert.equal(findBestMatch(TARGET, []), undefined);
});

test("invalid input throws TypeError", () => {
  assert.throws(() => compareTwoStrings(1, "a"), TypeError);
  assert.throws(() => findBestMatch("a", null), TypeError);
  assert.throws(() => arrangeBySimilarity("a", ["b", 2]), TypeError);
});

test("compareTwoStrings matches the reference greedy Dice on random inputs", () => {
  // The original 1.x algorithm: match each left bigram to the first unused equal right bigram.
  const referenceDice = (a, b) => {
    const left = toBigrams(a.toLowerCase());
    const right = toBigrams(b.toLowerCase());
    const total = left.length + right.length;
    let intersections = 0;
    for (const bigram of left) {
      const index = right.indexOf(bigram);
      if (index !== -1) {
        intersections++;
        right[index] = null;
      }
    }
    return (2 * intersections) / total;
  };

  // Small alphabet so repeated bigrams are common.
  const alphabet = ["가", "각", "나", "간", "a", "A", "b", " ", "😀"];
  let seed = 42;
  const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const randomString = () =>
    Array.from({ length: Math.floor(random() * 12) }, () => alphabet[Math.floor(random() * alphabet.length)]).join("");

  for (let i = 0; i < 2000; i++) {
    const a = randomString();
    const b = randomString();
    assert.equal(compareTwoStrings(a, b), referenceDice(a, b), `${JSON.stringify(a)} vs ${JSON.stringify(b)}`);
  }
});
