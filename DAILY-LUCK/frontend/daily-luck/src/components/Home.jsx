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
                        Open a cookie and discover your fate. Good luck… you might need it.
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
                        <Typography sx={{ opacity: 0.85, mb: 1 }}>
                            A simple cookie. A random fate.
                        </Typography>
                        <Typography sx={{ opacity: 0.75 }}>
                            Each mint reveals a unique outcome — fortune or misfortune, fully unpredictable.
                        </Typography>
                        <Typography sx={{ opacity: 0.75 }}>
                            No patterns. No guarantees. Just probability doing its thing.
                        </Typography>
                    </Paper>

                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            🎮 Collect them all
                        </Typography>
                        <Typography sx={{ opacity: 0.75, mb: 1 }}>
                            Every outcome belongs to a rarity tier.
                        </Typography>
                        <Typography sx={{ opacity: 0.75 }}>
                            Common, rare, ultra rare — each with its own story, some lucky, some… less so.
                        </Typography>
                        <Typography sx={{ opacity: 0.75 }}>
                            The rarer it is, the less likely you’ll ever see it twice.
                        </Typography>
                    </Paper>
                </Stack>
            </Container>
        </Box>
    );
}

export default Home;