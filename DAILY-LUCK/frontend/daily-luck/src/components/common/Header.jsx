import { useEffect, useState } from "react";
import { connectWallet, getUserNFTs, getCurrentAccount } from "../../utils/NftUtils";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import cookieImg from "../../images/close.png";
import { normalizeAddress, setCache } from "../../utils/nftCache";

function Header({ toggleTheme, mode, page, setPage, setAccountUser, setUserNfts, setLoading }) {
    const theme = useTheme();
    const [account, setAccount] = useState(null);

    useEffect(() => {
        const init = async () => {
            const acc = await getCurrentAccount();

            if (acc) {
                setAccount(acc);
                setAccountUser(acc);

                const nfts = await getUserNFTs(acc);
                setUserNfts(nfts);
            }
        };
        init();
    }, [setAccountUser, setUserNfts]);

    const handleConnect = async () => {
        try {
            setLoading(true);
            const { account } = await connectWallet();
            setAccount(account);
            setAccountUser(account);
            const nfts = await getUserNFTs(account);
            setUserNfts(nfts);
            setLoading(false);
        } catch (error) {
            if (error.code === 4001) return;
            console.error(error);
            setLoading(false);
        }
    };

    const handleDisconnect = () => {
        setAccount(null);
        setAccountUser(null);
        setUserNfts([]);
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
                        <Button sx={{ px: 2, py: 0.5, borderRadius: 2, background: theme.palette.action.hover, fontFamily: "monospace", fontSize: "0.85rem"}}
                        onClick={handleDisconnect}>
                            {formatAddress(account)}
                        </Button>
                    ) : (
                        <Button variant="contained" onClick={handleConnect}>
                        Wallet
                        </Button>
                    )}
                </Box>

            </Toolbar>
        </AppBar>
    );
}

export default Header;