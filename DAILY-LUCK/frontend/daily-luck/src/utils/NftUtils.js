import { ethers } from "ethers";
import { getCache, normalizeAddress, setCache } from "./nftCache";
import contractAbi from "./contract.json";
import * as Constants from "./Constants";

export const connectWallet = async () => {
    if (!window.ethereum) throw new Error("MetaMask missing");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);

    return {
        provider,
        account: accounts[0],
    };
};

export const getCurrentAccount = async () => {
    if (!window.ethereum) return null;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_accounts", []);

    return accounts.length ? accounts[0] : null;
};

export const getSigner = async () => {
    if (!window.ethereum) throw new Error("MetaMask missing");

    const provider = new ethers.BrowserProvider(window.ethereum);
    return await provider.getSigner();
};

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

const mapMetadata = (m, tokenId) => {
    const attributesMap = Object.fromEntries(
        (m.attributes || []).map((a) => [a.trait_type, a.value])
    );

    return {
        tokenId: tokenId.toString(),
        id: m.id,
        title: m.name || "No name",
        description: m.description || "",
        image: resolveIpfs(m.image),
        luck: attributesMap.luck || "Unknown",
        rarity: attributesMap.rarity || "Unknown",
    };
};

const getReadContract = () => {
    const provider = new ethers.JsonRpcProvider(
        "https://sepolia.infura.io/v3/" + Constants.INFURA_KEY
    );

    return new ethers.Contract(
        Constants.CONTRACT,
        contractAbi,
        provider
    );
};

const getWriteContract = async () => {
    const signer = await getSigner();

    return new ethers.Contract(
        Constants.CONTRACT,
        contractAbi,
        signer
    );
};

export const mintNFT = async () => {
    const contract = await getWriteContract();
    console.log("Contract:", contract.target);
    console.log("Function exists:", typeof contract.mintDailyLuckNFT);
    const tx = await contract.mintDailyLuckNFT({
        value: ethers.parseEther("0.01"),
        gasLimit: 500000
    });
    console.log("TX:", tx);
    console.log(tx.gasLimit.toString());
    await tx.wait();
    const signer = await getSigner();
    const address = await signer.getAddress();
    const key = normalizeAddress(address);
    const ids = await contract.getUserNFTs(address);
    const lastId = ids[ids.length - 1];
    const tokenURI = await contract.tokenURI(lastId);
    const metadata = await fetchJson(tokenURI);
    const nft = mapMetadata(metadata, lastId);
    const cached = getCache(key) || [];
    let found = false;
    const updated = cached.map((item) => {
        if (item.id === nft.id) {
            found = true;
            return { ...item, quantity: item.quantity + 1 };
        }
        return item;
    });
    if (!found) {
        updated.push({ ...nft, quantity: 1 });
    }
    setCache(key, updated);
    return nft;
};

export const getUserNFTs = async (account) => {
    if (!account) return [];
    const key = normalizeAddress(account);
    const cached = getCache(key);
    if (cached != null) return cached;
    const contract = getReadContract();
    const ids = await contract.getUserNFTs(account);
    if (!ids.length) {
        setCache(key, []);
        return [];
    }
    const items = await Promise.all(
        ids.map(async (id) => {
            const uri = await contract.tokenURI(id);
            const metadata = await fetchJson(uri);
            return mapMetadata(metadata, id);
        })
    );
    console.log("Fetched NFTs:", items);
    const groupedMap = {};
    for (const nft of items) {
        const key = nft.id;
        console.log("Processing NFT:", nft);
        if (!groupedMap[key]) {
            groupedMap[key] = { ...nft, quantity: 1 };
        } else {
            groupedMap[key].quantity++;
        }
    }
    const grouped = Object.values(groupedMap);
    console.log("Fetched NFTs grouped:", grouped);
    setCache(normalizeAddress(account), grouped);
    return grouped;
};