
import React, { useRef, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { THEMES } from "./themes";
import { PROFILES } from "./data";
import { useAuth } from "./auth/AuthContext";

import SwipeScreen from "./screens/SwipeScreen";
import MatchesScreen from "./screens/MatchesScreen";
import LikedYouScreen from "./screens/LikedYouScreen";
import InsightsScreen from "./screens/InsightsScreen";
import AnnouncementsScreen from "./screens/AnnouncementsScreen";
import ProfileScreen from "./screens/ProfileScreen";

import AuthStartScreen from "./screens/AuthStartScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupWizardScreen from "./screens/SignupWizardScreen";

type Page = "swipe" | "matches" | "liked" | "insights" | "announcements" | "profile";
type Profile = typeof PROFILES[number];

const TABS: { id: Page; icon: string; label: string }[] = [
  { id: "swipe", icon: "🔥", label: "Discover" },
  { id: "matches", icon: "💬", label: "Matches" },
  { id: "liked", icon: "👀", label: "Liked You" },
  { id: "insights", icon: "📊", label: "Insights" },
  { id: "announcements", icon: "📢", label: "Updates" },
  { id: "profile", icon: "👤", label: "Profile" },
];

/** Reusable phone shell (same layout for auth + main app) */
function PhoneShell({
  t,
  children,
  headerRight,
}: {
  t: any;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: t.bg,
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          width: "min(400px, 100vw)",
          height: "min(820px, 100vh)",
          background: t.card,
          borderRadius: 36,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
          boxShadow: t.shadow,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${t.border}`,
            flexShrink: 0,
            background: t.headerBg,
          }}
        >
          <div>
            <span style={{ fontSize: 22, fontWeight: 900, color: t.text }}>room</span>
            <span style={{ fontSize: 22, fontWeight: 900, color: t.accent }}>r</span>
          </div>

          {headerRight ?? (
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: t.accentBg,
                border: `1px solid ${t.accentBorder}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
              }}
            >
              🔔
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>{children}</div>
      </div>
    </div>
  );
}

function RoomrAppShell({
  t,
  themeName,
  setThemeName,
}: {
  t: any;
  themeName: "dark" | "light";
  setThemeName: (v: "dark" | "light") => void;
}) {
  const [page, setPage] = useState<Page>("swipe");
  const [matches, setMatches] = useState<Profile[]>([]);
  const [showMatch, setShowMatch] = useState<Profile | null>(null);

  // ✅ Toast (minimal add)
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3000);
  };

  const handleMatch = (profile: Profile) => {
    if (profile.compatibility > 70) {
      setMatches((m) => [...m, profile]);
      setShowMatch(profile);
      setTimeout(() => setShowMatch(null), 2500);
    }
  };

  return (
    <>
      {/* Page content */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
          {page === "swipe" && <SwipeScreen t={t} onMatch={handleMatch} />}
          {page === "matches" && <MatchesScreen t={t} matches={matches} />}
          {page === "liked" && <LikedYouScreen t={t} onMatch={() => {}} />}

          {/* ✅ updated screens */}
          {page === "insights" && <InsightsScreen t={t} showToast={showToast} />}
          {page === "announcements" && <AnnouncementsScreen showToast={showToast} />}

          {page === "profile" && (
            <ProfileScreen t={t} theme={themeName} setTheme={setThemeName} />
          )}
        </div>

        {/* Bottom Nav */}
        <div
          style={{
            display: "flex",
            borderTop: `1px solid ${t.border}`,
            background: t.navBg,
            flexShrink: 0,
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPage(tab.id)}
              style={{
                flex: 1,
                padding: "12px 0 14px",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                opacity: page === tab.id ? 1 : 0.35,
              }}
            >
              <span style={{ fontSize: 18 }}>{tab.icon}</span>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  color: page === tab.id ? t.accent : t.text,
                }}
              >
                {tab.label.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ✅ Toast overlay */}
      {toast && (
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: 16,
            right: 16,
            background: "rgba(0,229,160,0.15)",
            border: "1px solid rgba(0,229,160,0.35)",
            borderRadius: 12,
            padding: "10px 16px",
            fontSize: 12,
            fontWeight: 600,
            color: "#00e5a0",
            textAlign: "center",
            zIndex: 150,
            backdropFilter: "blur(8px)",
          }}
        >
          {toast}
        </div>
      )}

      {/* Match Overlay */}
      {showMatch && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 100,
            background: "rgba(0,0,0,0.88)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            borderRadius: 36,
          }}
        >
          <div style={{ fontSize: 60 }}>🎉</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: t.accent }}>It's a Match!</div>
          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.7)" }}>
            You and {showMatch.name} connected
          </div>
        </div>
      )}
    </>
  );
}

function Protected({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  // One theme for everything
  const [themeName, setThemeName] = useState<"dark" | "light">("dark");
  const t = THEMES[themeName];

  return (
    <Routes>
      {/* Always show auth start first */}
      <Route
        path="/"
        element={
          <PhoneShell t={t}>
            <AuthStartScreen t={t} />
          </PhoneShell>
        }
      />

      {/* Auth pages */}
      <Route
        path="/login"
        element={
          <PhoneShell t={t}>
            <LoginScreen t={t} />
          </PhoneShell>
        }
      />

      <Route
        path="/signup"
        element={
          <PhoneShell t={t}>
            <SignupWizardScreen t={t} />
          </PhoneShell>
        }
      />

      {/* Main app (protected) */}
      <Route
        path="/app"
        element={
          <Protected>
            <PhoneShell t={t}>
              <RoomrAppShell t={t} themeName={themeName} setThemeName={setThemeName} />
            </PhoneShell>
          </Protected>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}