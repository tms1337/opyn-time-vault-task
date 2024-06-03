import React, { useState } from "react";
import config from "../../../config";

const isFaucet = config.featureFlags.faucet;

const DepositForm = ({ onDeposit, onDrip }) => {
  const [amount, setAmount] = useState(1000);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onDeposit(amount);
    setAmount(1000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-700 p-4 rounded w-full max-w-2xl mx-auto"
    >
      <h3 className="text-xl font-bold mb-2">Deposit</h3>
      <p className="text-gray-400 mb-4">
        Enter the amount of WETH you would like to deposit. Your deposit will
        start earning rewards based on the duration it stays in the vault.
      </p>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 mb-2 text-black text-center"
        placeholder="Amount to deposit"
        required
      />
      <button
        type="submit"
        className="w-full bg-green-500 text-white p-2 rounded"
      >
        Deposit
      </button>

      {isFaucet && (
        <button
          onClick={async (e) => {
            e.preventDefault();
            await onDrip();
          }}
          className="mt-4 w-full bg-blue-500 text-white p-2 rounded"
        >
          Drip some token
        </button>
      )}
    </form>
  );
};

export default DepositForm;
