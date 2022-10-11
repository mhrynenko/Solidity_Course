// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

import "./interfaces/ISimpleToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SimpleToken is ISimpleToken, ERC20, Ownable {
    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {}

    function mint(address to_, uint256 amount_) external onlyOwner{
        _mint(to_, amount_);
    }

    function burn(uint256 amount_) external {
        _burn(msg.sender, amount_);
    }
}
