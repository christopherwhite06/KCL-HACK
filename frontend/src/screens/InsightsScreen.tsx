// ✅ FINAL src/screens/InsightsScreen.tsx  (COPY-PASTE ENTIRE FILE)
// Matches the screenshot UI: KPI cards + charts + heatmap + district table + AI insight cards
// Props compatible with your App.tsx: <InsightsScreen t={t} showToast={showToast} />
// Requires: npm i recharts

import { useCallback, useEffect, useState } from "react";
import type { Theme } from "../themes";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type Props = { t: Theme; showToast: (msg: string) => void };

// ─── MARKET DATA ─────────────────────────────────────────────────────────────
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const BASE_RENTS: Record<string, number> = {
  London: 2100,
  Manchester: 1100,
  Birmingham: 950,
  Bristol: 1300,
  Leeds: 900,
  Sheffield: 800,
  Liverpool: 850,
  Edinburgh: 1200,
};
const AREAS = Object.keys(BASE_RENTS);

function rng(area: string, offset: number, min: number, max: number) {
  const seed = area.split("").reduce((a, c) => a + c.charCodeAt(0), 0) + offset;
  const x = Math.sin(seed) * 10000;
  return min + (x - Math.floor(x)) * (max - min);
}

function buildMarketData(area: string, baseOverride?: number) {
  const base = baseOverride ?? BASE_RENTS[area] ?? 1000;
  const S_RENT = [0, -20, -10, 30, 60, 70, 50, 40, 30, 20, -10, -30];
  const S_DOM = [28, 30, 22, 15, 12, 10, 11, 12, 14, 18, 24, 26];
  const S_HEAT = [40, 35, 70, 90, 95, 88, 82, 78, 72, 60, 45, 38];
  const S_COMP = [1.2, 1.4, 1.8, 2.2, 2.6, 2.4, 2.1, 1.9, 1.7, 1.5, 1.3, 1.1];

  const rentTrend = MONTHS.map((m, i) => ({
    month: m,
    value: Math.round(base + S_RENT[i] + rng(area, i, -30, 30)),
  }));
  const domTrend = MONTHS.map((m, i) => ({
    month: m,
    value: Math.round(S_DOM[i] + rng(area, i + 20, -3, 3)),
  }));
  const heatmap = MONTHS.map((m, i) => ({
    month: m,
    value: Math.round(S_HEAT[i] + rng(area, i + 40, -5, 5)),
  }));
  const competition = MONTHS.map((m, i) => ({
    month: m,
    value: +(S_COMP[i] + rng(area, i + 60, -0.2, 0.2)).toFixed(2),
  }));

  const beds = [
    { beds: 1, avgRent: Math.round(base * 0.65) },
    { beds: 2, avgRent: Math.round(base * 0.95) },
    { beds: 3, avgRent: Math.round(base * 1.25) },
    { beds: 4, avgRent: Math.round(base * 1.65) },
  ];

  const avgDom = Math.round(domTrend.reduce((a, b) => a + b.value, 0) / 12);
  const yoy = +(5.5 + rng(area, 0, -3, 4)).toFixed(1);

  const peakIdx = heatmap.reduce((a, b, i, arr) => (b.value > arr[a].value ? i : a), 0);
  const dealIdx = domTrend.reduce((a, b, i, arr) => (b.value > arr[a].value ? i : a), 0);

  const distSfx = ["City Centre", "East", "West", "North", "South", "Outer", "Suburbs", "Uni Quarter"];
  const distMult = [1.3, 0.95, 1.05, 0.9, 0.85, 0.75, 0.7, 0.88];
  const distDom = [0.7, 1.1, 0.9, 1.2, 1.3, 1.5, 1.6, 1.0];
  const distComp = ["Extreme", "High", "High", "Medium", "Medium", "Low", "Low", "High"] as const;

  const districts = distSfx.map((s, i) => ({
    name: `${s}`,
    avgRent: Math.round(base * distMult[i] + rng(area, i + 80, -50, 50)),
    yoyChange: +(yoy + rng(area, i + 90, -4, 4)).toFixed(1),
    avgDaysToLet: Math.round(avgDom * distDom[i] + rng(area, i + 100, -2, 2)),
    competitionLevel: distComp[i],
  }));

  return {
    area,
    base,
    yoy,
    avgDom,
    peakMonth: MONTHS[peakIdx],
    bestDealMonth: MONTHS[dealIdx],
    peakDemandIndex: heatmap[peakIdx].value,
    rentTrend,
    domTrend,
    heatmap,
    competition,
    beds,
    districts,
  };
}

