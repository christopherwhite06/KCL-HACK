import { useNavigate } from "react-router-dom";


export default function AuthStartScreen({ t }: { t: any }) {
  const nav = useNavigate();

  return (
    <div style={{ padding: 20, color: "white" }}>
      <h1 style={{ margin: 0, fontSize: 28 }}>roomr</h1>
      <p style={{ opacity: 0.7, marginTop: 8, lineHeight: 1.5 }}>
        Log in if you already have an account, or sign up to create your profile in 5 steps.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
        <button
          onClick={() => nav("/login")}
          style={{ padding: "12px 14px", borderRadius: 12, border: "none", cursor: "pointer", fontWeight: 700 }}
        >
          Log in
        </button>

        <button
          onClick={() => nav("/signup")}
          style={{
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.2)",
            background: "transparent",
            color: "white",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Sign up
        </button>
      </div>

      <p style={{ opacity: 0.5, marginTop: 14, fontSize: 12 }}>
        Demo auth (localStorage). Later we’ll replace with Firebase.
      </p>
    </div>
  );
}