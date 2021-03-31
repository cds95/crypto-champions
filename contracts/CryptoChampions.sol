// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "../interfaces/ICryptoChampions.sol";
import "../interfaces/IMinigameFactoryRegistry.sol";
import "./chainlink_contracts/AggregatorV3Interface.sol";
import "./chainlink_contracts/VRFConsumerBase.sol";
import "./minigames/games/priceWars/PriceWarsFactory.sol";
import "./minigames/games/priceWars/PriceWars.sol";

import "OpenZeppelin/openzeppelin-contracts@3.4.0/contracts/access/AccessControl.sol";
import "OpenZeppelin/openzeppelin-contracts@3.4.0/contracts/math/SafeMath.sol";
import "OpenZeppelin/openzeppelin-contracts@3.4.0/contracts/token/ERC1155/ERC1155.sol";

/// @title Crypto Champions Interface
/// @author Oozyx
/// @notice This is the crypto champions class
contract CryptoChampions is ICryptoChampions, AccessControl, ERC1155, VRFConsumerBase {
    using SafeMath for uint256;

    // Possible phases the contract can be in.  Phase one is when users can mint elder spirits and two is when they can mint heros.
    enum Phase { ONE, TWO }

    // The current phase the contract is in.
    Phase public currentPhase;

    // The owner role is used to globally govern the contract
    bytes32 internal constant ROLE_OWNER = keccak256("ROLE_OWNER");

    // The admin role is used for administrator duties and reports to the owner
    bytes32 internal constant ROLE_ADMIN = keccak256("ROLE_ADMIN");

    // The role to declare round winners
    bytes32 internal constant ROLE_GAME_ADMIN = keccak256("ROLE_GAME_ADMIN");

    // Reserved id for the in game currency
    uint256 internal constant IN_GAME_CURRENCY_ID = 0;

    // Constants used to determine fee proportions.
    // Usage: fee.mul(proportion).div(10)
    uint8 internal constant HERO_MINT_ROYALTY_PROPORTION = 8;

    // The identifier for the price wars game
    string internal constant PRICE_WARS_ID = "PRICE_WARS";

    // The max amount of elders that can be minted
    uint256 public constant MAX_NUMBER_OF_ELDERS = 7;

    // The amount of elders minted
    // This amount cannot be greater than MAX_NUMBER_OF_ELDERS
    uint256 public eldersInGame = 0;

    // The mapping of elder id to elder owner, ids can only be in the range of [1, MAX_NUMBER OF ELDERS]
    mapping(uint256 => address) internal _elderOwners;

    // The mapping of elder id to the elder spirit
    mapping(uint256 => ElderSpirit) internal _elderSpirits;

    // The amount of heros minted
    uint256 public heroesMinted = 0;

    // The mapping of hero id to owner, ids can only be in the range of
    // [1 + MAX_NUMBER_OF_ELDERS, ]
    mapping(uint256 => address) internal _heroOwners;

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

    // The key hash used for VRF
    bytes32 internal _keyHash;

    // The fee in LINK for VRF
    uint256 internal _fee;

    // Mapping of request id to hero id
    mapping(uint256 => bytes32) internal _heroRandomRequest;

    // Mapping of request id to random result
    mapping(bytes32 => uint256) internal _randomResultsVRF;

    // The list of affinities that won in a round
    string[] public winningAffinitiesByRound;

    // The registry of minigame factories
    IMinigameFactoryRegistry internal _minigameFactoryRegistry;

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

    /// @notice Triggered when a hero has been burned
    /// @param heroId The hero id of the hero that was burned
    event HeroBurned(uint256 heroId);

    // Initializes a new CryptoChampions contract
    // TODO: need to provide the proper uri
    constructor(
        bytes32 keyhash,
        address vrfCoordinator,
        address linkToken,
        address minigameFactoryRegistry
    ) public ERC1155("uri") VRFConsumerBase(vrfCoordinator, linkToken) {
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

        // Set initial phase to phase one
        currentPhase = Phase.ONE;

        // Set VRF fields
        _keyHash = keyhash;
        _fee = 0.1 * 10**18; // 0.1 LINK

        _minigameFactoryRegistry = IMinigameFactoryRegistry(minigameFactoryRegistry);
    }

    modifier isValidElderSpiritId(uint256 elderId) {
        require(elderId > IN_GAME_CURRENCY_ID && elderId <= MAX_NUMBER_OF_ELDERS); // dev: Given id is not valid.
        _;
    }

    modifier isValidHero(uint256 heroId) {
        require(heroId > MAX_NUMBER_OF_ELDERS); // dev: Given id is not valid.
        require(_heroes[heroId].valid); // dev: Hero is not valid.
        _;
    }

    // Restrict to only price war addresses
    modifier onlyGameAdmin {
        _hasRole(ROLE_GAME_ADMIN);
        _;
    }

    // Restrict to only admins
    modifier onlyAdmin {
        _hasRole(ROLE_ADMIN);
        _;
    }

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
    }

    /// @notice Sets the contract's phase
    /// @param phase The phase the contract should be set to
    function setPhase(Phase phase) external onlyAdmin {
        currentPhase = phase;
    }

    /// @notice Check if msg.sender has the role
    /// @param role The role to verify
    function _hasRole(bytes32 role) internal view {
        require(hasRole(role, msg.sender)); // dev: Access denied.
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

    /// @notice Mints an elder spirit
    /// @dev For now only race, class, and token (affinity) are needed. This will change. The race and class ids will
    /// probably be public constants defined in the crypto champions contract, this is subject to change.
    /// @param raceId The race id
    /// @param classId The class id
    /// @param affinity The affinity of the minted hero
    /// @return The elder spirit id
    function mintElderSpirit(
        uint256 raceId,
        uint256 classId,
        string calldata affinity
    ) external payable override returns (uint256) {
        require(currentPhase == Phase.ONE); // dev: Can only mint elders in phase one
        require(eldersInGame < MAX_NUMBER_OF_ELDERS); // dev: Max number of elders already minted.
        require(msg.value >= elderMintPrice); // dev: Insufficient payment.
        require(_affinities[affinity] != address(0)); // dev: Affinity does not exist.

        // Generate the elderId and make sure it doesn't already exists
        uint256 elderId = eldersInGame.add(1);
        assert(_elderOwners[elderId] == address(0)); // dev: Elder with id already has owner.
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
        _mint(_msgSender(), elderId, 1, ""); // TODO: give the URI

        // Assign the elder id with the owner and its spirit
        _elderOwners[elderId] = _msgSender();
        _elderSpirits[elderId] = elder;

        // Increment elders minted
        eldersInGame = eldersInGame.add(1);

        // Refund if user sent too much
        _refundSender(elderMintPrice);

        emit ElderSpiritMinted(elderId, _msgSender());

        return elderId;
    }

    /// @notice Gets the elder owner for the given elder id
    /// @param elderId The elder id
    /// @return The owner of the elder
    function getElderOwner(uint256 elderId) public view override isValidElderSpiritId(elderId) returns (address) {
        require(_elderOwners[elderId] != address(0)); // dev: Given elder id has not been minted.

        return _elderOwners[elderId];
    }

    /// @notice Mints a hero based on an elder spirit
    /// @param elderId The id of the elder spirit this hero is based on
    /// @return The hero id
    function mintHero(uint256 elderId, string calldata heroName)
        external
        payable
        override
        isValidElderSpiritId(elderId)
        returns (uint256)
    {
        require(currentPhase == Phase.TWO); //dev: Can only mint hero in phase 2.
        require(_elderSpirits[elderId].valid); // dev: Elder with id doesn't exists or not valid.

        require(_canMintHero(elderId)); // dev: Can't mint hero. Too mnay heroes minted for elder.

        uint256 mintPrice = getHeroMintPrice(currentRound, elderId);
        require(msg.value >= mintPrice); // dev: Insufficient payment.

        // Generate the hero id
        uint256 heroId = heroesMinted.add(1) + MAX_NUMBER_OF_ELDERS;
        assert(_heroOwners[heroId] == address(0)); // dev: Hero with id already has an owner.
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
        _heroRandomRequest[heroId] = requestId;

        // Mint the NFT
        _mint(_msgSender(), heroId, 1, ""); // TODO: give the URI

        // Assign the hero id with the owner and with the hero
        _heroOwners[heroId] = _msgSender();

        // Increment the heroes minted and the elder spawns
        heroesMinted = heroesMinted.add(1);
        _roundElderSpawns[currentRound][elderId] = _roundElderSpawns[currentRound][elderId].add(1);

        // Disburse royalties
        uint256 royaltyFee = mintPrice.mul(HERO_MINT_ROYALTY_PROPORTION).div(10);
        address seedOwner = _elderOwners[elderId];
        (bool success, ) = seedOwner.call{ value: royaltyFee }("");
        require(success, "Payment failed");
        // Remaining 20% kept for contract/Treum

        // Refund if user sent too much
        _refundSender(mintPrice);

        emit HeroMinted(heroId, _msgSender());

        return heroId;
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
        for (uint256 i = 1; i <= eldersInGame; ++i) {
            if (_roundElderSpawns[currentRound][i] < smallestElderAmount) {
                smallestElderAmount = _roundElderSpawns[currentRound][i];
            }
        }

        return _roundElderSpawns[currentRound][elderId] <= smallestElderAmount.mul(2);
    }

    /// @notice Sets the hero attributes
    /// @param heroId The hero id
    function trainHero(uint256 heroId) external override isValidHero(heroId) {
        bytes32 heroRequestId = _heroRandomRequest[heroId];
        require(heroRequestId != 0); // dev: Random number was never requested for this hero.

        uint256 randomNumber = _randomResultsVRF[heroRequestId];
        require(randomNumber != 0); // dev: Random number has not arrived yet.

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
        (_heroes[heroId].weather, newRandomNumber) = _rollDice(5, newRandomNumber); // 1 ouf of 5

        (_heroes[heroId].hp, newRandomNumber) = _rollDice(21, newRandomNumber); // Roll 10-30
        _heroes[heroId].hp = _heroes[heroId].hp.add(9);
        (_heroes[heroId].mana, newRandomNumber) = _rollDice(21, newRandomNumber); // Roll 10-30
        _heroes[heroId].mana = _heroes[heroId].mana.add(9);
        (_heroes[heroId].stamina, newRandomNumber) = _rollDice(31, newRandomNumber); // Roll 10-40
        _heroes[heroId].stamina = _heroes[heroId].stamina.add(9);

        (_heroes[heroId].strength, newRandomNumber) = _rollDice(16, newRandomNumber); // Roll 3-18
        _heroes[heroId].strength = _heroes[heroId].strength.add(2);
        (_heroes[heroId].dexterity, newRandomNumber) = _rollDice(16, newRandomNumber); // Roll 3-18
        _heroes[heroId].dexterity = _heroes[heroId].dexterity.add(2);
        (_heroes[heroId].constitution, newRandomNumber) = _rollDice(16, newRandomNumber); // Roll 3-18
        _heroes[heroId].constitution = _heroes[heroId].constitution.add(2);
        (_heroes[heroId].intelligence, newRandomNumber) = _rollDice(16, newRandomNumber); // Roll 3-18
        _heroes[heroId].intelligence = _heroes[heroId].intelligence.add(2);
        (_heroes[heroId].wisdom, newRandomNumber) = _rollDice(16, newRandomNumber); // Roll 3-18
        _heroes[heroId].wisdom = _heroes[heroId].wisdom.add(2);
        (_heroes[heroId].charisma, newRandomNumber) = _rollDice(16, newRandomNumber); // Roll 3-18
        _heroes[heroId].charisma = _heroes[heroId].charisma.add(2);
    }

    /// @notice Simulates rolling dice
    /// @param maxNumber The max number of the dice (e.g. regular die is 6)
    /// @param randomNumber The random number
    /// @return The result of the dice roll and a new random number to use for another dice roll
    function _rollDice(uint256 maxNumber, uint256 randomNumber) internal pure returns (uint256, uint256) {
        return (randomNumber.mod(maxNumber) + 1, randomNumber.div(10));
    }

    /// @notice Get the hero owner for the given hero id
    /// @param heroId The hero id
    /// @return The owner address
    function getHeroOwner(uint256 heroId) public view override isValidHero(heroId) returns (address) {
        require(_heroOwners[heroId] != address(0)); // dev: Given hero id has not been minted.

        return _heroOwners[heroId];
    }

    /// @notice Disburses the rewards evenly among the heroes of the winning affinity
    /// @dev This will be called from a priviledged address
    /// @param winningAffinity The winning affinity token ticker
    function disburseRewards(string calldata winningAffinity) external override onlyAdmin {}

    /// @notice Burns all the elder spirits in game
    function burnElders() external override onlyAdmin {
        require(eldersInGame > 0); // dev: No elders have been minted.
        for (uint256 i = 1; i <= MAX_NUMBER_OF_ELDERS; ++i) {
            if (_elderSpirits[i].valid) {
                _burnElder(i);
            }
        }

        // Increment the round
        currentRound = currentRound.add(1);

        emit ElderSpiritsBurned();
    }

    /// @notice Burns the elder spirit
    /// @dev This will only be able to be called by the contract
    /// @param elderId The elder id
    function _burnElder(uint256 elderId) internal isValidElderSpiritId(elderId) {
        require(_elderSpirits[elderId].valid); // dev: Cannot burn elder that does not exist.

        // TODO: need to make sure _elderOwners[elderId] can never be address(0).
        //     Check recipient before every token send so that we never send to address(0).
        _burn(_elderOwners[elderId], elderId, 1);

        // Reset elder values for elder id
        eldersInGame = eldersInGame.sub(1);
        _elderOwners[elderId] = address(0);
        _elderSpirits[elderId].valid = false;
    }

    /// @notice Burns the hero for a refund
    /// @dev This will only be able to be called from the owner of the hero
    /// @param heroId The hero id to burn
    function burnHero(uint256 heroId) external override isValidHero(heroId) {
        require(_heroes[heroId].valid); // dev: Cannot burn hero that does not exist.
        require(_heroOwners[heroId] == _msgSender()); // dev: Cannot burn hero that is not yours.

        _burn(_heroOwners[heroId], heroId, 1);

        // Decrement the amount of spawns for the hero's elder
        uint256 elderId = _heroes[heroId].elderId;
        uint256 heroRound = _heroes[heroId].roundMinted;
        _roundElderSpawns[heroRound][elderId] = _roundElderSpawns[heroRound][elderId].sub(1);

        // Reset hero values for hero id
        _heroOwners[heroId] = address(0);
        _heroes[heroId].valid = false;

        emit HeroBurned(heroId);
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

    /// @dev Hook function called before every token transfer
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);

        for (uint256 i = 0; i < ids.length; i++) {
            // If token is an elder spirit, update owners so can send them royalties
            if (ids[i] > IN_GAME_CURRENCY_ID && ids[i] <= MAX_NUMBER_OF_ELDERS) {
                _elderOwners[ids[i]] = payable(to);
            }
            if (ids[i] > MAX_NUMBER_OF_ELDERS) {
                _heroOwners[ids[i]] = to;
            }
        }
    }

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

    /// @notice Refunds the sender if they sent too much
    /// @param cost The cost
    function _refundSender(uint256 cost) internal {
        if (msg.value.sub(cost) > 0) {
            (bool success, ) = msg.sender.call{ value: msg.value.sub(cost) }("");
            require(success); // dev: Refund failed.
        }
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
            uint256,
            uint256,
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
            uint256, // race id
            uint256, // class id
            uint256 // appearance
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
            uint256, // trait 1
            uint256, // trait 2
            uint256, // skill 1
            uint256 // skill 2
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
            uint256, // alignment
            uint256, // background
            uint256, // hometown
            uint256 // weather
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
            uint256, // level
            uint256, // hp
            uint256, // mana
            uint256 // stamina
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
            uint256, // strength
            uint256, // dexterity
            uint256, // constitution
            uint256, // intelligence
            uint256, // wisdom
            uint256 // charisma
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

    /// @notice Declares a winning affinity for a round
    /// @dev This can only be called by a game admin contract
    /// @param winningAffinity The affinity that won the game
    function declareRoundWinner(string calldata winningAffinity) external override onlyGameAdmin {
        winningAffinitiesByRound.push(winningAffinity);
    }

    /// @notice Starts a new price game
    /// @dev This can only be called by the admin of the contract
    function startNewPriceGame() external override onlyAdmin {
        address priceWarsFactoryAddress = _minigameFactoryRegistry.getFactory(PRICE_WARS_ID);
        PriceWarsFactory priceWarsFactory = PriceWarsFactory(priceWarsFactoryAddress);
        PriceWars priceWar = priceWarsFactory.createPriceWar(address(this));
        grantRole(ROLE_GAME_ADMIN, address(priceWar));
        priceWar.startGame();
    }
}
