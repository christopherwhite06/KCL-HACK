import { useState } from "react";
import SwipeCard from "../components/SwipeCard";
import { PROFILES } from "../data";
import type { Theme } from "../themes";

type Props = { t: Theme; onMatch: (profile: typeof PROFILES[number]) => void };

export default function SwipeScreen({ t, onMatch }: Props) {
  const [cards, setCards] = useState([...PROFILES].reverse());

  const handleSwipe = (id: number, dir: "left" | "right") => {
    const profile = cards.find(p => p.id === id)!;
    if (dir === "right") onMatch(profile);
    setCards(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Card stack */}
      <div style={{ flex: 1, position: "relative", margin: "12px 16px 8px" }}>
        {cards.length === 0 ? (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <div style={{ fontSize: 48 }}>✨</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>You're all caught up!</div>
            <div style={{ fontSize: 13, color: t.textMuted }}>Check back soon for new matches</div>
            <button onClick={() => setCards([...PROFILES].reverse())} style={{ marginTop: 8, background: t.accent, color: "#0d1117", border: "none", borderRadius: 16, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              Refresh ↺
            </button>
          </div>
        ) : (
          cards.map((p, i) => (
            <SwipeCard
              key={p.id}
              profile={p}
              onSwipe={dir => handleSwipe(p.id, dir)}
              zIndex={i}
              offset={cards.length - 1 - i}
              t={t}
            />
          ))
        )}
      </div>

      {/* Action buttons */}
      {cards.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 20, padding: "8px 24px 16px", flexShrink: 0 }}>
          {[
            { icon: "✕", dir: "left" as const, bg: "rgba(255,71,87,0.15)", border: "rgba(255,71,87,0.3)", color: "#ff4757", size: 52 },
            { icon: "⭐", dir: "left" as const, bg: "rgba(116,185,255,0.15)", border: "rgba(116,185,255,0.3)", color: "#74b9ff", size: 44 },
            { icon: "✓", dir: "right" as const, bg: "rgba(0,229,160,0.15)", border: "rgba(0,229,160,0.3)", color: "#00e5a0", size: 52 },
          ].map(({ icon, dir, bg, border, color, size }) => (
            <button key={icon} onClick={() => handleSwipe(cards[cards.length - 1].id, dir)} style={{
              width: size, height: size, borderRadius: "50%",
              background: bg, border: `1.5px solid ${border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: size === 44 ? 16 : 20, color, cursor: "pointer", fontWeight: 700,
              boxShadow: `0 8px 24px ${bg}`, transition: "transform 0.15s",
            }}>{icon}</button>
          ))}
        </div>
      )}
    </div>
  );
}
