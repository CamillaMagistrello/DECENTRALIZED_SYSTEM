const { ethers } = require("hardhat");

async function main() {
    const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const contract = await ethers.getContractAt("DailyLuck", contractAddress);

    const results = { common: 0, rare: 0, ultra: 0 };

    for (let i = 0; i < 50; i++) {
        await contract.buyFortune({ value: ethers.parseEther("0.01") });
        const uri = await contract.tokenURI(i);
        if (uri.includes("/0.json")) results.common++;
        else if (uri.includes("/1.json")) results.rare++;
        else if (uri.includes("/2.json")) results.ultra++;
        console.log(`Token ${i}: ${uri}`);
    }

    console.log("Distribuzione dopo 50 acquisti:");
    console.log(`Comuni: ${results.common}`);
    console.log(`Rare: ${results.rare}`);
    console.log(`Ultra rare: ${results.ultra}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});