import { useState } from "react";
import { Box, Typography, useTheme, Paper } from "@mui/material";
import { getUserNFTs, mintNFT } from "../utils/NftUtils";
import closedCookie from "../images/close.png";
import openedCookie from "../images/open.png";
import AlertCustom from "./common/AlertCustom";

function Mint({ setUserNfts, account }) {
    const theme = useTheme();

    const [alert, setAlert] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    const [status, setStatus] = useState("idle");
    const [nft, setNft] = useState(null);
    const [open, setOpen] = useState(false);

    const MINT_PRICE = "0.01 ETH";

    const showAlert = (message, severity = "info") => {
        setAlert({
            open: true,
            message,
            severity,
        });
    };

    const handleMint = async () => {
        try {
            setStatus("minting");
            const nftData = await mintNFT();
            setNft(nftData);
            setStatus("revealed");
            setOpen(true);
            const updated = await getUserNFTs(account);
            setUserNfts(updated);
        } catch (err) {
            console.error(err);
            showAlert("Errore durante il mint", "error");
            setStatus("error");
        }
    };

    return (
        <Box sx={{
            minHeight: "70vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            background: theme.palette.background.default
        }}>
            <AlertCustom
                open={alert.open}
                message={alert.message}
                severity={alert.severity}
                onClose={() => setAlert((p) => ({ ...p, open: false }))}
            />

            <Paper sx={{ p: 4, mb: 4, borderRadius: 3, maxWidth: 500, textAlign: "center" }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Open Your Fortune Cookie
                </Typography>

                <Typography sx={{ opacity: 0.8, mb: 2 }}>
                    Each cookie contains a random NFT fate.
                </Typography>

                <Typography sx={{ opacity: 0.8 }}>
                    Click the cookie to mint your NFT and discover your fate.
                </Typography>

                <Typography sx={{ mt: 3, fontWeight: "bold", color: "primary.main" }}>
                    Cost: {MINT_PRICE}
                </Typography>
            </Paper>

            {status !== "revealed" && (
                <Box component="img" src={status === "idle" ? closedCookie : openedCookie} alt="cookie"
                    onClick={handleMint}
                    sx={{ 
                        width: 200,
                        cursor: "pointer",
                        objectFit: "contain",
                        transition: "transform 0.4s ease",
                        "&:hover": {
                            transform: "rotate(12deg) scale(1.1)",
                        }, 
                        animation: status === "minting" ? "shake 0.9s infinite" : "none",
                    }}
                />
            )}
            {open && nft && (
                <Box sx={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.85)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999, animation: "fadeIn 0.3s ease", cursor: "pointer" }}
                onClick={() => {
                    setOpen(false);
                    setStatus("idle");
                    setNft(null);
                }}>
                    <Paper elevation={10} sx={{ p: 4, borderRadius: 4, textAlign: "center", maxWidth: 600, background: "linear-gradient(145deg, #1e1e1e, #2a2a2a)", color: "#fff", animation: "pop 0.4s ease" }}>
                        <Box component="img" src={nft.image} alt="nft" sx={{ width: "100%", mb: 2, borderRadius: 2 }}/>
                        <Typography variant="h4" fontWeight="bold">
                            {nft.title.toUpperCase()}
                        </Typography>
                        <Typography sx={{ mt: 1, opacity: 0.8, fontSize: 23 }}>
                            {nft.description}
                        </Typography>
                        <Typography sx={{ mt: 2, fontSize: 20, fontWeight: "bold", 
                        color: nft.luck === "good" ? "#4caf50" : nft.luck === "bad" ? "#f44336" : "#aaa" }}>
                            Lucky: {nft.luck}
                        </Typography>
                        <Typography sx={{ mt: 2, fontSize: 20, opacity: 0.5 }}>
                            click anywhere to close
                        </Typography>
                    </Paper>
                </Box>
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
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes pop {
                    0% { transform: scale(0.6); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                `}
            </style>
        </Box>
    );
}

export default Mint;