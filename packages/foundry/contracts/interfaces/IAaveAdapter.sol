// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

interface IAaveAdapter {
    function deposit(address _token, uint256 _amount) external;

    function withdraw(address _token, uint256 _amount) external;
}