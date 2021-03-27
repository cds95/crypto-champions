// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "../../CappedMinigame.sol";

contract WeatherWars is CappedMinigame {
    mapping(string => uint256) prices;

    constructor(string memory _gameName, uint256 _maxPlayers, address _cryptoChampionsContractAddress) CappedMinigame(gameName, _maxPlayers, _cryptoChampionsContractAddress) public {
    }

    function onMaxCapacityReached() public override {
        // TODO:  Schedule job in keeper network
        super.startGame();
    }

    function play() internal override {
        // Make request to open weather API
    }
}