import { createTheme } from "@mui/material/styles";

/**
 * Roomr brand theme for MUI – professional real estate / roommate matching.
 * Keeps roomr colour scheme: dark bg #080b14, accent #00e5a0.
 */
export const roomrTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00e5a0",
      light: "rgba(0,229,160,0.2)",
      dark: "#00b87a",
      contrastText: "#0d1117",
    },
    background: {
      default: "#080b14",
      paper: "#0d1117",
    },
    divider: "rgba(255,255,255,0.06)",
    text: {
      primary: "#ffffff",
      secondary: "rgba(255,255,255,0.55)",
      disabled: "rgba(255,255,255,0.3)",
    },
    action: {
      active: "#00e5a0",
      hover: "rgba(255,255,255,0.08)",
      selected: "rgba(0,229,160,0.12)",
    },
  },
  typography: {
    fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
    h6: { fontWeight: 700 },
    button: { fontWeight: 600, textTransform: "uppercase" as const },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#0d1117",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "none",
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: "#0d1117",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          height: 64,
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: "rgba(255,255,255,0.5)",
          minWidth: 64,
          "&.Mui-selected": {
            color: "#00e5a0",
          },
        },
        label: {
          fontSize: "0.7rem",
          fontWeight: 600,
          letterSpacing: "0.08em",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "rgba(255,255,255,0.7)",
          "&:hover": {
            backgroundColor: "rgba(0,229,160,0.12)",
            color: "#00e5a0",
          },
        },
      },
    },
  },
});
