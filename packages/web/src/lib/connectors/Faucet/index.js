import { ethers } from "ethers";
import { abi as faucetAbi } from "./solidity/Faucet.abi";

const FaucetConnector = async (faucetAddress, signer) => {
  const faucet = new ethers.Contract(faucetAddress, faucetAbi, signer);

  return {
    dripToken: async () => {
      return await faucet.dripToken();
    },
  };
};

export default FaucetConnector;
