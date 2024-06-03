const { REACT_APP_OPYN_ENV = "dev" } = process.env;

console.log("Loading config....", { REACT_APP_OPYN_ENV });

const configs = {
  dev: {
    walletconnect: {
      projectId: "580572c7c4056abfd5f426ef4ec75025",
    },
    featureFlags: {
      faucet: true,
    },
    metadata: {
      name: "opyn Vault YieldTime",
      description: "opyn Vault YieldTime - make time work for you",
      url: "http://localhost:3000",
      icons: ["https://avatars.mywebsite.com/"],
    },
    network: {
      chainId: 1337,
      name: "Local Ethereum",
      currency: "ETH",
      explorerUrl: "http://localhost:3000",
      rpcUrl: "http://127.0.0.1:8545",
    },
  },
  test: {
    faucetInfo: {
      address: "0xD29EfbFA674985aEA2Cb7c8E52bd43D950491854",
      etherscanLink:
        "https://sepolia.etherscan.io/address/0xD29EfbFA674985aEA2Cb7c8E52bd43D950491854",
    },
    featureFlags: {
      faucet: true,
    },
    contractInfo: {
      address: "0x83AE70155E14Eb040Ba3deE5E9650071f7ad87ce",
      etherscanLink:
        "https://sepolia.etherscan.io/address/0x83AE70155E14Eb040Ba3deE5E9650071f7ad87ce",
    },
    walletconnect: {
      projectId: "580572c7c4056abfd5f426ef4ec75025",
    },
    metadata: {
      name: "opyn Vault YieldTime",
      description: "opyn Vault YieldTime - make time work for you",
      url: "https://opyn-time-vault.vercel.app",
      icons: ["https://avatars.mywebsite.com/"],
    },
    network: {
      chainId: 11155111,
      name: "Sepolia Ethereum",
      currency: "SepoliaETH",
      explorerUrl: "https://sepolia.etherscan.io",
      rpcUrl: "https://sepolia.infura.io/v3/d63470f362ba4e97b5bf867d49d52865",
    },
  },
  prod: {
    walletconnect: {
      projectId: "580572c7c4056abfd5f426ef4ec75025",
    },
    featureFlags: {
      faucet: false,
    },
    metadata: {
      name: "opyn Vault YieldTime",
      description: "opyn Vault YieldTime - make time work for you",
      url: "https://opyn-time-vault.vercel.app",
      icons: ["https://avatars.mywebsite.com/"],
    },
    network: {
      chainId: 1,
      name: "Ethereum",
      currency: "ETH",
      explorerUrl: "https://etherscan.io",
      rpcUrl: "https://infura.io/v3/d63470f362ba4e97b5bf867d49d52865",
    },
  },
};

export const config = configs[REACT_APP_OPYN_ENV];
console.log("Loaded config", { config });

export default config;
