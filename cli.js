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
var dest = argv.d || argv.dest  || utils.firstString(argv._);
var contents = argv.contents || argv.c;
var remove = argv.rm;


if ((argv.num || argv.n) && !dest) {
  log.inform('please define a destination directory with `-d`');
}


/**
 * Set options
 */

var opts = {num: num, dest: dest};
if (contents) {
  opts.contents = contents;
}

if (ext) {
  opts.ext = ext;
}

/**
 * Create fixtures
 */

if (dest) {
  if (fs.existsSync(dest) && force == null) {
    console.log();
    log.error(''
      + ' [fixtures] WARNING! directory "' + dest + '"'
      + ' already exists.\n  Please set `--force` to write'
      + ' to this directory.'
    );
    console.log();
  } else {
    dest = path.join(process.cwd(), dest);
    console.log();
    console.log(log.gray(' [fixtures] writing to:'), dest);
    // write fixtures
    fixtures(dest, opts);
    log.success(' Done.');
  }

/**
 * Delete fixtures
 */

} else if (remove) {
  if (fs.existsSync(remove) && force == null) {
    console.log();
    log.error(''
      + ' [fixtures] WARNING! Please set `--force` to delete'
      + ' a directory.'
    );
  } else {
    remove = path.join(process.cwd(), remove);
    console.log();
    console.log(log.gray(' [fixtures] deleting:'), remove);
    // remove fixtures
    del.sync(remove);
    log.success(' Done.');
  }
}
