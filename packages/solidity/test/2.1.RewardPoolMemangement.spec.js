const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("OpynVault Reward Pool Management", function () {
  let OpynVault, vault, owner, addr1, addr2;
  let WETH, WETH_ADDRESS;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    WETH = await ethers.getContractFactory("ERC20Mintable");
    weth = await WETH.deploy("WETH", "WETH");
    WETH_ADDRESS = await weth.getAddress();
    OpynVault = await ethers.getContractFactory("OpynVault");
    vault = await OpynVault.deploy(WETH_ADDRESS, 5000);
  });

  it("should allow owner to deposit rewards", async function () {
    await weth.mint(await owner.getAddress(), 1000);
    await weth.approve(await vault.getAddress(), 1000);
    await vault.depositRewards(1000);
    expect(await vault.getReward()).to.equal(1000);
  });

  it("should not allow non-owner to deposit rewards", async function () {
    await weth.mint(await addr1.getAddress(), 1000);
    await weth.connect(addr1).approve(await vault.getAddress(), 1000);
    await expect(vault.connect(addr1).depositRewards(1000)).to.be.reverted;
  });

  it("should fail to deposit zero amount", async function () {
    await expect(vault.depositRewards(0)).to.be.revertedWith(
      "Need to deposit non-zero amount"
    );
  });

  it("should handle multiple owner deposits", async function () {
    await weth.mint(await owner.getAddress(), 1000);
    await weth.approve(await vault.getAddress(), 500);
    await vault.depositRewards(500);
    await weth.approve(await vault.getAddress(), 500);
    await vault.depositRewards(500);
    expect(await vault.getReward()).to.equal(1000);
  });

  it("should allow ownership transfer and new owner can deposit", async function () {
    await vault.transferOwnership(await addr1.getAddress());
    await weth.mint(await addr1.getAddress(), 1000);
    await weth.connect(addr1).approve(await vault.getAddress(), 1000);
    await vault.connect(addr1).depositRewards(1000);
    expect(await vault.getReward()).to.equal(1000);
  });
});
