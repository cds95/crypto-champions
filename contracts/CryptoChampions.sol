// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "../interfaces/ICryptoChampions.sol";

import "OpenZeppelin/openzeppelin-contracts@3.4.0/contracts/token/ERC1155/ERC1155.sol";

/// @title Crypto Champions Interface
/// @author Oozyx
/// @notice This is the crypto champions class
contract CryptoChampions is ICryptoChampions, ERC1155 {
    // The max amount of elders that can be minted
    uint256 public constant MAX_NUMBER_OF_ELDERS = 7;

    // The max number of Heros that can be minted
    // TODO: Determine an appropriate value
    uint256 public constant MAX_NUMBER_OF_HEROS = 100;

    // Reserved id for the in game currency
    uint256 private constant IN_GAME_CURRENCY_ID = 0;

    // The amount of elders minted
    // This amount cannot be greater than MAX_NUMBER_OF_ELDERS
    uint256 public eldersMinted = 0;

    // The mapping of elder id to elder owner, ids can only be in the range of [1, MAX_NUMBER OF ELDERS]
    mapping(uint256 => address) private _elderOwners;

    // The amount of heros minted
    // This amount cannot be greater than MAX_NUMBER_OF_HEROS
    uint256 public herosMinted = 0;

    // The mapping of hero id to owner, ids can only be in the range of
    // [1 + MAX_NUMBER_OF_ELDERS, MAX_NUMBER_OF_ELDERS + MAX_NUMBER_OF_HEROS]
    mapping(uint256 => address) private _heroOwners;

    // Initializes a new CryptoChampions contract
    // TODO: need to provide the proper uri
    constructor() public ERC1155("uri") {}

    /// @notice Creates a new token affinity
    /// @dev This will be called by a priviledged address. It will allow to create new affinities. May need to add a
    /// remove affinity function as well.
    /// @param tokenTicker The token ticker of the affinity
    function createAffinity(string calldata tokenTicker) external override {}

    /// @notice Mints an elder spirit
    /// @dev For now only race, class, and token (affinity) are needed. This will change. The race and class ids will
    /// probably be public constants defined in the crypto champions contract, this is subject to change.
    /// @param raceId The race id
    /// @param classId The class id
    /// @param affinity The affinity (token ticker)
    /// @return The elder spirit id
    function mintElderSpirit(
        uint256 raceId,
        uint256 classId,
        string calldata affinity
    ) external payable override returns (uint256) {
        return 0;
    }

    /// @notice Gets the elder owner for the given elder id
    /// @param elderId The elder id
    /// @return The owner of the elder
    function getElderOwner(uint256 elderId) public view override returns (address) {
        require(elderId > IN_GAME_CURRENCY_ID && elderId <= MAX_NUMBER_OF_ELDERS); // dev: Given id is not valid.
        require(_elderOwners[elderId] != address(0)); // dev: Given elder id has not been minted.

        return _elderOwners[elderId];
    }

    /// @notice Mints a hero based on an elder spirit
    /// @param elderId The id of the elder spirit this hero is based on
    /// @return The hero id
    function mintHero(uint256 elderId) external payable override returns (uint256) {
        return 0;
    }

    /// @notice Get the hero owner for the given hero id
    /// @param heroId The hero id
    /// @return The owner address
    function getHeroOwner(uint256 heroId) public view override returns (address) {
        require(heroId > MAX_NUMBER_OF_ELDERS && heroId <= MAX_NUMBER_OF_ELDERS + MAX_NUMBER_OF_HEROS); // dev: Given hero id is not valid.
        require(_heroOwners[heroId] != address(0)); // dev: Given hero id has not been minted.

        return _heroOwners[heroId];
    }

    /// @notice Disburses the rewards evenly among the heroes of the winning affinity
    /// @dev This will be called from a priviledged address
    /// @param winningAffinity The winning affinity token ticker
    function disburseRewards(string calldata winningAffinity) external override {}

    /// @notice Burns the elder hero for a refund
    /// @dev This will only be able to be called by a priviledged address
    /// @param elderId The elder id
    function burnElder(uint256 elderId) external override {}

    /// @notice Burns the hero for a refund
    /// @dev This will only be able to be called from the owner of the hero
    /// @param heroId The hero id to burn
    function burnHero(uint256 heroId) external override {}
}
