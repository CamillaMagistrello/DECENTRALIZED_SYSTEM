import fs from "fs";
import path from "path";
import { ethers } from "hardhat";

async function main() {
  // Replace with your deployed contract address
  const CONTRACT_ADDRESS = "0xYOUR_CONTRACT_ADDRESS";

  const contract = await ethers.getContractAt("DailyLuck", CONTRACT_ADDRESS);

  const metadataDir = path.join(process.cwd(), "metadata");
  const files = fs.readdirSync(metadataDir).filter(f => f.endsWith(".json"));

  console.log(`Found ${files.length} JSON files in metadata/`);

  for (const file of files) {
    const id = parseInt(file.split(".")[0]);
    const uri = `ipfs://CID/${file}`;
    console.log(`Setting fortune ${id} -> ${uri}`);
    const tx = await contract.setFortune(id, uri);
    await tx.wait();
  }

  console.log("All fortunes have been set!");
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});