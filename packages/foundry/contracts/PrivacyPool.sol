// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IWrappedTokenGatewayV3.sol";
import "./adapters/AaveAdapter.sol";

contract PrivacyPool is AaveAdapter, AccessControl {
    bytes32 public immutable PROTOCOL;

    bytes32 public constant MINTER_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant AAVE = keccak256("AAVE");

    constructor(
        IPoolAddressesProvider _poolAddressesProvider,
        IWrappedTokenGatewayV3 _wethGateway
    ) 
        AaveAdapter(
            _poolAddressesProvider, 
            _wethGateway
        ) 
    {
        PROTOCOL = AAVE;
    }

    function setAaveToken(address _token, address _aaveToken) public onlyRole(MINTER_ROLE) {
        aaveToken[_token] = _aaveToken;
    }
}