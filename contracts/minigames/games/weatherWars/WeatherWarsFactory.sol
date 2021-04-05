// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "./WeatherWars.sol";
import "alphachainio/chainlink-contracts@1.1.3/contracts/src/v0.6/VRFConsumerBase.sol";
import "OpenZeppelin/openzeppelin-contracts@3.4.0/contracts/math/SafeMath.sol";

contract WeatherWarsFactory is VRFConsumerBase {
    using SafeMath for uint256;

    WeatherWars[] public games;

    uint256 private _fee;

    bytes32 internal _keyHash;

    // City IDs based off open weather api docs
    string[24] cities = [
        "6173331",
        "4671654",
        "4887398",
        "4164138",
        "5128581",
        "5391811",
        "5391959",
        "5809844",
        "3530597",
        "3435907",
        "993800",
        "360630",
        "2643743",
        "524894",
        "2950158",
        "2968815",
        "2759794",
        "2673722",
        "1850147",
        "1275339",
        "1796236",
        "1835847",
        "1880252",
        "2158177"
    ];

    string private _nextCity;

    uint256 constant SEED = 13563;

    address private _linkTokenAddress;

    address private _oracle;

    event GameCreated(string gameName, string city);

    event CreatingGame(string city);

    constructor(
        address oracle,
        address vrfCoordinateAdddress,
        address linkTokenAddress,
        uint256 fee,
        bytes32 keyHash
    ) public VRFConsumerBase(vrfCoordinateAdddress, linkTokenAddress) {
        _fee = fee;
        _keyHash = keyHash;
        _linkTokenAddress = linkTokenAddress;
        _oracle = oracle;
    }

    function init() public {
        requestNextCity();
    }

    function createWeatherWars(
        string calldata _gameName,
        uint256 _buyinAmount,
        address cryptoChampionsContractAddress
    ) public returns (bytes32) {
        WeatherWars newGame =
            new WeatherWars(
                _oracle,
                _linkTokenAddress,
                _fee,
                _gameName,
                cryptoChampionsContractAddress,
                _buyinAmount,
                _nextCity
            );
        games.push(newGame);
        emit GameCreated(_gameName, _nextCity);
        requestNextCity();
    }

    function requestNextCity() internal {
        require(LINK.balanceOf(address(this)) >= _fee);
        requestRandomness(_keyHash, _fee, SEED);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomNum) internal override {
        uint256 cityIdx = randomNum % cities.length;
        _nextCity = cities[cityIdx];
    }
}
