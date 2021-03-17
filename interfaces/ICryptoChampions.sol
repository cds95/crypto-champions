// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

struct ElderSpirit {
    bool valid;
    uint256 raceId;
    uint256 classId;
    string affinity;
}

struct Hero {
    bool valid;
    ElderSpirit elder;
}

interface ICryptoChampions {
    function createAffinity(string calldata tokenTicker) external;

    function mintElderSpirit(
        uint256 raceId,
        uint256 classId,
        string calldata affinity
    ) external payable returns (uint256);

    function getElderOwner(uint256 elderId) external view returns (address);

    function mintHero(uint256 elderId) external payable returns (uint256);

    function getHeroOwner(uint256 heroId) external view returns (address);

    function disburseRewards(string calldata winningAffinity) external;

    function burnElder(uint256 elderId) external;

    function burnHero(uint256 heroId) external;
}
