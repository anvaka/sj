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
