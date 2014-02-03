module.exports = function (root, settings) {
  var bind = require('../../../').bind; // require sj, we gonna go recursive

  var api = {
    appendTo: function (parent, model) {
      for (var i = 0; i < root.children.length; ++i) {
        var childNode = root.children[i].cloneNode(true);
        parent.appendChild(childNode);
        bind(childNode, model, settings.requires);
      }
    }
  };

  root.parentNode['__sjItemTemplate'] = api;
  root.parentNode.removeChild(root); // detach ourself
};
