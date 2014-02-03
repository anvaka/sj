module.exports = itemsSource;

var parseBinding = require('./bindingParser');

function itemsSource(root, attribute, settings) {
  var model = settings.model;
  if (!model) {
    throw new Error('Data model is not declared. Cannot use items-source without model');
  }

  var sourceKey = parseBinding(attribute.nodeValue);
  var sourceArray = model[sourceKey];
  if (!sourceArray) { throw new Error('Cannot find ' + sourceKey + ' in current model'); }

  var itemTemplate = root['__sjItemTemplate'] || defaultItemTemplate();

  for (var i = 0; i < sourceArray.length; ++i) {
    itemTemplate.appendTo(root, sourceArray[i]);
  }
}

function defaultItemTemplate() {
  throw new Error('Not implemented');
}
