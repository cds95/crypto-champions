// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "../interfaces/ICryptoChampions.sol";
import "../interfaces/IMinigameFactoryRegistry.sol";
import "./minigames/games/priceWars/PriceWarsFactory.sol";
import "./minigames/games/priceWars/PriceWars.sol";
import "./chainlink/VRFConsumerBase.sol";
import "./openZeppelin/AccessControl.sol";
import "./openZeppelin/ERC721.sol";

import "smartcontractkit/chainlink-brownie-contracts@1.0.2/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";

import "OpenZeppelin/openzeppelin-contracts@3.4.0/contracts/math/SafeMath.sol";

import "./token/ChampzToken.sol";

/// @title Crypto Champions Interface
/// @author Oozyx
/// @notice This is the crypto champions class
contract CryptoChampions is ICryptoChampions, AccessControl, ERC721, VRFConsumerBase {
    using SafeMath for uint256;
    using SafeMath for uint8;

    /***********************************|
    |        Variables and Events       |
    |__________________________________*/

    // Possible phases the contract can be in.  Phase one is when users can mint elder spirits and two is when they can mint heros.
    enum Phase { SETUP, ACTION }

    // The current phase the contract is in.
    Phase public currentPhase;

    // Number of tokens minted whenever a user mints a hero
    uint256 internal constant NUM_CHAMPZ_MINTED_ON_HERO_MINTED = 500 * 10**18;

    // The duration of each phase in days
    uint256 internal _setupPhaseDuration;
    uint256 internal _actionPhaseDuration;

    // The current phase start time
    uint256 public currentPhaseStartTime;

    // The contract roles
    bytes32 internal constant ROLE_OWNER = keccak256("ROLE_OWNER");
    bytes32 internal constant ROLE_ADMIN = keccak256("ROLE_ADMIN");
    bytes32 internal constant ROLE_GAME_ADMIN = keccak256("ROLE_GAME_ADMIN");

    // Constants used to determine fee proportions in percentage
    // Usage: fee.mul(proportion).div(100)
    uint8 internal constant HERO_MINT_ROYALTY_PERCENT = 25;
    uint8 internal constant HERO_MINT_DEV_PERCENT = 25;

    // The amount of ETH contained in the pools
    uint256 public rewardsPoolAmount = 0;
    uint256 public devFund = 0;

    // The rewards share for every hero with the winning affinity calculated at the end of every round
    uint256 internal _heroRewardsShare = 0;

    // Mapping of hero id to a mapping of round to a bool of the rewards claim
    mapping(uint256 => mapping(uint256 => bool)) internal _heroRewardsClaimed;

    // The max amount of elders that can be minted
    uint256 public constant MAX_NUMBER_OF_ELDERS = 5;

    // The amount of elders minted
    // This amount cannot be greater than MAX_NUMBER_OF_ELDERS
    uint256 public eldersInGame = 0;

    // The mapping of elder id to the elder spirit
    mapping(uint256 => ElderSpirit) internal _elderSpirits;

    // The amount of heros minted
    uint256 public heroesMinted = 0;

    // The mapping of hero id to the hero
    mapping(uint256 => Hero) internal _heroes;

    // The mapping of the round played to the elder spawns mapping
    mapping(uint256 => mapping(uint256 => uint256)) internal _roundElderSpawns;

    // The mint price for elders and heroes
    uint256 public elderMintPrice;

    // The current round index
    uint256 public currentRound;

    // The mapping of affinities (token ticker) to price feed address
    mapping(string => address) internal _affinities;

    // List of available affinities
    string[] public affinities;

    // The list of affinities that won in a round
    mapping(uint256 => string) public winningAffinitiesByRound;

    // The key hash used for VRF
    bytes32 internal _keyHash;

    // The fee in LINK for VRF
    uint256 internal _fee;

    // Mapping of request id to hero id
    mapping(bytes32 => uint256) internal _heroRandomRequest;

    // Mapping of request id to random result
    mapping(bytes32 => uint256) internal _randomResultsVRF;

    // The identifier for the price wars game
    string internal constant PRICE_WARS_ID = "PRICE_WARS";

    // The registry of minigame factories
    IMinigameFactoryRegistry internal _minigameFactoryRegistry;

    // Pointer to ChampzToken
    ChampzToken public champzToken;

    /// @notice Triggered when an elder spirit gets minted
    /// @param elderId The elder id belonging to the minted elder
    /// @param owner The address of the owner
    event ElderSpiritMinted(uint256 elderId, address owner);

    /// @notice Triggered when a hero gets minted
    /// @param heroId The hero id belonging to the hero that was minted
    /// @param owner The address of the owner
    event HeroMinted(uint256 heroId, address owner);

    /// @notice Triggered when the elder spirits have been burned
    event ElderSpiritsBurned();

    /***********************************|
    |            Constuctor             |
    |__________________________________*/

    // Initializes a new CryptoChampions contract
    constructor(
        bytes32 keyhash,
        address vrfCoordinator,
        address linkToken,
        address minigameFactoryRegistry,
        ChampzToken champzTokenInstance
    ) public ERC721("CryptoChampz", "CHMPZ") VRFConsumerBase(vrfCoordinator, linkToken) {
        // Set up administrative roles
        _setRoleAdmin(ROLE_OWNER, ROLE_OWNER);
        _setRoleAdmin(ROLE_ADMIN, ROLE_OWNER);
        _setRoleAdmin(ROLE_GAME_ADMIN, ROLE_OWNER);

        // Set up the deployer as the owner and give admin rights
        _setupRole(ROLE_OWNER, msg.sender);
        grantRole(ROLE_ADMIN, msg.sender);

        // Set initial elder mint price
        elderMintPrice = 0.271 ether;

        // Set the initial round to 0
        currentRound = 0;

        // Set initial phase to phase one and phase start time
        currentPhase = Phase.SETUP;
        currentPhaseStartTime = now;

        // Set VRF fields
        _keyHash = keyhash;
        _fee = 0.1 * 10**18; // 0.1 LINK

        // Set phase durations
        _setupPhaseDuration = 2 days;
        _actionPhaseDuration = 2 days;

        _minigameFactoryRegistry = IMinigameFactoryRegistry(minigameFactoryRegistry);
        champzToken = champzTokenInstance;
    }

    /***********************************|
    |         Function Modifiers        |
    |__________________________________*/

    modifier isValidElderSpiritId(uint256 elderId) {
        require(elderId < MAX_NUMBER_OF_ELDERS); // dev: Given id is not valid.
        _;
    }

    modifier isValidHero(uint256 heroId) {
        require(heroId >= MAX_NUMBER_OF_ELDERS); // dev: Given id is not valid.
        require(_heroes[heroId].valid); // dev: Hero is not valid.
        _;
    }

    // Restrict to only price war addresses
    modifier onlyGameAdmin {
        require(hasRole(ROLE_GAME_ADMIN, msg.sender)); // dev: Access denied.
        _;
    }

    // Restrict to only admins
    modifier onlyAdmin {
        require(hasRole(ROLE_ADMIN, msg.sender)); // dev: Access denied.
        _;
    }

    // Restrict to the specified phase
    modifier atPhase(Phase phase) {
        require(currentPhase == phase); // dev: Current phase prohibits action.
        _;
    }

    /***********************************|
    |       Game Management/Setup       |
    |__________________________________*/

    /// @notice Sets the duration of the setup phase
    /// @param numDays Number of days for the setup phase duration
    function setSetupPhaseDuration(uint256 numDays) external onlyAdmin {
        _setupPhaseDuration = numDays * 1 days;
    }

    /// @notice Sets the duration of the action phase
    /// @param numDays Number of days for the action phase
    function setActionPhaseDuration(uint256 numDays) external onlyAdmin {
        _actionPhaseDuration = numDays * 1 days;
    }

    /// @notice Transitions to the next phase
    function _transitionNextPhase() internal {
        if (currentPhase == Phase.SETUP) {
            // If rewards have gone unclaimed, send to address
            // todo
            rewardsPoolAmount = 0;

            // Reset the hero rewards share
            _heroRewardsShare = 0;

            // todo mint all elders that have yet to be minted

            // Increment the round
            currentRound = currentRound.add(1);

            // Set the next phase
            currentPhase = Phase.ACTION;
        } else if (currentPhase == Phase.ACTION) {
            // Start the price game that will determine the winning affinity
            _startNewPriceGame();

            // Calculate hero rewards.
            // Start by finding which elder had the winning affinity
            uint256 i = 0;
            for (; i < eldersInGame; ++i) {
                if (
                    keccak256(bytes(_elderSpirits[i].affinity)) ==
                    keccak256(bytes(winningAffinitiesByRound[currentRound])) &&
                    getElderSpawnsAmount(currentRound, i) > 0
                ) {
                    _heroRewardsShare = rewardsPoolAmount.div(getElderSpawnsAmount(currentRound, i));
                    break;
                }
            }

            // Burn the elders
            _burnElders();

            // Set the next phase
            currentPhase = Phase.SETUP;
        }

        currentPhaseStartTime = now;
    }

    /// @notice Sets the contract's phase
    /// @dev May delete function and keep only the refresh phase function
    /// @param phase The phase the contract should be set to
    function setPhase(Phase phase) external onlyAdmin {
        currentPhase = phase;
    }

    /// @notice Transitions to next phase if the condition is met and rewards caller for a successful phase transition
    function refreshPhase() external override {
        bool phaseChanged = false;

        if (
            currentPhase == Phase.SETUP &&
            eldersInGame == MAX_NUMBER_OF_ELDERS &&
            now >= currentPhaseStartTime + _setupPhaseDuration
        ) {
            _transitionNextPhase();
        } else if (currentPhase == Phase.ACTION && now >= currentPhaseStartTime + _actionPhaseDuration) {
            _transitionNextPhase();
        }

        if (phaseChanged) {
            // todo reward msg.sender
        }
    }

    /// @notice Sets the token uri for the given id
    /// @dev Only the admin can set URIs
    /// @param id The token id (either hero or elder)
    /// @param uri The uri of the token id
    function setTokenURI(uint256 id, string calldata uri) external override onlyAdmin {
        _setTokenURI(id, uri);
    }

    /// @notice Creates a new token affinity
    /// @dev This will be called by a priviledged address. It will allow to create new affinities. May need to add a
    /// remove affinity function as well.
    /// @param tokenTicker The token ticker of the affinity
    /// @param feedAddress The price feed address
    function createAffinity(string calldata tokenTicker, address feedAddress) external override onlyAdmin {
        _affinities[tokenTicker] = feedAddress;
        affinities.push(tokenTicker);
    }

    /// @notice Sets the elder mint price
    /// @dev Can only be called by an admin address
    /// @param price The new elder mint price
    function setElderMintPrice(uint256 price) external override onlyAdmin {
        elderMintPrice = price;
    }

    /***********************************|
    |            VRF Functions          |
    |__________________________________*/

    /// @notice Makes a request for a random number
    /// @param userProvidedSeed The seed for the random request
    /// @return requestId The request id
    function _getRandomNumber(uint256 userProvidedSeed) internal returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= _fee); // dev: Not enough LINK - fill contract with faucet
        return requestRandomness(_keyHash, _fee, userProvidedSeed);
    }

    /// @notice Callback function used by the VRF coordinator
    /// @param requestId The request id
    /// @param randomness The randomness
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        _randomResultsVRF[requestId] = randomness;
        _trainHero(requestId);
    }

    /***********************************|
    |         Champion Minting          |
    |__________________________________*/

    /// @notice Mints an elder spirit
    /// @dev For now only race, class, and token (affinity) are needed. This will change. The race and class ids will
    /// probably be public constants defined in the crypto champions contract, this is subject to change.
    /// @param raceId The race id
    /// @param classId The class id
    /// @param affinity The affinity of the minted hero
    /// @return The elder spirit id
    function mintElderSpirit(
        uint8 raceId,
        uint8 classId,
        string calldata affinity
    ) external payable override atPhase(Phase.SETUP) returns (uint256) {
        require(eldersInGame < MAX_NUMBER_OF_ELDERS); // dev: Max number of elders already minted.
        require(msg.value >= elderMintPrice); // dev: Insufficient payment.
        require(_affinities[affinity] != address(0)); // dev: Affinity does not exist.

        // Generate the elderId and make sure it doesn't already exists
        uint256 elderId = eldersInGame;
        assert(!_exists(elderId)); // dev: Elder with id already exists.
        assert(_elderSpirits[elderId].valid == false); // dev: Elder spirit with id has already been generated.

        // Get the price data of affinity
        int256 affinityPrice;
        (, affinityPrice, , , ) = AggregatorV3Interface(_affinities[affinity]).latestRoundData();

        // Create the elder spirit
        ElderSpirit memory elder;
        elder.valid = true;
        elder.raceId = raceId;
        elder.classId = classId;
        elder.affinity = affinity;
        elder.affinityPrice = affinityPrice;

        // Mint the NFT
        _safeMint(_msgSender(), elderId);

        // Assign the elder id with the owner and its spirit
        _elderSpirits[elderId] = elder;

        // Increment elders minted
        eldersInGame = eldersInGame.add(1);

        // Refund if user sent too much
        _refundSender(elderMintPrice);

        // The entire elder minting fee goes to the dev fund
        devFund = devFund.add(elderMintPrice);

        emit ElderSpiritMinted(elderId, _msgSender());

        return elderId;
    }

    /// @notice Gets the elder owner for the given elder id
    /// @param elderId The elder id
    /// @return The owner of the elder
    function getElderOwner(uint256 elderId) public view override isValidElderSpiritId(elderId) returns (address) {
        require(_exists(elderId)); // dev: Given elder id has not been minted.

        return ownerOf(elderId);
    }

    /// @notice Mints a hero based on an elder spirit
    /// @param elderId The id of the elder spirit this hero is based on
    /// @return The hero id
    function mintHero(uint256 elderId, string calldata heroName)
        external
        payable
        override
        isValidElderSpiritId(elderId)
        atPhase(Phase.ACTION)
        returns (uint256)
    {
        require(_elderSpirits[elderId].valid); // dev: Elder with id doesn't exists or not valid.
        require(address(champzToken) != address(0)); // dev: ChampzToken not yet initialized
        require(_canMintHero(elderId)); // dev: Can't mint hero. Too mnay heroes minted for elder.

        uint256 mintPrice = getHeroMintPrice(currentRound, elderId);
        require(msg.value >= mintPrice); // dev: Insufficient payment.

        // Generate the hero id
        uint256 heroId = heroesMinted + MAX_NUMBER_OF_ELDERS;
        assert(!_exists(heroId)); // dev: Hero with id already has an owner.
        assert(_heroes[heroId].valid == false); // dev: Hero with id has already been generated.

        // Create the hero
        Hero memory hero;
        hero.valid = true;
        hero.name = heroName;
        hero.roundMinted = currentRound;
        hero.elderId = elderId;
        hero.raceId = _elderSpirits[elderId].raceId;
        hero.classId = _elderSpirits[elderId].classId;
        hero.affinity = _elderSpirits[elderId].affinity;
        _heroes[heroId] = hero;

        // Request the random number and set hero attributes
        bytes32 requestId = _getRandomNumber(heroId);
        _heroRandomRequest[requestId] = heroId;

        // Mint the NFT
        _safeMint(_msgSender(), heroId);

        // Mint in game currency tokens
        champzToken.mintTokens(_msgSender(), NUM_CHAMPZ_MINTED_ON_HERO_MINTED);

        // Increment the heroes minted and the elder spawns
        heroesMinted = heroesMinted.add(1);
        _roundElderSpawns[currentRound][elderId] = _roundElderSpawns[currentRound][elderId].add(1);

        // Disburse royalties
        uint256 royaltyFee = mintPrice.mul(HERO_MINT_ROYALTY_PERCENT).div(100);
        address seedOwner = ownerOf(elderId);
        (bool success, ) = seedOwner.call{ value: royaltyFee }("");
        require(success, "Payment failed");

        // Update the rewards and dev fund pools
        uint256 devFee = mintPrice.mul(HERO_MINT_DEV_PERCENT).div(100);
        devFund = devFund.add(devFee);
        rewardsPoolAmount = rewardsPoolAmount.add(mintPrice.sub(royaltyFee).sub(devFee));

        // Refund if user sent too much
        _refundSender(mintPrice);

        emit HeroMinted(heroId, _msgSender());

        return heroId;
    }

    /// TODO: DELETE and maybe override ownerOf()
    /// @notice Get the hero owner for the given hero id
    /// @param heroId The hero id
    /// @return The owner address
    function getHeroOwner(uint256 heroId) public view override isValidHero(heroId) returns (address) {
        require(_exists(heroId)); // dev: Given hero id has not been minted.

        return ownerOf(heroId);
    }

    /// @notice Checks to see if a hero can be minted for a given elder
    /// @dev (n < 4) || (n <= 2 * m)
    ///     n is number of champions already minted for elder
    ///     m is number of champions already minted for elder with least amount of champions
    /// @param elderId The elder id
    /// @return True if hero can be minted, false otherwise
    function _canMintHero(uint256 elderId) internal view returns (bool) {
        // Verify first condition
        if (_roundElderSpawns[currentRound][elderId] < 4) {
            return true;
        }

        // Find the elder with the least amount of heroes minted
        uint256 smallestElderAmount = _roundElderSpawns[currentRound][elderId];
        for (uint256 i = 0; i < eldersInGame; ++i) {
            if (_roundElderSpawns[currentRound][i] < smallestElderAmount) {
                smallestElderAmount = _roundElderSpawns[currentRound][i];
            }
        }

        return _roundElderSpawns[currentRound][elderId] <= smallestElderAmount.mul(2);
    }

    /// @notice Sets the hero attributes
    /// @param requestId The request id that is mapped to a hero
    function _trainHero(bytes32 requestId) internal isValidHero(_heroRandomRequest[requestId]) {
        uint256 heroId = _heroRandomRequest[requestId];
        uint256 randomNumber = _randomResultsVRF[requestId];
        uint256 newRandomNumber;

        _heroes[heroId].level = 1; // 1 by default
        (_heroes[heroId].appearance, newRandomNumber) = _rollDice(2, randomNumber); // 1 out of 2

        (_heroes[heroId].trait1, newRandomNumber) = _rollDice(4, newRandomNumber); // 1 out of 4
        (_heroes[heroId].trait2, newRandomNumber) = _rollDice(4, newRandomNumber); // 1 out of 4
        (_heroes[heroId].skill1, newRandomNumber) = _rollDice(4, newRandomNumber); // 1 out of 4
        (_heroes[heroId].skill2, newRandomNumber) = _rollDice(4, newRandomNumber); // 1 out of 4

        (_heroes[heroId].alignment, newRandomNumber) = _rollDice(9, newRandomNumber); // 1 out of 9
        (_heroes[heroId].background, newRandomNumber) = _rollDice(30, newRandomNumber); // 1 out of 30
        (_heroes[heroId].hometown, newRandomNumber) = _rollDice(24, newRandomNumber); // 1 out of 24
        (_heroes[heroId].weather, newRandomNumber) = _rollDice(7, newRandomNumber); // 1 ouf of 7

        (_heroes[heroId].hp, newRandomNumber) = _rollDice(_getHpRoll(_heroes[heroId].classId), newRandomNumber); // Roll 10-30
        _heroes[heroId].hp = uint8(_heroes[heroId].hp.add(9));
        (_heroes[heroId].mana, newRandomNumber) = _rollDice(_getManaRoll(_heroes[heroId].classId), newRandomNumber); // Roll 10-30
        _heroes[heroId].mana = uint8(_heroes[heroId].mana.add(9));
        (_heroes[heroId].stamina, newRandomNumber) = _rollDice(31, newRandomNumber); // Roll 10-40
        _heroes[heroId].stamina = uint8(_heroes[heroId].stamina.add(9));

        (_heroes[heroId].strength, newRandomNumber) = _rollDice(16, newRandomNumber); // Roll 3-18
        _heroes[heroId].strength = uint8(_heroes[heroId].strength.add(2));
        (_heroes[heroId].dexterity, newRandomNumber) = _rollDice(16, newRandomNumber); // Roll 3-18
        _heroes[heroId].dexterity = uint8(_heroes[heroId].dexterity.add(2));
        (_heroes[heroId].constitution, newRandomNumber) = _rollDice(16, newRandomNumber); // Roll 3-18
        _heroes[heroId].constitution = uint8(_heroes[heroId].constitution.add(2));
        (_heroes[heroId].intelligence, newRandomNumber) = _rollDice(16, newRandomNumber); // Roll 3-18
        _heroes[heroId].intelligence = uint8(_heroes[heroId].intelligence.add(2));
        (_heroes[heroId].wisdom, newRandomNumber) = _rollDice(16, newRandomNumber); // Roll 3-18
        _heroes[heroId].wisdom = uint8(_heroes[heroId].wisdom.add(2));
        (_heroes[heroId].charisma, newRandomNumber) = _rollDice(16, newRandomNumber); // Roll 3-18
        _heroes[heroId].charisma = uint8(_heroes[heroId].charisma.add(2));
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

    /// @notice Burns all the elder spirits in game
    function _burnElders() internal {
        for (uint256 i = 0; i < MAX_NUMBER_OF_ELDERS; ++i) {
            if (_elderSpirits[i].valid) {
                _burnElder(i);
            }
        }

        emit ElderSpiritsBurned();
    }

    /// @notice Burns the elder spirit
    /// @dev This will only be able to be called by the contract
    /// @param elderId The elder id
    function _burnElder(uint256 elderId) internal isValidElderSpiritId(elderId) {
        require(_elderSpirits[elderId].valid); // dev: Cannot burn elder that does not exist.

        _burn(elderId);

        // Reset elder values for elder id
        eldersInGame = eldersInGame.sub(1);
        _elderSpirits[elderId].valid = false;
    }

    /// @notice Gets the minting price of a hero based on specified elder spirit
    /// @param round The round of the hero to be minted
    /// @param elderId The elder id for which the hero will be based on
    /// @return The hero mint price
    function getHeroMintPrice(uint256 round, uint256 elderId)
        public
        view
        override
        isValidElderSpiritId(elderId)
        returns (uint256)
    {
        require(round <= currentRound); // dev: Cannot get price round has not started.
        uint256 heroAmount = _roundElderSpawns[round][elderId].add(1);

        return _priceFormula(heroAmount);
    }

    /// @notice The bounding curve function that calculates price for the new supply
    /// @dev price = 0.02*(heroes minted) + 0.1
    /// @param newSupply The new supply after a burn or mint
    /// @return The calculated price
    function _priceFormula(uint256 newSupply) internal pure returns (uint256) {
        uint256 price;
        uint256 base = 1;
        price = newSupply.mul(10**18).mul(2).div(100);
        price = price.add(base.mul(10**18).div(10));

        return price;
    }

    /// @notice Refunds the sender if they sent too much
    /// @param cost The cost
    function _refundSender(uint256 cost) internal {
        if (msg.value.sub(cost) > 0) {
            (bool success, ) = msg.sender.call{ value: msg.value.sub(cost) }("");
            require(success); // dev: Refund failed.
        }
    }

    /***********************************|
    |         Getter Functions          |
    |__________________________________*/

    /// @notice Gets the amount of heroes spawn from the elder with the specified id during the specified round
    /// @param round The round the elder was created
    /// @param elderId The elder id
    /// @return The amount of heroes spawned from the elder
    function getElderSpawnsAmount(uint256 round, uint256 elderId)
        public
        view
        override
        isValidElderSpiritId(elderId)
        returns (uint256)
    {
        require(round <= currentRound); // dev: Invalid round.
        return _roundElderSpawns[round][elderId];
    }

    /// @notice Fetches the data of a single elder spirit
    /// @param elderId The id of the elder being searched for
    /// @return The elder's attributes in the following order (valid, raceId, classId, affinity)
    function getElderSpirit(uint256 elderId)
        external
        view
        override
        isValidElderSpiritId(elderId)
        returns (
            bool,
            uint8,
            uint8,
            string memory,
            int256
        )
    {
        ElderSpirit memory elderSpirit = _elderSpirits[elderId];
        return (
            elderSpirit.valid,
            elderSpirit.raceId,
            elderSpirit.classId,
            elderSpirit.affinity,
            elderSpirit.affinityPrice
        );
    }

    /// @notice Hero getter function
    /// @param heroId The hero id
    /// @return valid, affinity, affinity price, round minted, elder id
    function getHeroGameData(uint256 heroId)
        external
        view
        override
        isValidHero(heroId)
        returns (
            bool, // valid
            string memory, // affinity
            int256, // affinity price
            uint256, // round minted
            uint256 // elder id
        )
    {
        return (
            _heroes[heroId].valid,
            _heroes[heroId].affinity,
            _heroes[heroId].affinityPrice,
            _heroes[heroId].roundMinted,
            _heroes[heroId].elderId
        );
    }

    /// @notice Hero getter function
    /// @param heroId The hero id
    /// @return name, race id, class id, appearance
    function getHeroVisuals(uint256 heroId)
        external
        view
        override
        isValidHero(heroId)
        returns (
            string memory, // name
            uint8, // race id
            uint8, // class id
            uint8 // appearance
        )
    {
        return (_heroes[heroId].name, _heroes[heroId].raceId, _heroes[heroId].classId, _heroes[heroId].appearance);
    }

    /// @notice Hero getter function
    /// @param heroId The hero id
    /// @return trait 1, trait 2, skill 1, skill 2
    function getHeroTraitsSkills(uint256 heroId)
        external
        view
        override
        isValidHero(heroId)
        returns (
            uint8, // trait 1
            uint8, // trait 2
            uint8, // skill 1
            uint8 // skill 2
        )
    {
        return (_heroes[heroId].trait1, _heroes[heroId].trait2, _heroes[heroId].skill1, _heroes[heroId].skill2);
    }

    /// @notice Hero getter function
    /// @param heroId The hero id
    /// @return alignment, background, hometown, weather
    function getHeroLore(uint256 heroId)
        external
        view
        override
        isValidHero(heroId)
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

    /// @notice Hero getter function
    /// @param heroId The hero id
    /// @return level, hp, mana
    function getHeroVitals(uint256 heroId)
        external
        view
        override
        isValidHero(heroId)
        returns (
            uint8, // level
            uint8, // hp
            uint8, // mana
            uint8 // stamina
        )
    {
        return (_heroes[heroId].level, _heroes[heroId].hp, _heroes[heroId].mana, _heroes[heroId].stamina);
    }

    /// @notice Hero getter function
    /// @param heroId The hero id
    /// @return stamina, strength, dexterity, constitution, intelligence, wisdom, charisma
    function getHeroStats(uint256 heroId)
        external
        view
        override
        isValidHero(heroId)
        returns (
            uint8, // strength
            uint8, // dexterity
            uint8, // constitution
            uint8, // intelligence
            uint8, // wisdom
            uint8 // charisma
        )
    {
        return (
            _heroes[heroId].strength,
            _heroes[heroId].dexterity,
            _heroes[heroId].constitution,
            _heroes[heroId].intelligence,
            _heroes[heroId].wisdom,
            _heroes[heroId].charisma
        );
    }

    /// @notice Fetches the feed address for a given affinity
    /// @param affinity The affinity being searched for
    /// @return The address of the affinity's feed address
    function getAffinityFeedAddress(string calldata affinity) external view override returns (address) {
        return _affinities[affinity];
    }

    /// @notice Fetches the number of elders currently in the game
    /// @return The current number of elders in the game
    function getNumEldersInGame() external view override returns (uint256) {
        return eldersInGame;
    }

    /***********************************|
    |            Price Game             |
    |__________________________________*/

    /// @notice Declares a winning affinity for a round
    /// @dev This can only be called by a game admin contract
    /// @param winningAffinity The affinity that won the game
    function declareRoundWinner(string calldata winningAffinity) external override atPhase(Phase.ACTION) onlyGameAdmin {
        winningAffinitiesByRound[currentRound] = winningAffinity;
    }

    /// @notice Claims the rewards for the hero if eligible
    /// @dev Can only claim once and only for the round the hero was minted
    /// @param heroId The hero id
    function claimReward(uint256 heroId) external override atPhase(Phase.SETUP) isValidHero(heroId) {
        // Check if hero is eligible and if hero hasn't already claimed
        require(_heroes[heroId].roundMinted == currentRound); // dev: Hero was not minted this round.
        require(keccak256(bytes(_heroes[heroId].affinity)) == keccak256(bytes(winningAffinitiesByRound[currentRound]))); // dev: Hero does not have the winning affinity.
        require(_heroRewardsClaimed[heroId][currentRound] == false); // dev: Reward has already been claimed.

        (bool success, ) = ownerOf(heroId).call{ value: _heroRewardsShare }("");
        require(success, "Payment failed");
        rewardsPoolAmount = rewardsPoolAmount.sub(_heroRewardsShare);
        _heroRewardsClaimed[heroId][currentRound] = true;
    }

    /// @notice Starts a new price game
    /// @dev This can only be called by the admin of the contract
    function _startNewPriceGame() internal {
        address priceWarsFactoryAddress = _minigameFactoryRegistry.getFactory(PRICE_WARS_ID);
        PriceWarsFactory priceWarsFactory = PriceWarsFactory(priceWarsFactoryAddress);
        PriceWars priceWar = priceWarsFactory.createPriceWar(address(this));
        grantRole(ROLE_GAME_ADMIN, address(priceWar));
        priceWar.startGame();
    }

    /// @notice Transfers in game currency tokens from one address to another
    /// @param to The receiving address
    /// @param amount The amount to transfer
    function transferInGameTokens(address to, uint256 amount) external override {
        // TODO: make it work with ERC20
        // bytes memory data;
        // safeTransferFrom(msg.sender, to, IN_GAME_CURRENCY_ID, amount, data);
    }

    /// @notice Transfers in game currency tokens from one address to another.
    /// @param from The sending address.  Note that the sender must be authorized to transfer funds if the sender is different from the from address.
    /// @param to The receiving address
    /// @param amount The amount to transfer
    function delegatedTransferInGameTokens(
        address from,
        address to,
        uint256 amount
    ) external override {
        // TODO: make it work with ERC20
        // bytes memory data;
        // safeTransferFrom(from, to, IN_GAME_CURRENCY_ID, amount, data);
    }

    /// @notice Returns whether or not hero has reward for the round
    /// @param heroId The id of the hero being searched for
    function hasRoundReward(uint256 heroId) external view returns (bool) {
        Hero memory hero = _heroes[heroId];
        string memory roundWinningAffinity = winningAffinitiesByRound[currentRound];
        return
            !_heroRewardsClaimed[heroId][currentRound] &&
            keccak256(bytes(hero.affinity)) == keccak256(bytes(roundWinningAffinity)) &&
            hero.roundMinted == currentRound;
    }
}
