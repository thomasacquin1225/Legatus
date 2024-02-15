// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract ASP is AccessControl {
    mapping(bytes32 => bool) merkleRoots;
    mapping(bytes32 => bool) subMerkleRoots;
    
    bytes32 public constant ASP_ROLE = keccak256("ASP_ROLE");

    event MerkleRootPublished(bytes32 merkleRoot);
    event SubMerkleRootPublished(bytes32 merkleRoot, bytes32 subMerkleRoot);

    error MerkleRootNotFound();

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ASP_ROLE, msg.sender);
    }

    function publishMerkleRoot(bytes32 merkleRoot) external onlyRole(ASP_ROLE) {
        merkleRoots[merkleRoot] = true;
        emit MerkleRootPublished(merkleRoot);
    }

    function publishSubMerkleRoot(bytes32 merkleRoot, bytes32 subMerkleRoot) external onlyRole(ASP_ROLE) {
        if (!merkleRoots[merkleRoot]) revert MerkleRootNotFound();
        subMerkleRoots[subMerkleRoot] = true;
        emit SubMerkleRootPublished(merkleRoot, subMerkleRoot);
    }

    function isPublished(bytes32 merkleRoot, bytes32 subMerkleRoot) public view returns (bool) {
        return merkleRoots[merkleRoot] && subMerkleRoots[subMerkleRoot];
    }
}