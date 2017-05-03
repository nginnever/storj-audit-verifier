pragma solidity ^0.4.8;

contract MerkleVerifyv3 {
  
  event auditEvent(bool returnValue);
  function audit(uint index, bytes32 rootHash, bytes proof) returns (bool) {
    // use the index to determine the node ordering
    // index ranges 1 to n
    
    bytes32 tempHash;
    bytes32 preImage;
    
    assembly {
      preImage := mload(add(proof, 32))
    }
    
    for (uint256 j = 64; j <= proof.length; j+=32) {
      assembly {
        tempHash := mload(add(proof, j))
      }
      
      if(index%2 == 0) {
        preImage = sha3(tempHash, preImage);
        index = index/2;
      } else {
        preImage = sha3(preImage, tempHash);
        index = uint(index)/2 + 1;
      }
 
    }
    
    auditEvent(preImage == rootHash);
    return preImage == rootHash;
  }
}
