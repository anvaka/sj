module.exports = function parseBinding(value) {
  var match = value.match(/\{(.+)\}/);
  return match && match[1];
}
