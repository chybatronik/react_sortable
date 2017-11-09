/* eslint-disable */

Object.prototype.clone = function() {
  //// eslint-disable-next-line
  var newObj = (this instanceof Array) ? [] : {};
  var i;
  for (i in this) {
      if (i === 'clone')
          continue;
      if (this[i] && typeof this[i] === "object") {
          newObj[i] = this[i].clone();
      }
      else
          newObj[i] = this[i]
  } return newObj;
};
