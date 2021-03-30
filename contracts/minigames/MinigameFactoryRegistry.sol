// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "./Minigame.sol";
import "../../interfaces/IMinigameFactoryRegistry.sol";

contract MinigameFactoryRegistry is IMinigameFactoryRegistry {
    mapping(string => address) public minigameFactories;

    function registerMinigame(string calldata minigameId, address minigameFactoryAddress) external override {
        require(minigameFactories[minigameId] == address(0)); // dev: minigameId already taken
        minigameFactories[minigameId] = minigameFactoryAddress;
    }

    function getFactory(string calldata minigameId) external override returns(address) {
        return minigameFactories[minigameId];
    }
}