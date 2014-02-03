var parseBinding = require('./bindingParser');

module.exports = function (root, attribute, settings) {
  var name = attribute.nodeName.split(':');
  if (name.length !== 2) return;
  var model = settings.model;
  var modelKey = parseBinding(attribute.nodeValue) || attribute.nodeValue;
  // todo: validate?
  root.setAttributeNS(null, name[1], settings.model[modelKey]);
};

