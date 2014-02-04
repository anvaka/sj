module.exports = function (root, ctx) {
  var bind = require('sj').bind; // require sj, we gonna go recursive
  var api = {
    appendTo: function (parent, model) {
      for (var i = 0; i < root.childNodes.length; ++i) {
        var childNode = root.childNodes[i].cloneNode(true);
        parent.appendChild(childNode);
        bind(childNode, model, ctx);
      }
    }
  };
  var parent = root.parentNode;
  parent.removeChild(root); // detach ourself

  ctx.fire('item-template-attached', api, parent);
};
