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
module.exports = function (root, settings) {
  var bind = require('sj').bind; // require sj, we gonna go recursive

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

},{"sj":7}],6:[function(require,module,exports){
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

},{"./bindingParser":3}],7:[function(require,module,exports){
var xpath = require('./lib/xpath');

module.exports.bind = function(root, model, requires) {
  var baseNamespace = root.namespaceURI;

  requires = xpath("descendant-or-self::node()[@*[starts-with(name(.), 'xmlns:')]]", root).reduce(reduceRequire, requires || {});

  Object.keys(requires).forEach(attachElements);

  function attachElements(namespace) {
    var nameStartsWithNamespace = "[starts-with(name(.), '" + namespace + ":')]";
    xpath("descendant-or-self::node()" + nameStartsWithNamespace, root, nsResolver)
      .forEach(attachElement);

    xpath("descendant-or-self::node()[@*" + nameStartsWithNamespace + "]", root, nsResolver)
      .forEach(attachElementAttributes);
  }

  function attachElement(element) {
    if (!document.body.contains(element)) return; // i'm not sure about this...

    var name = element.nodeName.split(':');
    var module = require(requires[name[0]]);
    var ctor = name[1];
    if (!(ctor in module)) {
      throw new Error('Cannot find ' + name[1] + ' in ' + name[0]);
    }

    module[ctor](element, {
      requires: requires,
      model: model
    });
  }

  function attachElementAttributes(element) {
    for (var i = 0; i < element.attributes.length; ++i) {
      var attribute = element.attributes[i];
      var name = attribute.nodeName.split(':');
      if (name.length !== 2 || !requires[name[0]]) continue;

      var module = require(requires[name[0]]);
      var ctor = name[1];
      if (ctor in module) {
        module[ctor](element, attribute, {
            requires: requires,
            model: model
          });
      } else if ('*' in module) {
        module['*'](element, attribute, {
            requires: requires,
            model: model
          });
      } else {
        throw new Error('Cannot find ' + name[1] + ' in ' + name[0]);
      }
    }
  }

  function nsResolver(key) {
    var value = requires[key];
    if (!value) return null;

    return baseNamespace;
  }
}

function reduceRequire(requires, element) {
  for (var i = 0; i < element.attributes.length; ++i) {
    var attribute = element.attributes[i];
    var attributeValue = attribute.nodeValue;
    var match = attributeValue.match(/^require:(.+)$/);
    if (match) {
      var name = attribute.nodeName.split('xmlns:')[1];
      requires[name] = match[1];
    }
  }

  return requires;
}

},{"./lib/xpath":8}],8:[function(require,module,exports){
module.exports = function (path, root, nsResolver) {
  var snapshot = root.ownerDocument.evaluate(path,
                    root, nsResolver,
                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
  var items = [];

  for (var i = 0; i < snapshot.snapshotLength; ++i) {
    items.push(snapshot.snapshotItem(i));
  }

  return items;
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