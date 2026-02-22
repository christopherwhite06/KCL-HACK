import { useState, useRef } from "react";
import Avatar from "./Avatar";
import ScoreRing from "./ScoreRing";
import Badge from "./Badge";
import { EPC_COLORS, PROFILES } from "../data";
import type { Theme } from "../themes";

type Profile = typeof PROFILES[number];
type SwipeCardProps = {
  profile: Profile;
  onSwipe: (dir: "left" | "right") => void;
  zIndex: number;
  offset: number;
  t: Theme;
};

export default function SwipeCard({ profile, onSwipe, zIndex, offset, t }: SwipeCardProps) {
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [tab, setTab] = useState<"profile" | "property" | "data">("profile");
  const startRef = useRef<{ x: number; y: number } | null>(null);

  const handleStart = (x: number, y: number) => { startRef.current = { x, y }; setDragging(true); };
  const handleMove = (x: number, y: number) => {
    if (!dragging || !startRef.current) return;
    setPos({ x: x - startRef.current.x, y: y - startRef.current.y });
  };
  const handleEnd = () => {
    setDragging(false);
    if (Math.abs(pos.x) > 100) onSwipe(pos.x > 0 ? "right" : "left");
    else setPos({ x: 0, y: 0 });
  };

  const rotation = pos.x * 0.08;
  const likeOp = Math.max(0, Math.min(1, pos.x / 80));
  const nopeOp = Math.max(0, Math.min(1, -pos.x / 80));
  const epcColor = EPC_COLORS[profile.epcGrade] || "#fff";

  return (
    <div
      onMouseDown={e => handleStart(e.clientX, e.clientY)}
      onMouseMove={e => handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd} onMouseLeave={handleEnd}
      onTouchStart={e => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={e => { e.preventDefault(); handleMove(e.touches[0].clientX, e.touches[0].clientY); }}
      onTouchEnd={handleEnd}
      style={{
        position: "absolute", width: "100%", height: "100%",
        transform: `translateX(calc(${pos.x}px + ${offset * 8}px)) translateY(${offset * 6}px) rotate(${rotation + offset * 2}deg) scale(${1 - offset * 0.04})`,
        transition: dragging ? "none" : "transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275)",
        cursor: dragging ? "grabbing" : "grab",
        zIndex, userSelect: "none", touchAction: "none",
        borderRadius: 24,
        background: t.swipeCard,
        border: `1px solid ${t.border}`,
        boxShadow: t.shadow,
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}
    >
      {/* LIKE / NOPE overlays */}
      <div style={{ position: "absolute", top: 24, left: 24, zIndex: 10, opacity: likeOp, transform: "rotate(-20deg)", border: "3px solid #00e5a0", borderRadius: 8, padding: "4px 14px", color: "#00e5a0", fontWeight: 900, fontSize: 22, letterSpacing: 2, pointerEvents: "none" }}>MATCH</div>
      <div style={{ position: "absolute", top: 24, right: 24, zIndex: 10, opacity: nopeOp, transform: "rotate(20deg)", border: "3px solid #ff4757", borderRadius: 8, padding: "4px 14px", color: "#ff4757", fontWeight: 900, fontSize: 22, letterSpacing: 2, pointerEvents: "none" }}>PASS</div>

      {/* Header */}
      <div style={{
        padding: "24px 20px 16px", display: "flex", alignItems: "center", gap: 14,
        background: `linear-gradient(135deg, ${profile.color}22, transparent)`,
        borderBottom: `1px solid ${t.border}`, flexShrink: 0,
      }}>
        <Avatar initials={profile.avatar} color={profile.color} size={60} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 19, fontWeight: 800, color: t.text }}>{profile.name}</span>
            <span style={{ fontSize: 14, color: t.textMuted }}>{profile.age}</span>
          </div>
          <div style={{ fontSize: 12, color: t.textSub, marginTop: 2 }}>{profile.course} · {profile.year}</div>
          <div style={{ fontSize: 11, color: t.textMuted, marginTop: 1 }}>📍 {profile.uni}</div>
        </div>
        <div style={{ background: t.accentBg, border: `1px solid ${t.accentBorder}`, borderRadius: 12, padding: "8px 12px", textAlign: "center", flexShrink: 0 }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: t.accent }}>{profile.compatibility}%</div>
          <div style={{ fontSize: 9, color: t.accent, letterSpacing: 1, opacity: 0.7 }}>MATCH</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${t.border}`, flexShrink: 0 }}>
        {(["profile", "property", "data"] as const).map(tabId => (
          <button key={tabId} onClick={() => setTab(tabId)} style={{
            flex: 1, padding: "11px 0", background: "none", border: "none", cursor: "pointer",
            fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
            color: tab === tabId ? t.accent : t.textMuted,
            borderBottom: tab === tabId ? `2px solid ${t.accent}` : "2px solid transparent",
            transition: "all 0.2s",
          }}>
            {tabId === "profile" ? "👤 Profile" : tabId === "property" ? "🏠 Property" : "📊 Data"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px" }}>

        {/* PROFILE TAB */}
        {tab === "profile" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-around", padding: "6px 0" }}>
              <ScoreRing value={profile.lifestyleMatch} label="Lifestyle" color="#00e5a0" />
              <ScoreRing value={profile.propertyMatch} label="Property" color="#74b9ff" />
              <ScoreRing value={Math.round((profile.lifestyleMatch + profile.propertyMatch) / 2)} label="Overall" color={profile.color} />
            </div>
            <div style={{ background: t.surface, borderRadius: 14, padding: "12px 14px" }}>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: t.textSub, fontStyle: "italic" }}>"{profile.bio}"</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {profile.tags.map(tag => (
                <span key={tag} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 20, padding: "4px 12px", fontSize: 12, color: t.textSub }}>{tag}</span>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                ["💰", "Budget", profile.budget],
                ["📅", "Move-in", profile.moveIn],
                ["🧹", "Cleanliness", `${profile.cleanliness}/5`],
                ["🎭", "Guests", profile.guests],
              ].map(([icon, label, val]) => (
                <div key={label} style={{ background: t.surface, borderRadius: 12, padding: "10px 12px" }}>
                  <div style={{ fontSize: 9, color: t.textMuted, letterSpacing: 1, marginBottom: 3 }}>{icon} {label!.toUpperCase()}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROPERTY TAB */}
{tab === "property" && (
  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    <div style={{ display: "flex", gap: 10 }}>
      <Badge
        icon="🔋"
        label={`EPC ${profile.epcGrade}`}
        sub="Energy Rating"
        good={["A", "B", "C"].includes(profile.epcGrade)}
      />

      <Badge
        icon="🛏️"
        label={`${profile.bedroomsAvailable} bed`}
        sub="Bedrooms available"
        good={profile.bedroomsAvailable >= 1}
      />
    </div>

    <div style={{ display: "flex", gap: 10 }}>
      <Badge
        icon="📍"
        label={profile.nearestLandmark}
        sub={`${profile.nearestLandmarkDistanceMin} min walk`}
        good={profile.nearestLandmarkDistanceMin <= 12}
      />

      <Badge
        icon="🚶"
        label={`${profile.commuteMin} min`}
        sub="To campus"
        good={profile.commuteMin <= 10}
      />
    </div>

    <div
      style={{
        background: "rgba(116,185,255,0.1)",
        border: "1px solid rgba(116,185,255,0.25)",
        borderRadius: 14,
        padding: "14px 16px",
      }}
    >
      <div style={{ fontSize: 11, color: "rgba(116,185,255,0.8)", marginBottom: 6, fontWeight: 700 }}>
        💷 RENT FAIRNESS SCORE
      </div>
      <div style={{ fontSize: 26, fontWeight: 900, color: t.text }}>{profile.rentFairness}</div>
      <div style={{ fontSize: 11, color: t.textMuted, marginTop: 4 }}>vs. area average (Price Paid data)</div>
    </div>

    <div style={{ background: t.surface, borderRadius: 14, padding: "14px 16px" }}>
      <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 10, letterSpacing: 1 }}>EPC BAND</div>
      <div style={{ display: "flex", gap: 4 }}>
        {["A", "B", "C", "D", "E", "F"].map((g) => (
          <div
            key={g}
            style={{
              flex: 1,
              height: 28,
              borderRadius: 6,
              background: g === profile.epcGrade ? EPC_COLORS[g] : `${EPC_COLORS[g]}33`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 800,
              color: g === profile.epcGrade ? "white" : "rgba(255,255,255,0.3)",
              transform: g === profile.epcGrade ? "scaleY(1.15)" : "none",
              transition: "all 0.2s",
            }}
          >
            {g}
          </div>
        ))}
      </div>
    </div>
  </div>
)}
        {/* DATA TAB */}
        {tab === "data" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: t.accentBg, border: `1px solid ${t.accentBorder}`, borderRadius: 14, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, color: t.accent, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>🤝 COMPATIBILITY BREAKDOWN</div>
              {[
                ["Lifestyle & Habits", profile.lifestyleMatch, "#00e5a0"],
                ["Budget Overlap", 91, "#74b9ff"],
                ["Property Preferences", profile.propertyMatch, "#a29bfe"],
                ["Sustainability Alignment", 88, "#55efc4"],
                ["Schedule Similarity", 79, "#ffeaa7"],
              ].map(([label, val, color]) => (
                <div key={label as string} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: t.textSub }}>{label as string}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: color as string }}>{val as number}%</span>
                  </div>
                  <div style={{ height: 4, background: t.surface, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${val}%`, background: color as string, borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: t.surface, borderRadius: 14, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, color: t.textMuted, letterSpacing: 1, marginBottom: 10 }}>🎓 SOCIETIES</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {profile.societies.map(s => (
                  <span key={s} style={{ background: `${profile.color}22`, border: `1px solid ${profile.color}44`, borderRadius: 20, padding: "4px 12px", fontSize: 11, color: t.textSub }}>{s}</span>
                ))}
              </div>
            </div>
            <div style={{ background: "rgba(116,185,255,0.08)", borderRadius: 14, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, color: "rgba(116,185,255,0.7)", fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>🌱 SUSTAINABILITY NOTE</div>
              <p style={{ margin: 0, fontSize: 12, color: t.textSub, lineHeight: 1.5 }}>
                Living in EPC {profile.epcGrade} properties saves an estimated <span style={{ color: t.accent, fontWeight: 700 }}>£320/year</span> vs. the student average — and cuts carbon by 1.4 tonnes.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
