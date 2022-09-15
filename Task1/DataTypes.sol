// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.12;

interface IDataTypesPractice {
    function getInt256() external view returns(int256);
    function getUint256() external view returns(uint256);
    function getIint8() external view returns(int8);
    function getUint8() external view returns(uint8);
    function getBool() external view returns(bool);
    function getAddress() external view returns(address);
    function getBytes32() external view returns(bytes32);
    function getArrayUint5() external view returns(uint256[5] memory);
    function getArrayUint() external view returns(uint256[] memory);
    function getString() external view returns(string memory);

    function getBigUint() external pure returns(uint256);
}

contract DataTypes is IDataTypesPractice {
    int256 myInt256 = 123124123; 
    uint256 myUint256 = 124124;
    int8 myInt8 = 12;
    uint8 myUint8 = 13;
    bool myBool = true;
    address myAddress = address(23);
    bytes32 myBytes32 = "Hello bytes";
    uint[5] myStaticArray = [1, 2, 3,4,88];
    uint[] myDynamicArray = [31, 2, 3,4,88,4 ,34,3,2];
    string myString = "Hello World!";

    function getInt256() external view returns(int256) {
        return myInt256;
    }

    function getUint256() external view returns(uint256) {
        return myUint256;
    }

    function getIint8() external view returns(int8) {
        return myInt8;
    }

    function getUint8() external view returns(uint8) {
        return myUint8;
    }

    function getBool() external view returns(bool) {
        return myBool;
    }

    function getAddress() external view returns(address){
        return myAddress;
    }

    function getBytes32() external view returns(bytes32){
        return myBytes32;
    }

    function getArrayUint5() external view returns(uint256[5] memory) {
        return myStaticArray;
    }

    function getArrayUint() external view returns(uint256[] memory) {
        return myDynamicArray;
    }

    function getString() external view returns(string memory) {
        return myString;
    }

    function getBigUint() external pure returns(uint256) {
        uint256 v1 = 1;
        uint256 v2 = 2;

        return v2 ** (v2 << (v2 + v2))/v1;
    }
}