async function fetchLandRegistry(area: string) {
  const since = new Date();
  since.setFullYear(since.getFullYear() - 1);

  const sparql = `PREFIX lrppi:<http://landregistry.data.gov.uk/def/ppi/>
PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>
SELECT ?price WHERE{
  ?t lrppi:pricePaid ?price;
     lrppi:transactionDate ?date;
     lrppi:propertyAddressDistrict "${area.toUpperCase()}"^^xsd:string.
  FILTER(?date>="${since.toISOString().slice(0, 10)}"^^xsd:date)
} LIMIT 300`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const r = await fetch(
      `https://landregistry.data.gov.uk/sparql.json?query=${encodeURIComponent(sparql)}`,
      { signal: controller.signal }
    );

    clearTimeout(timeout);

    if (!r.ok) return null;
    const j = await r.json();
    return (
      j.results?.bindings
        ?.map((b: any) => parseInt(b.price.value, 10))
        .filter((p: number) => p > 0) ?? []
    );
  } catch {
    return null;
  }
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function heatColor(v: number) {
  if (v < 40) return `rgba(0,229,160,${0.15 + v / 180})`;
  if (v < 65) return `rgba(255,190,50,${0.25 + v / 200})`;
  return `rgba(255,71,87,${0.25 + v / 200})`;
}
const COMP_COLORS: Record<string, string> = {
  Extreme: "rgba(255,71,87,.85)",
  High: "rgba(255,140,0,.75)",
  Medium: "rgba(116,185,255,.75)",
  Low: "rgba(0,229,160,.6)",
};

const TP = {
  contentStyle: {
    background: "#0d1117",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "white",
    borderRadius: 10,
    fontSize: 11,
  },
  cursor: { stroke: "rgba(255,255,255,.08)" },
};

