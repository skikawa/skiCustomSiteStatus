import { createTheme } from "@mui/material/styles";

const primaryColor = "#3b5bdb";
const secondaryColor = "#4b5563";
const backgroundColor = "#f4f2eb";
const cardColor = "#fcfbf8";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: primaryColor,
      light: "#60a5fa",
      dark: "#1d4ed8",
      container: "#dbeafe",
    },
    secondary: {
      main: secondaryColor,
      light: "#2dd4bf",
      dark: "#115e59",
      container: "#ccfbf1",
    },
    background: {
      default: backgroundColor,
      paper: cardColor,
    },
    text: {
      primary: "#111827",
      secondary: "#6b7280",
    },
    divider: "#e7e2d8",
  },
  typography: {
    fontFamily: '"Inter", "Noto Sans SC", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.1px",
      fontSize: "0.875rem",
    },
    h3: {
      fontWeight: 700,
      letterSpacing: "-0.6px",
    },
    h6: {
      fontWeight: 700,
      letterSpacing: "-0.15px",
    },
    body1: {
      letterSpacing: "0.1px",
      lineHeight: 1.55,
    },
    body2: {
      letterSpacing: "0.05px",
      lineHeight: 1.5,
    },
    caption: {
      letterSpacing: "0.2px",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#fcfbf8",
          color: "#111827",
          boxShadow: "none",
          borderBottom: "1px solid #e7e2d8",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          border: "1px solid #e7e2d8",
          boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
          transition: "none",
          "&:hover": {
            transform: "none",
            boxShadow: "0 1px 2px rgba(15, 23, 42, 0.06)",
            borderColor: "#d8d2c8",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "7px 18px",
          boxShadow: "none",
          textTransform: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
          fontSize: "0.75rem",
          padding: "3px 8px",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#111827",
          color: "#ffffff",
          fontSize: "0.75rem",
          borderRadius: 8,
          padding: "8px 10px",
          boxShadow: "none",
        },
        arrow: {
          color: "#111827",
        },
      },
    },
  },
});

export default theme;
