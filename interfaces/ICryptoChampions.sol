// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

/// @title Crypto Champions Interface
/// @author Oozyx
/// @notice This is the crypto champions interface class
interface ICryptoChampions {
    /// @notice Creates a new token affinity
    /// @dev This will be called by a priviledged address. It will allow to create new affinities. May need to add a
    /// remove affinity function as well.
    /// @param tokenTicker The token ticker of the affinity
    function createAffinity(string calldata tokenTicker) external;

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
    ) external payable returns (uint256);

    /// @notice Mints a hero based on an elder spirit
    /// @param elderId The id of the elder spirit this hero is based on
    /// @return The hero id
    function mintHero(uint256 elderId) external payable returns (uint256);

    /// @notice Disburses the rewards evenly among the heroes of the winning affinity
    /// @dev This will be called from a priviledged address
    /// @param winningAffinity The winning affinity token ticker
    function disburseRewards(string calldata winningAffinity) external;

    /// @notice Burns the elder hero for a refund
    /// @dev This will only be able to be called by a priviledged address
    /// @param elderId The elder id
    function burnElder(uint256 elderId) external;

    /// @notice Burns the hero for a refund
    /// @dev This will only be able to be called from the owner of the hero
    /// @param heroId The hero id to burn
    function burnHero(uint256 heroId) external;
}
