import { useState } from "react";
import { Box, Typography, Button, useTheme, Paper } from "@mui/material";
import { ethers } from "ethers";
import closedCookie from "../images/close.png";
import openedCookie from "../images/open.png";
import contractAbi from "../utils/contract.json";
import * as Constants from "../utils/Constants";
import AlertCustom from "./common/AlertCustom";

function Mint() {
    const theme = useTheme();
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    const [status, setStatus] = useState("idle");
    const [nft, setNft] = useState(null);
    const MINT_PRICE = "0.01 ETH";

    const handleMint = async () => {
        console.log("CLICK MINT");
        try {
            if (!window.ethereum) {
                showAlert("MetaMask non installato", "error");
                return;
            }
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            if (!accounts || accounts.length === 0) {
                showAlert("Wallet non connesso", "error");
                return;
            }
            setStatus("minting");

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(
                Constants.CONTRACT,
                contractAbi,
                signer
            );

            const tx = await contract.mintDailyLuckNFT({
                value: ethers.parseEther("0.01"),
            });

            await tx.wait();

            const userAddress = await signer.getAddress();
            const ids = await contract.getUserNFTs(userAddress);
            const lastId = ids[ids.length - 1];

            let tokenURI = await contract.tokenURI(lastId);

            if (tokenURI.startsWith("ipfs://")) {
                tokenURI = tokenURI.replace(
                    "ipfs://",
                    "https://ipfs.io/ipfs/"
                );
            }

            const metadata = await fetch(tokenURI).then((r) => r.json());

            setNft({
                idNft: lastId.toString(),
                id: metadata.id,
                image: metadata.image?.replace(
                    "ipfs://",
                    "https://ipfs.io/ipfs/"
                ),
                text: metadata.description || "",
                title: metadata.name || "",
            });

            setStatus("revealed");
        } catch (err) {
            console.error("MINT ERROR:", err);
            showAlert("Errore: connettesi a MetaMask e assicurati di avere abbastanza ETH per il mint.", "error");
            setStatus("error");
        }
    };

    const showAlert = (message, severity = "info") => {
        setAlert({
            open: true,
            message,
            severity,
        });
    };

    return (
        <Box sx={{ minHeight: "70vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", background: theme.palette.background.default }}>
            <AlertCustom
                open={alert.open}
                message={alert.message}
                severity={alert.severity}
                onClose={() =>
                    setAlert((prev) => ({ ...prev, open: false }))
                }
            />
            <Paper sx={{p: 4,mb: 4, borderRadius: 3, maxWidth: 500, textAlign: "center" }}>
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
                    disable={status !== "idle"}
                    sx={{
                        width: 200,
                        cursor: "pointer",
                        objectFit: "contain",
                        transition: "transform 0.4s ease, filter 0.9s ease",
                        "&:hover": {
                            transform: "rotate(12deg) scale(1.1)",
                            filter: "drop-shadow(0 0 6px rgba(245,197,66,0.6))",
                        },
                        animation: status === "minting" ? "shake 0.9s infinite" : "none",
                    }}
                />
            )}

            {status === "revealed" && nft && (
                <Paper elevation={4} sx={{ mt: 4, p: 4, borderRadius: 3, textAlign: "center", maxWidth: 300, animation: "fadeIn 0.6s ease" }}>
                    <Box component="img" src={nft.image} alt="nft" sx={{ width: "100%", mb: 2 }}/>
                    <Typography variant="h6" fontWeight="bold">
                        {nft.title}
                    </Typography>
                    <Typography sx={{ mt: 1, opacity: 0.8 }}>
                        {nft.text}
                    </Typography>
                    <Typography sx={{ mt: 2, fontSize: 12, opacity: 0.5 }}>
                        ID: {nft.id}
                    </Typography>
                </Paper>
            )}
            {(status === "revealed" || status === "error") && (
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