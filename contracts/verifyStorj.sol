pragma solidity ^0.4.0;

contract verifyStorj {
  /// @title verifyStorj
  
  bytes rootHash;
  bytes32[] public proof; 

//   struct mtree {
//     uint8 depth;
//     bytes32[] leaves;
//     bytes32[] rows;
//   }
  
  function setProofArray(bytes32 input) {
    proof.push(input);
  }
  
  function merkleAudit(string data) returns (bool) {
    bytes memory tempHash;
    
    tempHash = toBytes(sha256(data));
    
    for (uint8 i = 0; i < proof.length; i++) {
      tempHash = toBytes(sha256(tempHash, proof[i]));
    }

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