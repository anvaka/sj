module.exports = itemsSource;

var parseBinding = require('./bindingParser');

function itemsSource(root, attribute, ctx) {
  var model = ctx.model;
  if (!model) {
    throw new Error('Data model is not declared. Cannot use items-source without model');
  }

  var sourceKey = parseBinding(attribute.nodeValue);
  var sourceArray = model[sourceKey];
  if (!sourceArray) { throw new Error('Cannot find ' + sourceKey + ' in current model'); }

  ctx.on('item-template-attached', function (itemTemplate, node) {
    if (node !== root) return; // it's not our child

    // this is silly. Need to come up with something better. Two-pass maybe?
    // compile/link?
    setTimeout(function() {
      for (var i = 0; i < sourceArray.length; ++i) {
        itemTemplate.appendTo(root, sourceArray[i]);
      }
    })
  });
}
