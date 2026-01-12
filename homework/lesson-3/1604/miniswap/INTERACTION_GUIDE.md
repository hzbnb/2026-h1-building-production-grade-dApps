# Interacting with MiniSwap Contract on PolkaVM

## Overview
This guide explains how to interact with the deployed MiniSwap contract on the PolkaVM localNode network.

## Deployed Contract Information
- **Contract Address**: `0x3Ae92CCb63104Cc7579Af236F102d12c5872AAa2`
- **Network**: PolkaVM localNode
- **Chain ID**: 420420420

## Prerequisites
Make sure you have:
1. The substrate node running:
```bash
./bin/substrate-node --dev --rpc-cors=all --unsafe-rpc-external --rpc-methods=unsafe &
```

2. The eth-rpc adapter running:
```bash
./bin/eth-rpc --node-rpc-url ws://127.0.0.1:9944 --rpc-port 8545 --unsafe-rpc-external --rpc-methods unsafe &
```

3. Your environment configured with a funded account (PRIVATE_KEY in .env file)

## Interaction Methods

### 1. Using Hardhat Scripts

Create a new script in `scripts/interact.ts`:

```typescript
import { ethers } from "hardhat";
import { MiniSwap__factory } from "../typechain-types";

async function main() {
  // Get the deployed contract instance
  const contractAddress = "0x3Ae92CCb63104Cc7579Af236F102d12c5872AAa2";
  const [signer] = await ethers.getSigners();
  
  console.log("Interacting with contract at:", contractAddress);
  console.log("Using account:", await signer.getAddress());

  const miniSwap = MiniSwap__factory.connect(contractAddress, signer);

  // Example: Get contract details
  console.log("Connected to MiniSwap contract");
  
  // You can now call read-only functions, send transactions, etc.
  // Example operations:
  /*
  // Add liquidity (requires approval first)
  const tx = await miniSwap.addLiquidity(tokenA, tokenB, amount);
  await tx.wait();
  
  // Call view functions
  const poolInfo = await miniSwap.liquidityPools(poolKey);
  */
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Then run the script:
```bash
POLKA_NODE=true npx hardhat run scripts/interact.ts --network localNode
```

### 2. Using Custom Scripts

Create specialized scripts for different interactions:

#### Adding Liquidity Script (`scripts/addLiquidity.ts`)
```typescript
import { ethers } from "hardhat";
import { MiniSwap__factory, MockERC20__factory } from "../typechain-types";

async function addLiquidity() {
  const contractAddress = "0x3Ae92CCb63104Cc7579Af236F102d12c5872AAa2";
  const [signer] = await ethers.getSigners();
  
  const miniSwap = MiniSwap__factory.connect(contractAddress, signer);
  
  // You'll need to have deployed MockERC20 tokens first
  // Example:
  // const tokenA = MockERC20__factory.connect(tokenAAddress, signer);
  // const tokenB = MockERC20__factory.connect(tokenBAddress, signer);
  
  // Approve tokens for spending
  // await tokenA.approve(contractAddress, amount);
  // await tokenB.approve(contractAddress, amount);
  
  // Add liquidity
  // const tx = await miniSwap.addLiquidity(tokenA.address, tokenB.address, amount);
  // console.log("Liquidity added, transaction hash:", tx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

### 3. Using Web3/Ethers Directly

You can also interact directly using ethers:

```typescript
import { ethers } from "ethers";

// Connect to the PolkaVM RPC
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// Initialize with your private key
const privateKey = process.env.PRIVATE_KEY; // Make sure this is set in your .env
const wallet = new ethers.Wallet(privateKey!, provider);

// Connect to the deployed contract
const contractABI = [...]; // Your contract ABI
const contractAddress = "0x3Ae92CCb63104Cc7579Af236F102d12c5872AAa2";
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// Example: Add liquidity
// const tx = await contract.addLiquidity(tokenA, tokenB, amount);
// await tx.wait();
// console.log("Transaction confirmed:", tx.hash);
```

### 4. Querying Contract State

You can read contract state without sending transactions:

```bash
# Using curl to query contract state
curl -X POST http://127.0.0.1:8545 \
-H "Content-Type: application/json" \
-d '{
  "jsonrpc":"2.0",
  "method":"eth_call",
  "params":[{
    "to":"0x3Ae92CCb63104Cc7579Af236F102d12c5872AAa2",
    "data":"0x..." # ABI-encoded function call
  }, "latest"],
  "id":1
}'
```

### 5. Using MetaMask (Alternative)

If you want to interact through a wallet like MetaMask:
1. Add the PolkaVM network to MetaMask:
   - Network Name: PolkaVM Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 420420420
   - Currency Symbol: ROC (or your token symbol)

2. Import an account that has funds on the PolkaVM network
3. Use a dApp interface to interact with the contract at `0x3Ae92CCb63104Cc7579Af236F102d12c5872AAa2`

## Important Notes

1. **Token Approvals**: Before adding liquidity or performing swaps, you must approve the MiniSwap contract to spend your tokens.

2. **Account Funding**: Ensure your account has sufficient funds in the PolkaVM network. You can check your balance with:
```bash
POLKA_NODE=true npx hardhat run scripts/checkBalance.ts --network localNode
```

3. **Gas Costs**: Transactions on PolkaVM may have different gas costs than Ethereum.

4. **Pool Keys**: Remember that pool keys are computed deterministically based on token addresses. Always ensure you're using the correct pool key for operations.

## Troubleshooting

- If you get "Invalid Transaction" error, check your chain ID and private key format
- If you get "Insufficient funds", make sure your account has tokens
- If function calls fail, ensure proper token approvals have been made

Happy interacting with your MiniSwap contract on PolkaVM!