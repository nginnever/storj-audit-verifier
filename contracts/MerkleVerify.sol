pragma solidity ^0.4.0;

contract MerkleVerify {
  
  event auditEvent(bool returnValue);
  
  function audit(bytes chunk, bytes32 rootHash, bytes32[] proof) external returns (bool) {
    bytes memory tempHash;
    tempHash = toBytes(sha3(chunk));
    
    for (uint i = 1; i < proof.length; i++) {
      if(proof[0][i-1] == 0x00) {
        tempHash = toBytes(sha3(tempHash, proof[i]));
      }
      if(proof[0][i-1] == 0x01) {
        tempHash = toBytes(sha3(proof[i], tempHash));
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
