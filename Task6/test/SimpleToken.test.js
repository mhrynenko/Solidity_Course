const { assert } = require("chai");
const { artifacts } = require("hardhat")
const truffleAssert = require("truffle-assertions");
const { ZERO_ADDR } = require("../scripts/utils/constants");
const { accounts } = require("../scripts/utils/utils");

const SimpleToken = artifacts.require("SimpleToken")

describe("SimpleToken", () => {
    let firstAcc;
    let simpleToken;

    beforeEach(async () => {
        simpleToken = await SimpleToken.new("SimpleToken", "ST")
    })

    before("setup", async () => {
        firstAcc = await accounts(0)
    })

    describe("mint()", () => {
        it("should revert zero address", async () => {
            await truffleAssert.reverts(simpleToken.mint(ZERO_ADDR, 1), 'ERC20: mint to the zero address')
        })

        it('should work okay with contract address', async () => {
            const contractAddr = await artifacts.require("ContractsHaterToken").new();
            
            await simpleToken.mint(contractAddr.address, 1);

            assert.equal(await simpleToken.balanceOf(contractAddr.address), '1')
        })

        it('should work okay with user address', async () => {
            await simpleToken.mint(firstAcc, 1);

            assert.equal(await simpleToken.balanceOf(firstAcc), '1')
        })

        it('should work with 0 amount', async () => {
            await simpleToken.mint(firstAcc, 10)

            assert.equal(await simpleToken.balanceOf(firstAcc), '10')
        })

        it('should work only with owner', async () => {
            const notOwner = (await web3.eth.getAccounts())[2]

            await truffleAssert.reverts(simpleToken.mint(firstAcc, 1, { from :  notOwner }), "Ownable: caller is not the owner")
        })
    })


    describe("burn()", () => {
        it('should work with 0 amount', async () => {
            await simpleToken.mint(firstAcc, 10)

            await simpleToken.burn(0)

            assert.equal(await simpleToken.balanceOf(firstAcc), '10')
        })

        it('should work with amount between 0 and balance', async () => {
            await simpleToken.mint(firstAcc, 10)

            await simpleToken.burn(8)

            assert.equal(await simpleToken.balanceOf(firstAcc), '2')
        })

        it('should revert with amount more than balance', async () => {
            await simpleToken.mint(firstAcc, 10)

            await truffleAssert.reverts(simpleToken.burn(11), 'ERC20: burn amount exceeds balance')
        })
    })
})