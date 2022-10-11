// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

import "./interfaces/IMrGreedyToken.sol";
import "./SimpleToken.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

uint constant FEE_AMOUNT = 10;

contract MrGreedyToken is IMrGreedyToken, SimpleToken  {
    address payable public treasureAddress;

    constructor(address payable treasureAddress_) SimpleToken("MrGreedyToken", "MRG") {
        treasureAddress = treasureAddress_;
    }

    function decimals() public view virtual override returns (uint8) {
        return 6;
    }

    function _transfer(address from, address to, uint256 amount) internal virtual override {
        if (amount <= getFeeAmount()) {
            super._transfer(from, treasureAddress, amount);
            amount = 0;
        }
        else { 
            super._transfer(from, treasureAddress, getFeeAmount());
            amount -= getFeeAmount();
            super._transfer(from, to, amount);
        }
    }

    function treasury() external view returns (address) {
        return treasureAddress;
    }

    function getResultingTransferAmount(uint256 amount_) external view returns (uint256) {
        if (amount_ <= getFeeAmount()) {
            return 0;
        }
        return amount_ - getFeeAmount();
    }

    function getFeeAmount() internal view returns (uint256) {
        return FEE_AMOUNT * 10 ** decimals();
    }
}
