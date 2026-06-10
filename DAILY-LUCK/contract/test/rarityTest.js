const { ethers } = require("hardhat");

async function main() {
    const DailyLuck = await ethers.getContractFactory("DailyLuck");

    const dailyLuck = await DailyLuck.deploy();
    await dailyLuck.waitForDeployment();

    let common = 0;
    let rare = 0;
    let ultraRare = 0;

    const mintPrice = await dailyLuck.nftMintPrice();

    for (let i = 0; i < 100; i++) {
        const tx = await dailyLuck.mintDailyLuckNFT({
            value: mintPrice
        });

        await tx.wait();

        const rarity = Number(await dailyLuck.nftRarity(i));

        if (rarity === 0) common++;
        else if (rarity === 1) rare++;
        else if (rarity === 2) ultraRare++;

        console.log(
            `NFT #${i} -> ${
                rarity === 0
                    ? "COMMON"
                    : rarity === 1
                    ? "RARE"
                    : "ULTRA_RARE"
            }`
        );
    }

    console.log("\n=== RISULTATI ===");
    console.log("COMMON:", common);
    console.log("RARE:", rare);
    console.log("ULTRA_RARE:", ultraRare);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});