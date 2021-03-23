// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "../interfaces/ICryptoChampions.sol";

import "OpenZeppelin/openzeppelin-contracts@3.4.0/contracts/access/AccessControl.sol";
import "OpenZeppelin/openzeppelin-contracts@3.4.0/contracts/math/SafeMath.sol";
import "OpenZeppelin/openzeppelin-contracts@3.4.0/contracts/token/ERC1155/ERC1155.sol";

/// @title Crypto Champions Interface
/// @author Oozyx
/// @notice This is the crypto champions class
contract CryptoChampions is ICryptoChampions, AccessControl, ERC1155 {
    using SafeMath for uint256;

    // The owner role is used to globally govern the contract
    bytes32 internal constant ROLE_OWNER = keccak256("ROLE_OWNER");

    // The admin role is used for administrator duties and reports to the owner
    bytes32 internal constant ROLE_ADMIN = keccak256("ROLE_ADMIN");

    // Reserved id for the in game currency
    uint256 internal constant IN_GAME_CURRENCY_ID = 0;

    // The max amount of elders that can be minted
    uint256 public constant MAX_NUMBER_OF_ELDERS = 7;

    // The max number of Heros that can be minted
    // TODO: Determine an appropriate value
    uint256 public constant MAX_NUMBER_OF_HEROES = 100;

    // The amount of elders minted
    // This amount cannot be greater than MAX_NUMBER_OF_ELDERS
    uint256 public eldersInGame = 0;

    // The mapping of elder id to elder owner, ids can only be in the range of [1, MAX_NUMBER OF ELDERS]
    mapping(uint256 => address) internal _elderOwners;

    // The mapping of elder id to the elder spirit
    mapping(uint256 => ElderSpirit) internal _elderSpirits;

    // The amount of heros minted
    // This amount cannot be greater than MAX_NUMBER_OF_HEROS
    uint256 public heroesMinted = 0;

    // The mapping of hero id to owner, ids can only be in the range of
    // [1 + MAX_NUMBER_OF_ELDERS, MAX_NUMBER_OF_ELDERS + MAX_NUMBER_OF_HEROS]
    mapping(uint256 => address) internal _heroOwners;

    // The mapping of hero id to the hero
    mapping(uint256 => Hero) internal _heroes;

    // The mapping of the round played to the elder spawns mapping
    mapping(uint256 => mapping(uint256 => uint256)) internal _roundElderSpawns;

    // The mint price for elders and heroes
    uint256 public elderMintPrice;

    // The current round index
    uint256 public currentRound;

    // For bonding curve
    uint256 internal constant K = 1 ether;
    uint256 internal constant B = 50;
    uint256 internal constant C = 26;
    uint256 internal constant D = 8;
    uint256 internal constant SIG_DIGITS = 3;

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
    constructor() public ERC1155("uri") {
        // Set up administrative roles
        _setRoleAdmin(ROLE_OWNER, ROLE_OWNER);
        _setRoleAdmin(ROLE_ADMIN, ROLE_OWNER);

        // Set up the deployer as the owner and give admin rights
        _setupRole(ROLE_OWNER, msg.sender);
        grantRole(ROLE_ADMIN, msg.sender);

        // Set initial elder mint price
        elderMintPrice = 0.271 ether;

        // Set the initial round to 0
        currentRound = 0;
    }

    // Restrict to only admins
    modifier onlyAdmin {
        _hasRole(ROLE_ADMIN);
        _;
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
    function createAffinity(string calldata tokenTicker) external override onlyAdmin {}

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
        require(eldersInGame < MAX_NUMBER_OF_ELDERS); // dev: Max number of elders already minted.
        require(msg.value >= elderMintPrice); // dev: Insufficient payment.

        // Generate the elderId and make sure it doesn't already exists
        uint256 elderId = eldersInGame.add(1);
        assert(_elderOwners[elderId] == address(0)); // dev: Elder with id already has owner.
        assert(_elderSpirits[elderId].valid == false); // dev: Elder spirit with id has already been generated.

        // Create the elder spirit
        ElderSpirit memory elder;
        elder.valid = true;
        elder.raceId = raceId;
        elder.classId = classId;
        elder.affinity = affinity;

        // Mint the NFT
        _mint(_msgSender(), elderId, 1, ""); // TODO: give the URI

        // Assign the elder id with the owner and its spirit
        _elderOwners[elderId] = _msgSender();
        _elderSpirits[elderId] = elder;

        // Increment elders minted
        eldersInGame = eldersInGame.add(1);
        // We consider the elder spirit as a spawn of itself
        _roundElderSpawns[currentRound][elderId] = _roundElderSpawns[currentRound][elderId].add(1);

        // Refund if user sent too much
        _refundSender(elderMintPrice);

        emit ElderSpiritMinted(elderId, _msgSender());

        return elderId;
    }

    /// @notice Gets the elder owner for the given elder id
    /// @param elderId The elder id
    /// @return The owner of the elder
    function getElderOwner(uint256 elderId) public view override returns (address) {
        require(elderId > IN_GAME_CURRENCY_ID && elderId <= MAX_NUMBER_OF_ELDERS); // dev: Given id is not valid.
        require(_elderOwners[elderId] != address(0)); // dev: Given elder id has not been minted.

        return _elderOwners[elderId];
    }

    /// @notice Mints a hero based on an elder spirit
    /// @param elderId The id of the elder spirit this hero is based on
    /// @return The hero id
    function mintHero(uint256 elderId) external payable override returns (uint256) {
        require(elderId != 0 && elderId <= MAX_NUMBER_OF_ELDERS); // dev: Elder id not valid.
        require(heroesMinted < MAX_NUMBER_OF_HEROES); // dev: Max number of heroes already minted.
        require(_elderSpirits[elderId].valid); // dev: Elder with id doesn't exists or not valid.

        uint256 mintPrice = getHeroMintPrice(currentRound, elderId);
        require(msg.value >= mintPrice); // dev: Insufficient payment.

        // Generate the hero id
        uint256 heroId = heroesMinted.add(1) + MAX_NUMBER_OF_ELDERS;
        assert(_heroOwners[heroId] == address(0)); // dev: Hero with id already has an owner.
        assert(_heroes[heroId].valid == false); // dev: Hero with id has already been generated.

        // Create the hero
        Hero memory hero;
        hero.valid = true;
        hero.roundMinted = currentRound;
        hero.elderId = elderId;
        hero.raceId = _elderSpirits[elderId].raceId;
        hero.classId = _elderSpirits[elderId].classId;
        hero.affinity = _elderSpirits[elderId].affinity;

        // Mint the NFT
        _mint(_msgSender(), heroId, 1, ""); // TODO: give the URI

        // Assign the hero id with the owner and with the hero
        _heroOwners[heroId] = _msgSender();
        _heroes[heroId] = hero;

        // Increment the heroes minted and the elder spawns
        heroesMinted = heroesMinted.add(1);
        _roundElderSpawns[currentRound][elderId] = _roundElderSpawns[currentRound][elderId].add(1);

        // Refund if user sent too much
        _refundSender(mintPrice);

        emit HeroMinted(heroId, _msgSender());

        return heroId;
    }

    /// @notice Get the hero owner for the given hero id
    /// @param heroId The hero id
    /// @return The owner address
    function getHeroOwner(uint256 heroId) public view override returns (address) {
        require(heroId > MAX_NUMBER_OF_ELDERS && heroId <= MAX_NUMBER_OF_ELDERS + MAX_NUMBER_OF_HEROES); // dev: Given hero id is not valid.
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
    function _burnElder(uint256 elderId) internal {
        require(elderId > 0 && elderId <= MAX_NUMBER_OF_ELDERS); // dev: Cannot burn with invalid elder id.
        require(_elderSpirits[elderId].valid); // dev: Cannot burn elder that does not exist.

        // TODO: need to make sure _elderOwners[elderId] can never be address(0).
        //     Check recipient before every token send so that we never send to address(0).
        _burn(_elderOwners[elderId], elderId, 1);

        // Reset elder values for elder id
        eldersInGame = eldersInGame.sub(1);
        _elderOwners[elderId] = address(0);
        _elderSpirits[elderId].valid = false;
        _elderSpirits[elderId].raceId = 0;
        _elderSpirits[elderId].classId = 0;
        _elderSpirits[elderId].affinity = "";
    }

    /// @notice Burns the hero for a refund
    /// @dev This will only be able to be called from the owner of the hero
    /// @param heroId The hero id to burn
    function burnHero(uint256 heroId) external override {
        require(heroId > MAX_NUMBER_OF_ELDERS && heroId <= MAX_NUMBER_OF_ELDERS + MAX_NUMBER_OF_HEROES); // dev: Cannot burn with invalid hero id.
        require(_heroes[heroId].valid); // dev: Cannot burn hero that does not exist.
        require(_heroOwners[heroId] == _msgSender()); // dev: Cannot burn hero that is not yours.

        // Get the refund amount before burning
        uint256 refundAmount = getHeroRefundAmount(heroId);

        _burn(_heroOwners[heroId], heroId, 1);

        // Decrement the amount of spawns for the hero's elder
        uint256 elderId = _heroes[heroId].elderId;
        uint256 heroRound = _heroes[heroId].roundMinted;
        _roundElderSpawns[heroRound][elderId] = _roundElderSpawns[heroRound][elderId].sub(1);

        // Reset hero values for hero id
        _heroOwners[heroId] = address(0);
        _heroes[heroId].valid = false;
        _heroes[heroId].roundMinted = 0;
        _heroes[heroId].elderId = 0;
        _heroes[heroId].raceId = 0;
        _heroes[heroId].classId = 0;
        _heroes[heroId].affinity = "";

        // Refund hero
        (bool success, ) = msg.sender.call{ value: refundAmount }("");
        require(success); // dev: Burn payment failed

        emit HeroBurned(heroId);
    }

    /// @notice Gets the minting price of a hero based on specified elder spirit
    /// @param round The round of the hero to be minted
    /// @param elderId The elder id for which the hero will be based on
    /// @return The hero mint price
    function getHeroMintPrice(uint256 round, uint256 elderId) public view override returns (uint256) {
        require(round <= currentRound); // dev: Cannot get price round has not started.
        require(elderId > IN_GAME_CURRENCY_ID && elderId <= MAX_NUMBER_OF_ELDERS); // dev: Elder id is not valid.
        require(_roundElderSpawns[round][elderId] > 0); // dev: The elder has not been minted.

        uint256 heroAmount = _roundElderSpawns[round][elderId].add(1);
        require(heroAmount <= MAX_NUMBER_OF_HEROES); // dev: Maximum amount of heroes exceeded.

        return _bondingCurve(heroAmount);
    }

    /// @notice Get the hero refund amount
    /// @param heroId The hero id to be refunded
    /// @return The refund amount
    function getHeroRefundAmount(uint256 heroId) public view override returns (uint256) {
        Hero memory hero = _heroes[heroId];
        require(hero.valid); // dev: Hero is not valid.

        uint256 newSupply = _roundElderSpawns[hero.roundMinted][hero.elderId].sub(1);
        uint256 mintPrice = _bondingCurve(newSupply);

        return mintPrice.mul(90).div(100); // 90 % of mint price
    }

    /// @notice The bounding curve function that calculates price for the new supply
    /// @dev K = 1
    ///      B = 50
    ///      C = 26
    ///      D = 8
    ///      SIG_DIGITS = 3
    /// @param newSupply The new supply after a burn or mint
    function _bondingCurve(uint256 newSupply) internal pure returns (uint256) {
        uint256 price;
        uint256 decimals = 10**SIG_DIGITS;

        if (newSupply < B) {
            price = (10**(B.sub(newSupply))).mul(decimals).div(11**(B.sub(newSupply)));
        } else if (newSupply == B) {
            price = decimals; // price = decimals * (A ^ 0)
        } else {
            price = (11**(newSupply.sub(B))).mul(decimals).div(10**(newSupply.sub(B)));
        }

        price = price.add(C.mul(newSupply));
        price = price.sub(D);
        price = price.mul(1 ether).div(decimals);

        return price;
    }

    /// @notice Gets the amount of heroes spawn from the elder with the specified id during the specified round
    /// @param round The round the elder was created
    /// @param elderId The elder id
    /// @return The amount of heroes spawned from the elder
    function getElderSpawnsAmount(uint256 round, uint256 elderId) public view override returns (uint256) {
        require(elderId > IN_GAME_CURRENCY_ID && elderId <= MAX_NUMBER_OF_ELDERS); // dev: Given id is not valid.
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
}
