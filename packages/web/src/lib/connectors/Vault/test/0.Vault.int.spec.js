/* eslint-disable no-undef */
/**
 * @jest-environment node
 */
import { ethers } from "ethers";
import VaultConnector from "../VaultConnector";

const VAULT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const provider = ethers.getDefaultProvider("http://localhost:8545");
const signer = new ethers.Wallet(
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
).connect(provider);

describe("Vault Connector Tests", () => {
  test("should retrieve the current reward", async () => {
    const vault = await VaultConnector(VAULT_ADDRESS, provider, signer);
    const reward = await vault.f_getReward();
    expect(parseInt(reward.toString())).toBeGreaterThanOrEqual(0);
  });

  test("should retrieve the token address", async () => {
    const vault = await VaultConnector(VAULT_ADDRESS, provider, signer);
    const tokenAddress = await vault.f_getToken();
    expect(ethers.isAddress(tokenAddress)).toBe(true);
  });

  test("should retrieve the current reward percentage", async () => {
    const vault = await VaultConnector(VAULT_ADDRESS, provider, signer);
    const rewardPercentage = await vault.f_getRewardPercentage();
    expect(parseInt(rewardPercentage.toString())).toBeGreaterThanOrEqual(0);
  });

  test("should retrieve the deposit of a specific user", async () => {
    const vault = await VaultConnector(VAULT_ADDRESS, provider, signer);
    const userAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
    const deposit = await vault.f_getDeposit(userAddress);
    expect(parseInt(deposit.toString())).toBeGreaterThanOrEqual(0);
  });

  test("should calculate reward for a specific user (testing purposes)", async () => {
    const vault = await VaultConnector(VAULT_ADDRESS, provider, signer);
    const userAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
    const reward = await vault.f_calculateReward(userAddress);
    expect(parseInt(reward.toString())).toBeGreaterThanOrEqual(0);
  });

  test("should deposit tokens into the contract", async () => {
    const vault = await VaultConnector(VAULT_ADDRESS, provider, signer);
    const amount = "0x1";
    await vault.deposit(amount);
    const userAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
    const deposit = await vault.f_getDeposit(userAddress);
    expect(BigInt(deposit.toString())).toBeGreaterThanOrEqual(BigInt(amount));
  });

  test("should withdraw tokens and rewards from the contract", async () => {
    const vault = await VaultConnector(VAULT_ADDRESS, provider, signer);
    await vault.withdraw();
    const userAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
    const deposit = await vault.f_getDeposit(userAddress);
    expect(parseInt(deposit.toString())).toBe(0);
  });
});
