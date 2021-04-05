// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "../../CappedMinigame.sol";
import "alphachainio/chainlink-contracts@1.1.3/contracts/src/v0.6/ChainlinkClient.sol";
import "OpenZeppelin/openzeppelin-contracts@3.4.0/contracts/token/ERC1155/ERC1155Receiver.sol";

contract WeatherWars is CappedMinigame, ChainlinkClient, ERC1155Receiver {
    uint256 private constant MAX_PLAYERS = 2;

    address private _linkTokenAddress;

    uint256 private _fee;

    string public city;

    address private _oracle;

    bytes32 public cityWeather;

    // The amount of ether required to join the game
    uint256 public buyinAmount;

    // The mapping from hero id to the player's balance
    mapping(address => uint256) public balances;

    // The job ID to make a GET call and retrieve a bytes32 result
    bytes32 private _jobId;

    // API key to make call to get weather
    string private _apiKey;

    constructor(
        address oracle,
        address linkTokenAddress,
        uint256 fee,
        string memory _gameName,
        address _cryptoChampionsContractAddress,
        uint256 _buyinAmount,
        string memory _city,
        bytes32 jobId,
        string memory apiKey
    ) public CappedMinigame(gameName, MAX_PLAYERS, _cryptoChampionsContractAddress) {
        setPublicChainlinkToken();
        _linkTokenAddress = linkTokenAddress;
        _fee = fee;
        _oracle = oracle;
        city = _city;
        buyinAmount = _buyinAmount;
        _jobId = jobId;
        _apiKey = apiKey;
    }

    function play() internal override {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);

        // Build URL
        string memory reqUrlWithCity = concatenate("http://api.openweathermap.org/data/2.5/weather?id=", city);
        reqUrlWithCity = concatenate(reqUrlWithCity, "&appid=");
        reqUrlWithCity = concatenate(reqUrlWithCity, _apiKey);

        // Send Request
        request.add("get", reqUrlWithCity);
        request.add("path", "weather.0.main");
        return sendChainlinkRequestTo(oracle, request, fee);
    }

    // TODO:  Move to it's own library
    function concatenate(string memory a, string memory b) internal pure returns (string memory) {
        return string(abi.encodePacked(a, b));
    }

    function fulfill(bytes32 _requestId, bytes32 _weather) public recordChainlinkFulfillment(_requestId) {
        cityWeather = string(abi.encodePacked(_weather));
    }

    function leaveGame(uint256 heroId) public override {
        require(_currentPhase == MinigamePhase.OPEN); // dev: Game already closed
        require(cityWeather == ""); // dev: City weather data already fetched

        super.leaveGame(heroId);
        uint256 addressBalance = balances[msg.sender];
        balances[msg.sender] = 0;
        cryptoChampions.transferInGameTokens(msg.sender, addressBalance);
    }

    function determineWinner() external {
        require(super.getNumPlayers() == MAX_PLAYERS); // dev: Weather Wars can only have two players
        require(balances[msg.sender] > 0); // dev: Only a player who has bought in may determine a winner
        require(_currentPhase == MinigamePhase.OPEN); // dev: Game already closed
        require(cityWeather != ""); // dev: City weather data has not been fetched yet

        uint256 heroOne = heroIds[0];
        uint256 heroTwo = heroIds[1];
        uint8 heroOneScore = getHeroScore(heroOne);
        uint8 heroTwoScore = getHeroScore(heroTwo);

        // Handle Draw
        if (heroOneScore == heroTwoScore) {
            address playerOne = cryptoChampions.getHeroOwner(heroOne);
            address playerTwo = cryptoChampions.getHeroOwner(heroTwo);
            uint256 balancePlayerOne = balances[playerOne];
            uint256 balancePlayerTwo = balances[playerTwo];
            balances[playerOne] = 0;
            balances[playerTwo] = 0;
            cryptoChampions.transferInGameTokens(playerOne, balancePlayerOne);
            cryptoChampions.transferInGameTokens(playerTwo, balancePlayerTwo);
            return;
        }

        // Handle winner and loser
        uint256 winner;
        uint256 loser;
        if (heroOneScore < heroTwoScore) {
            winner = heroTwo;
            loser = heroOne;
        } else if (heroOneScore > heroTwoScore) {
            winner = heroOne;
            loser = heroTwo;
        }
        address winnerAddress = cryptoChampions.getHeroOwner(winner);
        address loserAddress = cryptoChampions.getHeroOwner(loser);
        uint256 winnerBalance = balances[winnerAddress];
        uint256 loserBalance = balances[loserAddress];
        balances[winnerAddress] = 0;
        balances[loserAddress] = 0;
        cryptoChampions.transferInGameTokens(winnerAddress, winnerBalance + loserBalance);
        setPhase(MinigamePhase.CLOSED);
    }

    function getHeroScore(uint256 heroId) internal returns (uint8) {
        (uint8 strength, uint8 dexterity, uint8 constitution, uint8 intelligence, uint8 wisom, uint8 charisma) =
            cryptoChampions.getHeroStats(heroId);
        return strength;
    }

    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external override returns (bytes4) {
        balances[from] = value;
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
}
