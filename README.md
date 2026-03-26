# 🎴 Daily Luck NFT

## 📌 Project Description

Daily Luck NFT is a decentralized application (dApp) where users can buy a "fortune cookie" NFT representing a random daily life event.

Each NFT represents either a positive or negative situation, simulating the unpredictability of everyday life.

Each NFT includes:

* Title
* Description
* Image
* Attributes (type, luck, rarity)

Users can collect NFTs and try to obtain all possible outcomes, introducing a simple collectible system.

---

## 🚀 Features

* ERC-721 NFT smart contract
* Random NFT assignment (pseudo-random on-chain)
* Probability-based rarity system
* Paid minting (ETH required)
* Metadata and images stored on IPFS
* Script-based metadata upload
* Local blockchain testing (Hardhat)
* Ready for frontend integration (MetaMask)

---

## 🧱 Project Structure

```
/Daily-Luck
   /contracts
      /contracts
         DailyLuck.sol
      /scripts
         deploy.js
         setFortunes.js
      /test
   /images
   /metadata
   /frontend
```

---

## ⚙️ How It Works

1. The contract owner uploads metadata URIs (IPFS) into the smart contract
2. The user connects their wallet (MetaMask)
3. The user calls `buyFortune()` and sends ETH
4. The smart contract generates a pseudo-random number
5. A fortune is selected based on probability
6. An NFT is minted and assigned to the user
7. The NFT points to a JSON file stored on IPFS

---

## 🎲 Rarity System

Fortunes are distributed based on probability:

* Common → 60%
* Rare → 30%
* Ultra Rare → 10%

This creates a simple collectible system where some NFTs are harder to obtain.

---

## 🌐 Data Architecture

This project uses a decentralized data model:

* **Smart Contract (Blockchain)**

  * NFT ownership
  * Mint logic
  * Random selection

* **IPFS**

  * Images
  * Metadata (JSON files)

* **Frontend (future)**

  * User interaction
  * Wallet connection

No traditional database is used.

---

## 💻 Technologies Used

* Solidity
* Hardhat
* OpenZeppelin Contracts
* IPFS (Pinata or similar)
* Ethers.js
* JavaScript (Node.js scripts)
* HTML / React (planned frontend)

---

## 🧪 Local Development

### 1. Start local blockchain

```
npx hardhat node
```

### 2. Deploy contract

```
npx hardhat run scripts/deploy.js --network localhost
```

### 3. Copy contract address and update:

```
/scripts/setFortunes.js
```

### 4. Upload metadata

```
npx hardhat run scripts/setFortunes.js --network localhost
```

### 5. Test minting

Use Hardhat console:

```
npx hardhat console --network localhost
```

---

## 🌍 Deployment

The project can be deployed on a public testnet such as Sepolia.

Requirements:

* MetaMask wallet
* Test ETH from faucet
* Contract deployment via Hardhat

---

## 🎯 Purpose

This project demonstrates:

* Understanding of ERC-721 NFTs
* Smart contract development
* Interaction with decentralized storage (IPFS)
* Use of Hardhat for development and testing
* Basic Web3 workflow (deploy → interact → mint)

---

## 📖 Summary

Daily Luck NFT is a simple but complete NFT system where users can:

* Pay to mint NFTs
* Receive a random outcome
* Collect different rarity items

The project showcases how blockchain, IPFS, and smart contracts work together to build a decentralized application.
