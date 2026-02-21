type ScoreRingProps = { value: number; label: string; color: string };

export default function ScoreRing({ value, label, color }: ScoreRingProps) {
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
