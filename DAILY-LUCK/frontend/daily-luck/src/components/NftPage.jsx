import { Box, Typography, Container, Grid } from "@mui/material";
import { getUserNFTs } from "../utils/NftUtils";
import { useEffect, useState } from "react";
import NftCard from "./NftCard";

export default function NftPage({ account }) {
    const [nfts, setNfts] = useState([]);
    const [loading, setLoading] = useState(false);
    const totalSlots = 20;

    useEffect(() => {
        if (!account) return;
        const load = async () => {
            try {
                setLoading(true);
                const data = await getUserNFTs(account);
                setNfts(data);
            } catch (err) {
                console.error(err);
                setNfts([]);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [account]);

    return (
        <Box sx={{ py: 6, width: "100%", display: "flex", justifyContent: "center" }}>
            <Container maxWidth={false}
                sx={{
                    width: "100%",
                    maxWidth: 1500,
                    px: 2,
                    textAlign: "center",
                }}
            >
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    🎴 Your Collection
                </Typography>

                <Typography sx={{ opacity: 0.6, mb: 4 }}>
                    20 possible outcomes. Your collection depends on what you've unlocked.
                </Typography>
                {console.log(nfts)}
                <Grid container spacing={2}>
                    {Array.from({ length: totalSlots }).map((_, i) => {
                        const nft = nfts?.find((n) =>  
                            parseInt(n?.image?.split("/")?.pop()?.split(".")[0]) === i
                        );
                        const unlocked = Boolean(nft ? true : false);
                        console.log(nft)

                        return (
                            <Grid size={3}>
                                <NftCard nft={nft} unlocked={unlocked} />
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
        </Box>
    );
}