// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "../../interfaces/ICryptoChampions.sol";

struct MinigamePlayer {
    bool isInGame;
    uint256 balance;
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

    uint256 public buyinAmount;

    event GameStarted();

    constructor(string memory _gameName, address _cryptoChampionsAddress, uint256 _buyinAmount) public {
        gameName = _gameName;
        _currentPhase = MinigamePhase.OPEN;
        buyinAmount = _buyinAmount;
        cryptoChampions = ICryptoChampions(_cryptoChampionsAddress);
    }

    function distributeWinnings(uint256 heroId) external payable {
        MinigamePlayer storage gameWinner = players[heroId];
        for(uint256 playerId = 0; playerId < numPlayers; playerId++) {
            if(playerId != heroId) {
                MinigamePlayer storage loser = players[playerId];
                uint256 loserBalance = loser.balance;
                loser.balance = 0;
                loser.isInGame = false;
                gameWinner.balance += loserBalance;
            }
        }
        address winner = cryptoChampions.getHeroOwner(heroId);
        address payable payableWinner = payable(winner);
        uint256 totalWinnings = gameWinner.balance;
        gameWinner.balance = 0;
        gameWinner.isInGame = false;
        setPhase(MinigamePhase.FINISHED);
        payableWinner.transfer(totalWinnings);
    }

    function joinGame(uint256 heroId) public virtual payable {
        require(_currentPhase == MinigamePhase.OPEN);
        require(msg.value == buyinAmount);
        MinigamePlayer memory player;
        player.isInGame = true;
        player.balance = msg.value;
        players[heroId] = player;
        numPlayers++;
    }

    function leaveGame(uint256 heroId) external payable {
        require(_currentPhase == MinigamePhase.OPEN);
        MinigamePlayer storage player = players[heroId];
        player.isInGame = false;
        uint256 playerBalance = player.balance;
        player.balance = 0;
        address heroOwner = cryptoChampions.getHeroOwner(heroId);
        address payable payableOwner = payable(heroOwner);
        numPlayers--;
        payableOwner.transfer(playerBalance);
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