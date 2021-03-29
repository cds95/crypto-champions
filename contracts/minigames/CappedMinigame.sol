// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "./Minigame.sol";

abstract contract CappedMinigame is Minigame {
    uint256 public maxPlayers;

    constructor(string memory _gameName, uint256 _maxPlayers, address _cryptoChampionsAddress) Minigame(_gameName, _cryptoChampionsAddress) public {
        maxPlayers = _maxPlayers;
    }

    function joinGame(uint256 heroId) public virtual override payable {
        require(super.getNumPlayers() < maxPlayers);
        super.joinGame(heroId);
        if(super.getNumPlayers() == maxPlayers) {
            onMaxCapacityReached();
        }
    }    

    function onMaxCapacityReached() public virtual;
}