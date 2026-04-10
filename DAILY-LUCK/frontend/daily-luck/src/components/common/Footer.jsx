import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";

function Footer() {
    const [open, setOpen] = useState(false);

    return (
        <Box
            component="footer"
            sx={{
                mt: 6,
                py: 3,
                borderTop: "1px solid #e0e0e0",
                textAlign: "center",
            }}
        >
        <Button
            variant="text"
            onClick={() => setOpen(!open)}
            sx={{ textTransform: "none" }}
        >
            Credits
        </Button>

        <Collapse in={open}>
            <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                    Daily Luck dApp — built with React, Solidity & questionable life choices.
                </Typography>

                <Typography variant="caption" color="text.secondary">
                    © {new Date().getFullYear()}
                </Typography>
            </Box>
        </Collapse>
        </Box>
    );
}

export default Footer;