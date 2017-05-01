pragma solidity ^0.4.0;

library MerkleVerifyv2 {
  
  event auditEvent(bool returnValue);
  
  function audit(uint index, bytes32 rootHash, bytes32[] proof) external returns (bool) {
    // use the index to determine the node ordering
    // index ranges 1 to n
    
    uint i = index;
    
    bytes memory tempHash = toBytes(proof[0]);
    
    for (uint j = 1; j < proof.length; j++) {
      if(i%2 == 1) {
        tempHash = toBytes(sha3(tempHash, proof[j]));
        i = (i/2) + 1;
      }
      if(i%2 == 0) {
        tempHash = toBytes(sha3(proof[j], tempHash));
        i = i/2;
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
