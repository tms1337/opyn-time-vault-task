const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("OpynVault Reward Calculation", function () {
  let OpynVault, vault, owner, addr1, addr2;
  let WETH, WETH_ADDRESS;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    WETH = await ethers.getContractFactory("ERC20Mintable");
    weth = await WETH.deploy("WETH", "WETH");
    WETH_ADDRESS = await weth.getAddress();
    OpynVault = await ethers.getContractFactory("OpynVault");
    vault = await OpynVault.deploy(WETH_ADDRESS, 50000);

    await weth.mint(await owner.getAddress(), 1000 * 1000);
    await weth.approve(await vault.getAddress(), 1000 * 1000);
    await vault.depositRewards(1000 * 1000);
  });

  it("should calculate reward for a single deposit", async function () {
    await weth.mint(await addr1.getAddress(), 10000);
    await weth.connect(addr1).approve(await vault.getAddress(), 5000);
    await vault.connect(addr1).deposit(5000);
    await ethers.provider.send("evm_increaseTime", [15 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine", []);
    const reward = await vault.calculateReward(await addr1.getAddress());
    expect(reward).to.be.above(0);
  });

  it("should calculate reward for multiple deposits", async function () {
    await weth.mint(await addr1.getAddress(), 10000);
    await weth.connect(addr1).approve(await vault.getAddress(), 5000);
    await vault.connect(addr1).deposit(2000);
    await vault.connect(addr1).deposit(3000);
    await ethers.provider.send("evm_increaseTime", [15 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine", []);
    const reward = await vault.calculateReward(await addr1.getAddress());
    expect(reward).to.be.above(0); // Simplified check
  });

  it("should calculate reward for different durations", async function () {
    await weth.mint(await addr1.getAddress(), 10000);
    await weth.connect(addr1).approve(await vault.getAddress(), 5000);
    await vault.connect(addr1).deposit(5000);
    await ethers.provider.send("evm_increaseTime", [15 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine", []);
    const initialReward = await vault.calculateReward(await addr1.getAddress());
    await ethers.provider.send("evm_increaseTime", [20 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine", []);
    const finalReward = await vault.calculateReward(await addr1.getAddress());
    expect(finalReward).to.be.above(initialReward);
  });

  it("should calculate zero reward for zero deposit duration", async function () {
    await weth.mint(await addr1.getAddress(), 10000);
    await weth.connect(addr1).approve(await vault.getAddress(), 5000);
    await vault.connect(addr1).deposit(5000);
    const reward = await vault.calculateReward(await addr1.getAddress());
    expect(reward).to.equal(0);
  });

  it("should calculate zero reward with zero deposit amount", async function () {
    const reward = await vault.calculateReward(await addr1.getAddress()); // No deposits made
    expect(reward).to.equal(0);
  });

  it("should calculate minimal reward for minimal duration difference", async function () {
    await weth.mint(await addr1.getAddress(), 10000);
    await weth.connect(addr1).approve(await vault.getAddress(), 5000);
    await vault.connect(addr1).deposit(5000);
    await ethers.provider.send("evm_increaseTime", [15 * 24 * 60 * 60 * 60]);
    await ethers.provider.send("evm_mine", []);
    const reward = await vault.calculateReward(await addr1.getAddress());
    expect(reward).to.be.above(0);
  });

  it("should handle multiple deposits and withdrawals", async function () {
    await weth.mint(await addr1.getAddress(), 10000);
    await weth.connect(addr1).approve(await vault.getAddress(), 5000);
    await vault.connect(addr1).deposit(2000);
    await ethers.provider.send("evm_increaseTime", [15 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine", []);
    await vault.connect(addr1).withdraw();
    await ethers.provider.send("evm_increaseTime", [15 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine", []);
    await vault.connect(addr1).deposit(3000);
    await ethers.provider.send("evm_increaseTime", [15 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine", []);
    const reward = await vault.calculateReward(await addr1.getAddress());
    expect(reward).to.be.above(0);
  });

  it("should handle different users with overlapping deposit periods", async function () {
    await weth.mint(await addr1.getAddress(), 10000);
    await weth.mint(await addr2.getAddress(), 1000);
    await weth.connect(addr1).approve(await vault.getAddress(), 5000);
    await weth.connect(addr2).approve(await vault.getAddress(), 5000);
    await vault.connect(addr1).deposit(3000);
    await vault.connect(addr2).deposit(400);
    await ethers.provider.send("evm_increaseTime", [15 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine", []);
    const reward1 = await vault.calculateReward(await addr1.getAddress());
    const reward2 = await vault.calculateReward(await addr2.getAddress());
    expect(reward1).to.be.above(0);
    expect(reward2).to.be.above(0);
  });

  it("should handle users depositing, calculating reward, then depositing again and recalculating", async function () {
    await weth.mint(await addr1.getAddress(), 10000);
    await weth.mint(await addr2.getAddress(), 1000);
    await weth.connect(addr1).approve(await vault.getAddress(), 5000);
    await weth.connect(addr2).approve(await vault.getAddress(), 5000);
    await vault.connect(addr1).deposit(3000);
    await ethers.provider.send("evm_increaseTime", [15 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine", []);
    const reward1 = await vault.calculateReward(await addr1.getAddress());
    await vault.connect(addr2).deposit(400);
    await vault.connect(addr1).deposit(2000);
    await ethers.provider.send("evm_increaseTime", [15 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine", []);
    const reward2 = await vault.calculateReward(await addr1.getAddress());
    expect(reward2).to.be.above(reward1);
  });
});
