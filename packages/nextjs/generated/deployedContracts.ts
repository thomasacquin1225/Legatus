const contracts = {
  31337: [
    {
      name: "Anvil",
      chainId: "31337",
      contracts: {
        UltraVerifier: {
          address: "0x79E8AB29Ff79805025c9462a2f2F12e9A496f81d",
          abi: [
            {
              type: "function",
              name: "getVerificationKeyHash",
              inputs: [],
              outputs: [
                {
                  name: "",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
              stateMutability: "pure",
            },
            {
              type: "function",
              name: "verify",
              inputs: [
                {
                  name: "_proof",
                  type: "bytes",
                  internalType: "bytes",
                },
                {
                  name: "_publicInputs",
                  type: "bytes32[]",
                  internalType: "bytes32[]",
                },
              ],
              outputs: [
                {
                  name: "",
                  type: "bool",
                  internalType: "bool",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "error",
              name: "EC_SCALAR_MUL_FAILURE",
              inputs: [],
            },
            {
              type: "error",
              name: "MOD_EXP_FAILURE",
              inputs: [],
            },
            {
              type: "error",
              name: "PROOF_FAILURE",
              inputs: [],
            },
            {
              type: "error",
              name: "PUBLIC_INPUT_COUNT_INVALID",
              inputs: [
                {
                  name: "expected",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "actual",
                  type: "uint256",
                  internalType: "uint256",
                },
              ],
            },
            {
              type: "error",
              name: "PUBLIC_INPUT_GE_P",
              inputs: [],
            },
            {
              type: "error",
              name: "PUBLIC_INPUT_INVALID_BN128_G1_POINT",
              inputs: [],
            },
          ],
        },
        ASP: {
          address: "0x0Dd99d9f56A14E9D53b2DdC62D9f0bAbe806647A",
          abi: [
            {
              type: "constructor",
              inputs: [],
              stateMutability: "nonpayable",
            },
            {
              type: "function",
              name: "ASP_ROLE",
              inputs: [],
              outputs: [
                {
                  name: "",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "DEFAULT_ADMIN_ROLE",
              inputs: [],
              outputs: [
                {
                  name: "",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "getRoleAdmin",
              inputs: [
                {
                  name: "role",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
              outputs: [
                {
                  name: "",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "grantRole",
              inputs: [
                {
                  name: "role",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "account",
                  type: "address",
                  internalType: "address",
                },
              ],
              outputs: [],
              stateMutability: "nonpayable",
            },
            {
              type: "function",
              name: "hasRole",
              inputs: [
                {
                  name: "role",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "account",
                  type: "address",
                  internalType: "address",
                },
              ],
              outputs: [
                {
                  name: "",
                  type: "bool",
                  internalType: "bool",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "isPublished",
              inputs: [
                {
                  name: "merkleRoot",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "subMerkleRoot",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
              outputs: [
                {
                  name: "",
                  type: "bool",
                  internalType: "bool",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "publishMerkleRoot",
              inputs: [
                {
                  name: "merkleRoot",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
              outputs: [],
              stateMutability: "nonpayable",
            },
            {
              type: "function",
              name: "publishSubMerkleRoot",
              inputs: [
                {
                  name: "merkleRoot",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "subMerkleRoot",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
              outputs: [],
              stateMutability: "nonpayable",
            },
            {
              type: "function",
              name: "renounceRole",
              inputs: [
                {
                  name: "role",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "callerConfirmation",
                  type: "address",
                  internalType: "address",
                },
              ],
              outputs: [],
              stateMutability: "nonpayable",
            },
            {
              type: "function",
              name: "revokeRole",
              inputs: [
                {
                  name: "role",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "account",
                  type: "address",
                  internalType: "address",
                },
              ],
              outputs: [],
              stateMutability: "nonpayable",
            },
            {
              type: "function",
              name: "supportsInterface",
              inputs: [
                {
                  name: "interfaceId",
                  type: "bytes4",
                  internalType: "bytes4",
                },
              ],
              outputs: [
                {
                  name: "",
                  type: "bool",
                  internalType: "bool",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "event",
              name: "MerkleRootPublished",
              inputs: [
                {
                  name: "merkleRoot",
                  type: "bytes32",
                  indexed: false,
                  internalType: "bytes32",
                },
              ],
              anonymous: false,
            },
            {
              type: "event",
              name: "RoleAdminChanged",
              inputs: [
                {
                  name: "role",
                  type: "bytes32",
                  indexed: true,
                  internalType: "bytes32",
                },
                {
                  name: "previousAdminRole",
                  type: "bytes32",
                  indexed: true,
                  internalType: "bytes32",
                },
                {
                  name: "newAdminRole",
                  type: "bytes32",
                  indexed: true,
                  internalType: "bytes32",
                },
              ],
              anonymous: false,
            },
            {
              type: "event",
              name: "RoleGranted",
              inputs: [
                {
                  name: "role",
                  type: "bytes32",
                  indexed: true,
                  internalType: "bytes32",
                },
                {
                  name: "account",
                  type: "address",
                  indexed: true,
                  internalType: "address",
                },
                {
                  name: "sender",
                  type: "address",
                  indexed: true,
                  internalType: "address",
                },
              ],
              anonymous: false,
            },
            {
              type: "event",
              name: "RoleRevoked",
              inputs: [
                {
                  name: "role",
                  type: "bytes32",
                  indexed: true,
                  internalType: "bytes32",
                },
                {
                  name: "account",
                  type: "address",
                  indexed: true,
                  internalType: "address",
                },
                {
                  name: "sender",
                  type: "address",
                  indexed: true,
                  internalType: "address",
                },
              ],
              anonymous: false,
            },
            {
              type: "event",
              name: "SubMerkleRootPublished",
              inputs: [
                {
                  name: "merkleRoot",
                  type: "bytes32",
                  indexed: false,
                  internalType: "bytes32",
                },
                {
                  name: "subMerkleRoot",
                  type: "bytes32",
                  indexed: false,
                  internalType: "bytes32",
                },
              ],
              anonymous: false,
            },
            {
              type: "error",
              name: "AccessControlBadConfirmation",
              inputs: [],
            },
            {
              type: "error",
              name: "AccessControlUnauthorizedAccount",
              inputs: [
                {
                  name: "account",
                  type: "address",
                  internalType: "address",
                },
                {
                  name: "neededRole",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
            },
            {
              type: "error",
              name: "MerkleRootNotFound",
              inputs: [],
            },
          ],
        },
        PrivacyPool: {
          address: "0xeAd789bd8Ce8b9E94F5D0FCa99F8787c7e758817",
          abi: [
            {
              type: "constructor",
              inputs: [],
              stateMutability: "nonpayable",
            },
            {
              type: "function",
              name: "AAVE",
              inputs: [],
              outputs: [
                {
                  name: "",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "DEFAULT_ADMIN_ROLE",
              inputs: [],
              outputs: [
                {
                  name: "",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "ETH_ADDRESS",
              inputs: [],
              outputs: [
                {
                  name: "",
                  type: "address",
                  internalType: "address",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "OPERATOR_ROLE",
              inputs: [],
              outputs: [
                {
                  name: "",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "PROTOCOL",
              inputs: [],
              outputs: [
                {
                  name: "",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "asp",
              inputs: [],
              outputs: [
                {
                  name: "",
                  type: "address",
                  internalType: "contract IASP",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "deposit",
              inputs: [
                {
                  name: "asset",
                  type: "address",
                  internalType: "address",
                },
                {
                  name: "amount",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "commitment",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
              outputs: [],
              stateMutability: "payable",
            },
            {
              type: "function",
              name: "getAaveTokenBalance",
              inputs: [
                {
                  name: "asset",
                  type: "address",
                  internalType: "address",
                },
              ],
              outputs: [
                {
                  name: "",
                  type: "uint256",
                  internalType: "uint256",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "getRoleAdmin",
              inputs: [
                {
                  name: "role",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
              outputs: [
                {
                  name: "",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "grantRole",
              inputs: [
                {
                  name: "role",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "account",
                  type: "address",
                  internalType: "address",
                },
              ],
              outputs: [],
              stateMutability: "nonpayable",
            },
            {
              type: "function",
              name: "hasRole",
              inputs: [
                {
                  name: "role",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "account",
                  type: "address",
                  internalType: "address",
                },
              ],
              outputs: [
                {
                  name: "",
                  type: "bool",
                  internalType: "bool",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "initialize",
              inputs: [
                {
                  name: "_poolAddressesProvider",
                  type: "address",
                  internalType: "contract IPoolAddressesProvider",
                },
                {
                  name: "_wethGateway",
                  type: "address",
                  internalType: "contract IWrappedTokenGatewayV3",
                },
                {
                  name: "_aaveWETH",
                  type: "address",
                  internalType: "contract IERC20",
                },
                {
                  name: "_asp",
                  type: "address",
                  internalType: "contract IASP",
                },
                {
                  name: "_verifier",
                  type: "address",
                  internalType: "contract IVerifier",
                },
              ],
              outputs: [],
              stateMutability: "nonpayable",
            },
            {
              type: "function",
              name: "isKnownCommitment",
              inputs: [
                {
                  name: "",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
              outputs: [
                {
                  name: "",
                  type: "bool",
                  internalType: "bool",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "isUsedNullifier",
              inputs: [
                {
                  name: "",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
              outputs: [
                {
                  name: "",
                  type: "bool",
                  internalType: "bool",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "poolAddressesProvider",
              inputs: [],
              outputs: [
                {
                  name: "",
                  type: "address",
                  internalType: "contract IPoolAddressesProvider",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "renounceRole",
              inputs: [
                {
                  name: "role",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "callerConfirmation",
                  type: "address",
                  internalType: "address",
                },
              ],
              outputs: [],
              stateMutability: "nonpayable",
            },
            {
              type: "function",
              name: "revokeRole",
              inputs: [
                {
                  name: "role",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "account",
                  type: "address",
                  internalType: "address",
                },
              ],
              outputs: [],
              stateMutability: "nonpayable",
            },
            {
              type: "function",
              name: "setASP",
              inputs: [
                {
                  name: "_asp",
                  type: "address",
                  internalType: "contract IASP",
                },
              ],
              outputs: [],
              stateMutability: "nonpayable",
            },
            {
              type: "function",
              name: "setAaveToken",
              inputs: [
                {
                  name: "asset",
                  type: "address",
                  internalType: "address",
                },
                {
                  name: "aToken",
                  type: "address",
                  internalType: "address",
                },
              ],
              outputs: [],
              stateMutability: "nonpayable",
            },
            {
              type: "function",
              name: "setVerifier",
              inputs: [
                {
                  name: "_verifier",
                  type: "address",
                  internalType: "contract IVerifier",
                },
              ],
              outputs: [],
              stateMutability: "nonpayable",
            },
            {
              type: "function",
              name: "supportsInterface",
              inputs: [
                {
                  name: "interfaceId",
                  type: "bytes4",
                  internalType: "bytes4",
                },
              ],
              outputs: [
                {
                  name: "",
                  type: "bool",
                  internalType: "bool",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "verifier",
              inputs: [],
              outputs: [
                {
                  name: "",
                  type: "address",
                  internalType: "contract IVerifier",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "wethGateway",
              inputs: [],
              outputs: [
                {
                  name: "",
                  type: "address",
                  internalType: "contract IWrappedTokenGatewayV3",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "withdraw",
              inputs: [
                {
                  name: "asset",
                  type: "address",
                  internalType: "address",
                },
                {
                  name: "recipient",
                  type: "address",
                  internalType: "address",
                },
                {
                  name: "amount",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "nullifier",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "root",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "subtreeRoot",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "proof",
                  type: "bytes",
                  internalType: "bytes",
                },
                {
                  name: "subtreeProof",
                  type: "bytes",
                  internalType: "bytes",
                },
              ],
              outputs: [],
              stateMutability: "nonpayable",
            },
            {
              type: "event",
              name: "Deposit",
              inputs: [
                {
                  name: "depositor",
                  type: "address",
                  indexed: false,
                  internalType: "address",
                },
                {
                  name: "asset",
                  type: "address",
                  indexed: false,
                  internalType: "address",
                },
                {
                  name: "amount",
                  type: "uint256",
                  indexed: false,
                  internalType: "uint256",
                },
                {
                  name: "commitment",
                  type: "bytes32",
                  indexed: false,
                  internalType: "bytes32",
                },
              ],
              anonymous: false,
            },
            {
              type: "event",
              name: "Initialized",
              inputs: [
                {
                  name: "version",
                  type: "uint64",
                  indexed: false,
                  internalType: "uint64",
                },
              ],
              anonymous: false,
            },
            {
              type: "event",
              name: "RoleAdminChanged",
              inputs: [
                {
                  name: "role",
                  type: "bytes32",
                  indexed: true,
                  internalType: "bytes32",
                },
                {
                  name: "previousAdminRole",
                  type: "bytes32",
                  indexed: true,
                  internalType: "bytes32",
                },
                {
                  name: "newAdminRole",
                  type: "bytes32",
                  indexed: true,
                  internalType: "bytes32",
                },
              ],
              anonymous: false,
            },
            {
              type: "event",
              name: "RoleGranted",
              inputs: [
                {
                  name: "role",
                  type: "bytes32",
                  indexed: true,
                  internalType: "bytes32",
                },
                {
                  name: "account",
                  type: "address",
                  indexed: true,
                  internalType: "address",
                },
                {
                  name: "sender",
                  type: "address",
                  indexed: true,
                  internalType: "address",
                },
              ],
              anonymous: false,
            },
            {
              type: "event",
              name: "RoleRevoked",
              inputs: [
                {
                  name: "role",
                  type: "bytes32",
                  indexed: true,
                  internalType: "bytes32",
                },
                {
                  name: "account",
                  type: "address",
                  indexed: true,
                  internalType: "address",
                },
                {
                  name: "sender",
                  type: "address",
                  indexed: true,
                  internalType: "address",
                },
              ],
              anonymous: false,
            },
            {
              type: "event",
              name: "Withdraw",
              inputs: [
                {
                  name: "recipient",
                  type: "address",
                  indexed: false,
                  internalType: "address",
                },
                {
                  name: "asset",
                  type: "address",
                  indexed: false,
                  internalType: "address",
                },
                {
                  name: "amount",
                  type: "uint256",
                  indexed: false,
                  internalType: "uint256",
                },
                {
                  name: "nullifier",
                  type: "bytes32",
                  indexed: false,
                  internalType: "bytes32",
                },
                {
                  name: "root",
                  type: "bytes32",
                  indexed: false,
                  internalType: "bytes32",
                },
                {
                  name: "subtreeRoot",
                  type: "bytes32",
                  indexed: false,
                  internalType: "bytes32",
                },
              ],
              anonymous: false,
            },
            {
              type: "error",
              name: "AccessControlBadConfirmation",
              inputs: [],
            },
            {
              type: "error",
              name: "AccessControlUnauthorizedAccount",
              inputs: [
                {
                  name: "account",
                  type: "address",
                  internalType: "address",
                },
                {
                  name: "neededRole",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
            },
            {
              type: "error",
              name: "InsufficientAllowanceOrBalance",
              inputs: [],
            },
            {
              type: "error",
              name: "InsufficientMsgValue",
              inputs: [],
            },
            {
              type: "error",
              name: "InvalidAmount",
              inputs: [],
            },
            {
              type: "error",
              name: "InvalidAsset",
              inputs: [],
            },
            {
              type: "error",
              name: "InvalidCommitment",
              inputs: [],
            },
            {
              type: "error",
              name: "InvalidInitialization",
              inputs: [],
            },
            {
              type: "error",
              name: "InvalidNullifier",
              inputs: [],
            },
            {
              type: "error",
              name: "InvalidProof",
              inputs: [],
            },
            {
              type: "error",
              name: "InvalidRoot",
              inputs: [],
            },
            {
              type: "error",
              name: "NotInitializing",
              inputs: [],
            },
            {
              type: "error",
              name: "ReentrancyGuardReentrantCall",
              inputs: [],
            },
          ],
        },
      },
    },
  ],
  534351: [
    {
      name: "scrollSepolia",
      chainId: "534351",
      contracts: {
        UltraVerifier: {
          address: "0x763e001F6cC30ebA4DeBfFf35910932e523dECd7",
          abi: [
            {
              type: "function",
              name: "getVerificationKeyHash",
              inputs: [],
              outputs: [
                {
                  name: "",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
              stateMutability: "pure",
            },
            {
              type: "function",
              name: "verify",
              inputs: [
                {
                  name: "_proof",
                  type: "bytes",
                  internalType: "bytes",
                },
                {
                  name: "_publicInputs",
                  type: "bytes32[]",
                  internalType: "bytes32[]",
                },
              ],
              outputs: [
                {
                  name: "",
                  type: "bool",
                  internalType: "bool",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "error",
              name: "EC_SCALAR_MUL_FAILURE",
              inputs: [],
            },
            {
              type: "error",
              name: "MOD_EXP_FAILURE",
              inputs: [],
            },
            {
              type: "error",
              name: "PROOF_FAILURE",
              inputs: [],
            },
            {
              type: "error",
              name: "PUBLIC_INPUT_COUNT_INVALID",
              inputs: [
                {
                  name: "expected",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "actual",
                  type: "uint256",
                  internalType: "uint256",
                },
              ],
            },
            {
              type: "error",
              name: "PUBLIC_INPUT_GE_P",
              inputs: [],
            },
            {
              type: "error",
              name: "PUBLIC_INPUT_INVALID_BN128_G1_POINT",
              inputs: [],
            },
          ],
        },
        ASP: {
          address: "0xF7D885543e7cf6c6bCBFF726478ed0C90B0d9df4",
          abi: [
            {
              type: "constructor",
              inputs: [],
              stateMutability: "nonpayable",
            },
            {
              type: "function",
              name: "ASP_ROLE",
              inputs: [],
              outputs: [
                {
                  name: "",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "DEFAULT_ADMIN_ROLE",
              inputs: [],
              outputs: [
                {
                  name: "",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "getRoleAdmin",
              inputs: [
                {
                  name: "role",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
              outputs: [
                {
                  name: "",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "grantRole",
              inputs: [
                {
                  name: "role",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "account",
                  type: "address",
                  internalType: "address",
                },
              ],
              outputs: [],
              stateMutability: "nonpayable",
            },
            {
              type: "function",
              name: "hasRole",
              inputs: [
                {
                  name: "role",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "account",
                  type: "address",
                  internalType: "address",
                },
              ],
              outputs: [
                {
                  name: "",
                  type: "bool",
                  internalType: "bool",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "isPublished",
              inputs: [
                {
                  name: "merkleRoot",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "subMerkleRoot",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
              outputs: [
                {
                  name: "",
                  type: "bool",
                  internalType: "bool",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "publishMerkleRoot",
              inputs: [
                {
                  name: "merkleRoot",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
              outputs: [],
              stateMutability: "nonpayable",
            },
            {
              type: "function",
              name: "publishSubMerkleRoot",
              inputs: [
                {
                  name: "merkleRoot",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "subMerkleRoot",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
              outputs: [],
              stateMutability: "nonpayable",
            },
            {
              type: "function",
              name: "renounceRole",
              inputs: [
                {
                  name: "role",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "callerConfirmation",
                  type: "address",
                  internalType: "address",
                },
              ],
              outputs: [],
              stateMutability: "nonpayable",
            },
            {
              type: "function",
              name: "revokeRole",
              inputs: [
                {
                  name: "role",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "account",
                  type: "address",
                  internalType: "address",
                },
              ],
              outputs: [],
              stateMutability: "nonpayable",
            },
            {
              type: "function",
              name: "supportsInterface",
              inputs: [
                {
                  name: "interfaceId",
                  type: "bytes4",
                  internalType: "bytes4",
                },
              ],
              outputs: [
                {
                  name: "",
                  type: "bool",
                  internalType: "bool",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "event",
              name: "MerkleRootPublished",
              inputs: [
                {
                  name: "merkleRoot",
                  type: "bytes32",
                  indexed: false,
                  internalType: "bytes32",
                },
              ],
              anonymous: false,
            },
            {
              type: "event",
              name: "RoleAdminChanged",
              inputs: [
                {
                  name: "role",
                  type: "bytes32",
                  indexed: true,
                  internalType: "bytes32",
                },
                {
                  name: "previousAdminRole",
                  type: "bytes32",
                  indexed: true,
                  internalType: "bytes32",
                },
                {
                  name: "newAdminRole",
                  type: "bytes32",
                  indexed: true,
                  internalType: "bytes32",
                },
              ],
              anonymous: false,
            },
            {
              type: "event",
              name: "RoleGranted",
              inputs: [
                {
                  name: "role",
                  type: "bytes32",
                  indexed: true,
                  internalType: "bytes32",
                },
                {
                  name: "account",
                  type: "address",
                  indexed: true,
                  internalType: "address",
                },
                {
                  name: "sender",
                  type: "address",
                  indexed: true,
                  internalType: "address",
                },
              ],
              anonymous: false,
            },
            {
              type: "event",
              name: "RoleRevoked",
              inputs: [
                {
                  name: "role",
                  type: "bytes32",
                  indexed: true,
                  internalType: "bytes32",
                },
                {
                  name: "account",
                  type: "address",
                  indexed: true,
                  internalType: "address",
                },
                {
                  name: "sender",
                  type: "address",
                  indexed: true,
                  internalType: "address",
                },
              ],
              anonymous: false,
            },
            {
              type: "event",
              name: "SubMerkleRootPublished",
              inputs: [
                {
                  name: "merkleRoot",
                  type: "bytes32",
                  indexed: false,
                  internalType: "bytes32",
                },
                {
                  name: "subMerkleRoot",
                  type: "bytes32",
                  indexed: false,
                  internalType: "bytes32",
                },
              ],
              anonymous: false,
            },
            {
              type: "error",
              name: "AccessControlBadConfirmation",
              inputs: [],
            },
            {
              type: "error",
              name: "AccessControlUnauthorizedAccount",
              inputs: [
                {
                  name: "account",
                  type: "address",
                  internalType: "address",
                },
                {
                  name: "neededRole",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
            },
            {
              type: "error",
              name: "MerkleRootNotFound",
              inputs: [],
            },
          ],
        },
        PrivacyPool: {
          address: "0xdCe231Df6213f2aF4e50542dAf26304fF0DD2A7c",
          abi: [
            {
              type: "constructor",
              inputs: [],
              stateMutability: "nonpayable",
            },
            {
              type: "function",
              name: "AAVE",
              inputs: [],
              outputs: [
                {
                  name: "",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "DEFAULT_ADMIN_ROLE",
              inputs: [],
              outputs: [
                {
                  name: "",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "ETH_ADDRESS",
              inputs: [],
              outputs: [
                {
                  name: "",
                  type: "address",
                  internalType: "address",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "OPERATOR_ROLE",
              inputs: [],
              outputs: [
                {
                  name: "",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "PROTOCOL",
              inputs: [],
              outputs: [
                {
                  name: "",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "asp",
              inputs: [],
              outputs: [
                {
                  name: "",
                  type: "address",
                  internalType: "contract IASP",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "deposit",
              inputs: [
                {
                  name: "asset",
                  type: "address",
                  internalType: "address",
                },
                {
                  name: "amount",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "commitment",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
              outputs: [],
              stateMutability: "payable",
            },
            {
              type: "function",
              name: "getAaveTokenBalance",
              inputs: [
                {
                  name: "asset",
                  type: "address",
                  internalType: "address",
                },
              ],
              outputs: [
                {
                  name: "",
                  type: "uint256",
                  internalType: "uint256",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "getRoleAdmin",
              inputs: [
                {
                  name: "role",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
              outputs: [
                {
                  name: "",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "grantRole",
              inputs: [
                {
                  name: "role",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "account",
                  type: "address",
                  internalType: "address",
                },
              ],
              outputs: [],
              stateMutability: "nonpayable",
            },
            {
              type: "function",
              name: "hasRole",
              inputs: [
                {
                  name: "role",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "account",
                  type: "address",
                  internalType: "address",
                },
              ],
              outputs: [
                {
                  name: "",
                  type: "bool",
                  internalType: "bool",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "initialize",
              inputs: [
                {
                  name: "_poolAddressesProvider",
                  type: "address",
                  internalType: "contract IPoolAddressesProvider",
                },
                {
                  name: "_wethGateway",
                  type: "address",
                  internalType: "contract IWrappedTokenGatewayV3",
                },
                {
                  name: "_aaveWETH",
                  type: "address",
                  internalType: "contract IERC20",
                },
                {
                  name: "_asp",
                  type: "address",
                  internalType: "contract IASP",
                },
                {
                  name: "_verifier",
                  type: "address",
                  internalType: "contract IVerifier",
                },
              ],
              outputs: [],
              stateMutability: "nonpayable",
            },
            {
              type: "function",
              name: "isKnownCommitment",
              inputs: [
                {
                  name: "",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
              outputs: [
                {
                  name: "",
                  type: "bool",
                  internalType: "bool",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "isUsedNullifier",
              inputs: [
                {
                  name: "",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
              outputs: [
                {
                  name: "",
                  type: "bool",
                  internalType: "bool",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "poolAddressesProvider",
              inputs: [],
              outputs: [
                {
                  name: "",
                  type: "address",
                  internalType: "contract IPoolAddressesProvider",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "renounceRole",
              inputs: [
                {
                  name: "role",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "callerConfirmation",
                  type: "address",
                  internalType: "address",
                },
              ],
              outputs: [],
              stateMutability: "nonpayable",
            },
            {
              type: "function",
              name: "revokeRole",
              inputs: [
                {
                  name: "role",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "account",
                  type: "address",
                  internalType: "address",
                },
              ],
              outputs: [],
              stateMutability: "nonpayable",
            },
            {
              type: "function",
              name: "setASP",
              inputs: [
                {
                  name: "_asp",
                  type: "address",
                  internalType: "contract IASP",
                },
              ],
              outputs: [],
              stateMutability: "nonpayable",
            },
            {
              type: "function",
              name: "setAaveToken",
              inputs: [
                {
                  name: "asset",
                  type: "address",
                  internalType: "address",
                },
                {
                  name: "aToken",
                  type: "address",
                  internalType: "address",
                },
              ],
              outputs: [],
              stateMutability: "nonpayable",
            },
            {
              type: "function",
              name: "setVerifier",
              inputs: [
                {
                  name: "_verifier",
                  type: "address",
                  internalType: "contract IVerifier",
                },
              ],
              outputs: [],
              stateMutability: "nonpayable",
            },
            {
              type: "function",
              name: "supportsInterface",
              inputs: [
                {
                  name: "interfaceId",
                  type: "bytes4",
                  internalType: "bytes4",
                },
              ],
              outputs: [
                {
                  name: "",
                  type: "bool",
                  internalType: "bool",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "verifier",
              inputs: [],
              outputs: [
                {
                  name: "",
                  type: "address",
                  internalType: "contract IVerifier",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "wethGateway",
              inputs: [],
              outputs: [
                {
                  name: "",
                  type: "address",
                  internalType: "contract IWrappedTokenGatewayV3",
                },
              ],
              stateMutability: "view",
            },
            {
              type: "function",
              name: "withdraw",
              inputs: [
                {
                  name: "asset",
                  type: "address",
                  internalType: "address",
                },
                {
                  name: "recipient",
                  type: "address",
                  internalType: "address",
                },
                {
                  name: "amount",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "nullifier",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "root",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "subtreeRoot",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "proof",
                  type: "bytes",
                  internalType: "bytes",
                },
                {
                  name: "subtreeProof",
                  type: "bytes",
                  internalType: "bytes",
                },
              ],
              outputs: [],
              stateMutability: "nonpayable",
            },
            {
              type: "event",
              name: "Deposit",
              inputs: [
                {
                  name: "depositor",
                  type: "address",
                  indexed: false,
                  internalType: "address",
                },
                {
                  name: "asset",
                  type: "address",
                  indexed: false,
                  internalType: "address",
                },
                {
                  name: "amount",
                  type: "uint256",
                  indexed: false,
                  internalType: "uint256",
                },
                {
                  name: "commitment",
                  type: "bytes32",
                  indexed: false,
                  internalType: "bytes32",
                },
              ],
              anonymous: false,
            },
            {
              type: "event",
              name: "Initialized",
              inputs: [
                {
                  name: "version",
                  type: "uint64",
                  indexed: false,
                  internalType: "uint64",
                },
              ],
              anonymous: false,
            },
            {
              type: "event",
              name: "RoleAdminChanged",
              inputs: [
                {
                  name: "role",
                  type: "bytes32",
                  indexed: true,
                  internalType: "bytes32",
                },
                {
                  name: "previousAdminRole",
                  type: "bytes32",
                  indexed: true,
                  internalType: "bytes32",
                },
                {
                  name: "newAdminRole",
                  type: "bytes32",
                  indexed: true,
                  internalType: "bytes32",
                },
              ],
              anonymous: false,
            },
            {
              type: "event",
              name: "RoleGranted",
              inputs: [
                {
                  name: "role",
                  type: "bytes32",
                  indexed: true,
                  internalType: "bytes32",
                },
                {
                  name: "account",
                  type: "address",
                  indexed: true,
                  internalType: "address",
                },
                {
                  name: "sender",
                  type: "address",
                  indexed: true,
                  internalType: "address",
                },
              ],
              anonymous: false,
            },
            {
              type: "event",
              name: "RoleRevoked",
              inputs: [
                {
                  name: "role",
                  type: "bytes32",
                  indexed: true,
                  internalType: "bytes32",
                },
                {
                  name: "account",
                  type: "address",
                  indexed: true,
                  internalType: "address",
                },
                {
                  name: "sender",
                  type: "address",
                  indexed: true,
                  internalType: "address",
                },
              ],
              anonymous: false,
            },
            {
              type: "event",
              name: "Withdraw",
              inputs: [
                {
                  name: "recipient",
                  type: "address",
                  indexed: false,
                  internalType: "address",
                },
                {
                  name: "asset",
                  type: "address",
                  indexed: false,
                  internalType: "address",
                },
                {
                  name: "amount",
                  type: "uint256",
                  indexed: false,
                  internalType: "uint256",
                },
                {
                  name: "nullifier",
                  type: "bytes32",
                  indexed: false,
                  internalType: "bytes32",
                },
                {
                  name: "root",
                  type: "bytes32",
                  indexed: false,
                  internalType: "bytes32",
                },
                {
                  name: "subtreeRoot",
                  type: "bytes32",
                  indexed: false,
                  internalType: "bytes32",
                },
              ],
              anonymous: false,
            },
            {
              type: "error",
              name: "AccessControlBadConfirmation",
              inputs: [],
            },
            {
              type: "error",
              name: "AccessControlUnauthorizedAccount",
              inputs: [
                {
                  name: "account",
                  type: "address",
                  internalType: "address",
                },
                {
                  name: "neededRole",
                  type: "bytes32",
                  internalType: "bytes32",
                },
              ],
            },
            {
              type: "error",
              name: "InsufficientAllowanceOrBalance",
              inputs: [],
            },
            {
              type: "error",
              name: "InsufficientMsgValue",
              inputs: [],
            },
            {
              type: "error",
              name: "InvalidAmount",
              inputs: [],
            },
            {
              type: "error",
              name: "InvalidAsset",
              inputs: [],
            },
            {
              type: "error",
              name: "InvalidCommitment",
              inputs: [],
            },
            {
              type: "error",
              name: "InvalidInitialization",
              inputs: [],
            },
            {
              type: "error",
              name: "InvalidNullifier",
              inputs: [],
            },
            {
              type: "error",
              name: "InvalidProof",
              inputs: [],
            },
            {
              type: "error",
              name: "InvalidRoot",
              inputs: [],
            },
            {
              type: "error",
              name: "NotInitializing",
              inputs: [],
            },
            {
              type: "error",
              name: "ReentrancyGuardReentrantCall",
              inputs: [],
            },
          ],
        },
      },
    },
  ],
} as const;

export default contracts;
