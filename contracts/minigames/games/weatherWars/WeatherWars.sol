// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "../../CappedMinigame.sol";
import "alphachainio/chainlink-contracts@1.1.3/contracts/src/v0.6/ChainlinkClient.sol";

contract WeatherWars is CappedMinigame, ChainlinkClient {
    mapping(string => uint256) prices;

    address private _vrfCoordinatorAddress;
    address private _linkTokenAddress;
    uint256 private _fee;
    bytes32 private _keyHash;

    constructor(address vrfCoordinateAdddress, address linkTokenAddress, uint256 fee, string memory _gameName, uint256 _maxPlayers, address _cryptoChampionsContractAddress, uint256 _buyinAmount) CappedMinigame(gameName, _maxPlayers, _cryptoChampionsContractAddress, _buyinAmount) public {
        _vrfCoordinatorAddress = vrfCoordinateAdddress;
        _linkTokenAddress = linkTokenAddress;
        _fee = fee;
        _keyHash = 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4;
    }

    function onMaxCapacityReached() public override {
        // TODO:  Schedule job in keeper network
        super.startGame();
    }

    function play() internal override {
        // Make request to open weather API
    }
}