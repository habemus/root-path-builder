const assert = require('assert');
const should = require('should');

const rootPathBuilder = require('../lib/root-path-builder');

describe('rootPathBuilder#truncate', function () {

  it('should remove the rootPath from the given path', function () {
    var root = rootPathBuilder('/root/path');

    root.truncate('/root/path/some/path').should.equal('/some/path');
  });

  it('should always return the starting forward slash', function () {
    var root = rootPathBuilder('/root/path/');

    root.truncate('/root/path/some/path').should.equal('/some/path');
  });

  it('should normalize the path', function () {
    var root = rootPathBuilder('/root/path');

    root.truncate('/root/path/some/../other/path').should.equal('/other/path');
  });

  it('should throw error if the path normalization results in a path outside the root', function () {
    var root = rootPathBuilder('/root/path');

    assert.throws(function () {
      root.truncate('/root/pathsome/../..');
    }, rootPathBuilder.errors.IllegalPath);

    assert.throws(function () {
      root.truncate('/root/path/../..');
    }, rootPathBuilder.errors.IllegalPath);

    assert.throws(function () {
      root.truncate('/root/path..');
    }, rootPathBuilder.errors.IllegalPath);

    assert.throws(function () {
      root.truncate('/root/path');
    }, rootPathBuilder.errors.IllegalPath);

    assert.throws(function () {
      root.truncate('/root/path/..');
    }, rootPathBuilder.errors.IllegalPath);

    assert.throws(function () {
      root.truncate('/root/path/..');
    }, rootPathBuilder.errors.IllegalPath);

    assert.throws(function () {
      root.truncate('/root/path/.');
    }, rootPathBuilder.errors.IllegalPath);
  });

  it('should handle poison null bytes with IllegalPath error', function () {
    // https://docs.nodejitsu.com/articles/file-system/security/introduction/
    // https://github.com/simonfan/docs/blob/master/pages/articles/file-system/security/introduction/content.md
    var root = rootPathBuilder('/root/path');

    assert.throws(function () {
      root.truncate('/root/path/some/../path\0')
    }, rootPathBuilder.errors.IllegalPath);
  });
  
});
