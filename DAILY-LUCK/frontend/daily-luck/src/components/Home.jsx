import { Box, Typography, Button, Container, Paper, Stack, useTheme } from "@mui/material";
import cookieImg from "../images/close.png";

function Home({ setPage }) {
    const theme = useTheme();

    return (
        <Box
            sx={{
                minHeight: "90vh",
                background: theme.palette.background.default,
                color: theme.palette.text.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: 1,
            }}
        >
            <Container maxWidth="md">
                <Box sx={{ alignItems: "center", textAlign: "center", mb: 5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, mb: 2 }}>
                        <Box component="img" src={cookieImg} alt="cookie"
                            sx={{ width: 100, height: 100, objectFit: "contain", transition: "transform 0.3s ease, filter 0.3s ease",
                                "&:hover": {
                                    transform: "rotate(12deg) scale(1.1)",
                                    filter: "drop-shadow(0 0 6px rgba(245,197,66,0.6))",
                                }
                            }}
                        />
                        <Typography variant="h3" fontWeight="bold" color="primary" sx={{ lineHeight: 1 }}>
                            Daily Luck NFT
                        </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ opacity: 0.7 }}>
                        Open a cookie. Discover your fate. No refunds.
                    </Typography>
                    <Button variant="contained" size="large" sx={{ mt: 3, px: 4, py: 1.5, borderRadius: 3 }}
                    onClick={() => setPage("mint")}>
                        Mint Fortune
                    </Button>
                </Box>

                <Stack spacing={3}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            🎴 What is this?
                        </Typography>
                        <Typography sx={{ opacity: 0.8 }}>
                            A blockchain-based fortune cookie system where every mint creates a unique NFT outcome.
                        </Typography>
                    </Paper>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            🧠 Ownership
                        </Typography>
                        <Typography sx={{ opacity: 0.8 }}>
                            Once minted, your result is permanent and cannot be changed.
                        </Typography>
                    </Paper>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            🎮 Collect
                        </Typography>
                        <Typography sx={{ opacity: 0.8 }}>
                            Duplicate NFTs are part of the game. Collect them, trade them, flex them.
                        </Typography>
                    </Paper>
                </Stack>
            </Container>
        </Box>
    );
}

export default Home;