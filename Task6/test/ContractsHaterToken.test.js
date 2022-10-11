const { assert } = require("chai");
const { artifacts } = require("hardhat")
const truffleAssert = require("truffle-assertions");

const ContractsHaterToken = artifacts.require("ContractsHaterToken")

describe("ContractsHaterToken", () => {
    let firstAcc;

    before("setup", async () => {
        firstAcc = (await web3.eth.getAccounts())[0]
    })

    describe("addToWhitelist()", () => {
        it("should work with zero address", async () => {
            const contractsHaterToken = await ContractsHaterToken.new()
            const zeroAddr = '0x0000000000000000000000000000000000000000'

            await contractsHaterToken.addToWhitelist(zeroAddr)

            assert.equal(await contractsHaterToken.whiteList(zeroAddr), true)
        })

        it("should work with user address", async () => {
            const contractsHaterToken = await ContractsHaterToken.new()
            const leftAcc = (await web3.eth.getAccounts())[5]

            await contractsHaterToken.addToWhitelist(leftAcc)

            assert.equal(await contractsHaterToken.whiteList(leftAcc), true)
        })

        it("should work with contract address", async () => {
            const contractsHaterToken = await ContractsHaterToken.new()
            const contract = await artifacts.require("SimpleToken").new('Simple Token', 'ST')

            await contractsHaterToken.addToWhitelist(contract.address)

            assert.equal(await contractsHaterToken.whiteList(contract.address), true)
        })

        it('should work only with owner', async () => {
            const contractsHaterToken = await ContractsHaterToken.new()
            
            const notOwner = (await web3.eth.getAccounts())[2]

            await truffleAssert.reverts(contractsHaterToken.addToWhitelist(firstAcc, { from :  notOwner }), 'Ownable: caller is not the owner')
        })
    })

    describe("removeFromWhitelist()", () => {
        it("should work with zero address", async () => {
            const contractsHaterToken = await ContractsHaterToken.new()
            const zeroAddr = '0x0000000000000000000000000000000000000000'

            await contractsHaterToken.addToWhitelist(zeroAddr)
            await contractsHaterToken.removeFromWhitelist(zeroAddr)

            assert.equal(await contractsHaterToken.whiteList(zeroAddr), false)
        })

        it("should work with user address", async () => {
            const contractsHaterToken = await ContractsHaterToken.new()
            const leftAcc = (await web3.eth.getAccounts())[5]

            await contractsHaterToken.addToWhitelist(leftAcc)
            await contractsHaterToken.removeFromWhitelist(leftAcc)

            assert.equal(await contractsHaterToken.whiteList(leftAcc), false)
        })

        it("should work with contract address", async () => {
            const contractsHaterToken = await ContractsHaterToken.new()
            const contract = await artifacts.require("SimpleToken").new('Simple Token', 'ST')

            await contractsHaterToken.addToWhitelist(contract.address)
            await contractsHaterToken.removeFromWhitelist(contract.address)

            assert.equal(await contractsHaterToken.whiteList(contract.address), false)
        })

        it("should work okay without previous adding address", async () => {
            const contractsHaterToken = await ContractsHaterToken.new()
            const leftAcc = (await web3.eth.getAccounts())[5]

            await contractsHaterToken.removeFromWhitelist(leftAcc)

            assert.equal(await contractsHaterToken.whiteList(leftAcc), false)
        })

        it('should work only with owner', async () => {
            const contractsHaterToken = await ContractsHaterToken.new()
            
            const notOwner = (await web3.eth.getAccounts())[2]

            await truffleAssert.reverts(contractsHaterToken.addToWhitelist(firstAcc, { from :  notOwner }), 'Ownable: caller is not the owner')
        })
    })

    describe('_beforeTokenTransfer()', () => { 
        it("should revert transfer with zero address", async () => {
            const contractsHaterToken = await ContractsHaterToken.new()
            const zeroAddr = '0x0000000000000000000000000000000000000000'

            await truffleAssert.reverts(contractsHaterToken.transfer(zeroAddr, 10), 'ERC20: transfer to the zero address')
        })

        it("should revert transfer to contract address not in list", async () => {
            const contractsHaterToken = await ContractsHaterToken.new()
            const contract = await artifacts.require("SimpleToken").new('Simple Token', 'ST')

            await contractsHaterToken.mint(firstAcc, 10)

            await truffleAssert.reverts(contractsHaterToken.transfer(contract.address, 5), "You're not a chosen one")
        })

        it("should work transfer to user address", async () => {
            const contractsHaterToken = await ContractsHaterToken.new()
            const leftAcc = (await web3.eth.getAccounts())[5]

            await contractsHaterToken.mint(firstAcc, 10)
            await contractsHaterToken.transfer(leftAcc, 5)

            assert.equal(await contractsHaterToken.balanceOf(leftAcc), '5')
        })

        it("should work transfer to contract address in list", async () => {
            const contractsHaterToken = await ContractsHaterToken.new()
            const contract = await artifacts.require("SimpleToken").new('Simple Token', 'ST')

            await contractsHaterToken.mint(firstAcc, 10)
            await contractsHaterToken.addToWhitelist(contract.address)
            await contractsHaterToken.transfer(contract.address, 5);

            assert.equal(await contractsHaterToken.balanceOf(contract.address), '5')
        })

        it("should revert transfer with lower balance", async () => {
            const contractsHaterToken = await ContractsHaterToken.new()
            const leftAcc = (await web3.eth.getAccounts())[5]

            await contractsHaterToken.mint(firstAcc, 10)

            await truffleAssert.reverts(contractsHaterToken.transfer(leftAcc, 15), `ERC20: transfer amount exceeds balance`)
        })

        it("should work transfer with 0 amount", async () => {
            const contractsHaterToken = await ContractsHaterToken.new()
            const leftAcc = (await web3.eth.getAccounts())[5]

            await contractsHaterToken.mint(firstAcc, 10)
            await contractsHaterToken.transfer(leftAcc, 0);

            assert.equal(await contractsHaterToken.balanceOf(leftAcc), '0')
        })

        it("should work transfer with amount between 0 and balance", async () => {
            const contractsHaterToken = await ContractsHaterToken.new()
            const leftAcc = (await web3.eth.getAccounts())[5]

            await contractsHaterToken.mint(firstAcc, 10)
            await contractsHaterToken.transfer(leftAcc, 7);

            assert.equal(await contractsHaterToken.balanceOf(leftAcc), '7')
        })
    })
})