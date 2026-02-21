import { useState, useRef } from "react";
import type { Profile } from "../data/profiles";
import { EPC_COLORS } from "../data/profiles";

function ScoreRing({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg width={54} height={54} viewBox="0 0 54 54">
        <circle cx={27} cy={27} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={5} />
        <circle
          cx={27}
          cy={27}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={5}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 27 27)"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
        <text x={27} y={31} textAnchor="middle" fill="white" fontSize={11} fontWeight="700">
          {value}%
        </text>
      </svg>
      <span style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {label}
      </span>
    </div>
  );
}

function Badge({
  icon,
  label,
  sub,
  good,
}: {
  icon: string;
  label: string;
  sub: string;
  good: boolean;
}) {
  return (
    <div
      style={{
        background: good ? "rgba(0,229,160,0.12)" : "rgba(255,107,107,0.12)",
        border: `1px solid ${good ? "rgba(0,229,160,0.3)" : "rgba(255,107,107,0.3)"}`,
        borderRadius: 10,
        padding: "6px 10px",
        display: "flex",
        alignItems: "center",
        gap: 6,
        flex: 1,
      }}
    >
      <span style={{ fontSize: 14 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: good ? "#00e5a0" : "#ff6b6b" }}>{label}</div>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>{sub}</div>
      </div>
    </div>
  );
}

