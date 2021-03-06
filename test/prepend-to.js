const assert = require('assert');
const should = require('should');

const rootPathBuilder = require('../lib/root-path-builder');

describe('rootPathBuilder#prependTo', function () {

  it('should add the rootPath to the given path', function () {
    var root = rootPathBuilder('/root/path');

    root.prependTo('some/path').should.equal('/root/path/some/path');
  });

  it('should normalize the path', function () {
    var root = rootPathBuilder('/root/path');

    root.prependTo('some/../path').should.equal('/root/path/path');
  });

  it('should throw error if the path normalization results in a path outside the root', function () {
    var root = rootPathBuilder('/root/path');

    assert.throws(function () {
      root.prependTo('some/../..');
    }, rootPathBuilder.errors.IllegalPath);

    assert.throws(function () {
      root.prependTo('/../..');
    }, rootPathBuilder.errors.IllegalPath);

    assert.throws(function () {
      root.prependTo('..');
    }, rootPathBuilder.errors.IllegalPath);

    assert.throws(function () {
      root.prependTo('.');
    }, rootPathBuilder.errors.IllegalPath);

    assert.throws(function () {
      root.prependTo('./..');
    }, rootPathBuilder.errors.IllegalPath);

    assert.throws(function () {
      root.prependTo('/..');
    }, rootPathBuilder.errors.IllegalPath);

    assert.throws(function () {
      root.prependTo('/.');
    }, rootPathBuilder.errors.IllegalPath);
  });

  it('should handle poison null bytes with IllegalPath error', function () {
    // https://docs.nodejitsu.com/articles/file-system/security/introduction/
    // https://github.com/simonfan/docs/blob/master/pages/articles/file-system/security/introduction/content.md
    var root = rootPathBuilder('/root/path');

    assert.throws(function () {
      root.prependTo('some/../path\0')
    }, rootPathBuilder.errors.IllegalPath);
  });
  
});
