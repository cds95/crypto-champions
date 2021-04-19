// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "OpenZeppelin/openzeppelin-contracts@3.4.0/contracts/token/ERC20/ERC20.sol";
import "OpenZeppelin/openzeppelin-contracts@3.4.0/contracts/access/Ownable.sol";

contract ChampzToken is ERC20, Ownable {
    /// @notice Triggered when CHMPZ tokens are minted
    /// @param to The address the tokens are minted to
    /// @param amount The amount of tokens that were minted
    event ChampzMinted(address to, uint256 amount);

    /// @notice Initializes a new ChampzToken ERC20 contract
    constructor() public ERC20("CryptoChampz", "CHMPZ") {}

    /// @notice Mints new tokens to an address.  This function may only be called by the owner of the contract
    /// @param to The address the tokens will be minted to
    /// @param amount The amount of tokens that will be minted
    function mintTokens(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
        emit ChampzMinted(to, amount);
    }
}
