import { useState, useRef } from "react";

const PROFILES = [
  {
    id: 1,
    name: "Jasmine K.",
    age: 20,
    course: "Computer Science",
    year: "2nd Year",
    uni: "University of Manchester",
    budget: "£550–£700/mo",
    moveIn: "Sept 2025",
    bio: "Night owl coder, clean kitchen obsessive, love hosting film nights. Looking for housemates who won't judge my 2am cooking.",
    compatibility: 94,
    lifestyleMatch: 97,
    propertyMatch: 88,
    tags: ["Night Owl", "Clean Freak", "Social", "Cyclist"],
    epcGrade: "B",
    floodRisk: "Low",
    hmoStatus: "Approved Zone",
    rentFairness: "+2% avg",
    commuteMin: 8,
    avatar: "JK",
    color: "#FF6B6B",
    societies: ["Hackathon Society", "Film Club"],
    cleanliness: 4,
    guests: "Occasionally",
  },
  {
    id: 2,
    name: "Marcus T.",
    age: 22,
    course: "Architecture",
    year: "3rd Year",
    uni: "University of Manchester",
    budget: "£600–£750/mo",
    moveIn: "Aug 2025",
    bio: "Library warrior by day, amateur chef by night. Need quiet study space but always down for a Sunday roast.",
    compatibility: 82,
    lifestyleMatch: 78,
    propertyMatch: 91,
    tags: ["Early Bird", "Chef", "Quiet", "Gym Goer"],
    epcGrade: "C",
    floodRisk: "Low",
    hmoStatus: "Approved Zone",
    rentFairness: "-4% avg",
    commuteMin: 12,
    avatar: "MT",
    color: "#4ECDC4",
    societies: ["Architecture Society", "Food Society"],
    cleanliness: 3,
    guests: "Rarely",
  },
  {
    id: 3,
    name: "Priya S.",
    age: 21,
    course: "Medicine",
    year: "2nd Year",
    uni: "University of Manchester",
    budget: "£500–£650/mo",
    moveIn: "Sept 2025",
    bio: "Med student with erratic schedules. Respectful of sleep and space. Absolutely love plants and a clean home.",
    compatibility: 76,
    lifestyleMatch: 72,
    propertyMatch: 85,
    tags: ["Eco-Conscious", "Plant Mum", "Clean", "Introvert"],
    epcGrade: "A",
    floodRisk: "Low",
    hmoStatus: "Restricted Zone",
    rentFairness: "+6% avg",
    commuteMin: 6,
    avatar: "PS",
    color: "#A29BFE",
    societies: ["MedSoc", "Environmental Society"],
    cleanliness: 5,
    guests: "Rarely",
  },
];

const EPC_COLORS = { A: "#00a550", B: "#50b747", C: "#b2d234", D: "#fff200", E: "#f7941d", F: "#f15a29" };

function ScoreRing({ value, label, color }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg width={54} height={54} viewBox="0 0 54 54">
        <circle cx={27} cy={27} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={5} />
        <circle
          cx={27} cy={27} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 27 27)"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
        <text x={27} y={31} textAnchor="middle" fill="white" fontSize={11} fontWeight="700">{value}%</text>
      </svg>
      <span style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</span>
    </div>
  );
}

function Badge({ icon, label, sub, good }) {
  return (
    <div style={{
      background: good ? "rgba(0,229,160,0.12)" : "rgba(255,107,107,0.12)",
      border: `1px solid ${good ? "rgba(0,229,160,0.3)" : "rgba(255,107,107,0.3)"}`,
      borderRadius: 10, padding: "6px 10px",
      display: "flex", alignItems: "center", gap: 6, flex: 1
    }}>
      <span style={{ fontSize: 14 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: good ? "#00e5a0" : "#ff6b6b" }}>{label}</div>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>{sub}</div>
      </div>
    </div>
  );
}

