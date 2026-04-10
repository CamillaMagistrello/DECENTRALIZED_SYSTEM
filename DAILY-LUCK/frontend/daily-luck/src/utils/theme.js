import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,

      primary: {
        main: "#f5c542",
      },

      background: {
        default: mode === "dark" ? "#1b1b30" : "#f5f0e6",
        paper: mode === "dark" ? "#24243a" : "#ffffff",
        typography: mode === "dark" ? "#24243a" : "#ffffff",
      },

      custom: {
        header: {
          background: mode === "dark" ? "#0f0f1a" : "#fff7e6",
          text: mode === "dark" ? "#ffffff" : "#2b2b2b",
        },
      },
    },

    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
          },
        },
      },
    },
  });