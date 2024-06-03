import { ethers } from "ethers";
import { abi as tokenAbi } from "./solidity/Token.abi";

const TokenConnector = async (tokenAddress, signer) => {
  const token = new ethers.Contract(tokenAddress, tokenAbi, signer);

  return {
    _shouldApproveAll: async (who, toWhom) => {
      const allowance = await token.allowance(who, toWhom);
      const balance = await token.balanceOf(who);

      return allowance === balance;
    },
    approveAll: async (who, toWhom) => {
      const allowance = await token.allowance(who, toWhom);
      const balance = await token.balanceOf(who);

      if (allowance === balance) {
        return;
      }

      return await token.connect(signer).approve(toWhom, balance);
    },
    balanceOf: async (address) => {
      return await token.balanceOf(address);
    },
  };
};

export default TokenConnector;
