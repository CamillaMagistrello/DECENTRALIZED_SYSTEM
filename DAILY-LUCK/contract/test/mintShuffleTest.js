import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
    const [user1, user2, user3] = await ethers.getSigners();
    const users = [user1, user2, user3];

    /*
    console.log("Deploying DailyLuck contract...");
    const DailyLuck = await ethers.getContractFactory("DailyLuck");
    const dailyLuck = await DailyLuck.deploy();
    await dailyLuck.waitForDeployment();
    console.log("DailyLuck deployed to:", dailyLuck.target);
    */

    const contractAddress = "0x99DDD86C93737D2E473f4d2d0696eAF299B91c39";
    const DailyLuck = await ethers.getContractFactory("DailyLuck");
    const dailyLuck = await DailyLuck.attach(contractAddress);

    const provider = ethers.provider;

    for (const user of users) {
        console.log(`\nMinting 10 NFTs for user: ${await user.getAddress()}`);
        const balanceBefore = await provider.getBalance(user.address);
        console.log("=== ETH balance before mint ===", ethers.formatEther(balanceBefore), "ETH");

        for (let i = 0; i < 10; i++) {
            const tx = await dailyLuck.connect(user).mintDailyLuckNFT({ value: ethers.parseEther("0.01") });
            await tx.wait();

            const tokenId = await dailyLuck.nextNFTId() - 1n; // ethers v6, BigInt
            const rarity = await dailyLuck.nftRarity(tokenId);
            const uri = await dailyLuck.tokenURI(tokenId);

            console.log(`NFT #${tokenId} | Owner: ${await user.getAddress()} | Rarity: ${rarity} | URI: ${uri}`);
        }

        const balanceAfter = await provider.getBalance(user.address);
        console.log("=== ETH balance after mint ===", ethers.formatEther(balanceAfter), "ETH");
        console.log("-------------------------------------------------------");
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});