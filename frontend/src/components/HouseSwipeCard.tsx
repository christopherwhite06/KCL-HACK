import { useState, useRef } from "react";
import type { House } from "../types";

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function HouseSwipeCard({
  house,
  onSwipe,
  zIndex,
  offset,
}: {
  house: House;
  onSwipe: (dir: "left" | "right") => void;
  zIndex: number;
  offset: number;
}) {
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [imageIndex, setImageIndex] = useState(0);
  const startRef = useRef<{ x: number; y: number } | null>(null);

  const handleStart = (clientX: number, clientY: number) => {
    startRef.current = { x: clientX, y: clientY };
    setDragging(true);
  };
  const handleMove = (clientX: number, clientY: number) => {
    if (!dragging || !startRef.current) return;
    setPos({ x: clientX - startRef.current.x, y: clientY - startRef.current.y });
  };
  const handleEnd = () => {
    setDragging(false);
    if (Math.abs(pos.x) > 100) {
      onSwipe(pos.x > 0 ? "right" : "left");
    } else {
      setPos({ x: 0, y: 0 });
    }
  };

  const rotation = pos.x * 0.06;
  const likeOpacity = Math.max(0, Math.min(1, pos.x / 80));
  const nopeOpacity = Math.max(0, Math.min(1, -pos.x / 80));
  const img = house.images[imageIndex] ?? house.images[0];

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
        width: "100%",
        height: "100%",
        transform: `translateX(calc(${pos.x}px + ${offset * 8}px)) translateY(${offset * 6}px) rotate(${rotation + offset * 2}deg) scale(${1 - offset * 0.04})`,
        transition: dragging ? "none" : "transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275)",
        cursor: dragging ? "grabbing" : "grab",
        zIndex,
        userSelect: "none",
        touchAction: "none",
        borderRadius: 28,
        background: "linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* LIKE / NOPE overlays */}
      <div
        style={{
          position: "absolute",
          top: 24,
          left: 24,
          zIndex: 10,
          opacity: likeOpacity,
          transform: "rotate(-20deg)",
          border: "3px solid #00e5a0",
          borderRadius: 8,
          padding: "4px 14px",
          color: "#00e5a0",
          fontWeight: 900,
          fontSize: 22,
          letterSpacing: 2,
        }}
      >
        LIKE
      </div>
      <div
        style={{
          position: "absolute",
          top: 24,
          right: 24,
          zIndex: 10,
          opacity: nopeOpacity,
          transform: "rotate(20deg)",
          border: "3px solid #ff4757",
          borderRadius: 8,
          padding: "4px 14px",
          color: "#ff4757",
          fontWeight: 900,
          fontSize: 22,
          letterSpacing: 2,
        }}
      >
        PASS
      </div>

      {/* Image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#0d1117",
        }}
      >
        <img
          src={img}
          alt={house.location.address}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            pointerEvents: "none",
          }}
          draggable={false}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 35%, transparent 55%, rgba(0,0,0,0.85) 100%)",
          }}
        />
        {/* Image nav */}
        {house.images.length > 1 && (
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              background: "rgba(0,0,0,0.5)",
              color: "white",
              fontSize: 10,
              padding: "4px 8px",
              borderRadius: 8,
              zIndex: 5,
            }}
          >
            {imageIndex + 1} / {house.images.length}
          </div>
        )}
      </div>

      {/* Top: type badge + price + match */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          zIndex: 5,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 1,
              color: "rgba(255,255,255,0.7)",
              textTransform: "uppercase",
            }}
          >
            {house.type}
          </span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "white", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
            {formatPrice(house.price, house.currency)}
            {(house.price < 10000) ? "/mo" : ""}
          </span>
        </div>
        {house.matchScore != null && (
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "rgba(0,229,160,0.2)",
              border: "1px solid rgba(0,229,160,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 900,
              color: "#00e5a0",
            }}
          >
            {house.matchScore}%
          </div>
        )}
      </div>

      {/* Bottom panel */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "20px",
          zIndex: 5,
        }}
      >
        <div
          style={{
            background: "rgba(13,17,23,0.85)",
            backdropFilter: "blur(12px)",
            borderRadius: 16,
            padding: "14px 16px",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 800, color: "white", marginBottom: 4, lineHeight: 1.2 }}>
            {house.location.address}
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>
            {house.location.city}, {house.location.zipCode}
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>🛏 {house.bedrooms} beds</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>🚿 {house.bathrooms} baths</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>📐 {house.squareFeet.toLocaleString()} sqft</span>
          </div>
          <p style={{ margin: "10px 0 0", fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.4 }}>
            {house.description.slice(0, 80)}…
          </p>
        </div>
      </div>

      {/* Next image tap area - right half */}
      {house.images.length > 1 && (
        <button
          type="button"
          aria-label="Next image"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "40%",
            zIndex: 4,
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
          onClick={(e) => {
            e.stopPropagation();
            setImageIndex((i) => (i + 1) % house.images.length);
          }}
        />
      )}
      {house.images.length > 1 && (
        <button
          type="button"
          aria-label="Previous image"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: "40%",
            zIndex: 4,
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
          onClick={(e) => {
            e.stopPropagation();
            setImageIndex((i) => (i - 1 + house.images.length) % house.images.length);
          }}
        />
      )}
    </div>
  );
}
