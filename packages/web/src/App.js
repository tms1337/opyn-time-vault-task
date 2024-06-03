import MainPage from "./pages/MainPage";

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";

// config
import config from "./config";

const { walletconnect } = config;
const { projectId } = walletconnect;

const { network } = config;
const { rpcUrl, chainId } = network;

const ethersConfig = defaultConfig({
  metadata: config.metadata,

  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true,

  rpcUrl,
  defaultChainId: chainId,
});

createWeb3Modal({
  ethersConfig,
  chains: [network],
  projectId,
  enableAnalytics: true,
});

export default function App() {
  return <MainPage />;
}
