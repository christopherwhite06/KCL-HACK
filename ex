{/* PROPERTY TAB */}
{tab === "property" && (
  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    <div style={{ display: "flex", gap: 10 }}>
      <Badge icon="🔋" label={`EPC ${profile.epcGrade}`} sub="Energy Rating" good={["A","B","C"].includes(profile.epcGrade)} />
      <Badge icon="🛏️" label={`${profile.bedroomsAvailable} bed`} sub="Bedrooms available" good={profile.bedroomsAvailable >= 1} />
    </div>

    <div style={{ display: "flex", gap: 10 }}>
      <Badge icon="📍" label={profile.nearestLandmark} sub={`${profile.nearestLandmarkDistanceMin} min walk`} good={profile.nearestLandmarkDistanceMin <= 12} />
      <Badge icon="🚶" label={`${profile.commuteMin} min`} sub="To campus" good={profile.commuteMin <= 10} />
    </div>

    <div style={{ background: "rgba(116,185,255,0.1)", border: "1px solid rgba(116,185,255,0.25)", borderRadius: 14, padding: "14px 16px" }}>
      <div style={{ fontSize: 11, color: "rgba(116,185,255,0.8)", marginBottom: 6, fontWeight: 700 }}>💷 RENT FAIRNESS SCORE</div>
      <div style={{ fontSize: 26, fontWeight: 900, color: t.text }}>{profile.rentFairness}</div>
      <div style={{ fontSize: 11, color: t.textMuted, marginTop: 4 }}>vs. area average (Price Paid data)</div>
    </div>

    <div style={{ background: t.surface, borderRadius: 14, padding: "14px 16px" }}>
      <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 10, letterSpacing: 1 }}>EPC BAND</div>
      <div style={{ display: "flex", gap: 4 }}>
        {["A","B","C","D","E","F"].map(g => (
          <div key={g} style={{
            flex: 1, height: 28, borderRadius: 6,
            background: g === profile.epcGrade ? EPC_COLORS[g] : `${EPC_COLORS[g]}33`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 800,
            color: g === profile.epcGrade ? "white" : "rgba(255,255,255,0.3)",
            transform: g === profile.epcGrade ? "scaleY(1.15)" : "none",
            transition: "all 0.2s",
          }}>{g}</div>
        ))}
      </div>
    </div>
  </div>
)}
