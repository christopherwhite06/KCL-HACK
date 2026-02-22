import type { Theme } from "../themes";
import { PROFILES } from "../data";
import Avatar from "../components/Avatar";

type Profile = typeof PROFILES[number];
type Props = { t: Theme; matches: Profile[] };

export default function MatchesScreen({ t, matches }: Props) {
  return (
    <div style={{ padding: "20px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: t.text, marginBottom: 16 }}>Your Matches</div>
      {matches.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: t.textMuted }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
          <div>No matches yet — keep swiping!</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {matches.map(m => (
            <div key={m.id} style={{ background: t.surface, borderRadius: 18, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, border: `1px solid ${t.border}` }}>
              <Avatar initials={m.avatar} color={m.color} size={48} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: t.text, fontSize: 15 }}>{m.name}</div>
                <div style={{ fontSize: 12, color: t.textSub }}>{m.compatibility}% compatible · {m.course}</div>
              </div>
              <button style={{ background: t.accentBg, border: `1px solid ${t.accentBorder}`, borderRadius: 10, padding: "8px 14px", color: t.accent, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                Message
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
