import { useState } from "react";
import { THEMES } from "./themes";
import { PROFILES, LIKED_YOU } from "./data";
import SwipeScreen from "./screens/SwipeScreen";
import MatchesScreen from "./screens/MatchesScreen";
import LikedYouScreen from "./screens/LikedYouScreen";
import InsightsScreen from "./screens/InsightsScreen";
import ProfileScreen from "./screens/ProfileScreen";

type Page = "swipe" | "matches" | "liked" | "insights" | "profile";
type Profile = typeof PROFILES[number];
type LikedProfile = typeof LIKED_YOU[number];

const TABS: { id: Page; icon: string; label: string }[] = [
  { id: "swipe",    icon: "🔥", label: "Discover"  },
  { id: "matches",  icon: "💬", label: "Matches"   },
  { id: "liked",    icon: "👀", label: "Liked You" },
  { id: "insights", icon: "📊", label: "Insights"  },
  { id: "profile",  icon: "👤", label: "Profile"   },
];

export default function App() {
  const [themeName, setThemeName] = useState<"dark" | "light">("dark");
  const t = THEMES[themeName];
  const [page, setPage] = useState<Page>("swipe");
  const [matches, setMatches] = useState<Profile[]>([]);
  const [showMatch, setShowMatch] = useState<Profile | null>(null);
  const [connectedIds, setConnectedIds] = useState<number[]>([]);

  const handleMatch = (profile: Profile) => {
    if (profile.compatibility > 70) {
      setMatches(m => [...m, profile]);
      setShowMatch(profile);
      setTimeout(() => setShowMatch(null), 2500);
    }
  };

  const handleConnect = (profile: LikedProfile) => {
    setConnectedIds(ids => [...ids, profile.id]);
    setMatches(m => [...m, profile as unknown as Profile]);
    setShowMatch(profile as unknown as Profile);
    setTimeout(() => {
      setShowMatch(null);
      setPage("matches");
    }, 2000);
  };

  const likedYouCount = LIKED_YOU.filter(p => !connectedIds.includes(p.id)).length;

  return (
    <div style={{
      background: t.bg, minHeight: "100vh",
      display: "flex", justifyContent: "center", alignItems: "center",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>
      <div style={{
        width: "min(400px, 100vw)", height: "min(820px, 100vh)",
        background: t.card, borderRadius: 36,
        display: "flex", flexDirection: "column", overflow: "hidden",
        position: "relative", boxShadow: t.shadow,
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px 12px", display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: `1px solid ${t.border}`, flexShrink: 0, background: t.headerBg,
        }}>
          <div>
            <span style={{ fontSize: 22, fontWeight: 900, color: t.text, letterSpacing: -0.5 }}>room</span>
            <span style={{ fontSize: 22, fontWeight: 900, color: t.accent, letterSpacing: -0.5 }}>r</span>
          </div>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: t.accentBg, border: `1px solid ${t.accentBorder}`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
          }}>🔔</div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
          {page === "swipe"    && <SwipeScreen t={t} onMatch={handleMatch} />}
          {page === "matches"  && <MatchesScreen t={t} matches={matches} />}
          {page === "liked"    && <LikedYouScreen t={t} onConnect={handleConnect} connectedIds={connectedIds} />}
          {page === "insights" && <InsightsScreen t={t} />}
          {page === "profile"  && <ProfileScreen t={t} theme={themeName} setTheme={setThemeName} />}
        </div>

        {/* Match celebration overlay */}
        {showMatch && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.92)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 16, borderRadius: 36,
          }}>
            <div style={{ fontSize: 64 }}>🎉</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: t.accent }}>It's a Match!</div>
            <div style={{ fontSize: 16, color: "rgba(255,255,255,0.75)" }}>You and {showMatch.name} connected</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{showMatch.compatibility}% compatibility</div>
            <div style={{ fontSize: 12, color: t.accent, marginTop: 4, opacity: 0.7 }}>Taking you to messages…</div>
          </div>
        )}

        {/* Bottom nav */}
        <div style={{ display: "flex", borderTop: `1px solid ${t.border}`, background: t.navBg, flexShrink: 0 }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setPage(tab.id)} style={{
              flex: 1, padding: "12px 0 14px", background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              opacity: page === tab.id ? 1 : 0.35, transition: "opacity 0.2s",
              position: "relative",
            }}>
              <span style={{ fontSize: 18, lineHeight: 1 }}>{tab.icon}</span>
              <span style={{ fontSize: 9, letterSpacing: "0.08em", fontWeight: 600, color: page === tab.id ? t.accent : t.text }}>
                {tab.label.toUpperCase()}
              </span>
              {/* Badge for matches */}
              {tab.id === "matches" && matches.length > 0 && (
                <div style={{ position: "absolute", top: 8, right: "22%", width: 16, height: 16, borderRadius: "50%", background: t.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#0d1117" }}>
                  {matches.length}
                </div>
              )}
              {/* Badge for liked you */}
              {tab.id === "liked" && likedYouCount > 0 && (
                <div style={{ position: "absolute", top: 8, right: "18%", width: 16, height: 16, borderRadius: "50%", background: "#ff4757", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "white" }}>
                  {likedYouCount}
                </div>
              )}
              {page === tab.id && <div style={{ width: 4, height: 4, borderRadius: 2, background: t.accent, marginTop: -2 }} />}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.2); border-radius: 4px; }
      `}</style>
    </div>
  );
}