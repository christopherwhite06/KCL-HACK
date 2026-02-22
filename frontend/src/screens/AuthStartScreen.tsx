import { useNavigate } from "react-router-dom";
import type { Theme } from "../themes";

export default function AuthStartScreen({ t }: { t: Theme }) {
  const nav = useNavigate();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        height: "100dvh",
        background: t.bg,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px",
        paddingTop: "max(24px, env(safe-area-inset-top))",
        paddingLeft: "max(20px, env(safe-area-inset-left))",
        paddingRight: "max(20px, env(safe-area-inset-right))",
        paddingBottom: "max(24px, env(safe-area-inset-bottom))",
      }}
    >
      <div style={{ width: "100%", maxWidth: 380, color: t.text, textAlign: "center" }}>
        <h1 style={{ margin: 0, fontSize: "clamp(26px, 6vw, 32px)", fontWeight: 900 }}>
          <span style={{ color: t.text }}>room</span>
          <span style={{ color: t.accent }}>r</span>
        </h1>
        <p style={{ color: t.textSub, marginTop: 10, lineHeight: 1.5, fontSize: "clamp(13px, 2.5vw, 15px)" }}>
          Log in if you already have an account, or sign up to create your profile in 5 steps.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 28 }}>
          <button
            onClick={() => nav("/login")}
            style={{
              padding: "16px 20px",
              borderRadius: 16,
              border: "none",
              cursor: "pointer",
              fontWeight: 800,
              background: t.accent,
              color: "#0d1117",
              fontSize: 15,
            }}
          >
            Log in
          </button>

          <button
            onClick={() => nav("/signup")}
            style={{
              padding: "16px 20px",
              borderRadius: 16,
              border: `1px solid ${t.borderStrong}`,
              background: "transparent",
              color: t.text,
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            Sign up
          </button>
        </div>

        <p style={{ color: t.textMuted, marginTop: 24, fontSize: 12 }}>
          Sign up with email; we use Supabase Auth when configured.
        </p>
      </div>
    </div>
  );
}
