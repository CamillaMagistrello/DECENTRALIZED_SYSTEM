import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
    const [user1, user2] = await ethers.getSigners();
    const users = [user1, user2];

    /*
    console.log("Deploying DailyLuck contract...");
    const DailyLuck = await ethers.getContractFactory("DailyLuck");
    const dailyLuck = await DailyLuck.deploy();
    await dailyLuck.waitForDeployment();
    console.log("DailyLuck deployed to:", dailyLuck.target);
    */

    const contractAddress = "0xb79D802Cca97C8C46071C4A1403124242A74b5d7"; 
    const DailyLuck = await ethers.getContractFactory("DailyLuck"); 
    const dailyLuck = await DailyLuck.attach(contractAddress); 
   
    const provider = ethers.provider;

    for (const user of users) {
        console.log(`\nMinting 3 NFTs for user: ${await user.getAddress()}`);

        const balanceBefore = await provider.getBalance(user.address);
        console.log("=== ETH balance before mint ===", ethers.formatEther(balanceBefore), "ETH");

        for (let i = 0; i < 3; i++) {
            const tx = await dailyLuck
                .connect(user)
                .mintDailyLuckNFT({ value: ethers.parseEther("0.01") });

            await tx.wait();

            const tokenId = await dailyLuck.nextNFTId() - 1n;
            const rarity = await dailyLuck.nftRarity(tokenId);
            const uri = await dailyLuck.tokenURI(tokenId);

            console.log(
                `NFT #${tokenId} | Owner: ${await user.getAddress()} | Rarity: ${rarity} | URI: ${uri}`
            );
        }

        const balanceAfter = await provider.getBalance(user.address);
        console.log("=== ETH balance after mint ===", ethers.formatEther(balanceAfter), "ETH");

        const owned = await dailyLuck.getUserNFTs(user.address);

        console.log("\n📦 NFTs owned by user:");
        console.log(owned.map(x => x.toString()));

        for (const tokenId of owned) {
            const rarity = await dailyLuck.nftRarity(tokenId);
            const uri = await dailyLuck.tokenURI(tokenId);

            console.log(`Token #${tokenId} | Rarity: ${rarity} | URI: ${uri}`);
        }

        console.log("-------------------------------------------------------");
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});