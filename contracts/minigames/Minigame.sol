// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "../../interfaces/ICryptoChampions.sol";

struct MinigamePlayer {
    bool isInGame;
}

abstract contract Minigame {
    enum MinigamePhase {
        OPEN, IN_GAME, FINISHED 
    }

    MinigamePhase private _currentPhase; 

    mapping(uint256 => MinigamePlayer) public players;
    
    uint256 public numPlayers;

    string public gameName;

    ICryptoChampions public cryptoChampions;

    event GameStarted();

    constructor(string memory _gameName, address _cryptoChampionsAddress) public {
        gameName = _gameName;
        _currentPhase = MinigamePhase.OPEN;
        cryptoChampions = ICryptoChampions(_cryptoChampionsAddress);
    }

    function distributeWinnings(uint256 heroId) external payable {
        address winner = cryptoChampions.getHeroOwner(heroId);
        setPhase(MinigamePhase.FINISHED);
        // TODO: Transfer money to winner 
    }

    function joinGame(uint256 heroId) public virtual {
        require(_currentPhase == MinigamePhase.OPEN);
        MinigamePlayer memory player;
        player.isInGame = true;
        players[heroId] = player;
        numPlayers++;
    }

    function leaveGame(uint256 heroId) external {
        require(_currentPhase == MinigamePhase.OPEN);
        players[heroId].isInGame = false;
        numPlayers--;
    }

    function startGame() public {
        require(_currentPhase == MinigamePhase.OPEN);
        require(numPlayers > 1);
        setPhase(MinigamePhase.IN_GAME);
        play();
    }

    function setPhase(MinigamePhase phase) internal {
        _currentPhase = phase;
    }

    function getNumPlayers() public view returns(uint256) {
        return numPlayers;
    }

    function play() internal virtual;
}