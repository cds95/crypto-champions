// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "../../interfaces/IMinigame.sol";
import "../../interfaces/ICryptoChampions.sol";

abstract contract Minigame is IMinigame {
    enum MinigamePhase {
        OPEN, IN_GAME, FINISHED 
    }

    MinigamePhase private _currentPhase; 

    mapping(uint256 => MinigamePlayer) public players;
    
    uint256 public numPlayers;

    uint256 public maxPlayers; 

    string public gameName;

    ICryptoChampions public cryptoChampions;

    constructor(string memory _gameName, uint256 _maxPlayers, address _cryptoChampionsAddress) public {
        gameName = _gameName;
        maxPlayers = _maxPlayers;
        _currentPhase = MinigamePhase.OPEN;
        cryptoChampions = ICryptoChampions(_cryptoChampionsAddress);
    }

    function distributeWinnings(uint256 heroId) external payable override {
        address winner = cryptoChampions.getHeroOwner(heroId);
        setPhase(MinigamePhase.FINISHED);
        // TODO: Transfer money to winner 
    }

    function joinGame(uint256 heroId) external override {
        require(_currentPhase == MinigamePhase.OPEN);
        require(numPlayers + 1 <= maxPlayers);
        MinigamePlayer memory player;
        player.isInGame = true;
        players[heroId] = player;
        numPlayers++;
    }

    function leaveGame(uint256 heroId) external override {
        require(_currentPhase == MinigamePhase.OPEN);
        players[heroId].isInGame = false;
        numPlayers--;
    }

    function startGame() external override {
        require(_currentPhase == MinigamePhase.OPEN);
        require(numPlayers > 1);
        setPhase(MinigamePhase.IN_GAME);
        play();
    }

    function setPhase(MinigamePhase phase) internal {
        _currentPhase = phase;
    }

    function play() public virtual override;
}