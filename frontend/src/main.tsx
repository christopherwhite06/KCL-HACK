import { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getRoomrTheme } from "./theme";
import { THEMES } from "./themes";
import type { Theme } from "./themes";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import AuthStartScreen from "./screens/AuthStartScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupWizardScreen from "./screens/SignupWizardScreen";

function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#080b14" }}>
        <span style={{ color: "#00e5a0", fontSize: 14 }}>Loading…</span>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function HomeRedirect({ t }: { t: Theme }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/app" replace />;
  return <AuthStartScreen t={t} />;
}

function AppRoot() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const muiTheme = useMemo(() => getRoomrTheme(theme), [theme]);
  const t = THEMES[theme];

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomeRedirect t={t} />} />
            <Route path="/login" element={<LoginScreen t={t} />} />
            <Route path="/signup" element={<SignupWizardScreen t={t} />} />
            <Route path="/app" element={<Protected><App theme={theme} setTheme={setTheme} /></Protected>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRoot />
  </StrictMode>
);
