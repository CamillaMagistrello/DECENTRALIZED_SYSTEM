import { ethers } from "ethers";
import { getCache, setCache } from "./nftCache";
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

    const tx = await contract.mintDailyLuckNFT({
        value: ethers.parseEther("0.01"),
    });
    console.log("TX SENT:", tx.hash);
    await tx.wait();
    console.log("TX MINED:", tx.hash);
    const signer = await getSigner();
    const address = await signer.getAddress();

    const ids = await contract.getUserNFTs(address);
    const lastId = ids[ids.length - 1];

    const tokenURI = await contract.tokenURI(lastId);
    const metadata = await fetchJson(tokenURI);

    const nft = mapMetadata(metadata, lastId);

    const cached = getCache(address) || [];
    setCache(address, [...cached, nft]);

    return nft;
};

export const getUserNFTs = async (account) => {
    if (!account) return [];
    const cached = getCache(account);
    if (cached) return cached;
    const contract = getReadContract();
    const ids = await contract.getUserNFTs(account);

    if (!ids.length) {
        setCache(account, []);
        return [];
    }
    const tokenURIs = await Promise.all(
        ids.map((id) => contract.tokenURI(id))
    );
    const metadataList = await Promise.all(
        tokenURIs.map((uri) => fetchJson(uri))
    );
    const items = metadataList.map((m, i) =>
        mapMetadata(m, ids[i])
    );
    const groupedMap = {};

    for (const nft of items) {
        const key = nft.id;

        if (!groupedMap[key]) {
            groupedMap[key] = {
                ...nft,
                quantity: 1,
            };
        } else {
            groupedMap[key].quantity += 1;
        }
    }

    const grouped = Object.values(groupedMap);
    console.log("grouped ", grouped);
    setCache(account, grouped);
    return grouped;
};