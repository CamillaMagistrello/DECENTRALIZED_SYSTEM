import { useState } from "react";
import { Box, Typography, Button, useTheme, Paper } from "@mui/material";
import closedCookie from "../images/close.png";
import openedCookie from "../images/open.png";

function Mint() {
    const theme = useTheme();
    const [status, setStatus] = useState("idle");
    const [nft, setNft] = useState(null);
    const MINT_PRICE = "0.01 ETH";

    const fakeMint = () => {
        return {
            image: openedCookie,
            text: "Something unexpected will happen today.",
        };
    };

    const handleMint = async () => {
        setStatus("opening");
        setTimeout(() => {
            const result = fakeMint();
            setNft(result);
            setStatus("revealed");
        }, 1200);
    };

    return (
        <Box sx={{ minHeight: "70vh", display: "flex", justifyContent: "center", alignItems: "center",
        flexDirection: "column", background: theme.palette.background.default }}>
            {status === "idle" && (
                <Paper sx={{ p: 4, mb: 4, borderRadius: 3, maxWidth: 500, textAlign: "center" }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Open Your Fortune Cookie
                    </Typography>
                    <Typography sx={{ opacity: 0.8, mb: 2 }}>
                        Each cookie contains a random outcome.
                        Some are lucky, some… not so much.
                    </Typography>
                    <Typography sx={{ opacity: 0.8 }}>
                        Click the cookie to mint your NFT and discover your fate.
                    </Typography>
                    <Typography sx={{ mt: 3, fontWeight: "bold", color: "primary.main" }}>
                        Cost: {MINT_PRICE}
                    </Typography>
                </Paper>
            )}
            {status !== "revealed" && (
                <Box component="img" src={status === "opening" ? openedCookie : closedCookie} alt="cookie" 
                    onClick={handleMint}
                    sx={{ width: 200, cursor: "pointer", objectFit: "contain", transition: "transform 0.3s ease, filter 0.3s ease",
                        "&:hover": {
                            transform: "rotate(12deg) scale(1.1)",
                            filter: "drop-shadow(0 0 6px rgba(245,197,66,0.6))",
                        },
                        animation: status === "opening" ? "shake 0.6s ease" : "none"
                    }}
                />
            )}
            {status === "revealed" && nft && (
                <Paper elevation={4} sx={{ mt: 4, p: 4, borderRadius: 3, textAlign: "center", maxWidth: 300, animation: "fadeIn 0.6s ease" }}>
                    <Box component="img" src={nft.image} alt="nft" sx={{ width: "100%", mb: 2 }}/>
                    <Typography variant="h6" fontWeight="bold">
                        Your Fortune
                    </Typography>
                    <Typography sx={{ mt: 1, opacity: 0.8 }}>
                        {nft.text}
                    </Typography>
                </Paper>
            )}
            {status === "revealed" && (
                <Button sx={{ mt: 3 }}
                    onClick={() => {
                        setStatus("idle");
                        setNft(null);
                    }}
                >
                    Open Another Cookie
                </Button>
            )}

            <style>
                {`
                @keyframes shake {
                    0% { transform: rotate(0deg); }
                    25% { transform: rotate(5deg); }
                    50% { transform: rotate(-5deg); }
                    75% { transform: rotate(3deg); }
                    100% { transform: rotate(0deg); }
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                `}
            </style>
        </Box>
    );
}

export default Mint;