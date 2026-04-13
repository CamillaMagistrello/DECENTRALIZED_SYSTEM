import { Box, Typography, Container, Grid, Modal } from "@mui/material";
import { useState } from "react";
import NftCard from "./NftCard";
import useNfts from "../utils/NftUtils";

export default function NftPage({ account }) {
    const nfts = useNfts(account);

    return (
        <div>
            <h2>My NFTs</h2>

            {nfts?.nfts?.map((nft) => (
                <div key={nft.id}>
                    <p>{nft.title}</p>
                    <img src={nft.image} width={120} />
                    <p>{nft.rarity}</p>
                </div>
            ))}
        </div>
    );
}