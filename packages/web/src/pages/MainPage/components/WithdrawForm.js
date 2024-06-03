import React, { useState } from "react";

const WithdrawForm = ({ onWithdraw }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onWithdraw();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-700 p-4 rounded w-full max-w-2xl mx-auto mt-4"
    >
      <h3 className="text-xl font-bold mb-2">Withdraw</h3>
      <p className="text-gray-400 mb-4">
        Withraw your deposits. The rewards accrued based on the duration of your
        deposit will be added to the withdrawn amount.
      </p>

      <button
        type="submit"
        className="w-full bg-red-500 text-white p-2 rounded"
      >
        Withdraw
      </button>
    </form>
  );
};

export default WithdrawForm;
