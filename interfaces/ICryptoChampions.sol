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
    uint256 roundMinted;
    uint256 elderId;
    uint256 raceId;
    uint256 classId;
    string affinity;
    string name;
}

interface ICryptoChampions {
    function createAffinity(string calldata tokenTicker) external;

    function setElderMintPrice(uint256 price) external;

    function mintElderSpirit(
        uint256 raceId,
        uint256 classId,
        string calldata affinity
    ) external payable returns (uint256);

    function getElderOwner(uint256 elderId) external view returns (address);

    function mintHero(uint256 elderId, string memory heroName) external payable returns (uint256);

    function getHeroOwner(uint256 heroId) external view returns (address);

    function disburseRewards(string calldata winningAffinity) external;

    function burnElders() external;

    function burnHero(uint256 heroId) external;

    function getElderSpirit(uint256 elderId) external view returns (bool, uint256, uint256, string memory);

    function getHeroMintPrice(uint256 round, uint256 elderId) external view returns (uint256);

    function getHeroRefundAmount(uint256 heroId) external view returns (uint256);

    function getElderSpawnsAmount(uint256 round, uint256 elderId) external view returns (uint256);
}
