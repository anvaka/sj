module.exports = function () {
  var circles = [];
  for (var i = 0; i < 100; ++i) {
    circles.push({
      x: i * 5,
      y: Math.random() * 100
    });
  }

  var sj = require('../../');
  sj.bind(document.getElementById('scene'), {
    circles: circles
  });
};
