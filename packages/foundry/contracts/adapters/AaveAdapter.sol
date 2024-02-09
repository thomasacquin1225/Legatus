// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IWrappedTokenGatewayV3.sol";
import "../interfaces/IAaveAdapter.sol";

contract AaveAdapter is IAaveAdapter {
    IWrappedTokenGatewayV3 wethGateway;

    IPoolAddressesProvider public immutable poolAddressesProvider;
    mapping(address => address) public aaveToken;

    constructor(
        IPoolAddressesProvider _poolAddressesProvider,
        IWrappedTokenGatewayV3 _wethGateway
    ) {
        poolAddressesProvider = _poolAddressesProvider;
        wethGateway = _wethGateway;
    }

    function depositToAave(address asset, uint256 amount) public payable {
        IPool pool = IPool(poolAddressesProvider.getPool());
        if (asset == address(0)) {
            wethGateway.depositETH{value: amount}(address(pool), address(this), 0);
        } else {
            IERC20 token = IERC20(asset);
            token.transferFrom(msg.sender, address(this), amount);
            token.approve(address(pool), amount);
            pool.supply(asset, amount, address(this), 0);   
        }
    }

    function withdrawFromAave(address asset, uint256 amount) public {
        IPool pool = IPool(poolAddressesProvider.getPool());        
        if (asset == address(0)) {
            IERC20(aaveToken[asset]).approve(address(wethGateway), amount);
            wethGateway.withdrawETH(address(pool), amount, address(this));
        } else {
            IERC20(aaveToken[asset]).approve(address(pool), amount);
            pool.withdraw(asset, amount, address(this));
        }
    }
}