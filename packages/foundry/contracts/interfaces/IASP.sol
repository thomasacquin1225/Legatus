// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

interface IASP {
    function isPublished(bytes32 merkleRoot, bytes32 subMerkleRoot) external view returns (bool);
}