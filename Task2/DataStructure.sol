// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.12;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IDataStructurePractice {
    struct User {
        string name;
        uint256 balance;
        bool isActive;
    }

    function setNewUser(address _userAdr, User calldata _newUser) external;
    function getUser(address _user) external view returns(User memory);
    function getMyInfo() external view returns(User memory);
}


contract DataStructure is IDataStructurePractice, Ownable {
    mapping (address => User) public Users;

    function setNewUser(address _userAdr, User calldata _newUser) external onlyOwner {
        Users[_userAdr] = _newUser;
    }    

    function getUser(address _user) external view returns(User memory) {
        return Users[_user];
    }

    function getMyInfo() external view returns(User memory) {
        return Users[msg.sender];
    }

}

