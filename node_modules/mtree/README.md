Mtree
=====

JavaScript implementation of [Merkle Trees](https://en.wikipedia.org/wiki/Merkle_tree).

[![Build Status](https://img.shields.io/travis/gordonwritescode/mtree.svg?style=flat-square)](https://travis-ci.org/gordonwritescode/mtree)
[![Coverage Status](https://img.shields.io/coveralls/gordonwritescode/mtree.svg?style=flat-square)](https://coveralls.io/r/gordonwritescode/mtree)
[![NPM](https://img.shields.io/npm/v/mtree.svg?style=flat-square)](https://www.npmjs.com/package/mtree)

Usage
-----

Install with NPM.

```bash
npm install mtree --save
```

Use in your project.

```js
var MerkleTree = require('mtree');
var tree = new MerkleTree([/* input hashes */]);

tree.depth(); // returns the tree depth
tree.levels(); // return the number of levels in tree
tree.level(2); // returns the nodes at the given level
tree.root(); // returns the merkle root for the tree
tree.nodes(); // returns the number of nodes in the tree
```

Run the tests.

```bash
npm run testsuite
npm run linter
npm run coverage
```
