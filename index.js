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
