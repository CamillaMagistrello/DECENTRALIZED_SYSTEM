# 🎴 Daily Luck NFT

## 📌 Project Description

Daily Luck NFT is a decentralized application (dApp) that allows users to mint NFTs representing random daily life events. Each NFT reflects either a positive or negative situation, simulating the unpredictability of everyday life.

Each NFT includes:

* Title
* Description
* Image
* Attributes (type, luck, rarity)

Users can collect NFTs over time and try to obtain all possible outcomes, introducing a simple gamification element.

---

## 🚀 Features

* ERC-721 NFT smart contract
* Random NFT assignment (pseudo-random on-chain)
* Rarity-based distribution
* Paid minting (testnet ETH)
* Metadata and images stored on IPFS
* Simple web interface (wallet connection + mint button)

---

## 🧱 Project Structure

```
/ExamNFT
   /contracts
      DailyLifeRandomNFT.sol
   /images
   /metadata
   /frontend
      index.html
```

---

## ⚙️ How It Works

1. The user connects their wallet (MetaMask)
2. The user clicks "Mint Your Day"
3. A small payment is sent (test ETH)
4. The smart contract generates a pseudo-random number
5. An NFT is selected based on probability (rarity system)
6. The NFT is minted and assigned to the user

---

## 🎲 Rarity System

NFTs are distributed based on probability:

* Common (bad luck): high probability
* Common (good luck): medium probability
* Uncommon: lower probability
* Rare: very low probability
* Legendary: extremely rare

This simulates real-life randomness where positive outcomes are less frequent.

---

## 🌐 Decentralization

* NFTs are stored on-chain using the ERC-721 standard
* Metadata and images are stored on IPFS
* Users interact directly with the smart contract via the frontend
* No centralized backend is required

---

## 💻 Technologies Used

* Solidity
* Remix IDE
* OpenZeppelin Contracts
* IPFS (Pinata)
* Ethers.js
* HTML / JavaScript frontend

---

## 🧪 Deployment

The smart contract is deployed on the Sepolia testnet.

Users need:

* MetaMask wallet
* Sepolia ETH (from faucet)

---

## 🎯 Purpose

The goal of this project is to demonstrate:

* Understanding of ERC-721 NFTs
* Smart contract development
* Integration with decentralized storage (IPFS)
* Basic Web3 frontend interaction

---

## 📖 Summary

This project provides a simple but complete NFT system where users can mint, collect, and interact with randomly assigned digital assets, while showcasing core blockchain concepts in a clear and functional way.
