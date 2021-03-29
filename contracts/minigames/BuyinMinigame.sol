pragma solidity ^0.6.0;

import "./Minigame.sol";

abstract contract BuyinMinigame is Minigame {
    // The amount of ether required to join the game
    uint256 public buyinAmount;

    // The mapping from hero id to the player's balance
    mapping(uint256 => uint256) balances;

    // Initializes a new buyin minigame
    constructor(
        string memory _gameName,
        uint256 amountToJoin,
        address _cryptoChampionsAddress
    ) public Minigame(_gameName, _cryptoChampionsAddress) {
        buyinAmount = amountToJoin;
    }

    /// @notice Joins a game
    /// @param heroId The id of the joining player's hero
    function joinGame(uint256 heroId) external payable override {
        require(msg.value == buyinAmount); // dev Incorrect buyin amount
        balances[heroId] = buyinAmount;
        super.joinGame(heroId);
    }

    /// @notice Leaves a game
    /// @param heroId The id of the leaving player's hero
    function leaveGame(uint256 heroId) external payable override {
        super.leaveGame(heroId);
        uint256 playerBalance = balances[heroId];
        balances[heroId] = 0;
        address playerAddress = cryptoChampions.getHeroOwner(heroId);
        address payable payableAddress = payable(playerAddress);
        payableAddress.transfer(playerBalance);
    }
}
