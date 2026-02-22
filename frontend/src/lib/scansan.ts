/**
 * Scansan API client – rent listings only (properties for rent).
 * Backend proxy: GET /api/scansan?path=<path>
 */

import type { House } from "../types";

// In dev with Vite proxy, use same origin (""); else use VITE_API_URL or backend URL
const getApiBase = (): string => {
  if (typeof import.meta === "undefined") return "http://localhost:3001";
  const env = (import.meta as { env?: { VITE_API_URL?: string; DEV?: boolean } }).env;
  if (env?.VITE_API_URL) return env.VITE_API_URL;
  return env?.DEV ? "" : "http://localhost:3001";
};
const API_BASE = getApiBase();

/** UK postcode district -> approximate centroid (lat, lng) for map. */
const DISTRICT_COORDS: Record<string, [number, number]> = {
  E1: [51.5155, -0.0723],
  E2: [51.5250, -0.0750],
  E3: [51.5250, -0.0240],
  E4: [51.6170, 0.0030],
  E5: [51.5490, -0.0520],
  E6: [51.5280, 0.0550],
  E7: [51.5460, 0.0280],
  E8: [51.5410, -0.0610],
  E9: [51.5390, -0.0400],
  E10: [51.5610, -0.0110],
  E11: [51.5690, 0.0080],
  E14: [51.5070, -0.0240],
  E15: [51.5270, 0.0010],
  EC1: [51.5230, -0.0980],
  EC2: [51.5160, -0.0900],
  EC3: [51.5130, -0.0780],
  EC4: [51.5110, -0.1030],
  N1: [51.5345, -0.0879],
  N4: [51.5700, -0.1020],
  N5: [51.5540, -0.0980],
  N7: [51.5520, -0.1160],
  NW1: [51.5310, -0.1430],
  NW3: [51.5570, -0.1750],
  NW5: [51.5520, -0.1420],
  SE1: [51.5030, -0.0750],
  SE10: [51.4810, -0.0070],
  SE25: [51.3980, -0.0780],
  SW1: [51.5010, -0.1410],
  SW2: [51.4570, -0.1160],
  SW3: [51.4900, -0.1640],
  SW4: [51.4630, -0.1380],
  SW5: [51.4920, -0.1880],
  SW6: [51.4750, -0.1980],
  SW7: [51.4990, -0.1740],
  SW8: [51.4740, -0.1220],
  SW9: [51.4690, -0.1130],
  SW10: [51.4840, -0.1830],
  SW11: [51.4650, -0.1640],
  SW12: [51.4460, -0.1470],
  W1: [51.5140, -0.1470],
  W2: [51.5160, -0.1760],
  W3: [51.5070, -0.2650],
  W4: [51.4940, -0.2670],
  W5: [51.5270, -0.3010],
  W6: [51.4940, -0.2290],
  W8: [51.5020, -0.1910],
  W9: [51.5260, -0.1890],
  W10: [51.5230, -0.2140],
  W11: [51.5180, -0.2050],
  W12: [51.5070, -0.2280],
  W14: [51.4960, -0.2130],
  WC1: [51.5220, -0.1240],
  WC2: [51.5120, -0.1200],
};

const DEFAULT_COORDS: [number, number] = [51.5074, -0.1278];

function districtToCoords(district: string): { lat: number; lng: number } {
  const key = (district || "").trim().toUpperCase().replace(/\s+/g, "");
  const coords = DISTRICT_COORDS[key] ?? DEFAULT_COORDS;
  return { lat: coords[0], lng: coords[1] };
}

export type ScansanRentListing = {
  area_code_district?: string;
  street_address?: string;
  rent_pcm?: number;
  rent_pw?: number;
  bedrooms?: number | null;
  bathrooms?: number | null;
  living_rooms?: number | null;
  property_size?: string | null;
  property_size_metric?: string | null;
  currency?: string;
};

type RentListingsPayload = {
  area_code?: string;
  data?: { rent_listings?: ScansanRentListing[] };
};

/** London postcode districts we fetch from when location is "London". */
export const LONDON_DISTRICTS = ["E3", "W12", "SW1", "N1", "SE1"] as const;

/** Location options for profile: London (all) or single district. */
export const LOCATION_OPTIONS: { value: string; label: string }[] = [
  { value: "London", label: "London" },
  ...LONDON_DISTRICTS.map((d) => ({ value: d, label: d })),
];

async function fetchRentListingsForArea(areaCode: string): Promise<House[]> {
  const path = `v1/area_codes/${encodeURIComponent(areaCode)}/rent/listings`;
  const url = `${API_BASE}/api/scansan?path=${encodeURIComponent(path)}`;
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || `Scansan: ${res.status}`);
  }
  const body = await res.json();
  const data = (body?.data ?? body) as RentListingsPayload;
  const list = data?.data?.rent_listings ?? [];
  return list.map((item, index): House => {
    const district = item.area_code_district || areaCode;
    const coords = districtToCoords(district);
    const address = [item.street_address, district].filter(Boolean).join(", ");
    const sq = item.property_size_metric && /^\d+/.test(String(item.property_size_metric))
      ? parseInt(String(item.property_size_metric).replace(/\D/g, ""), 10) || 0
      : 0;
    return {
      id: `scansan-${areaCode}-${index}-${(item.street_address || "").slice(0, 20)}`,
      images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop"],
      price: item.rent_pcm ?? item.rent_pw ?? 0,
      currency: item.currency || "GBP",
      bedrooms: item.bedrooms ?? 0,
      bathrooms: item.bathrooms ?? 0,
      squareFeet: sq || 0,
      location: {
        address: item.street_address || address,
        city: "London",
        state: "Greater London",
        zipCode: district,
        coordinates: coords,
      },
      type: "apartment",
      description: `${item.street_address || ""} · ${district}`.trim() || "Property to rent",
      matchScore: undefined,
    };
  });
}

/** Fetch rent listings for a single area (postcode district). */
export async function fetchRentListings(areaCode: string): Promise<House[]> {
  return fetchRentListingsForArea(areaCode);
}

/** Fetch rent listings across London (multiple districts merged). Default for properties. */
export async function fetchRentListingsLondon(): Promise<House[]> {
  const results = await Promise.allSettled(
    LONDON_DISTRICTS.map((area) => fetchRentListingsForArea(area))
  );
  const all: House[] = [];
  const seen = new Set<string>();
  for (const result of results) {
    if (result.status === "fulfilled" && result.value.length) {
      for (const h of result.value) {
        if (!seen.has(h.id)) {
          seen.add(h.id);
          all.push(h);
        }
      }
    }
  }
  return all;
}
