// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "../../interfaces/ICryptoChampions.sol";

struct MinigamePlayer {
    bool isInGame;
}

abstract contract Minigame {
    enum MinigamePhase {
        OPEN, CLOSED
    }

    MinigamePhase private _currentPhase; 

    mapping(uint256 => MinigamePlayer) public players;

    uint256[] playerIds;
    
    uint256 public numPlayers;

    string public gameName;

    ICryptoChampions public cryptoChampions;

    event GameStarted();

    constructor(string memory _gameName, address _cryptoChampionsAddress) public {
        gameName = _gameName;
        _currentPhase = MinigamePhase.OPEN;
        cryptoChampions = ICryptoChampions(_cryptoChampionsAddress);
    }

    function joinGame(uint256 heroId) public virtual payable {
        require(_currentPhase == MinigamePhase.OPEN);
        MinigamePlayer memory player;
        player.isInGame = true;
        players[heroId] = player;
        playerIds.push(heroId);
        numPlayers++;
    }

    function leaveGame(uint256 heroId) external payable {
        require(_currentPhase == MinigamePhase.OPEN);
        MinigamePlayer storage player = players[heroId];
        player.isInGame = false;
        numPlayers--;
    }

    function startGame() public {
        require(_currentPhase == MinigamePhase.OPEN);
        play();
        setPhase(MinigamePhase.CLOSED);
    }

    function setPhase(MinigamePhase phase) internal {
        _currentPhase = phase;
    }

    function getNumPlayers() public view returns(uint256) {
        return numPlayers;
    }

    function play() internal virtual;
}