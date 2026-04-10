import { Box, Typography, Container, Paper, Grid, Modal } from "@mui/material";
import { useState } from "react";
import cookieImg from "../images/close.png";

function Nft({ userNfts = [] }) {
    const totalSlots = 20;
    const [selected, setSelected] = useState(null);

    return (
        <Box sx={{ py: 6, width: "100%", display: "flex", justifyContent: "center" }}>
            <Container
                maxWidth={false}
                sx={{
                    width: "100%",
                    maxWidth: 1400,
                    px: 4,
                    textAlign: "center"
                }}
            >

                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    🎴 Your Collection
                </Typography>

                <Typography sx={{ opacity: 0.6, mb: 4 }}>
                    20 possible outcomes. Your collection depends on what you've unlocked.
                </Typography>

                <Grid container spacing={3} justifyContent="center">
                    {Array.from({ length: totalSlots }).map((_, i) => {
                        const nft = userNfts[i];
                        const unlocked = Boolean(nft);

                        return (
                            <Grid
                                item
                                xs={3}
                                key={i}
                                sx={{ display: "flex", justifyContent: "center" }}
                            >
                                <Paper
                                    onClick={() => unlocked && setSelected(nft)}
                                    elevation={4}
                                    sx={{
                                        p: 3,
                                        borderRadius: 4,
                                        height: 280,
                                        width: "100%",
                                        maxWidth: 260,
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        textAlign: "center",
                                        cursor: unlocked ? "pointer" : "default",
                                        backgroundColor: unlocked ? "background.paper" : "#1f1f1f",
                                        color: unlocked ? "inherit" : "#777",
                                        filter: unlocked ? "none" : "grayscale(1)",
                                        opacity: unlocked ? 1 : 0.5,
                                        transition: "all 0.25s ease",
                                        "&:hover": unlocked
                                            ? {
                                                transform: "scale(1.05)",
                                                boxShadow: 10
                                            }
                                            : {}
                                    }}
                                >
                                    <Box
                                        sx={{
                                            height: 150,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        {unlocked ? (
                                            <Box
                                                component="img"
                                                src={nft.image || cookieImg}
                                                alt={nft.title || `NFT #${i + 1}`}
                                                sx={{
                                                    maxHeight: 130,
                                                    maxWidth: "100%",
                                                    objectFit: "contain"
                                                }}
                                            />
                                        ) : (
                                            <Typography fontSize={42}>🔒</Typography>
                                        )}
                                    </Box>

                                    <Typography fontWeight="bold">
                                        {unlocked ? nft.title : "Locked"}
                                    </Typography>

                                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                                        {unlocked ? nft.description : "Not revealed yet"}
                                    </Typography>
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>

                <Modal open={Boolean(selected)} onClose={() => setSelected(null)}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            bgcolor: "background.paper",
                            p: 4,
                            borderRadius: 4,
                            boxShadow: 24,
                            textAlign: "center",
                            maxWidth: 420,
                            width: "90%"
                        }}
                    >
                        {selected && (
                            <>
                                <Box
                                    component="img"
                                    src={selected.image || cookieImg}
                                    sx={{ maxWidth: "100%", maxHeight: 240, mb: 2 }}
                                />
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

export default Nft;