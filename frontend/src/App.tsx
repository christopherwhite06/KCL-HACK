import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ApartmentIcon from "@mui/icons-material/Apartment";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { THEMES } from "./themes";
import type { Theme } from "./themes";
import { PROFILES } from "./data";
import SwipeScreen from "./screens/SwipeScreen";
import MatchesScreen from "./screens/MatchesScreen";
import LikedYouScreen from "./screens/LikedYouScreen";
import InsightsScreen from "./screens/InsightsScreen";
import ProfileScreen from "./screens/ProfileScreen";

type Profile = (typeof PROFILES)[number];

type NavValue = "home" | "matches" | "liked" | "insights" | "profile";

export default function App({
  theme,
  setTheme,
}: {
  theme: "dark" | "light";
  setTheme: (v: "dark" | "light") => void;
}) {
  const [screen, setScreen] = useState<NavValue>("home");
  const [discoverMode, setDiscoverMode] = useState<"roommates" | "properties">("roommates");
  const [matches, setMatches] = useState<Profile[]>([]);
  const [searchLocation, setSearchLocation] = useState<string>("London");

  const t: Theme = THEMES[theme];

  const glassBar = {
    background: theme === "dark" ? "rgba(13,17,23,0.85)" : "rgba(255,255,255,0.9)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderColor: theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
  };

  const handleMatch = (profile: Profile) => {
    setMatches((prev) => [...prev, profile]);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        height: "100vh",
        minHeight: "100vh",
        bgcolor: "background.default",
        overflow: "hidden",
      }}
    >
      {/* Top bar – glass AppBar; theme toggle on main page (visible in header) */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          ...glassBar,
          borderBottom: "1px solid",
          borderColor: t.borderStrong,
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        <Toolbar disableGutters sx={{ px: 2, py: 0.5, minHeight: { xs: 56 }, width: "100%" }}>
          <Typography
            component="span"
            variant="h6"
            sx={{ fontWeight: 900, letterSpacing: -0.5, fontSize: "1.35rem" }}
          >
            <Box component="span" sx={{ color: "text.primary" }}>room</Box>
            <Box component="span" sx={{ color: "primary.main" }}>r</Box>
          </Typography>
          <Box sx={{ flex: 1 }} />
          <IconButton
            size="medium"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            sx={{
              bgcolor: t.accentBg,
              border: `1px solid ${t.accentBorder}`,
              color: t.accent,
              mr: 1,
              "&:hover": { bgcolor: theme === "dark" ? "rgba(0,229,160,0.18)" : "rgba(0,196,140,0.18)" },
            }}
          >
            {theme === "dark" ? (
              <LightModeIcon fontSize="small" />
            ) : (
              <DarkModeIcon fontSize="small" />
            )}
          </IconButton>
          <IconButton
            size="medium"
            aria-label="Notifications"
            sx={{
              bgcolor: t.accentBg,
              border: `1px solid ${t.accentBorder}`,
              "&:hover": { bgcolor: theme === "dark" ? "rgba(0,229,160,0.18)" : "rgba(0,196,140,0.18)" },
            }}
          >
            <NotificationsOutlinedIcon fontSize="small" />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main content – full width so map/bars extend; card size is fixed in SwipeScreen */}
      <Box sx={{ flex: 1, minHeight: 0, minWidth: 0, width: "100%", overflow: "hidden" }}>
        {screen === "home" && (
          <SwipeScreen t={t} theme={theme} mode={discoverMode} searchLocation={searchLocation} onMatch={handleMatch} />
        )}
        {screen === "matches" && <MatchesScreen t={t} matches={matches} />}
        {screen === "liked" && <LikedYouScreen t={t} onMatch={() => {}} />}
        {screen === "insights" && <InsightsScreen t={t} />}
        {screen === "profile" && (
          <ProfileScreen t={t} theme={theme} setTheme={setTheme} searchLocation={searchLocation} setSearchLocation={setSearchLocation} />
        )}
      </Box>

      {/* Bottom bar – glass, theme-aware */}
      <Box
        sx={{
          flexShrink: 0,
          display: "flex",
          alignItems: "stretch",
          borderTop: `1px solid ${t.borderStrong}`,
          ...glassBar,
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          minHeight: 64,
        }}
      >
        <Box
          component="button"
          onClick={() => setScreen("home")}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            bgcolor: "transparent",
            border: "none",
            cursor: "pointer",
            color: screen === "home" ? "primary.main" : t.textMuted,
            py: 1.5,
            "&:hover": { bgcolor: t.surfaceHover },
          }}
        >
          <HomeOutlinedIcon sx={{ fontSize: 22 }} />
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em" }}>Home</span>
        </Box>

        <Box
          component="button"
          onClick={() => setScreen("matches")}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            bgcolor: "transparent",
            border: "none",
            cursor: "pointer",
            color: screen === "matches" ? "primary.main" : t.textMuted,
            py: 1.5,
            "&:hover": { bgcolor: t.surfaceHover },
          }}
        >
          <PeopleOutlineIcon sx={{ fontSize: 22 }} />
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em" }}>Matches</span>
        </Box>

        {/* Center: Roommates | Properties – icon-only toggle */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            py: 1.5,
          }}
        >
          <Box
            component="button"
            onClick={() => setDiscoverMode("roommates")}
            aria-label="Roommates"
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: discoverMode === "roommates" ? "primary.contrastText" : t.textSub,
              bgcolor: discoverMode === "roommates" ? "primary.main" : t.surface,
              transition: "all 0.2s",
              "&:hover": {
                bgcolor: discoverMode === "roommates" ? "primary.dark" : t.surfaceHover,
              },
            }}
          >
            <PeopleOutlineIcon sx={{ fontSize: 22 }} />
          </Box>
          <Box
            component="button"
            onClick={() => setDiscoverMode("properties")}
            aria-label="Properties"
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: discoverMode === "properties" ? "primary.contrastText" : t.textSub,
              bgcolor: discoverMode === "properties" ? "primary.main" : t.surface,
              transition: "all 0.2s",
              "&:hover": {
                bgcolor: discoverMode === "properties" ? "primary.dark" : t.surfaceHover,
              },
            }}
          >
            <ApartmentIcon sx={{ fontSize: 22 }} />
          </Box>
        </Box>

        <Box
          component="button"
          onClick={() => setScreen("insights")}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            bgcolor: "transparent",
            border: "none",
            cursor: "pointer",
            color: screen === "insights" ? "primary.main" : t.textMuted,
            py: 1.5,
            "&:hover": { bgcolor: t.surfaceHover },
          }}
        >
          <InsightsOutlinedIcon sx={{ fontSize: 22 }} />
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em" }}>Insights</span>
        </Box>

        <Box
          component="button"
          onClick={() => setScreen("profile")}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            bgcolor: "transparent",
            border: "none",
            cursor: "pointer",
            color: screen === "profile" ? "primary.main" : t.textMuted,
            py: 1.5,
            "&:hover": { bgcolor: t.surfaceHover },
          }}
        >
          <PersonOutlineIcon sx={{ fontSize: 22 }} />
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em" }}>Profile</span>
        </Box>
      </Box>
    </Box>
  );
}
