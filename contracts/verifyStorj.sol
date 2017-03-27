pragma solidity ^0.4.0;

contract verifyStorj {
  /// @title verifyStorj

  event auditEvent(bool returnValue);
  
  function merkleAudit(string data, bytes rootHash, bytes32[] proof) returns (bool) {
    bytes memory tempHash;
    tempHash = toBytes(sha3(data));
    
    for (uint i = 0; i < proof.length; i++) {
      if(proof[i+1] == '0x0') {
        tempHash = toBytes(sha3(proof[i], tempHash));
      }
      if(proof[i+1] == '0x1') {
        tempHash = toBytes(sha3(tempHash, proof[i]));
      }
    }
    
    auditEvent(equal(tempHash, rootHash));
    return equal(tempHash, rootHash);
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