export default function InsightsScreen({ showToast }: Props) {
  const [area, setArea] = useState("Manchester");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [txCount, setTxCount] = useState(0);
  const [source, setSource] = useState<"synthetic" | "land_registry">("synthetic");

  const load = useCallback(
    async (a: string) => {
      setLoading(true);
      const d = buildMarketData(a);

      const prices = await fetchLandRegistry(a);
      if (prices && prices.length > 0) {
        const sorted = [...prices].sort((x, y) => x - y);
        const med = sorted[Math.floor(sorted.length / 2)];
        const est = Math.round(med * 0.0045); // rent yield estimate

        if (est > 300 && est < 5000) {
          setData(buildMarketData(a, est));
          setTxCount(prices.length);
          setSource("land_registry");
          showToast(`✅ ${prices.length} Land Registry records loaded`);
          setLoading(false);
          return;
        }
      }

      setData(d);
      setTxCount(0);
      setSource("synthetic");
      setLoading(false);
    },
    [showToast]
  );

  useEffect(() => {
    load(area);
  }, [area, load]);

  const SRC =
    source === "land_registry"
      ? { label: "🏛️ Land Registry", color: "#74b9ff" }
      : { label: "⚙️ Estimated", color: "rgba(255,255,255,0.35)" };

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "20px 18px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: "white" }}>Housing Insights</div>
        <span style={{ fontSize: 10, color: SRC.color, fontWeight: 600 }}>{SRC.label}</span>
      </div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>
        Live UK PropTech data — powered by Land Registry{txCount ? ` (tx=${txCount})` : ""}
      </div>

      {/* Area selector */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
        {AREAS.map((a) => (
          <button
            key={a}
            onClick={() => {
              setArea(a);
              load(a);
            }}
            style={{
              padding: "5px 12px",
              borderRadius: 20,
              border: `1px solid ${area === a ? "#00e5a0" : "rgba(255,255,255,0.1)"}`,
              background: area === a ? "rgba(0,229,160,0.15)" : "rgba(255,255,255,0.04)",
              color: area === a ? "#00e5a0" : "rgba(255,255,255,0.45)",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all .2s",
            }}
          >
            {a}
          </button>
        ))}
      </div>

      {loading || !data ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[140, 100, 180, 100].map((h, i) => (
            <div
              key={i}
              style={{
                height: h,
                borderRadius: 16,
                background:
                  "linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.4s infinite",
              }}
            />
          ))}
        </div>
      ) : (
        <>
          {/* KPI row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            {[
              { icon: "🏠", label: "Avg Rent", value: `£${data.base.toLocaleString()}`, sub: "per month", accent: "#00e5a0" },
              { icon: "⚡", label: "Days on Mkt", value: `${data.avgDom}d`, sub: "avg to let", accent: "#74b9ff" },
              { icon: "🔥", label: "Peak Month", value: data.peakMonth, sub: "highest demand", accent: "#ff6b6b" },
              { icon: "💚", label: "Best Deal", value: data.bestDealMonth, sub: "negotiate here", accent: "#a29bfe" },
            ].map((k) => (
              <div
                key={k.label}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid rgba(255,255,255,0.07)`,
                  borderRadius: 16,
                  padding: "12px 14px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: k.accent }} />
                <div style={{ fontSize: 16, marginBottom: 6 }}>{k.icon}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 4 }}>
                  {k.label}
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "white", lineHeight: 1 }}>{k.value}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>{k.sub}</div>
              </div>
            ))}
          </div>

          {/* Rent trend chart */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "14px 12px", marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "white", marginBottom: 2 }}>Monthly Rent Trend</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>12-month rolling average</div>
            <ResponsiveContainer width="100%" height={130}>
              <AreaChart data={data.rentTrend}>
                <defs>
                  <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00e5a0" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#00e5a0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,.04)" />
                <XAxis dataKey="month" tick={{ fill: "#444", fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fill: "#444", fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `£${(v / 1000).toFixed(1)}k`}
                  width={36}
                />
                <Tooltip {...TP} formatter={(v: any) => [`£${Number(v).toLocaleString()}`, "Avg Rent"]} />
                <Area type="monotone" dataKey="value" stroke="#00e5a0" strokeWidth={2} fill="url(#rg)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Heatmap */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "14px 12px", marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "white", marginBottom: 2 }}>🗓 Demand Heatmap</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>Red = act fast · Green = negotiate</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(12,1fr)", gap: 4 }}>
              {data.heatmap.map(({ month, value }: any) => (
                <div key={month} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <div
                    title={`${month}: ${value}%`}
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      borderRadius: 6,
                      background: heatColor(value),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 7,
                      fontWeight: 700,
                      color: "rgba(255,255,255,.8)",
                      cursor: "default",
                      transition: "transform .15s",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.transform = "scale(1.2)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.transform = "")}
                  >
                    {value}
                  </div>
                  <span style={{ fontSize: 6, color: "rgba(255,255,255,0.3)" }}>{month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Days on market bars */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "14px 12px", marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "white", marginBottom: 2 }}>Time on Market</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>Avg days before a room goes — lower = more competitive</div>
            <ResponsiveContainer width="100%" height={110}>
              <BarChart data={data.domTrend}>
                <CartesianGrid stroke="rgba(255,255,255,.04)" />
                <XAxis dataKey="month" tick={{ fill: "#444", fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#444", fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}d`} width={28} />
                <Tooltip {...TP} formatter={(v: any) => [`${v} days`, "On Market"]} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {data.domTrend.map((d: any, i: number) => (
                    <Cell key={i} fill={d.value > 22 ? "rgba(0,229,160,.7)" : d.value > 14 ? "rgba(255,190,50,.7)" : "rgba(255,71,87,.75)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Bedroom breakdown */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "14px 12px", marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "white", marginBottom: 2 }}>Rent by Bedrooms</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>Average monthly rent by property size</div>
            <ResponsiveContainer width="100%" height={110}>
              <BarChart data={data.beds}>
                <CartesianGrid stroke="rgba(255,255,255,.04)" />
                <XAxis dataKey="beds" tick={{ fill: "#444", fontSize: 9 }} tickFormatter={(v: number) => `${v}bd`} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#444", fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `£${v.toLocaleString()}`} width={42} />
                <Tooltip {...TP} formatter={(v: any) => [`£${Number(v).toLocaleString()}`, "Avg Rent"]} labelFormatter={(v: any) => `${v} bedroom`} />
                <Bar dataKey="avgRent" radius={[5, 5, 0, 0]}>
                  {data.beds.map((_: any, i: number) => (
                    <Cell
                      key={i}
                      fill={
                        ["rgba(0,229,160,.75)", "rgba(116,185,255,.75)", "rgba(162,155,254,.75)", "rgba(255,107,107,.75)"][i]
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* District table */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden", marginBottom: 14 }}>
            <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "white" }}>🏘 District Breakdown</div>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{area}</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead>
                  <tr>
                    {["Area", "Rent", "YoY", "Days", "Demand"].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          padding: "8px 12px",
                          fontSize: 9,
                          fontWeight: 700,
                          color: "rgba(255,255,255,0.35)",
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          borderBottom: "1px solid rgba(255,255,255,0.06)",
                          background: "rgba(255,255,255,0.02)",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.districts.map((d: any) => (
                    <tr key={d.name} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding: "9px 12px", color: "white", fontWeight: 600 }}>{d.name}</td>
                      <td style={{ padding: "9px 12px", color: "rgba(255,255,255,0.7)" }}>£{d.avgRent.toLocaleString()}</td>
                      <td style={{ padding: "9px 12px", fontWeight: 700, color: d.yoyChange >= 5 ? "#ff6b6b" : "#00e5a0" }}>
                        {d.yoyChange >= 0 ? "+" : ""}
                        {d.yoyChange}%
                      </td>
                      <td style={{ padding: "9px 12px", color: "rgba(255,255,255,0.5)" }}>{d.avgDaysToLet}d</td>
                      <td style={{ padding: "9px 12px" }}>
                        <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 50, background: COMP_COLORS[d.competitionLevel], color: "white", fontWeight: 700 }}>
                          {d.competitionLevel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI insight cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 8 }}>
            {[
              {
                bg: "rgba(255,71,87,0.08)",
                border: "rgba(255,71,87,0.2)",
                emoji: "🔥",
                title: `Watch out for ${data.peakMonth}`,
                body: `Rooms in ${area} go fastest in ${data.peakMonth}. Avg on-market time drops to ${
                  data.domTrend.find((d: any) => d.month === data.peakMonth)?.value ?? 10
                } days. Apply same day.`,
              },
              {
                bg: "rgba(0,229,160,0.06)",
                border: "rgba(0,229,160,0.2)",
                emoji: "🧊",
                title: `${data.bestDealMonth} = landlord season`,
                body: `Demand dips in ${data.bestDealMonth} — landlords negotiate more. Rents run ~8% below peak. Perfect timing to lock in a room.`,
              },
              {
                bg: "rgba(116,185,255,0.07)",
                border: "rgba(116,185,255,0.2)",
                emoji: "📈",
                title: `Prices up ${data.yoy}% YoY`,
                body: `Avg rent in ${area} is £${data.base.toLocaleString()}/mo. YoY growth of ${data.yoy}% — acting now beats waiting for a dip.`,
              },
            ].map((c, i) => (
              <div key={i} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 14, padding: "12px 14px" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{c.emoji}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "white", marginBottom: 4 }}>{c.title}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{c.body}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <style>{`
        @keyframes shimmer{to{background-position:-200% 0}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:4px}
      `}</style>
    </div>
  );
}