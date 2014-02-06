var sj = require('../'),
    assert = require('assert');

test('Can process html', function () {
  var testDiv = document.createElement('div');
  testDiv.innerHTML = [
    '<div xmlns:s="require:./marker">', 
      '<s:marker />',
    '</div>'
].join('\n');
  document.body.appendChild(testDiv);

  sj.bind(document.body);
  assert.ok(document.getElementById('marker'), 'Marker is compiled and present');
});
