// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "../../CappedMinigame.sol";
import "alphachainio/chainlink-contracts@1.1.3/contracts/src/v0.6/ChainlinkClient.sol";

contract WeatherWars is CappedMinigame, ChainlinkClient {
    uint256 private constant MAX_PLAYERS = 2;

    address private _linkTokenAddress;

    uint256 private _fee;

    string public city;

    address private _oracle;

    bytes32 private constant GET_JOB_ID = "29fa9aa13bf1468788b7cc4a500a45b8";

    bytes32 public cityWeather;

    // The amount of ether required to join the game
    uint256 public buyinAmount;

    // The mapping from hero id to the player's balance
    mapping(uint256 => uint256) balances;

    constructor(
        address oracle,
        address linkTokenAddress,
        uint256 fee,
        string memory _gameName,
        address _cryptoChampionsContractAddress,
        uint256 _buyinAmount,
        string memory _city
    ) public CappedMinigame(gameName, MAX_PLAYERS, _cryptoChampionsContractAddress) {
        setPublicChainlinkToken();
        _linkTokenAddress = linkTokenAddress;
        _fee = fee;
        _oracle = oracle;
        city = _city;
        buyinAmount = _buyinAmount;
    }

    /// @notice Joins a game
    /// @param heroId The id of the joining player's hero
    function joinGame(uint256 heroId) external payable override {
        require(msg.value == buyinAmount); // dev Incorrect buyin amount
        balances[heroId] = buyinAmount;
        super.joinGame(heroId);
    }

    /// @notice Leaves a game
    /// @param heroId The id of the leaving player's hero
    function leaveGame(uint256 heroId) external payable override {
        super.leaveGame(heroId);
        uint256 playerBalance = balances[heroId];
        balances[heroId] = 0;
        address playerAddress = cryptoChampions.getHeroOwner(heroId);
        address payable payableAddress = payable(playerAddress);
        payableAddress.transfer(playerBalance);
    }

    function onMaxCapacityReached() public override {
        super.startGame();
    }

    function play() internal override {
        Chainlink.Request memory request = buildChainlinkRequest(GET_JOB_ID, address(this), this.fulfill.selector);
        string memory reqUrlWithCity = concatenate("http://api.openweathermap.org/data/2.5/weather?q=", city);
        request.add("get", concatenate(reqUrlWithCity, "&appid=2c9761ee41522554e88632268c609e13"));
        request.add("path", "weather[0].main");
        sendChainlinkRequestTo(_oracle, request, _fee);
    }

    // TODO:  Move to it's own library
    function concatenate(string memory a, string memory b) internal pure returns (string memory) {
        return string(abi.encodePacked(a, b));
    }

    function fulfill(bytes32 _requestId, bytes32 weather) public recordChainlinkFulfillment(_requestId) {
        // TODO:  Use weather data to determine winner
        cityWeather = weather;
    }
}
