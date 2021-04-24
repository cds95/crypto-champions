// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "./Champz.sol";
import "./ChampzPlatform.sol";
import "../interfaces/ICryptoChampions.sol";

import "OpenZeppelin/openzeppelin-contracts@3.4.0/contracts/math/SafeMath.sol";

contract ChampzCaller is ChampzPlatform {
    using SafeMath for uint8;
    using SafeMath for uint256;

    mapping(uint256 => Hero) internal _heroes;

    constructor(address champz) public ChampzPlatform(champz) {}

    function mintChampz(uint8 raceId, uint8 classId) external {
        uint256 champzId = _mintChampz(msg.sender);
        _heroes[champzId].valid = true;
        _heroes[champzId].raceId = raceId;
        _heroes[champzId].classId = classId;
    }

    function registerChampz(
        uint256 champzId,
        uint8 raceId,
        uint8 classId
    ) external {
        require(!_heroes[champzId].valid);
        require(CHAMPZ.getChampzRandomNumber(champzId) != 0);
        _heroes[champzId].valid = true;
        _heroes[champzId].raceId = raceId;
        _heroes[champzId].classId = classId;
        _registerChampz(champzId);
    }

    function _registerChampz(uint256 champzId) internal override {
        trainHero(champzId);
    }

    function fulfillChampzMint(uint256 champzId) internal override {
        trainHero(champzId);
    }

    /// @notice Sets the hero attributes
    /// @param champzId The is associated with the Champz NFT
    function trainHero(uint256 champzId) internal {
        uint256 randomNumber = CHAMPZ.getChampzRandomNumber(champzId);
        uint256 newRandomNumber;

        _heroes[champzId].level = 1; // 1 by default
        (_heroes[champzId].appearance, newRandomNumber) = _rollDice(2, randomNumber); // 1 out of 2

        (_heroes[champzId].trait1, newRandomNumber) = _rollDice(4, newRandomNumber); // 1 out of 4
        (_heroes[champzId].skill1, newRandomNumber) = _rollDice(4, newRandomNumber); // 1 out of 4

        (_heroes[champzId].alignment, newRandomNumber) = _rollDice(9, newRandomNumber); // 1 out of 9
        (_heroes[champzId].background, newRandomNumber) = _rollDice(30, newRandomNumber); // 1 out of 30
        (_heroes[champzId].hometown, newRandomNumber) = _rollDice(24, newRandomNumber); // 1 out of 24
        (_heroes[champzId].weather, newRandomNumber) = _rollDice(7, newRandomNumber); // 1 ouf of 7

        (_heroes[champzId].hp, newRandomNumber) = _rollDice(_getHpRoll(_heroes[champzId].classId), newRandomNumber); // Roll 10-30
        _heroes[champzId].hp = uint8(_heroes[champzId].hp.add(9));
        (_heroes[champzId].mana, newRandomNumber) = _rollDice(_getManaRoll(_heroes[champzId].classId), newRandomNumber); // Roll 10-30
        _heroes[champzId].mana = uint8(_heroes[champzId].mana.add(9));
        (_heroes[champzId].stamina, newRandomNumber) = _rollDice(31, newRandomNumber); // Roll 10-40
        _heroes[champzId].stamina = uint8(_heroes[champzId].stamina.add(9));

        (_heroes[champzId].strength, newRandomNumber) = _rollDice(16, newRandomNumber); // Roll 3-18
        _heroes[champzId].strength = uint8(_heroes[champzId].strength.add(2));
        (_heroes[champzId].dexterity, newRandomNumber) = _rollDice(16, newRandomNumber); // Roll 3-18
        _heroes[champzId].dexterity = uint8(_heroes[champzId].dexterity.add(2));
        (_heroes[champzId].constitution, newRandomNumber) = _rollDice(16, newRandomNumber); // Roll 3-18
        _heroes[champzId].constitution = uint8(_heroes[champzId].constitution.add(2));
        (_heroes[champzId].intelligence, newRandomNumber) = _rollDice(16, newRandomNumber); // Roll 3-18
        _heroes[champzId].intelligence = uint8(_heroes[champzId].intelligence.add(2));
        (_heroes[champzId].wisdom, newRandomNumber) = _rollDice(16, newRandomNumber); // Roll 3-18
        _heroes[champzId].wisdom = uint8(_heroes[champzId].wisdom.add(2));
        (_heroes[champzId].charisma, newRandomNumber) = _rollDice(16, newRandomNumber); // Roll 3-18
        _heroes[champzId].charisma = uint8(_heroes[champzId].charisma.add(2));
    }

    /// @notice Gets the roll value for the hp attribute of a hero
    /// @param class The hero's class id
    /// @return The roll value for hp
    function _getHpRoll(uint8 class) internal pure returns (uint8) {
        // Warrior
        if (class == 0) {
            return 41;
        }
        // Mage, Necromancer, Priest
        else if (class == 1 || class == 5 || class == 6) {
            return 21;
        }
        // Druid, Paladin, Bard, Rogue
        else {
            return 31;
        }
    }

    /// @notice Gets the roll value for the mana attribute of a hero
    /// @param class The hero's class id
    /// @return The roll value for mana
    function _getManaRoll(uint8 class) internal pure returns (uint8) {
        // Warrior
        if (class == 0) {
            return 21;
        }
        // Mage, Necromancer, Priest
        else if (class == 1 || class == 5 || class == 6) {
            return 41;
        }
        // Druid, Paladin, Bard, Rogue
        else {
            return 31;
        }
    }

    /// @notice Simulates rolling dice
    /// @param maxNumber The max number of the dice (e.g. regular die is 6)
    /// @param randomNumber The random number
    /// @return The result of the dice roll and a new random number to use for another dice roll
    function _rollDice(uint8 maxNumber, uint256 randomNumber) internal pure returns (uint8, uint256) {
        return (uint8(randomNumber.mod(maxNumber).add(1)), randomNumber.div(10));
    }

    /// @notice Hero getter function
    /// @param heroId The hero id
    /// @return alignment, background, hometown, weather
    function getHeroLore(uint256 heroId)
        external
        view
        returns (
            uint8, // alignment
            uint8, // background
            uint8, // hometown
            uint8 // weather
        )
    {
        return (
            _heroes[heroId].alignment,
            _heroes[heroId].background,
            _heroes[heroId].hometown,
            _heroes[heroId].weather
        );
    }
}
