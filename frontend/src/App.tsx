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

const glassBar = {
  background: "rgba(13,17,23,0.85)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  borderColor: "rgba(255,255,255,0.08)",
};

export default function App() {
  const [screen, setScreen] = useState<NavValue>("home");
  const [discoverMode, setDiscoverMode] = useState<"roommates" | "properties">("roommates");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [matches, setMatches] = useState<Profile[]>([]);
  const [searchLocation, setSearchLocation] = useState<string>("London");

  const t: Theme = THEMES[theme];

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
      {/* Top bar – glass AppBar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          ...glassBar,
          borderBottom: "1px solid",
          borderColor: "rgba(255,255,255,0.08)",
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
            aria-label="Notifications"
            sx={{
              bgcolor: "rgba(0,229,160,0.12)",
              border: "1px solid rgba(0,229,160,0.3)",
              "&:hover": { bgcolor: "rgba(0,229,160,0.18)" },
            }}
          >
            <NotificationsOutlinedIcon fontSize="small" />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main content – full width so map/bars extend; card size is fixed in SwipeScreen */}
      <Box sx={{ flex: 1, minHeight: 0, minWidth: 0, width: "100%", overflow: "hidden" }}>
        {screen === "home" && (
          <SwipeScreen t={t} mode={discoverMode} searchLocation={searchLocation} onMatch={handleMatch} />
        )}
        {screen === "matches" && <MatchesScreen t={t} matches={matches} />}
        {screen === "liked" && <LikedYouScreen t={t} onMatch={() => {}} />}
        {screen === "insights" && <InsightsScreen t={t} />}
        {screen === "profile" && (
          <ProfileScreen t={t} theme={theme} setTheme={setTheme} searchLocation={searchLocation} setSearchLocation={setSearchLocation} />
        )}
      </Box>

      {/* Bottom bar – glass, Roommates | Properties toggle in center */}
      <Box
        sx={{
          flexShrink: 0,
          display: "flex",
          alignItems: "stretch",
          borderTop: "1px solid rgba(255,255,255,0.08)",
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
            color: screen === "home" ? "primary.main" : "rgba(255,255,255,0.45)",
            py: 1.5,
            "&:hover": { bgcolor: "rgba(255,255,255,0.04)" },
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
            color: screen === "matches" ? "primary.main" : "rgba(255,255,255,0.45)",
            py: 1.5,
            "&:hover": { bgcolor: "rgba(255,255,255,0.04)" },
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
              color: discoverMode === "roommates" ? "#0d1117" : "rgba(255,255,255,0.5)",
              bgcolor: discoverMode === "roommates" ? "primary.main" : "rgba(255,255,255,0.06)",
              transition: "all 0.2s",
              "&:hover": {
                bgcolor: discoverMode === "roommates" ? "primary.dark" : "rgba(255,255,255,0.1)",
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
              color: discoverMode === "properties" ? "#0d1117" : "rgba(255,255,255,0.5)",
              bgcolor: discoverMode === "properties" ? "primary.main" : "rgba(255,255,255,0.06)",
              transition: "all 0.2s",
              "&:hover": {
                bgcolor: discoverMode === "properties" ? "primary.dark" : "rgba(255,255,255,0.1)",
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
            color: screen === "insights" ? "primary.main" : "rgba(255,255,255,0.45)",
            py: 1.5,
            "&:hover": { bgcolor: "rgba(255,255,255,0.04)" },
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
            color: screen === "profile" ? "primary.main" : "rgba(255,255,255,0.45)",
            py: 1.5,
            "&:hover": { bgcolor: "rgba(255,255,255,0.04)" },
          }}
        >
          <PersonOutlineIcon sx={{ fontSize: 22 }} />
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em" }}>Profile</span>
        </Box>
      </Box>
    </Box>
  );
}
