// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

import "./IMrGreedyToken.sol";
import "./SimpleToken.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MrGreedyToken is IMrGreedyToken, ERC20, SimpleToken  {
    address payable public treasureAddress;

    constructor(address payable treasureAddress_) {//ERC20("MrGreedyToken", "MRG") {
        treasureAddress = treasureAddress_;
    }

    function decimals() public view virtual override returns (uint8) {
        return 6;
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override {
        super._beforeTokenTransfer(from, to, amount); 

        uint tenTokens = 10 * 10 ** decimals();

        if (amount <= tenTokens) {
            (bool sent, ) = treasureAddress.call{value: amount}("");
            require(sent, "Failed to fee all token");
            amount = 0;
            return;
        }
        
        (bool sent, ) = treasureAddress.call{value: amount - tenTokens}("");
        require(sent, "Failed to fee all token");
        amount -= tenTokens;
    }

    function treasury() external view returns (address) {
        return treasureAddress;
    }

    function getResultingTransferAmount(uint256 amount_) external pure returns (uint256) {
        if (amount_ <= 10) {
            return 0;
        }
        
        return amount_ - 10;
    }
}
