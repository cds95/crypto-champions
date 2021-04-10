// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "./WeatherWars.sol";
import "../../../../interfaces/ICryptoChampions.sol";

import "smartcontractkit/chainlink-brownie-contracts@1.0.2/contracts/src/v0.6/interfaces/LinkTokenInterface.sol";

import "OpenZeppelin/openzeppelin-contracts@3.4.0/contracts/math/SafeMath.sol";

contract WeatherWarsFactory {
    using SafeMath for uint256;

    address private _cryptoChampionsAddress;
    address private _linkTokenAddress;
    address private _oracleAddress;
    address private _vrfCoordinateAddress;
    bytes32 private _jobId;
    bytes32 private _keyHash;
    uint256 private _vrfFee;
    uint256 private _vrfSeed;
    uint256 private _oracleFee;
    string private _weatherApiKey;
    WeatherWars[] public games;

    event GameCreated(string gameName, string city);

    event CreatingGame(string city);

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
        string calldata weatherApiKey
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
        // TODO: uncomment once weather wars is finalized
        // Create the WeatherWars contract
        // WeatherWars newGame =
        //     new WeatherWars(oracle, _fee, "weather-wars", _cryptoChampionsAddress, _buyinAmount, jobId, _weatherApiKey);

        // Delegate player tokens to WeatherWars
        ICryptoChampions cc = ICryptoChampions(_cryptoChampionsAddress);
        cc.delegatedTransferInGameTokens(msg.sender, address(newGame), buyinAmount);

        // Set the player information
        newGame.setPlayerInformation(msg.sender, initiatorHeroId, opponent, opponentHeroId);

        // Transfer some link to the newly created game so that it can interact with Chainlink
        LinkTokenInterface(_linkTokenAddress).transfer(address(newGame), _oracleFee.add(_vrfFee));

        games.push(newGame);
    }

    /// @notice Gets the number of games
    /// @return The number of games
    function getNumGames() external returns (uint256) {
        return games.length;
    }
}
