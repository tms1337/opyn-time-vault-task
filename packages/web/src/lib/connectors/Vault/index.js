import { ethers } from "ethers";
import { abi as vaultAbi } from "./solidity/Vault.abi";

const VaultConnector = async (vaultAddress, signer) => {
  const vaultContract = new ethers.Contract(vaultAddress, vaultAbi, signer);

  return {
    // Pure functions

    // f_getReward - Retrieves the current reward
    f_getReward: async () => {
      return await vaultContract.getReward();
    },

    // f_getToken - Retrieves the token address
    f_getToken: async () => {
      return await vaultContract.getToken();
    },

    // f_getRewardPercentage - Retrieves the current reward percentage
    f_getRewardPercentage: async () => {
      return await vaultContract.getRewardPercentage();
    },

    // f_getDeposit - Retrieves the deposit of a specific user
    f_getDeposit: async (userAddress) => {
      return await vaultContract.getDeposit(userAddress);
    },

    // f_calculateReward - Calculates reward for a specific user (testing purposes)
    f_calculateReward: async (userAddress) => {
      return await vaultContract.calculateReward(userAddress);
    },

    // Non-pure functions

    // setRewardPercentage - Sets a new reward percentage (onlyOwner)
    setRewardPercentage: async (percentage) => {
      const tx = await vaultContract.setRewardPercentage(percentage);
      await tx.wait();
    },

    // depositRewards - Deposits rewards into the contract (onlyOwner)
    depositRewards: async (amount) => {
      const tx = await vaultContract.depositRewards(amount);
      await tx.wait();
    },

    // deposit - Approves token transfer and deposits tokens into the contract
    deposit: async (amount) => {
      await vaultContract.deposit(amount);
    },

    // withdraw - Withdraws tokens and rewards from the contract
    withdraw: async () => {
      const tx = await vaultContract.withdraw();
      await tx.wait();
    },
  };
};

export default VaultConnector;
