'use strict'

var crypto = require('crypto')
var MerkleTree = require('mtree')

// Storj method for generating challenge response merkle tree

const AUDIT_BYTES = 32

var data = 'Dont try to be a great man ... just be a man. Let history make its own judgments'
var shard = {}
shard.data = data

var salt = crypto.randomBytes(AUDIT_BYTES).toString('hex')
var input = crypto.createHash('sha256').update(salt)
input.update(data.toString('hex'))
var preleaf = crypto.createHash('rmd160').update(input.digest('hex')).digest('hex')
var leaf = crypto.createHash('rmd160')
            .update(Buffer(crypto.createHash('sha256')
            .update(preleaf).digest('hex'), 'hex')).digest('hex')

console.log(preleaf)
console.log(leaf)




