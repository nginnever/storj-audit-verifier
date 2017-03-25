pragma solidity ^0.4.0;

contract verifyStorj {
  /// @title verifyStorj
  
  bytes32 dataRoot;
  bytes32 challengeRoot;
  bytes public hash;
  bytes32 public data1;
  bytes32 public data2;
  bytes32[] public proof; 

  struct mtree {
    uint8 depth;
    bytes32[] leaves;
    bytes32[] rows;
  }
  
  function setData(bytes32 data1, bytes32 data2) {
      
  }
  
  function setProofArray(bytes32 input) {
    proof.push(input);
  }
  
  function merkleAudit(bytes32 data) returns (bool) {
    bytes memory tempHash;
    
    
    tempHash = toBytes(sha256(data));
    hash = tempHash;
    return true;
  }
 
   function toBytes(bytes32 input) constant returns (bytes) {
    bytes memory output = new bytes(32);
    for (uint8 i = 0; i<32; i++) {
      output[i] = input[i];
    }
    return output;
  }
}