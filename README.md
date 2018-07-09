# kor-string-similarity

Calculates string similarity between two strings(Korean, alphabet, number, special characters, etc.), based on dice coefficient and NphoEd(Normallized phoneme-based metric)

[Sørensen–Dice coefficient][wiki].

## API

Install:

```bash
npm install kor-string-similarity
```

Use:

```js
var stringSimilarity = require('kor-stringSimilarity');

stringSimilarity.compareTwoStrings("각난닫","각난닫"); // => 1
stringSimilarity.compareTwoStrings("각난닫","톹풒흏"); // => 0
stringSimilarity.compareTwoStrings("다람쥐 헌 쳇바퀴에 타고파","고양이 새 쳇바퀴에 안 타고파"); // => 0.6578947368421053
stringSimilarity.findBestMatch("다람쥐 헌 쳇바퀴에 타고파", ["다람쥐 헌 쳇바퀴에 타고파", "고양이 새 쳇바퀴에 안 타고파", "생쥐 새 쳇바퀴에 타고파파"]); // => { _text: '다람쥐 헌 쳇바퀴에 타고파', similarity: 1}
stringSimilarity.arrangeBySimilarity("다람쥐 헌 쳇바퀴에 타고파", ["다람쥐 헌 쳇바퀴에 타고파", "고양이 새 쳇바퀴에 안 타고파", "생쥐 새 쳇바퀴에 타고파"]); // => [{ _text: '다람쥐 헌 쳇바퀴에 타고파', similarity: 1}, { _text: '생쥐 새 쳇바퀴에 타고파', similarity: 0.7536231884057971}, { _text: '고양이 새 쳇바퀴에 안 타고파', similarity: 0.657894736842105}]
```
<!-- Definitions -->
[wiki]: http://en.wikipedia.org/wiki/Sørensen–Dice_coefficient
