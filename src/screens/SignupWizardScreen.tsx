import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import type { SignupData, YearOption } from "../auth/authStore";

const SOCIETY_CHOICES = [
  "Hackathon Society",
  "Film Club",
  "Gym / Fitness",
  "Football",
  "Debate",
  "Volunteering",
  "Cultural Society",
  "Gaming",
];

function defaultData(): SignupData {
  return {
    email: "",
    password: "",
    uniEmail: "",
    uniEmailVerified: false,

    name: "",
    age: "",

    university: "",
    year: "1",

    preferences: { vibe: "Balanced", societies: [] },

    house: { hasHouse: false },
  };
}

export default function SignupWizardScreen({ t }: { t: any }) {
  const nav = useNavigate();
  const { signup } = useAuth();

  const [step, setStep] = useState(1);
  const [data, setData] = useState<SignupData>(() => defaultData());
  const [err, setErr] = useState<string | null>(null);

  const progress = useMemo(() => Math.round((step / 5) * 100), [step]);

  const inputStyle: React.CSSProperties = {
    padding: 14,
    borderRadius: 16,
    border: `1px solid ${t.border}`,
    background: "rgba(255,255,255,0.05)",
    color: t.text,
    outline: "none",
  };

  const btnPrimary: React.CSSProperties = {
    padding: "14px 16px",
    borderRadius: 16,
    border: "none",
    cursor: "pointer",
    fontWeight: 900,
    flex: 1,
    background: t.accent,
    color: "#0d1117",
    transition: "transform 0.15s",
  };

  const btnGhost: React.CSSProperties = {
    padding: "14px 16px",
    borderRadius: 16,
    border: `1px solid ${t.border}`,
    background: "transparent",
    color: t.text,
    cursor: "pointer",
    fontWeight: 800,
    flex: 1,
  };

  const pillBase: React.CSSProperties = {
    padding: "10px 12px",
    borderRadius: 999,
    border: `1px solid ${t.border}`,
    background: "transparent",
    cursor: "pointer",
    fontWeight: 800,
    color: t.text,
  };

  function back() {
    setErr(null);
    if (step === 1) return nav("/");
    setStep((s) => s - 1);
  }

  function next() {
    setErr(null);

    if (step === 1) {
      if (!data.email || !data.password || !data.uniEmail) {
        return setErr("Fill email, password, and university email.");
      }
      if (!data.uniEmailVerified) return setErr("Verify your university email to continue.");
    }

    if (step === 2) {
      if (!data.name || !data.age) return setErr("Enter name and age.");
    }

    if (step === 3) {
      if (!data.university || !data.year) return setErr("Enter university and year.");
    }

    if (step < 5) setStep((s) => s + 1);
  }

  function finish() {
    setErr(null);
    const res = signup(data);
    if (!res.ok) return setErr(res.error);
    nav("/app");
  }

  const canVerifyUniEmail = Boolean(data.uniEmail);

  return (
    <div
      style={{
        padding: "22px 24px",
        height: "100%",
        overflowY: "auto",
        color: t.text,
      }}
    >
      {/* Back */}
      <button
        onClick={back}
        style={{
          background: "transparent",
          color: t.muted,
          border: "none",
          cursor: "pointer",
          fontSize: 13,
          opacity: 0.9,
        }}
      >
        ← Back
      </button>

      {/* Title + progress */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 10 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900 }}>Sign up</div>
          <div style={{ fontSize: 12, color: t.muted, marginTop: 4 }}>
            Step {step} of 5
          </div>
        </div>
        <div style={{ fontSize: 12, color: t.muted, fontWeight: 900 }}>{progress}%</div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 7,
          background: "rgba(255,255,255,0.10)",
          borderRadius: 999,
          marginTop: 12,
          overflow: "hidden",
          border: `1px solid ${t.border}`,
        }}
      >
        <div style={{ height: "100%", width: `${progress}%`, background: t.accent }} />
      </div>

      {/* Content card */}
      <div
        style={{
          marginTop: 16,
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${t.border}`,
          borderRadius: 18,
          padding: 16,
        }}
      >
        {/* STEP 1 */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 13, color: t.muted, lineHeight: 1.5 }}>
              Create your account and verify your university email (demo: use <b>.ac.uk</b> or <b>.edu</b>).
            </div>

            <input
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              placeholder="Account email"
              style={inputStyle}
            />

            <input
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              placeholder="Password"
              type="password"
              style={inputStyle}
            />

            <input
              value={data.uniEmail}
              onChange={(e) =>
                setData({ ...data, uniEmail: e.target.value, uniEmailVerified: false })
              }
              placeholder="University email (e.g. you@uni.ac.uk)"
              style={inputStyle}
            />

            <button
              onClick={() => {
                setErr(null);
                const lower = data.uniEmail.toLowerCase();
                const ok = lower.includes(".ac.uk") || lower.includes(".edu");
                if (!ok) return setErr("For demo verify: use a .ac.uk or .edu email.");
                setData({ ...data, uniEmailVerified: true });
              }}
              disabled={!canVerifyUniEmail}
              style={{
                ...btnGhost,
                opacity: canVerifyUniEmail ? 1 : 0.5,
                borderColor: data.uniEmailVerified ? t.accent : t.border,
                color: data.uniEmailVerified ? t.accent : t.text,
              }}
            >
              {data.uniEmailVerified ? "Verified ✅" : "Verify uni email"}
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 13, color: t.muted }}>Tell us about you.</div>

            <input
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              placeholder="Full name"
              style={inputStyle}
            />

            <input
              value={data.age}
              onChange={(e) =>
                setData({ ...data, age: e.target.value.replace(/[^\d]/g, "") })
              }
              placeholder="Age"
              style={inputStyle}
            />
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 13, color: t.muted }}>Where do you study?</div>

            <input
              value={data.university}
              onChange={(e) => setData({ ...data, university: e.target.value })}
              placeholder="University name"
              style={inputStyle}
            />

            <select
              value={data.year}
              onChange={(e) => setData({ ...data, year: e.target.value as YearOption })}
              style={inputStyle}
            >
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="Masters">Masters</option>
              <option value="PhD">PhD</option>
            </select>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <div style={{ fontWeight: 900, marginBottom: 8 }}>Vibe</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {(["Quiet", "Social", "Balanced"] as const).map((v) => {
                  const active = data.preferences.vibe === v;
                  return (
                    <button
                      key={v}
                      onClick={() =>
                        setData({ ...data, preferences: { ...data.preferences, vibe: v } })
                      }
                      style={{
                        ...pillBase,
                        borderColor: active ? t.accent : t.border,
                        background: active ? "rgba(0,229,160,0.12)" : "transparent",
                        color: active ? t.accent : t.text,
                      }}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 900, marginBottom: 8 }}>Societies</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {SOCIETY_CHOICES.map((s) => {
                  const active = data.preferences.societies.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() =>
                        setData({
                          ...data,
                          preferences: {
                            ...data.preferences,
                            societies: active
                              ? data.preferences.societies.filter((x) => x !== s)
                              : [...data.preferences.societies, s],
                          },
                        })
                      }
                      style={{
                        ...pillBase,
                        borderColor: active ? t.accent : t.border,
                        background: active ? "rgba(0,229,160,0.12)" : "transparent",
                        color: active ? t.accent : t.text,
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: t.muted }}>
                Pick a few — this helps match you with compatible housemates.
              </div>
            </div>
          </div>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontWeight: 900 }}>House listing (optional)</div>
            <div style={{ fontSize: 12, color: t.muted, lineHeight: 1.5 }}>
              If you already have a place, add it now. Otherwise you can skip.
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setData({ ...data, house: { hasHouse: false } })}
                style={{
                  ...pillBase,
                  flex: 1,
                  borderColor: !data.house.hasHouse ? t.accent : t.border,
                  color: !data.house.hasHouse ? t.accent : t.text,
                  background: !data.house.hasHouse ? "rgba(0,229,160,0.10)" : "transparent",
                }}
              >
                Skip
              </button>
              <button
                onClick={() => setData({ ...data, house: { ...data.house, hasHouse: true } })}
                style={{
                  ...pillBase,
                  flex: 1,
                  borderColor: data.house.hasHouse ? t.accent : t.border,
                  color: data.house.hasHouse ? t.accent : t.text,
                  background: data.house.hasHouse ? "rgba(0,229,160,0.10)" : "transparent",
                }}
              >
                I have a listing
              </button>
            </div>

            {data.house.hasHouse && (
              <>
                <input
                  value={data.house.location ?? ""}
                  onChange={(e) =>
                    setData({ ...data, house: { ...data.house, location: e.target.value } })
                  }
                  placeholder="Location (e.g. Rusholme)"
                  style={inputStyle}
                />
                <input
                  value={data.house.rent ?? ""}
                  onChange={(e) =>
                    setData({ ...data, house: { ...data.house, rent: e.target.value } })
                  }
                  placeholder="Rent (e.g. £650)"
                  style={inputStyle}
                />
                <input
                  value={data.house.roomsAvailable ?? ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      house: { ...data.house, roomsAvailable: e.target.value },
                    })
                  }
                  placeholder="Rooms available (e.g. 2)"
                  style={inputStyle}
                />
                <input
                  value={data.house.bathrooms ?? ""}
                  onChange={(e) =>
                    setData({ ...data, house: { ...data.house, bathrooms: e.target.value } })
                  }
                  placeholder="Bathrooms (e.g. 1)"
                  style={inputStyle}
                />

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ fontWeight: 900, fontSize: 13 }}>Upload an image</div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        setData({
                          ...data,
                          house: { ...data.house, imageDataUrl: String(reader.result) },
                        });
                      };
                      reader.readAsDataURL(file);
                    }}
                    style={{ color: t.muted }}
                  />
                </div>

                {data.house.imageDataUrl && (
                  <img
                    src={data.house.imageDataUrl}
                    alt="House preview"
                    style={{
                      width: "100%",
                      borderRadius: 16,
                      border: `1px solid ${t.border}`,
                      marginTop: 6,
                    }}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>

      {err && (
        <div style={{ color: "#ff6b6b", fontSize: 13, marginTop: 12 }}>{err}</div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        {step < 5 ? (
          <button onClick={next} style={btnPrimary}>
            Continue
          </button>
        ) : (
          <button onClick={finish} style={btnPrimary}>
            Create account
          </button>
        )}

        {step === 5 && (
          <button onClick={finish} style={btnGhost}>
            Skip & finish
          </button>
        )}
      </div>

      <div style={{ marginTop: 14, fontSize: 11, color: t.muted }}>
        Demo auth (localStorage). You can replace signup/login with Firebase later.
      </div>
    </div>
  );
}