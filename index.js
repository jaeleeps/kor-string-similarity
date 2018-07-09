var dice = require('./diceCoefficient.js')

var compareTwoStrings = function(target, comparedStr) {
  if (typeof target != "string" || typeof comparedStr != "string") {
    return new Error("INVALID INPUTTYPE for compareTwoStrings");
  } else {
    return dice(target, comparedStr);
  }
}

var findBestMatch = function(target, comparedArr) {
  if (typeof target != "string" || typeof comparedArr != "object") {
    return new Error("INVALID INPUTTYPE for findBestMatch");
  } else {
    var possibleStringsArr = [] , resultArr = [], count = 0;
    for (var i = 0; i < comparedArr.length; i++) {
      if (1) {
        count++;
        var item;
        item = { "_text" : comparedArr[i], "similarity" : dice(target, comparedArr[i])}
        possibleStringsArr.push(item);
      }
    }
    resultArr = possibleStringsArr.sort((a, b) => b.similarity - a.similarity)
    return(resultArr[0]);
  }
}

var arrangeBySimilarity = function(target, comparedArr) {
  if (typeof target != "string" || typeof comparedArr != "object") {
    return new Error("INVALID INPUTTYPE for arrangeBySimilarity");
  } else {
    var possibleStringsArr = [] , resultArr = [], count = 0;
    for (var i = 0; i < comparedArr.length; i++) {
      if (1) {
        count++;
        var item;
        item = { "_text" : comparedArr[i], "similarity" : dice(target, comparedArr[i])}
        possibleStringsArr.push(item);
      }
    } // terminate for loop
    resultArr = possibleStringsArr.sort((a, b) => b.similarity - a.similarity)
    return(resultArr);
  }
}

module.exports.compareTwoStrings = compareTwoStrings;
module.exports.findBestMatch = findBestMatch;
module.exports.arrangeBySimilarity = arrangeBySimilarity;
