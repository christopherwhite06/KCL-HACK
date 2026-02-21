import { useState, useMemo, useEffect, useRef } from "react";
import { HouseSwipeCard } from "./components/HouseSwipeCard";
import { ProfileSwipeCard } from "./components/ProfileSwipeCard";
import { BackgroundMap } from "./components/BackgroundMap";
import { MOCK_HOUSES } from "./data/houses";
import { PROFILES } from "./data/profiles";
import type { Profile } from "./data/profiles";
import type { House } from "./types";
import { getProfilesFromDB, getLikesFromDB, addLike, seedProfiles } from "./lib/supabase";

const DEFAULT_MAP_CENTER: [number, number] = [51.5074, -0.1278];

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export default function RoomrApp() {
  const [screen, setScreen] = useState("swipe");
  const [discoverMode, setDiscoverMode] = useState<"roommates" | "houses">("roommates");
  const [profileCards, setProfileCards] = useState<Profile[]>(() => [...PROFILES]);
  const [profileMatches, setProfileMatches] = useState<Profile[]>([]);
  const [showProfileMatch, setShowProfileMatch] = useState<Profile | null>(null);
  const [houses, setHouses] = useState<House[]>(() => [...MOCK_HOUSES]);
  const [likedHouses, setLikedHouses] = useState<House[]>([]);
  const [showHouseMatch, setShowHouseMatch] = useState<House | null>(null);
  const [lastAction, setLastAction] = useState<"left" | "right" | "super" | null>(null);
  const [cardOverlayCollapsed, setCardOverlayCollapsed] = useState(false);
  const dragStartRef = useRef({ y: 0, x: 0 });

  const PEEK_HEIGHT = 48;
  const handleOverlayDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    const y = "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const x = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    dragStartRef.current = { y, x };
  };
  const handleOverlayDragEnd = (e: React.TouchEvent | React.MouseEvent) => {
    const y = "changedTouches" in e ? e.changedTouches[0].clientY : (e as React.MouseEvent).clientY;
    const x = "changedTouches" in e ? e.changedTouches[0].clientX : (e as React.MouseEvent).clientX;
    const dy = y - dragStartRef.current.y;
    const dx = x - dragStartRef.current.x;
    if (Math.abs(dy) < Math.abs(dx)) return;
    if (cardOverlayCollapsed && dy < -25) setCardOverlayCollapsed(false);
    else if (!cardOverlayCollapsed && dy > 40) setCardOverlayCollapsed(true);
  };

  // Load profiles and likes from DB on mount; seed mock profiles if DB empty
  useEffect(() => {
    getProfilesFromDB().then((profiles) => {
      if (profiles.length > 0) {
        setProfileCards(profiles);
      } else {
        void seedProfiles(PROFILES);
        setProfileCards([...PROFILES]);
      }
    });
    getLikesFromDB().then(({ roommate, house }) => {
      setProfileMatches(roommate);
      setLikedHouses(house);
    });
  }, []);

  const handleProfileSwipe = (dir: "left" | "right" | "super") => {
    if (profileCards.length === 0) return;
    const top = profileCards[profileCards.length - 1];
    setLastAction(dir);
    if (dir === "right" || dir === "super") {
      if (top.compatibility > 80) {
        setShowProfileMatch(top);
        setTimeout(() => setShowProfileMatch(null), 2500);
      }
      setProfileMatches((m) => [...m, top]);
      void addLike("roommate", String(top.id), top);
    }
    setProfileCards((c) => c.slice(0, -1));
    setTimeout(() => setLastAction(null), 600);
  };

  const handleHouseSwipe = (dir: "left" | "right" | "super") => {
    if (houses.length === 0) return;
    const top = houses[houses.length - 1];
    setLastAction(dir);
    if (dir === "right" || dir === "super") {
      const isHighMatch = (top.matchScore ?? 0) > 80;
      if (isHighMatch) {
        setShowHouseMatch(top);
        setTimeout(() => setShowHouseMatch(null), 2500);
      }
      setLikedHouses((m) => [...m, top]);
      void addLike("house", top.id, top);
    }
    setHouses((c) => c.slice(0, -1));
    setTimeout(() => setLastAction(null), 600);
  };

  const refreshRoommateCards = () => {
    getProfilesFromDB().then((profiles) => {
      setProfileCards(profiles.length > 0 ? profiles : [...PROFILES]);
    });
  };

  const mapCenter = useMemo((): [number, number] => {
    if (screen !== "swipe") return DEFAULT_MAP_CENTER;
    if (discoverMode === "roommates" && profileCards.length > 0) {
      const p = profileCards[profileCards.length - 1];
      return [p.lat, p.lng];
    }
    if (discoverMode === "houses" && houses.length > 0) {
      const h = houses[houses.length - 1];
      const coords = h.location?.coordinates;
      if (coords) return [coords.lat, coords.lng];
    }
    return DEFAULT_MAP_CENTER;
  }, [screen, discoverMode, profileCards, houses]);

  const tabs = [
    { id: "matches", icon: "💬", label: "Matches" },
    { id: "liked", icon: "👀", label: "Liked" },
    { id: "swipe", icon: "🔥", label: "Discover" },
    { id: "insights", icon: "📊", label: "Insights" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];

  const setScreenAndResetOverlay = (id: string) => {
    setScreen(id);
    if (id !== "swipe") setCardOverlayCollapsed(false);
  };

  return (
    <div className="app-outer" style={{
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      background: "#080b14",
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px 0"
    }}>
      <div className="app-inner" style={{
        width: "min(360px, 94vw)",
        height: "min(740px, 92vh)",
        background: "rgba(13,17,23,0.72)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: 28,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
      }}>
        {/* Header */}
        <div style={{
          padding: "16px 20px 10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
          background: "rgba(255,255,255,0.03)",
        }}>
          <div>
            <span style={{ fontSize: 22, fontWeight: 900, color: "white", letterSpacing: -0.5 }}>room</span>
            <span style={{ fontSize: 22, fontWeight: 900, color: "#00e5a0", letterSpacing: -0.5 }}>r</span>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {screen === "swipe" && discoverMode === "roommates" && profileCards.length > 0 && (
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{profileCards.length} nearby</div>
            )}
            {screen === "swipe" && discoverMode === "houses" && houses.length > 0 && (
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{houses.length} properties</div>
            )}
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: "rgba(0,229,160,0.15)", border: "1px solid rgba(0,229,160,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14
            }}>🔔</div>
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {/* SWIPE SCREEN */}
          {screen === "swipe" && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
              {/* Background map - moves to current card location */}
              <BackgroundMap lat={mapCenter[0]} lng={mapCenter[1]} interactive={false} />
              {/* Collapsible card overlay: peek strip at top, swipe down to hide / swipe up on peek to show */}
              <div
                className="card-overlay"
                role="region"
                aria-label={cardOverlayCollapsed ? "Swipe up to expand card" : "Swipe down to hide card"}
                onTouchStart={handleOverlayDragStart}
                onTouchEnd={handleOverlayDragEnd}
                onMouseDown={handleOverlayDragStart}
                onMouseUp={handleOverlayDragEnd}
                onMouseLeave={handleOverlayDragEnd}
                style={{
                  position: "absolute",
                  inset: "12px 10px 0 10px",
                  zIndex: 10,
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "20px 20px 0 0",
                  overflow: "hidden",
                  background: "rgba(13,17,23,0.78)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 -4px 24px rgba(0,0,0,0.2)",
                  transform: cardOverlayCollapsed ? `translateY(calc(100% - ${PEEK_HEIGHT}px))` : "translateY(0)",
                  transition: "transform 0.3s cubic-bezier(0.33, 1, 0.68, 1)",
                  cursor: cardOverlayCollapsed ? "grab" : "default",
                }}
              >
                {/* Peek strip: visible when collapsed; drag handle to expand */}
                <div
                  style={{
                    flexShrink: 0,
                    height: PEEK_HEIGHT,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.04)",
                  }}
                >
                  <div style={{
                    width: 36,
                    height: 4,
                    borderRadius: 2,
                    background: "rgba(255,255,255,0.25)",
                  }} />
                </div>
                {/* Cards + buttons */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
              {/* Roommate cards stack */}
              {discoverMode === "roommates" && (
                <>
                  <div style={{ flex: 1, position: "relative", margin: "12px 20px 12px" }}>
                    {profileCards.length === 0 ? (
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
                        <div style={{ fontSize: 48 }}>✨</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: "white" }}>You're all caught up!</div>
                        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Check back soon for new roommates</div>
                        <button onClick={refreshRoommateCards} style={{ marginTop: 8, background: "#00e5a0", color: "#0d1117", border: "none", borderRadius: 16, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Refresh ↺</button>
                      </div>
                    ) : (
                      <ProfileSwipeCard
                        key={profileCards[profileCards.length - 1].id}
                        profile={profileCards[profileCards.length - 1]}
                        onSwipe={(dir) => handleProfileSwipe(dir)}
                        zIndex={0}
                        offset={0}
                      />
                    )}
                  </div>
                  {profileCards.length > 0 && (
                    <div style={{ display: "flex", justifyContent: "center", gap: 20, padding: "8px 24px 16px", flexShrink: 0 }}>
                      {[
                        { icon: "✕", action: "left" as const, bg: "rgba(255,71,87,0.15)", border: "rgba(255,71,87,0.3)", color: "#ff4757", size: 52 },
                        { icon: "⭐", action: "super" as const, bg: "rgba(116,185,255,0.15)", border: "rgba(116,185,255,0.3)", color: "#74b9ff", size: 44 },
                        { icon: "✓", action: "right" as const, bg: "rgba(0,229,160,0.15)", border: "rgba(0,229,160,0.3)", color: "#00e5a0", size: 52 },
                      ].map(({ icon, action, bg, border, color, size }) => (
                        <button
                          key={action}
                          onClick={() => handleProfileSwipe(action)}
                          style={{
                            width: size, height: size, borderRadius: "50%",
                            background: bg, border: `1.5px solid ${border}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: action === "super" ? 16 : 20, color, cursor: "pointer",
                            fontWeight: 700, boxShadow: `0 8px 24px ${bg}`,
                            transition: "transform 0.15s", transform: lastAction === action ? "scale(0.9)" : "scale(1)"
                          }}
                        >{icon}</button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* House cards stack */}
              {discoverMode === "houses" && (
                <>
                  <div style={{ flex: 1, position: "relative", margin: "12px 20px 12px" }}>
                    {houses.length === 0 ? (
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
                        <div style={{ fontSize: 48 }}>✨</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: "white" }}>You're all caught up!</div>
                        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Check back soon for new properties</div>
                        <button onClick={() => setHouses([...MOCK_HOUSES])} style={{ marginTop: 8, background: "#00e5a0", color: "#0d1117", border: "none", borderRadius: 16, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Refresh ↺</button>
                      </div>
                    ) : (
                      <HouseSwipeCard
                        key={houses[houses.length - 1].id}
                        house={houses[houses.length - 1]}
                        onSwipe={(dir) => handleHouseSwipe(dir)}
                        zIndex={0}
                        offset={0}
                      />
                    )}
                  </div>
                  {houses.length > 0 && (
                    <div style={{ display: "flex", justifyContent: "center", gap: 20, padding: "8px 24px 16px", flexShrink: 0 }}>
                      {[
                        { icon: "✕", action: "left" as const, bg: "rgba(255,71,87,0.15)", border: "rgba(255,71,87,0.3)", color: "#ff4757", size: 52 },
                        { icon: "⭐", action: "super" as const, bg: "rgba(116,185,255,0.15)", border: "rgba(116,185,255,0.3)", color: "#74b9ff", size: 44 },
                        { icon: "✓", action: "right" as const, bg: "rgba(0,229,160,0.15)", border: "rgba(0,229,160,0.3)", color: "#00e5a0", size: 52 },
                      ].map(({ icon, action, bg, border, color, size }) => (
                        <button
                          key={action}
                          onClick={() => handleHouseSwipe(action)}
                          style={{
                            width: size, height: size, borderRadius: "50%",
                            background: bg, border: `1.5px solid ${border}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: action === "super" ? 16 : 20, color, cursor: "pointer",
                            fontWeight: 700, boxShadow: `0 8px 24px ${bg}`,
                            transition: "transform 0.15s", transform: lastAction === action ? "scale(0.9)" : "scale(1)"
                          }}
                        >{icon}</button>
                      ))}
                    </div>
                  )}
                </>
              )}
                </div>
              </div>
            </div>
          )}

          {/* MATCHES SCREEN - roommate matches + liked properties */}
          {screen === "matches" && (
            <div style={{ padding: "20px", overflowY: "auto", height: "100%" }}>
              {/* Roommate matches */}
              <div style={{ fontSize: 16, fontWeight: 800, color: "white", marginBottom: 10 }}>Roommate matches</div>
              {profileMatches.length === 0 ? (
                <div style={{ marginBottom: 24, padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: 14, color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                  No roommate matches yet — swipe right on roommates!
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                  {profileMatches.map((m) => (
                    <div key={m.id} style={{
                      background: "rgba(255,255,255,0.04)", borderRadius: 18, padding: "14px 16px",
                      display: "flex", alignItems: "center", gap: 14,
                      border: "1px solid rgba(255,255,255,0.06)"
                    }}>
                      <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg, ${m.color}, ${m.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "white", flexShrink: 0 }}>{m.avatar}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: "white", fontSize: 15 }}>{m.name}</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{m.compatibility}% compatible · {m.course}</div>
                      </div>
                      <button style={{ background: "rgba(0,229,160,0.15)", border: "1px solid rgba(0,229,160,0.3)", borderRadius: 10, padding: "8px 14px", color: "#00e5a0", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Message</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Liked properties */}
              <div style={{ fontSize: 16, fontWeight: 800, color: "white", marginBottom: 10 }}>Liked properties</div>
              {likedHouses.length === 0 ? (
                <div style={{ padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: 14, color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                  No liked properties yet — discover houses and swipe right!
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {likedHouses.map((h) => (
                    <div key={h.id} style={{
                      background: "rgba(255,255,255,0.04)", borderRadius: 18, padding: 0,
                      overflow: "hidden",
                      border: "1px solid rgba(255,255,255,0.06)"
                    }}>
                      <div style={{ display: "flex", gap: 14, alignItems: "center", padding: "14px 16px" }}>
                        <div style={{ width: 72, height: 72, borderRadius: 14, overflow: "hidden", flexShrink: 0, background: "#1a1a2e" }}>
                          <img src={h.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, color: "white", fontSize: 15 }}>{formatPrice(h.price, h.currency)}</div>
                          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{h.location.address}</div>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{h.bedrooms} bed · {h.bathrooms} bath</div>
                        </div>
                        <a
                          href={h.listing_url ?? "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ background: "rgba(0,229,160,0.15)", border: "1px solid rgba(0,229,160,0.3)", borderRadius: 10, padding: "8px 14px", color: "#00e5a0", fontSize: 12, fontWeight: 600, cursor: "pointer", textDecoration: "none", flexShrink: 0 }}
                        >
                          View
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* INSIGHTS SCREEN */}
          {screen === "insights" && (
            <div style={{ padding: "20px", overflowY: "auto", height: "100%" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "white", marginBottom: 4 }}>Housing Insights</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>Powered by live UK PropTech datasets</div>
              {[
                { title: "🌊 Flood Risk Heatmap", sub: "Manchester: 78% Low Risk zones", color: "#74b9ff", detail: "Based on Environment Agency flood polygon data" },
                { title: "🔋 Greenest Student Areas", sub: "Didsbury avg EPC: B · Chorlton: C+", color: "#00e5a0", detail: "Calculated from 12,400 EPC certificates" },
                { title: "🏗 HMO Approval Hotspots", sub: "Fallowfield: High demand · Article 4 active", color: "#a29bfe", detail: "IBex planning application intelligence" },
                { title: "📈 Rising Rent Alert", sub: "Victoria Park up 11% YoY", color: "#ffeaa7", detail: "Price Paid data + rental yield analysis" },
                { title: "🚌 Best Commute Zones", sub: "Top pick: Rusholme · 9 min avg", color: "#fd79a8", detail: "OS Data Hub routing + transport frequency" },
              ].map(({ title, sub, color, detail }) => (
                <div key={title} style={{
                  background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "16px",
                  marginBottom: 12, border: "1px solid rgba(255,255,255,0.06)"
                }}>
                  <div style={{ fontWeight: 700, color: "white", fontSize: 14, marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 13, color, fontWeight: 600, marginBottom: 6 }}>{sub}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{detail}</div>
                </div>
              ))}
            </div>
          )}

          {/* OTHER SCREENS */}
          {(screen === "liked" || screen === "profile") && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, color: "rgba(255,255,255,0.3)" }}>
              <div style={{ fontSize: 40 }}>{screen === "liked" ? "👀" : "👤"}</div>
              <div style={{ fontWeight: 600, color: "white", fontSize: 16 }}>{screen === "liked" ? "Who Liked You" : "Your Profile"}</div>
              <div style={{ fontSize: 13 }}>Coming soon in full build</div>
            </div>
          )}
        </div>

        {/* Roommate match celebration overlay */}
        {showProfileMatch && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.88)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 20, borderRadius: 36,
            animation: "fadeIn 0.3s ease"
          }}>
            <div style={{ fontSize: 60 }}>🎉</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#00e5a0" }}>It's a Match!</div>
            <div style={{ fontSize: 16, color: "rgba(255,255,255,0.7)" }}>You and {showProfileMatch.name} liked each other</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "0 40px" }}>{showProfileMatch.compatibility}% compatibility score</div>
          </div>
        )}
        {/* House match celebration overlay */}
        {showHouseMatch && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.88)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 20, borderRadius: 36,
            animation: "fadeIn 0.3s ease"
          }}>
            <div style={{ fontSize: 60 }}>🎉</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#00e5a0" }}>Great match!</div>
            <div style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", textAlign: "center", padding: "0 24px" }}>{showHouseMatch.location.address}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "0 40px" }}>{showHouseMatch.matchScore}% match score</div>
          </div>
        )}

        {/* Bottom Nav */}
        <div style={{
          display: "flex",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(13,17,23,0.9)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          flexShrink: 0
        }}>
          {tabs.map(t => {
            const isDiscover = t.id === "swipe";
            const isActive = screen === t.id;
            if (isDiscover) {
              return (
                <div
                  key={t.id}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px 4px 10px",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0,
                      padding: 3,
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setScreenAndResetOverlay("swipe"); setDiscoverMode("roommates"); }}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 9,
                        border: "none",
                        cursor: "pointer",
                        fontSize: 11,
                        fontWeight: 700,
                        color: discoverMode === "roommates" ? "#0d1117" : "rgba(255,255,255,0.5)",
                        background: discoverMode === "roommates" ? "#00e5a0" : "transparent",
                        transition: "background 0.2s, color 0.2s",
                      }}
                    >
                      👤 Roommates
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setScreenAndResetOverlay("swipe"); setDiscoverMode("houses"); }}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 9,
                        border: "none",
                        cursor: "pointer",
                        fontSize: 11,
                        fontWeight: 700,
                        color: discoverMode === "houses" ? "#0d1117" : "rgba(255,255,255,0.5)",
                        background: discoverMode === "houses" ? "#00e5a0" : "transparent",
                        transition: "background 0.2s, color 0.2s",
                      }}
                    >
                      🏠 Properties
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setScreenAndResetOverlay("swipe")}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                      opacity: isActive ? 1 : 0.35,
                    }}
                  >
                    <span style={{ fontSize: 16, lineHeight: 1 }}>{t.icon}</span>
                    <span style={{ fontSize: 8, letterSpacing: "0.06em", fontWeight: 600, color: isActive ? "#00e5a0" : "white" }}>Discover</span>
                    {isActive && <div style={{ width: 3, height: 3, borderRadius: 2, background: "#00e5a0" }} />}
                  </button>
                </div>
              );
            }
            return (
              <button
                key={t.id}
                onClick={() => setScreenAndResetOverlay(t.id)}
                style={{
                  flex: 1, padding: "12px 0 14px", background: "none", border: "none",
                  cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  opacity: isActive ? 1 : 0.35,
                  transition: "opacity 0.2s"
                }}
              >
                <span style={{ fontSize: 18, lineHeight: 1 }}>{t.icon}</span>
                <span style={{
                  fontSize: 9, letterSpacing: "0.08em", fontWeight: 600,
                  color: isActive ? "#00e5a0" : "white"
                }}>{t.label.toUpperCase()}</span>
                {isActive && (
                  <div style={{ width: 4, height: 4, borderRadius: 2, background: "#00e5a0", marginTop: -2 }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

        /* Desktop: slightly larger card, keep glass */
        @media (min-width: 768px) {
          .app-outer {
            padding: 24px;
            height: 100vh;
            align-items: stretch;
          }
          .app-inner {
            width: min(400px, 88vw) !important;
            height: 100% !important;
            min-height: 600px;
            max-height: min(820px, calc(100vh - 48px));
            border-radius: 24px;
          }
        }
        @media (min-width: 1024px) {
          .app-inner { width: min(420px, 88vw) !important; }
        }
      `}</style>
    </div>
  );
}
