import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getCache, setCache, prefetchImage } from "./nftCache";
import contractAbi from "./contract.json";
import * as Constants from "./Constants";

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

        const cached = getCache(account);
        if (cached) {
            setNfts(cached);
            return;
        }

        const load = async () => {
            try {
                setLoading(true);
                const provider = new ethers.JsonRpcProvider(
                    "https://sepolia.infura.io/v3/" + Constants.INFURA_KEY
                );
                const contract = new ethers.Contract(
                    Constants.CONTRACT,
                    contractAbi,
                    provider
                );
                const ids = await contract.getUserNFTs(account);
                if (!ids.length) {
                    setNfts([]);
                    return;
                }
                const tokenURIs = await Promise.all(
                    ids.map((id) => contract.tokenURI(id))
                );

                const metadataList = await Promise.all(
                    tokenURIs.map((uri) => fetchWithFallback(uri))
                );

                const items = metadataList.map((m, i) => {
                    const image = fetchWithFallback(m.image)[0];
                    prefetchImage(image);

                    const attributesMap = Object.fromEntries(
                        (m.attributes || []).map((a) => [a.trait_type, a.value])
                    );

                    return {
                        idNft: ids[i].toString(),
                        id: m.id,
                        title: m.name || "No name",
                        description: m.description || "",
                        image,
                        luck: attributesMap.luck || "Unknown",
                        rarity: attributesMap.rarity || "Unknown",
                    };
                });

                setNfts(items);
                setCache(account, items);
            } catch (err) {
                console.error("Errore NFT:", err);
                setNfts([]);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [account]);

    return { nfts, loading };
}