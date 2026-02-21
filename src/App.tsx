import { useState, useRef } from "react";

// ─── THEME ───────────────────────────────────────────────────────────────────
const THEMES = {
  dark: {
    bg: "#080b14",
    card: "#0d1117",
    surface: "rgba(255,255,255,0.04)",
    surfaceHover: "rgba(255,255,255,0.08)",
    border: "rgba(255,255,255,0.06)",
    borderStrong: "rgba(255,255,255,0.12)",
    text: "#ffffff",
    textSub: "rgba(255,255,255,0.55)",
    textMuted: "rgba(255,255,255,0.3)",
    accent: "#00e5a0",
    accentBg: "rgba(0,229,160,0.12)",
    accentBorder: "rgba(0,229,160,0.3)",
    navBg: "#0d1117",
    headerBg: "#0d1117",
    swipeCard: "linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    inputBg: "rgba(255,255,255,0.06)",
    shadow: "0 60px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)",
  },
  light: {
    bg: "#f0f4f8",
    card: "#ffffff",
    surface: "rgba(0,0,0,0.03)",
    surfaceHover: "rgba(0,0,0,0.06)",
    border: "rgba(0,0,0,0.07)",
    borderStrong: "rgba(0,0,0,0.14)",
    text: "#0d1117",
    textSub: "rgba(0,0,0,0.55)",
    textMuted: "rgba(0,0,0,0.35)",
    accent: "#00c48c",
    accentBg: "rgba(0,196,140,0.1)",
    accentBorder: "rgba(0,196,140,0.35)",
    navBg: "#ffffff",
    headerBg: "#ffffff",
    swipeCard: "linear-gradient(160deg, #e8f4fd 0%, #dbeafe 50%, #c7d2fe 100%)",
    inputBg: "rgba(0,0,0,0.05)",
    shadow: "0 40px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.07)",
  },
};

// ─── DATA ────────────────────────────────────────────────────────────────────
const PROFILES = [
  {
    id: 1, name: "Jasmine K.", age: 20, course: "Computer Science", year: "2nd Year",
    uni: "University of Manchester", budget: "£550–£700/mo", moveIn: "Sept 2025",
    bio: "Night owl coder, clean kitchen obsessive, love hosting film nights. Looking for housemates who won't judge my 2am cooking.",
    compatibility: 94, lifestyleMatch: 97, propertyMatch: 88,
    tags: ["Night Owl", "Clean Freak", "Social", "Cyclist"],
    epcGrade: "B", floodRisk: "Low", hmoStatus: "Approved Zone",
    rentFairness: "+2% avg", commuteMin: 8, avatar: "JK", color: "#FF6B6B",
    societies: ["Hackathon Society", "Film Club"], cleanliness: 4, guests: "Occasionally",
    smoking: false, drinking: true, studyStyle: "At home",
  },
  {
    id: 2, name: "Marcus T.", age: 22, course: "Architecture", year: "3rd Year",
    uni: "University of Manchester", budget: "£600–£750/mo", moveIn: "Aug 2025",
    bio: "Library warrior by day, amateur chef by night. Need quiet study space but always down for a Sunday roast.",
    compatibility: 82, lifestyleMatch: 78, propertyMatch: 91,
    tags: ["Early Bird", "Chef", "Quiet", "Gym Goer"],
    epcGrade: "C", floodRisk: "Low", hmoStatus: "Approved Zone",
    rentFairness: "-4% avg", commuteMin: 12, avatar: "MT", color: "#4ECDC4",
    societies: ["Architecture Society", "Food Society"], cleanliness: 3, guests: "Rarely",
    smoking: false, drinking: false, studyStyle: "Library",
  },
  {
    id: 3, name: "Priya S.", age: 21, course: "Medicine", year: "2nd Year",
    uni: "University of Manchester", budget: "£500–£650/mo", moveIn: "Sept 2025",
    bio: "Med student with erratic schedules. Respectful of sleep and space. Absolutely love plants and a clean home.",
    compatibility: 76, lifestyleMatch: 72, propertyMatch: 85,
    tags: ["Eco-Conscious", "Plant Mum", "Clean", "Introvert"],
    epcGrade: "A", floodRisk: "Low", hmoStatus: "Restricted Zone",
    rentFairness: "+6% avg", commuteMin: 6, avatar: "PS", color: "#A29BFE",
    societies: ["MedSoc", "Environmental Society"], cleanliness: 5, guests: "Rarely",
    smoking: false, drinking: false, studyStyle: "Library",
  },
  {
    id: 4, name: "Leo B.", age: 21, course: "Economics", year: "3rd Year",
    uni: "University of Manchester", budget: "£550–£700/mo", moveIn: "Sept 2025",
    bio: "Gym in the morning, study in the evening. Tidy, respectful, and always up for a group dinner.",
    compatibility: 88, lifestyleMatch: 85, propertyMatch: 90,
    tags: ["Early Bird", "Gym Goer", "Tidy", "Foodie"],
    epcGrade: "B", floodRisk: "Low", hmoStatus: "Approved Zone",
    rentFairness: "-2% avg", commuteMin: 10, avatar: "LB", color: "#FDCB6E",
    societies: ["Economics Society", "Rowing Club"], cleanliness: 4, guests: "Occasionally",
    smoking: false, drinking: true, studyStyle: "At home",
  },
];

