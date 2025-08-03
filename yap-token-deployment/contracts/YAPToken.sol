// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract YAPToken is ERC20, Ownable {
    constructor() ERC20("YAP Token", "YAP") {
        // Mint initial supply to deployer
        _mint(msg.sender, 1000000 * 10 ** decimals()); // 1 million YAP tokens
    }

    // Function to mint tokens (only owner can call)
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // Function to burn tokens
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
} 