const { test } = require("node:test");
const assert = require("node:assert/strict");
const { compareTwoStrings, findBestMatch, arrangeBySimilarity } = require("..");
const { toPhonemes, toBigrams } = require("../dist/tokenize");

const TARGET = "다람쥐 헌 쳇바퀴에 타고파";

test("toPhonemes decomposes Hangul syllables and keeps other characters", () => {
  assert.deepEqual(toPhonemes("각a"), ["ㄱ", "ㅏ", "ㄱ", "a"]);
  assert.deepEqual(toPhonemes("가"), ["ㄱ", "ㅏ", "empt"]);
  assert.deepEqual(toPhonemes("힣"), ["ㅎ", "ㅣ", "ㅎ"]);
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
});

test("arrangeBySimilarity sorts by descending similarity", () => {
  assert.deepEqual(
    arrangeBySimilarity(TARGET, [TARGET, "고양이 새 쳇바퀴에 안 타고파", "생쥐 새 쳇바퀴에 타고파"]),
    [
      { _text: TARGET, similarity: 1 },
      { _text: "생쥐 새 쳇바퀴에 타고파", similarity: 0.7536231884057971 },
      { _text: "고양이 새 쳇바퀴에 안 타고파", similarity: 0.6578947368421053 },
    ],
  );
});

test("findBestMatch", () => {
  assert.deepEqual(
    findBestMatch(TARGET, [TARGET, "고양이 새 쳇바퀴에 안 타고파", "햄스터 새 쳇바퀴에 타고파"]),
    { _text: TARGET, similarity: 1 },
  );
  assert.equal(findBestMatch(TARGET, []), undefined);
});

test("invalid input throws TypeError", () => {
  assert.throws(() => compareTwoStrings(1, "a"), TypeError);
  assert.throws(() => findBestMatch("a", null), TypeError);
  assert.throws(() => arrangeBySimilarity("a", ["b", 2]), TypeError);
});
