import { LIKED_YOU } from "../data";
import type { Theme } from "../themes";
import Avatar from "../components/Avatar";

type Props = { t: Theme; onMatch: (id: number) => void };

export default function LikedYouScreen({ t, onMatch }: Props) {
  return (
    <div style={{ padding: "20px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: t.text, marginBottom: 4 }}>Liked You</div>
      <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 16 }}>{LIKED_YOU.length} people want to connect</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {LIKED_YOU.map(u => (
          <div key={u.id} style={{ background: t.surface, padding: "14px 16px", borderRadius: 18, display: "flex", alignItems: "center", gap: 14, border: `1px solid ${t.border}` }}>
            <Avatar initials={u.avatar} color={u.color} size={52} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: t.text, fontSize: 15 }}>{u.name}, {u.age}</div>
              <div style={{ fontSize: 12, color: t.textSub }}>{u.course} · {u.year}</div>
              <div style={{ fontSize: 11, color: t.textMuted, marginTop: 3 }}>{u.bio}</div>
              <div style={{ fontSize: 11, color: t.accent, marginTop: 4, fontWeight: 600 }}>{u.compatibility}% match</div>
            </div>
            <button onClick={() => onMatch(u.id)} style={{ padding: "8px 14px", borderRadius: 10, border: "none", background: t.accentBg, border2: `1px solid ${t.accentBorder}`, color: t.accent, fontWeight: 600, fontSize: 13, cursor: "pointer" } as React.CSSProperties}>
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
