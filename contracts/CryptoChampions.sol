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
    bytes32 public constant ROLE_OWNER = keccak256("ROLE_OWNER");

    // The admin role is used for administrator duties and reports to the owner
    bytes32 public constant ROLE_ADMIN = keccak256("ROLE_ADMIN");

    // The max amount of elders that can be minted
    uint256 public constant MAX_NUMBER_OF_ELDERS = 7;

    // The max number of Heros that can be minted
    // TODO: Determine an appropriate value
    uint256 public constant MAX_NUMBER_OF_HEROES = 100;

    // Reserved id for the in game currency
    uint256 internal constant IN_GAME_CURRENCY_ID = 0;

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

    // Initializes a new CryptoChampions contract
    // TODO: need to provide the proper uri
    constructor() public ERC1155("uri") {
        // Set up administrative roles
        _setRoleAdmin(ROLE_OWNER, ROLE_OWNER);
        _setRoleAdmin(ROLE_ADMIN, ROLE_OWNER);

        // Set up the deployer as the owner and give admin rights
        _setupRole(ROLE_OWNER, msg.sender);
        grantRole(ROLE_ADMIN, msg.sender);
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

    /// @notice Mints an elder spirit
    /// @dev For now only race, class, and token (affinity) are needed. This will change. The race and class ids will
    /// probably be public constants defined in the crypto champions contract, this is subject to change.
    /// @param raceId The race id
    /// @param classId The class id
    /// @param affinity The affinity (token ticker)
    /// @return The elder spirit id
    function mintElderSpirit(
        uint256 raceId,
        uint256 classId,
        string calldata affinity
    ) external payable override returns (uint256) {
        require(eldersInGame < MAX_NUMBER_OF_ELDERS); // dev: Max number of elders already minted.

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
        _mint(msg.sender, elderId, 1, ""); // TODO: give the URI

        // Assign the elder id with the owner and its spirit
        _elderOwners[elderId] = msg.sender;
        _elderSpirits[elderId] = elder;

        // Increment elders minted
        eldersInGame = eldersInGame.add(1);

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

        // Generate the hero id
        uint256 heroId = heroesMinted.add(1) + MAX_NUMBER_OF_ELDERS;
        assert(_heroOwners[heroId] == address(0)); // dev: Hero with id already has an owner.
        assert(_heroes[heroId].valid == false); // dev: Hero with id has already been generated.

        // Create the hero
        Hero memory hero;
        hero.valid = true;
        hero.elder = _elderSpirits[elderId];

        // Mint the NFT
        _mint(msg.sender, heroId, 1, ""); // TODO: give the URI

        // Assign the hero id with the owner and with the hero
        _heroOwners[heroId] = msg.sender;
        _heroes[heroId] = hero;

        // Increment the heroes minted
        heroesMinted = heroesMinted.add(1);

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
    }

    /// @notice Burns the hero for a refund
    /// @dev This will only be able to be called from the owner of the hero
    /// @param heroId The hero id to burn
    function burnHero(uint256 heroId) external override {
        require(heroId > MAX_NUMBER_OF_ELDERS && heroId <= MAX_NUMBER_OF_ELDERS + MAX_NUMBER_OF_HEROES); // dev: Cannot burn with invalid hero id.
        require(_heroes[heroId].valid); // dev: Cannot burn hero that does not exist.
        require(_heroOwners[heroId] == _msgSender()); // dev: Cannot burn hero that is not yours.

        // TODO: need to make sure _heroOwners[heroId] can never be address(0).
        //     Check recipient before every token send so that we never send to address(0).
        _burn(_heroOwners[heroId], heroId, 1);

        // Reset hero values for hero id
        _heroOwners[heroId] = address(0);
        _heroes[heroId].valid = false;
        _heroes[heroId].elder.valid = false;
    }
}
