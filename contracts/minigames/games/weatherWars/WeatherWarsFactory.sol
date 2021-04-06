// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "./WeatherWars.sol";
import "alphachainio/chainlink-contracts@1.1.3/contracts/src/v0.6/VRFConsumerBase.sol";
import "OpenZeppelin/openzeppelin-contracts@3.4.0/contracts/math/SafeMath.sol";
import "../../../../interfaces/ICryptoChampions.sol";

contract WeatherWarsFactory is VRFConsumerBase {
    WeatherWars[] public games;

    uint8 private constant MAX_CITIES = 24;

    uint8 private constant MAX_WEATHERS = 7;

    uint256 private _fee;

    bytes32 internal _keyHash;

    string private _nextCity;

    uint256 constant SEED = 13563;

    address private _linkTokenAddress;

    address public oracle;

    string private _weatherApiKey;

    bytes32 public jobId;

    mapping(string => uint8) public weatherMapping;

    mapping(uint8 => bool) private weatherMapIds;

    mapping(string => uint8) public cities;

    string[] private _openWeatherCityIds;

    mapping(uint8 => bool) private _cityIds;

    address private _cryptoChampionsAddress;

    event GameCreated(string gameName, string city);

    event CreatingGame(string city);

    constructor(
        address oracleAddress,
        address vrfCoordinateAdddress,
        address linkTokenAddress,
        uint256 feeInLink,
        bytes32 keyHash,
        string memory weatherApiKey,
        bytes32 oracleJobId,
        address cryptoChampionsAddress
    ) public VRFConsumerBase(vrfCoordinateAdddress, linkTokenAddress) {
        _fee = feeInLink;
        _keyHash = keyHash;
        _linkTokenAddress = linkTokenAddress;
        _weatherApiKey = weatherApiKey;
        oracle = oracleAddress;
        jobId = oracleJobId;
        _cryptoChampionsAddress = cryptoChampionsAddress;
    }

    function init() external {
        requestNextCity();
    }

    function addWeatherMapping(string calldata weather, uint8 id) external {
        require(!weatherMapIds[id]); // dev: Weather ID already taken
        require(id >= 0 && id < MAX_WEATHERS); // dev: Weather ID is invalid.
        weatherMapping[weather] = id;
        weatherMapIds[id] = true;
    }

    function addCityMapping(string calldata openWeatherCityId, uint8 cityId) external {
        require(!_cityIds[cityId]); // dev: City already taken
        require(cityId >= 0 && cityId < MAX_CITIES); // dev: City ID is invalid.
        cities[openWeatherCityId] = cityId;
        _cityIds[cityId] = true;
        _openWeatherCityIds.push(openWeatherCityId);
    }

    function createWeatherWars(
        uint256 _buyinAmount,
        uint256 initiatorHeroId,
        address opponent,
        uint256 opponentHeroId
    ) external returns (bytes32) {
        WeatherWars newGame =
            new WeatherWars(
                oracle,
                _linkTokenAddress,
                _fee,
                "weather-wars",
                _cryptoChampionsAddress,
                _buyinAmount,
                _nextCity,
                jobId,
                _weatherApiKey,
                address(this)
            );
        ICryptoChampions cc = ICryptoChampions(_cryptoChampionsAddress);
        cc.delegatedTransferInGameTokens(msg.sender, address(newGame), _buyinAmount);
        newGame.setPlayerInformation(msg.sender, initiatorHeroId, opponent, opponentHeroId);
        games.push(newGame);
        requestNextCity();
    }

    function requestNextCity() internal {
        require(LINK.balanceOf(address(this)) >= _fee);
        requestRandomness(_keyHash, _fee, SEED);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomNum) internal override {
        uint256 cityIdx = randomNum % MAX_CITIES;
        _nextCity = _openWeatherCityIds[cityIdx];
    }

    function getNumGames() external returns (uint256) {
        return games.length;
    }
}
