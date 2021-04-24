// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "./ChampzPlatform.sol";
import "./chainlink/VRFConsumerBase.sol";
import "./openZeppelin/ERC721.sol";

contract Champz is ERC721, VRFConsumerBase {
    mapping(bytes32 => address) internal _requestIdToContract;
    mapping(bytes32 => uint256) internal _requestIdToChampzId;
    mapping(uint256 => uint256) internal _idToRandomNumber;
    bytes32 internal _requestId;
    bytes32 internal _keyHash;
    uint256 internal _vrfFee;
    uint256 public champzMinted;

    constructor(
        address vrfCoordinator,
        address linkToken,
        bytes32 keyhash,
        uint256 vrfFee
    ) public ERC721("CryptoChampz", "CHMPZ") VRFConsumerBase(vrfCoordinator, linkToken) {
        _keyHash = keyhash;
        _vrfFee = vrfFee;
    }

    modifier onlyContract {
        uint256 size;
        address sender = _msgSender();
        assembly {
            size := extcodesize(sender)
        }
        require(size > 0); // dev: Caller is not a contract address.
        _;
    }

    function mintChampz(address champzOwner) external onlyContract returns (uint256) {
        // Get id for new champz
        uint256 champzId = champzMinted;

        // Mint the champz
        _safeMint(champzOwner, champzId);

        // Set up VRF with the callback function and request random number
        bytes32 requestId = _getRandomNumber(champzId);
        _requestIdToChampzId[requestId] = champzId;
        _requestIdToContract[requestId] = _msgSender();
        _requestId = requestId;

        champzMinted = champzMinted.add(1);
        return champzId;
    }

    function _getRandomNumber(uint256 seed) internal returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= _vrfFee); // dev: Not enough LINK.
        return requestRandomness(_keyHash, _vrfFee, seed);
    }

    /// @notice Callback function used by the VRF coordinator
    /// @param requestId The request id
    /// @param randomness The randomness
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        uint256 champzId = _requestIdToChampzId[requestId];
        _idToRandomNumber[champzId] = randomness;

        // Call the callback function
        ChampzPlatform cp;
        address callbackOwner = _requestIdToContract[requestId];
        bytes memory callback = abi.encodeWithSelector(cp.fulfillChampzMintRaw.selector, champzId);
        callbackOwner.functionCall(callback);
    }

    function getChampzRandomNumber(uint256 champzId) external view returns (uint256) {
        return _idToRandomNumber[champzId];
    }
}
