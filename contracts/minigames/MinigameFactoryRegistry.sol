// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "./Minigame.sol";
import "../../interfaces/IMinigameFactoryRegistry.sol";

/// @title MinigameFactoryRegistry
/// @author cds95
/// @notice This is the contract where all the minigame factory addresses are registered
contract MinigameFactoryRegistry is IMinigameFactoryRegistry {
    // Mapping from a minigame's key to it's factory's address
    mapping(string => address) public minigameFactories;

    function registerMinigame(string calldata minigameId, address minigameFactoryAddress) external override {
        require(minigameFactories[minigameId] == address(0)); // dev: minigameId already taken
        minigameFactories[minigameId] = minigameFactoryAddress;
    }

    function getFactory(string calldata minigameId) external override returns (address) {
        return minigameFactories[minigameId];
    }
}