const LIKED_YOU = [
  { id: 10, name: "Sophie R.", age: 20, course: "Law", year: "2nd Year", avatar: "SR", color: "#fd79a8", compatibility: 79, bio: "Quiet studier, loves a clean house." },
  { id: 11, name: "Amir H.", age: 22, course: "Engineering", year: "3rd Year", avatar: "AH", color: "#00cec9", compatibility: 85, bio: "Morning person, huge football fan, very tidy." },
  { id: 12, name: "Chloe W.", age: 21, course: "Psychology", year: "2nd Year", avatar: "CW", color: "#e17055", compatibility: 71, bio: "Loves cooking for housemates, flexible schedule." },
];

const EPC_COLORS = { A: "#00a550", B: "#50b747", C: "#b2d234", D: "#fff200", E: "#f7941d", F: "#f15a29" };

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────
function ScoreRing({ value, label, color }) {
  const r = 20, circ = 2 * Math.PI * r, dash = (value / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg width={54} height={54} viewBox="0 0 54 54">
        <circle cx={27} cy={27} r={r} fill="none" stroke="rgba(128,128,128,0.15)" strokeWidth={5} />
        <circle cx={27} cy={27} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 27 27)" style={{ transition: "stroke-dasharray 1s ease" }} />
        <text x={27} y={31} textAnchor="middle" fill={color} fontSize={11} fontWeight="700">{value}%</text>
      </svg>
      <span style={{ fontSize: 9, color: "rgba(128,128,128,0.7)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</span>
    </div>
  );
}

function Badge({ icon, label, sub, good }) {
  return (
    <div style={{
      background: good ? "rgba(0,229,160,0.1)" : "rgba(255,107,107,0.1)",
      border: `1px solid ${good ? "rgba(0,229,160,0.25)" : "rgba(255,107,107,0.25)"}`,
      borderRadius: 12, padding: "8px 12px",
      display: "flex", alignItems: "center", gap: 8, flex: 1,
    }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: good ? "#00c48c" : "#ff6b6b" }}>{label}</div>
        <div style={{ fontSize: 10, color: "rgba(128,128,128,0.7)" }}>{sub}</div>
      </div>
    </div>
  );
}

