import { useState } from "react";
import type { Theme } from "../themes";

type Props = { t: Theme; theme: "dark" | "light"; setTheme: (t: "dark" | "light") => void };

type UserProfile = {
  name: string; age: string; course: string; year: string; uni: string;
  bio: string; budget: string; moveIn: string; cleanliness: number;
  guests: string; smoking: boolean; drinking: boolean; studyStyle: string;
  tags: string[]; color: string;
};

const DEFAULT: UserProfile = {
  name: "Your Name", age: "20", course: "Your Course", year: "1st Year",
  uni: "University of Manchester", bio: "Tell future housemates about yourself...",
  budget: "£500–£650/mo", moveIn: "Sept 2025", cleanliness: 3,
  guests: "Occasionally", smoking: false, drinking: false, studyStyle: "Library",
  tags: [], color: "#00e5a0",
};

const AVATAR_COLORS = ["#FF6B6B","#4ECDC4","#A29BFE","#FDCB6E","#fd79a8","#00cec9","#e17055","#74b9ff","#00e5a0"];
const TAG_OPTIONS = ["Early Bird","Night Owl","Clean Freak","Social","Introvert","Chef","Gym Goer","Cyclist","Eco-Conscious","Quiet","Gamer","Plant Parent"];
const YEAR_OPTIONS = ["1st Year","2nd Year","3rd Year","4th Year","Postgrad"];
const GUEST_OPTIONS = ["Never","Rarely","Occasionally","Often"];
const STUDY_OPTIONS = ["At home","Library","Café","Mix"];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", color: "rgba(128,128,128,0.8)", marginBottom: 6, textTransform: "uppercase" }}>{label}</div>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, t }: { value: string; onChange: (v: string) => void; placeholder?: string; t: Theme }) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: "100%", background: t.inputBg, border: `1px solid ${t.borderStrong}`, borderRadius: 12, padding: "10px 14px", color: t.text, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
  );
}

