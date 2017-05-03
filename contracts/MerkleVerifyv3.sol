pragma solidity ^0.4.8;

contract MerkleVerifyv2 {

  event auditEvent(bool returnValue);
  function audit(uint index, bytes32 rootHash, bytes proof) returns (bool) {
    // use the index to determine the node ordering
    // index ranges 1 to n
    
    uint i = index;
    bytes32 tempHash;
    bytes32 preImage;
    
    assembly {
      preImage := mload(add(proof, 32))
    }
    
    for (uint256 j = 64; j <= proof.length; j+=32) {
      assembly {
        tempHash := mload(add(proof, j))
      }
      
      if(i%2 == 1) {
        preImage = sha3(preImage, tempHash);
        i = (i/2) + 1;
      }
      if(i%2 == 0) {
        preImage = sha3(tempHash, preImage);
        i = i/2;
      }
    }
    
    auditEvent(preImage == rootHash);
    return preImage == rootHash;
  }
}
