// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract ASP is AccessControl{
    mapping(bytes32 => bool) merkleRoots;
    mapping(bytes32 => bool) subMerkleRoots;
    bytes32 public constant ASP_ROLE = keccak256("ASP_ROLE");

    error MerkleRootNotFound();

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ASP_ROLE, msg.sender);
    }

    function publishMerkleRoot(bytes32 _merkleRoot) external onlyRole(ASP_ROLE) {
        merkleRoots[_merkleRoot] = true;
    }

    function publishSubMerkleRoot(bytes32 _merkleRoot, bytes32 _subMerkleRoot) external onlyRole(ASP_ROLE) {
        if (!merkleRoots[_merkleRoot]) revert MerkleRootNotFound();
        subMerkleRoots[_subMerkleRoot] = true;
    }

    function isPublished(bytes32 _merkleRoot, bytes32 _subMerkleRoot) external view returns (bool) {
        return merkleRoots[_merkleRoot] && subMerkleRoots[_subMerkleRoot];
    }
}