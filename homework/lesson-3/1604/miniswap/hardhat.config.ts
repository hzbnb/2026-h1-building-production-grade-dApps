require("@nomicfoundation/hardhat-toolbox");
require("@parity/hardhat-polkadot");
require("./tasks/polkavm-evm"); // Load custom EVM mode tasks

const usePolkaNode = process.env.POLKA_NODE === "true";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "london", // Use London as the EVM version which should match PolkaVM
      // Some PolkaVM implementations might need specific settings
      viaIR: false, // Disable compilation via IR which might cause issues with some EVM compat layers
    },
  },
  networks: {
    hardhat: usePolkaNode
      ? {
          polkavm: true,
          nodeConfig: {
            nodeBinaryPath: "./bin/substrate-node",
            rpcPort: 8000,
            dev: true,
          },
          adapterConfig: {
            adapterBinaryPath: "./bin/eth-rpc",
            dev: true,
          },
        }
      : {}, // Standard hardhat network when not using PolkaVM
    localNode: {
      polkavm: true,
      url: `http://127.0.0.1:8545`,
      chainId: 420420420, // The actual chain ID from the PolkaVM node
      accounts: [
        process.env.LOCAL_PRIVATE_KEY || "0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133"
      ],
      timeout: 60000,
      gas: "auto",
      gasPrice: "auto",
      gasMultiplier: 2,
      hardfork: "london", // Ensure compatible EVM hardfork
    },
    passetHub: {
      polkavm: true,
      url: "https://testnet-passet-hub-eth-rpc.polkadot.io", // Polkadot Test Hub RPC
      accounts: process.env.POLKADOT_PRIVATE_KEY ? [process.env.POLKADOT_PRIVATE_KEY] : [],
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 100000000,
  },
};