// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "./PriceWars.sol";

/// @title PriceWarsFactory
/// @author cds95
/// @notice This is the price wars factory contract to manage creating new price war contracts
contract PriceWarsFactory {
    // List of price war contracts that have been deployed
    PriceWars[] public games;

    /// @notice Triggered when a new price war contract is created
    event PriceWarCreated();

    /// @notice Creates a new price war game contract
    /// @param cryptoChampionsContractAddress The address of the crypto champions contract
    function createPriceWar(address cryptoChampionsContractAddress) external returns (PriceWars) {
        // TODO:  Look into clone factories to save gas
        PriceWars game = new PriceWars(cryptoChampionsContractAddress);
        games.push(game);
        emit PriceWarCreated();
        return game;
    }
}
