import { useEffect, useState } from "react";
import { ethers } from "ethers";
import * as Constants from "./Constants";
import contractAbi from "./abi.json";

export default function NftUtils(account) {
    const [nfts, setNfts] = useState([]);

    useEffect(() => {
        if (!account) return;

        const load = async () => {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(
                Constants.CONTRACT,
                contractAbi,
                provider
            );

            const balance = await contract.balanceOf(account);

            const items = [];

            for (let i = 0; i < Number(balance); i++) {
                const tokenId = await contract.tokenOfOwnerByIndex(account, i);

                let tokenURI = await contract.tokenURI(tokenId);

                if (tokenURI.startsWith("ipfs://")) {
                    tokenURI = tokenURI.replace(
                        "ipfs://",
                        "https://ipfs.io/ipfs/"
                    );
                }

                const metadata = await fetch(tokenURI).then((r) => r.json());

                items.push({
                    id: tokenId.toString(),
                    title: metadata.name,
                    description: metadata.description,
                    image: metadata.image?.replace(
                        "ipfs://",
                        "https://ipfs.io/ipfs/"
                    ),
                    rarity: metadata.attributes?.find(a => a.trait_type === "rarity")?.value
                });
            }

            setNfts(items);
        };

        load();
    }, [account]);

    return nfts;
}