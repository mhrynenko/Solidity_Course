const { assert } = require("chai");
const { artifacts } = require("hardhat")
const truffleAssert = require("truffle-assertions");
const { accounts } = require("../scripts/utils/utils");

const MrGreedyToken = artifacts.require("MrGreedyToken")

describe("MrGreedyToken", () => {
    let firstAcc;
    let treasureAddr;
    let mrGreedyToken;
    let token;
    let leftAcc;

    beforeEach(async () => {
        mrGreedyToken = await MrGreedyToken.new(treasureAddr)
        token = Math.pow(10, await mrGreedyToken.decimals())
    })

    before('setup', async () => {
        firstAcc = await accounts(0)
        treasureAddr = await accounts(9)
        leftAcc = await accounts(5)
    })

    describe('decimals()', () => {
        it('must return 6', async () => {
            assert.equal(await mrGreedyToken.decimals(), '6')
        })
    })

    describe('treasury()', () => { 
        it('must return right treasure address', async () => {
            assert.equal(await mrGreedyToken.treasury(), treasureAddr)
        })
    })

    describe('getResultingTransferAmount()', () => {
        it('must return 0', async () => {
            assert.equal(await mrGreedyToken.getResultingTransferAmount(3*token), '0')
        })

        it('must return 0', async () => {
            assert.equal(await mrGreedyToken.getResultingTransferAmount(10*token), '0')
        })

        it('must return 4', async () => {
            assert.equal(await mrGreedyToken.getResultingTransferAmount(14*token), (4 * token).toString())
        })
    })
    
    describe('_transfer', () => { 
        it('should work transfer to user address', async () => {
            await mrGreedyToken.mint(firstAcc, 15 * token)
            await mrGreedyToken.transfer(leftAcc, 12 * token)

            assert.equal(await mrGreedyToken.balanceOf(leftAcc), (2 * token).toString())
        })

        it('should work transfer to contract address', async () => {
            const contract = await artifacts.require("SimpleToken").new('Simple Token', 'ST')

            await mrGreedyToken.mint(firstAcc, 15 * token)
            await mrGreedyToken.transfer(contract.address, 12 * token)

            assert.equal(await mrGreedyToken.balanceOf(contract.address), (2 * token).toString())
        })

        it("should work transfer with 0 amount", async () => {
            await mrGreedyToken.mint(firstAcc, 15 * token)
            await mrGreedyToken.transfer(leftAcc, 0 * token)

            assert.equal(await mrGreedyToken.balanceOf(leftAcc), '0')
        })

        it("should work transfer with amount between 0 and balance", async () => {
            await mrGreedyToken.mint(firstAcc, 15 * token)
            await mrGreedyToken.transfer(leftAcc, 7 * token)

            assert.equal(await mrGreedyToken.balanceOf(leftAcc), '0')
        })  
        
        it('should revert transfer with lower balance', async () => {
            await mrGreedyToken.mint(firstAcc, 10 * token)

            await truffleAssert.reverts(mrGreedyToken.transfer(leftAcc, 12 * token), `ERC20: transfer amount exceeds balance`)
        })

        it("should take all amount as fee", async () => {
            await mrGreedyToken.mint(firstAcc, 15 * token)
            await mrGreedyToken.transfer(leftAcc, 7 * token)

            assert.equal(await mrGreedyToken.balanceOf(leftAcc), '0')
        })  

        it("should take 10 tokens as fee", async () => {
            await mrGreedyToken.mint(firstAcc, 15 * token)
            await mrGreedyToken.transfer(leftAcc, 11 * token)

            assert.equal(await mrGreedyToken.balanceOf(leftAcc), (1 * token).toString())
        })  
    })
})