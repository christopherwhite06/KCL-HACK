export type YearOption = "1" | "2" | "3" | "Masters" | "PhD";

export type Preferences = {
  vibe: "Quiet" | "Social" | "Balanced";
  societies: string[];
};

export type HouseListing = {
  hasHouse: boolean;
  location?: string;
  rent?: string;
  roomsAvailable?: string;
  bathrooms?: string;
  imageDataUrl?: string; // demo upload
};

export type SignupData = {
  email: string;
  password: string;
  uniEmail: string;
  uniEmailVerified: boolean;

  name: string;
  age: string;

  university: string;
  year: YearOption;

  preferences: Preferences;

  house: HouseListing;
};

export type User = {
  id: string;
  email: string;
  profile: Omit<SignupData, "password">;
};

const LS_KEY = "roomr_user_v1";

export function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function saveUser(user: User | null) {
  if (!user) localStorage.removeItem(LS_KEY);
  else localStorage.setItem(LS_KEY, JSON.stringify(user));
}

export function fakeLogin(email: string): User | null {
  const existing = loadUser();
  if (!existing) return null;
  if (existing.email.toLowerCase() !== email.toLowerCase()) return null;
  return existing;
}

export function fakeSignup(data: SignupData): User {
  const user: User = {
    id: crypto.randomUUID(),
    email: data.email,
    profile: { ...data, password: "********" },
  };
  saveUser(user);
  return user;
}