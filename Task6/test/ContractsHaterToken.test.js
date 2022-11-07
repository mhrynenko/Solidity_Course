const { assert } = require("chai");
const { artifacts } = require("hardhat")
const truffleAssert = require("truffle-assertions");
const { ZERO_ADDR } = require("../scripts/utils/constants");
const { accounts } = require("../scripts/utils/utils");

const ContractsHaterToken = artifacts.require("ContractsHaterToken")

describe("ContractsHaterToken", () => {
    let firstAcc;
    let contractsHaterToken;
    let zeroAddr;
    let leftAcc;

    beforeEach(async () => {
        contractsHaterToken = await ContractsHaterToken.new()
    })

    before("setup", async () => {
        firstAcc = await accounts(0)
        zeroAddr = ZERO_ADDR
        leftAcc = await accounts(5)
    })

    describe("addToWhitelist()", () => {
        it("should work with zero address", async () => {
            await contractsHaterToken.addToWhitelist(zeroAddr)

            assert.equal(await contractsHaterToken.whiteList(zeroAddr), true)
        })

        it("should work with user address", async () => {
            await contractsHaterToken.addToWhitelist(leftAcc)

            assert.equal(await contractsHaterToken.whiteList(leftAcc), true)
        })

        it("should work with contract address", async () => {
            const contract = await artifacts.require("SimpleToken").new('Simple Token', 'ST')

            await contractsHaterToken.addToWhitelist(contract.address)

            assert.equal(await contractsHaterToken.whiteList(contract.address), true)
        })

        it('should work only with owner', async () => {
            const notOwner = (await web3.eth.getAccounts())[2]

            await truffleAssert.reverts(contractsHaterToken.addToWhitelist(firstAcc, { from :  notOwner }), 'Ownable: caller is not the owner')
        })
    })

    describe("removeFromWhitelist()", () => {
        it("should work with zero address", async () => {
            await contractsHaterToken.addToWhitelist(zeroAddr)
            await contractsHaterToken.removeFromWhitelist(zeroAddr)

            assert.equal(await contractsHaterToken.whiteList(zeroAddr), false)
        })

        it("should work with user address", async () => {
            await contractsHaterToken.addToWhitelist(leftAcc)
            await contractsHaterToken.removeFromWhitelist(leftAcc)

            assert.equal(await contractsHaterToken.whiteList(leftAcc), false)
        })

        it("should work with contract address", async () => {
            const contract = await artifacts.require("SimpleToken").new('Simple Token', 'ST')

            await contractsHaterToken.addToWhitelist(contract.address)
            await contractsHaterToken.removeFromWhitelist(contract.address)

            assert.equal(await contractsHaterToken.whiteList(contract.address), false)
        })

        it("should work okay without previous adding address", async () => {
            const leftAcc = (await web3.eth.getAccounts())[5]

            await contractsHaterToken.removeFromWhitelist(leftAcc)

            assert.equal(await contractsHaterToken.whiteList(leftAcc), false)
        })

        it('should work only with owner', async () => {
            const notOwner = (await web3.eth.getAccounts())[2]

            await truffleAssert.reverts(contractsHaterToken.addToWhitelist(firstAcc, { from :  notOwner }), 'Ownable: caller is not the owner')
        })
    })

    describe('_beforeTokenTransfer()', () => { 
        it("should revert transfer with zero address", async () => {
            await truffleAssert.reverts(contractsHaterToken.transfer(zeroAddr, 10), 'ERC20: transfer to the zero address')
        })

        it("should revert transfer to contract address not in list", async () => {
            const contract = await artifacts.require("SimpleToken").new('Simple Token', 'ST')

            await contractsHaterToken.mint(firstAcc, 10)

            await truffleAssert.reverts(contractsHaterToken.transfer(contract.address, 5), "You're not a chosen one")
        })

        it("should work transfer to user address", async () => {
            await contractsHaterToken.mint(firstAcc, 10)
            await contractsHaterToken.transfer(leftAcc, 5)

            assert.equal(await contractsHaterToken.balanceOf(leftAcc), '5')
        })

        it("should work transfer to contract address in list", async () => {
            const contract = await artifacts.require("SimpleToken").new('Simple Token', 'ST')

            await contractsHaterToken.mint(firstAcc, 10)
            await contractsHaterToken.addToWhitelist(contract.address)
            await contractsHaterToken.transfer(contract.address, 5);

            assert.equal(await contractsHaterToken.balanceOf(contract.address), '5')
        })

        it("should revert transfer with lower balance", async () => {
            await contractsHaterToken.mint(firstAcc, 10)

            await truffleAssert.reverts(contractsHaterToken.transfer(leftAcc, 15), `ERC20: transfer amount exceeds balance`)
        })

        it("should work transfer with 0 amount", async () => {
            await contractsHaterToken.mint(firstAcc, 10)
            await contractsHaterToken.transfer(leftAcc, 0);

            assert.equal(await contractsHaterToken.balanceOf(leftAcc), '0')
        })

        it("should work transfer with amount between 0 and balance", async () => {
            await contractsHaterToken.mint(firstAcc, 10)
            await contractsHaterToken.transfer(leftAcc, 7);

            assert.equal(await contractsHaterToken.balanceOf(leftAcc), '7')
        })
    })
})