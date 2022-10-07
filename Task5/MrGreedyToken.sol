// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

import "./IMrGreedyToken.sol";
import "./SimpleToken.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MrGreedyToken is IMrGreedyToken, ERC20, SimpleToken  {
    // constructor() ERC20("MrGreedyToken", "MRG") { }

    function decimals() public view virtual override returns (uint8) {
        return 16;
    }

    function treasury() external view returns (address) {

    }

    function getResultingTransferAmount(uint256 amount_) external view returns (uint256) {

    }
}