export default function ProfileScreen({ t, theme, setTheme }: Props) {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [profile, setProfile] = useState<UserProfile>(DEFAULT);
  const [draft, setDraft] = useState<UserProfile>(DEFAULT);

  const set = (key: keyof UserProfile) => (val: any) => setDraft(p => ({ ...p, [key]: val }));

  const toggleTag = (tag: string) => {
    setDraft(p => ({
      ...p,
      tags: p.tags.includes(tag) ? p.tags.filter(t => t !== tag) : [...p.tags, tag].slice(0, 5),
    }));
  };

  const initials = draft.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "ME";
  const savedInitials = profile.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "ME";

  const saveAndPreview = () => { setProfile(draft); setMode("view"); };
  const startEdit = () => { setDraft(profile); setMode("edit"); };

  // ── PREVIEW MODE ──
  if (mode === "view") {
    return (
      <div style={{ overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
        {/* Hero banner */}
        <div style={{ background: `linear-gradient(135deg, ${profile.color}33, ${profile.color}11)`, padding: "28px 20px 20px", borderBottom: `1px solid ${t.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            <div style={{
              width: 72, height: 72, borderRadius: 22,
              background: `linear-gradient(135deg, ${profile.color}, ${profile.color}88)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26, fontWeight: 900, color: "white",
              boxShadow: `0 8px 24px ${profile.color}55`,
            }}>{savedInitials}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: t.text }}>{profile.name}</div>
              <div style={{ fontSize: 13, color: t.textSub, marginTop: 2 }}>{profile.course} · {profile.year}</div>
              <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>📍 {profile.uni}</div>
            </div>
          </div>
          <div style={{ background: t.surface, borderRadius: 14, padding: "12px 14px", border: `1px solid ${t.border}` }}>
            <p style={{ margin: 0, fontSize: 13, color: t.textSub, lineHeight: 1.6, fontStyle: "italic" }}>"{profile.bio}"</p>
          </div>
        </div>

        <div style={{ padding: "16px 20px" }}>
          {/* Tags */}
          {profile.tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {profile.tags.map(tag => (
                <span key={tag} style={{ background: `${profile.color}22`, border: `1px solid ${profile.color}44`, borderRadius: 20, padding: "4px 14px", fontSize: 12, color: t.text, fontWeight: 600 }}>{tag}</span>
              ))}
            </div>
          )}

          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[
              ["💰", "Budget", profile.budget],
              ["📅", "Move-in", profile.moveIn],
              ["🧹", "Cleanliness", `${profile.cleanliness}/5`],
              ["🎭", "Guests", profile.guests],
              ["📚", "Study Style", profile.studyStyle],
              ["🎓", "Year", profile.year],
            ].map(([icon, label, val]) => (
              <div key={String(label)} style={{ background: t.surface, borderRadius: 14, padding: "12px 14px", border: `1px solid ${t.border}` }}>
                <div style={{ fontSize: 9, color: t.textMuted, letterSpacing: 1, marginBottom: 4 }}>{icon} {String(label).toUpperCase()}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Lifestyle flags */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <div style={{ flex: 1, background: profile.smoking ? "rgba(255,71,87,0.1)" : t.surface, border: `1px solid ${profile.smoking ? "rgba(255,71,87,0.3)" : t.border}`, borderRadius: 12, padding: "10px", textAlign: "center" }}>
              <div style={{ fontSize: 16, marginBottom: 4 }}>🚬</div>
              <div style={{ fontSize: 11, color: profile.smoking ? "#ff4757" : t.textMuted, fontWeight: 600 }}>{profile.smoking ? "Smoker" : "Non-smoker"}</div>
            </div>
            <div style={{ flex: 1, background: profile.drinking ? "rgba(116,185,255,0.1)" : t.surface, border: `1px solid ${profile.drinking ? "rgba(116,185,255,0.3)" : t.border}`, borderRadius: 12, padding: "10px", textAlign: "center" }}>
              <div style={{ fontSize: 16, marginBottom: 4 }}>🍺</div>
              <div style={{ fontSize: 11, color: profile.drinking ? "#74b9ff" : t.textMuted, fontWeight: 600 }}>{profile.drinking ? "Drinker" : "Non-drinker"}</div>
            </div>
          </div>

          {/* Theme + Edit */}
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            {(["dark", "light"] as const).map(th => (
              <button key={th} onClick={() => setTheme(th)} style={{
                flex: 1, padding: "10px", borderRadius: 12, border: `1px solid ${theme === th ? t.accentBorder : t.border}`,
                background: theme === th ? t.accentBg : t.surface, color: theme === th ? t.accent : t.textSub,
                fontWeight: 600, fontSize: 13, cursor: "pointer",
              }}>{th === "dark" ? "🌙 Dark" : "☀️ Light"}</button>
            ))}
          </div>

          <button onClick={startEdit} style={{
            width: "100%", padding: "14px", borderRadius: 16, border: "none",
            background: t.accent, color: "#0d1117", fontWeight: 800, fontSize: 15, cursor: "pointer",
          }}>✏️ Edit Profile</button>
        </div>
      </div>
    );
  }

  // ── EDIT MODE ──
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Edit header */}
      <div style={{ padding: "14px 20px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, background: t.headerBg }}>
        <button onClick={() => setMode("view")} style={{ background: "none", border: "none", cursor: "pointer", color: t.textMuted, fontSize: 14 }}>Cancel</button>
        <div style={{ fontWeight: 800, color: t.text, fontSize: 16 }}>Edit Profile</div>
        <button onClick={saveAndPreview} style={{ background: "none", border: "none", cursor: "pointer", color: t.accent, fontSize: 14, fontWeight: 700 }}>Save</button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
        {/* Avatar colour picker */}
        <Field label="Profile Colour">
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg, ${draft.color}, ${draft.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: "white" }}>{initials}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {AVATAR_COLORS.map(c => (
                <div key={c} onClick={() => set("color")(c)} style={{
                  width: 28, height: 28, borderRadius: "50%", background: c, cursor: "pointer",
                  border: draft.color === c ? `3px solid ${t.text}` : `3px solid transparent`,
                  boxSizing: "border-box", transition: "transform 0.15s",
                  transform: draft.color === c ? "scale(1.2)" : "scale(1)",
                }} />
              ))}
            </div>
          </div>
        </Field>

        <Field label="Full Name"><Input value={draft.name} onChange={set("name")} placeholder="e.g. Alex Johnson" t={t} /></Field>
        <Field label="Age"><Input value={draft.age} onChange={set("age")} placeholder="e.g. 21" t={t} /></Field>
        <Field label="University"><Input value={draft.uni} onChange={set("uni")} placeholder="e.g. University of Manchester" t={t} /></Field>
        <Field label="Course"><Input value={draft.course} onChange={set("course")} placeholder="e.g. Computer Science" t={t} /></Field>

        <Field label="Year">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {YEAR_OPTIONS.map(y => (
              <button key={y} onClick={() => set("year")(y)} style={{
                padding: "7px 14px", borderRadius: 20, border: `1px solid ${draft.year === y ? t.accentBorder : t.border}`,
                background: draft.year === y ? t.accentBg : t.surface, color: draft.year === y ? t.accent : t.textSub,
                fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}>{y}</button>
            ))}
          </div>
        </Field>

        <Field label="Bio">
          <textarea value={draft.bio} onChange={e => set("bio")(e.target.value)} rows={3}
            style={{ width: "100%", background: t.inputBg, border: `1px solid ${t.borderStrong}`, borderRadius: 12, padding: "10px 14px", color: t.text, fontSize: 13, outline: "none", resize: "none", lineHeight: 1.5, boxSizing: "border-box" }} />
        </Field>

        <Field label="Budget"><Input value={draft.budget} onChange={set("budget")} placeholder="e.g. £500–£650/mo" t={t} /></Field>
        <Field label="Move-in Date"><Input value={draft.moveIn} onChange={set("moveIn")} placeholder="e.g. Sept 2025" t={t} /></Field>

        <Field label={`Cleanliness: ${draft.cleanliness}/5`}>
          <input type="range" min={1} max={5} value={draft.cleanliness} onChange={e => set("cleanliness")(Number(e.target.value))}
            style={{ width: "100%", accentColor: t.accent }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: t.textMuted, marginTop: 4 }}>
            <span>Relaxed</span><span>Very tidy</span>
          </div>
        </Field>

        <Field label="Guests">
          <div style={{ display: "flex", gap: 8 }}>
            {GUEST_OPTIONS.map(g => (
              <button key={g} onClick={() => set("guests")(g)} style={{
                flex: 1, padding: "8px 4px", borderRadius: 12, border: `1px solid ${draft.guests === g ? t.accentBorder : t.border}`,
                background: draft.guests === g ? t.accentBg : t.surface, color: draft.guests === g ? t.accent : t.textSub,
                fontSize: 11, fontWeight: 600, cursor: "pointer",
              }}>{g}</button>
            ))}
          </div>
        </Field>

        <Field label="Study Style">
          <div style={{ display: "flex", gap: 8 }}>
            {STUDY_OPTIONS.map(s => (
              <button key={s} onClick={() => set("studyStyle")(s)} style={{
                flex: 1, padding: "8px 4px", borderRadius: 12, border: `1px solid ${draft.studyStyle === s ? t.accentBorder : t.border}`,
                background: draft.studyStyle === s ? t.accentBg : t.surface, color: draft.studyStyle === s ? t.accent : t.textSub,
                fontSize: 11, fontWeight: 600, cursor: "pointer",
              }}>{s}</button>
            ))}
          </div>
        </Field>

        <Field label="Lifestyle">
          <div style={{ display: "flex", gap: 10 }}>
            {[["🚬", "Smoker", "smoking"], ["🍺", "Drinker", "drinking"]].map(([icon, label, key]) => (
              <button key={key} onClick={() => set(key as keyof UserProfile)(!(draft as any)[key])} style={{
                flex: 1, padding: "10px", borderRadius: 12, cursor: "pointer", fontSize: 13, fontWeight: 600,
                border: `1px solid ${(draft as any)[key] ? t.accentBorder : t.border}`,
                background: (draft as any)[key] ? t.accentBg : t.surface,
                color: (draft as any)[key] ? t.accent : t.textSub,
              }}>{icon} {label}</button>
            ))}
          </div>
        </Field>

        <Field label={`Tags (pick up to 5 · ${draft.tags.length}/5)`}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {TAG_OPTIONS.map(tag => {
              const selected = draft.tags.includes(tag);
              return (
                <button key={tag} onClick={() => toggleTag(tag)} style={{
                  padding: "6px 14px", borderRadius: 20, border: `1px solid ${selected ? t.accentBorder : t.border}`,
                  background: selected ? t.accentBg : t.surface, color: selected ? t.accent : t.textSub,
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                }}>{tag}</button>
              );
            })}
          </div>
        </Field>

        <button onClick={saveAndPreview} style={{ width: "100%", padding: "14px", borderRadius: 16, border: "none", background: t.accent, color: "#0d1117", fontWeight: 800, fontSize: 15, cursor: "pointer", marginBottom: 20 }}>
          Save & Preview ✓
        </button>
      </div>
    </div>
  );
}