// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "./WeatherWarsFactory.sol";
import "./WeatherWarsRandomizer.sol";
import "../../Minigame.sol";

import "smartcontractkit/chainlink-brownie-contracts@1.0.2/contracts/src/v0.6/ChainlinkClient.sol";

import "OpenZeppelin/openzeppelin-contracts@3.4.0/contracts/token/ERC1155/ERC1155Receiver.sol";
import "OpenZeppelin/openzeppelin-contracts@3.4.0/contracts/math/SafeMath.sol";

contract WeatherWars is Minigame, ChainlinkClient, ERC1155Receiver {
    using SafeMath for uint256;
    using SafeMath for uint8;

    uint256 private constant MAX_PLAYERS = 2;

    mapping(uint256 => string) private CITIES;

    mapping(string => uint256) private WEATHERS;

    address private _cryptoChampionsAddress;
    address private _linkTokenAddress;
    address private _oracleAddress;
    bytes32 private _jobId; // The job ID to make a GET call and retrieve a bytes32 result
    uint256 private _oracleFee;
    uint256 private _buyin;
    string private _gameName;
    string private _weatherApiKey; // API key to make call to get weather
    WeatherWarsRandomizer private _randomizer;
    uint256 private cityWeatherId;

    mapping(address => uint256) public balances;

    mapping(address => uint256) public playerHero;

    address public initiator;

    address public opponent;

    address public winner;

    uint256 public initiatorScore;

    uint256 public opponentScore;

    bool public isDuelAccepted;

    bool public hasBeenPlayed;

    bool public isFetchingWeather;

    string public city;

    string public cityWeather;

    constructor(
        address cryptoChampionsAddress,
        address linkTokenAddress,
        address oracleAddress,
        address randomizerAddress,
        bytes32 jobId,
        uint256 oracleFee,
        uint256 buyin,
        string memory gameName,
        string memory weatherApiKey
    ) public Minigame(gameName, cryptoChampionsAddress) {
        _cryptoChampionsAddress = cryptoChampionsAddress;
        _linkTokenAddress = linkTokenAddress;
        _oracleAddress = oracleAddress;
        _jobId = jobId;
        _oracleFee = oracleFee;
        _buyin = buyin;
        _gameName = gameName;
        _weatherApiKey = weatherApiKey;
        _randomizer = WeatherWarsRandomizer(randomizerAddress);

        CITIES[0] = "6173331";
        CITIES[1] = "4671654";
        CITIES[2] = "4887398";
        CITIES[3] = "4164138";
        CITIES[4] = "5128581";
        CITIES[5] = "5391811";
        CITIES[6] = "5391959";
        CITIES[7] = "5809844";
        CITIES[8] = "3530597";
        CITIES[9] = "3435907";
        CITIES[10] = "993800";
        CITIES[11] = "360630";
        CITIES[12] = "2643743";
        CITIES[13] = "524894";
        CITIES[14] = "2950158";
        CITIES[15] = "2968815";
        CITIES[16] = "2759794";
        CITIES[17] = "2673722";
        CITIES[18] = "1850147";
        CITIES[19] = "1275339";
        CITIES[20] = "1796236";
        CITIES[21] = "1835847";
        CITIES[22] = "1880252";
        CITIES[23] = "2158177";

        WEATHERS["Clouds"] = 0;
        WEATHERS["Clear"] = 1;
        WEATHERS["Atmosphere"] = 2;
        WEATHERS["Snow"] = 3;
        WEATHERS["Rain"] = 4;
        WEATHERS["Drizzle"] = 5;
        WEATHERS["Thunderstorm"] = 6;

        setChainlinkToken(linkTokenAddress);
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
        require(_randomizer.isInitialized()); // dev: Randomizer not initialized.
        city = CITIES[_randomizer.getCityId()];
        mockGameplay();
    }

    // Hardcoding for now so we can test on Rinkeby.  Make sure to replace with call to requestWeatherData().  The issue is that we
    // can't find a reliable oracle in Rinkeby and the Kovan faucet isn't working.
    function mockGameplay() internal {
        cityWeather = "Clear";
        hasBeenPlayed = true;
    }

    function requestWeatherData() internal {
        Chainlink.Request memory request = buildChainlinkRequest(_jobId, address(this), this.fulfill.selector);

        // Build URL
        string memory reqUrlWithCity = concatenate("http://api.openweathermap.org/data/2.5/weather?id=", city);
        reqUrlWithCity = concatenate(reqUrlWithCity, "&appid=");
        reqUrlWithCity = concatenate(reqUrlWithCity, _weatherApiKey);

        // Send Request
        request.add("get", reqUrlWithCity);
        request.add("path", "weather.0.main");

        isFetchingWeather = true;
        sendChainlinkRequestTo(_oracleAddress, request, _oracleFee);
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

    function getHeroScore(uint256 heroId) internal view returns (uint256) {
        (, , uint8 hometown, uint8 weather) = cryptoChampions.getHeroLore(heroId);
        uint256 score = 1;

        // Weather and hometown are 1 based in the crypto champions contract and 0 based in weather factory
        if (hometown - 1 == _randomizer.getCityId()) {
            score = score.mul(2); // Multiply by 2
        }
        if (weather - 1 == WEATHERS[cityWeather]) {
            score = score.mul(2); // Multiply by 2
        }
        uint256 classStatScore = getClassStatScore(heroId);
        uint256 weightedClassStatScore = classStatScore.mul(3); // Multiple by 3
        uint256 highestNonClassStat = getHighestNonClassStat(heroId);
        uint256 adjustedStatScore = weightedClassStatScore.add(highestNonClassStat);
        score = score.mul(adjustedStatScore);
        return score;
    }

    function getHighestNonClassStat(uint256 heroId) private view returns (uint256) {
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

    function getClassStatScore(uint256 heroId) private view returns (uint256) {
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
        require(value == _buyin); // dev: Must send the exact buyin amount
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
            _buyin,
            hasBeenPlayed,
            isFetchingWeather
        );
    }
}