function SwipeCard({ profile, onSwipe, zIndex, offset }) {
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [tab, setTab] = useState("profile");
  const startRef = useRef(null);
  const cardRef = useRef(null);

  const handleStart = (clientX, clientY) => {
    startRef.current = { x: clientX, y: clientY };
    setDragging(true);
  };
  const handleMove = (clientX, clientY) => {
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

  const epcColor = EPC_COLORS[profile.epcGrade] || "#fff";

  return (
    <div
      ref={cardRef}
      onMouseDown={e => handleStart(e.clientX, e.clientY)}
      onMouseMove={e => handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={e => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={e => { e.preventDefault(); handleMove(e.touches[0].clientX, e.touches[0].clientY); }}
      onTouchEnd={handleEnd}
      style={{
        position: "absolute", width: "100%", height: "100%",
        transform: `translateX(calc(${pos.x}px + ${offset * 8}px)) translateY(${offset * 6}px) rotate(${rotation + offset * 2}deg) scale(${1 - offset * 0.04})`,
        transition: dragging ? "none" : "transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275)",
        cursor: dragging ? "grabbing" : "grab",
        zIndex, userSelect: "none", touchAction: "none",
        borderRadius: 28,
        background: "linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}
    >
      {/* LIKE / NOPE overlays */}
      <div style={{ position: "absolute", top: 24, left: 24, zIndex: 10, opacity: likeOpacity, transform: `rotate(-20deg)`, border: "3px solid #00e5a0", borderRadius: 8, padding: "4px 14px", color: "#00e5a0", fontWeight: 900, fontSize: 22, letterSpacing: 2 }}>MATCH</div>
      <div style={{ position: "absolute", top: 24, right: 24, zIndex: 10, opacity: nopeOpacity, transform: `rotate(20deg)`, border: "3px solid #ff4757", borderRadius: 8, padding: "4px 14px", color: "#ff4757", fontWeight: 900, fontSize: 22, letterSpacing: 2 }}>PASS</div>

      {/* Header strip with avatar */}
      <div style={{
        padding: "28px 24px 20px", display: "flex", alignItems: "center", gap: 16,
        background: `linear-gradient(135deg, ${profile.color}22, transparent)`,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 20,
          background: `linear-gradient(135deg, ${profile.color}, ${profile.color}88)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, fontWeight: 800, color: "white",
          boxShadow: `0 8px 24px ${profile.color}44`, flexShrink: 0
        }}>{profile.avatar}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: "white" }}>{profile.name}</span>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>{profile.age}</span>
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>{profile.course} · {profile.year}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>📍 {profile.uni}</div>
        </div>
        <div style={{
          background: "rgba(0,229,160,0.15)", border: "1px solid rgba(0,229,160,0.4)",
          borderRadius: 12, padding: "8px 12px", textAlign: "center", flexShrink: 0
        }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#00e5a0" }}>{profile.compatibility}%</div>
          <div style={{ fontSize: 9, color: "rgba(0,229,160,0.7)", letterSpacing: 1 }}>MATCH</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
        {["profile", "property", "insights"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: "12px 0", background: "none", border: "none", cursor: "pointer",
            fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
            color: tab === t ? "#00e5a0" : "rgba(255,255,255,0.35)",
            borderBottom: tab === t ? "2px solid #00e5a0" : "2px solid transparent",
            transition: "all 0.2s"
          }}>{t === "profile" ? "👤 Profile" : t === "property" ? "🏠 Property" : "📊 Data"}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px" }}>
        {tab === "profile" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Score rings */}
            <div style={{ display: "flex", justifyContent: "space-around", padding: "8px 0" }}>
              <ScoreRing value={profile.lifestyleMatch} label="Lifestyle" color="#00e5a0" />
              <ScoreRing value={profile.propertyMatch} label="Property" color="#74b9ff" />
              <ScoreRing value={Math.round((profile.lifestyleMatch + profile.propertyMatch) / 2)} label="Overall" color={profile.color} />
            </div>
            {/* Bio */}
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "14px 16px" }}>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.75)", fontStyle: "italic" }}>"{profile.bio}"</p>
            </div>
            {/* Tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {profile.tags.map(t => (
                <span key={t} style={{
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 20, padding: "4px 12px", fontSize: 12, color: "rgba(255,255,255,0.7)"
                }}>{t}</span>
              ))}
            </div>
            {/* Details */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                ["💰", "Budget", profile.budget],
                ["📅", "Move-in", profile.moveIn],
                ["🧹", "Cleanliness", `${profile.cleanliness}/5`],
                ["🎭", "Guests", profile.guests],
              ].map(([icon, label, val]) => (
                <div key={label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "10px 12px" }}>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: 1, marginBottom: 4 }}>{icon} {label.toUpperCase()}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "white" }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "property" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <Badge icon="🔋" label={`EPC ${profile.epcGrade}`} sub="Energy Rating" good={["A", "B", "C"].includes(profile.epcGrade)} />
              <Badge icon="🌊" label={profile.floodRisk} sub="Flood Risk" good={profile.floodRisk === "Low"} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Badge icon="🏗" label={profile.hmoStatus} sub="Article 4" good={profile.hmoStatus === "Approved Zone"} />
              <Badge icon="🚶" label={`${profile.commuteMin} min`} sub="To campus" good={profile.commuteMin <= 10} />
            </div>
            {/* Rent fairness */}
            <div style={{
              background: "rgba(116,185,255,0.1)", border: "1px solid rgba(116,185,255,0.25)",
              borderRadius: 14, padding: "14px 16px"
            }}>
              <div style={{ fontSize: 11, color: "rgba(116,185,255,0.8)", marginBottom: 6, fontWeight: 700 }}>💷 RENT FAIRNESS SCORE</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: "white" }}>{profile.rentFairness}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>vs. area average (Price Paid data)</div>
            </div>
            {/* EPC visual */}
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 10, letterSpacing: 1 }}>EPC BAND</div>
              <div style={{ display: "flex", gap: 4 }}>
                {["A", "B", "C", "D", "E", "F"].map(g => (
                  <div key={g} style={{
                    flex: 1, height: 28, borderRadius: 6,
                    background: g === profile.epcGrade ? EPC_COLORS[g] : `${EPC_COLORS[g]}33`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 800,
                    color: g === profile.epcGrade ? "white" : "rgba(255,255,255,0.3)",
                    transform: g === profile.epcGrade ? "scaleY(1.15)" : "none",
                    transition: "all 0.2s"
                  }}>{g}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "insights" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: "rgba(0,229,160,0.06)", border: "1px solid rgba(0,229,160,0.15)", borderRadius: 14, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, color: "rgba(0,229,160,0.7)", fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>🤝 COMPATIBILITY BREAKDOWN</div>
              {[
                ["Lifestyle & Habits", profile.lifestyleMatch, "#00e5a0"],
                ["Budget Overlap", 91, "#74b9ff"],
                ["Property Preferences", profile.propertyMatch, "#a29bfe"],
                ["Sustainability Alignment", 88, "#55efc4"],
                ["Schedule Similarity", 79, "#ffeaa7"],
              ].map(([label, val, color]) => (
                <div key={label} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{label}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color }}>{val}%</span>
                  </div>
                  <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${val}%`, background: color, borderRadius: 4, transition: "width 1s ease" }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1, marginBottom: 10 }}>🎓 SOCIETIES</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {profile.societies.map(s => (
                  <span key={s} style={{ background: `${profile.color}22`, border: `1px solid ${profile.color}44`, borderRadius: 20, padding: "4px 12px", fontSize: 11, color: "rgba(255,255,255,0.7)" }}>{s}</span>
                ))}
              </div>
            </div>
            <div style={{ background: "rgba(116,185,255,0.08)", borderRadius: 14, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, color: "rgba(116,185,255,0.7)", fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>🌱 SUSTAINABILITY NOTE</div>
              <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>Living in EPC {profile.epcGrade} properties saves an estimated <span style={{ color: "#00e5a0", fontWeight: 700 }}>£320/year</span> vs. the student average — and cuts carbon by 1.4 tonnes.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RoomrApp() {
  const [screen, setScreen] = useState("swipe");
  const [cards, setCards] = useState(PROFILES);
  const [matches, setMatches] = useState([]);
  const [lastAction, setLastAction] = useState(null);
  const [showMatch, setShowMatch] = useState(null);

  const handleSwipe = (dir) => {
    if (cards.length === 0) return;
    const top = cards[cards.length - 1];
    setLastAction(dir);
    if (dir === "right") {
      if (top.compatibility > 80) {
        setShowMatch(top);
        setMatches(m => [...m, top]);
        setTimeout(() => setShowMatch(null), 2500);
      } else {
        setMatches(m => [...m, top]);
      }
    }
    setCards(c => c.slice(0, -1));
    setTimeout(() => setLastAction(null), 600);
  };

  const tabs = [
    { id: "swipe", icon: "🔥", label: "Discover" },
    { id: "matches", icon: "💬", label: "Matches" },
    { id: "liked", icon: "👀", label: "Liked You" },
    { id: "insights", icon: "📊", label: "Insights" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      background: "#080b14",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px 0"
    }}>
      <div style={{
        width: "min(400px, 100vw)",
        height: "min(820px, 100vh)",
        background: "#0d1117",
        borderRadius: 36,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 60px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)",
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          flexShrink: 0
        }}>
          <div>
            <span style={{ fontSize: 22, fontWeight: 900, color: "white", letterSpacing: -0.5 }}>room</span>
            <span style={{ fontSize: 22, fontWeight: 900, color: "#00e5a0", letterSpacing: -0.5 }}>r</span>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {screen === "swipe" && cards.length > 0 && (
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{cards.length} nearby</div>
            )}
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: "rgba(0,229,160,0.15)", border: "1px solid rgba(0,229,160,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14
            }}>🔔</div>
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {/* SWIPE SCREEN */}
          {screen === "swipe" && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
              {/* Cards stack */}
              <div style={{ flex: 1, position: "relative", margin: "16px 20px 12px" }}>
                {cards.length === 0 ? (
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
                    <div style={{ fontSize: 48 }}>✨</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "white" }}>You're all caught up!</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Check back soon for new matches</div>
                    <button onClick={() => setCards(PROFILES)} style={{ marginTop: 8, background: "#00e5a0", color: "#0d1117", border: "none", borderRadius: 16, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Refresh ↺</button>
                  </div>
                ) : (
                  cards.map((p, i) => {
                    const isTop = i === cards.length - 1;
                    return (
                      <SwipeCard
                        key={p.id}
                        profile={p}
                        onSwipe={isTop ? handleSwipe : () => {}}
                        zIndex={i}
                        offset={cards.length - 1 - i}
                      />
                    );
                  })
                )}
              </div>
              {/* Action buttons */}
              {cards.length > 0 && (
                <div style={{ display: "flex", justifyContent: "center", gap: 20, padding: "8px 24px 16px", flexShrink: 0 }}>
                  {[
                    { icon: "✕", action: "left", bg: "rgba(255,71,87,0.15)", border: "rgba(255,71,87,0.3)", color: "#ff4757", size: 52 },
                    { icon: "⭐", action: "super", bg: "rgba(116,185,255,0.15)", border: "rgba(116,185,255,0.3)", color: "#74b9ff", size: 44 },
                    { icon: "✓", action: "right", bg: "rgba(0,229,160,0.15)", border: "rgba(0,229,160,0.3)", color: "#00e5a0", size: 52 },
                  ].map(({ icon, action, bg, border, color, size }) => (
                    <button
                      key={action}
                      onClick={() => handleSwipe(action)}
                      style={{
                        width: size, height: size, borderRadius: "50%",
                        background: bg, border: `1.5px solid ${border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: action === "super" ? 16 : 20, color, cursor: "pointer",
                        fontWeight: 700, boxShadow: `0 8px 24px ${bg}`,
                        transition: "transform 0.15s", transform: lastAction === action ? "scale(0.9)" : "scale(1)"
                      }}
                    >{icon}</button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MATCHES SCREEN */}
          {screen === "matches" && (
            <div style={{ padding: "20px", overflowY: "auto", height: "100%" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "white", marginBottom: 16 }}>Your Matches</div>
              {matches.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
                  <div>No matches yet — keep swiping!</div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {matches.map(m => (
                    <div key={m.id} style={{
                      background: "rgba(255,255,255,0.04)", borderRadius: 18, padding: "14px 16px",
                      display: "flex", alignItems: "center", gap: 14,
                      border: "1px solid rgba(255,255,255,0.06)"
                    }}>
                      <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg, ${m.color}, ${m.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "white", flexShrink: 0 }}>{m.avatar}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: "white", fontSize: 15 }}>{m.name}</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{m.compatibility}% compatible · {m.course}</div>
                      </div>
                      <button style={{ background: "rgba(0,229,160,0.15)", border: "1px solid rgba(0,229,160,0.3)", borderRadius: 10, padding: "8px 14px", color: "#00e5a0", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Message</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* INSIGHTS SCREEN */}
          {screen === "insights" && (
            <div style={{ padding: "20px", overflowY: "auto", height: "100%" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "white", marginBottom: 4 }}>Housing Insights</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>Powered by live UK PropTech datasets</div>
              {[
                { title: "🌊 Flood Risk Heatmap", sub: "Manchester: 78% Low Risk zones", color: "#74b9ff", detail: "Based on Environment Agency flood polygon data" },
                { title: "🔋 Greenest Student Areas", sub: "Didsbury avg EPC: B · Chorlton: C+", color: "#00e5a0", detail: "Calculated from 12,400 EPC certificates" },
                { title: "🏗 HMO Approval Hotspots", sub: "Fallowfield: High demand · Article 4 active", color: "#a29bfe", detail: "IBex planning application intelligence" },
                { title: "📈 Rising Rent Alert", sub: "Victoria Park up 11% YoY", color: "#ffeaa7", detail: "Price Paid data + rental yield analysis" },
                { title: "🚌 Best Commute Zones", sub: "Top pick: Rusholme · 9 min avg", color: "#fd79a8", detail: "OS Data Hub routing + transport frequency" },
              ].map(({ title, sub, color, detail }) => (
                <div key={title} style={{
                  background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "16px",
                  marginBottom: 12, border: "1px solid rgba(255,255,255,0.06)"
                }}>
                  <div style={{ fontWeight: 700, color: "white", fontSize: 14, marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 13, color, fontWeight: 600, marginBottom: 6 }}>{sub}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{detail}</div>
                </div>
              ))}
            </div>
          )}

          {/* OTHER SCREENS */}
          {(screen === "liked" || screen === "profile") && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, color: "rgba(255,255,255,0.3)" }}>
              <div style={{ fontSize: 40 }}>{screen === "liked" ? "👀" : "👤"}</div>
              <div style={{ fontWeight: 600, color: "white", fontSize: 16 }}>{screen === "liked" ? "Who Liked You" : "Your Profile"}</div>
              <div style={{ fontSize: 13 }}>Coming soon in full build</div>
            </div>
          )}
        </div>

        {/* Match celebration overlay */}
        {showMatch && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.88)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 20, borderRadius: 36,
            animation: "fadeIn 0.3s ease"
          }}>
            <div style={{ fontSize: 60 }}>🎉</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#00e5a0" }}>It's a Match!</div>
            <div style={{ fontSize: 16, color: "rgba(255,255,255,0.7)" }}>You and {showMatch.name} liked each other</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "0 40px" }}>{showMatch.compatibility}% compatibility score</div>
          </div>
        )}

        {/* Bottom Nav */}
        <div style={{
          display: "flex",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          background: "#0d1117",
          flexShrink: 0
        }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setScreen(t.id)}
              style={{
                flex: 1, padding: "12px 0 14px", background: "none", border: "none",
                cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                opacity: screen === t.id ? 1 : 0.35,
                transition: "opacity 0.2s"
              }}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>{t.icon}</span>
              <span style={{
                fontSize: 9, letterSpacing: "0.08em", fontWeight: 600,
                color: screen === t.id ? "#00e5a0" : "white"
              }}>{t.label.toUpperCase()}</span>
              {screen === t.id && (
                <div style={{ width: 4, height: 4, borderRadius: 2, background: "#00e5a0", marginTop: -2 }} />
              )}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
      `}</style>
    </div>
  );
}