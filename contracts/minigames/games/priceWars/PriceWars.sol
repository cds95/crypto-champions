// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "../../Minigame.sol";
import "../../../../interfaces/ICryptoChampions.sol";

import "smartcontractkit/chainlink-brownie-contracts@1.0.2/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";

import "OpenZeppelin/openzeppelin-contracts@3.4.0/contracts/math/SignedSafeMath.sol";

/// @title PriceWars
/// @author cds95
/// @notice This is the contract for the price wars minigame
contract PriceWars is Minigame {
    using SignedSafeMath for int256;

    // Initializes a new price war minigame
    constructor(address cryptoChampionsContractAddress) public Minigame("price-wars", cryptoChampionsContractAddress) {}

    /// @notice Executes one round of a price war minigame by determining the affinity with the token that had the greatest gain.
    function play() internal override {
        string memory winningAffinity;
        int256 greatestPercentageChange;
        for (uint256 elderId = 0; elderId < cryptoChampions.getNumEldersInGame(); elderId++) {
            string memory affinity;
            int256 startAffinityPrice;
            (, , , affinity, startAffinityPrice) = cryptoChampions.getElderSpirit(elderId);
            int256 percentageChange = determinePercentageChange(startAffinityPrice, affinity);
            if (percentageChange > greatestPercentageChange || greatestPercentageChange == 0) {
                greatestPercentageChange = percentageChange;
                winningAffinity = affinity;
            }
        }
        cryptoChampions.declareRoundWinner(winningAffinity);
    }

    /// @notice Determines the percentage change of a token.
    /// @return The token's percentage change.
    function determinePercentageChange(int256 startAffinityPrice, string memory affinity)
        internal
        view
        returns (int256)
    {
        address feedAddress = cryptoChampions.getAffinityFeedAddress(affinity);
        int256 currentAffinityPrice;
        (, currentAffinityPrice, , , ) = AggregatorV3Interface(feedAddress).latestRoundData();
        int256 absoluteChange = currentAffinityPrice.sub(startAffinityPrice);
        return absoluteChange.mul(100).div(startAffinityPrice);
    }
}
