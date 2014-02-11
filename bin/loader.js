var sj = require('../');
var docLoaded = setInterval(checkDomReady);

function checkDomReady() {
  var state = document.readyState;
  if (state === "complete" || state === "interactive") {
    clearInterval(docLoaded);
    sj.bind(document.body);
  }
}
