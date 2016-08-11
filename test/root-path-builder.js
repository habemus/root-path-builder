const assert = require('assert');
const should = require('should');

const rootPathBuilder = require('../lib/root-path-builder');

describe('rootPathBuilder', function () {

  it('should require a valid absolute path to be passed', function () {

    assert.throws(function () {
      var root = rootPathBuilder();
    }, TypeError);

    assert.throws(function () {
      var root = rootPathBuilder('some/not/absolute/path');
    }, TypeError);
    
  });

  it('should add the rootPath to the given path', function () {
    var root = rootPathBuilder('/root/path');

    root('some/path').should.equal('/root/path/some/path');
  });

  it('should join the path parts given and prepend the rootPath to the result', function () {
    var root = rootPathBuilder('/root/path');

    root('some', 'path').should.equal('/root/path/some/path');
  });

  it('should normalize the path parts before returning', function () {
    var root = rootPathBuilder('/root/path');

    root('some', '..', 'another', '.', 'place')
      .should.equal('/root/path/another/place');
  })
  
  it('should throw IllegalPath error if resulting path is not within root', function () {
    var root = rootPathBuilder('/root/path');

    assert.throws(function () {
      root('some', 'path', '../..');
    }, rootPathBuilder.errors.IllegalPath);

    assert.throws(function () {
      root('.');
    }, rootPathBuilder.errors.IllegalPath);

    assert.throws(function () {
      root('../../another');
    }, rootPathBuilder.errors.IllegalPath);

    assert.throws(function () {
      root('../outside');
    }, rootPathBuilder.errors.IllegalPath);
  });


  describe('rootPathBuilder#value', function () {
    it('should return the rootPath', function () {
      var root = rootPathBuilder('/root/path');

      root.value().should.equal('/root/path');
    });

    it('should have normalized the rootPath to a version without trailing slashes', function () {
      var root = rootPathBuilder('/root/path/');

      root.value().should.equal('/root/path');
    });
  });

});
