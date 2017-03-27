'use strict'

const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
const crypto = require('crypto')
const MerkleTree = require('mtree')
const fsc = require('./fixed-size-chunker')
const fs = require('fs')
const through2 = require('through2')

const AUDIT_BYTES = 32
const CHUNK_SIZE = 64
const testFile = '/Users/voxelot/Github/storj/storj-audit-verifier/test/cat.png'
const abiContract = require('./abi.js')
const address = '0x43f957bd62b04d187fc557267019f831d6bfcb8d'

var data = 'Dont try to be a great man ... just be a man. Let history make its own judgments'
var shard = {}
shard.data = testFile
shard.leaves = []
shard.chunks = []
shard.stream = fs.createReadStream(testFile)

// test proof with tree of depth 3 and 2^3 nodes
// assume all hashes are right children, proving left most node (leaves[0])
var proof = [
  '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
  '6a29472c681be112acbf6d66c521234ae46d85b7167d246d3c13efe8c7b0e54c',
  '5551141cf5b83aad3b4a597d0fa8da8ffcb7b1ab18f3a76b0c06cadaa1584acd'
]

// Chunk the shard data into 64 bytes chunks
// and sha256 them to leaves of a merkle tree
var d = 0
shard.stream
  .pipe(fsc(CHUNK_SIZE))
  .pipe(through2((chunk, enc, cb) => {
    if(d == 0) {
      d++
      var c = getContract(address)
      shard.contract = c
      loadProof(proof)
      var p = verify(chunk.toString('hex'))
     // console.log('root hash')
      //var comp = crypto.createHash('sha256').update('a').digest('hex') < crypto.createHash('sha256').update('b').digest('hex')
      //console.log(comp)
      //console.log(p)
      // hash is input to contract as a hex string
      c.merkleAudit(chunk.toString('hex'), {from:web3.eth.accounts[0], gas:500000})

      //console.log(chunk.toString('hex'))
      //console.log(crypto.createHash('sha256').update(chunk.toString('hex')).digest('hex'))
      //console.log(crypto.createHash('sha256').update(chunk).digest('hex'))
    }
    shard.chunks.push(chunk.toString('hex'))
    shard.leaves.push(crypto.createHash('sha256').update(chunk.toString('hex')).digest('hex'))
    cb()
  }, (cb) => {
    // Pad out remaining leaves to complete perfect binary tree
    for(var i = shard.leaves.length; i < Math.pow(2, _nextPowerOfTwo(shard.leaves.length)); i++) {
      shard.leaves.push(crypto.createHash('sha256').update('0000').digest('hex'))
    }

    // calculate the root hash of the shard merkle tree
    shard.root = generateRoot(shard.leaves)
    console.log(shard.root)
    console.log(crypto.createHash('sha256').update('hello').digest('hex'))
  }))

// var salt = crypto.randomBytes(AUDIT_BYTES).toString('hex')
// var input = crypto.createHash('sha256').update(salt)
// input.update(data.toString('hex'))
// var preleaf = crypto.createHash('rmd160').update(input.digest('hex')).digest('hex')
// var leaf = crypto.createHash('rmd160')
//             .update(Buffer(crypto.createHash('sha256')
//             .update(preleaf).digest('hex'), 'hex')).digest('hex')

// console.log(preleaf)
// console.log(leaf)

function verify(data) {
  var temp;
  temp = crypto.createHash('sha256').update(data).digest('hex')

  for(var i=0; i<proof.length; i++){
    temp = crypto.createHash('sha256').update(temp).update(proof[i]).digest('hex')
  }
  return temp
}

function generateRoot(leaves) {
  var temp = []

  if(leaves.length === 1) {
    return leaves[0]
  }

  for(var i = 0; i < leaves.length; i+=2) {
    var tempHash = crypto.createHash('sha256')
    tempHash.update(leaves[i])
    tempHash.update(leaves[i+1])
    temp.push(tempHash.digest('hex'))
  }

  return generateRoot(temp)
}

function _nextPowerOfTwo(input) {
  var x = 0

  while(input > Math.pow(2, x)) {
    x++
  }

  return x
}

function getContract (addy) {
  var contract = web3.eth.contract(abiContract)
  var inst = contract.at(addy)

  return inst
}

function loadProof(proof) {
  for(var i=0; i< proof.length; i++){
    shard.contract.setProofArray(proof[i], {from:web3.eth.accounts[0], gas:500000})
  }
}



