// ✅ FINAL src/screens/AnnouncementsScreen.tsx (COPY-PASTE ENTIRE FILE)
// Works with your App.tsx integration (takes showToast prop)
// No theme `t` needed (matches the dark UI style you used before)

import { useState } from "react";

type Props = { showToast: (msg: string) => void };

const SEED_ANNS = [
  {
    id: "1",
    cat: "market",
    icon: "📊",
    pinned: true,
    title: "Spring 2025: Manchester rents hit £1,180/mo average",
    body: "Analysis of Land Registry transactions shows Manchester average rent up ~6% YoY. Fallowfield and Rusholme seeing highest demand. February–April is peak competition window.",
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    author: "Roomr AI",
  },
  {
    id: "2",
    cat: "hot",
    icon: "🚨",
    pinned: false,
    title: "ALERT: Fallowfield rooms going in under 4 days!",
    body: "Live patterns show student HMO listings in Fallowfield averaging just ~4 days before going off market. If you see a good listing, apply same day — don't wait.",
    createdAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    author: "Roomr AI",
  },
  {
    id: "3",
    cat: "tip",
    icon: "💡",
    pinned: false,
    title: "November–January is landlord negotiation season",
    body: "Q4 listings stay up much longer than spring. Use this window to negotiate lower rents or better contracts before the September rush kicks in.",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    author: "Roomr AI",
  },
  {
    id: "4",
    cat: "news",
    icon: "📰",
    pinned: false,
    title: "Renters reform: stronger protections coming",
    body: "Reforms are progressing that would strengthen tenant protections. Roomr will flag compliant landlords where possible.",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    author: "Roomr AI",
  },
];

function timeAgo(iso: string) {
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (d < 60) return "Just now";
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
}

const TAG_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  market: { bg: "rgba(116,185,255,.12)", color: "#74b9ff", border: "rgba(116,185,255,.3)" },
  hot: { bg: "rgba(255,71,87,.12)", color: "#ff4757", border: "rgba(255,71,87,.3)" },
  tip: { bg: "rgba(0,229,160,.1)", color: "#00e5a0", border: "rgba(0,229,160,.3)" },
  news: { bg: "rgba(162,155,254,.12)", color: "#a29bfe", border: "rgba(162,155,254,.3)" },
};

const TAG_LABELS: Record<string, string> = {
  market: "📊 Market",
  hot: "🔥 Alert",
  tip: "💡 Tip",
  news: "📰 News",
};

const ICON_BG: Record<string, string> = {
  market: "linear-gradient(135deg,rgba(116,185,255,.25),rgba(0,229,160,.15))",
  hot: "linear-gradient(135deg,rgba(255,71,87,.25),rgba(255,140,0,.15))",
  tip: "linear-gradient(135deg,rgba(0,229,160,.2),rgba(116,185,255,.12))",
  news: "linear-gradient(135deg,rgba(162,155,254,.25),rgba(116,185,255,.15))",
};

function PostModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (x: { title: string; body: string; cat: string }) => void;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [cat, setCat] = useState("market");
  const [err, setErr] = useState("");

  const inp: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "white",
    borderRadius: 12,
    padding: "10px 14px",
    fontSize: 13,
    outline: "none",
    fontFamily: "inherit",
  };

  function submit() {
    if (!title.trim() || !body.trim()) {
      setErr("Fill in all fields.");
      return;
    }
    onSubmit({ title: title.trim(), body: body.trim(), cat });
    onClose();
  }

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(12px)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 36,
      }}
    >
      <div
        style={{
          background: "#131a2a",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 24,
          padding: 24,
          width: "88%",
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 800, color: "white", marginBottom: 18 }}>
          📢 Post Announcement
        </div>

        <div
          style={{
            fontSize: 10,
            color: "rgba(255,255,255,0.4)",
            letterSpacing: 1,
            marginBottom: 6,
            textTransform: "uppercase",
          }}
        >
          Title
        </div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Key finding or alert…"
          style={{ ...inp, marginBottom: 12 }}
        />

        <div
          style={{
            fontSize: 10,
            color: "rgba(255,255,255,0.4)",
            letterSpacing: 1,
            marginBottom: 6,
            textTransform: "uppercase",
          }}
        >
          Details
        </div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Describe the insight, tip, or news…"
          style={{ ...inp, marginBottom: 12, minHeight: 80, resize: "vertical" }}
        />

        <div
          style={{
            fontSize: 10,
            color: "rgba(255,255,255,0.4)",
            letterSpacing: 1,
            marginBottom: 6,
            textTransform: "uppercase",
          }}
        >
          Category
        </div>
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          style={{ ...inp, marginBottom: 4, appearance: "none" as any }}
        >
          <option value="market">📊 Market Insight</option>
          <option value="hot">🔥 Hot Alert</option>
          <option value="tip">💡 Tip</option>
          <option value="news">📰 News</option>
        </select>

        {err && <p style={{ color: "#ff4757", fontSize: 12, marginTop: 8, marginBottom: 0 }}>{err}</p>}

        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "11px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.5)",
              border: "none",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            style={{
              flex: 2,
              padding: "11px",
              borderRadius: 12,
              background: "#00e5a0",
              color: "#0d1117",
              border: "none",
              fontSize: 13,
              fontWeight: 800,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Post Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AnnouncementsScreen({ showToast }: Props) {
  const [anns, setAnns] = useState(SEED_ANNS as any[]);
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState(false);

  function handleCreate({ title, body, cat }: { title: string; body: string; cat: string }) {
    const icons: Record<string, string> = { market: "📊", hot: "🚨", tip: "💡", news: "📰" };
    setAnns((p) => [
      {
        id: String(Date.now()),
        cat,
        icon: icons[cat],
        pinned: false,
        title,
        body,
        createdAt: new Date().toISOString(),
        author: "You",
      },
      ...p,
    ]);
    showToast("✅ Announcement posted!");
  }

  function togglePin(id: string) {
    setAnns((p) => p.map((a) => (a.id === id ? { ...a, pinned: !a.pinned } : a)));
  }

  function remove(id: string) {
    setAnns((p) => p.filter((a) => a.id !== id));
  }

  const sorted = [...anns].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return +new Date(b.createdAt) - +new Date(a.createdAt);
  });

  const visible = filter === "all" ? sorted : sorted.filter((a) => a.cat === filter);
  const pinned = sorted.find((a) => a.pinned);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "20px 18px 14px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "white" }}>Announcements</div>
          <button
            onClick={() => setModal(true)}
            style={{
              background: "#00e5a0",
              color: "#0d1117",
              border: "none",
              borderRadius: 10,
              padding: "7px 14px",
              fontSize: 12,
              fontWeight: 800,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            ✏️ Post
          </button>
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 14 }}>
          Market intel & housing tips
        </div>

        {/* Filter chips */}
        <div style={{ display: "flex", gap: 6 }}>
          {["all", "market", "hot", "tip", "news"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "5px 12px",
                borderRadius: 20,
                border: `1px solid ${filter === f ? "#00e5a0" : "rgba(255,255,255,0.1)"}`,
                background: filter === f ? "rgba(0,229,160,0.15)" : "rgba(255,255,255,0.04)",
                color: filter === f ? "#00e5a0" : "rgba(255,255,255,0.45)",
                fontSize: 10,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all .2s",
                letterSpacing: 0.3,
              }}
            >
              {f === "all" ? "All" : TAG_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 18px 20px" }}>
        {/* Pinned */}
        {pinned && (
          <div
            style={{
              background: "rgba(0,229,160,0.07)",
              border: "1px solid rgba(0,229,160,0.2)",
              borderRadius: 14,
              padding: "12px 14px",
              display: "flex",
              gap: 10,
              marginBottom: 14,
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: "1rem", marginTop: 1 }}>📌</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#00e5a0", marginBottom: 3 }}>
                {pinned.title}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
                {pinned.body.slice(0, 100)}…
              </div>
            </div>
          </div>
        )}

        {visible.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px 0", color: "rgba(255,255,255,0.25)" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>📭</div>
            <div style={{ fontSize: 13 }}>Nothing in this category yet</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {visible.map((ann) => {
              const ts = TAG_STYLES[ann.cat] ?? TAG_STYLES.news;
              return (
                <div
                  key={ann.id}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 16,
                    padding: "14px",
                  }}
                >
                  {/* Top */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 8 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background: ICON_BG[ann.cat],
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                        flexShrink: 0,
                      }}
                    >
                      {ann.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "white", lineHeight: 1.3, marginBottom: 3 }}>
                        {ann.title}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span
                          style={{
                            fontSize: 10,
                            padding: "2px 8px",
                            borderRadius: 50,
                            background: ts.bg,
                            color: ts.color,
                            border: `1px solid ${ts.border}`,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: 0.3,
                          }}
                        >
                          {TAG_LABELS[ann.cat]}
                        </span>
                        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
                          {timeAgo(ann.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 10 }}>
                    {ann.body}
                  </div>

                  {/* Footer */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>by {ann.author}</span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => togglePin(ann.id)}
                        title={ann.pinned ? "Unpin" : "Pin"}
                        style={{
                          background: ann.pinned ? "rgba(0,229,160,0.12)" : "rgba(255,255,255,0.06)",
                          border: `1px solid ${ann.pinned ? "rgba(0,229,160,0.3)" : "rgba(255,255,255,0.1)"}`,
                          borderRadius: 8,
                          padding: "4px 8px",
                          fontSize: 11,
                          color: ann.pinned ? "#00e5a0" : "rgba(255,255,255,0.4)",
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        {ann.pinned ? "📌" : "📍"}
                      </button>
                      <button
                        onClick={() => remove(ann.id)}
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 8,
                          padding: "4px 8px",
                          fontSize: 11,
                          color: "rgba(255,255,255,0.35)",
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {modal && <PostModal onClose={() => setModal(false)} onSubmit={handleCreate} />}
    </div>
  );
}