module.exports.bind = function(root, model, ctx) {
  ctx = ctx || {};
  if (!ctx.requires) {
    ctx.requires = {};
  }
  var requires = ctx.requires || {};

  ctx.model = model;
  addEvents(ctx);

  compileSubtree(root);

  function compileSubtree(root) {
    if (root.localName && compileNode(root)) {
      return true;
    }
    for (var i = 0; i < root.childNodes.length; ++i) {
      compileSubtree(root.childNodes[i]);
    }
  }

  function compileNode(node) {
    var nameParts = node.localName.split(':');
    var foundComponent = false;
    if (nameParts.length === 2 && nameParts[0] in requires) {
      // potentially candidate for require
      var module = require(requires[nameParts[0]]);
      var ctor = module[nameParts[1]];
      if (typeof ctor !== 'function') {
        throw new Error('Cannot find function ' + nameParts[1] + ' in module ' + nameParts[0]);
      }

      ctor(node, ctx);
      foundComponent = true;
    }

    if (node.nodeType === 1) { // element node, compile attributes;
      var attributes = node.attributes;
      for (var i = 0; i < attributes.length; ++i) {
        compileAttribute(node, attributes[i]);
      }
    }

    return foundComponent;
  }

  function compileAttribute(node, attribute) {
    var nameParts = attribute.localName.split(':');
    if (nameParts.length !== 2) return; // not our candidate

    var isNamespace = nameParts[0] === 'xmlns';
    if (isNamespace) {
      var requireMatch = attribute.nodeValue && attribute.nodeValue.match(/^require:(.+)$/);
      if (requireMatch) {
        requires[nameParts[1]] = requireMatch[1];
      }
    } else if (nameParts[0] in requires) {
      // we've seen it before, and there is registered handler:
      var module = require(requires[nameParts[0]]);
      var ctor = module[nameParts[1]] || module['*'];
      if (typeof ctor === 'function') {
        ctor(node, attribute, ctx);
      } else {
        throw new Error('Cannot find ' + nameParts[1] + ' attribute in module ' + nameParts[0]);
      }
    }
  }
}

function addEvents(obj) {
  if (typeof obj.on === 'function' && typeof obj.fire === 'function') {
    return;
  }
  var store = {};

  obj.on = function (name, handler) {
    var handlers = store[name];
    if(!handlers) {
      store[name] = [handler];
    } else {
      handlers.push(handler);
    }
  }

  obj.off = function (name, handler) {
    var handlers = store[name];
    if (!handler) { return; }

    var idx = handlers.indexOf(handler);
    if (idx !== -1) handlers.splice(idx);
  }

  obj.fire = function (name) {
    var handlers = store[name];
    if (handlers) {
      var args = Array.prototype.splice.call(arguments, 1);
      handlers.forEach(function (cb) { cb.apply(null, args); });
    }
  }
}
