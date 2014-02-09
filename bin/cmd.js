#!/usr/bin/env node

// sorry, this file is a mess. will be better when it proves
// its right for existence

var fs = require('fs');
var path = require('path');
var files = process.argv.slice(2);

if (files.length == 0) {
  console.error('This program generates bundle from html file.');
  console.error('');
  console.error('Usage: ');
  console.error('  sj index.html');
  return -1;
}

if (files.length > 1) {
  console.error('Only single input file for now. E.g.');
  console.error('  sj index.html');
  return -2;
}

var fileName = path.resolve(files[0]);

if (!fs.existsSync(fileName)) {
  console.error('Could not find input file: ', input);
  return -3;
}

// Noooes, we are using regex to parse html. Did I just broke the internets?
var nsRe = /xmlns:[^=]+?=['"]require:([^'"]+?)['"]/g;
var foundRequires = {};

// look ma, no streams (I'm really sorry here).
var xml = fs.readFileSync(fileName, 'utf8');
var nsMatch;
while (nsMatch = nsRe.exec(xml)) {
  foundRequires[nsMatch[1]] = 1; // not accurate
}

var browserify = require('browserify');

var b = browserify({basedir: path.dirname(fileName) });
Object.keys(foundRequires).forEach(function (requireName) {
  b.require(requireName);
});

b.add(path.join(__dirname, 'loader.js'));

b.bundle().pipe(process.stdout);
