require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var sj = require('../');
var docLoaded = setInterval(checkDomReady);

function checkDomReady() {
  var state = document.readyState;
  if (state === "complete" || state === "interactive") {
    clearInterval(docLoaded);
    sj.bind(document.body);
  }
}

},{"../":11}],"s/PsMv":[function(require,module,exports){
var controller = require('./lib/controller');

module.exports.scene = controller(function (scope) {
  var circles = [];

  for (var i = 0; i < 100; ++i) {
    circles.push({
      x: i * 5,
      y: Math.random() * 100
    });
  }

  scope.circles = circles;
});

},{"./lib/controller":5}],"./controller":[function(require,module,exports){
module.exports=require('s/PsMv');
},{}],4:[function(require,module,exports){
module.exports = function parseBinding(value) {
  var match = value.match(/\{(.+)\}/);
  return match && match[1];
}

},{}],5:[function(require,module,exports){
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

},{"sj":8}],6:[function(require,module,exports){
var parseBinding = require('./bindingParser');

module.exports = function (root, attribute, model, requires) {
  var name = attribute.nodeName.split(':');
  if (name.length !== 2) return;
  var modelKey = parseBinding(attribute.nodeValue) || attribute.nodeValue;
  root.setAttributeNS(null, name[1], model[modelKey]);
};

},{"./bindingParser":4}],7:[function(require,module,exports){
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

},{"./bindingParser":4,"sj":8}],8:[function(require,module,exports){
module.exports.bind = function(root, model, requires) {
  requires = requires || {};
  model = model || {};

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

      ctor(node, model, requires);
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
        ctor(node, attribute, model, requires);
      } else {
        throw new Error('Cannot find ' + nameParts[1] + ' attribute in module ' + nameParts[0]);
      }
    }
  }
};

},{}],"./svgcore":[function(require,module,exports){
module.exports=require('afnvge');
},{}],"afnvge":[function(require,module,exports){
/**
 * This module implements bindings for svg
 */
module.exports = {
  'items': require('./lib/items'),
  '*' : require('./lib/defaultDataBinder') 
};

},{"./lib/defaultDataBinder":6,"./lib/items":7}],11:[function(require,module,exports){
module.exports=require(8)
},{}]},{},[1])