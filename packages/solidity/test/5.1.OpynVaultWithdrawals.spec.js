const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("OpynVault Withdrawals", function () {
  let OpynVault, vault, owner, addr1, addr2;
  let WETH, WETH_ADDRESS;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    WETH = await ethers.getContractFactory("ERC20Mintable");
    weth = await WETH.deploy("WETH", "WETH");
    WETH_ADDRESS = await weth.getAddress();
    OpynVault = await ethers.getContractFactory("OpynVault");
    vault = await OpynVault.deploy(WETH_ADDRESS, 5000);
    await weth.mint(await owner.getAddress(), 1000);
    await weth.approve(await vault.getAddress(), 1000);
    await vault.depositRewards(500);
  });

  it("should allow user to withdraw after single deposit", async function () {
    await weth.mint(await addr1.getAddress(), 1000);
    await weth.connect(addr1).approve(await vault.getAddress(), 500);
    await vault.connect(addr1).deposit(500);
    await ethers.provider.send("evm_increaseTime", [365 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine", []);
    const initialBalance = await weth.balanceOf(await addr1.getAddress());
    await vault.connect(addr1).withdraw();
    const finalBalance = await weth.balanceOf(await addr1.getAddress());
    expect(finalBalance).to.be.above(initialBalance);
  });

  it("should allow user to withdraw after multiple deposits", async function () {
    await weth.mint(await addr1.getAddress(), 1000);
    await weth.connect(addr1).approve(await vault.getAddress(), 500);
    await vault.connect(addr1).deposit(200);
    await vault.connect(addr1).deposit(300);
    await ethers.provider.send("evm_increaseTime", [365 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine", []);
    const initialBalance = await weth.balanceOf(await addr1.getAddress());
    await vault.connect(addr1).withdraw();
    const finalBalance = await weth.balanceOf(await addr1.getAddress());
    expect(finalBalance).to.be.above(initialBalance);
  });

  it("should allow user to withdraw after reward calculation", async function () {
    await weth.mint(await addr1.getAddress(), 1000);
    await weth.connect(addr1).approve(await vault.getAddress(), 500);
    await vault.connect(addr1).deposit(500);
    await ethers.provider.send("evm_increaseTime", [5 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine", []);
    const reward = await vault.calculateReward(await addr1.getAddress());
    const initialBalance = await weth.balanceOf(await addr1.getAddress());
    await vault.connect(addr1).withdraw();
    const finalBalance = await weth.balanceOf(await addr1.getAddress());
    expect(finalBalance).to.be.above(initialBalance + reward);
  });

  it("should allow withdraw immediately after deposit", async function () {
    await weth.mint(await addr1.getAddress(), 1000);
    await weth.connect(addr1).approve(await vault.getAddress(), 500);
    await vault.connect(addr1).deposit(500);
    await vault.connect(addr1).withdraw();
    const finalBalance = await weth.balanceOf(await addr1.getAddress());
    expect(finalBalance).to.equal(1000);
  });

  it("should handle withdraw after partial reward pool depletion", async function () {
    await weth.mint(await owner.getAddress(), 100 * 1000);
    await weth.connect(owner).approve(await vault.getAddress(), 100 * 1000);
    await vault.depositRewards(100 * 1000);

    await weth.mint(await addr1.getAddress(), 1000);
    await weth.mint(await addr2.getAddress(), 1000);
    await weth.connect(addr1).approve(await vault.getAddress(), 500);
    await vault.connect(addr1).deposit(500);
    await weth.connect(addr2).approve(await vault.getAddress(), 500);
    await vault.connect(addr2).deposit(500);
    await ethers.provider.send("evm_increaseTime", [200 * 24 * 60 * 60]); // Increase time by 1 y * 60ear
    await ethers.provider.send("evm_mine", []);
    await vault.connect(addr1).withdraw();
    const finalBalance = await weth.balanceOf(await addr1.getAddress());
    expect(finalBalance).to.be.above(1000); // User should get back deposit + rewards
  });

  it("should handle multiple users withdrawing simultaneously", async function () {
    await weth.mint(await addr1.getAddress(), 1000);
    await weth.mint(await addr2.getAddress(), 1000);
    await weth.connect(addr1).approve(await vault.getAddress(), 500);
    await vault.connect(addr1).deposit(500);
    await weth.connect(addr2).approve(await vault.getAddress(), 500);
    await vault.connect(addr2).deposit(500);
    await ethers.provider.send("evm_increaseTime", [365 * 24 * 60 * 60]); // Increase time by 1 y * 60ear
    await ethers.provider.send("evm_mine", []);

    await vault.connect(addr1).withdraw();
    await vault.connect(addr2).withdraw();
    const finalBalance1 = await weth.balanceOf(await addr1.getAddress());
    const finalBalance2 = await weth.balanceOf(await addr2.getAddress());
    expect(finalBalance1).to.be.above(1000);
    expect(finalBalance2).to.be.above(1000);
  });

  it("should handle users withdrawing after deposits and owner adding more rewards", async function () {
    await weth.mint(await addr1.getAddress(), 1000);
    await weth.mint(await addr2.getAddress(), 1000);
    await weth.connect(addr1).approve(await vault.getAddress(), 500);
    await vault.connect(addr1).deposit(500);
    await weth.connect(addr2).approve(await vault.getAddress(), 500);
    await vault.connect(addr2).deposit(500);
    await vault.depositRewards(500);
    await ethers.provider.send("evm_increaseTime", [365 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine", []);
    await vault.connect(addr1).withdraw();
    await vault.connect(addr2).withdraw();
    const finalBalance1 = await weth.balanceOf(await addr1.getAddress());
    const finalBalance2 = await weth.balanceOf(await addr2.getAddress());
    expect(finalBalance1).to.be.above(1000);
    expect(finalBalance2).to.be.above(1000);
  });

  it("should handle users withdrawing, depositing again, and then withdrawing", async function () {
    await weth.mint(await addr1.getAddress(), 1000);
    await weth.mint(await addr2.getAddress(), 1000);
    const initialBalance1 = await weth.balanceOf(addr1);
    await weth.connect(addr1).approve(await vault.getAddress(), 500);
    await vault.connect(addr1).deposit(500);
    await weth.connect(addr2).approve(await vault.getAddress(), 500);
    await vault.connect(addr2).deposit(500);
    await ethers.provider.send("evm_increaseTime", [365 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine", []);
    await vault.connect(addr1).withdraw();
    await weth.connect(addr1).approve(await vault.getAddress(), 500);
    await vault.connect(addr1).deposit(500);
    await ethers.provider.send("evm_increaseTime", [365 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine", []);
    await vault.connect(addr1).withdraw();
    const finalBalance1 = await weth.balanceOf(await addr1.getAddress());
    expect(finalBalance1).to.be.above(1000);
  });
});
