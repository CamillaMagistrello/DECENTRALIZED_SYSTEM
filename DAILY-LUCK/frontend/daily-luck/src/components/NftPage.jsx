import { Box, Typography, Container, Grid, Modal } from "@mui/material";
import { useState } from "react";
import NftCard from "./NftCard";

function NftPage({ userNfts = [] }) {
    const totalSlots = 20;
    const [selected, setSelected] = useState(null);

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
                <Grid container spacing={3} justifyContent="center" display="flex" textAlign="center">
                    {Array.from({ length: totalSlots }).map((_, i) => {
                        const nft = userNfts[i];
                        const unlocked = Boolean(nft);

                        return (
                            <Grid item key={i} sx={{ flexBasis: "25%", left: "50%", maxWidth: "25%", display: "flex", justifyContent: "center" }}>
                                <NftCard nft={nft} unlocked={unlocked} index={i} onClick={(n) => setSelected(n)}/>
                            </Grid>
                        );
                    })}
                </Grid>

                <Modal open={Boolean(selected)} onClose={() => setSelected(null)}>
                    <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", bgcolor: "background.paper",
                    p: 4, borderRadius: 4, boxShadow: 24, textAlign: "center", maxWidth: 500, width: "90%" }}>
                        {selected && (
                            <>
                                <Box component="img" src={selected.image} sx={{ maxWidth: "100%", maxHeight: 280, mb: 2, borderRadius: 2 }}/>
                                <Typography variant="h6" fontWeight="bold">
                                    {selected.title}
                                </Typography>
                                <Typography sx={{ opacity: 0.7 }}>
                                    {selected.description}
                                </Typography>
                            </>
                        )}
                    </Box>
                </Modal>
            </Container>
        </Box>
    );
}

export default NftPage;