// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

import "./IContractsHaterToken.sol";
import "./SimpleToken.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ContractsHaterToken is IContractsHaterToken, ERC20, SimpleToken  {
    // constructor() ERC20("ContractsHaterToken", "CHT") { }
    mapping (address => bool) whiteList;

    function addToWhitelist(address candidate_) external onlyOwner {
        whiteList[candidate_] = true;
    }

    function removeFromWhitelist(address candidate_) external onlyOwner {
        delete whiteList[candidate_];
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);

        if (msg.sender.code.length > 0) { // addr is contract
            require(whiteList[msg.sender], "You're not a chosen one");
        }
    }

}
