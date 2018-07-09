var rCho =
        [ "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ",
            "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ" ];
var rJung =
        [ "ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ",
            "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ" ];
var rJong =
        [ "", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ",
            "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ",
            "ㅍ", "ㅎ" ];

var replaceAll = function (strTemp, strValue1, strValue2){
  while(1){
    if( strTemp.indexOf(strValue1) != -1 ) strTemp = strTemp.replace(strValue1, strValue2);
    else break;
  }
  return strTemp;
}

var korToUni = function(str) {
  return escape(replaceAll(str, "\\", "%"));
}

var uniToKor = function(str) {
  return unescape(replaceAll(str, "\\", "%"));
}

var handleSyllables = function(str) {
  var cho, jung, jong;
  var tempStr = str.charCodeAt(0) - 0xAC00;
  var arr = [];
  jong = tempStr % 28; // 종성
  jung = ((tempStr - jong) / 28 ) % 21;  // 중성
  cho = (((tempStr - jong) / 28 ) - jung ) / 21; // 종성
  // console.log("초성:" + rCho[cho] + " 중성:" + rJung[jung] + " 종성:" + rJong[jong]);
  (rCho[cho] != (null||undefined||"")) ? arr.push(rCho[cho]) : arr.push("empt");
  (rJung[jung] != (null||undefined||"")) ? arr.push(rJung[jung]) : arr.push("empt");
  (rJong[jong] != (null||undefined||"")) ? arr.push(rJong[jong]) : arr.push("empt");
  return arr;
}

var strSeparator = function(str) {
  var arr = [];
  var index = -1, length = str.length;
  while (++index < length) {
    // console.log("index: " + index);
    var tempStr = str[index];
    var asciiDec = tempStr.charCodeAt(0);
    var tempArr;
    // console.log(asciiDec); // ascii dec
    if (44032 <= asciiDec && asciiDec <= 55215) {
      // console.log("Hangul Syllables");
      handleSyllables(tempStr).forEach((item) => arr.push(item));
    } else {
      arr.push(tempStr);
    }
  }
  // console.log("finalArr: " + arr);
  return arr;
}

var getStrArr = function(str) {
  var arr = strSeparator(str);
  var resultarr = [];
  var index = -1, length = arr.length;
  if (length == 0) {
    resultarr = ["empt"+"undefined"]
    return resultarr;
  } else if (length == 1) {
    resultarr = [arr[0]+"undefined"]
    return resultarr;
  }
  while (++index < length) {
    resultarr.push(""+arr[index]+arr[index+1]);
  }
  return resultarr;
}

module.exports = getStrArr;
