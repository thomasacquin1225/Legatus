//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../contracts/PrivacyPool.sol";
import "../contracts/UltraVerifier.sol";
import "./DeployHelpers.s.sol";

contract DeployScript is ScaffoldETHDeploy {
    error InvalidPrivateKey(string);

    function run() external {
        uint256 deployerPrivateKey = setupLocalhostEnv();
        if (deployerPrivateKey == 0) {
            revert InvalidPrivateKey(
                "You don't have a deployer account. Make sure you have set DEPLOYER_PRIVATE_KEY in .env or use `yarn generate` to generate a new random account"
            );
        }
        vm.startBroadcast(deployerPrivateKey);
        UltraVerifier verifier = new UltraVerifier();
        console.logString(
            string.concat(
                "Verifier deployed at: ",
                vm.toString(address(verifier))
            )
        );

        PrivacyPool privacyPool = new PrivacyPool();
        privacyPool.initialize(
            IPoolAddressesProvider(0x52A27dC690F8652288194Dd2bc523863eBdEa236),
            IWrappedTokenGatewayV3(0x57ce905CfD7f986A929A26b006f797d181dB706e),
            IERC20(0x9E8CEC4F2F4596141B62e88966D7167E9db555aD),
            IVerifier(address(verifier))
        );
        console.logString(
            string.concat(
                "PrivacyPool deployed at: ",
                vm.toString(address(privacyPool))
            )
        );
        vm.stopBroadcast();

        /**
         * This function generates the file containing the contracts Abi definitions.
         * These definitions are used to derive the types needed in the custom scaffold-eth hooks, for example.
         * This function should be called last.
         */
        exportDeployments();
    }

    function test() public {}
}
