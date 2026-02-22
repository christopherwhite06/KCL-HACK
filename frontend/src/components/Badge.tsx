type BadgeProps = { icon: string; label: string; sub: string; good: boolean };

export default function Badge({ icon, label, sub, good }: BadgeProps) {
  return (
    <div style={{
      background: good ? "rgba(0,229,160,0.1)" : "rgba(255,107,107,0.1)",
      border: `1px solid ${good ? "rgba(0,229,160,0.25)" : "rgba(255,107,107,0.25)"}`,
      borderRadius: 12, padding: "8px 12px",
      display: "flex", alignItems: "center", gap: 8, flex: 1,
    }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: good ? "#00e5a0" : "#ff6b6b" }}>{label}</div>
        <div style={{ fontSize: 10, color: "rgba(128,128,128,0.7)" }}>{sub}</div>
      </div>
    </div>
  );
}
