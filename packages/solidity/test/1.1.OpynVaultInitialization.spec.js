const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("OpynVault Initialization", function () {
  let OpynVault, vault, owner, addr1, addr2;
  let WETH_ADDRESS;

  beforeEach(async function () {
    const WETH = await ethers.getContractFactory("WETH");
    const weth = await WETH.deploy();

    WETH_ADDRESS = await weth.getAddress();
    [owner, addr1, addr2] = await ethers.getSigners();
    OpynVault = await ethers.getContractFactory("OpynVault");
  });

  it("should initialize with valid WETH address and yield", async function () {
    vault = await OpynVault.deploy(WETH_ADDRESS, 5000); // 5% yield
    expect(await vault.yearlyYield()).to.equal(5000);
  });

  it("should fail to initialize with zero address", async function () {
    await expect(
      OpynVault.deploy("0x0000000000000000000000000000000000000000", 5000)
    ).to.be.revertedWith("Token must be non-0 address");
  });

  it("should fail to initialize with zero yearly yield", async function () {
    await expect(OpynVault.deploy(WETH_ADDRESS, 0)).to.be.revertedWith(
      "Yield must be greater than 0"
    );
  });
});
