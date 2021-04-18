// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "OpenZeppelin/openzeppelin-contracts@3.4.0/contracts/token/ERC20/ERC20.sol";
import "OpenZeppelin/openzeppelin-contracts@3.4.0/contracts/access/Ownable.sol";

contract ChampzToken is ERC20, Ownable {
    event ChampzMinted(address to, uint256 amount);

    constructor() public ERC20("CryptoChampz", "CHMPZ") {}

    function mintTokens(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
        emit ChampzMinted(to, amount);
    }
}
