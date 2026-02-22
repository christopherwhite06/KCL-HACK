import { useState } from "react";
import { LIKED_YOU } from "../data";
import type { Theme } from "../themes";
import Avatar from "../components/Avatar";

type LikedProfile = typeof LIKED_YOU[number];
type Props = { t: Theme; onConnect: (profile: LikedProfile) => void; connectedIds: number[] };

export default function LikedYouScreen({ t, onConnect, connectedIds }: Props) {
  const [declinedIds, setDeclinedIds] = useState<number[]>([]);

  const visible = LIKED_YOU.filter(p => !connectedIds.includes(p.id) && !declinedIds.includes(p.id));
  const declined = LIKED_YOU.filter(p => declinedIds.includes(p.id));

  const decline = (id: number) => setDeclinedIds(ids => [...ids, id]);

  return (
    <div style={{ padding: "20px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: t.text, marginBottom: 4 }}>Liked You</div>
      <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 20 }}>
        {visible.length > 0 ? `${visible.length} person${visible.length > 1 ? "s" : ""} want to connect` : "You're all caught up!"}
      </div>

      {visible.length === 0 && declined.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: t.textMuted }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>👀</div>
          <div style={{ fontSize: 15, color: t.textSub }}>No one yet</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>Keep swiping — they'll find you!</div>
        </div>
      )}

      {/* Pending connections */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: visible.length && declined.length ? 24 : 0 }}>
        {visible.map(u => (
          <div key={u.id} style={{
            background: t.surface, borderRadius: 20, padding: "16px",
            border: `1px solid ${t.border}`, overflow: "hidden",
          }}>
            {/* Profile row */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
              <div style={{ position: "relative" }}>
                <Avatar initials={u.avatar} color={u.color} size={56} />
                <div style={{
                  position: "absolute", bottom: -2, right: -2,
                  background: t.accentBg, border: `2px solid ${t.card}`,
                  borderRadius: 10, padding: "1px 5px", fontSize: 10, fontWeight: 800, color: t.accent,
                }}>{u.compatibility}%</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, color: t.text, fontSize: 16 }}>{u.name}, {u.age}</div>
                <div style={{ fontSize: 12, color: t.textSub, marginTop: 1 }}>{u.course} · {u.year}</div>
                <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>📍 {u.uni}</div>
              </div>
            </div>

            {/* Bio */}
            <div style={{ background: t.inputBg, borderRadius: 12, padding: "10px 12px", marginBottom: 12 }}>
              <p style={{ margin: 0, fontSize: 12, color: t.textSub, lineHeight: 1.5, fontStyle: "italic" }}>"{u.bio}"</p>
            </div>

            {/* Quick stats */}
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {[
                ["💰", u.budget],
                ["🔋", `EPC ${u.epcGrade}`],
                ["🚶", `${u.commuteMin} min`],
              ].map(([icon, val]) => (
                <div key={String(val)} style={{ flex: 1, background: t.surface, borderRadius: 10, padding: "7px 8px", textAlign: "center", border: `1px solid ${t.border}` }}>
                  <div style={{ fontSize: 12 }}>{icon}</div>
                  <div style={{ fontSize: 10, color: t.textSub, marginTop: 2, fontWeight: 600 }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              {u.tags.map(tag => (
                <span key={tag} style={{ background: `${u.color}20`, border: `1px solid ${u.color}40`, borderRadius: 20, padding: "3px 10px", fontSize: 11, color: t.textSub, fontWeight: 600 }}>{tag}</span>
              ))}
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => decline(u.id)} style={{
                flex: 1, padding: "11px", borderRadius: 14, border: `1px solid rgba(255,71,87,0.3)`,
                background: "rgba(255,71,87,0.08)", color: "#ff4757",
                fontWeight: 700, fontSize: 14, cursor: "pointer",
              }}>✕ Decline</button>
              <button onClick={() => onConnect(u)} style={{
                flex: 2, padding: "11px", borderRadius: 14, border: "none",
                background: t.accent, color: "#0d1117",
                fontWeight: 800, fontSize: 14, cursor: "pointer",
                boxShadow: `0 4px 16px ${t.accent}44`,
              }}>✓ Connect</button>
            </div>
          </div>
        ))}
      </div>

      {/* Declined section */}
      {declined.length > 0 && (
        <div>
          <div style={{ fontSize: 11, color: t.textMuted, letterSpacing: "0.08em", fontWeight: 700, marginBottom: 12 }}>DECLINED</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {declined.map(u => (
              <div key={u.id} style={{
                background: t.surface, borderRadius: 14, padding: "12px 14px",
                display: "flex", alignItems: "center", gap: 12, opacity: 0.5,
                border: `1px solid ${t.border}`,
              }}>
                <Avatar initials={u.avatar} color={u.color} size={36} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: t.text, fontSize: 13 }}>{u.name}</div>
                  <div style={{ fontSize: 11, color: t.textMuted }}>{u.course}</div>
                </div>
                <button onClick={() => setDeclinedIds(ids => ids.filter(id => id !== u.id))} style={{
                  background: "none", border: `1px solid ${t.border}`, borderRadius: 8,
                  padding: "4px 10px", color: t.textMuted, fontSize: 11, cursor: "pointer",
                }}>Undo</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}