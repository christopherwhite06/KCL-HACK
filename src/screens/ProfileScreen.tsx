import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import type { Theme } from "../themes";

type Props = {
  t: Theme;
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
};

export default function ProfileScreen({ t, theme, setTheme }: Props) {
  const nav = useNavigate();
  const { logout } = useAuth();

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
          ME
        </div>
        <div>
          <div style={{ fontWeight: 700, color: t.text, fontSize: 16 }}>
            Your Profile
          </div>
          <div style={{ fontSize: 12, color: t.textSub }}>
            University of Manchester · 2nd Year
          </div>
        </div>
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

      {/* Logout Button */}
      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => {
            logout();
            nav("/login", { replace: true });
          }}
          style={{
            width: "100%",
            padding: "14px 16px",
            borderRadius: 16,
            border: `1px solid rgba(255,71,87,0.4)`,
            background: "rgba(255,71,87,0.12)",
            color: "#ff4757",
            fontWeight: 900,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}