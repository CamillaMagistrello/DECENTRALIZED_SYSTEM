const hre = require("hardhat");

async function main() {
    const DailyLuck = await hre.ethers.getContractFactory("DailyLuck");
    const dailyLuck = await DailyLuck.deploy();
    console.log("DailyLuck deployed to:", dailyLuck.target);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});