#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var del = require('delete');
var log = require('verbalize');
var utils = require('arr');
var argv = require('minimist')(process.argv.slice(2));
var fixtures = require('./');

log.runner = 'fixtures';

var force = argv.force || argv.f;

var ext = argv.ext || argv.e;
var num = argv.num || argv.n || utils.firstNumber(argv._) || 50;
var contents = argv.contents || argv.c;
var filename = argv.filename || 'abc';

var createDir = argv.d || argv.dest  || utils.firstString(argv._);
var deleteDir = argv.rm;


if ((argv.num || argv.n) && !createDir) {
  log.inform('please define a destination directory with `-d`');
}

if (createDir) {
  if (fs.existsSync(createDir) && !force) {
    console.log();
    log.error(''
      + ' [fixtures] WARNING! directory "' + createDir + '"'
      + ' already exists.\n  Please set `--force` to write'
      + ' to this directory.'
    );
    console.log();
  } else {
    createDir = path.join(process.cwd(), createDir);
    console.log();
    console.log(log.gray(' [fixtures] writing to:'), createDir);
    var opts = {num: num, dest: createDir, contents: contents};
    if (ext) opts.ext = ext;
    fixtures(filename, opts);
    log.success(' Done.');
  }
} else if (deleteDir) {
  if (fs.existsSync(deleteDir) && !force) {
    console.log();
    log.error(''
      + ' [fixtures] WARNING! Please set `--force` to delete'
      + ' a directory.'
    );
  } else {
    deleteDir = path.join(process.cwd(), deleteDir);
    console.log();
    console.log(log.gray(' [fixtures] deleting:'), deleteDir);
    del.sync(deleteDir);
    log.success(' Done.');
  }
}
