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

    /// @notice Registers a minigame's factory
    /// @param minigameId The ID that is going to be used to identify a minigame
    /// @param minigameFactoryAddress The address where the minigame's factory lives
    function registerMinigame(string calldata minigameId, address minigameFactoryAddress) external override {
        require(minigameFactories[minigameId] == address(0)); // dev: minigameId already taken
        minigameFactories[minigameId] = minigameFactoryAddress;
    }

    /// @notice Gets the minigame's factory
    /// @param minigameId The ID to of the minigame being searched for
    /// @return The address of the minigame's factory
    function getFactory(string calldata minigameId) external override returns (address) {
        return minigameFactories[minigameId];
    }
}
