// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

struct MinigamePlayer {
    bool isInGame;
}

interface IMinigame {
     function distributeWinnings(uint256 heroId) external payable;

    function joinGame(uint256 heroId) external;

    function leaveGame(uint256 heroId) external;

    function startGame() external;
    
    function play() external;
}