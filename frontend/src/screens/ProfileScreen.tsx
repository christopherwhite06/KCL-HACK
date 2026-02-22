import { useNavigate } from "react-router-dom";
import type { Theme } from "../themes";
import { useAuth } from "../auth/AuthContext";
import { LOCATION_OPTIONS } from "../lib/scansan";

type Props = {
  t: Theme;
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
  searchLocation: string;
  setSearchLocation: (v: string) => void;
};

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase().slice(0, 2);
  }
  if (parts[0]?.length) return parts[0].slice(0, 2).toUpperCase();
  return "ME";
}

export default function ProfileScreen({ t, theme, setTheme, searchLocation, setSearchLocation }: Props) {
  const nav = useNavigate();
  const { user, logout } = useAuth();
  const profile = user?.profile;

  const displayName = profile?.name?.trim() || "Your Profile";
  const yearLabel =
    profile?.year === "1"
      ? "1st Year"
      : profile?.year === "2"
        ? "2nd Year"
        : profile?.year === "3"
          ? "3rd Year"
          : profile?.year ?? "";
  const subtitle =
    profile?.university && yearLabel
      ? `${profile.university} · ${yearLabel}`
      : profile?.uniEmail
        ? profile.uniEmail
        : user?.email || "Add your details";
  const avatarLetters = profile?.name ? initialsFromName(profile.name) : "ME";

  async function handleLogout() {
    await logout();
    nav("/login", { replace: true });
  }

  return (
    <div
      style={{
        padding: "20px",
        overflowY: "auto",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: t.text,
          marginBottom: 20,
        }}
      >
        Profile & Settings
      </div>

      {/* Avatar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
          background: t.surface,
          borderRadius: 18,
          padding: 16,
          border: `1px solid ${t.border}`,
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 18,
            background: "linear-gradient(135deg, #00e5a0, #74b9ff)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            fontWeight: 800,
            color: "white",
          }}
        >
          {avatarLetters}
        </div>
        <div>
          <div style={{ fontWeight: 700, color: t.text, fontSize: 16 }}>
            {displayName}
          </div>
          <div style={{ fontSize: 12, color: t.textSub }}>
            {subtitle}
          </div>
        </div>
      </div>

      {/* Search location – where to load properties to rent */}
      <div style={{ background: t.surface, borderRadius: 16, padding: 16, marginBottom: 12, border: `1px solid ${t.border}` }}>
        <div style={{ fontWeight: 600, color: t.text, fontSize: 14, marginBottom: 8 }}>Property search location</div>
        <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 10 }}>Where to show properties for rent (London areas)</div>
        <select
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 10,
            border: `1px solid ${t.border}`,
            background: t.bg,
            color: t.text,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          {LOCATION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Theme toggle */}
      <div
        style={{
          background: t.surface,
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          border: `1px solid ${t.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontWeight: 600, color: t.text, fontSize: 14 }}>
            Theme
          </div>
          <div style={{ fontSize: 12, color: t.textMuted }}>
            Switch appearance
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {(["dark", "light"] as const).map((th) => (
            <button
              key={th}
              onClick={() => setTheme(th)}
              style={{
                padding: "6px 14px",
                borderRadius: 10,
                border: `1px solid ${t.border}`,
                background: theme === th ? t.accentBg : "transparent",
                color: theme === th ? t.accent : t.textSub,
                fontWeight: 600,
                fontSize: 12,
                cursor: "pointer",
                borderColor: theme === th ? t.accentBorder : t.border,
              }}
            >
              {th === "dark" ? "🌙 Dark" : "☀️ Light"}
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div
        style={{
          background: t.surface,
          borderRadius: 14,
          padding: "14px 16px",
          marginBottom: 10,
          border: `1px solid ${t.border}`,
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: 12,
            border: `1px solid ${t.border}`,
            background: "transparent",
            color: "#f87171",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Log out
        </button>
      </div>

      {/* Placeholder settings */}
      {["Edit Preferences", "Notifications", "Privacy", "About Roomr"].map(
        (item) => (
          <div
            key={item}
            style={{
              background: t.surface,
              borderRadius: 14,
              padding: "14px 16px",
              marginBottom: 10,
              border: `1px solid ${t.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                color: t.text,
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              {item}
            </span>
            <span style={{ color: t.textMuted }}>›</span>
          </div>
        )
      )}

    </div>
  );
}