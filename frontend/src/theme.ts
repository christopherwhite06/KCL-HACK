import { createTheme } from "@mui/material/styles";

const darkPalette = {
  mode: "dark" as const,
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
};

const lightPalette = {
  mode: "light" as const,
  primary: {
    main: "#00c48c",
    light: "rgba(0,196,140,0.2)",
    dark: "#00a070",
    contrastText: "#0d1117",
  },
  background: {
    default: "#f0f4f8",
    paper: "#ffffff",
  },
  divider: "rgba(0,0,0,0.07)",
  text: {
    primary: "#0d1117",
    secondary: "rgba(0,0,0,0.55)",
    disabled: "rgba(0,0,0,0.35)",
  },
  action: {
    active: "#00c48c",
    hover: "rgba(0,0,0,0.04)",
    selected: "rgba(0,196,140,0.1)",
  },
};

/**
 * Roomr MUI theme – dark or light. Use in ThemeProvider so all MUI components and
 * palette (background.default, text.primary, etc.) switch with mode.
 */
export function getRoomrTheme(mode: "dark" | "light") {
  return createTheme({
    palette: mode === "dark" ? darkPalette : lightPalette,
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
            backgroundColor: mode === "dark" ? "#0d1117" : "#ffffff",
            borderBottom: mode === "dark" ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.08)",
            boxShadow: "none",
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: mode === "dark" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
            "&:hover": {
              backgroundColor: mode === "dark" ? "rgba(0,229,160,0.12)" : "rgba(0,196,140,0.1)",
              color: mode === "dark" ? "#00e5a0" : "#00c48c",
            },
          },
        },
      },
    },
  });
}

/** Default export for backward compatibility – dark theme. */
export const roomrTheme = getRoomrTheme("dark");
