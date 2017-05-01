pragma solidity ^0.4.0;

library MerkleVerifyv2 {
  
  event auditEvent(bool returnValue);
  
  function audit(uint8 index, bytes32 rootHash, bytes32[] proof) external returns (bool) {
    // use the index to determine the hash order to root
    bytes memory tempHash;
    
    for (uint i = 1; i < proof.length; i++) {
      if(index%2 == 0) {
        tempHash = toBytes(sha3(tempHash, proof[i]));
        index = index/2;
      }
      if(index%2 == 1) {
        tempHash = toBytes(sha3(proof[i], tempHash));
        index = index/2;
      }
    }
    
    auditEvent(equal(tempHash, toBytes(rootHash)));
    return equal(tempHash, toBytes(rootHash));
  }
 
  function toBytes(bytes32 input) constant returns (bytes) {
    bytes memory output = new bytes(32);
    for (uint8 i = 0; i < 32; i++) {
      output[i] = input[i];
    }
    return output;
  }
  
  function equal(bytes memory a, bytes memory b) returns (bool) {
    if (!(a.length == b.length)) {
      return false;
    }
    for (var i = 0; i<a.length; i++) {
      if (!(a[i] == b[i])) {
        return false;
      }
    }
    return true;
  }
}
