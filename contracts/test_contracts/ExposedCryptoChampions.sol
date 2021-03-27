// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "../CryptoChampions.sol";

/// @title Exposed version of CryptoChampions
/// @author Oozyx
/// @notice This contract inherits from CryptoChampions and makes its functions testable
/// @dev Not to be deployed outside of a test environment
contract ExposedCryptoChampions is CryptoChampions {
    /// Holds the requestId
    bytes32 public requestId;

    /// See CryptoChampions::CryptoChampions
    constructor(
        bytes32 keyhash,
        address vrfCoordinator,
        address linkToken
    ) public CryptoChampions(keyhash, vrfCoordinator, linkToken) {}

    /// See CryptoChampions::_getRandomNumber
    function getRandomNumber(uint256 seed) public {
        requestId = _getRandomNumber(seed);
    }

    /// See CryptoChampions::_randomResult
    function getRandomResult() public view returns (uint256) {
        return _randomResult;
    }

    /// See CryptoChampions::_burnElder
    function burnElder(uint256 elderId) public {
        _burnElder(elderId);
    }

    /// See CryptoChampions::_canMintHero
    function canMintHero(uint256 elderId) public view returns (bool) {
        return _canMintHero(elderId);
    }
}
