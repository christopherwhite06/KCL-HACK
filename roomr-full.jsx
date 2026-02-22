import { useState, useRef, useCallback, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

// ─── PROFILES ────────────────────────────────────────────────────────────────
const PROFILES = [
  {
    id: 1, name: "Jasmine K.", age: 20, course: "Computer Science", year: "2nd Year",
    uni: "University of Manchester", budget: "£550–£700/mo", moveIn: "Sept 2025",
    bio: "Night owl coder, clean kitchen obsessive, love hosting film nights. Looking for housemates who won't judge my 2am cooking.",
    compatibility: 94, lifestyleMatch: 97, propertyMatch: 88,
    tags: ["Night Owl", "Clean Freak", "Social", "Cyclist"],
    epcGrade: "B", floodRisk: "Low", hmoStatus: "Approved Zone", rentFairness: "+2% avg",
    commuteMin: 8, avatar: "JK", color: "#FF6B6B",
    societies: ["Hackathon Society", "Film Club"], cleanliness: 4, guests: "Occasionally",
  },
  {
    id: 2, name: "Marcus T.", age: 22, course: "Architecture", year: "3rd Year",
    uni: "University of Manchester", budget: "£600–£750/mo", moveIn: "Aug 2025",
    bio: "Library warrior by day, amateur chef by night. Need quiet study space but always down for a Sunday roast.",
    compatibility: 82, lifestyleMatch: 78, propertyMatch: 91,
    tags: ["Early Bird", "Chef", "Quiet", "Gym Goer"],
    epcGrade: "C", floodRisk: "Low", hmoStatus: "Approved Zone", rentFairness: "-4% avg",
    commuteMin: 12, avatar: "MT", color: "#4ECDC4",
    societies: ["Architecture Society", "Food Society"], cleanliness: 3, guests: "Rarely",
  },
  {
    id: 3, name: "Priya S.", age: 21, course: "Medicine", year: "2nd Year",
    uni: "University of Manchester", budget: "£500–£650/mo", moveIn: "Sept 2025",
    bio: "Med student with erratic schedules. Respectful of sleep and space. Absolutely love plants and a clean home.",
    compatibility: 76, lifestyleMatch: 72, propertyMatch: 85,
    tags: ["Eco-Conscious", "Plant Mum", "Clean", "Introvert"],
    epcGrade: "A", floodRisk: "Low", hmoStatus: "Restricted Zone", rentFairness: "+6% avg",
    commuteMin: 6, avatar: "PS", color: "#A29BFE",
    societies: ["MedSoc", "Environmental Society"], cleanliness: 5, guests: "Rarely",
  },
];

const EPC_COLORS = { A: "#00a550", B: "#50b747", C: "#b2d234", D: "#fff200", E: "#f7941d", F: "#f15a29" };

// ─── MARKET DATA ─────────────────────────────────────────────────────────────
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const BASE_RENTS = { London:2100,Manchester:1100,Birmingham:950,Bristol:1300,Leeds:900,Sheffield:800,Liverpool:850,Edinburgh:1200 };
const AREAS = Object.keys(BASE_RENTS);

function rng(area, offset, min, max) {
  const seed = area.split("").reduce((a,c)=>a+c.charCodeAt(0),0)+offset;
  const x = Math.sin(seed)*10000;
  return min+((x-Math.floor(x))*(max-min));
}
function buildMarketData(area, baseOverride) {
  const base = baseOverride ?? BASE_RENTS[area] ?? 1000;
  const S_RENT=[0,-20,-10,30,60,70,50,40,30,20,-10,-30];
  const S_DOM=[28,30,22,15,12,10,11,12,14,18,24,26];
  const S_HEAT=[40,35,70,90,95,88,82,78,72,60,45,38];
  const S_COMP=[1.2,1.4,1.8,2.2,2.6,2.4,2.1,1.9,1.7,1.5,1.3,1.1];
  const rentTrend=MONTHS.map((m,i)=>({month:m,value:Math.round(base+S_RENT[i]+rng(area,i,-30,30))}));
  const domTrend=MONTHS.map((m,i)=>({month:m,value:Math.round(S_DOM[i]+rng(area,i+20,-3,3))}));
  const heatmap=MONTHS.map((m,i)=>({month:m,value:Math.round(S_HEAT[i]+rng(area,i+40,-5,5))}));
  const competition=MONTHS.map((m,i)=>({month:m,value:+(S_COMP[i]+rng(area,i+60,-0.2,0.2)).toFixed(2)}));
  const beds=[{beds:1,avgRent:Math.round(base*.65)},{beds:2,avgRent:Math.round(base*.95)},{beds:3,avgRent:Math.round(base*1.25)},{beds:4,avgRent:Math.round(base*1.65)}];
  const avgDom=Math.round(domTrend.reduce((a,b)=>a+b.value,0)/12);
  const yoy=+(5.5+rng(area,0,-3,4)).toFixed(1);
  const peakIdx=heatmap.reduce((a,b,i,arr)=>b.value>arr[a].value?i:a,0);
  const dealIdx=domTrend.reduce((a,b,i,arr)=>b.value>arr[a].value?i:a,0);
  const distSfx=["City Centre","East","West","North","South","Outer","Suburbs","Uni Quarter"];
  const distMult=[1.3,0.95,1.05,0.9,0.85,0.75,0.7,0.88];
  const distDom=[0.7,1.1,0.9,1.2,1.3,1.5,1.6,1.0];
  const distComp=["Extreme","High","High","Medium","Medium","Low","Low","High"];
  const districts=distSfx.map((s,i)=>({name:`${s}`,avgRent:Math.round(base*distMult[i]+rng(area,i+80,-50,50)),yoyChange:+(yoy+rng(area,i+90,-4,4)).toFixed(1),avgDaysToLet:Math.round(avgDom*distDom[i]+rng(area,i+100,-2,2)),competitionLevel:distComp[i]}));
  return {area,base,yoy,avgDom,peakMonth:MONTHS[peakIdx],bestDealMonth:MONTHS[dealIdx],peakDemandIndex:heatmap[peakIdx].value,rentTrend,domTrend,heatmap,competition,beds,districts};
}

async function fetchLandRegistry(area) {
  const since=new Date(); since.setFullYear(since.getFullYear()-1);
  const sparql=`PREFIX lrppi:<http://landregistry.data.gov.uk/def/ppi/>
PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>
SELECT ?price WHERE{?t lrppi:pricePaid ?price;lrppi:transactionDate ?date;lrppi:propertyAddressDistrict "${area.toUpperCase()}"^^xsd:string.FILTER(?date>="${since.toISOString().slice(0,10)}"^^xsd:date)}LIMIT 300`;
  try {
    const r=await fetch(`https://landregistry.data.gov.uk/sparql.json?query=${encodeURIComponent(sparql)}`,{signal:AbortSignal.timeout(6000)});
    if(!r.ok) return null;
    const j=await r.json();
    return j.results?.bindings?.map(b=>parseInt(b.price.value,10)).filter(p=>p>0)??[];
  } catch { return null; }
}

// ─── ANNOUNCEMENTS SEED ──────────────────────────────────────────────────────
const SEED_ANNS = [
  {id:"1",cat:"market",icon:"📊",pinned:true, title:"Spring 2025: Manchester rents hit £1,180/mo average", body:"Analysis of 2,800 Land Registry transactions shows Manchester average rent up 6.4% YoY. Fallowfield and Rusholme seeing highest demand. February–April is peak competition window.",createdAt:new Date(Date.now()-2*3600000).toISOString(),author:"Roomr AI"},
  {id:"2",cat:"hot",  icon:"🚨",pinned:false,title:"ALERT: Fallowfield rooms going in under 4 days!", body:"Live data shows student HMO listings in Fallowfield averaging just 3.8 days before going off market. If you see a good listing, apply same day — don't wait.",createdAt:new Date(Date.now()-6*3600000).toISOString(),author:"Roomr AI"},
  {id:"3",cat:"tip",  icon:"💡",pinned:false,title:"November–January is landlord negotiation season", body:"Our 12-month analysis confirms Q4 listings stay up 40% longer than spring. Use this window to negotiate lower rents or better contracts before the September rush kicks in.",createdAt:new Date(Date.now()-86400000).toISOString(),author:"Roomr AI"},
  {id:"4",cat:"market",icon:"📈",pinned:false,title:"Didsbury EPC upgrade trend: 34% now rated B or above", body:"Post-insulation retrofit grants are improving energy ratings across South Manchester. EPC B homes save students an estimated £320/year vs. average stock. Filter by EPC on profiles.",createdAt:new Date(Date.now()-2*86400000).toISOString(),author:"Roomr AI"},
  {id:"5",cat:"news", icon:"📰",pinned:false,title:"Renters Reform Bill: no-fault evictions to be abolished", body:"The Renters Rights Bill progressing through Parliament will abolish Section 21 no-fault evictions. Roomr will flag compliant landlords. Expected to pass mid-2025 — better protection for all students.",createdAt:new Date(Date.now()-3*86400000).toISOString(),author:"Roomr AI"},
  {id:"6",cat:"tip",  icon:"💡",pinned:false,title:"Use the Demand Heatmap to time your search", body:"Check the monthly heatmap on the Insights tab before you start your search. Red months = act the same day. Green months = you can negotiate. Timing alone can save £50–80/month.",createdAt:new Date(Date.now()-4*86400000).toISOString(),author:"Roomr AI"},
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function timeAgo(iso) {
  const d=(Date.now()-new Date(iso).getTime())/1000;
  if(d<60)return"Just now";if(d<3600)return`${Math.floor(d/60)}m ago`;
  if(d<86400)return`${Math.floor(d/3600)}h ago`;return`${Math.floor(d/86400)}d ago`;
}
function heatColor(v) {
  if(v<40)return`rgba(0,229,160,${.15+v/180})`;
  if(v<65)return`rgba(255,190,50,${.25+v/200})`;
  return`rgba(255,71,87,${.25+v/200})`;
}
const COMP_COLORS={Extreme:"rgba(255,71,87,.85)",High:"rgba(255,140,0,.75)",Medium:"rgba(116,185,255,.75)",Low:"rgba(0,229,160,.6)"};
const TAG_STYLES={
  market:{bg:"rgba(116,185,255,.12)",color:"#74b9ff",border:"rgba(116,185,255,.3)"},
  hot:   {bg:"rgba(255,71,87,.12)",  color:"#ff4757",border:"rgba(255,71,87,.3)"},
  tip:   {bg:"rgba(0,229,160,.1)",   color:"#00e5a0",border:"rgba(0,229,160,.3)"},
  news:  {bg:"rgba(162,155,254,.12)",color:"#a29bfe",border:"rgba(162,155,254,.3)"},
};
const TAG_LABELS={market:"📊 Market",hot:"🔥 Alert",tip:"💡 Tip",news:"📰 News"};
const ICON_BG={
  market:"linear-gradient(135deg,rgba(116,185,255,.25),rgba(0,229,160,.15))",
  hot:   "linear-gradient(135deg,rgba(255,71,87,.25),rgba(255,140,0,.15))",
  tip:   "linear-gradient(135deg,rgba(0,229,160,.2),rgba(116,185,255,.12))",
  news:  "linear-gradient(135deg,rgba(162,155,254,.25),rgba(116,185,255,.15))",
};

const TP={contentStyle:{background:"#0d1117",border:"1px solid rgba(255,255,255,0.1)",color:"white",borderRadius:10,fontSize:11},cursor:{stroke:"rgba(255,255,255,.08)"}};

// ─── SWIPE CARD COMPONENTS ───────────────────────────────────────────────────
function ScoreRing({ value, label, color }) {
  const r=20,circ=2*Math.PI*r,dash=(value/100)*circ;
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
      <svg width={54} height={54} viewBox="0 0 54 54">
        <circle cx={27} cy={27} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={5}/>
        <circle cx={27} cy={27} r={r} fill="none" stroke={color} strokeWidth={5} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform="rotate(-90 27 27)" style={{transition:"stroke-dasharray 1s ease"}}/>
        <text x={27} y={31} textAnchor="middle" fill="white" fontSize={11} fontWeight="700">{value}%</text>
      </svg>
      <span style={{fontSize:9,color:"rgba(255,255,255,0.6)",letterSpacing:"0.08em",textTransform:"uppercase"}}>{label}</span>
    </div>
  );
}

function Badge({ icon, label, sub, good }) {
  return (
    <div style={{background:good?"rgba(0,229,160,0.12)":"rgba(255,107,107,0.12)",border:`1px solid ${good?"rgba(0,229,160,0.3)":"rgba(255,107,107,0.3)"}`,borderRadius:10,padding:"6px 10px",display:"flex",alignItems:"center",gap:6,flex:1}}>
      <span style={{fontSize:14}}>{icon}</span>
      <div>
        <div style={{fontSize:10,fontWeight:700,color:good?"#00e5a0":"#ff6b6b"}}>{label}</div>
        <div style={{fontSize:9,color:"rgba(255,255,255,0.5)"}}>{sub}</div>
      </div>
    </div>
  );
}

function SwipeCard({ profile, onSwipe, zIndex, offset }) {
  const [dragging,setDragging]=useState(false);
  const [pos,setPos]=useState({x:0,y:0});
  const [tab,setTab]=useState("profile");
  const startRef=useRef(null);
  const handleStart=(x,y)=>{startRef.current={x,y};setDragging(true)};
  const handleMove=(x,y)=>{if(!dragging||!startRef.current)return;setPos({x:x-startRef.current.x,y:y-startRef.current.y})};
  const handleEnd=()=>{setDragging(false);if(Math.abs(pos.x)>100){onSwipe(pos.x>0?"right":"left")}else{setPos({x:0,y:0})}};
  const rotation=pos.x*0.08;
  const likeOpacity=Math.max(0,Math.min(1,pos.x/80));
  const nopeOpacity=Math.max(0,Math.min(1,-pos.x/80));

  return (
    <div
      onMouseDown={e=>handleStart(e.clientX,e.clientY)}
      onMouseMove={e=>handleMove(e.clientX,e.clientY)}
      onMouseUp={handleEnd} onMouseLeave={handleEnd}
      onTouchStart={e=>handleStart(e.touches[0].clientX,e.touches[0].clientY)}
      onTouchMove={e=>{e.preventDefault();handleMove(e.touches[0].clientX,e.touches[0].clientY)}}
      onTouchEnd={handleEnd}
      style={{position:"absolute",width:"100%",height:"100%",transform:`translateX(calc(${pos.x}px + ${offset*8}px)) translateY(${offset*6}px) rotate(${rotation+offset*2}deg) scale(${1-offset*0.04})`,transition:dragging?"none":"transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275)",cursor:dragging?"grabbing":"grab",zIndex,userSelect:"none",touchAction:"none",borderRadius:28,background:"linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",border:"1px solid rgba(255,255,255,0.08)",boxShadow:"0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{position:"absolute",top:24,left:24,zIndex:10,opacity:likeOpacity,transform:"rotate(-20deg)",border:"3px solid #00e5a0",borderRadius:8,padding:"4px 14px",color:"#00e5a0",fontWeight:900,fontSize:22,letterSpacing:2}}>MATCH</div>
      <div style={{position:"absolute",top:24,right:24,zIndex:10,opacity:nopeOpacity,transform:"rotate(20deg)",border:"3px solid #ff4757",borderRadius:8,padding:"4px 14px",color:"#ff4757",fontWeight:900,fontSize:22,letterSpacing:2}}>PASS</div>
      <div style={{padding:"28px 24px 20px",display:"flex",alignItems:"center",gap:16,background:`linear-gradient(135deg, ${profile.color}22, transparent)`,borderBottom:"1px solid rgba(255,255,255,0.06)",flexShrink:0}}>
        <div style={{width:64,height:64,borderRadius:20,background:`linear-gradient(135deg, ${profile.color}, ${profile.color}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:800,color:"white",boxShadow:`0 8px 24px ${profile.color}44`,flexShrink:0}}>{profile.avatar}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"baseline",gap:8}}>
            <span style={{fontSize:20,fontWeight:800,color:"white"}}>{profile.name}</span>
            <span style={{fontSize:14,color:"rgba(255,255,255,0.4)"}}>{profile.age}</span>
          </div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.55)",marginTop:2}}>{profile.course} · {profile.year}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",marginTop:1}}>📍 {profile.uni}</div>
        </div>
        <div style={{background:"rgba(0,229,160,0.15)",border:"1px solid rgba(0,229,160,0.4)",borderRadius:12,padding:"8px 12px",textAlign:"center",flexShrink:0}}>
          <div style={{fontSize:20,fontWeight:900,color:"#00e5a0"}}>{profile.compatibility}%</div>
          <div style={{fontSize:9,color:"rgba(0,229,160,0.7)",letterSpacing:1}}>MATCH</div>
        </div>
      </div>
      <div style={{display:"flex",borderBottom:"1px solid rgba(255,255,255,0.06)",flexShrink:0}}>
        {["profile","property","insights"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"12px 0",background:"none",border:"none",cursor:"pointer",fontSize:11,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:tab===t?"#00e5a0":"rgba(255,255,255,0.35)",borderBottom:tab===t?"2px solid #00e5a0":"2px solid transparent",transition:"all 0.2s"}}>
            {t==="profile"?"👤 Profile":t==="property"?"🏠 Property":"📊 Data"}
          </button>
        ))}
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"20px 22px"}}>
        {tab==="profile"&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={{display:"flex",justifyContent:"space-around",padding:"8px 0"}}>
              <ScoreRing value={profile.lifestyleMatch} label="Lifestyle" color="#00e5a0"/>
              <ScoreRing value={profile.propertyMatch} label="Property" color="#74b9ff"/>
              <ScoreRing value={Math.round((profile.lifestyleMatch+profile.propertyMatch)/2)} label="Overall" color={profile.color}/>
            </div>
            <div style={{background:"rgba(255,255,255,0.04)",borderRadius:14,padding:"14px 16px"}}>
              <p style={{margin:0,fontSize:13,lineHeight:1.6,color:"rgba(255,255,255,0.75)",fontStyle:"italic"}}>"{profile.bio}"</p>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {profile.tags.map(t=>(
                <span key={t} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:"4px 12px",fontSize:12,color:"rgba(255,255,255,0.7)"}}>{t}</span>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[["💰","Budget",profile.budget],["📅","Move-in",profile.moveIn],["🧹","Cleanliness",`${profile.cleanliness}/5`],["🎭","Guests",profile.guests]].map(([icon,label,val])=>(
                <div key={label} style={{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"10px 12px"}}>
                  <div style={{fontSize:9,color:"rgba(255,255,255,0.4)",letterSpacing:1,marginBottom:4}}>{icon} {label.toUpperCase()}</div>
                  <div style={{fontSize:13,fontWeight:600,color:"white"}}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab==="property"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{display:"flex",gap:10}}><Badge icon="🔋" label={`EPC ${profile.epcGrade}`} sub="Energy Rating" good={["A","B","C"].includes(profile.epcGrade)}/><Badge icon="🌊" label={profile.floodRisk} sub="Flood Risk" good={profile.floodRisk==="Low"}/></div>
            <div style={{display:"flex",gap:10}}><Badge icon="🏗" label={profile.hmoStatus} sub="Article 4" good={profile.hmoStatus==="Approved Zone"}/><Badge icon="🚶" label={`${profile.commuteMin} min`} sub="To campus" good={profile.commuteMin<=10}/></div>
            <div style={{background:"rgba(116,185,255,0.1)",border:"1px solid rgba(116,185,255,0.25)",borderRadius:14,padding:"14px 16px"}}>
              <div style={{fontSize:11,color:"rgba(116,185,255,0.8)",marginBottom:6,fontWeight:700}}>💷 RENT FAIRNESS SCORE</div>
              <div style={{fontSize:26,fontWeight:900,color:"white"}}>{profile.rentFairness}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.45)",marginTop:4}}>vs. area average (Price Paid data)</div>
            </div>
            <div style={{background:"rgba(255,255,255,0.04)",borderRadius:14,padding:"14px 16px"}}>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:10,letterSpacing:1}}>EPC BAND</div>
              <div style={{display:"flex",gap:4}}>
                {["A","B","C","D","E","F"].map(g=>(
                  <div key={g} style={{flex:1,height:28,borderRadius:6,background:g===profile.epcGrade?EPC_COLORS[g]:`${EPC_COLORS[g]}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:g===profile.epcGrade?"white":"rgba(255,255,255,0.3)",transform:g===profile.epcGrade?"scaleY(1.15)":"none",transition:"all 0.2s"}}>{g}</div>
                ))}
              </div>
            </div>
          </div>
        )}
        {tab==="insights"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{background:"rgba(0,229,160,0.06)",border:"1px solid rgba(0,229,160,0.15)",borderRadius:14,padding:"14px 16px"}}>
              <div style={{fontSize:11,color:"rgba(0,229,160,0.7)",fontWeight:700,letterSpacing:1,marginBottom:8}}>🤝 COMPATIBILITY BREAKDOWN</div>
              {[["Lifestyle & Habits",profile.lifestyleMatch,"#00e5a0"],["Budget Overlap",91,"#74b9ff"],["Property Preferences",profile.propertyMatch,"#a29bfe"],["Sustainability Alignment",88,"#55efc4"],["Schedule Similarity",79,"#ffeaa7"]].map(([label,val,color])=>(
                <div key={label} style={{marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:11,color:"rgba(255,255,255,0.6)"}}>{label}</span>
                    <span style={{fontSize:11,fontWeight:700,color}}>{val}%</span>
                  </div>
                  <div style={{height:4,background:"rgba(255,255,255,0.08)",borderRadius:4,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${val}%`,background:color,borderRadius:4,transition:"width 1s ease"}}/>
                  </div>
                </div>
              ))}
            </div>
            <div style={{background:"rgba(255,255,255,0.04)",borderRadius:14,padding:"14px 16px"}}>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",letterSpacing:1,marginBottom:10}}>🎓 SOCIETIES</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {profile.societies.map(s=>(
                  <span key={s} style={{background:`${profile.color}22`,border:`1px solid ${profile.color}44`,borderRadius:20,padding:"4px 12px",fontSize:11,color:"rgba(255,255,255,0.7)"}}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── POST MODAL ───────────────────────────────────────────────────────────────
function PostModal({onClose,onSubmit}) {
  const [title,setTitle]=useState("");
  const [body,setBody]=useState("");
  const [cat,setCat]=useState("market");
  const [err,setErr]=useState("");
  const inp={width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",color:"white",borderRadius:12,padding:"10px 14px",fontSize:13,outline:"none",fontFamily:"inherit"};
  function submit(){if(!title.trim()||!body.trim()){setErr("Fill in all fields.");return;}onSubmit({title:title.trim(),body:body.trim(),cat});onClose();}
  return (
    <div onClick={e=>{if(e.target===e.currentTarget)onClose()}} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.85)",backdropFilter:"blur(12px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:36}}>
      <div style={{background:"#131a2a",border:"1px solid rgba(255,255,255,0.1)",borderRadius:24,padding:24,width:"88%",animation:"fadeIn .25s ease"}}>
        <div style={{fontSize:16,fontWeight:800,color:"white",marginBottom:18}}>📢 Post Announcement</div>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",letterSpacing:1,marginBottom:6,textTransform:"uppercase"}}>Title</div>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Key finding or alert…" style={{...inp,marginBottom:12}}/>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",letterSpacing:1,marginBottom:6,textTransform:"uppercase"}}>Details</div>
        <textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="Describe the insight, tip, or news…" style={{...inp,marginBottom:12,minHeight:80,resize:"vertical"}}/>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",letterSpacing:1,marginBottom:6,textTransform:"uppercase"}}>Category</div>
        <select value={cat} onChange={e=>setCat(e.target.value)} style={{...inp,marginBottom:4,appearance:"none"}}>
          <option value="market">📊 Market Insight</option>
          <option value="hot">🔥 Hot Alert</option>
          <option value="tip">💡 Tip</option>
          <option value="news">📰 News</option>
        </select>
        {err&&<p style={{color:"#ff4757",fontSize:12,marginTop:8,marginBottom:0}}>{err}</p>}
        <div style={{display:"flex",gap:10,marginTop:18}}>
          <button onClick={onClose} style={{flex:1,padding:"11px",borderRadius:12,background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.5)",border:"none",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
          <button onClick={submit} style={{flex:2,padding:"11px",borderRadius:12,background:"#00e5a0",color:"#0d1117",border:"none",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>Post Now</button>
        </div>
      </div>
    </div>
  );
}

// ─── INSIGHTS TAB ─────────────────────────────────────────────────────────────
function InsightsScreen({showToast}) {
  const [area,setArea]=useState("Manchester");
  const [data,setData]=useState(null);
  const [loading,setLoading]=useState(true);
  const [txCount,setTxCount]=useState(0);
  const [source,setSource]=useState("synthetic");

  const load=useCallback(async(a)=>{
    setLoading(true);
    const d=buildMarketData(a);
    const prices=await fetchLandRegistry(a);
    if(prices&&prices.length>0){
      const sorted=[...prices].sort((x,y)=>x-y);
      const med=sorted[Math.floor(sorted.length/2)];
      const est=Math.round(med*.0045);
      if(est>300&&est<5000){setData(buildMarketData(a,est));setTxCount(prices.length);setSource("land_registry");showToast(`✅ ${prices.length} Land Registry records loaded`);}
      else{setData(d);setTxCount(0);setSource("synthetic");}
    } else {setData(d);setTxCount(0);setSource("synthetic");}
    setLoading(false);
  },[showToast]);

  useEffect(()=>{load(area);},[area]);

  const SRC={land_registry:{label:"🏛️ Land Registry",color:"#74b9ff"},synthetic:{label:"⚙️ Estimated",color:"rgba(255,255,255,0.35)"}}[source]??{label:"⚙️",color:"rgba(255,255,255,0.35)"};

  return (
    <div style={{height:"100%",overflowY:"auto",padding:"20px 18px"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
        <div style={{fontSize:20,fontWeight:800,color:"white"}}>Housing Insights</div>
        <span style={{fontSize:10,color:SRC.color,fontWeight:600}}>{SRC.label}</span>
      </div>
      <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",marginBottom:16}}>Live UK PropTech data — powered by Land Registry</div>

      {/* Area selector */}
      <div style={{display:"flex",gap:6,marginBottom:18,flexWrap:"wrap"}}>
        {AREAS.map(a=>(
          <button key={a} onClick={()=>{setArea(a);load(a);}}
            style={{padding:"5px 12px",borderRadius:20,border:`1px solid ${area===a?"#00e5a0":"rgba(255,255,255,0.1)"}`,background:area===a?"rgba(0,229,160,0.15)":"rgba(255,255,255,0.04)",color:area===a?"#00e5a0":"rgba(255,255,255,0.45)",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all .2s"}}>
            {a}
          </button>
        ))}
      </div>

      {loading||!data ? (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {[140,100,180,100].map((h,i)=>(
            <div key={i} style={{height:h,borderRadius:16,background:"linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 75%)",backgroundSize:"200% 100%",animation:"shimmer 1.4s infinite"}}/>
          ))}
        </div>
      ):(
        <>
          {/* KPI row */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            {[
              {icon:"🏠",label:"Avg Rent",value:`£${data.base.toLocaleString()}`,sub:"per month",accent:"#00e5a0"},
              {icon:"⚡",label:"Days on Mkt",value:`${data.avgDom}d`,sub:"avg to let",accent:"#74b9ff"},
              {icon:"🔥",label:"Peak Month",value:data.peakMonth,sub:"highest demand",accent:"#ff6b6b"},
              {icon:"💚",label:"Best Deal",value:data.bestDealMonth,sub:"negotiate here",accent:"#a29bfe"},
            ].map(k=>(
              <div key={k.label} style={{background:"rgba(255,255,255,0.04)",border:`1px solid rgba(255,255,255,0.07)`,borderRadius:16,padding:"12px 14px",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:2,borderRadius:"16px 16px 0 0",background:k.accent}}/>
                <div style={{fontSize:16,marginBottom:6}}>{k.icon}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",letterSpacing:.5,textTransform:"uppercase",marginBottom:4}}>{k.label}</div>
                <div style={{fontSize:18,fontWeight:800,color:"white",lineHeight:1}}>{k.value}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",marginTop:4}}>{k.sub}</div>
              </div>
            ))}
          </div>

          {/* Rent trend chart */}
          <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"14px 12px",marginBottom:14}}>
            <div style={{fontSize:12,fontWeight:700,color:"white",marginBottom:2}}>Monthly Rent Trend</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",marginBottom:12}}>12-month rolling average</div>
            <ResponsiveContainer width="100%" height={130}>
              <AreaChart data={data.rentTrend}>
                <defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00e5a0" stopOpacity={.25}/><stop offset="95%" stopColor="#00e5a0" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid stroke="rgba(255,255,255,.04)"/>
                <XAxis dataKey="month" tick={{fill:"#444",fontSize:9}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:"#444",fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>`£${(v/1000).toFixed(1)}k`} width={36}/>
                <Tooltip {...TP} formatter={v=>[`£${v.toLocaleString()}`,"Avg Rent"]}/>
                <Area type="monotone" dataKey="value" stroke="#00e5a0" strokeWidth={2} fill="url(#rg)" dot={false}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Heatmap */}
          <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"14px 12px",marginBottom:14}}>
            <div style={{fontSize:12,fontWeight:700,color:"white",marginBottom:2}}>🗓 Demand Heatmap</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",marginBottom:12}}>Red = act fast · Green = negotiate</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(12,1fr)",gap:4}}>
              {data.heatmap.map(({month,value})=>(
                <div key={month} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                  <div title={`${month}: ${value}%`} style={{width:"100%",aspectRatio:"1",borderRadius:6,background:heatColor(value),display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,fontWeight:700,color:"rgba(255,255,255,.8)",cursor:"default",transition:"transform .15s"}}
                    onMouseEnter={e=>e.currentTarget.style.transform="scale(1.2)"}
                    onMouseLeave={e=>e.currentTarget.style.transform=""}>
                    {value}
                  </div>
                  <span style={{fontSize:6,color:"rgba(255,255,255,0.3)"}}>{month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Days on market bars */}
          <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"14px 12px",marginBottom:14}}>
            <div style={{fontSize:12,fontWeight:700,color:"white",marginBottom:2}}>Time on Market</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",marginBottom:12}}>Avg days before a room goes — lower = more competitive</div>
            <ResponsiveContainer width="100%" height={110}>
              <BarChart data={data.domTrend}>
                <CartesianGrid stroke="rgba(255,255,255,.04)"/>
                <XAxis dataKey="month" tick={{fill:"#444",fontSize:9}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:"#444",fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}d`} width={28}/>
                <Tooltip {...TP} formatter={v=>[`${v} days`,"On Market"]}/>
                <Bar dataKey="value" radius={[4,4,0,0]}>
                  {data.domTrend.map((d,i)=><Cell key={i} fill={d.value>22?"rgba(0,229,160,.7)":d.value>14?"rgba(255,190,50,.7)":"rgba(255,71,87,.75)"}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Bedroom breakdown */}
          <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"14px 12px",marginBottom:14}}>
            <div style={{fontSize:12,fontWeight:700,color:"white",marginBottom:2}}>Rent by Bedrooms</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",marginBottom:12}}>Average monthly rent by property size</div>
            <ResponsiveContainer width="100%" height={110}>
              <BarChart data={data.beds}>
                <CartesianGrid stroke="rgba(255,255,255,.04)"/>
                <XAxis dataKey="beds" tick={{fill:"#444",fontSize:9}} tickFormatter={v=>`${v}bd`} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:"#444",fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>`£${v.toLocaleString()}`} width={42}/>
                <Tooltip {...TP} formatter={v=>[`£${v.toLocaleString()}`,"Avg Rent"]} labelFormatter={v=>`${v} bedroom`}/>
                <Bar dataKey="avgRent" radius={[5,5,0,0]}>
                  {data.beds.map((_,i)=><Cell key={i} fill={["rgba(0,229,160,.75)","rgba(116,185,255,.75)","rgba(162,155,254,.75)","rgba(255,107,107,.75)"][i]}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* District table */}
          <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,overflow:"hidden",marginBottom:14}}>
            <div style={{padding:"12px 14px",borderBottom:"1px solid rgba(255,255,255,0.07)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:12,fontWeight:700,color:"white"}}>🏘 District Breakdown</div>
              <span style={{fontSize:10,color:"rgba(255,255,255,0.35)"}}>{area}</span>
            </div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead>
                  <tr>{["Area","Rent","YoY","Days","Demand"].map(h=>(
                    <th key={h} style={{textAlign:"left",padding:"8px 12px",fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:.5,borderBottom:"1px solid rgba(255,255,255,0.06)",background:"rgba(255,255,255,0.02)"}}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {data.districts.map((d,i)=>(
                    <tr key={d.name} style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}
                      onMouseLeave={e=>e.currentTarget.style.background=""}>
                      <td style={{padding:"9px 12px",color:"white",fontWeight:600}}>{d.name}</td>
                      <td style={{padding:"9px 12px",color:"rgba(255,255,255,0.7)"}}>£{d.avgRent.toLocaleString()}</td>
                      <td style={{padding:"9px 12px",fontWeight:700,color:d.yoyChange>=5?"#ff6b6b":"#00e5a0"}}>{d.yoyChange>=0?"+":""}{d.yoyChange}%</td>
                      <td style={{padding:"9px 12px",color:"rgba(255,255,255,0.5)"}}>{d.avgDaysToLet}d</td>
                      <td style={{padding:"9px 12px"}}><span style={{fontSize:9,padding:"2px 8px",borderRadius:50,background:COMP_COLORS[d.competitionLevel],color:"white",fontWeight:700}}>{d.competitionLevel}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI insight cards */}
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:8}}>
            {[
              {bg:"rgba(255,71,87,0.08)",border:"rgba(255,71,87,0.2)",emoji:"🔥",title:`Watch out for ${data.peakMonth}`,body:`Rooms in ${area} go fastest in ${data.peakMonth}. Avg on-market time drops to ${data.domTrend.find(d=>d.month===data.peakMonth)?.value??10} days. Apply same day.`},
              {bg:"rgba(0,229,160,0.06)",border:"rgba(0,229,160,0.2)",emoji:"🧊",title:`${data.bestDealMonth} = landlord season`,body:`Demand dips in ${data.bestDealMonth} — landlords negotiate more. Rents run ~8% below peak. Perfect timing to lock in a room.`},
              {bg:"rgba(116,185,255,0.07)",border:"rgba(116,185,255,0.2)",emoji:"📈",title:`Prices up ${data.yoy}% YoY`,body:`Avg rent in ${area} is £${data.base.toLocaleString()}/mo. YoY growth of ${data.yoy}% — acting now beats waiting for a dip.`},
            ].map((c,i)=>(
              <div key={i} style={{background:c.bg,border:`1px solid ${c.border}`,borderRadius:14,padding:"12px 14px"}}>
                <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                  <span style={{fontSize:18,flexShrink:0}}>{c.emoji}</span>
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:"white",marginBottom:4}}>{c.title}</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",lineHeight:1.5}}>{c.body}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── ANNOUNCEMENTS TAB ────────────────────────────────────────────────────────
function AnnouncementsScreen({showToast}) {
  const [anns,setAnns]=useState(SEED_ANNS);
  const [filter,setFilter]=useState("all");
  const [modal,setModal]=useState(false);

  function handleCreate({title,body,cat}){
    const icons={market:"📊",hot:"🚨",tip:"💡",news:"📰"};
    setAnns(p=>[{id:String(Date.now()),cat,icon:icons[cat],pinned:false,title,body,createdAt:new Date().toISOString(),author:"You"},...p]);
    showToast("✅ Announcement posted!");
  }
  function togglePin(id){setAnns(p=>p.map(a=>a.id===id?{...a,pinned:!a.pinned}:a));}
  function remove(id){setAnns(p=>p.filter(a=>a.id!==id));}

  const sorted=[...anns].sort((a,b)=>{if(a.pinned&&!b.pinned)return -1;if(!a.pinned&&b.pinned)return 1;return new Date(b.createdAt)-new Date(a.createdAt);});
  const visible=filter==="all"?sorted:sorted.filter(a=>a.cat===filter);
  const pinned=sorted.find(a=>a.pinned);

  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column"}}>
      {/* Header */}
      <div style={{padding:"20px 18px 14px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
          <div style={{fontSize:20,fontWeight:800,color:"white"}}>Announcements</div>
          <button onClick={()=>setModal(true)} style={{background:"#00e5a0",color:"#0d1117",border:"none",borderRadius:10,padding:"7px 14px",fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:5}}>
            ✏️ Post
          </button>
        </div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",marginBottom:14}}>Market intel & housing tips, updated weekly</div>

        {/* Filter chips */}
        <div style={{display:"flex",gap:6}}>
          {["all","market","hot","tip","news"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              style={{padding:"5px 12px",borderRadius:20,border:`1px solid ${filter===f?"#00e5a0":"rgba(255,255,255,0.1)"}`,background:filter===f?"rgba(0,229,160,0.15)":"rgba(255,255,255,0.04)",color:filter===f?"#00e5a0":"rgba(255,255,255,0.45)",fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all .2s",letterSpacing:.3}}>
              {f==="all"?"All":TAG_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable feed */}
      <div style={{flex:1,overflowY:"auto",padding:"0 18px 20px"}}>

        {/* Pinned banner */}
        {pinned&&(
          <div style={{background:"rgba(0,229,160,0.07)",border:"1px solid rgba(0,229,160,0.2)",borderRadius:14,padding:"12px 14px",display:"flex",gap:10,marginBottom:14,alignItems:"flex-start"}}>
            <span style={{fontSize:"1rem",marginTop:1}}>📌</span>
            <div>
              <div style={{fontSize:11,fontWeight:800,color:"#00e5a0",marginBottom:3}}>{pinned.title}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.45)",lineHeight:1.5}}>{pinned.body.slice(0,100)}…</div>
            </div>
          </div>
        )}

        {visible.length===0?(
          <div style={{textAlign:"center",padding:"50px 0",color:"rgba(255,255,255,0.25)"}}>
            <div style={{fontSize:32,marginBottom:10}}>📭</div>
            <div style={{fontSize:13}}>Nothing in this category yet</div>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {visible.map((ann,idx)=>{
              const ts=TAG_STYLES[ann.cat]??TAG_STYLES.news;
              return(
                <div key={ann.id}
                  style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"14px",animation:`slideIn .3s ease ${idx*.04}s both`,transition:"border-color .2s"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.14)"}
                  onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"}>
                  {/* Top row */}
                  <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:8}}>
                    <div style={{width:40,height:40,borderRadius:12,background:ICON_BG[ann.cat],display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{ann.icon}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:700,color:"white",lineHeight:1.3,marginBottom:3}}>{ann.title}</div>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:10,padding:"2px 8px",borderRadius:50,background:ts.bg,color:ts.color,border:`1px solid ${ts.border}`,fontWeight:700,textTransform:"uppercase",letterSpacing:.3}}>{TAG_LABELS[ann.cat]}</span>
                        <span style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>{timeAgo(ann.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  {/* Body */}
                  <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",lineHeight:1.6,marginBottom:10}}>{ann.body}</div>
                  {/* Footer */}
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <span style={{fontSize:10,color:"rgba(255,255,255,0.25)"}}>by {ann.author}</span>
                    <div style={{display:"flex",gap:6}}>
                      <button onClick={()=>togglePin(ann.id)} title={ann.pinned?"Unpin":"Pin"}
                        style={{background:ann.pinned?"rgba(0,229,160,0.12)":"rgba(255,255,255,0.06)",border:`1px solid ${ann.pinned?"rgba(0,229,160,0.3)":"rgba(255,255,255,0.1)"}`,borderRadius:8,padding:"4px 8px",fontSize:11,color:ann.pinned?"#00e5a0":"rgba(255,255,255,0.4)",cursor:"pointer",fontFamily:"inherit"}}>
                        {ann.pinned?"📌":"📍"}
                      </button>
                      <button onClick={()=>remove(ann.id)}
                        style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"4px 8px",fontSize:11,color:"rgba(255,255,255,0.35)",cursor:"pointer",fontFamily:"inherit"}}>
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

      {modal&&<PostModal onClose={()=>setModal(false)} onSubmit={handleCreate}/>}
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function RoomrApp() {
  const [screen,setScreen]=useState("swipe");
  const [cards,setCards]=useState(PROFILES);
  const [matches,setMatches]=useState([]);
  const [lastAction,setLastAction]=useState(null);
  const [showMatch,setShowMatch]=useState(null);
  const [toast,setToast]=useState(null);
  const toastTimer=useRef(null);

  const showToast=useCallback((msg)=>{
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current=setTimeout(()=>setToast(null),3000);
  },[]);

  const handleSwipe=(dir)=>{
    if(cards.length===0)return;
    const top=cards[cards.length-1];
    setLastAction(dir);
    if(dir==="right"){
      if(top.compatibility>80){setShowMatch(top);setMatches(m=>[...m,top]);setTimeout(()=>setShowMatch(null),2500);}
      else{setMatches(m=>[...m,top]);}
    }
    setCards(c=>c.slice(0,-1));
    setTimeout(()=>setLastAction(null),600);
  };

  const tabs=[
    {id:"swipe",icon:"🔥",label:"Discover"},
    {id:"matches",icon:"💬",label:"Matches"},
    {id:"liked",icon:"👀",label:"Liked You"},
    {id:"insights",icon:"📊",label:"Insights"},
    {id:"announcements",icon:"📢",label:"Updates"},
  ];

  return (
    <div style={{fontFamily:"'DM Sans','Segoe UI',sans-serif",background:"#080b14",minHeight:"100vh",display:"flex",justifyContent:"center",alignItems:"center",padding:"20px 0"}}>
      <div style={{width:"min(400px,100vw)",height:"min(820px,100vh)",background:"#0d1117",borderRadius:36,display:"flex",flexDirection:"column",overflow:"hidden",position:"relative",boxShadow:"0 60px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)"}}>

        {/* Header */}
        <div style={{padding:"20px 24px 12px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(255,255,255,0.05)",flexShrink:0}}>
          <div>
            <span style={{fontSize:22,fontWeight:900,color:"white",letterSpacing:-0.5}}>room</span>
            <span style={{fontSize:22,fontWeight:900,color:"#00e5a0",letterSpacing:-0.5}}>r</span>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            {screen==="swipe"&&cards.length>0&&<div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>{cards.length} nearby</div>}
            {screen==="announcements"&&<div style={{fontSize:11,color:"rgba(0,229,160,0.6)",fontWeight:600}}>● Live</div>}
            <div style={{width:32,height:32,borderRadius:10,background:"rgba(0,229,160,0.15)",border:"1px solid rgba(0,229,160,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🔔</div>
          </div>
        </div>

        {/* Main content */}
        <div style={{flex:1,position:"relative",overflow:"hidden"}}>

          {/* SWIPE */}
          {screen==="swipe"&&(
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column"}}>
              <div style={{flex:1,position:"relative",margin:"16px 20px 12px"}}>
                {cards.length===0?(
                  <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
                    <div style={{fontSize:48}}>✨</div>
                    <div style={{fontSize:18,fontWeight:700,color:"white"}}>You're all caught up!</div>
                    <div style={{fontSize:13,color:"rgba(255,255,255,0.4)"}}>Check back soon for new matches</div>
                    <button onClick={()=>setCards(PROFILES)} style={{marginTop:8,background:"#00e5a0",color:"#0d1117",border:"none",borderRadius:16,padding:"12px 28px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Refresh ↺</button>
                  </div>
                ):(
                  cards.map((p,i)=>{
                    const isTop=i===cards.length-1;
                    return <SwipeCard key={p.id} profile={p} onSwipe={isTop?handleSwipe:()=>{}} zIndex={i} offset={cards.length-1-i}/>;
                  })
                )}
              </div>
              {cards.length>0&&(
                <div style={{display:"flex",justifyContent:"center",gap:20,padding:"8px 24px 16px",flexShrink:0}}>
                  {[{icon:"✕",action:"left",bg:"rgba(255,71,87,0.15)",border:"rgba(255,71,87,0.3)",color:"#ff4757",size:52},{icon:"⭐",action:"super",bg:"rgba(116,185,255,0.15)",border:"rgba(116,185,255,0.3)",color:"#74b9ff",size:44},{icon:"✓",action:"right",bg:"rgba(0,229,160,0.15)",border:"rgba(0,229,160,0.3)",color:"#00e5a0",size:52}].map(({icon,action,bg,border,color,size})=>(
                    <button key={action} onClick={()=>handleSwipe(action)} style={{width:size,height:size,borderRadius:"50%",background:bg,border:`1.5px solid ${border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:action==="super"?16:20,color,cursor:"pointer",fontWeight:700,boxShadow:`0 8px 24px ${bg}`,transition:"transform 0.15s",transform:lastAction===action?"scale(0.9)":"scale(1)"}}>
                      {icon}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MATCHES */}
          {screen==="matches"&&(
            <div style={{padding:"20px",overflowY:"auto",height:"100%"}}>
              <div style={{fontSize:20,fontWeight:800,color:"white",marginBottom:16}}>Your Matches</div>
              {matches.length===0?(
                <div style={{textAlign:"center",padding:"60px 0",color:"rgba(255,255,255,0.3)"}}>
                  <div style={{fontSize:40,marginBottom:12}}>💬</div>
                  <div>No matches yet — keep swiping!</div>
                </div>
              ):(
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {matches.map(m=>(
                    <div key={m.id} style={{background:"rgba(255,255,255,0.04)",borderRadius:18,padding:"14px 16px",display:"flex",alignItems:"center",gap:14,border:"1px solid rgba(255,255,255,0.06)"}}>
                      <div style={{width:48,height:48,borderRadius:14,background:`linear-gradient(135deg, ${m.color}, ${m.color}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:"white",flexShrink:0}}>{m.avatar}</div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:700,color:"white",fontSize:15}}>{m.name}</div>
                        <div style={{fontSize:12,color:"rgba(255,255,255,0.45)"}}>{m.compatibility}% compatible · {m.course}</div>
                      </div>
                      <button style={{background:"rgba(0,229,160,0.15)",border:"1px solid rgba(0,229,160,0.3)",borderRadius:10,padding:"8px 14px",color:"#00e5a0",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Message</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* INSIGHTS */}
          {screen==="insights"&&<InsightsScreen showToast={showToast}/>}

          {/* ANNOUNCEMENTS */}
          {screen==="announcements"&&<AnnouncementsScreen showToast={showToast}/>}

          {/* LIKED */}
          {screen==="liked"&&(
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:12,color:"rgba(255,255,255,0.3)"}}>
              <div style={{fontSize:40}}>👀</div>
              <div style={{fontWeight:600,color:"white",fontSize:16}}>Who Liked You</div>
              <div style={{fontSize:13}}>Coming soon in full build</div>
            </div>
          )}
        </div>

        {/* Match overlay */}
        {showMatch&&(
          <div style={{position:"absolute",inset:0,zIndex:100,background:"rgba(0,0,0,0.88)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20,borderRadius:36,animation:"fadeIn 0.3s ease"}}>
            <div style={{fontSize:60}}>🎉</div>
            <div style={{fontSize:28,fontWeight:900,color:"#00e5a0"}}>It's a Match!</div>
            <div style={{fontSize:16,color:"rgba(255,255,255,0.7)"}}>You and {showMatch.name} liked each other</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",textAlign:"center",padding:"0 40px"}}>{showMatch.compatibility}% compatibility score</div>
          </div>
        )}

        {/* Toast */}
        {toast&&(
          <div style={{position:"absolute",bottom:80,left:16,right:16,background:"rgba(0,229,160,0.15)",border:"1px solid rgba(0,229,160,0.35)",borderRadius:12,padding:"10px 16px",fontSize:12,fontWeight:600,color:"#00e5a0",textAlign:"center",zIndex:150,animation:"slideUp .3s ease",backdropFilter:"blur(8px)"}}>
            {toast}
          </div>
        )}

        {/* Bottom nav */}
        <div style={{display:"flex",borderTop:"1px solid rgba(255,255,255,0.05)",background:"#0d1117",flexShrink:0}}>
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setScreen(t.id)} style={{flex:1,padding:"12px 0 14px",background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,opacity:screen===t.id?1:0.35,transition:"opacity 0.2s"}}>
              <span style={{fontSize:18,lineHeight:1}}>{t.icon}</span>
              <span style={{fontSize:9,letterSpacing:"0.08em",fontWeight:600,color:screen===t.id?"#00e5a0":"white"}}>{t.label.toUpperCase()}</span>
              {screen===t.id&&<div style={{width:4,height:4,borderRadius:2,background:"#00e5a0",marginTop:-2}}/>}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
        @keyframes shimmer{to{background-position:-200% 0}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:4px}
      `}</style>
    </div>
  );
}
