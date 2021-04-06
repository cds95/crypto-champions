// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "../../CappedMinigame.sol";
import "alphachainio/chainlink-contracts@1.1.3/contracts/src/v0.6/ChainlinkClient.sol";
import "OpenZeppelin/openzeppelin-contracts@3.4.0/contracts/token/ERC1155/ERC1155Receiver.sol";
import "OpenZeppelin/openzeppelin-contracts@3.4.0/contracts/math/SafeMath.sol";
import "./WeatherWarsFactory.sol";

contract WeatherWars is CappedMinigame, ChainlinkClient, ERC1155Receiver {
    using SafeMath for uint8;

    uint256 private constant MAX_PLAYERS = 2;

    address private _linkTokenAddress;

    uint256 private _fee;

    string public city;

    address private _oracle;

    string public cityWeather;

    // The amount of ether required to join the game
    uint256 public buyinAmount;

    // The mapping from hero id to the player's balance
    mapping(address => uint256) public balances;

    // The job ID to make a GET call and retrieve a bytes32 result
    bytes32 private _jobId;

    // API key to make call to get weather
    string private _apiKey;

    WeatherWarsFactory private _weatherWarsFactory;

    address public initiator;

    address public opponent;

    uint256 public initiatorScore;

    uint256 public opponentScore;

    address public winner;

    mapping(address => uint256) public playerHero;

    bool public isDuelAccepted;

    bool public hasBeenPlayed;

    bool public isFetchingWeather;

    constructor(
        address oracle,
        address linkTokenAddress,
        uint256 fee,
        string memory _gameName,
        address _cryptoChampionsContractAddress,
        uint256 _buyinAmount,
        string memory _city,
        bytes32 jobId,
        string memory apiKey,
        address weatherWarsFactoryAddress
    ) public CappedMinigame(gameName, MAX_PLAYERS, _cryptoChampionsContractAddress) {
        // setPublicChainlinkToken();
        _linkTokenAddress = linkTokenAddress;
        _fee = fee;
        _oracle = oracle;
        city = _city;
        buyinAmount = _buyinAmount;
        _jobId = jobId;
        _apiKey = apiKey;
        _weatherWarsFactory = WeatherWarsFactory(weatherWarsFactoryAddress);
    }

    function setPlayerInformation(
        address duelInitiator,
        uint256 duelInitiatorHeroId,
        address duelOpponent,
        uint256 duelOpponentHeroId
    ) external {
        initiator = duelInitiator;
        opponent = duelOpponent;
        playerHero[initiator] = duelInitiatorHeroId;
        playerHero[opponent] = duelOpponentHeroId;
    }

    function play() internal override {
        // Hardcoding for now so we can test on Rinkeby.  Make sure to replace with call to requestWeatherData()
        if (city == "6173331"") {
            cityWeather = "Clear";
        } else if (city == "4671654") {
            cityWeather = "Clouds";
        } else if (city == "4887398") {
            cityWeather = "Thunderstorm";
        } else {
            cityWeather = "Rain";
        }
    }

    function requestWeatherData() internal {
        Chainlink.Request memory request = buildChainlinkRequest(_jobId, address(this), this.fulfill.selector);

        // Build URL
        string memory reqUrlWithCity = concatenate("http://api.openweathermap.org/data/2.5/weather?id=", city);
        reqUrlWithCity = concatenate(reqUrlWithCity, "&appid=");
        reqUrlWithCity = concatenate(reqUrlWithCity, _apiKey);

        // Send Request
        request.add("get", reqUrlWithCity);
        request.add("path", "weather.0.main");

        isFetchingWeather = true;
        sendChainlinkRequestTo(_oracle, request, _fee);
    }

    // TODO:  Move to it's own library
    function concatenate(string memory a, string memory b) internal pure returns (string memory) {
        return string(abi.encodePacked(a, b));
    }

    function fulfill(bytes32 _requestId, bytes32 _weather) public recordChainlinkFulfillment(_requestId) {
        cityWeather = string(abi.encodePacked(_weather));
        hasBeenPlayed = true;
        isFetchingWeather = false;
    }

    function leaveGame(uint256 heroId) public override {
        require(msg.sender == initiator || msg.sender == opponent); // dev: Address not part of the game
        require(currentPhase == MinigamePhase.OPEN); // dev: Game already closed
        require(bytes(cityWeather).length == 0); // dev: City weather data already fetched

        super.leaveGame(heroId);
        uint256 addressBalance = balances[msg.sender];
        balances[msg.sender] = 0;
        cryptoChampions.transferInGameTokens(msg.sender, addressBalance);
    }

    function determineWinner() external returns (address, uint256) {
        require(msg.sender == initiator || msg.sender == opponent); // dev: Address not part of the game
        require(currentPhase == MinigamePhase.CLOSED); // dev: Game not yet over
        require(bytes(cityWeather).length != 0); // dev: City weather data has not been fetched yet
        require(isDuelAccepted); // dev:  Opponent has not accepted the duel

        uint256 initiatorHeroId = playerHero[initiator];
        uint256 opponentHeroId = playerHero[opponent];
        initiatorScore = getHeroScore(initiatorHeroId);
        opponentScore = getHeroScore(opponentHeroId);

        // Handle Draw
        if (initiatorScore == opponentScore) {
            address playerOne = cryptoChampions.getHeroOwner(initiatorHeroId);
            address playerTwo = cryptoChampions.getHeroOwner(opponentHeroId);
            uint256 balancePlayerOne = balances[playerOne];
            uint256 balancePlayerTwo = balances[playerTwo];
            balances[playerOne] = 0;
            balances[playerTwo] = 0;
            cryptoChampions.transferInGameTokens(playerOne, balancePlayerOne);
            cryptoChampions.transferInGameTokens(playerTwo, balancePlayerTwo);
            return (address(0), 0);
        }

        // Handle winner and loser
        uint256 winnerHeroId;
        uint256 loserHeroId;
        address winnerAddress;
        address loserAddress;
        if (initiatorScore < opponentScore) {
            winnerHeroId = opponentHeroId;
            loserHeroId = initiatorHeroId;
            winnerAddress = opponent;
            loserAddress = initiator;
        } else if (initiatorScore > opponentScore) {
            winnerHeroId = initiatorHeroId;
            loserHeroId = opponentHeroId;
            winnerAddress = initiator;
            loserAddress = opponent;
        }
        uint256 winnerBalance = balances[winnerAddress];
        uint256 loserBalance = balances[loserAddress];
        balances[winnerAddress] = 0;
        balances[loserAddress] = 0;
        cryptoChampions.transferInGameTokens(winnerAddress, winnerBalance + loserBalance);
        winner = winnerAddress;
        setPhase(MinigamePhase.CLOSED);
        return (winner, winnerHeroId);
    }

    function getHeroScore(uint256 heroId) internal returns (uint256) {
        (, , uint8 hometown, uint8 weather) = cryptoChampions.getHeroLore(heroId);
        uint256 score = 1;
        if (hometown == _weatherWarsFactory.cities(city)) {
            score = score.mul(11).div(10); // Multiply by 1.1
        }
        if (weather == _weatherWarsFactory.weatherMapping(cityWeather)) {
            score = score.mul(11).div(10); // Multiply by 1.1
        }
        uint256 classStatScore = getClassStatScore(heroId);
        uint256 weightedClassStatScore = classStatScore.mul(5).div(4); // Multiple by 1.25
        uint256 highestNonClassStat = getHighestNonClassStat(heroId);
        uint256 adjustedStatScore = weightedClassStatScore.add(highestNonClassStat);
        score = score.mul(adjustedStatScore);
        return score;
    }

    function getHighestNonClassStat(uint256 heroId) private returns (uint256) {
        (uint8 traitOne, uint8 traitTwo, uint8 skillOne, uint8 skillTwo) = cryptoChampions.getHeroTraitsSkills(heroId);
        uint256 highest = traitOne;
        if (traitTwo > highest) {
            highest = traitTwo;
        }
        if (skillOne > highest) {
            highest = skillOne;
        }
        if (skillTwo > highest) {
            highest = skillTwo;
        }
        return highest;
    }

    function getClassStatScore(uint256 heroId) private returns (uint256) {
        (uint8 strength, uint8 dexterity, uint8 constitution, uint8 intelligence, uint8 wisdom, uint8 charisma) =
            cryptoChampions.getHeroStats(heroId);
        (, , uint256 classId, ) = cryptoChampions.getHeroVisuals(heroId);
        // Warrior
        if (classId == 0) {
            return strength;
        }
        // Mage
        if (classId == 1) {
            return intelligence;
        }
        // Druid
        if (classId == 2) {
            return wisdom;
        }
        // Paladin
        if (classId == 3) {
            return constitution;
        }
        // Bard
        if (classId == 4) {
            return charisma;
        }
        if (classId == 5) {
            return intelligence;
        }
        if (classId == 6) {
            return wisdom;
        }
        // Rogue
        return dexterity;
    }

    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external override returns (bytes4) {
        require(value == buyinAmount); // dev: Must send the exact buyin amount
        if (from == opponent) {
            isDuelAccepted = true;
        }
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

    function getMetaInformation()
        external
        view
        returns (
            address,
            address,
            uint256,
            uint256,
            MinigamePhase,
            address,
            bool,
            uint256,
            bool,
            bool
        )
    {
        return (
            initiator,
            opponent,
            playerHero[initiator],
            playerHero[opponent],
            currentPhase,
            winner,
            isDuelAccepted,
            buyinAmount,
            hasBeenPlayed,
            isFetchingWeather
        );
    }
}
