import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
    const [user1, user2, user3] = await ethers.getSigners();
    let users = [user1, user2, user3];

    const test = true;
    let dailyLuck;
    if(test){
        console.log("Deploying DailyLuck contract...");
        const DailyLuck = await ethers.getContractFactory("DailyLuck");
        dailyLuck = await DailyLuck.deploy();
        await dailyLuck.waitForDeployment();
        console.log("DailyLuck deployed to:", dailyLuck.target);
    }else{
        const contractAddress = "0xEc2B5D26DbAFACF6743CFBD1d3e4038d25C8a2FB"; 
        const DailyLuck = await ethers.getContractFactory("DailyLuck"); 
        dailyLuck = await DailyLuck.attach(contractAddress);
        users = [user1];

    }
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