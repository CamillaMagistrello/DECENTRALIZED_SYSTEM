require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.29",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      url: "https://sepolia.infura.io/v3/e6be6e2212e645349aeacb247ce7f326",
      accounts: ["e45fe7703fb33e69f423e0a773fb6bac82882635721015e52953c19b2db19b93"]
    },
  },
};