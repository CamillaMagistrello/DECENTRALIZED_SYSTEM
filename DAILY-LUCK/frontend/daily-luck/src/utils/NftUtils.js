import { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractAbi from "./contract.json";
import * as Constants from "./Constants";
import { getCache, setCache, prefetchImage } from "./nftCache";

const GATEWAYS = [
    "https://cloudflare-ipfs.com/ipfs/",
    "https://dweb.link/ipfs/",
    "https://ipfs.io/ipfs/"
];

const resolveIPFS = (url) => {
    if (!url) return url;

    if (url.startsWith("ipfs://")) {
        const hash = url.replace("ipfs://", "");
        return GATEWAYS.map((g) => g + hash);
    }

    return [url];
};

const fetchWithFallback = async (url) => {
    const urls = resolveIPFS(url);

    for (let i = 0; i < urls.length; i++) {
        try {
            const res = await fetch(urls[i]);
            if (!res.ok) throw new Error("bad response");
            return await res.json();
        } catch (e) {
            console.warn("IPFS failed:", urls[i]);
        }
    }

    throw new Error("All IPFS gateways failed");
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
                    const image = resolveIPFS(m.image)[0];

                    prefetchImage(image);

                    return {
                        idNft: ids[i].toString(),
                        id: m.id,
                        title: m.name || "No name",
                        description: m.description || "",
                        image,
                        rarity:
                            m.attributes?.find(
                                (a) => a.trait_type === "rarity"
                            )?.value || "Unknown",
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