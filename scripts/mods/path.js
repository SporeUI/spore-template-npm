const $path = require('path');
const $config = require('../../sconfig');

function resolve(dir) {
  return $path.resolve($config.root, dir);
}

function cwd(dir) {
  return $path.resolve(process.cwd(), dir);
}

exports.resolve = resolve;
exports.cwd = cwd;
