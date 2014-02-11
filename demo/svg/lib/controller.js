module.exports = function (controller) {
  var sj = require('sj');

  return function(root, model, requires) {
    // remove ourselves
    var child = root.children[0];
    root.parentNode.replaceChild(child, root);
    controller(model);
    sj.bind(child, model, requires);
  };
};
