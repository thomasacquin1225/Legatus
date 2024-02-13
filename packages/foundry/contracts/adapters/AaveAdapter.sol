// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IWrappedTokenGatewayV3.sol";

contract AaveAdapter is Initializable {
    address public constant ETH_ADDRESS = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    IWrappedTokenGatewayV3 public wethGateway;
    IPoolAddressesProvider public poolAddressesProvider;

    mapping(address => address) aaveToken;

    error InvalidAsset();

    constructor() {}

    function depositToAave(address asset, uint256 amount) internal {
        if (aaveToken[asset] == address(0)) revert InvalidAsset();

        IPool pool = IPool(poolAddressesProvider.getPool());
        if (asset == ETH_ADDRESS) {
            wethGateway.depositETH{value: amount}(address(pool), address(this), 0);
        } else {
            IERC20 token = IERC20(asset);
            token.transferFrom(msg.sender, address(this), amount);
            token.approve(address(pool), amount);
            pool.supply(asset, amount, address(this), 0);   
        }
    }

    function withdrawFromAave(address asset, uint256 amount) internal {
        if (aaveToken[asset] == address(0)) revert InvalidAsset();
        
        IPool pool = IPool(poolAddressesProvider.getPool());        
        if (asset == ETH_ADDRESS) {
            IERC20(aaveToken[asset]).approve(address(wethGateway), amount);
            wethGateway.withdrawETH(address(pool), amount, address(this));
        } else {
            IERC20(aaveToken[asset]).approve(address(pool), amount);
            pool.withdraw(asset, amount, address(this));
        }
    }

    function getAaveTokenBalance(address asset) public view returns (uint256) {
        return IERC20(aaveToken[asset]).balanceOf(address(this));
    }
}