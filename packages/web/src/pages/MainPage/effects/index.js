import { BrowserProvider } from "ethers";

// connectors
import VaultConnector from "../../../lib/connectors/Vault";
import FaucetConnector from "../../../lib/connectors/Faucet";
import TokenConnector from "../../../lib/connectors/Token";

// config
import config from "../../../config";

const { contractInfo } = config;
const { faucetInfo } = config;

export const initConnectorsEffect =
  ({ isConnected, walletProvider, setVault, setFaucet, setToken, after }) =>
  async () => {
    if (isConnected && walletProvider) {
      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();

      setVault(await VaultConnector(contractInfo.address, signer));
      setFaucet(await FaucetConnector(faucetInfo.address, signer));
      setToken(
        await TokenConnector(
          "0x469885D7F2CB6E72Ba62ad810223552fE9c9d5dF",
          signer
        )
      );

      after();
    }
  };
