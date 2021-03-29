// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

interface IMinigameFactoryRegistry {
    function registerMinigame(string calldata minigameKey, address minigameFactoryAddress) external;

    function getFactory(string calldata minigameKey) external returns (address);
}
