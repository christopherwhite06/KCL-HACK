import { useState, useRef, useEffect } from "react";
import type { Theme } from "../themes";
import { PROFILES } from "../data";
import Avatar from "../components/Avatar";

type Profile = typeof PROFILES[number];
type Message = { id: number; text: string; from: "me" | "them"; time: string };

const STARTER_MESSAGES: Record<number, Message[]> = {
  1: [
    { id: 1, text: "Hey! Saw we matched 👋 I'm looking for housemates from September", from: "them", time: "2:14pm" },
    { id: 2, text: "I'm really into keeping the kitchen clean, hope that's not a dealbreaker 😅", from: "them", time: "2:14pm" },
  ],
  2: [
    { id: 1, text: "Hi! We matched — do you have a specific area in mind?", from: "them", time: "Yesterday" },
  ],
  3: [
    { id: 1, text: "Hey, 94% match is pretty impressive 👀", from: "them", time: "10:30am" },
    { id: 2, text: "Are you flexible on move-in date at all?", from: "them", time: "10:31am" },
  ],
  4: [
    { id: 1, text: "Yo! Saw your profile — we both like cooking, we'd make great housemates", from: "them", time: "Monday" },
  ],
};

const QUICK_REPLIES = ["Hey! 👋", "Sounds great!", "What area?", "Tell me more", "When can we chat?"];

type Props = { t: Theme; matches: Profile[] };

export default function MatchesScreen({ t, matches }: Props) {
  const [activeChat, setActiveChat] = useState<Profile | null>(null);
  const [conversations, setConversations] = useState<Record<number, Message[]>>(STARTER_MESSAGES);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages = activeChat ? (conversations[activeChat.id] || []) : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, activeChat]);

  const sendMessage = (text: string) => {
    if (!activeChat || !text.trim()) return;
    const newMsg: Message = { id: Date.now(), text: text.trim(), from: "me", time: "Now" };
    setConversations(prev => ({ ...prev, [activeChat.id]: [...(prev[activeChat.id] || []), newMsg] }));
    setInput("");
    const replies = ["That's great to hear! 😊", "Definitely, let's figure it out!", "I was thinking the same thing", "Yeah for sure, want to arrange a call?", "Sounds good to me!"];
    setTimeout(() => {
      const reply: Message = { id: Date.now() + 1, text: replies[Math.floor(Math.random() * replies.length)], from: "them", time: "Now" };
      setConversations(prev => ({ ...prev, [activeChat.id]: [...(prev[activeChat.id] || []), reply] }));
    }, 1200);
  };

  if (activeChat) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ padding: "14px 16px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 12, background: t.headerBg, flexShrink: 0 }}>
          <button onClick={() => setActiveChat(null)} style={{ background: "none", border: "none", cursor: "pointer", color: t.accent, fontSize: 22, padding: "0 4px", lineHeight: 1 }}>‹</button>
          <Avatar initials={activeChat.avatar} color={activeChat.color} size={40} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: t.text, fontSize: 15 }}>{activeChat.name}</div>
            <div style={{ fontSize: 11, color: t.accent }}>{activeChat.compatibility}% match · {activeChat.course}</div>
          </div>
          <div style={{ fontSize: 11, color: t.textMuted, textAlign: "right" }}>
            <div>🔋 EPC {activeChat.epcGrade}</div>
            <div>🌊 {activeChat.floodRisk} risk</div>
          </div>
        </div>

        <div style={{ padding: "8px 16px", background: t.accentBg, borderBottom: `1px solid ${t.accentBorder}`, display: "flex", gap: 16, flexShrink: 0 }}>
          {[["Lifestyle", activeChat.lifestyleMatch], ["Property", activeChat.propertyMatch], ["Budget", 91]].map(([label, val]) => (
            <div key={String(label)} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: t.accent }}>{val}%</div>
              <div style={{ fontSize: 9, color: t.textMuted, letterSpacing: 1 }}>{String(label).toUpperCase()}</div>
            </div>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 8 }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display: "flex", justifyContent: msg.from === "me" ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth: "75%", background: msg.from === "me" ? t.accent : t.surface,
                color: msg.from === "me" ? "#0d1117" : t.text,
                borderRadius: msg.from === "me" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                padding: "10px 14px", fontSize: 13, lineHeight: 1.5,
                border: msg.from === "me" ? "none" : `1px solid ${t.border}`,
              }}>
                {msg.text}
                <div style={{ fontSize: 9, opacity: 0.5, marginTop: 4, textAlign: "right" }}>{msg.time}</div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div style={{ padding: "8px 16px 4px", display: "flex", gap: 8, overflowX: "auto", flexShrink: 0 }}>
          {QUICK_REPLIES.map(qr => (
            <button key={qr} onClick={() => sendMessage(qr)} style={{
              background: t.surface, border: `1px solid ${t.border}`, borderRadius: 20,
              padding: "6px 14px", color: t.textSub, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
            }}>{qr}</button>
          ))}
        </div>

        <div style={{ padding: "10px 16px 16px", display: "flex", gap: 10, flexShrink: 0, borderTop: `1px solid ${t.border}` }}>
          <input
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage(input)}
            placeholder="Message..."
            style={{ flex: 1, background: t.surface, border: `1px solid ${t.borderStrong}`, borderRadius: 20, padding: "10px 16px", color: t.text, fontSize: 14, outline: "none" }}
          />
          <button onClick={() => sendMessage(input)} style={{
            width: 42, height: 42, borderRadius: "50%", border: "none",
            background: input.trim() ? t.accent : t.surface, color: input.trim() ? "#0d1117" : t.textMuted,
            fontSize: 18, cursor: "pointer", flexShrink: 0, transition: "all 0.2s",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>↑</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: t.text, marginBottom: 4 }}>Messages</div>
      <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 20 }}>
        {matches.length === 0 ? "Swipe to get your first match" : `${matches.length} match${matches.length > 1 ? "es" : ""}`}
      </div>
      {matches.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: t.textMuted }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
          <div style={{ fontSize: 15, color: t.textSub, marginBottom: 8 }}>No matches yet</div>
          <div style={{ fontSize: 13 }}>Keep swiping to find housemates!</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {matches.map(m => {
            const msgs = conversations[m.id] || [];
            const last = msgs[msgs.length - 1];
            return (
              <div key={m.id} onClick={() => setActiveChat(m)} style={{
                background: t.surface, borderRadius: 18, padding: "14px 16px",
                display: "flex", alignItems: "center", gap: 14,
                border: `1px solid ${t.border}`, cursor: "pointer", transition: "background 0.15s",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = t.surfaceHover)}
                onMouseLeave={e => (e.currentTarget.style.background = t.surface)}
              >
                <div style={{ position: "relative" }}>
                  <Avatar initials={m.avatar} color={m.color} size={52} />
                  <div style={{ position: "absolute", bottom: 2, right: 2, width: 12, height: 12, borderRadius: "50%", background: "#00e5a0", border: `2px solid ${t.card}` }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div style={{ fontWeight: 700, color: t.text, fontSize: 15 }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: t.textMuted }}>{last?.time || ""}</div>
                  </div>
                  <div style={{ fontSize: 12, color: t.textSub, marginTop: 2 }}>{m.compatibility}% match · {m.course}</div>
                  {last && (
                    <div style={{ fontSize: 12, color: t.textMuted, marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {last.from === "me" ? "You: " : ""}{last.text}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}