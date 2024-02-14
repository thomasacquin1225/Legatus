// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IWrappedTokenGatewayV3.sol";
import "./interfaces/IVerifier.sol";
import "./adapters/AaveAdapter.sol";

contract PrivacyPool is AaveAdapter, ReentrancyGuardUpgradeable, AccessControlUpgradeable {
    mapping(uint256 => bool) public isUsedNullifier;

    IVerifier public verifier;
    bytes32 public PROTOCOL;

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant AAVE = keccak256("AAVE");

    event Deposit(
        address asset,
        uint256 amount,
        uint256 timestamp
    );

    event Withdraw(
        address asset,
        uint256 amount,
        uint256 nullifier
    );

    error InvalidAmount();
    error InvalidNullifier();
    error InsufficientMsgValue();
    error InsufficientAllowanceOrBalance();

    constructor() {}

    function initialize(
        IPoolAddressesProvider _poolAddressesProvider,
        IWrappedTokenGatewayV3 _wethGateway,
        IERC20 _aaveWETH,
        IVerifier _verifier
    ) 
        public 
        initializer 
    {
        poolAddressesProvider = _poolAddressesProvider;
        wethGateway = _wethGateway;
        verifier = _verifier;
        __ReentrancyGuard_init();
        __AccessControl_init();
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, msg.sender);
        PROTOCOL = AAVE;
        aaveToken[ETH_ADDRESS] = address(_aaveWETH);
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

    function withdraw(
        address asset, 
        uint256 amount,
        uint256 nullifier
    ) external nonReentrant {
        if (asset == address(0)) revert InvalidAsset();
        if (amount == 0) revert InvalidAmount();
        if (isUsedNullifier[nullifier]) revert InvalidNullifier();

        if (PROTOCOL == AAVE) {
            IERC20(aaveToken[asset]).transfer(msg.sender, amount);
        }
        isUsedNullifier[nullifier] = true;
        emit Withdraw(asset, amount, nullifier);
    }

    function setAaveToken(address asset, address aToken) public onlyRole(OPERATOR_ROLE) {
        aaveToken[asset] = aToken;
    }

    function setVerifier(IVerifier _verifier) public onlyRole(OPERATOR_ROLE) {
        verifier = _verifier;
    }
}