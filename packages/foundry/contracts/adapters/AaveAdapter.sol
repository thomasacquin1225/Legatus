// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import "../interfaces/IAaveAdapter.sol";

contract AaveAdapter {
    IPoolAddressesProvider public immutable poolAddressesProvider;

    constructor(IPoolAddressesProvider _poolAddressesProvider) {
        poolAddressesProvider = _poolAddressesProvider;
    }
}