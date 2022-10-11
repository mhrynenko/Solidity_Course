const { assert } = require("chai");
const { artifacts } = require("hardhat")
const truffleAssert = require("truffle-assertions");

const SimpleToken = artifacts.require("SimpleToken")

describe("SimpleToken", () => {
    let firstAcc;

    before("setup", async () => {
        firstAcc = (await web3.eth.getAccounts())[0]
    })

    describe("mint()", () => {
        it("should revert zero address", async () => {
            const simpleToken = await SimpleToken.new("SimpleToken", "ST")
            
            await truffleAssert.reverts(simpleToken.mint('0x0000000000000000000000000000000000000000', 1), 'ERC20: mint to the zero address')
        })

        it('should work okay with contract address', async () => {
            const simpleToken = await SimpleToken.new("SimpleToken", "ST")
            const contractAddr = await artifacts.require("ContractsHaterToken").new();
            
            await simpleToken.mint(contractAddr.address, 1);

            assert.equal(await simpleToken.balanceOf(contractAddr.address), '1')
        })

        it('should work okay with user address', async () => {
            const simpleToken = await SimpleToken.new("SimpleToken", "ST")
            
            await simpleToken.mint(firstAcc, 1);

            assert.equal(await simpleToken.balanceOf(firstAcc), '1')
        })

        it('should work with 0 amount', async () => {
            const simpleToken = await SimpleToken.new("SimpleToken", "ST")
            
            await simpleToken.mint(firstAcc, 10)

            assert.equal(await simpleToken.balanceOf(firstAcc), '10')
        })

        it('should work only with owner', async () => {
            const simpleToken = await SimpleToken.new("SimpleToken", "ST")
            
            const notOwner = (await web3.eth.getAccounts())[2]

            await truffleAssert.reverts(simpleToken.mint(firstAcc, 1, { from :  notOwner }), "Ownable: caller is not the owner")
        })
    })


    describe("burn()", () => {
        it('should work with 0 amount', async () => {
            const simpleToken = await SimpleToken.new("SimpleToken", "ST")
            
            await simpleToken.mint(firstAcc, 10)

            await simpleToken.burn(0)

            assert.equal(await simpleToken.balanceOf(firstAcc), '10')
        })

        it('should work with amount between 0 and balance', async () => {
            const simpleToken = await SimpleToken.new("SimpleToken", "ST")
            
            await simpleToken.mint(firstAcc, 10)

            await simpleToken.burn(8)

            assert.equal(await simpleToken.balanceOf(firstAcc), '2')
        })

        it('should revert with amount more than balance', async () => {
            const simpleToken = await SimpleToken.new("SimpleToken", "ST")
            
            await simpleToken.mint(firstAcc, 10)

            await truffleAssert.reverts(simpleToken.burn(11), 'ERC20: burn amount exceeds balance')
        })
    })
})