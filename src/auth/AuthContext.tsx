import React, { createContext, useContext, useMemo, useState } from "react";
import { User, SignupData, saveUser, fakeLogin, fakeSignup } from "./authStore";

type AuthCtx = {
  user: User | null;
  login: (email: string) => { ok: true } | { ok: false; error: string };
  signup: (data: SignupData) => { ok: true } | { ok: false; error: string };
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // IMPORTANT: always start logged out (no auto-login on refresh)
  const [user, setUser] = useState<User | null>(null);

  const value = useMemo<AuthCtx>(() => {
    return {
      user,

      login(email) {
        const u = fakeLogin(email.trim());
        if (!u) return { ok: false, error: "Account not found. Please sign up first." };
        setUser(u);
        saveUser(u); // store session for this runtime; you can still clear it on logout
        return { ok: true };
      },

      signup(data) {
        if (!data.uniEmailVerified) return { ok: false, error: "Please verify your university email." };
        const u = fakeSignup(data);
        setUser(u);
        saveUser(u);
        return { ok: true };
      },

      logout() {
        setUser(null);
        saveUser(null);
      },
    };
  }, [user]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}