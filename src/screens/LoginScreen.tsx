import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function LoginScreen({ t }: { t: any }) {
  const nav = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const disabled = !email || !password;

  return (
    <div
      style={{
        padding: "28px 24px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        color: t.text,
      }}
    >
      {/* Back */}
      <button
        onClick={() => nav("/")}
        style={{
          background: "transparent",
          color: t.muted,
          border: "none",
          cursor: "pointer",
          fontSize: 13,
          marginBottom: 10,
          textAlign: "left",
        }}
      >
        ← Back
      </button>

      {/* Title */}
      <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>
        Log in
      </div>
      <div
        style={{
          fontSize: 13,
          color: t.muted,
          marginBottom: 20,
          lineHeight: 1.5,
        }}
      >
        Welcome back. Enter your account details to continue.
      </div>

      {/* Inputs */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Account email"
          style={{
            padding: 14,
            borderRadius: 16,
            border: `1px solid ${t.border}`,
            background: "rgba(255,255,255,0.05)",
            color: t.text,
            outline: "none",
          }}
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          style={{
            padding: 14,
            borderRadius: 16,
            border: `1px solid ${t.border}`,
            background: "rgba(255,255,255,0.05)",
            color: t.text,
            outline: "none",
          }}
        />

        {err && (
          <div style={{ color: "#ff6b6b", fontSize: 13 }}>{err}</div>
        )}

        {/* Continue */}
        <button
          onClick={() => {
            setErr(null);
            const res = login(email);
            if (!res.ok) setErr(res.error);
            else nav("/app");
          }}
          disabled={disabled}
          style={{
            padding: "14px 16px",
            borderRadius: 16,
            border: "none",
            background: disabled ? "rgba(255,255,255,0.15)" : t.accent,
            color: disabled ? "rgba(255,255,255,0.5)" : "#0d1117",
            fontWeight: 900,
            fontSize: 14,
            cursor: disabled ? "not-allowed" : "pointer",
            transition: "all 0.15s",
          }}
        >
          Continue
        </button>

        {/* Switch to signup */}
        <button
          onClick={() => nav("/signup")}
          style={{
            padding: "14px 16px",
            borderRadius: 16,
            border: `1px solid ${t.border}`,
            background: "transparent",
            color: t.text,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Sign up instead
        </button>
      </div>
    </div>
  );
}