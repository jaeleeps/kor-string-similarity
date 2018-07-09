var separator = require('./strSeparator.js');

function diceCoefficient(target, compared) {
  var left = separator(String(target).toLowerCase());
  var right = separator(String(compared).toLowerCase());
  var rightLength = right.length;
  var length = left.length;
  var index = -1;
  var intersections = 0;
  var rightPair;
  var leftPair;
  var offset;

  while (++index < length) {
    leftPair = left[index];
    offset = -1;

    while (++offset < rightLength) {
      rightPair = right[offset];

      if (leftPair === rightPair) {
        intersections++;
        right[offset] = '';
        break;
      }
    }
  }

  return 2 * intersections / (left.length + rightLength);
}

module.exports = diceCoefficient;
