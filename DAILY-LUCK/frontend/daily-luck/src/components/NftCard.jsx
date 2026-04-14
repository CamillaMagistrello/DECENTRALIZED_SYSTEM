import { Paper, Box, Typography } from "@mui/material";
import cookieImg from "../images/close.png";

function NftCard({ nft, unlocked }) {
    const rarity = nft?.rarity;

    const formatIpfs = (url) => url.replace("ipfs://", "https://ipfs.io/ipfs/");

    const getGlow = () => {
        if (!unlocked) return "none";
        if (rarity === "ultra_rare") return "0 0 30px rgba(255, 215, 0, 0.8)";
        if (rarity === "rare") return "0 0 25px rgba(0, 170, 255, 0.7)";
        return "0 0 12px rgba(255,255,255,0.25)";
    };

    return (
        <Paper
            elevation={4}
            sx={{
                p: 3,
                borderRadius: 4,
                height: 380,
                width: "100%",
                maxWidth: "360px",
                cursor: unlocked ? "pointer" : "default",
                position: "relative",
                overflow: "hidden",

                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",

                backgroundColor: unlocked ? "background.paper" : "#2a2a2a",
                color: unlocked ? "inherit" : "#777",
                filter: unlocked ? "none" : "grayscale(1)",
                opacity: unlocked ? 1 : 0.6,

                transition: "transform 0.25s ease, box-shadow 0.25s ease",

                boxShadow: getGlow(),

                "&:hover": {
                    transform: "scale(1.08)",
                    boxShadow: `${getGlow()}, 0 30px 70px rgba(0,0,0,0.55)`
                },

                "&::before": unlocked
                    ? {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: "-75%",
                          width: "50%",
                          height: "100%",
                          background:
                              "linear-gradient(120deg, transparent, rgba(255,255,255,0.35), transparent)",
                          transform: "skewX(-25deg)",
                          transition: "0.6s"
                      }
                    : {},

                "&:hover::before": unlocked
                    ? {
                          left: "130%"
                      }
                    : {}
            }}
        >
            <Box sx={{ height: 180, display: "flex", alignItems: "center" }}>
                {unlocked ? (
                    <Box
                        component="img"
                        src={formatIpfs(nft.image) || cookieImg}
                        alt={nft.title}
                        sx={{
                            maxHeight: 170,
                            maxWidth: "100%",
                            objectFit: "contain"
                        }}
                    />
                ) : (
                    <Typography fontSize={44}>🔒</Typography>
                )}
            </Box>

            <Typography fontWeight="bold">
                {unlocked ? nft.title : "Locked"}
            </Typography>

            <Typography variant="body2" sx={{ opacity: 0.7 }}>
                {unlocked ? nft.description : "Not revealed yet"}
            </Typography>
        </Paper>
    );
}

export default NftCard;