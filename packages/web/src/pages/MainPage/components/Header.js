import React, { useState } from "react";

// config
import config from "../../../config";

const { network } = config;
const { explorerUrl } = network;

const shortenAddress = (address) =>
  address ? `${address.slice(0, 5)}...${address.slice(-3)}` : "???";

const getRandomAvatar = (address) =>
  `https://api.dicebear.com/8.x/rings/svg?seed=opyn-${address}`;

const Header = ({ user, isConnected, connectHandler, disconnectHandler }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleHamburgerClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-brand-blue bg-opacity-50 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl md:text-3xl font-bold">
        <a href="/">opyn TimeVault</a>
      </h1>
      <div className="flex items-center">
        <a
          target={isConnected ? "_blank" : undefined}
          onClick={async () => {
            if (!isConnected) {
              await connectHandler();
            }
          }}
          href={isConnected ? `${explorerUrl}/address/${user.address}` : "#"}
          rel="noreferrer"
          className="mr-2 text-md md:text-lg flex flex-row justify-center items-center"
        >
          <img
            src={getRandomAvatar(user.address)}
            alt="User"
            className="w-10 h-10 rounded-full mr-2"
          />
          <span>{isConnected ? shortenAddress(user.address) : "Connect"}</span>
        </a>
        {Boolean(isConnected) && (
          <>
            <button
              className="md:hidden focus:outline-none"
              onClick={handleHamburgerClick}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
            <button
              className="hidden md:block bg-red-600 text-white px-4 py-2 rounded"
              onClick={async () => {
                // to avoid it staying open
                // next connect
                setIsMenuOpen(false);
                await disconnectHandler();
              }}
            >
              Disconnect
            </button>
          </>
        )}
      </div>
      {Boolean(isConnected) && isMenuOpen && (
        <div className="md:hidden absolute top-14 right-0 bg-white bg-opacity-50 text-black px-10 py-2 shadow-lg">
          <button
            className="bg-red-600 text-white px-6 py-1 rounded"
            onClick={async () => {
              // to avoid it staying open
              // next connect
              setIsMenuOpen(false);
              await disconnectHandler();
            }}
          >
            Disconnect
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
