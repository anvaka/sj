var sj = require('../');
var docLoaded = setInterval(checkDomReady);

function checkDomReady() {
  if (document.readyState === "complete") {
    clearInterval(docLoaded);
    sj.bind(document.body);
  }
}
