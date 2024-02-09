// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IWrappedTokenGatewayV3.sol";
import "./adapters/AaveAdapter.sol";

contract PrivacyPool is AaveAdapter {
    constructor(
        IPoolAddressesProvider _poolAddressesProvider,
        IWrappedTokenGatewayV3 _wethGateway
    ) 
        AaveAdapter(_poolAddressesProvider, _wethGateway) {}
}