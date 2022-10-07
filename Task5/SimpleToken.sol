// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

import "./ISimpleToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SimpleToken is ISimpleToken, ERC20, Ownable {
    constructor() ERC20("SimpleToken", "ST") { }

    function mint(address to_, uint256 amount_) external onlyOwner{
        _mint(to_, amount_ * 10 ** decimals());
    }

    function burn(uint256 amount_) external {
        _burn(msg.sender, amount_ * 10 ** decimals());
    }
}
