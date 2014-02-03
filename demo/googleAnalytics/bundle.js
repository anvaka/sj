require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"BmOHqG":[function(require,module,exports){
// googleAnalytics.js:
module.exports.analytics = function (root) {
  var domain = root.attributes.getNamedItem('domain').nodeValue;
  var ua = root.attributes.getNamedItem('ua').nodeValue;

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', ua, domain);
  ga('send', 'pageview');
}

},{}],"./googleAnalytics":[function(require,module,exports){
module.exports=require('BmOHqG');
},{}],"qbx5np":[function(require,module,exports){
require('sj').bind(document.body);

},{"sj":5}],"./index":[function(require,module,exports){
module.exports=require('qbx5np');
},{}],5:[function(require,module,exports){
var xpath = require('./lib/xpath');

module.exports.bind = function(root, model, requires) {
  var baseNamespace = root.namespaceURI;

  requires = xpath("descendant-or-self::node()[@*[starts-with(name(.), 'xmlns:')]]", root).reduce(reduceRequire, requires || {});

  Object.keys(requires).forEach(attachElements);

  function attachElements(namespace) {
    var nameStartsWithNamespace = "[starts-with(local-name(.), '" + namespace + ":')]";
    xpath("descendant-or-self::node()" + nameStartsWithNamespace, root, nsResolver)
      .forEach(attachElement);

    xpath("descendant-or-self::node()[@*" + nameStartsWithNamespace + "]", root, nsResolver)
      .forEach(attachElementAttributes);
  }

  function attachElement(element) {
    if (!document.body.contains(element)) return; // i'm not sure about this...

    var name = element.localName.split(':');
    var moduleName = name[0]
    var module = require(requires[moduleName]);
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

},{"./lib/xpath":6}],6:[function(require,module,exports){
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

},{}]},{},[])
;