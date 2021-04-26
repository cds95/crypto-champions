// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "../CryptoChampions.sol";
import "../token/ChampzToken.sol";

/// @title Exposed version of CryptoChampions
/// @author Oozyx
/// @notice This contract inherits from CryptoChampions and makes its functions testable
/// @dev Not to be deployed outside of a test environment
contract ExposedCryptoChampions is CryptoChampions {
    /// Holds the requestId
    bytes32 public requestId;

    /// See CryptoChampions::CryptoChampions
    constructor(
        address champz,
        address minigameFactoryRegistry,
        ChampzToken champzToken
    ) public CryptoChampions(champz, minigameFactoryRegistry, champzToken) {}

    /// See CryptoChampions::_burnElders
    function burnElders() public {
        _burnElders();
    }

    /// See CryptoChampions::_burnElder
    function burnElder(uint256 elderId) public {
        _burnElder(elderId);
    }

    /// See CryptoChampions::_canMintHero
    function canMintHero(uint256 elderId) public view returns (bool) {
        return _canMintHero(elderId);
    }

    /// See CryptoChampions::_trainHero
    function trainHero(uint256 heroId) public {
        _trainHero(_heroChampzIds[heroId]);
    }

    /// See CryptoChampions::_startNewPriceGame
    function startNewPriceGame() public {
        _startNewPriceGame();
    }

    /// See CryptoChampions::_transitionNextPhase
    function transitionNextPhase() public {
        _transitionNextPhase();
    }

    /// See CryptoChampions::_heroRewardsShare
    function heroRewardsShare() public view returns (uint256) {
        return _heroRewardsShare;
    }
}
