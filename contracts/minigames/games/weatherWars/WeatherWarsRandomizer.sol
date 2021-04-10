// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "../../../chainlink_contracts/VRFConsumerBase.sol";

/// @title WeatherWarsRandomizer
/// @author Oozyx
/// @notice Provides VRF needs to the WeatherWars contract
contract WeatherWarsRandomizer is VRFConsumerBase {
    // The maximum number of cities
    uint8 private constant MAX_CITIES = 24;

    // The contract owner
    address private _owner;

    // The key hash for the VRF
    bytes32 private _keyHash;

    // The fee in link for the VRF
    uint256 private _linkFee;

    // The seed for the VRF
    uint256 private _seed;

    // The request id used to verify if randomness has been fulfilled
    bytes32 private _requestId;

    // The city id which is the result of the VRF
    uint256 private _cityId;

    // Creates the WeatherWarsRandomizer contract
    constructor(
        bytes32 keyHash,
        address vrfCoordinateAddress,
        address linkTokenAddress,
        uint256 linkFee,
        uint256 seed
    ) public VRFConsumerBase(vrfCoordinateAddress, linkTokenAddress) {
        // Owner of contract is deployer
        _owner = msg.sender;

        _keyHash = keyHash;
        _linkFee = linkFee;
        _seed = seed;

        requestRandomness(_keyHash, _linkFee, _seed);
    }

    /// @notice Callback function for the VRF
    /// @param requestId The request id
    /// @param randomNum The random number result from the VRF
    function fulfillRandomness(bytes32 requestId, uint256 randomNum) internal override {
        _requestId = requestId;
        _cityId = randomNum % MAX_CITIES;
    }

    /// @notice Gets the city id
    /// @dev Requires the randomness to be fulfilled
    /// @return The city id
    function getCityId() public view returns (uint256) {
        require(_requestId != 0); // dev: Randomness has yet to be fulfilled.
        return _cityId;
    }
}