function Avatar({ initials, color, size = 48 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.3,
      background: `linear-gradient(135deg, ${color}, ${color}88)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.3, fontWeight: 800, color: "white", flexShrink: 0,
      boxShadow: `0 4px 16px ${color}44`,
    }}>{initials}</div>
  );
}

// ─── SWIPE CARD ──────────────────────────────────────────────────────────────
function SwipeCard({ profile, onSwipe, zIndex, offset, t }) {
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [tab, setTab] = useState("profile");
  const startRef = useRef(null);

  const handleStart = (x, y) => { startRef.current = { x, y }; setDragging(true); };
  const handleMove = (x, y) => {
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
      {/* Overlays */}
      <div style={{ position: "absolute", top: 20, left: 20, zIndex: 10, opacity: likeOp, transform: "rotate(-18deg)", border: "3px solid #00e5a0", borderRadius: 8, padding: "4px 14px", color: "#00e5a0", fontWeight: 900, fontSize: 20, letterSpacing: 2 }}>MATCH ✓</div>
      <div style={{ position: "absolute", top: 20, right: 20, zIndex: 10, opacity: nopeOp, transform: "rotate(18deg)", border: "3px solid #ff4757", borderRadius: 8, padding: "4px 14px", color: "#ff4757", fontWeight: 900, fontSize: 20, letterSpacing: 2 }}>PASS ✕</div>

      {/* Header */}
      <div style={{ padding: "22px 20px 16px", display: "flex", alignItems: "center", gap: 14, background: `linear-gradient(135deg, ${profile.color}18, transparent)`, borderBottom: `1px solid ${t.border}`, flexShrink: 0 }}>
        <Avatar initials={profile.avatar} color={profile.color} size={60} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 19, fontWeight: 800, color: t.text }}>{profile.name}</span>
            <span style={{ fontSize: 14, color: t.textMuted }}>{profile.age}</span>
          </div>
          <div style={{ fontSize: 12, color: t.textSub, marginTop: 2 }}>{profile.course} · {profile.year}</div>
          <div style={{ fontSize: 11, color: t.textMuted, marginTop: 1 }}>📍 {profile.uni}</div>
        </div>
        <div style={{ background: t.accentBg, border: `1px solid ${t.accentBorder}`, borderRadius: 14, padding: "8px 12px", textAlign: "center", flexShrink: 0 }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: t.accent }}>{profile.compatibility}%</div>
          <div style={{ fontSize: 9, color: t.accent, letterSpacing: 1, opacity: 0.8 }}>MATCH</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${t.border}`, flexShrink: 0 }}>
        {["profile", "property", "data"].map(tb => (
          <button key={tb} onClick={() => setTab(tb)} style={{
            flex: 1, padding: "10px 0", background: "none", border: "none", cursor: "pointer",
            fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
            color: tab === tb ? t.accent : t.textMuted,
            borderBottom: tab === tb ? `2px solid ${t.accent}` : "2px solid transparent",
            transition: "all 0.2s",
          }}>
            {tb === "profile" ? "👤 Profile" : tb === "property" ? "🏠 Property" : "📊 Data"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }}>
        {tab === "profile" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-around", padding: "6px 0" }}>
              <ScoreRing value={profile.lifestyleMatch} label="Lifestyle" color={t.accent} />
              <ScoreRing value={profile.propertyMatch} label="Property" color="#74b9ff" />
              <ScoreRing value={profile.compatibility} label="Overall" color={profile.color} />
            </div>
            <div style={{ background: t.surface, borderRadius: 14, padding: "12px 14px", border: `1px solid ${t.border}` }}>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: t.textSub, fontStyle: "italic" }}>"{profile.bio}"</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {profile.tags.map(tag => (
                <span key={tag} style={{ background: t.surface, border: `1px solid ${t.borderStrong}`, borderRadius: 20, padding: "4px 12px", fontSize: 11, color: t.textSub }}>{tag}</span>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[["💰", "Budget", profile.budget], ["📅", "Move-in", profile.moveIn], ["🧹", "Cleanliness", `${profile.cleanliness}/5`], ["🎭", "Guests", profile.guests]].map(([icon, label, val]) => (
                <div key={label} style={{ background: t.surface, borderRadius: 12, padding: "10px 12px", border: `1px solid ${t.border}` }}>
                  <div style={{ fontSize: 9, color: t.textMuted, letterSpacing: 1, marginBottom: 3 }}>{icon} {label.toUpperCase()}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "property" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <Badge icon="🔋" label={`EPC ${profile.epcGrade}`} sub="Energy Rating" good={["A","B","C"].includes(profile.epcGrade)} />
              <Badge icon="🌊" label={profile.floodRisk} sub="Flood Risk" good={profile.floodRisk === "Low"} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Badge icon="🏗" label={profile.hmoStatus} sub="Article 4" good={profile.hmoStatus === "Approved Zone"} />
              <Badge icon="🚶" label={`${profile.commuteMin} min`} sub="To campus" good={profile.commuteMin <= 10} />
            </div>
            <div style={{ background: t.accentBg, border: `1px solid ${t.accentBorder}`, borderRadius: 14, padding: "14px 16px" }}>
              <div style={{ fontSize: 10, color: t.accent, marginBottom: 6, fontWeight: 700, letterSpacing: 1 }}>💷 RENT FAIRNESS SCORE</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: t.text }}>{profile.rentFairness}</div>
              <div style={{ fontSize: 11, color: t.textMuted, marginTop: 4 }}>vs. area average (Price Paid data)</div>
            </div>
            <div style={{ background: t.surface, borderRadius: 14, padding: "14px 16px", border: `1px solid ${t.border}` }}>
              <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 10, letterSpacing: 1 }}>EPC BAND</div>
              <div style={{ display: "flex", gap: 4 }}>
                {["A","B","C","D","E","F"].map(g => (
                  <div key={g} style={{
                    flex: 1, height: 28, borderRadius: 6,
                    background: g === profile.epcGrade ? EPC_COLORS[g] : `${EPC_COLORS[g]}33`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 800,
                    color: g === profile.epcGrade ? "white" : "rgba(128,128,128,0.5)",
                    transform: g === profile.epcGrade ? "scaleY(1.15)" : "none",
                    transition: "all 0.2s",
                  }}>{g}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "data" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: t.surface, borderRadius: 14, padding: "14px 16px", border: `1px solid ${t.border}` }}>
              <div style={{ fontSize: 10, color: t.accent, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>🤝 COMPATIBILITY BREAKDOWN</div>
              {[["Lifestyle & Habits", profile.lifestyleMatch, t.accent], ["Budget Overlap", 91, "#74b9ff"], ["Property Prefs", profile.propertyMatch, "#a29bfe"], ["Sustainability", 88, "#55efc4"], ["Schedule", 79, "#ffeaa7"]].map(([label, val, color]) => (
                <div key={label} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: t.textSub }}>{label}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color }}>{val}%</span>
                  </div>
                  <div style={{ height: 4, background: t.surface, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${val}%`, background: color, borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: t.surface, borderRadius: 14, padding: "14px 16px", border: `1px solid ${t.border}` }}>
              <div style={{ fontSize: 10, color: t.textMuted, letterSpacing: 1, marginBottom: 10 }}>🎓 SOCIETIES</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {profile.societies.map(s => (
                  <span key={s} style={{ background: `${profile.color}18`, border: `1px solid ${profile.color}40`, borderRadius: 20, padding: "4px 12px", fontSize: 11, color: t.textSub }}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MATCHES SCREEN ──────────────────────────────────────────────────────────
function MatchesScreen({ matches, t }) {
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState({});

  const sendMessage = (id) => {
    if (!message.trim()) return;
    setChats(c => ({ ...c, [id]: [...(c[id] || []), { from: "me", text: message, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }] }));
    setMessage("");
    setTimeout(() => {
      const replies = ["Sounds great!", "Yeah that works for me 😊", "Let's arrange a viewing!", "What's your budget?", "I love that area too!"];
      setChats(c => ({ ...c, [id]: [...(c[id] || []), { from: "them", text: replies[Math.floor(Math.random() * replies.length)], time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }] }));
    }, 900);
  };

  if (selected) {
    const profile = matches.find(m => m.id === selected);
    const msgs = chats[selected] || [];
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Chat header */}
        <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${t.border}`, flexShrink: 0, background: t.card }}>
          <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: t.textSub, padding: "0 4px" }}>←</button>
          <Avatar initials={profile.avatar} color={profile.color} size={38} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: t.text }}>{profile.name}</div>
            <div style={{ fontSize: 11, color: t.accent }}>● Online</div>
          </div>
          <div style={{ marginLeft: "auto", background: t.accentBg, border: `1px solid ${t.accentBorder}`, borderRadius: 10, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: t.accent }}>{profile.compatibility}% match</div>
        </div>

        {/* Property snapshot */}
        <div style={{ margin: "12px 16px 0", background: t.surface, borderRadius: 12, padding: "10px 14px", border: `1px solid ${t.border}`, flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: t.textMuted, letterSpacing: 1, marginBottom: 6 }}>🏠 PROPERTY SNAPSHOT</div>
          <div style={{ display: "flex", gap: 16 }}>
            {[["EPC", profile.epcGrade], ["Flood", profile.floodRisk], ["Commute", `${profile.commuteMin}min`], ["Rent", profile.rentFairness]].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: 9, color: t.textMuted }}>{k}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: t.text }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {msgs.length === 0 && (
            <div style={{ textAlign: "center", color: t.textMuted, fontSize: 13, marginTop: 40 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>👋</div>
              Start the conversation with {profile.name.split(" ")[0]}!
            </div>
          )}
          {msgs.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.from === "me" ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth: "75%", padding: "10px 14px", borderRadius: msg.from === "me" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                background: msg.from === "me" ? t.accent : t.surface,
                color: msg.from === "me" ? "#0d1117" : t.text,
                fontSize: 13, lineHeight: 1.4,
                border: msg.from === "me" ? "none" : `1px solid ${t.border}`,
              }}>
                <div>{msg.text}</div>
                <div style={{ fontSize: 9, opacity: 0.6, marginTop: 4, textAlign: "right" }}>{msg.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: "12px 16px", display: "flex", gap: 10, borderTop: `1px solid ${t.border}`, flexShrink: 0, background: t.card }}>
          <input
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage(selected)}
            placeholder="Message..."
            style={{
              flex: 1, padding: "10px 14px", borderRadius: 20,
              background: t.inputBg, border: `1px solid ${t.border}`,
              color: t.text, fontSize: 13, outline: "none",
            }}
          />
          <button onClick={() => sendMessage(selected)} style={{
            width: 40, height: 40, borderRadius: 20, background: t.accent, border: "none",
            cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
          }}>↑</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", overflowY: "auto", height: "100%" }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: t.text, marginBottom: 4 }}>Matches</div>
      <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 20 }}>{matches.length} people you connected with</div>
      {matches.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: t.textMuted }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>No matches yet</div>
          <div style={{ fontSize: 13 }}>Keep swiping to find housemates!</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {matches.map(m => (
            <div key={m.id} onClick={() => setSelected(m.id)} style={{
              background: t.surface, borderRadius: 18, padding: "14px 16px",
              display: "flex", alignItems: "center", gap: 14,
              border: `1px solid ${t.border}`, cursor: "pointer",
              transition: "all 0.2s",
            }}>
              <Avatar initials={m.avatar} color={m.color} size={48} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: t.text, fontSize: 15 }}>{m.name}</div>
                <div style={{ fontSize: 12, color: t.textMuted }}>{m.compatibility}% compatible · {m.course}</div>
                <div style={{ fontSize: 11, color: t.textSub, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Tap to chat 💬</div>
              </div>
              <div style={{ fontSize: 20 }}>›</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── LIKED YOU SCREEN ─────────────────────────────────────────────────────────
function LikedYouScreen({ onMatch, t }) {
  const [revealed, setRevealed] = useState([]);
  const [dismissed, setDismissed] = useState([]);

  const profiles = LIKED_YOU.filter(p => !dismissed.includes(p.id));

  return (
    <div style={{ padding: "20px", overflowY: "auto", height: "100%" }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: t.text, marginBottom: 4 }}>Liked You</div>
      <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 20 }}>{profiles.length} people want to be your housemate</div>

      {profiles.map(p => {
        const isRevealed = revealed.includes(p.id);
        return (
          <div key={p.id} style={{ background: t.surface, borderRadius: 18, padding: "16px", marginBottom: 12, border: `1px solid ${t.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
              <div style={{ position: "relative" }}>
                <Avatar initials={isRevealed ? p.avatar : "??"} color={isRevealed ? p.color : "#888"} size={52} />
                {!isRevealed && (
                  <div style={{ position: "absolute", inset: 0, borderRadius: 16, backdropFilter: "blur(8px)", background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🔒</div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: t.text, fontSize: 15 }}>{isRevealed ? p.name : "Hidden Profile"}</div>
                <div style={{ fontSize: 12, color: t.textMuted }}>{isRevealed ? p.course : "Unlock to reveal"}</div>
                <div style={{ fontSize: 11, color: t.accent, marginTop: 2 }}>{p.compatibility}% match</div>
              </div>
            </div>
            {isRevealed && (
              <div style={{ marginBottom: 12, background: t.card, borderRadius: 12, padding: "10px 14px", border: `1px solid ${t.border}` }}>
                <p style={{ margin: 0, fontSize: 12, color: t.textSub, fontStyle: "italic" }}>"{p.bio}"</p>
              </div>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              {!isRevealed ? (
                <button onClick={() => setRevealed(r => [...r, p.id])} style={{
                  flex: 1, padding: "10px", borderRadius: 12, background: t.accentBg,
                  border: `1px solid ${t.accentBorder}`, color: t.accent, fontWeight: 700,
                  fontSize: 13, cursor: "pointer",
                }}>✨ Reveal Profile</button>
              ) : (
                <>
                  <button onClick={() => { onMatch(p); setDismissed(d => [...d, p.id]); }} style={{ flex: 1, padding: "10px", borderRadius: 12, background: t.accentBg, border: `1px solid ${t.accentBorder}`, color: t.accent, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>✓ Match Back</button>
                  <button onClick={() => setDismissed(d => [...d, p.id])} style={{ width: 44, borderRadius: 12, background: "rgba(255,71,87,0.1)", border: "1px solid rgba(255,71,87,0.25)", color: "#ff4757", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>✕</button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── INSIGHTS SCREEN ──────────────────────────────────────────────────────────
function InsightsScreen({ t }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "Flood", "Energy", "Rent", "Planning"];
  const cards = [
    { cat: "Flood", title: "🌊 Flood Risk Heatmap", sub: "78% of student areas are Low Risk", detail: "Based on Environment Agency flood polygon data", color: "#74b9ff", stat: "78%", statLabel: "Low Risk" },
    { cat: "Energy", title: "🔋 Greenest Student Areas", sub: "Didsbury avg EPC: B · Chorlton: C+", detail: "Calculated from 12,400 EPC certificates", color: "#00e5a0", stat: "£320", statLabel: "avg annual saving" },
    { cat: "Planning", title: "🏗 HMO Approval Hotspots", sub: "Fallowfield: High demand · Article 4 active", detail: "IBex planning application intelligence", color: "#a29bfe", stat: "14wk", statLabel: "avg approval time" },
    { cat: "Rent", title: "📈 Rising Rent Alert", sub: "Victoria Park up 11% year-on-year", detail: "Price Paid data + rental yield analysis", color: "#ffeaa7", stat: "+11%", statLabel: "YoY increase" },
    { cat: "All", title: "🚌 Best Commute Zones", sub: "Top pick: Rusholme · 9 min avg to campus", detail: "OS Data Hub routing + transport frequency", color: "#fd79a8", stat: "9 min", statLabel: "avg commute" },
    { cat: "Flood", title: "☔ Insurance Premium Watch", sub: "Zone 3 areas: +12% on home insurance", detail: "Cross-referenced with flood risk zones", color: "#74b9ff", stat: "+12%", statLabel: "premium increase" },
  ];

  const visible = activeFilter === "All" ? cards : cards.filter(c => c.cat === activeFilter || c.cat === "All");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "20px 20px 0", flexShrink: 0 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: t.text, marginBottom: 4 }}>Housing Insights</div>
        <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 16 }}>Live UK PropTech dataset intelligence</div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12 }}>
          {filters.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{
              padding: "6px 14px", borderRadius: 20, flexShrink: 0,
              background: activeFilter === f ? t.accent : t.surface,
              border: `1px solid ${activeFilter === f ? t.accent : t.border}`,
              color: activeFilter === f ? "#0d1117" : t.textSub,
              fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>{f}</button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px" }}>
        {visible.map(c => (
          <div key={c.title} style={{ background: t.surface, borderRadius: 18, padding: "16px", marginBottom: 12, border: `1px solid ${t.border}` }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: t.text, fontSize: 14, marginBottom: 4 }}>{c.title}</div>
                <div style={{ fontSize: 13, color: c.color, fontWeight: 600, marginBottom: 6 }}>{c.sub}</div>
                <div style={{ fontSize: 11, color: t.textMuted }}>{c.detail}</div>
              </div>
              <div style={{ textAlign: "center", background: `${c.color}18`, border: `1px solid ${c.color}40`, borderRadius: 12, padding: "8px 12px", flexShrink: 0 }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: c.color }}>{c.stat}</div>
                <div style={{ fontSize: 9, color: t.textMuted, letterSpacing: 0.5 }}>{c.statLabel}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PROFILE SCREEN ───────────────────────────────────────────────────────────
function ProfileScreen({ theme, setTheme, t }) {
  const [cleanliness, setCleanliness] = useState(4);
  const [sustainability, setSustainability] = useState(3);
  const [commute, setCommute] = useState(15);
  const [budget, setBudget] = useState([500, 700]);
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={{ overflowY: "auto", height: "100%", padding: "20px" }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: t.text, marginBottom: 20 }}>Your Profile</div>

      {/* Profile card */}
      <div style={{ background: `linear-gradient(135deg, ${t.accent}18, transparent)`, borderRadius: 20, padding: "20px", marginBottom: 20, border: `1px solid ${t.accentBorder}`, display: "flex", alignItems: "center", gap: 16 }}>
        <Avatar initials="ME" color={t.accent} size={64} />
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: t.text }}>Your Name</div>
          <div style={{ fontSize: 13, color: t.textSub }}>Computer Science · 2nd Year</div>
          <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>University of Manchester</div>
        </div>
      </div>

      {/* Theme toggle */}
      <div style={{ background: t.surface, borderRadius: 16, padding: "16px", marginBottom: 14, border: `1px solid ${t.border}` }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 12 }}>🎨 Appearance</div>
        <div style={{ display: "flex", gap: 10 }}>
          {["dark", "light"].map(mode => (
            <button key={mode} onClick={() => setTheme(mode)} style={{
              flex: 1, padding: "10px", borderRadius: 12,
              background: theme === mode ? t.accentBg : t.card,
              border: `2px solid ${theme === mode ? t.accent : t.border}`,
              color: theme === mode ? t.accent : t.textSub,
              fontWeight: 700, fontSize: 13, cursor: "pointer",
            }}>
              {mode === "dark" ? "🌙 Dark" : "☀️ Light"}
            </button>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div style={{ background: t.surface, borderRadius: 16, padding: "16px", marginBottom: 14, border: `1px solid ${t.border}` }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 14 }}>⚙️ Living Preferences</div>

        {/* Cleanliness */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: t.textSub }}>🧹 Cleanliness</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: t.accent }}>{cleanliness}/5</span>
          </div>
          <input type="range" min={1} max={5} value={cleanliness} onChange={e => setCleanliness(+e.target.value)}
            style={{ width: "100%", accentColor: t.accent }} />
        </div>

        {/* Sustainability */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: t.textSub }}>🌱 Sustainability priority</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: t.accent }}>{sustainability}/5</span>
          </div>
          <input type="range" min={1} max={5} value={sustainability} onChange={e => setSustainability(+e.target.value)}
            style={{ width: "100%", accentColor: t.accent }} />
        </div>

        {/* Max commute */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: t.textSub }}>🚶 Max commute</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: t.accent }}>{commute} min</span>
          </div>
          <input type="range" min={5} max={45} step={5} value={commute} onChange={e => setCommute(+e.target.value)}
            style={{ width: "100%", accentColor: t.accent }} />
        </div>
      </div>

      {/* Budget */}
      <div style={{ background: t.surface, borderRadius: 16, padding: "16px", marginBottom: 14, border: `1px solid ${t.border}` }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 14 }}>💰 Budget Range</div>
        <div style={{ display: "flex", gap: 10 }}>
          {[["Min", budget[0], v => setBudget([v, budget[1]])], ["Max", budget[1], v => setBudget([budget[0], v])]].map(([label, val, setter]) => (
            <div key={label} style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 6 }}>{label}</div>
              <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 13, color: t.textMuted }}>£</span>
                <input type="number" value={val} onChange={e => setter(+e.target.value)}
                  style={{ border: "none", background: "transparent", color: t.text, fontWeight: 700, fontSize: 15, width: "100%", outline: "none" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lifestyle toggles */}
      <div style={{ background: t.surface, borderRadius: 16, padding: "16px", marginBottom: 20, border: `1px solid ${t.border}` }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 14 }}>🏠 Lifestyle</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[["🌙 Night owl", true], ["🚭 Non-smoker", true], ["🍺 Social drinker", true], ["📚 Study at home", false]].map(([label, active]) => (
            <div key={label} style={{ background: active ? t.accentBg : t.card, border: `1px solid ${active ? t.accentBorder : t.border}`, borderRadius: 10, padding: "10px 12px", fontSize: 12, fontWeight: 600, color: active ? t.accent : t.textMuted, cursor: "pointer" }}>{label}</div>
          ))}
        </div>
      </div>

      {/* Save */}
      <button onClick={handleSave} style={{
        width: "100%", padding: "14px", borderRadius: 16,
        background: saved ? "rgba(0,229,160,0.15)" : t.accent,
        border: `1px solid ${t.accentBorder}`,
        color: saved ? t.accent : "#0d1117",
        fontWeight: 800, fontSize: 15, cursor: "pointer",
        transition: "all 0.3s",
      }}>{saved ? "✓ Saved!" : "Save Preferences"}</button>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function RoomrApp() {
  const [theme, setTheme] = useState("dark");
  const t = THEMES[theme];
  const [screen, setScreen] = useState("swipe");
  const [cards, setCards] = useState([...PROFILES].reverse());
  const [matches, setMatches] = useState([]);
  const [lastAction, setLastAction] = useState(null);
  const [showMatch, setShowMatch] = useState(null);

  const handleSwipe = (dir) => {
    if (cards.length === 0) return;
    const top = cards[0];
    setLastAction(dir);
    if (dir === "right") {
      setMatches(m => [...m, top]);
      if (top.compatibility > 80) { setShowMatch(top); setTimeout(() => setShowMatch(null), 2500); }
    }
    setCards(c => c.slice(1));
    setTimeout(() => setLastAction(null), 600);
  };

  const handleMatchBack = (profile) => {
    setMatches(m => [...m, profile]);
    setShowMatch(profile);
    setTimeout(() => setShowMatch(null), 2500);
  };

  const tabs = [
    { id: "swipe", icon: "🔥", label: "Discover" },
    { id: "matches", icon: "💬", label: "Matches" },
    { id: "liked", icon: "👀", label: "Liked You" },
    { id: "insights", icon: "📊", label: "Insights" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: t.bg, minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px 0", transition: "background 0.3s" }}>
      <div style={{ width: "min(400px, 100vw)", height: "min(820px, 100vh)", background: t.card, borderRadius: 36, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", boxShadow: t.shadow, transition: "all 0.3s" }}>

        {/* Header */}
        <div style={{ padding: "20px 24px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${t.border}`, flexShrink: 0, background: t.headerBg }}>
          <div>
            <span style={{ fontSize: 22, fontWeight: 900, color: t.text, letterSpacing: -0.5 }}>room</span>
            <span style={{ fontSize: 22, fontWeight: 900, color: t.accent, letterSpacing: -0.5 }}>r</span>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {screen === "swipe" && <div style={{ fontSize: 11, color: t.textMuted }}>{cards.length} nearby</div>}
            {matches.length > 0 && <div style={{ background: "#ff4757", width: 18, height: 18, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "white" }}>{matches.length}</div>}
            <div style={{ width: 32, height: 32, borderRadius: 10, background: t.accentBg, border: `1px solid ${t.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🔔</div>
          </div>
        </div>

        {/* Screen content */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {/* SWIPE */}
          {screen === "swipe" && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
              <div style={{ flex: 1, position: "relative", margin: "16px 20px 12px" }}>
                {cards.length === 0 ? (
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
                    <div style={{ fontSize: 48 }}>✨</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>You're all caught up!</div>
                    <div style={{ fontSize: 13, color: t.textMuted }}>Check back soon for new matches</div>
                    <button onClick={() => setCards([...PROFILES].reverse())} style={{ marginTop: 8, background: t.accent, color: "#0d1117", border: "none", borderRadius: 16, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Refresh ↺</button>
                  </div>
                ) : (
                  cards.map((p, i) => {
                    const isTop = i === 0;
                    return (
                      <SwipeCard key={p.id} profile={p} onSwipe={isTop ? handleSwipe : () => {}} zIndex={cards.length - i} offset={i} t={t} />
                    );
                  })
                )}
              </div>
              {cards.length > 0 && (
                <div style={{ display: "flex", justifyContent: "center", gap: 20, padding: "8px 24px 16px", flexShrink: 0 }}>
                  {[["✕", "left", "rgba(255,71,87,0.15)", "rgba(255,71,87,0.3)", "#ff4757", 52], ["⭐", "super", "rgba(116,185,255,0.15)", "rgba(116,185,255,0.3)", "#74b9ff", 44], ["✓", "right", `${t.accentBg}`, `${t.accentBorder}`, t.accent, 52]].map(([icon, action, bg, border, color, size]) => (
                    <button key={action} onClick={() => handleSwipe(action)} style={{ width: size, height: size, borderRadius: "50%", background: bg, border: `1.5px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: action === "super" ? 16 : 20, color, cursor: "pointer", fontWeight: 700, transition: "transform 0.15s", transform: lastAction === action ? "scale(0.88)" : "scale(1)" }}>{icon}</button>
                  ))}
                </div>
              )}
            </div>
          )}

          {screen === "matches" && <MatchesScreen matches={matches} t={t} />}
          {screen === "liked" && <LikedYouScreen onMatch={handleMatchBack} t={t} />}
          {screen === "insights" && <InsightsScreen t={t} />}
          {screen === "profile" && <ProfileScreen theme={theme} setTheme={setTheme} t={t} />}
        </div>

        {/* Match overlay */}
        {showMatch && (
          <div style={{ position: "absolute", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.88)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, borderRadius: 36 }}>
            <div style={{ fontSize: 64 }}>🎉</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: t.accent }}>It's a Match!</div>
            <Avatar initials={showMatch.avatar} color={showMatch.color} size={72} />
            <div style={{ fontSize: 16, color: "rgba(255,255,255,0.8)" }}>You and {showMatch.name.split(" ")[0]} liked each other</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "0 40px" }}>{showMatch.compatibility}% compatibility · {showMatch.course}</div>
            <button onClick={() => { setShowMatch(null); setScreen("matches"); }} style={{ marginTop: 8, background: t.accent, color: "#0d1117", border: "none", borderRadius: 16, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Send a Message</button>
          </div>
        )}

        {/* Bottom nav */}
        <div style={{ display: "flex", borderTop: `1px solid ${t.border}`, background: t.navBg, flexShrink: 0, transition: "background 0.3s" }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setScreen(tab.id)} style={{ flex: 1, padding: "10px 0 12px", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, opacity: screen === tab.id ? 1 : 0.4, transition: "opacity 0.2s" }}>
              <span style={{ fontSize: 18 }}>{tab.icon}</span>
              <span style={{ fontSize: 9, letterSpacing: "0.08em", fontWeight: 700, color: screen === tab.id ? t.accent : t.text }}>{tab.label.toUpperCase()}</span>
              {screen === tab.id && <div style={{ width: 4, height: 4, borderRadius: 2, background: t.accent }} />}
            </button>
          ))}
        </div>
      </div>
      <style>{`* { box-sizing: border-box; } ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.2); border-radius: 4px; } input[type=range] { cursor: pointer; }`}</style>
    </div>
  );
}