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
