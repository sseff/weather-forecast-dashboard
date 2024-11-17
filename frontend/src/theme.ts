// src/theme.ts

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light", // Change to 'dark' for dark mode
    primary: {
      main: "#1976d2", // Blue
    },
    secondary: {
      main: "#f50057", // Pink
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h5: {
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

export default theme;
