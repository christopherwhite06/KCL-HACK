import { createClient } from "@supabase/supabase-js";
import type { Profile } from "../data/profiles";
import type { House } from "../types";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.warn("Supabase env (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) not set; DB features disabled.");
}

export const supabase = url && anonKey ? createClient(url, anonKey) : null;

const SESSION_KEY = "roomr_session_id";

function getOrCreateSessionId(): string | null {
  if (typeof localStorage === "undefined") return null;
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
    void ensureSessionRow(id);
  }
  return id;
}

async function ensureSessionRow(sessionId: string) {
  if (!supabase) return;
  await supabase.from("user_sessions").upsert({ id: sessionId }, { onConflict: "id" });
}

function profileFromRow(r: Record<string, unknown>): Profile {
  return {
    id: Number(r.id),
    name: String(r.name),
    age: Number(r.age),
    course: String(r.course),
    year: String(r.year),
    uni: String(r.uni),
    budget: String(r.budget),
    moveIn: String(r.move_in),
    bio: String(r.bio),
    compatibility: Number(r.compatibility),
    lifestyleMatch: Number(r.lifestyle_match),
    propertyMatch: Number(r.property_match),
    tags: Array.isArray(r.tags) ? (r.tags as string[]) : [],
    epcGrade: String(r.epc_grade),
    floodRisk: String(r.flood_risk),
    hmoStatus: String(r.hmo_status),
    rentFairness: String(r.rent_fairness),
    commuteMin: Number(r.commute_min),
    avatar: String(r.avatar),
    color: String(r.color),
    societies: Array.isArray(r.societies) ? (r.societies as string[]) : [],
    cleanliness: Number(r.cleanliness),
    guests: String(r.guests),
    lat: Number(r.lat),
    lng: Number(r.lng),
  };
}

/** Fetch roommate profiles from DB. Returns [] if no table or error. */
export async function getProfilesFromDB(): Promise<Profile[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("roommate_profiles")
    .select("*")
    .order("id", { ascending: true });
  if (error) {
    console.warn("getProfilesFromDB", error);
    return [];
  }
  return (data || []).map(profileFromRow);
}

/** Seed many profiles (e.g. when DB is empty). */
export async function seedProfiles(profiles: Profile[]): Promise<void> {
  if (!supabase || profiles.length === 0) return;
  for (const profile of profiles) {
    await insertProfile(profile);
  }
}

/** Insert a roommate profile (for seeding). */
export async function insertProfile(profile: Profile): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from("roommate_profiles").insert({
    name: profile.name,
    age: profile.age,
    course: profile.course,
    year: profile.year,
    uni: profile.uni,
    budget: profile.budget,
    move_in: profile.moveIn,
    bio: profile.bio,
    compatibility: profile.compatibility,
    lifestyle_match: profile.lifestyleMatch,
    property_match: profile.propertyMatch,
    tags: profile.tags,
    epc_grade: profile.epcGrade,
    flood_risk: profile.floodRisk,
    hmo_status: profile.hmoStatus,
    rent_fairness: profile.rentFairness,
    commute_min: profile.commuteMin,
    avatar: profile.avatar,
    color: profile.color,
    societies: profile.societies,
    cleanliness: profile.cleanliness,
    guests: profile.guests,
    lat: profile.lat,
    lng: profile.lng,
  });
  if (error) {
    console.warn("insertProfile", error);
    return false;
  }
  return true;
}

/** Record a like (roommate or house). Uses session from localStorage. */
export async function addLike(
  targetType: "roommate" | "house",
  targetId: string,
  targetSnapshot?: Profile | House
): Promise<boolean> {
  if (!supabase) return false;
  const sessionId = getOrCreateSessionId();
  if (!sessionId) return false;
  await ensureSessionRow(sessionId);
  const { error } = await supabase.from("likes").upsert(
    {
      session_id: sessionId,
      target_type: targetType,
      target_id: targetId,
      target_snapshot: targetSnapshot ?? null,
    },
    { onConflict: "session_id,target_type,target_id" }
  );
  if (error) {
    console.warn("addLike", error);
    return false;
  }
  return true;
}

/** Get all likes for current session. */
export async function getLikesFromDB(): Promise<{ roommate: Profile[]; house: House[] }> {
  const out: { roommate: Profile[]; house: House[] } = { roommate: [], house: [] };
  if (!supabase) return out;
  const sessionId = getOrCreateSessionId();
  if (!sessionId) return out;
  const { data, error } = await supabase
    .from("likes")
    .select("target_type, target_snapshot")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false });
  if (error) {
    console.warn("getLikesFromDB", error);
    return out;
  }
  for (const row of data || []) {
    const snap = row.target_snapshot as unknown;
    if (row.target_type === "roommate" && snap && typeof snap === "object") {
      out.roommate.push(snap as Profile);
    } else if (row.target_type === "house" && snap && typeof snap === "object") {
      out.house.push(snap as House);
    }
  }
  return out;
}
