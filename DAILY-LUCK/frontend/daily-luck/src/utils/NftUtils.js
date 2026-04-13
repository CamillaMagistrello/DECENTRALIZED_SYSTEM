import { useEffect, useState } from "react";
import { ethers } from "ethers";
import * as Constants from "./Constants";
import contractAbi from "./contract.json";

export default function useNfts(account) {
    const [nfts, setNfts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!account) return;

        const load = async () => {
            try {
                setLoading(true);
                const chainId = await window.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: "0xaa36a7" }], // Sepolia
                });
                const provider = new ethers.BrowserProvider(window.ethereum);
                const network = await provider.getNetwork();
                console.log("network:", network);
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(
                    Constants.CONTRACT,
                    contractAbi,
                    signer
                );

                console.log("Account:", account);
                

                const ids = await contract.getUserNFTs(account);
                console.log("NFT IDs:", ids);

                if (!ids || ids.length === 0) {
                    setNfts([]);
                    return;
                }

                const items = await Promise.all(
                    ids.map(async (id) => {
                        try {
                            let tokenURI = await contract.tokenURI(id);

                            if (tokenURI.startsWith("ipfs://")) {
                                tokenURI = tokenURI.replace(
                                    "ipfs://",
                                    "https://ipfs.io/ipfs/"
                                );
                            }

                            const metadata = await fetch(tokenURI).then((r) => r.json());

                            return {
                                id: id.toString(),
                                title: metadata.name || "No name",
                                description: metadata.description || "",
                                image: metadata.image?.replace(
                                    "ipfs://",
                                    "https://ipfs.io/ipfs/"
                                ),
                                rarity: metadata.attributes?.find(
                                    (a) => a.trait_type === "rarity"
                                )?.value || "Unknown",
                            };
                        } catch (err) {
                            console.error("Errore NFT ID:", id.toString(), err);
                            return null;
                        }
                    })
                );

                // rimuove eventuali null
                setNfts(items.filter(Boolean));
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