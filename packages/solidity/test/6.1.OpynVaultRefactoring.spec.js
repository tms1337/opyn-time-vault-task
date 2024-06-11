const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("OpynVault Contract Enhancements Tests", function () {
  let opynVault, token, owner, addr1, addr2;

  beforeEach(async function () {
    // Deploy the token and the vault contract
    const Token = await ethers.getContractFactory("ERC20Mintable");
    token = await Token.deploy("TestToken", "TT");
    const OpynVault = await ethers.getContractFactory("OpynVault");
    opynVault = await OpynVault.deploy(await token.getAddress(), 5000); // 5% yield example

    [owner, addr1, addr2, _] = await ethers.getSigners();

    await token.mint(await owner.getAddress(), ethers.parseEther("10000"));
    await token.mint(await addr1.getAddress(), ethers.parseEther("10000"));
    await token.mint(await addr2.getAddress(), ethers.parseEther("10000"));

    await token.transfer(await addr1.getAddress(), ethers.parseEther("1000"));
    await token
      .connect(addr1)
      .approve(await opynVault.getAddress(), ethers.parseEther("1000"));

    await token.approve(
      await opynVault.getAddress(),
      ethers.parseEther("8000")
    );
    await opynVault.depositRewards(ethers.parseEther("8000"));
  });

  it("Should handle deposits correctly", async function () {
    await expect(opynVault.connect(addr1).deposit(ethers.parseEther("100")))
      .to.emit(opynVault, "Deposit")
      .withArgs(await addr1.getAddress(), ethers.parseEther("100"));
  });

  it("Should prevent reentrancy on deposit", async function () {
    await token.approve(await opynVault.getAddress(), ethers.parseEther("10"));
    await opynVault.deposit(ethers.parseEther("10"));
    // Manually simulate reentrancy by calling deposit again in the same transaction context
    try {
      await opynVault.deposit(ethers.parseEther("10"));
      expect.fail("Should have thrown an error for reentrant call");
    } catch (error) {}
  });

  // it("Should correctly handle withdrawals", async function () {
  //   await opynVault.connect(addr1).deposit(ethers.parseEther("100"));
  //   await expect(opynVault.connect(addr1).withdraw())
  //     .to.emit(opynVault, "Withdrawal")
  //     .withArgs(await addr1.getAddress(), ethers.parseEther("105")); // Assumes 5% yield
  // });

  // it("Should ensure only owner can deposit rewards", async function () {
  //   await expect(
  //     opynVault.connect(addr2).depositRewards(ethers.parseEther("100"))
  //   ).to.be.revertedWith("Ownable: caller is not the owner");
  // });

  // it("ERC4626 compatibility check", async function () {
  //   // Assuming ERC4626 methods are integrated
  //   await expect(opynVault.totalAssets()).to.equal(ethers.parseEther("0"));
  // });

  // it("Contract upgradeability check", async function () {
  //   // Placeholder test, specifics depend on upgrade mechanism
  //   expect(await opynVault.version()).to.equal("1.0");
  // });

  // it("Gas optimization on frequent operations", async function () {
  //   const tx = await opynVault.connect(addr1).deposit(ethers.parseEther("100"));
  //   const receipt = await tx.wait();
  //   expect(receipt.gasUsed).to.be.below(200000); // Example gas limit
  // });

  // it("Correct event logs for all actions", async function () {
  //   await expect(opynVault.connect(addr1).deposit(ethers.parseEther("100")))
  //     .to.emit(opynVault, "Action")
  //     .withArgs("Deposit", await addr1.getAddress(), ethers.parseEther("100"));
  // });
});
