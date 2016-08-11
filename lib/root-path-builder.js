// native
const util      = require('util');
const NODE_PATH = require('path');

// constants
const STARTING_SLASH_RE = /^\//;
const TRAILING_SLASH_RE = /\/$/;

function _toArray(obj) {
  return Array.prototype.slice.call(obj, 0);
}

function _trimStarting(str) {
  return str.replace(STARTING_SLASH_RE, '');
}

function _trimTrailing(str) {
  return str.replace(TRAILING_SLASH_RE, '');
}

/**
 * Errors
 */
function IllegalPath(path) {
  this.path = path;

  Error.call(this, 'The path ' + path + ' is illegal');
}
util.inherits(IllegalPath, Error);
IllegalPath.prototype.name = 'IllegalPath';

/**
 * Function that returns the effective rootPathBuilder
 * @param  {String} rootPath
 * @return {Function}
 */
module.exports = function createBuilder(rootPath) {

  if (!rootPath) {
    throw new TypeError('rootPath MUST be a String');
  }

  rootPath = NODE_PATH.normalize(rootPath);
  // make sure it has no trailing fw slash
  rootPath = _trimTrailing(rootPath);

  if (!NODE_PATH.isAbsolute(rootPath)) {
    throw new TypeError('rootPath MUST be an absolute path');
  }

  /**
   * Checks whether a given path is within the root path
   * @param  {String}  path
   * @return {Boolean}
   */
  function isPathWithin(path) {

    if (typeof path !== 'string') {
      throw new TypeError('path MUST be a String');
    }

    var dirpath = NODE_PATH.dirname(path);

    return dirpath.startsWith(rootPath);
  }

  /**
   * Prepends the root path to the given path.
   * @param  {String} path
   * @return {String}
   */
  function prependTo(path) {

    path = _trimStarting(path);

    var unormalizedFullPath = rootPath + '/' + path;

    // normalize the path and check if the resulting path is
    // within the root
    var fullPath = NODE_PATH.normalize(unormalizedFullPath);

    if (!isPathWithin(fullPath)) {
      
      throw new IllegalPath(path);

    } else {
      return fullPath;
    }

  }

  /**
   * Joins various path parts and prepends the result with
   * the rootPath
   * @return {String}
   */
  var rootPathBuilder = function () {
    var path = NODE_PATH.join.apply(null, _toArray(arguments));

    return prependTo(path);
  };

  rootPathBuilder.isPathWithin = isPathWithin;
  rootPathBuilder.prependTo = prependTo;
  rootPathBuilder.value = function () {
    return rootPath;
  };

  return rootPathBuilder;
}

/**
 * Expose errors
 */
module.exports.errors = {
  IllegalPath: IllegalPath,
};
