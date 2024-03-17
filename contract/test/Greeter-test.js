const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("Greeter", function () {

    it("Should return new greeting once changed", async function () {
        const Greeter = await ethers.getContractFactory("Greeter");
        const greeter  = await Greeter.deploy("Hello world!");

        expect(await greeter.greet()).to.equal("Hello world!");

        const setGreetingTx = await greeter.setGreeting("Hello world 2");

        await setGreetingTx.wait();

        expect(await greeter.greet()).to.equal("Hello world 2");
    });

    it("Should return new balance after ether deposited", async function () {
        const Greeter = await ethers.getContractFactory("Greeter");
        const greeter  = await Greeter.deploy("Hello world!");
        const depositTx = await greeter.deposit({ value: 10 });
        await depositTx.wait(); 

        //getting balance from the contract itself because it is storing ether. not the same as getting address to someone's account then checking their balance
        expect(await ethers.provider.getBalance(greeter)).to.equal(10)
    });

});