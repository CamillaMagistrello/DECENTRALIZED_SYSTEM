import { useEffect, useState } from "react";
import { ethers } from "ethers";
import * as Constants from "./Constants";
import contractAbi from "./contract.json";

const fetchWithFallback = async (url) => {
    try {
        if (!url) return "";
        if (url.startsWith("ipfs://")) {
            return url.replace("ipfs://", Constants.FORMAT_IPFS);
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error("bad response");
        return await res.json();
    } catch (e) {
        console.warn("IPFS gateway fallito:" + Constants.FORMAT_IPFS);
    }
};

export default function useNfts(account) {
    const [nfts, setNfts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!account) return;
        const load = async () => {
            try {
                setLoading(true);

                const cacheKey = `nfts-${account}`;
                const cached = localStorage.getItem(cacheKey);

                if (cached) {
                    setNfts(JSON.parse(cached));
                    setLoading(false);
                    return;
                }
                const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/" + Constants.INFURA_KEY);
                const contract = new ethers.Contract(
                    Constants.CONTRACT,
                    contractAbi,
                    provider
                );
                console.log("Account:", account);
                const ids = await contract.getUserNFTs(account);

                if (!ids || ids.length === 0) {
                    setNfts([]);
                    setLoading(false);
                    return;
                }

                const tokenURIs = await Promise.all(ids.map((id) => contract.tokenURI(id)));
                const metadataList = await Promise.all(tokenURIs.map((uri) => fetchWithFallback(uri)));

                const items = metadataList.map((metadata, index) => ({
                    idNft: ids[index].toString(),
                    id: metadata.id,
                    title: metadata.name || "No name",
                    description: metadata.description || "",
                    image: metadata.image,
                    rarity: metadata.attributes?.find((a) => a.trait_type === "rarity")?.value || "Unknown",
                }));

                setNfts(items);
                localStorage.setItem(cacheKey, JSON.stringify(items));
            } catch (err) {
                console.error("Errore caricamento NFT:", err);
                setNfts([]);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [account]);

    return { nfts, loading };
}