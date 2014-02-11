module.exports = function (root, model, requires) {
  var bind = require('sj').bind; // require sj, we gonna go recursive
  var parent = root.parentNode;
  parent.removeChild(root);

  var itemsSource = root.attributes.getNamedItem('source').nodeValue;

  // just to make sure we modify subtree on next iteration
  // of event loop:
  setTimeout(function () {
    getCollection(itemsSource, model).forEach(renderChildren);
  });

  function renderChildren(model) {
    for (var i = 0; i < root.childNodes.length; ++i) {
      var childNode = root.childNodes[i].cloneNode(true);
      parent.appendChild(childNode);
      bind(childNode, model, requires);
    }
  }
};

function getCollection(bindingExpression, model) {
  if (!model) {
    throw new Error('Data model is not declared. Cannot use items-template without item-source on parent');
  }

  var parseBinding = require('./bindingParser');
  var sourceKey = parseBinding(bindingExpression);
  if (!model[sourceKey]) throw new Error('Cannot find ' + sourceKey + ' in current model');

  return model[sourceKey];
}
