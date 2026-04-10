import { Paper, Box, Typography } from "@mui/material";
import cookieImg from "../images/close.png";

function NftCard({ nft, unlocked, index, onClick }) {
    return (
        <Paper
            onClick={() => unlocked && onClick?.(nft, index)}
            elevation={3}
            sx={{
                p: 2,
                borderRadius: 3,
                height: 180,
                width: "100%",
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

                transition: "all 0.25s ease",

                "&:hover": unlocked
                    ? {
                          transform: "scale(1.04)",
                          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                      }
                    : {},
            }}
        >
            <Box sx={{ height: 90, display: "flex", alignItems: "center" }}>
                {unlocked ? (
                    <Box
                        component="img"
                        src={nft.image || cookieImg}
                        alt={nft.title}
                        sx={{
                            maxHeight: 80,
                            maxWidth: "100%",
                            objectFit: "contain",
                            transition: "0.25s ease",
                        }}
                    />
                ) : (
                    <Typography fontSize={32}>🔒</Typography>
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