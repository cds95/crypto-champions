// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "./Minigame.sol";

/// @title CappedMinigame
/// @author cds95
/// @notice This is contract for a capped minigame
abstract contract CappedMinigame is Minigame {
    // The maximum number of players allowed in the game
    uint256 public maxPlayers;

    // Event to signal that the maximum number of players has been reached
    event MaxPlayersReached();

    // Initializes a new capped minigame
    constructor(
        string memory _gameName,
        uint256 _maxPlayers,
        address _cryptoChampionsAddress
    ) public Minigame(_gameName, _cryptoChampionsAddress) {
        maxPlayers = _maxPlayers;
    }

    /// @notice Joins a game
    /// @param heroId The id of the joining player's hero
    function joinGame(uint256 heroId) public payable virtual override {
        require(super.getNumPlayers() < maxPlayers);
        super.joinGame(heroId);
        if (super.getNumPlayers() == maxPlayers) {
            emit MaxPlayersReached();
            onMaxCapacityReached();
        }
    }

    /// @notice Handler function whenever the maximum number of players has been reached
    function onMaxCapacityReached() public virtual;
}
