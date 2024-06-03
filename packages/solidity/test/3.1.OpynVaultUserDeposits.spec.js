const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("OpynVault User Deposits", function () {
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

  it("should allow single user deposit", async function () {
    await weth.mint(await addr1.getAddress(), 1000);
    await weth.connect(addr1).approve(await vault.getAddress(), 500);
    await vault.connect(addr1).deposit(500);
    expect(await vault.getDeposit(await addr1.getAddress())).to.equal(500);
  });

  it("should track multiple deposits by a single user", async function () {
    await weth.mint(await addr1.getAddress(), 1000);
    await weth.connect(addr1).approve(await vault.getAddress(), 500);
    await vault.connect(addr1).deposit(200);
    await vault.connect(addr1).deposit(300);
    expect(await vault.getDeposit(await addr1.getAddress())).to.equal(500);
  });

  it("should handle multiple users depositing", async function () {
    await weth.mint(await addr1.getAddress(), 1000);
    await weth.connect(addr1).approve(await vault.getAddress(), 500);
    await vault.connect(addr1).deposit(500);

    await weth.mint(await addr2.getAddress(), 1000);
    await weth.connect(addr2).approve(await vault.getAddress(), 500);
    await vault.connect(addr2).deposit(500);

    expect(await vault.getDeposit(await addr1.getAddress())).to.equal(500);
    expect(await vault.getDeposit(await addr2.getAddress())).to.equal(500);
  });

  it("should fail to deposit zero amount", async function () {
    await expect(vault.connect(addr1).deposit(0)).to.be.revertedWith(
      "Need to deposit non-zero amount"
    );
  });

  it("should fail to deposit without sufficient balance", async function () {
    await weth.mint(await addr1.getAddress(), 100);
    await weth.connect(addr1).approve(await vault.getAddress(), 500);
    await expect(vault.connect(addr1).deposit(500)).to.be.revertedWith(
      "User must have sufficient tokens"
    );
  });

  it("should handle rapid successive deposits by a user", async function () {
    await weth.mint(await addr1.getAddress(), 1000);
    await weth.connect(addr1).approve(await vault.getAddress(), 1000);
    await vault.connect(addr1).deposit(200);
    await vault.connect(addr1).deposit(300);
    await vault.connect(addr1).deposit(500);
    expect(await vault.getDeposit(await addr1.getAddress())).to.equal(1000);
  });

  it("should handle user deposits, another user deposits, and first user deposits again", async function () {
    await weth.mint(await addr1.getAddress(), 1000);
    await weth.mint(await addr2.getAddress(), 1000);
    await weth.connect(addr1).approve(await vault.getAddress(), 500);
    await weth.connect(addr2).approve(await vault.getAddress(), 500);
    await vault.connect(addr1).deposit(300);
    await vault.connect(addr2).deposit(400);
    await vault.connect(addr1).deposit(200);
    expect(await vault.getDeposit(await addr1.getAddress())).to.equal(500);
    expect(await vault.getDeposit(await addr2.getAddress())).to.equal(400);
  });

  it("should handle interleaved user deposits and withdrawals", async function () {
    await weth.mint(await addr1.getAddress(), 1000);
    await weth.mint(await addr2.getAddress(), 1000);
    await weth.connect(addr1).approve(await vault.getAddress(), 500);
    await weth.connect(addr2).approve(await vault.getAddress(), 600);
    await vault.connect(addr1).deposit(300);
    await vault.connect(addr2).deposit(400);
    await vault.connect(addr1).withdraw();
    await vault.connect(addr2).deposit(200);
    expect(await vault.getDeposit(await addr1.getAddress())).to.equal(0);
    expect(await vault.getDeposit(await addr2.getAddress())).to.equal(600);
  });

  it("should handle owner deposits rewards, then users deposit", async function () {
    vault = await OpynVault.deploy(WETH_ADDRESS, 5000);
    await weth.approve(await vault.getAddress(), 500);

    await weth.mint(await addr1.getAddress(), 1000);
    await weth.mint(await addr2.getAddress(), 1000);
    await weth.connect(addr1).approve(await vault.getAddress(), 500);
    await weth.connect(addr2).approve(await vault.getAddress(), 500);
    await vault.depositRewards(500);
    await vault.connect(addr1).deposit(300);
    await vault.connect(addr2).deposit(400);
    expect(await vault.getDeposit(await addr1.getAddress())).to.equal(300);
    expect(await vault.getDeposit(await addr2.getAddress())).to.equal(400);
    expect(await vault.getReward()).to.equal(500);
  });
});
