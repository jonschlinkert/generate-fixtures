'use strict';

var fs = require('fs');
var path = require('path');
var write = require('write');
var shuffle = require('shuffle-words');
var range = require('random-range');
var mixin = require('mixin-deep');
var str = fs.readFileSync(__dirname + '/content/short.txt', 'utf8');
var exts = ['.txt', '.js', '.json', '.hbs', '.md'];


function arrayify(val) {
  return Array.isArray(val) ? val : [val];
}

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
  var num = random(0, len - 1);
  return words[num];
}

/**
 * Generate the directory for each fixture.
 *
 * @param  {[type]} depth
 * @return {[type]}
 */

function base(depth, sep) {
  var arr = [];
  while (depth--) {
    var dir = pick(words);
    arr.push(dir);
  }
  return arr.join(sep);
}

/**
 * Fix slashes on file paths. Pass one or a list
 * of file paths.
 *
 * @param  {String} `paths`
 * @return {String}
 */

function slashify(paths) {
  return path.join.apply(path, arguments)
    .replace(/\\/g, '/');
}

/**
 * Randomly pick an extension for a fixture.
 *
 * @param  {String} `ext`
 * @return {String}
 */

function pickExt(ext) {
  if (ext == null) {
    ext = exts;
  }
  var len = ext.length;
  var i = random(0, len - 1);
  return arrayify(ext)[i];
}

/**
 * Generate the directory for each fixture.
 *
 * @param  {[type]} depth
 * @return {[type]}
 */

function normalize(sep) {
  var args = [].slice.call(arguments, 1);

  if (sep === '/') {
    return slashify.apply(slashify, args);
  }

  return args.join(sep);
}

/**
 * Generate the full filepath for each fixture.
 *
 * @param  {[type]} options
 * @return {[type]}
 */

function filepath(options) {
  var defaults = {maxDepth: 5, root: 'temp', sep: '/'};
  var opts = mixin({}, defaults, options);
  var max = opts.maxDepth;

  var depth = opts.depth || random(1, max);
  var root = opts.root || 'temp';
  var dir = base(depth, opts.sep);

  return normalize(opts.sep, root, dir);
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
    arr.push(filepath(opts, {sep: '/'}));
    // arr.push(filepath(opts, {sep: opts.sep}));
  }
  return arr;
}

/**
 * Make content appear a little less contrived.
 *
 * @param  {Array} arr
 * @return {Array}
 */

function adjust(arr) {
  var len = words.length;
  var a = arr[0] >= 1 ? arr[0] : 1;
  a = a <= len - 1 ? a : a - 1;
  var b = arr[1] >= a + 1 ? arr[1] : (a + 1);
  return [a, b];
}

/**
 * Generate fixtures
 *
 * @param  {Array} `files`
 * @param  {Array} `options`
 * @return {Array}
 */

module.exports = function fixtures(dir, options) {
  var opts = mixin({depth: 5}, options);
  var num = opts.num || 25;

  var files = tree(num, opts);

  files.forEach(function (filepath) {
    var dest = path.join(dir, filepath);
    var ext = pickExt(opts.ext);
    var len = words.length;
    var arr = adjust(range(len));

    var a = arr[0];
    var b = arr[1];

    var text = words.slice(a, b);
    var contents = shuffle(text);

    write.sync(dest + ext, contents);
  });
};