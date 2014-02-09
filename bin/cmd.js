#!/usr/bin/env node

// sorry, this file is a mess. will be better when it proves
// its right for existence

var fs = require('fs');
var path = require('path');
var files = process.argv.slice(2);

// Noooes, we are using regex to parse html. Did I just broke the internets?
var nsRe = /xmlns:[^=]+?=['"]require:([^'"]+?)['"]/g;
var foundRequires = {};

for (var i = 0; i < files.length; ++i) {
  var fileName = path.resolve(files[i]);
  if (fs.existsSync(fileName)) {
    // look ma, no streams (I'm really sorry here).
    var xml = fs.readFileSync(fileName, 'utf8');
    var nsMatch;
    while (nsMatch = nsRe.exec(xml)) {
      foundRequires[nsMatch[1]] = 1; // not accurate
    }
  }
}

//var browserify = require('browserify');
console.dir(foundRequires);
