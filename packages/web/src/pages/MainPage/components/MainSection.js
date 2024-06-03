import React, { useEffect, useState } from "react";

const UNKNOWN = "???.00";

const MainSection = ({ q_vaultInfo, etherscanUrl }) => {
  const [vaultInfo, setVaultInfo] = useState({});

  useEffect(() => {
    (async () => {
      const info = await q_vaultInfo();
      setVaultInfo(info);
    })();
  }, []);

  return (
    <main className="p-4 text-white bg-gray-800 lg:text-lg lg:text-xl">
      <div className="mb-4">
        <div className="mt-4">
          <p className="py-1">
            <span className="text-brand-blue mr-2">Wallet Tokens:</span>
            {vaultInfo?.tokenBalance?.toString() || UNKNOWN}
          </p>

          <hr />

          <p className="mt-2 mb-2">
            <span className="text-brand-blue mr-2">Vault at:</span>
            {vaultInfo?.address || UNKNOWN}
          </p>

          <p className="mt-2 mb-2">
            <span className="text-brand-blue mr-2">Vault Reward:</span>
            {vaultInfo?.totalReward?.toString() || UNKNOWN}
          </p>

          <hr />

          <p className="mt-2">
            <span className="text-brand-blue mr-2">Deposited Amount:</span>
            {vaultInfo?.depositedAmount?.toString() || UNKNOWN}
          </p>

          <p>
            <span className="text-brand-blue mr-2">Yield:</span>

            {vaultInfo?.yield?.toString() || UNKNOWN}
          </p>
        </div>
      </div>
    </main>
  );
};

export default MainSection;
