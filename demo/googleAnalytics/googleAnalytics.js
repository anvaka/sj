// googleAnalytics.js:
module.exports.analytics = function (root) {
  var domain = root.attributes.getNamedItem('domain').nodeValue;
  var ua = root.attributes.getNamedItem('ua').nodeValue;
}
