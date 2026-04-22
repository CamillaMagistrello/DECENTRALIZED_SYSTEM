import { Box, Typography, Container, Grid, CircularProgress } from "@mui/material";
import NftCard from "./NftCard";
import { useEffect, useState } from "react";

export default function NftPage({ userNfts, account, loading }) {
    const totalSlots = 20;
    const [nft, setNft] = useState([]);

    useEffect(() => {
        setNft(userNfts);
    }, [userNfts]);

    
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
                {loading ? 
                    <CircularProgress sx={{display: 'block', margin: '0 auto'}}/>
                    : 
                    account ? 
                        <Grid container spacing={2}>
                            {console.log(userNfts)}
                            {Array.from({ length: totalSlots }).map((_, i) => {
                                let nftFind = nft?.find((n) =>
                                    parseInt(n?.image?.split("/")?.pop()?.split(".")[0]) === i
                                );
                                const unlocked = Boolean(nftFind);

                                return (
                                    <Grid size={3}>
                                        <NftCard nft={nftFind} unlocked={unlocked} />
                                    </Grid>
                                );
                            })}
                        </Grid>
                        :
                        <Typography variant="h6" color="error">
                            Please connect your wallet to view your NFTs.
                        </Typography>    
                }
            </Container>
        </Box>
    );
}