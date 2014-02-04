require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Vf51PD":[function(require,module,exports){
module.exports = function () {
  var circles = [];
  for (var i = 0; i < 100; ++i) {
    circles.push({
      x: i * 5,
      y: Math.random() * 100
    });
  }

  var sj = require('sj');
  sj.bind(document.getElementById('scene'), {
    circles: circles
  });
};

},{"sj":7}],"./index":[function(require,module,exports){
module.exports=require('Vf51PD');
},{}],3:[function(require,module,exports){
module.exports = function parseBinding(value) {
  var match = value.match(/\{(.+)\}/);
  return match && match[1];
}

},{}],4:[function(require,module,exports){
var parseBinding = require('./bindingParser');

module.exports = function (root, attribute, settings) {
  var name = attribute.nodeName.split(':');
  if (name.length !== 2) return;
  var model = settings.model;
  var modelKey = parseBinding(attribute.nodeValue) || attribute.nodeValue;
  // todo: validate?
  root.setAttributeNS(null, name[1], settings.model[modelKey]);
};


},{"./bindingParser":3}],5:[function(require,module,exports){
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

},{"sj":7}],6:[function(require,module,exports){
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

},{"./bindingParser":3}],7:[function(require,module,exports){
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

},{}],"afnvge":[function(require,module,exports){
/**
 * This module implements bindings for svg
 */
module.exports = {
  'item-template': require('./lib/itemTemplate'),
  'items-source': require('./lib/itemsSource'),
  '*' : require('./lib/defaultDataBinder') 
};

},{"./lib/defaultDataBinder":4,"./lib/itemTemplate":5,"./lib/itemsSource":6}],"./svgcore":[function(require,module,exports){
module.exports=require('afnvge');
},{}]},{},[])
;