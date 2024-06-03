import React, { useState, useEffect } from "react";
import {
  useWeb3Modal,
  useWeb3ModalProvider,
  useWeb3ModalAccount,
  useDisconnect,
} from "@web3modal/ethers/react";

// config
import config from "../../config";

// components
import Header from "./components/Header";
import MainSection from "./components/MainSection";
import DepositForm from "./components/DepositForm";
import WithdrawForm from "./components/WithdrawForm";
import TransactingOvelay from "./components/TransactingOverlay";
import { sleep } from "../../lib/util";
import { initConnectorsEffect } from "./effects";

// extract parts of config
const { contractInfo } = config;

const getRandomHex = () => "0x" + Math.random().toString().slice(0, 10);

const MainPage = () => {
  // connect
  const { open, close } = useWeb3Modal();
  const { walletProvider } = useWeb3ModalProvider();
  const { address, isConnected } = useWeb3ModalAccount();
  const { disconnect } = useDisconnect();

  // state
  const [isBlockchaining, setIsBlockchaining] = useState(false);
  const [loadingText, setLoadingText] = useState("Transactioning...");
  const [changeId, setChangeId] = useState(getRandomHex());
  const [error, setError] = useState();

  // connectors
  const [vault, setVault] = useState();
  const [faucet, setFaucet] = useState();
  const [token, setToken] = useState();

  useEffect(() => {
    initConnectorsEffect({
      isConnected,
      walletProvider,
      setVault,
      setFaucet,
      setToken,
      after: () => setChangeId(getRandomHex()),
    })();
  }, [isConnected, walletProvider]);

  const wrapTransactionHandler =
    (f) =>
    async (...x) => {
      if (!isConnected || !token) {
        return;
      }

      try {
        setError(undefined);
        setIsBlockchaining(true);

        if (await token._shouldApproveAll(address, contractInfo.address)) {
          setLoadingText("You need to approve your tokens...");
          await sleep(1250);

          // will skip if is
          console.log("Approving...", {
            who: address,
            whom: contractInfo.address,
          });
          await token.approveAll(address, contractInfo.address);

          setLoadingText("Transacting...");
          setChangeId(getRandomHex());
        }

        await f(...x);
      } catch (error) {
        console.log({ error });
        setError(error.shortMessage || error.toString());

        setTimeout(() => {
          setError(undefined);
        }, 5000);
      } finally {
        await sleep(Math.random() * 250);

        setIsBlockchaining(false);
        setChangeId(getRandomHex());
      }
    };

  const handleDrip = wrapTransactionHandler(async () => {
    await faucet.dripToken();
  });
  const handleDeposit = wrapTransactionHandler(async (amount) => {
    await vault.deposit(amount);
  });
  const handleWithdraw = wrapTransactionHandler(async () => {
    await vault.withdraw();
  });

  const handleConnect = async () => {
    if (!isConnected) {
      await open();
    } else {
      await close();
    }
    setChangeId(getRandomHex());
  };

  useEffect(() => {
    setChangeId(getRandomHex());
  }, [isConnected]);

  const handleDisconnect = async () => {
    await disconnect();
  };

  const q_vaultInfo = async () => {
    if (!isConnected || !token || !vault) {
      return {};
    }

    return {
      address: contractInfo.address,
      etherscanUrl: contractInfo.etherscanUrl,
      totalReward: await vault.f_getReward(),
      tokenBalance: await token.balanceOf(address),
      depositedAmount: await vault.f_getDeposit(address),
      yield: await vault.f_calculateReward(address),
    };
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      {isBlockchaining && <TransactingOvelay text={loadingText} />}
      <Header
        user={{ address }}
        isConnected={isConnected}
        connectHandler={handleConnect}
        disconnectHandler={handleDisconnect}
      />
      <>
        <MainSection
          key={changeId}
          q_vaultInfo={q_vaultInfo}
          etherscanUrl={contractInfo.etherscanUrl}
        />
        <div className="p-4 pb-16 md:pb-32 md:pt-12 lg:pt-30 flex flex-col items-center w-full text-md md:text-lg lg:text-xl">
          {error && (
            <div className="my-2 text-lg text-red-500">Error: {error}</div>
          )}
          <DepositForm
            onDeposit={handleDeposit}
            onDrip={handleDrip}
            className="mb-4"
          />
          <WithdrawForm onWithdraw={handleWithdraw} />
        </div>
      </>
    </div>
  );
};

export default MainPage;
