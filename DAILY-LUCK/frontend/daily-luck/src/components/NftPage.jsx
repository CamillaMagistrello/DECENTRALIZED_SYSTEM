import { Box, Typography, Container, Grid } from "@mui/material";
import NftCard from "./NftCard";
import useNfts from "../utils/NftUtils";

export default function NftPage({ account }) {
    const nfts = useNfts(account);
    const totalSlots = 20;
    console.log(nfts)

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
                <Grid container spacing={2} size={12}>
                    {Array.from({ length: totalSlots }).map((_, i) => {
                        const nft = nfts?.nfts?.find((n) =>  
                            parseInt(n?.image?.split("/")?.pop()?.split(".")[0]) === i
                        );
                        const unlocked = Boolean(nft ? true : false);
                        console.log(nft)
                        return (
                            <Grid size={3}>
                                <NftCard
                                    nft={nft}
                                    unlocked={unlocked}
                                />
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
        </Box>
    );
}