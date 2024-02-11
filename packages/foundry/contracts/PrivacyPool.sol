// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IWrappedTokenGatewayV3.sol";
import "./interfaces/IVerifier.sol";
import "./adapters/AaveAdapter.sol";

contract PrivacyPool is AaveAdapter, ReentrancyGuard, AccessControl {
    IVerifier public verifier;

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant AAVE = keccak256("AAVE");

    bytes32 public immutable PROTOCOL;

    event Deposit(
        address asset,
        uint256 amount,
        uint256 timestamp
    );

    event Withdraw(
        address asset,
        uint256 amount,
        uint256 timestamp
    );

    error InvalidAmount();
    error InsufficientMsgValue();
    error InsufficientAllowanceOrBalance();

    constructor(
        IPoolAddressesProvider _poolAddressesProvider,
        IWrappedTokenGatewayV3 _wethGateway,
        IVerifier _verifier
    ) 
        AaveAdapter(
            _poolAddressesProvider, 
            _wethGateway
        ) 
    {
        PROTOCOL = AAVE;
        verifier = _verifier;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, msg.sender);
    }

    function deposit(address asset, uint256 amount) external payable nonReentrant {
        if (asset == address(0)) revert InvalidAsset();
        if (amount == 0) revert InvalidAmount();

        if (asset == ETH_ADDRESS) {
            if (msg.value < amount) revert InsufficientMsgValue();
        } else {
            if (
                IERC20(asset).balanceOf(msg.sender) < amount ||
                IERC20(asset).allowance(msg.sender, address(this)) < amount
            ) 
                revert InsufficientAllowanceOrBalance();
        }

        if (PROTOCOL == AAVE) {
            depositToAave(asset, amount);
        }
        emit Deposit(asset, amount, block.timestamp);
    }

    function withdraw(address asset, uint256 amount) external nonReentrant {
        if (asset == address(0)) revert InvalidAsset();
        if (amount == 0) revert InvalidAmount();

        if (PROTOCOL == AAVE) {
            IERC20(aaveToken[asset]).transferFrom(address(this), msg.sender, amount);
        }
        emit Withdraw(asset, amount, block.timestamp);
    }

    function setAaveToken(address asset, address aToken) public onlyRole(OPERATOR_ROLE) {
        aaveToken[asset] = aToken;
    }

    function setVerifier(IVerifier _verifier) public onlyRole(OPERATOR_ROLE) {
        verifier = _verifier;
    }
}