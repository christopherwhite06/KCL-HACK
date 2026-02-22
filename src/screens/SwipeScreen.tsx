import { useState, useMemo, useRef, useEffect } from "react";
import SwipeCard from "../components/SwipeCard";
import HouseSwipeCard from "../components/HouseSwipeCard";
import { BackgroundMap } from "../components/BackgroundMap";
import { PROFILES } from "../data";
import { EGHAM_FALLBACK_HOUSES } from "../data/eghamHouses";
import { fetchRentListings, fetchRentListingsLondon } from "../lib/scansan";
import type { House } from "../types";
import type { Theme } from "../themes";

const DEFAULT_MAP_CENTER: [number, number] = [51.5074, -0.1278];
/** When collapsed, this much of the card (top) stays visible so user can swipe up to expand */
const CARD_PEEK_HEIGHT = 52;

type Profile = (typeof PROFILES)[number];

type Props = {
  t: Theme;
  theme: "dark" | "light";
  mode: "roommates" | "properties";
  searchLocation: string;
  onMatch: (profile: Profile) => void;
};

export default function SwipeScreen({ t, theme, mode, searchLocation, onMatch }: Props) {
  const [profileCards, setProfileCards] = useState([...PROFILES].reverse());
  const [houseCards, setHouseCards] = useState<House[]>([]);
  const [housesLoading, setHousesLoading] = useState(false);
  const [housesError, setHousesError] = useState<string | null>(null);
  const [overlayCollapsed, setOverlayCollapsed] = useState(false);
  const dragStart = useRef({ y: 0, x: 0, startedOnCard: false });
  const cardContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode !== "properties") return;
    setHousesLoading(true);
    setHousesError(null);
    setHouseCards([]);
    const fetchFn = searchLocation === "London" ? fetchRentListingsLondon() : fetchRentListings(searchLocation);
    fetchFn
      .then((list) => {
        if (list.length > 0) setHouseCards(list.reverse());
        else setHouseCards([...EGHAM_FALLBACK_HOUSES].reverse());
      })
      .catch(() => setHouseCards([...EGHAM_FALLBACK_HOUSES].reverse()))
      .finally(() => setHousesLoading(false));
  }, [mode, searchLocation]);

  const handleOverlayDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    const y = "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const x = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const target = "touches" in e ? (e as React.TouchEvent).target : (e as React.MouseEvent).target;
    const startedOnCard = cardContainerRef.current?.contains(target as Node) ?? false;
    dragStart.current = { y, x, startedOnCard };
  };
  const handleOverlayDragEnd = (e: React.TouchEvent | React.MouseEvent) => {
    const y = "changedTouches" in e ? e.changedTouches[0].clientY : (e as React.MouseEvent).clientY;
    const x = "changedTouches" in e ? e.changedTouches[0].clientX : (e as React.MouseEvent).clientX;
    const dy = y - dragStart.current.y;
    const dx = x - dragStart.current.x;
    if (Math.abs(dy) < Math.abs(dx)) return;
    if (overlayCollapsed && dy < -28) setOverlayCollapsed(false);
    else if (!overlayCollapsed && dragStart.current.startedOnCard && dy > 35) setOverlayCollapsed(true);
  };

  const handleProfileSwipe = (id: number, dir: "left" | "right") => {
    const profile = profileCards.find((p) => p.id === id)!;
    if (dir === "right") onMatch(profile);
    setProfileCards((prev) => prev.filter((p) => p.id !== id));
  };

  const handleHouseSwipe = (_id: string, dir: "left" | "right") => {
    setHouseCards((prev) => prev.slice(0, -1));
  };

  const mapCenter = useMemo((): [number, number] => {
    if (mode === "roommates" && profileCards.length > 0) {
      const p = profileCards[profileCards.length - 1];
      const lat = "lat" in p ? (p as Profile & { lat?: number }).lat : undefined;
      const lng = "lng" in p ? (p as Profile & { lng?: number }).lng : undefined;
      if (lat != null && lng != null) return [lat, lng];
    }
    if (mode === "properties" && houseCards.length > 0) {
      const h = houseCards[houseCards.length - 1];
      const coords = h.location?.coordinates;
      if (coords) return [coords.lat, coords.lng];
    }
    return DEFAULT_MAP_CENTER;
  }, [mode, profileCards, houseCards]);

  const mapMarkerLabel = useMemo(() => {
    if (mode === "roommates" && profileCards.length > 0) {
      const p = profileCards[profileCards.length - 1];
      return `${p.name} · location`;
    }
    if (mode === "properties" && houseCards.length > 0) {
      const h = houseCards[houseCards.length - 1];
      return h.location?.address || [h.location?.city, h.location?.zipCode].filter(Boolean).join(", ") || "Property location";
    }
    return undefined;
  }, [mode, profileCards, houseCards]);

  const refreshProperties = () => {
    setHousesError(null);
    setHousesLoading(true);
    (searchLocation === "London" ? fetchRentListingsLondon() : fetchRentListings(searchLocation))
      .then((list) => {
        if (list.length > 0) setHouseCards(list.reverse());
        else setHouseCards([...EGHAM_FALLBACK_HOUSES].reverse());
      })
      .catch(() => setHouseCards([...EGHAM_FALLBACK_HOUSES].reverse()))
      .finally(() => setHousesLoading(false));
  };

  const showRoommates = mode === "roommates";
  const showHouses = mode === "properties";
  const hasRoommateCards = profileCards.length > 0;
  const hasHouseCards = houseCards.length > 0;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minWidth: 0, display: "flex", flexDirection: "column" }}>
      {/* Map in background with location pin for current card */}
      <BackgroundMap
        lat={mapCenter[0]}
        lng={mapCenter[1]}
        interactive={false}
        showMarker={true}
        markerLabel={mapMarkerLabel}
        isDark={theme === "dark"}
      />

      {/* Collapsible overlay: swipe down on the card to hide (top of card stays visible), swipe up to show */}
      <div
        role="region"
        aria-label={overlayCollapsed ? "Swipe up to show card" : "Swipe down on card to hide"}
        onTouchStart={handleOverlayDragStart}
        onTouchEnd={handleOverlayDragEnd}
        onMouseDown={handleOverlayDragStart}
        onMouseUp={handleOverlayDragEnd}
        onMouseLeave={handleOverlayDragEnd}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          transform: overlayCollapsed ? `translateY(calc(100% - ${CARD_PEEK_HEIGHT}px))` : "translateY(0)",
          transition: "transform 0.3s cubic-bezier(0.33, 1, 0.68, 1)",
          cursor: overlayCollapsed ? "grab" : "default",
        }}
      >
        {/* Card + action buttons – when collapsed, top CARD_PEEK_HEIGHT px of this stays visible */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 0,
            padding: "16px",
          }}
        >
        {/* Single card container – swipe down on this to collapse; ref for drag detection */}
        <div
          ref={cardContainerRef}
          style={{
            position: "relative",
            width: "min(320px, 85vw)",
            height: "min(420px, 58vh)",
            maxWidth: "min(320px, 100%)",
            maxHeight: 420,
          }}
        >
          {showRoommates && (
            <>
              {!hasRoommateCards ? (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                    background: t.card,
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    borderRadius: 20,
                    border: `1px solid ${t.border}`,
                  }}
                >
                  <div style={{ fontSize: 40 }}>✨</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>You're all caught up!</div>
                  <div style={{ fontSize: 12, color: t.textMuted }}>Check back soon for new matches</div>
                  <button
                    onClick={() => setProfileCards([...PROFILES].reverse())}
                    style={{
                      marginTop: 4,
                      background: t.accent,
                      color: "#0d1117",
                      border: "none",
                      borderRadius: 14,
                      padding: "10px 24px",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Refresh ↺
                  </button>
                </div>
              ) : (
                <SwipeCard
                  key={profileCards[profileCards.length - 1].id}
                  profile={profileCards[profileCards.length - 1]}
                  onSwipe={(dir) => handleProfileSwipe(profileCards[profileCards.length - 1].id, dir)}
                  zIndex={0}
                  offset={0}
                  t={t}
                />
              )}
            </>
          )}

          {showHouses && (
            <>
              {housesLoading ? (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                    background: t.card,
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    borderRadius: 20,
                    border: `1px solid ${t.border}`,
                  }}
                >
                  <div style={{ fontSize: 24, color: t.textMuted }}>Loading properties…</div>
                </div>
              ) : housesError ? (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                    background: t.card,
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    borderRadius: 20,
                    border: `1px solid ${t.border}`,
                  }}
                >
                  <div style={{ fontSize: 14, color: t.textMuted, textAlign: "center" }}>{housesError}</div>
                  <button
                    onClick={refreshProperties}
                    style={{
                      marginTop: 4,
                      background: t.accent,
                      color: "#0d1117",
                      border: "none",
                      borderRadius: 14,
                      padding: "10px 24px",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Retry
                  </button>
                </div>
              ) : !hasHouseCards ? (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                    background: t.card,
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    borderRadius: 20,
                    border: `1px solid ${t.border}`,
                  }}
                >
                  <div style={{ fontSize: 40 }}>✨</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>No more properties</div>
                  <button
                    onClick={refreshProperties}
                    style={{
                      marginTop: 4,
                      background: t.accent,
                      color: "#0d1117",
                      border: "none",
                      borderRadius: 14,
                      padding: "10px 24px",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Refresh ↺
                  </button>
                </div>
              ) : (
                <HouseSwipeCard
                  house={houseCards[houseCards.length - 1]}
                  onSwipe={(dir) => handleHouseSwipe(houseCards[houseCards.length - 1].id, dir)}
                  t={t}
                />
              )}
            </>
          )}
        </div>

        {/* Action buttons - glass style */}
        {(hasRoommateCards || hasHouseCards) && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 16,
              marginTop: 16,
              padding: "12px 0",
              flexShrink: 0,
            }}
          >
            {[
              { icon: "✕", dir: "left" as const, bg: "rgba(255,71,87,0.2)", border: "rgba(255,71,87,0.4)", color: "#ff4757", size: 48 },
              { icon: "⭐", dir: "left" as const, bg: "rgba(116,185,255,0.2)", border: "rgba(116,185,255,0.4)", color: "#74b9ff", size: 40 },
              { icon: "✓", dir: "right" as const, bg: "rgba(0,229,160,0.2)", border: "rgba(0,229,160,0.4)", color: "#00e5a0", size: 48 },
            ].map(({ icon, dir, bg, border, color, size }) => (
              <button
                key={icon}
                onClick={() => {
                  if (showRoommates && hasRoommateCards) handleProfileSwipe(profileCards[profileCards.length - 1].id, dir);
                  if (showHouses && hasHouseCards) handleHouseSwipe(houseCards[houseCards.length - 1].id, dir);
                }}
                style={{
                  width: size,
                  height: size,
                  borderRadius: "50%",
                  background: bg,
                  backdropFilter: "blur(8px)",
                  border: `1.5px solid ${border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: size === 40 ? 14 : 18,
                  color,
                  cursor: "pointer",
                  fontWeight: 700,
                  boxShadow: `0 4px 20px ${bg}`,
                  transition: "transform 0.15s",
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}