// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "../../interfaces/ICryptoChampions.sol";

struct MinigamePlayer {
    bool isInGame;

    // Will add more as needed
}

/// @title Minigame
/// @author cds95
/// @notice This is contract for a minigame
abstract contract Minigame {
    // Possible game phases
    enum MinigamePhase { OPEN, CLOSED }

    // The current game's phase
    MinigamePhase private _currentPhase;

    // Map of hero ids to player struct
    mapping(uint256 => MinigamePlayer) public players;

    // List of hero IDs in the game
    uint256[] internal _heroIds;

    // Number of players currently in the game
    uint256 public numPlayers;

    // Name of the game
    string public gameName;

    // Reference to crypto champions contract
    ICryptoChampions public cryptoChampions;

    // Event to signal that a game has started
    event GameStarted();

    // Event to signal that a game has ended
    event GameEnded();

    // Initializes a new minigame
    /// @param _gameName The minigame's name
    /// @param _cryptoChampionsAddress The address of the cryptoChampions contract
    constructor(string memory _gameName, address _cryptoChampionsAddress) public {
        gameName = _gameName;
        _currentPhase = MinigamePhase.OPEN;
        cryptoChampions = ICryptoChampions(_cryptoChampionsAddress);
    }

    /// @notice Joins a game
    /// @param heroId The id of the joining player's hero
    function joinGame(uint256 heroId) public payable virtual {
        require(_currentPhase == MinigamePhase.OPEN);
        MinigamePlayer memory player;
        player.isInGame = true;
        players[heroId] = player;
        numPlayers++;
    }

    /// @notice Leaves a game
    /// @param heroId The id of the leaving player's hero
    function leaveGame(uint256 heroId) external payable {
        require(_currentPhase == MinigamePhase.OPEN);
        MinigamePlayer storage player = players[heroId];
        player.isInGame = false;
        numPlayers--;
    }

    /// @notice Starts a new game and closes it when it's finished
    function startGame() public {
        require(_currentPhase == MinigamePhase.OPEN);
        play();
        setPhase(MinigamePhase.CLOSED);
    }

    /// @notice Sets the current game's phase
    /// @param phase The phase the game should be set to
    function setPhase(MinigamePhase phase) internal {
        _currentPhase = phase;
    }

    /// @notice Gets the number of players in the game
    function getNumPlayers() public view returns (uint256) {
        return numPlayers;
    }

    /// @notice Handler function to execute game logic.  This should be implemented by the concrete class.
    function play() internal virtual;
}
