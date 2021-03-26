pragma solidity ^0.6.0;

import "./Minigame.sol";

contract SuddenDeathGame is Minigame {
    constructor(string memory _gameName, uint256 _maxPlayers, address _cryptoChampionsAddress) 
            Minigame(_gameName, _maxPlayers, _cryptoChampionsAddress) public {}
    
    function play() public override {
        // Call chainlink VRF
    }
}