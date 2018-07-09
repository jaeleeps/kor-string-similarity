var stringSimilarity = require('./index.js');

console.log(stringSimilarity.compareTwoStrings("각난닫","각난닫"));
console.log(stringSimilarity.compareTwoStrings("각난닫","톹풒흏"));
console.log(stringSimilarity.compareTwoStrings("다람쥐 헌 쳇바퀴에 타고파","고양이 새 쳇바퀴에 안 타고파"));
console.log(stringSimilarity.findBestMatch("다람쥐 헌 쳇바퀴에 타고파", ["다람쥐 헌 쳇바퀴에 타고파", "고양이 새 쳇바퀴에 안 타고파", "햄스터 새 쳇바퀴에 타고파"]));
console.log(stringSimilarity.arrangeBySimilarity("다람쥐 헌 쳇바퀴에 타고파", ["다람쥐 헌 쳇바퀴에 타고파", "고양이 새 쳇바퀴에 안 타고파", "생쥐 새 쳇바퀴에 타고파"]));
