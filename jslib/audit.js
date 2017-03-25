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
const address = '0xf93db01a6771605f32af40678ebab7b726ec129c'

var data = 'Dont try to be a great man ... just be a man. Let history make its own judgments'
var shard = {}
shard.data = testFile
shard.leaves = []
shard.chunks = []
shard.stream = fs.createReadStream(testFile)

// Chunk the shard data into 64 bytes chunks
// and sha256 them to leaves of a merkle tree
var d = 0
shard.stream
  .pipe(fsc(CHUNK_SIZE))
  .pipe(through2((chunk, enc, cb) => {
    if(d == 0) {
      d++
      console.log(chunk)
      var c = getContract(address)
      // hash is input to contract as a hex string 
      c.merkleAudit(chunk.toString('hex'), {from:web3.eth.accounts[0], gas:500000})
      console.log(chunk.toString('hex'))
      console.log(crypto.createHash('sha256').update(chunk.toString('hex')).digest('hex'))
      //console.log(crypto.createHash('sha256').update(chunk).digest('hex'))
    }
    shard.chunks.push(chunk)
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



