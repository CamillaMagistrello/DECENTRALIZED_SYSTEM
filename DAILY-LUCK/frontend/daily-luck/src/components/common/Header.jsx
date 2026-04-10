import { useState } from "react";
import { ethers } from "ethers";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import cookieImg from "../../images/close.png";

function Header({ toggleTheme, mode, page, setPage }) {
    const theme = useTheme();
    const [account, setAccount] = useState(null);

    const connectWallet = async () => {
        try {
            if (!window.ethereum) {
                alert("Install MetaMask");
                return;
            }
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            setAccount(accounts[0]);
        } catch (error) {
            if (error.code === 4001) {
                console.log("User rejected connection");
                return;
            }
            console.error("Wallet connection error:", error);
        }
    };

    const formatAddress = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

    const navButtonStyle = (current) => ({
        color: theme.palette.text.primary,
        fontWeight: 600,
        opacity: page === current ? 1 : 0.6,
        borderBottom: page === current ? "2px solid #f5c542" : "2px solid transparent",
        borderRadius: 0,
    });

    return (
        <AppBar position="static" elevation={0} sx={{ background: theme.palette.custom.header.background,
        color: theme.palette.custom.header.text }} >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer", gap: 1 }} onClick={() => setPage("home")}>
                    <Box component="img" src={cookieImg} alt="cookie"
                        sx={{ width: 35, height: 35, objectFit: "contain", transition: "transform 0.3s ease, filter 0.3s ease",
                            "&:hover": {
                                transform: "rotate(12deg) scale(1.1)",
                                filter: "drop-shadow(0 0 6px rgba(245,197,66,0.6))",
                            }
                        }}
                    />
                    <Typography variant="h6" fontWeight="bold" color="primary">
                        Daily Luck NFT
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 3 }}>
                    <Button sx={navButtonStyle("home")} onClick={() => setPage("home")}>
                        Home
                    </Button>
                    <Button sx={navButtonStyle("nfts")} onClick={() => setPage("nfts")}>
                        My NFTs
                    </Button>
                    <Button sx={navButtonStyle("mint")} onClick={() => setPage("mint")}>
                        Mint Fortune
                    </Button>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Button onClick={toggleTheme}>
                        {mode === "dark" ? "☀️ Day" : "🌙 Night"}
                    </Button>

                    {account ? (
                        <Box sx={{ px: 2, py: 0.5, borderRadius: 2, background: theme.palette.action.hover, fontFamily: "monospace", fontSize: "0.85rem"}}>
                            {formatAddress(account)}
                        </Box>
                    ) : (
                        <Button variant="contained" onClick={connectWallet}>
                        Wallet
                        </Button>
                    )}
                </Box>

            </Toolbar>
        </AppBar>
    );
}

export default Header;