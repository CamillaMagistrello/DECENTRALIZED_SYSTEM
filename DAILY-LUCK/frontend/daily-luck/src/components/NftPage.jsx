import { Box, Typography, Container, Grid, CircularProgress } from "@mui/material";
import NftCard from "./NftCard";

export default function NftPage({ userNfts, account, loading }) {
    const totalSlots = 20;
    
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
                            {Array.from({ length: totalSlots }).map((_, i) => {
                                const nft = userNfts?.find((n) =>
                                    parseInt(n?.image?.split("/")?.pop()?.split(".")[0]) === i
                                );
                                const unlocked = Boolean(nft);

                                return (
                                    <Grid size={3}>
                                        <NftCard nft={nft} unlocked={unlocked} />
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