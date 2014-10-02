'use strict';

var path = require('path');
var write = require('write');
var fs = require('fs');

// Shuffle the words in the fixtures
var shuffle = require('shuffle-words');
var range = require('random-range');
var mixin = require('mixin-deep');
var str = fs.readFileSync('content/short.txt', 'utf8');

var words = str.split(' ')
  .map(function (word) {
    return word
      .replace(/[\s\W]+/g, '')
      .toLowerCase();
  }).filter(Boolean);

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + (min + 1);
}

function pick(words) {
  var len = words.length;
  var num = random(0, len);
  return words[num || 1];
}

/**
 * Generate the directory for each fixture.
 *
 * @param  {[type]} depth
 * @return {[type]}
 */

function dirname(depth) {
  var arr = [];
  while (depth--) {
    var dir = pick(words);
    arr.push(dir);
  }
  return arr.join('/');
}

/**
 * Generate the full filepath for each fixture.
 *
 * @param  {[type]} options
 * @return {[type]}
 */

function filepath(options) {
  var defaults = {maxDepth: 5, root: 'temp'};
  var opts = mixin(defaults, options);
  var max = opts.maxDepth;

  var depth = opts.depth || random(1, max);
  var root = opts.root || 'temp';
  var ext = opts.ext || '.txt';

  var dir = dirname(depth);

  return path.join(root, dir) + ext;
}

/**
 * Create the directory structure.
 *
 * @param  {[type]} num
 * @param  {[type]} options
 * @return {[type]}
 */

function tree(num, options) {
  var opts = mixin({}, options);
  var arr = [];

  while (num--) {
    arr.push(filepath(opts));
  }
  return arr;
}

function adjust(arr) {
  var len = words.length;
  var a = arr[0] >= 1 ? arr[0] : 1;
  a = a <= len - 1 ? a : a - 1;
  var b = arr[1] >= a + 1 ? arr[1] : (a + 1);
  return [a, b];
}

module.exports = function fixtures(files, options) {
  var opts = mixin({}, options);
  var num = opts.num || 25;

  var files = tree(num, opts);
  var contents;

  files.forEach(function (filepath, i) {
    var len = words.length;
    var arr = adjust(range(len));

    var a = arr[0];
    var b = arr[1];

    var text = words.slice(a, b);
    contents = shuffle(text);

    write.sync(filepath, contents);
  });
}