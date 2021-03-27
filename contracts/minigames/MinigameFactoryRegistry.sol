// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "./Minigame.sol";
import "../../interfaces/IMinigameFactoryRegistry.sol";

contract MinigameFactoryRegistry is IMinigameFactoryRegistry {
    mapping(string => address) public minigameFactories;

    function registerMinigame(string calldata minigameKey, address minigameFactoryAddress) external override {
        minigameFactories[minigameKey] = minigameFactoryAddress;
    }
}