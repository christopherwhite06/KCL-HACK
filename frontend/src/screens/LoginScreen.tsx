import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import type { Theme } from "../themes";

export default function LoginScreen({ t }: { t: Theme }) {
  const nav = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const disabled = !email || !password || submitting;

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
      <div style={{ width: "100%", maxWidth: 380 }}>
        {/* Back */}
        <button
          onClick={() => nav("/")}
          style={{
            background: "transparent",
            color: t.textMuted,
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            marginBottom: 16,
            padding: 4,
          }}
        >
          ← Back
        </button>

        {/* Title */}
        <div style={{ fontSize: "clamp(20px, 5vw, 24px)", fontWeight: 900, marginBottom: 6, color: t.text }}>
          Log in
        </div>
        <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 22, lineHeight: 1.5 }}>
          Welcome back. Enter your account details to continue.
        </div>

        {/* Inputs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Account email"
            type="email"
            autoComplete="email"
            style={{
              padding: "14px 16px",
              borderRadius: 16,
              border: `1px solid ${t.border}`,
              background: t.inputBg,
              color: t.text,
              outline: "none",
              fontSize: 16,
            }}
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            autoComplete="current-password"
            style={{
              padding: "14px 16px",
              borderRadius: 16,
              border: `1px solid ${t.border}`,
              background: t.inputBg,
              color: t.text,
              outline: "none",
              fontSize: 16,
            }}
          />

          {err && (
            <div style={{ color: "#ff6b6b", fontSize: 13 }}>{err}</div>
          )}

          <button
            onClick={async () => {
              setErr(null);
              setSubmitting(true);
              const res = await login(email, password);
              setSubmitting(false);
              if (!res.ok) setErr(res.error);
              else nav("/app");
            }}
            disabled={disabled}
            style={{
              padding: "16px 20px",
              borderRadius: 16,
              border: "none",
              background: disabled ? "rgba(255,255,255,0.15)" : t.accent,
              color: disabled ? "rgba(255,255,255,0.5)" : "#0d1117",
              fontWeight: 900,
              fontSize: 15,
              cursor: disabled ? "not-allowed" : "pointer",
              transition: "all 0.15s",
            }}
          >
            Continue
          </button>

          <button
            onClick={() => nav("/signup")}
            style={{
              padding: "16px 20px",
              borderRadius: 16,
              border: `1px solid ${t.border}`,
              background: "transparent",
              color: t.text,
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Sign up instead
          </button>
        </div>
      </div>
    </div>
  );
}