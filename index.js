'use strict';

var write = require('write');
var path = require('path');


function faux(str, options) {
  var opts = options || {};
  var num = opts.num || 25;
  var arr = repeat(str, num);
  var ext = opts.ext || '.js';
  var len = arr.length;

  var files = [];

  var max = Math.round(random(0, (opts.max || len * 0.3)));
  while(len--) {
    var to = random(0, max);
    var range = arr.slice(0, to);
    arr.splice(0, to);
    len = arr.length;
    files.push(range.join('/') + ext);
  }

  return files;
}


function repeat(prefix, num, suffix) {
  var arr = [];
  var i = 0;

  while (i++ < num) {
    arr.push(prefix + i + (suffix ? suffix : ''));
  }
  return arr;
}


function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + (min + 1);
}


module.exports = function writeFixtures(str, options) {
  var opts = options || {};
  var files = faux(str, options);
  var cwd = opts.dest || 'temp/fixtures';

  files.forEach(function(fp) {
    var filepath = path.join(cwd, fp);
    write.sync(filepath, 'aaa');
  });
};
