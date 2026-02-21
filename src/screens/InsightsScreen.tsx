import type { Theme } from "../themes";

type Props = { t: Theme };

const INSIGHTS = [
  { title: "🌊 Flood Risk Heatmap", sub: "Manchester: 78% Low Risk zones", color: "#74b9ff", detail: "Based on Environment Agency flood polygon data" },
  { title: "🔋 Greenest Student Areas", sub: "Didsbury avg EPC: B · Chorlton: C+", color: "#00e5a0", detail: "Calculated from 12,400 EPC certificates" },
  { title: "🏗 HMO Approval Hotspots", sub: "Fallowfield: High demand · Article 4 active", color: "#a29bfe", detail: "IBex planning application intelligence" },
  { title: "📈 Rising Rent Alert", sub: "Victoria Park up 11% YoY", color: "#ffeaa7", detail: "Price Paid data + rental yield analysis" },
  { title: "🚌 Best Commute Zones", sub: "Top pick: Rusholme · 9 min avg", color: "#fd79a8", detail: "OS Data Hub routing + transport frequency" },
];

export default function InsightsScreen({ t }: Props) {
  return (
    <div style={{ padding: "20px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: t.text, marginBottom: 4 }}>Housing Insights</div>
      <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 20 }}>Powered by live UK PropTech datasets</div>
      {INSIGHTS.map(({ title, sub, color, detail }) => (
        <div key={title} style={{ background: t.surface, borderRadius: 16, padding: 16, marginBottom: 12, border: `1px solid ${t.border}` }}>
          <div style={{ fontWeight: 700, color: t.text, fontSize: 14, marginBottom: 4 }}>{title}</div>
          <div style={{ fontSize: 13, color, fontWeight: 600, marginBottom: 6 }}>{sub}</div>
          <div style={{ fontSize: 11, color: t.textMuted }}>{detail}</div>
        </div>
      ))}
    </div>
  );
}
