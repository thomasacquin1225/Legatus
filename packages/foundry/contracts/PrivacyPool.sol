// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./adapters/AaveAdapter.sol";

contract PrivacyPool is AaveAdapter {
    constructor(IPoolAddressesProvider _poolAddressesProvider) AaveAdapter(_poolAddressesProvider) {
    }
}