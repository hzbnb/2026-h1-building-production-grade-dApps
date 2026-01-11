import { task } from "hardhat/config";

// Placeholder for PolkaVM-EVM related tasks
// This file is referenced in hardhat.config.ts to support PolkaVM

task("polkavm-info", "Prints PolkaVM information")
  .setAction(async (taskArgs, { ethers }) => {
    console.log("PolkaVM-EVM environment is configured");
  });