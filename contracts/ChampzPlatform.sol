// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "./Champz.sol";

import "OpenZeppelin/openzeppelin-contracts@3.4.0/contracts/math/SafeMath.sol";

/// @title A platform contract that is compatible with Champz
/// @author Oozyx
/// @notice To be inherited from
abstract contract ChampzPlatform {
    // An instance of the Champz contract
    Champz internal CHAMPZ;

    /// @notice Initializes an instance of the ChampzPlatform contract
    /// @param champz The address of the Champz contract
    constructor(address champz) public {
        CHAMPZ = Champz(champz);
    }

    /// @notice Mints a Champz NFT
    /// @dev To be called from a contract implementation
    /// @param owner The owner of the minted NFT
    /// @return The unique identifier of the NFT
    function _mintChampz(address owner) internal returns (uint256) {
        return CHAMPZ.mintChampz(owner);
    }

    /// @notice Registers an existing Champz into the contract
    /// @dev To be called from a contract implementation for when an existing Champz wants to enter the platform
    /// @param champzId The unique identifier of the Champz NFT
    function _registerChampz(uint256 champzId) internal virtual;

    /// @notice Callback function called by the Champz contract once it has received the verifiable random number for
    ///     the newly minted NFT
    /// @param champzId The unique identifier of the newly minted NFT
    function fulfillChampzMint(uint256 champzId) internal virtual;

    function fulfillChampzMintRaw(uint256 champzId) external {
        require(msg.sender == address(CHAMPZ));
        fulfillChampzMint(champzId);
    }
}
