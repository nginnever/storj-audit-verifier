'use strict';

var sinon = require('sinon');
var expect = require('chai').expect;
var crypto = require('crypto');
var MerkleTree = require('../lib/tree');

describe('MerkleTree', function(){

  describe('@constructor', function() {

    it('should create instance with or without the new keyword', function() {
      expect(MerkleTree([])).to.be.instanceof(MerkleTree);
      expect(new MerkleTree([])).to.be.instanceof(MerkleTree);
    });

    it('should feed the leaves and compute the tree', function() {
      var _feed = sinon.stub(MerkleTree.prototype, '_feed');
      var _compute = sinon.stub(MerkleTree.prototype, '_compute');
      MerkleTree(['0', '1', '2']);
      expect(_feed.callCount).to.equal(3);
      expect(_compute.callCount).to.equal(1);
      _feed.restore();
      _compute.restore();
    });

    it('should use the custom hasher', function() {
      function hasher(input) {
        return crypto.createHash('ripemd160').update(input).digest('hex');
      }
      var tree = new MerkleTree([], hasher);
      expect(tree._hasher).to.equal(hasher);
    });

  });

  describe('#depth', function() {

    it('should return the expected depth', function() {
      var tree = new MerkleTree(
        ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(function(input) {
          return MerkleTree.prototype._hasher(input);
        })
      );
      expect(tree.depth()).to.equal(3);
    });

  });

  describe('#levels', function() {

    it('should return the number of levels in the tree', function() {
      var tree = new MerkleTree(
        ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(function(input) {
          return MerkleTree.prototype._hasher(input);
        })
      );
      expect(tree.levels()).to.equal(4);
    });

  });

  describe('#level', function() {

    it('should return the nodes at the given level', function() {
      var tree = new MerkleTree(
        ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(function(input) {
          return MerkleTree.prototype._hasher(input);
        })
      );
      expect(tree.level(2).indexOf(
        '62af5c3cb8da3e4f25061e829ebeea5c7513c54949115b1acc225930a90154da'
      )).to.equal(0);
      expect(tree.level(2).indexOf(
        'd3a0f1c792ccf7f1708d5422696263e35755a86917ea76ef9242bd4a8cf4891a'
      )).to.equal(1);
      expect(tree.level(2).indexOf(
        '1b3dae70b4b0a8fd252a7879ec67283c0176729bfebc51364fb9e9fb0598ba9e'
      )).to.equal(2);
      expect(tree.level(2).indexOf(
        '520328b68932e91dbd3194a6d12050ffa99d1dc603400c375850a888d2706135'
      )).to.equal(3);
    });

  });

  describe('#root', function() {

    it('should return the root node', function() {
      var tree = new MerkleTree(
        ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(function(input) {
          return MerkleTree.prototype._hasher(input);
        })
      );
      expect(tree.root()).to.equal(
        '5d2a8967adb92f46e3266c0cddef844418e95fc6dbe733029e8a7da6145a5afe'
      );
    });

  });

  describe('#nodes', function() {

    it('should return the number of nodes in the tree', function() {
      var tree = new MerkleTree(
        ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j'].map(function(input) {
          return MerkleTree.prototype._hasher(input);
        })
      );
      expect(tree.nodes()).to.equal(11);
    });

  });

});
