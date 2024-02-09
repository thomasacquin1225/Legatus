// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

interface IAaveAdapter {
    function depositToAave(address asset, uint256 amount) external payable;

    function withdrawFromAave(address asset, uint256 amount) external;
}