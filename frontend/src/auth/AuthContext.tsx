import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import type { User } from "./authStore";
import { fakeLogin, fakeSignup, loadUser, saveUser } from "./authStore";
import type { SignupData } from "./authStore";

type AuthCtx = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  signup: (data: SignupData) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

type UserMetadata = {
  name?: string;
  age?: string;
  university?: string;
  year?: string;
  uniEmail?: string;
  uniEmailVerified?: boolean;
  preferences?: { vibe: string; societies: string[] };
  house?: Record<string, unknown>;
};

function userFromSupabaseSession(session: {
  user: { id: string; email?: string; user_metadata?: UserMetadata };
}): User {
  const meta = session.user?.user_metadata;
  const profile: User["profile"] =
    meta && (meta.name != null || meta.university != null || meta.uniEmail != null)
      ? {
          email: session.user.email ?? "",
          uniEmail: meta.uniEmail ?? "",
          uniEmailVerified: Boolean(meta.uniEmailVerified),
          name: meta.name ?? "",
          age: meta.age ?? "",
          university: meta.university ?? "",
          year: (meta.year ?? "1") as import("./authStore").YearOption,
          preferences:
            meta.preferences && typeof meta.preferences === "object"
              ? {
                  vibe: (meta.preferences.vibe ?? "Balanced") as "Quiet" | "Social" | "Balanced",
                  societies: Array.isArray(meta.preferences.societies) ? meta.preferences.societies : [],
                }
              : { vibe: "Balanced", societies: [] },
          house:
            meta.house && typeof meta.house === "object"
              ? {
                  hasHouse: Boolean((meta.house as { hasHouse?: boolean }).hasHouse),
                  location: (meta.house as { location?: string }).location,
                  rent: (meta.house as { rent?: string }).rent,
                  roomsAvailable: (meta.house as { roomsAvailable?: string }).roomsAvailable,
                  bathrooms: (meta.house as { bathrooms?: string }).bathrooms,
                  imageDataUrl: (meta.house as { imageDataUrl?: string }).imageDataUrl,
                }
              : { hasHouse: false },
        }
      : undefined;

  return {
    id: session.user.id,
    email: session.user.email ?? "",
    profile,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session ? userFromSupabaseSession(session) : null);
        setLoading(false);
      });
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session ? userFromSupabaseSession(session) : null);
      });
      return () => subscription.unsubscribe();
    } else {
      const stored = loadUser();
      setUser(stored);
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<{ ok: true } | { ok: false; error: string }> => {
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) return { ok: false, error: error.message };
        setUser(data.session ? userFromSupabaseSession(data.session) : null);
        return { ok: true };
      }
      const u = fakeLogin(email.trim());
      if (!u) return { ok: false, error: "Account not found. Please sign up first." };
      setUser(u);
      saveUser(u);
      return { ok: true };
    },
    []
  );

  const signup = useCallback(
    async (data: SignupData): Promise<{ ok: true } | { ok: false; error: string }> => {
      if (supabase) {
        const { password: _p, ...profileData } = data;
        const { data: signUpData, error } = await supabase.auth.signUp({
          email: data.email.trim(),
          password: data.password,
          options: {
            data: {
              name: profileData.name,
              age: profileData.age,
              university: profileData.university,
              year: profileData.year,
              uniEmail: profileData.uniEmail,
              uniEmailVerified: profileData.uniEmailVerified,
              preferences: profileData.preferences,
              house: profileData.house,
            },
          },
        });
        if (error) return { ok: false, error: error.message };
        if (signUpData.session && signUpData.user) {
          setUser(userFromSupabaseSession(signUpData));
        }
        return { ok: true };
      }
      const u = fakeSignup(data);
      setUser(u);
      saveUser(u);
      return { ok: true };
    },
    []
  );

  const logout = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    saveUser(null);
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({ user, loading, login, signup, logout }),
    [user, loading, login, signup, logout]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
