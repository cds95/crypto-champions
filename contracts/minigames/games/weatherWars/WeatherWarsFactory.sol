// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "./WeatherWars.sol";
import "./WeatherWarsRandomizer.sol";
import "../../../../interfaces/ICryptoChampions.sol";

import "smartcontractkit/chainlink-brownie-contracts@1.0.2/contracts/src/v0.6/interfaces/LinkTokenInterface.sol";

import "OpenZeppelin/openzeppelin-contracts@3.4.0/contracts/math/SafeMath.sol";

contract WeatherWarsFactory {
    using SafeMath for uint256;

    string internal constant GAME_NAME = "weather-wars";

    address private _cryptoChampionsAddress;
    address private _linkTokenAddress;
    address private _oracleAddress;
    address private _vrfCoordinateAddress;
    bytes32 private _jobId;
    bytes32 private _keyHash;
    uint256 private _vrfFee;
    uint256 private _vrfSeed;
    uint256 private _oracleFee;
    uint256 private _buyin;
    string private _weatherApiKey;

    // All the games this factory has created
    WeatherWars[] public games;

    /// @notice Emit when a game has been created
    /// @param gameName The name of the game
    event GameCreated(string gameName);

    // Creates the WeatherWarsFactory contract
    constructor(
        address cryptoChampionsAddress,
        address linkTokenAddress,
        address oracleAddress,
        address vrfCoordinatorAddress,
        bytes32 jobId,
        bytes32 keyHash,
        uint256 vrfFee,
        uint256 vrfSeed,
        uint256 oracleFee,
        string memory weatherApiKey
    ) public {
        _cryptoChampionsAddress = cryptoChampionsAddress;
        _linkTokenAddress = linkTokenAddress;
        _oracleAddress = oracleAddress;
        _vrfCoordinateAddress = vrfCoordinatorAddress;
        _jobId = jobId;
        _keyHash = keyHash;
        _vrfFee = vrfFee;
        _vrfSeed = vrfSeed;
        _oracleFee = oracleFee;
        _weatherApiKey = weatherApiKey;
    }

    /// @notice Creates the weather wars contract
    /// @param buyinAmount The buyinAmount
    /// @param initiatorHeroId The initiator hero id
    /// @param opponent The opponent address
    /// @param opponentHeroId The opponent hero id
    function createWeatherWars(
        uint256 buyinAmount,
        uint256 initiatorHeroId,
        address opponent,
        uint256 opponentHeroId
    ) external {
        // Create the WeatherWarsRandomizer contract
        WeatherWarsRandomizer randomizer =
            new WeatherWarsRandomizer(_keyHash, _vrfCoordinateAddress, _linkTokenAddress, _vrfFee, _vrfSeed);

        // Send link amount to randomizer
        LinkTokenInterface(_linkTokenAddress).transfer(address(randomizer), _vrfFee);

        // Request the randomness from the randomizer
        randomizer.requestRandomness();

        // Create the WeatherWars contract
        WeatherWars newGame =
            new WeatherWars(
                _cryptoChampionsAddress,
                _linkTokenAddress,
                _oracleAddress,
                address(randomizer),
                _jobId,
                _oracleFee,
                buyinAmount,
                GAME_NAME,
                _weatherApiKey
            );

        // Delegate player tokens to WeatherWars
        ICryptoChampions cc = ICryptoChampions(_cryptoChampionsAddress);
        cc.delegatedTransferInGameTokens(msg.sender, address(newGame), buyinAmount);

        // Set the player information
        newGame.setPlayerInformation(msg.sender, initiatorHeroId, opponent, opponentHeroId);

        // Transfer some link to the newly created game so that it can interact with Chainlink
        LinkTokenInterface(_linkTokenAddress).transfer(address(newGame), _oracleFee.add(_vrfFee));

        games.push(newGame);

        emit GameCreated(GAME_NAME);
    }

    /// @notice Gets the number of games
    /// @return The number of games
    function getNumGames() external view returns (uint256) {
        return games.length;
    }
}
