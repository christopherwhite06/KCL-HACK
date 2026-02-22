import { useState, useRef } from "react";
import type { House } from "../types";
import type { Theme } from "../themes";

type Props = {
  house: House;
  onSwipe: (dir: "left" | "right") => void;
  t: Theme;
};

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export default function HouseSwipeCard({ house, onSwipe, t }: Props) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const startRef = useRef<{ x: number; y: number } | null>(null);

  const handleStart = (x: number, y: number) => {
    startRef.current = { x, y };
    setDragging(true);
  };
  const handleMove = (x: number, y: number) => {
    if (!dragging || !startRef.current) return;
    setPos({ x: x - startRef.current.x, y: y - startRef.current.y });
  };
  const handleEnd = () => {
    setDragging(false);
    if (Math.abs(pos.x) > 80) onSwipe(pos.x > 0 ? "right" : "left");
    else setPos({ x: 0, y: 0 });
  };

  const rotation = pos.x * 0.06;
  const likeOp = Math.max(0, Math.min(1, pos.x / 60));
  const nopeOp = Math.max(0, Math.min(1, -pos.x / 60));

  return (
    <div
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => {
        e.preventDefault();
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }}
      onTouchEnd={handleEnd}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: "min(320px, 85vw)",
        maxHeight: "70vh",
        transform: `translate(-50%, -50%) translateX(${pos.x}px) rotate(${rotation}deg)`,
        transition: dragging ? "none" : "transform 0.35s cubic-bezier(0.175,0.885,0.32,1.275)",
        cursor: dragging ? "grabbing" : "grab",
        userSelect: "none",
        touchAction: "none",
        borderRadius: 20,
        overflow: "hidden",
        background: t.card,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: `1px solid ${t.borderStrong}`,
        boxShadow: t.shadow,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ position: "absolute", top: 12, left: 12, zIndex: 10, opacity: likeOp, transform: "rotate(-16deg)", border: "2px solid #00e5a0", borderRadius: 6, padding: "2px 10px", color: "#00e5a0", fontWeight: 800, fontSize: 14, pointerEvents: "none" }}>MATCH</div>
      <div style={{ position: "absolute", top: 12, right: 12, zIndex: 10, opacity: nopeOp, transform: "rotate(16deg)", border: "2px solid #ff4757", borderRadius: 6, padding: "2px 10px", color: "#ff4757", fontWeight: 800, fontSize: 14, pointerEvents: "none" }}>PASS</div>

      <div style={{ aspectRatio: "4/3", background: t.surface, flexShrink: 0 }}>
        <img src={house.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: t.text }}>{formatPrice(house.price, house.currency)}</span>
          {house.matchScore != null && (
            <span style={{ fontSize: 12, fontWeight: 700, color: t.accent }}>{house.matchScore}% match</span>
          )}
        </div>
        <div style={{ fontSize: 12, color: t.textSub }}>{house.location.address}</div>
        <div style={{ fontSize: 11, color: t.textMuted }}>{house.bedrooms} bed · {house.bathrooms} bath</div>
      </div>
    </div>
  );
}