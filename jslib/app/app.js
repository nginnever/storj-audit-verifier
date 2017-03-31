'use strict'

const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
const crypto = require('crypto')
const MerkleTree = require('mtree')
const fsc = require('../fixed-size-chunker')
const through2 = require('through2')
const fileReaderStream = require('filereader-stream')
const SHA3 = require('browserify-sha3')

const AUDIT_BYTES = 32
const CHUNK_SIZE = 64
const abiContract = require('../abi.js')
const address = '0xfc37026f3eec848ee36bde69df1ababf93f83c66'

function merkleApp(shard) {
  // Chunk the shard data into 64 bytes chunks
  // and sha256 them to leaves of a merkle tree
  this.shard = shard
  this.shard.chunks = []
  this.shard.leaves = []
  this.shard.levels = []
  this.shard.nodes = []
  this.shard.edges = []
  this.shard.proof = []
  this.shard.preImage = false
  this.shard.cost = 0
}

merkleApp.prototype.generateProof = function(index, cb) {
  var ind = index
  var self = this
  var proof = []
  var proofString = '0x'
  var proofCode = []
  var inst = getContract(address)
  var proofHash
  for(var i=0; i< 64-(self.shard.levels.length-1); i++){
    proofString+='0'
  }

  for(var i=0; i < this.shard.levels.length-1; i++){
    if(index%2 === 0){
      // supply right child for proof
      // indicate with 0
      var t = index
      t++
      proofHash = this.shard.levels[i][t]
      proof.push('0x'+proofHash)
      proofString+='0'
    } else {
      // supply left child for proof 1
      proofHash = this.shard.levels[i][index-1]
      proof.push('0x'+proofHash)
      proofString+='1'
    }
    index = Math.floor(index/2)
  }
  console.log(proofString)
  proofCode.push(proofString)
  proof.unshift(proofCode)

  try{
    self.shard.cost = web3.eth.getBalance(web3.eth.accounts[0])
    inst.merkleAudit(this.shard.chunks[ind], this.shard.root, this.shard.proof, {from: web3.eth.accounts[0], gas:200000})
  }catch(e){}
  

  var events = inst.allEvents()
  events.watch(function(error, event){
    if (error) {
      console.log("Error: " + error);
    } else {
      try{
        self.shard.cost = self.shard.cost - web3.eth.getBalance(web3.eth.accounts[0])
      }catch(e){}
      console.log(event.event + ": " + JSON.stringify(event.args));
      console.log(self.shard.cost)
      var c = self.shard.cost
      self.shard.cost = 0
      events = null
      return cb('audit cost: '+c+' wei')
    }
  })
  console.log(proof)
  console.log(this.shard.root)
  return proof
}

merkleApp.prototype.generateNodes = function(stream, callback){
  var self = this
  var cSize = self.shard.chunkSize || CHUNK_SIZE
  stream
    .pipe(fsc(cSize))
    .pipe(through2((chunk, enc, cb) => {
      self.shard.chunks.push(chunk.toString('hex'))
      var d = new SHA3.SHA3Hash(256)
      self.shard.leaves.push(d.update(chunk.toString('hex')).digest('hex'))
      cb()
    }, (cb) => {
      // Pad out remaining leaves to complete perfect binary tree
      for(var i = self.shard.leaves.length; i < Math.pow(2, _nextPowerOfTwo(self.shard.leaves.length)); i++) {
        var d = new SHA3.SHA3Hash(256)
        self.shard.leaves.push(d.update(crypto.randomBytes(64).toString('hex')).digest('hex'))
      }

      self.shard.levels.push(self.shard.leaves)

      // calculate the root hash of the shard merkle tree
      generateTree(self.shard, self.shard.leaves)
      return callback(self.shard)
    }))
}

function verify(data) {
  var temp;
  var d = new SHA3.SHA3Hash(256)
  temp = d.update(data).digest('hex')

  for(var i=0; i<proof.length; i++){
    var d = new SHA3.SHA3Hash(256)
    temp = d.update(temp).update(proof[i]).digest('hex')
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

    var tempHash = new SHA3.SHA3Hash(256)
    tempHash.update(leaves[i])
    tempHash.update(leaves[i+1])
    tempHash = tempHash.digest('hex')

    shard.edges.push({ data: { source: tempHash, target: leaves[i] } })
    shard.edges.push({ data: { source: tempHash, target: leaves[i+1] } })

    temp.push(tempHash)
  }
  
  shard.preImage = true
  shard.levels.push(temp)
  return generateTree(shard, temp)
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

module.exports = merkleApp
