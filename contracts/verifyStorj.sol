pragma solidity ^0.4.0;

contract verifyStorj {
  /// @title verifyStorj
  /// @author Nathan Ginnever

  struct mtree {
    uint8 depth;
    bytes32[] leaves;
  }

  function hello() returns (bytes32) {
    return 'hello';
  }
}