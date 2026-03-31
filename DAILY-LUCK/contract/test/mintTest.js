// scripts/mintTest.js
import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {

    const [user1, user2, user3] = await ethers.getSigners();
    const users = [user1, user2, user3];

    console.log("Deploying DailyLuck contract...");
    const DailyLuck = await ethers.getContractFactory("DailyLuck");
    const dailyLuck = await DailyLuck.deploy();
    await dailyLuck.waitForDeployment();
    console.log("DailyLuck deployed to:", dailyLuck.target);

    const provider = ethers.provider;
    
    for (const user of users) {
        console.log("\nMint user:", await user.getAddress());
        const balanceBefore = await provider.getBalance(user.address);
        console.log("\n=== ETH balances before mint ===" + ethers.formatEther(balanceBefore) + "ETH");

        console.log("\nMinting 10 NFTs (0.01 ETH each)...\n");
        for (let i = 0; i < 10; i++) {
            const tx = await dailyLuck.connect(user).mintDailyLuckNFT({ value: ethers.parseEther("0.01") });
            await tx.wait();

            const tokenId = i;
            const rarity = await dailyLuck.nftRarity(tokenId);
            const uri = await dailyLuck.tokenURI(tokenId);

            console.log(`NFT #${tokenId} | Owner: ${await user.getAddress()} | Rarity: ${rarity} | URI: ${uri}`);
        }

        const balanceAfter = await provider.getBalance(user.address);
        console.log("\n=== ETH balances after mint ===" + ethers.formatEther(balanceAfter) + "ETH");
        console.log("\n--------------------------------------------------------------------------");
    }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});