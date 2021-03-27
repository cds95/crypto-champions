// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "./WeatherWars.sol";

contract WeatherWarsFactory {
    WeatherWars[] public games;

    function createWeatherWars(string calldata _gameName, uint256 _maxPlayers, address _cryptoChampionsContractAddress) public {
        WeatherWars newGame = new WeatherWars(_gameName, _maxPlayers, _cryptoChampionsContractAddress);
        games.push(newGame);
    }
}