const { assert } = require("chai");
const { artifacts } = require("hardhat")
const truffleAssert = require("truffle-assertions");

const MrGreedyToken = artifacts.require("MrGreedyToken")

describe("MrGreedyToken", () => {
    let firstAcc;
    let treasureAddr;

    before('setup', async () => {
        firstAcc = (await web3.eth.getAccounts())[0]
        treasureAddr = (await web3.eth.getAccounts())[9]
    })

    describe('decimals()', () => {
        it('must return 6', async () => {
            const mrGreedyToken = await MrGreedyToken.new(treasureAddr)

            assert.equal(await mrGreedyToken.decimals(), '6')
        })
    })

    describe('treasury()', () => { 
        it('must return right treasure address', async () => {
            const mrGreedyToken = await MrGreedyToken.new(treasureAddr)

            assert.equal(await mrGreedyToken.treasury(), treasureAddr)
        })
    })

    describe('_transfer', () => { 
        it('should work transfer to user address', async () => {
            const mrGreedyToken = await MrGreedyToken.new(treasureAddr)
            const leftAcc = (await web3.eth.getAccounts())[5]
            const token = Math.pow(10, await mrGreedyToken.decimals())

            await mrGreedyToken.mint(firstAcc, 15 * token)
            await mrGreedyToken.transfer(leftAcc, 12 * token)

            assert.equal(await mrGreedyToken.balanceOf(leftAcc), (2 * token).toString())
        })

        it('should work transfer to contract address', async () => {
            const mrGreedyToken = await MrGreedyToken.new(treasureAddr)
            const contract = await artifacts.require("SimpleToken").new('Simple Token', 'ST')
            const token = Math.pow(10, await mrGreedyToken.decimals())

            await mrGreedyToken.mint(firstAcc, 15 * token)
            await mrGreedyToken.transfer(contract.address, 12 * token)

            assert.equal(await mrGreedyToken.balanceOf(contract.address), (2 * token).toString())
        })

        it("should work transfer with 0 amount", async () => {
            const mrGreedyToken = await MrGreedyToken.new(treasureAddr)
            const leftAcc = (await web3.eth.getAccounts())[5]
            const token = Math.pow(10, await mrGreedyToken.decimals())

            await mrGreedyToken.mint(firstAcc, 15 * token)
            await mrGreedyToken.transfer(leftAcc, 0 * token)

            assert.equal(await mrGreedyToken.balanceOf(leftAcc), '0')
        })

        it("should work transfer with amount between 0 and balance", async () => {
            const mrGreedyToken = await MrGreedyToken.new(treasureAddr)
            const leftAcc = (await web3.eth.getAccounts())[5]
            const token = Math.pow(10, await mrGreedyToken.decimals())

            await mrGreedyToken.mint(firstAcc, 15 * token)
            await mrGreedyToken.transfer(leftAcc, 7 * token)

            assert.equal(await mrGreedyToken.balanceOf(leftAcc), '0')
        })  
        
        it('should revert transfer with lower balance', async () => {
            const mrGreedyToken = await MrGreedyToken.new(treasureAddr)
            const leftAcc = (await web3.eth.getAccounts())[5]
            const token = Math.pow(10, await mrGreedyToken.decimals())

            await mrGreedyToken.mint(firstAcc, 10 * token)

            await truffleAssert.reverts(mrGreedyToken.transfer(leftAcc, 12 * token), `ERC20: transfer amount exceeds balance`)
        })

        it("should take all amount as fee", async () => {
            const mrGreedyToken = await MrGreedyToken.new(treasureAddr)
            const leftAcc = (await web3.eth.getAccounts())[5]
            const token = Math.pow(10, await mrGreedyToken.decimals())

            await mrGreedyToken.mint(firstAcc, 15 * token)
            await mrGreedyToken.transfer(leftAcc, 7 * token)

            assert.equal(await mrGreedyToken.balanceOf(leftAcc), '0')
        })  

        it("should take 10 tokens as fee", async () => {
            const mrGreedyToken = await MrGreedyToken.new(treasureAddr)
            const leftAcc = (await web3.eth.getAccounts())[5]
            const token = Math.pow(10, await mrGreedyToken.decimals())

            await mrGreedyToken.mint(firstAcc, 15 * token)
            await mrGreedyToken.transfer(leftAcc, 11 * token)

            assert.equal(await mrGreedyToken.balanceOf(leftAcc), (1 * token).toString())
        })  
    })
})