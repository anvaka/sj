var parseBinding = require('./bindingParser');

module.exports = function (root, attribute, model, requires) {
  var name = attribute.nodeName.split(':');
  if (name.length !== 2) return;
  var modelKey = parseBinding(attribute.nodeValue) || attribute.nodeValue;
  root.setAttributeNS(null, name[1], model[modelKey]);
};
