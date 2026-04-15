import { ethers } from "ethers";
import { getCache, setCache } from "./nftCache";
import contractAbi from "./contract.json";
import * as Constants from "./Constants";

const resolveIpfs = (url) => {
    if (!url) return "";
    if (url.startsWith("ipfs://")) {
        return url.replace("ipfs://", Constants.FORMAT_IPFS);
    }
    return url;
};

const fetchJson = async (url) => {
    const res = await fetch(resolveIpfs(url));
    if (!res.ok) throw new Error("Fetch metadata failed");
    return await res.json();
};

const mapMetadata = (m, id) => {
    const attributesMap = Object.fromEntries(
        (m.attributes || []).map((a) => [a.trait_type, a.value])
    );

    return {
        idNft: id?.toString(),
        id: m.id,
        title: m.name || "No name",
        description: m.description || "",
        image: resolveIpfs(m.image),
        luck: attributesMap.luck || "Unknown",
        rarity: attributesMap.rarity || "Unknown",
    };
};

export const mintNFT = async () => {
    if (!window.ethereum) throw new Error("MetaMask missing");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(
        Constants.CONTRACT,
        contractAbi,
        signer
    );

    const tx = await contract.mintDailyLuckNFT({
        value: ethers.parseEther("0.01"),
    });

    await tx.wait();

    const address = await signer.getAddress();
    const ids = await contract.getUserNFTs(address);
    const lastId = ids[ids.length - 1];
    let tokenURI = await contract.tokenURI(lastId);
    const metadata = await fetchJson(tokenURI);
    return mapMetadata(metadata, lastId);
};

export const getUserNFTs = async (account) => {
    const cached = getCache(account);
    if (cached) return cached;
    const provider = new ethers.JsonRpcProvider(
        "https://sepolia.infura.io/v3/" + Constants.INFURA_KEY
    );
    console.log("provider:", provider);
    const contract = new ethers.Contract(
        Constants.CONTRACT,
        contractAbi,
        provider
    );
    const ids = await contract.getUserNFTs(account);
    if (!ids.length) return [];
    const tokenURIs = await Promise.all(
        ids.map((id) => contract.tokenURI(id))
    );
    console.log("Token URIs:", tokenURIs);
    const metadataList = await Promise.all(
        tokenURIs.map((uri) => fetchJson(uri))
    );
    const items = metadataList.map((m, i) =>
        mapMetadata(m, ids[i])
    );
    setCache(account, items);
    return items;
};