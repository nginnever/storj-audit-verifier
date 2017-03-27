'use strict'

const crypto = require('crypto')
const MerkleTree = require('mtree')
const fsc = require('../fixed-size-chunker')
const through2 = require('through2')
const fileReaderStream = require('filereader-stream')

const AUDIT_BYTES = 32
const CHUNK_SIZE = 64

function merkleApp(stream, callback) {
  console.log(stream)
  // Chunk the shard data into 64 bytes chunks
  // and sha256 them to leaves of a merkle tree
  var shard = {}
  shard.chunks = []
  shard.leaves = []
  shard.nodes = []
  shard.edges = []
  shard.preImage = false

  stream
    .pipe(fsc(CHUNK_SIZE))
    .pipe(through2((chunk, enc, cb) => {
      shard.chunks.push(chunk.toString('hex'))
      shard.leaves.push(crypto.createHash('sha256').update(chunk.toString('hex')).digest('hex'))
      cb()
    }, (cb) => {
      // Pad out remaining leaves to complete perfect binary tree
      for(var i = shard.leaves.length; i < Math.pow(2, _nextPowerOfTwo(shard.leaves.length)); i++) {
        shard.leaves.push(crypto.createHash('sha256').update(crypto.randomBytes(64).toString('hex')).digest('hex'))
      }

      // calculate the root hash of the shard merkle tree
      generateTree(shard, shard.leaves)
      console.log(shard.root)
      //console.log(shard.nodes)
      return callback(shard)
    }))
}

function verify(data) {
  var temp;
  temp = crypto.createHash('sha256').update(data).digest('hex')

  for(var i=0; i<proof.length; i++){
    temp = crypto.createHash('sha256').update(temp).update(proof[i]).digest('hex')
  }
  return temp
}

function generateTree(shard, leaves) {
  var temp = []
  var d = 0

  if(leaves.length === 1) {
    shard.nodes.push({ data: { id: leaves[0], trim: leaves[0], align:'top', color: '#11479e' } })
    shard.root = leaves[0]
    return 
  }

  for(var i = 0; i < leaves.length; i+=2) {
    if(shard.preImage === false){
      shard.nodes.push({ data: { id: i, trim: i, align:'bottom', color: '#e6e600'} })
      shard.nodes.push({ data: { id: i+1, trim: i+1, align:'bottom', color: '#e6e600'} })
      shard.edges.push({ data: { source: leaves[i], target: i } })
      shard.edges.push({ data: { source: leaves[i+1], target: i+1 } })
    }

    shard.nodes.push({ data: { id: leaves[i], trim: leaves[i].substring(0,3)+'...', align:'top', color: '#11479e'} })
    shard.nodes.push({ data: { id: leaves[i+1], trim: leaves[i+1].substring(0,3)+'...', align:'top', color: '#11479e'} })

    var tempHash = crypto.createHash('sha256')
    tempHash.update(leaves[i])
    tempHash.update(leaves[i+1])
    tempHash = tempHash.digest('hex')

    shard.edges.push({ data: { source: tempHash, target: leaves[i] } })
    shard.edges.push({ data: { source: tempHash, target: leaves[i+1] } })

    temp.push(tempHash)
  }
  
  shard.preImage = true
  return generateTree(shard, temp)
}

function _nextPowerOfTwo(input) {
  var x = 0
  while(input > Math.pow(2, x)) {
    x++
  }
  return x
}

module.exports = merkleApp
