const assert = require('assert');
const should = require('should');

const rootPathBuilder = require('../lib/root-path-builder');

describe('rootPathBuilder#isPathWithin', function () {

  it('should return true if given a path within the rootPathBuilder', function () {

    var root = rootPathBuilder('/root/path');

    root.isPathWithin('/root/path/withtin').should.equal(true);
  });

  it('should return false if given a path that is exactly equal to the rootPath', function () {
    var root = rootPathBuilder('/root/path');

    root.isPathWithin('/root/path').should.equal(false);
  });

  it('should return false if given a path that has a different dirname but that starts with the same letters', function () {

    var root = rootPathBuilder('/root/path');

    root.isPathWithin('/root/pathAnother').should.equal(false);

    root.isPathWithin('/root/path..').should.equal(false);
  });

  it('should return false if given a path that is outside the root', function () {
    var root = rootPathBuilder('/root/path');

    root.isPathWithin('/root').should.equal(false);
  });

  it('should return false if given an empty path', function () {
    var root = rootPathBuilder('/root/path');

    root.isPathWithin('').should.equal(false);
  });

  it('should throw error if given a path that is not a string', function () {
    var root = rootPathBuilder('/root/path');

    assert.throws(function () {
      root.isPathWithin();
    }, TypeError);

    assert.throws(function () {
      root.isPathWithin(3);
    }, TypeError);

    assert.throws(function () {
      root.isPathWithin(true);
    }, TypeError);
  });

  it('should NOT normalize the path', function () {
    var root = rootPathBuilder('/root/path');

    root.isPathWithin('/root/path/..').should.equal(true);
  });
});
