// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.12;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IMemoryTypesPractice {
    function setA(uint256 _a) external;
    function setB(uint256 _b) external;
    function setC(uint256 _c) external;
    function calc1() external view returns(uint256);
    function calc2() external view returns(uint256);
    function claimRewards(address _user) external view;
    function addNewMan(
        uint256 _edge, 
        uint8 _dickSize, 
        bytes32 _idOfSecretBluetoothVacinationChip, 
        uint32 _iq
    ) external;
    function getMiddleDickSize() external view returns(uint256);
    function numberOfOldMenWithHighIq() external view returns(uint256);
}

contract MemoryTypesPracticeInput is IMemoryTypesPractice, Ownable {
    
    // Owner part. Cannot be modified.
    IUserInfo public userInfo;
    uint256 public a;
    uint256 public b;
    uint256 public c;

    uint256 public constant MIN_BALANCE = 12000;

    mapping(address => bool) public rewardsClaimed;

    constructor(address _validator, address _userInfo) {
        transferOwnership(_validator);
        userInfo = IUserInfo(_userInfo);

        addNewMan(1, 1, bytes32('0x11'), 1);
    }

    function setA(uint256 _a) external onlyOwner {
        a = _a;
    }

    function setB(uint256 _b) external onlyOwner {
        b = _b;
    }

    function setC(uint256 _c) external onlyOwner {
        c = _c;
    }
    // End of the owner part

    // Here starts part for modification. Remember that function signatures cannot be modified. 

    // to optimize 1
    // Now consumes 27835 // 27835 - 27830 = 5 || 28306 - 28193 = 113
    // Should consume not more than 27830 as execution cost for non zero values
    function calc1() external view returns(uint256) {
        return b + c * a;
    }

    // to optimize 2
    // Now consumes 31253 // 31253 - 30000 = 1253 || 34369 - 32597 = 1778
    // Should consume not more than 30000 as execution cost for non zero values
    function calc2() external view returns(uint256) {
        uint _a = a;
        uint _b = b;
        uint _c = c;
        
        return ((_b + _c) * (_b + _a) + (_c + _a) * _c + _c/_a + _c/_b + 2 * _a - 1 + _a * _b * _c + _a + _b * _a^2)/
            (_a + _b) * _c  + 2 * _a;
    }  

    // to optimize 3
    // Now consumes 55446 // 55446 - 54500 = 946 || 58218 - 55614 = 2604
    // Should consume not more than 54500 as execution cost
    function claimRewards(address _user) external view {
        IUserInfo.User memory usr = userInfo.getUserInfo(_user);
        bool claimed = rewardsClaimed[_user];

        require(usr.unlockTime <= block.timestamp, 
            "MemoryTypesPracticeInput: Unlock time has not yet come");

        require(!claimed, 
            "MemoryTypesPracticeInput: Rewards are already claimed");
        
        require(usr.balance >= MIN_BALANCE, 
            "MemoryTypesPracticeInput: To less balance");
        
        claimed = true;
    }

    // to optimize 4
    struct Man {
        uint256 edge;
        uint8 dickSize;
        uint32 iq;
        bytes32 idOfSecretBluetoothVacinationChip;
    }

    mapping(uint => Man) men;
    uint totalEntries;


    // Now consumes 115724 //115724 - 94000 = 21724 ||  116502 - 94736 = 21766
    // Should consume not more than 94000 as execution cost
    function addNewMan(
        uint256 _edge, 
        uint8 _dickSize, 
        bytes32 _idOfSecretBluetoothVacinationChip,
        uint32 _iq
    ) public {
        men[totalEntries] = Man(_edge, _dickSize, _iq, _idOfSecretBluetoothVacinationChip);
        unchecked {
            ++totalEntries;
	    }
    }

    // to optimize 5
    // Now consumes 36689 // 36689 - 36100 = 589 || 43742 - 41196 = 2546
    // Should consume not more than 36100 as execution cost for 6 elements array
    function getMiddleDickSize() external view returns(uint256) {
        uint256 _sum;
        uint length = totalEntries;

        for (uint256 i = 0; i < length;) {
            _sum += men[i].dickSize;
            unchecked {
                ++i;
	        }
        }

        return _sum/length;
    }

    // to optimize 6
    // Now consumes 68675 // 68675 - 40000 = 28675 || 88765 - 71859 = 16906
    // Should consume not more than 40000 as execution cost for 6 elements array
    function numberOfOldMenWithHighIq() external view returns(uint256) {
        uint256 _count;
        uint length = totalEntries;

        for (uint256 i = 0; i < length;) {
            Man memory man = men[i];
            if (man.edge > 50) {
                if (man.iq > 120) {
                    unchecked {
                        ++_count;
                    }
                }
            }
            unchecked {
                ++i;
	        }
        }

        return _count;
    }
}

// Cannot be modified
interface IUserInfo {
    struct User {
        uint256 balance;
        uint256 unlockTime;
    }

    function addUser(address _user, uint256 _balance, uint256 _unlockTime) external;
    function getUserInfo(address _user) external view returns(User memory);
}

// Cannot be modified.
contract UserInfo is IUserInfo, Ownable {
    mapping(address => User) users;

    constructor(address _validator) {
        transferOwnership(_validator);
    }

    function addUser(address _user, uint256 _balance, uint256 _unlockTime) external onlyOwner {
        users[_user] = User(_balance, _unlockTime);
    }

    function getUserInfo(address _user) external view returns(User memory) {
        return users[_user];
    }
}

