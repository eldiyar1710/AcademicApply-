import { storageGet, storageRemove, storageSet } from "@/lib/storage";

export type User = {
  id: string;
  name: string;
  contact: string;
  timezone?: string;
  createdAt: string;
  legalAcceptedAt: string;
  attributionLeadSessionId?: string;
  attributionSource?: string;
  attributionEventSlug?: string;
  attributionExpertRef?: string;
  profile: {
    userType?: "school" | "graduate" | "student";
    gpa?: string;
    ielts?: string;
    dream?: string;
  };
};

const USER_KEY = "aa_user";
const AUTH_EVENT = "aa_auth_changed";

const randomId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

export const getUser = () => storageGet<User>(USER_KEY);

export const isAuthed = () => Boolean(getUser());

export const registerUser = (input: {
  name: string;
  contact: string;
  timezone?: string;
  legalAcceptedAt: string;
  attribution?: {
    leadSessionId?: string;
    source?: string;
    eventSlug?: string;
    expertRef?: string;
  };
}) => {
  const user: User = {
    id: randomId(),
    name: input.name,
    contact: input.contact,
    timezone: input.timezone,
    createdAt: new Date().toISOString(),
    legalAcceptedAt: input.legalAcceptedAt,
    attributionLeadSessionId: input.attribution?.leadSessionId,
    attributionSource: input.attribution?.source,
    attributionEventSlug: input.attribution?.eventSlug,
    attributionExpertRef: input.attribution?.expertRef,
    profile: {},
  };

  storageSet(USER_KEY, user);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
  return user;
};

export const updateUserProfile = (patch: Partial<User["profile"]>) => {
  const user = getUser();
  if (!user) return null;
  const updated: User = { ...user, profile: { ...user.profile, ...patch } };
  storageSet(USER_KEY, updated);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
  return updated;
};

export const logout = () => {
  storageRemove(USER_KEY);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
};

export const subscribeAuth = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener(AUTH_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(AUTH_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
};

export const getProfileProgress = (user: User | null) => {
  if (!user) return 0;
  const fields: Array<keyof User["profile"]> = ["gpa", "ielts"];
  const filled = fields.filter((f) => {
    const v = user.profile[f];
    return typeof v === "string" && v.trim().length > 0;
  }).length;
  return Math.round((filled / fields.length) * 100);
};
