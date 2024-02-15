// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IWrappedTokenGatewayV3.sol";
import "./interfaces/IVerifier.sol";
import "./adapters/AaveAdapter.sol";

contract PrivacyPool is AaveAdapter, ReentrancyGuardUpgradeable, AccessControlUpgradeable {

    mapping(bytes32 => bool) public isKnownCommitment;
    mapping(bytes32 => bool) public isUsedNullifier;

    bytes32 public PROTOCOL;
    IVerifier public verifier;

    bytes32 public constant AAVE = keccak256("AAVE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");    

    event Deposit(
        address asset,
        uint256 amount,
        bytes32 commitment
    );

    event Withdraw(
        address asset,
        address recipient,
        uint256 amount,
        bytes32 nullifier
    );

    error InvalidAmount();
    error InvalidCommitment();
    error InvalidNullifier();
    error InvalidRoot();
    error InvalidProof();
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

    function deposit(
        address asset, 
        uint256 amount,
        bytes32 commitment
    ) external payable nonReentrant {
        if (asset == address(0)) revert InvalidAsset();
        if (amount == 0) revert InvalidAmount();
        if (isKnownCommitment[commitment]) revert InvalidCommitment();

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
        isKnownCommitment[commitment] = true;
        emit Deposit(asset, amount, commitment);
    }

    function withdraw(
        address asset, 
        address recipient,
        uint256 amount,
        bytes32 nullifier,
        bytes32 root,
        bytes32 subtreeRoot,
        bytes calldata proof,
        bytes calldata subtreeProof
    ) external nonReentrant {
        if (asset == address(0)) revert InvalidAsset();
        if (amount == 0) revert InvalidAmount();
        if (isUsedNullifier[nullifier]) revert InvalidNullifier();
        if (root == bytes32(0) ||
            subtreeRoot == bytes32(0)) revert InvalidRoot();

        bytes32[] memory proofArgs = new bytes32[](2);
        proofArgs[0] = nullifier;
        proofArgs[1] = root;
        if(!verifier.verify(proof, proofArgs)) 
            revert InvalidProof();

        bytes32[] memory subtreeProofArgs = new bytes32[](2);
        subtreeProofArgs[0] = nullifier;
        subtreeProofArgs[1] = subtreeRoot;
        if(!verifier.verify(subtreeProof, proofArgs)) 
            revert InvalidProof();

        if (PROTOCOL == AAVE) {
            IERC20(aaveToken[asset]).transfer(recipient, amount);
        }
        isUsedNullifier[nullifier] = true;
        emit Withdraw(asset, recipient, amount, nullifier);
    }

    function setVerifier(IVerifier _verifier) public onlyRole(OPERATOR_ROLE) {
        verifier = _verifier;
    }

    function setAaveToken(address asset, address aToken) public onlyRole(OPERATOR_ROLE) {
        aaveToken[asset] = aToken;
    }
}