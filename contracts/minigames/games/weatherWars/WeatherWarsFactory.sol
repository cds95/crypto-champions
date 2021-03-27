// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "./WeatherWars.sol";

contract WeatherWarsFactory {
    WeatherWars[] public games;

    address private _vrfCoordinatorAddress;
    address private _linkTokenAddress;
    uint256 private _fee;

    constructor(address vrfCoordinateAdddress, address linkTokenAddress, uint256 fee) public {
        _vrfCoordinatorAddress = vrfCoordinateAdddress;
        _linkTokenAddress = linkTokenAddress;
        _fee = fee;
    }

    function createWeatherWars(string calldata _gameName, uint256 _maxPlayers, address _cryptoChampionsContractAddress, uint256 _buyinAmount) public {
        WeatherWars newGame = new WeatherWars(_vrfCoordinatorAddress, _linkTokenAddress, _fee, _gameName, _maxPlayers, _cryptoChampionsContractAddress, _buyinAmount);
        games.push(newGame);
    }
}