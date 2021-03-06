// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

struct ElderSpirit {
    bool valid;
    uint8 raceId;
    uint8 classId;
    string affinity;
    int256 affinityPrice;
}

struct Hero {
    bool valid;
    string name;
    string affinity;
    int256 affinityPrice;
    uint256 roundMinted;
    uint256 elderId;
    uint8 raceId;
    uint8 classId;
    uint8 appearance;
    uint8 trait1;
    uint8 trait2;
    uint8 skill1;
    uint8 skill2;
    uint8 alignment;
    uint8 background;
    uint8 hometown;
    uint8 weather;
    uint8 level;
    uint8 hp;
    uint8 mana;
    uint8 stamina;
    uint8 strength;
    uint8 dexterity;
    uint8 constitution;
    uint8 intelligence;
    uint8 wisdom;
    uint8 charisma;
}

interface ICryptoChampions {
    function createAffinity(string calldata tokenTicker, address feedAddress) external;

    function setElderMintPrice(uint256 price) external;

    function setTokenURI(uint256 id, string calldata uri) external;

    function mintElderSpirit(
        uint8 raceId,
        uint8 classId,
        string calldata affinity
    ) external payable returns (uint256);

    function getElderOwner(uint256 elderId) external view returns (address);

    function mintHero(uint256 elderId, string memory heroName) external payable returns (uint256);

    function getHeroOwner(uint256 heroId) external view returns (address);

    function getElderSpirit(uint256 elderId)
        external
        view
        returns (
            bool,
            uint8,
            uint8,
            string memory,
            int256
        );

    function getHeroGameData(uint256 heroId)
        external
        view
        returns (
            bool, // valid
            string memory, // affinity
            int256, // affinity price
            uint256, // round minted
            uint256 // elder id
        );

    function getHeroVisuals(uint256 heroId)
        external
        view
        returns (
            string memory, // name
            uint8, // race id
            uint8, // class id
            uint8 // appearance
        );

    function getHeroTraitsSkills(uint256 heroId)
        external
        view
        returns (
            uint8, // trait 1
            uint8, // trait 2
            uint8, // skill 1
            uint8 // skill 2
        );

    function getHeroLore(uint256 heroId)
        external
        view
        returns (
            uint8, // alignment
            uint8, // background
            uint8, // hometown
            uint8 // weather
        );

    function getHeroVitals(uint256 heroId)
        external
        view
        returns (
            uint8, // level
            uint8, // hp
            uint8, // mana
            uint8 // stamina
        );

    function getHeroStats(uint256 heroId)
        external
        view
        returns (
            uint8, // strength
            uint8, // dexterity
            uint8, // constitution
            uint8, // intelligence
            uint8, // wisdom
            uint8 // charisma
        );

    function getHeroMintPrice(uint256 round, uint256 elderId) external view returns (uint256);

    function getElderSpawnsAmount(uint256 round, uint256 elderId) external view returns (uint256);

    function getAffinityFeedAddress(string calldata affinity) external view returns (address);

    function declareRoundWinner(string calldata winningAffinity) external;

    function claimReward(uint256 heroId) external;

    function getNumEldersInGame() external view returns (uint256);

    function transferInGameTokens(address to, uint256 amount) external;

    function delegatedTransferInGameTokens(
        address from,
        address to,
        uint256 amount
    ) external;

    function refreshPhase() external;
}