export function ProfileSwipeCard({
  profile,
  onSwipe,
  zIndex,
  offset,
}: {
  profile: Profile;
  onSwipe: (dir: "left" | "right") => void;
  zIndex: number;
  offset: number;
}) {
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [tab, setTab] = useState<"profile" | "property" | "insights">("profile");
  const startRef = useRef<{ x: number; y: number } | null>(null);

  const handleStart = (clientX: number, clientY: number) => {
    startRef.current = { x: clientX, y: clientY };
    setDragging(true);
  };
  const handleMove = (clientX: number, clientY: number) => {
    if (!dragging || !startRef.current) return;
    setPos({ x: clientX - startRef.current.x, y: clientY - startRef.current.y });
  };
  const handleEnd = () => {
    setDragging(false);
    if (Math.abs(pos.x) > 100) {
      onSwipe(pos.x > 0 ? "right" : "left");
    } else {
      setPos({ x: 0, y: 0 });
    }
  };

  const rotation = pos.x * 0.08;
  const likeOpacity = Math.max(0, Math.min(1, pos.x / 80));
  const nopeOpacity = Math.max(0, Math.min(1, -pos.x / 80));

  return (
    <div
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => {
        e.preventDefault();
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }}
      onTouchEnd={handleEnd}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        transform: `translateX(calc(${pos.x}px + ${offset * 8}px)) translateY(${offset * 6}px) rotate(${rotation + offset * 2}deg) scale(${1 - offset * 0.04})`,
        transition: dragging ? "none" : "transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275)",
        cursor: dragging ? "grabbing" : "grab",
        zIndex,
        userSelect: "none",
        touchAction: "none",
        borderRadius: 28,
        background: "linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 24,
          left: 24,
          zIndex: 10,
          opacity: likeOpacity,
          transform: "rotate(-20deg)",
          border: "3px solid #00e5a0",
          borderRadius: 8,
          padding: "4px 14px",
          color: "#00e5a0",
          fontWeight: 900,
          fontSize: 22,
          letterSpacing: 2,
        }}
      >
        MATCH
      </div>
      <div
        style={{
          position: "absolute",
          top: 24,
          right: 24,
          zIndex: 10,
          opacity: nopeOpacity,
          transform: "rotate(20deg)",
          border: "3px solid #ff4757",
          borderRadius: 8,
          padding: "4px 14px",
          color: "#ff4757",
          fontWeight: 900,
          fontSize: 22,
          letterSpacing: 2,
        }}
      >
        PASS
      </div>

      <div
        style={{
          padding: "28px 24px 20px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          background: `linear-gradient(135deg, ${profile.color}22, transparent)`,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            background: `linear-gradient(135deg, ${profile.color}, ${profile.color}88)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 800,
            color: "white",
            boxShadow: `0 8px 24px ${profile.color}44`,
            flexShrink: 0,
          }}
        >
          {profile.avatar}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: "white" }}>{profile.name}</span>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>{profile.age}</span>
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>
            {profile.course} · {profile.year}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>📍 {profile.uni}</div>
        </div>
        <div
          style={{
            background: "rgba(0,229,160,0.15)",
            border: "1px solid rgba(0,229,160,0.4)",
            borderRadius: 12,
            padding: "8px 12px",
            textAlign: "center",
            flexShrink: 0,
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 900, color: "#00e5a0" }}>{profile.compatibility}%</div>
          <div style={{ fontSize: 9, color: "rgba(0,229,160,0.7)", letterSpacing: 1 }}>MATCH</div>
        </div>
      </div>

      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
        {(["profile", "property", "insights"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: "12px 0",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: tab === t ? "#00e5a0" : "rgba(255,255,255,0.35)",
              borderBottom: tab === t ? "2px solid #00e5a0" : "2px solid transparent",
              transition: "all 0.2s",
            }}
          >
            {t === "profile" ? "👤 Profile" : t === "property" ? "🏠 Property" : "📊 Data"}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px" }}>
        {tab === "profile" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-around", padding: "8px 0" }}>
              <ScoreRing value={profile.lifestyleMatch} label="Lifestyle" color="#00e5a0" />
              <ScoreRing value={profile.propertyMatch} label="Property" color="#74b9ff" />
              <ScoreRing
                value={Math.round((profile.lifestyleMatch + profile.propertyMatch) / 2)}
                label="Overall"
                color={profile.color}
              />
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "14px 16px" }}>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.75)", fontStyle: "italic" }}>
                &quot;{profile.bio}&quot;
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {profile.tags.map((t) => (
                <span
                  key={t}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 20,
                    padding: "4px 12px",
                    fontSize: 12,
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                ["💰", "Budget", profile.budget],
                ["📅", "Move-in", profile.moveIn],
                ["🧹", "Cleanliness", `${profile.cleanliness}/5`],
                ["🎭", "Guests", profile.guests],
              ].map(([icon, label, val]) => (
                <div key={String(label)} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "10px 12px" }}>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: 1, marginBottom: 4 }}>
                    {String(icon)} {String(label).toUpperCase()}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "white" }}>{String(val)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "property" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <Badge
                icon="🔋"
                label={`EPC ${profile.epcGrade}`}
                sub="Energy Rating"
                good={["A", "B", "C"].includes(profile.epcGrade)}
              />
              <Badge icon="🌊" label={profile.floodRisk} sub="Flood Risk" good={profile.floodRisk === "Low"} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Badge
                icon="🏗"
                label={profile.hmoStatus}
                sub="Article 4"
                good={profile.hmoStatus === "Approved Zone"}
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
              <div style={{ fontSize: 26, fontWeight: 900, color: "white" }}>{profile.rentFairness}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>
                vs. area average (Price Paid data)
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 10, letterSpacing: 1 }}>
                EPC BAND
              </div>
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

        {tab === "insights" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div
              style={{
                background: "rgba(0,229,160,0.06)",
                border: "1px solid rgba(0,229,160,0.15)",
                borderRadius: 14,
                padding: "14px 16px",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(0,229,160,0.7)",
                  fontWeight: 700,
                  letterSpacing: 1,
                  marginBottom: 8,
                }}
              >
                🤝 COMPATIBILITY BREAKDOWN
              </div>
              {[
                ["Lifestyle & Habits", profile.lifestyleMatch, "#00e5a0"],
                ["Budget Overlap", 91, "#74b9ff"],
                ["Property Preferences", profile.propertyMatch, "#a29bfe"],
                ["Sustainability Alignment", 88, "#55efc4"],
                ["Schedule Similarity", 79, "#ffeaa7"],
              ].map(([label, val, color]) => (
                <div key={String(label)} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{String(label)}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: String(color) }}>{Number(val)}%</span>
                  </div>
                  <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${Number(val)}%`,
                        background: String(color),
                        borderRadius: 4,
                        transition: "width 1s ease",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1, marginBottom: 10 }}>
                🎓 SOCIETIES
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {profile.societies.map((s) => (
                  <span
                    key={s}
                    style={{
                      background: `${profile.color}22`,
                      border: `1px solid ${profile.color}44`,
                      borderRadius: 20,
                      padding: "4px 12px",
                      fontSize: 11,
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ background: "rgba(116,185,255,0.08)", borderRadius: 14, padding: "14px 16px" }}>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(116,185,255,0.7)",
                  fontWeight: 700,
                  letterSpacing: 1,
                  marginBottom: 6,
                }}
              >
                🌱 SUSTAINABILITY NOTE
              </div>
              <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
                Living in EPC {profile.epcGrade} properties saves an estimated{" "}
                <span style={{ color: "#00e5a0", fontWeight: 700 }}>£320/year</span> vs. the student average — and
                cuts carbon by 1.4 tonnes.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
