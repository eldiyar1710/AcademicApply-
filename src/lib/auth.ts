import { storageGet, storageRemove, storageSet } from "@/lib/storage";
import { saveUserToDB, getUserFromDB } from "./firebaseAuth";
import { syncUserToFirebase } from "./syncService";
import { getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "./firebase";

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
  plan: "free" | "basic" | "expert";
  planActivatedAt?: string;
  planExpiresAt?: string;
  assignedExpertId?: string;
  profile: {
    userType?: "school" | "graduate" | "student";
    gpa?: string;
    ielts?: string;
    dream?: string;
  };
  // Реферальная система
  referralCode?: string;
  referredBy?: string;
  referralStats?: {
    referralsCount: number;
    totalEarned: number;
    pendingRewards: number;
  };
};

const USER_KEY = "aa_user";
const AUTH_EVENT = "aa_auth_changed";

const auth = getAuth(app);

const randomId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

export const getUser = () => storageGet<User>(USER_KEY);

export const isAuthed = () => Boolean(getUser());

export const registerUser = async (input: {
  name: string;
  contact: string;
  password?: string;
  timezone?: string;
  legalAcceptedAt: string;
  userType?: "school" | "graduate" | "student";
  attribution?: {
    leadSessionId?: string;
    source?: string;
    eventSlug?: string;
    expertRef?: string;
  };
}) => {
  if (!input.contact.includes("@")) {
    throw new Error("Firebase Auth (Email/Password) требует email. Укажите email в поле контакта.");
  }

  const password = input.password && input.password.trim().length > 0 ? input.password : randomId();
  const cred = await createUserWithEmailAndPassword(auth, input.contact, password);

  const user: User = {
    id: cred.user.uid,
    name: input.name,
    contact: input.contact,
    timezone: input.timezone,
    createdAt: new Date().toISOString(),
    legalAcceptedAt: input.legalAcceptedAt,
    attributionLeadSessionId: input.attribution?.leadSessionId,
    attributionSource: input.attribution?.source,
    attributionEventSlug: input.attribution?.eventSlug,
    attributionExpertRef: input.attribution?.expertRef,
    plan: "free",
    profile: {
      userType: input.userType,
    },
  };

  // Сохранить в localStorage
  storageSet(USER_KEY, user);
  
  // Сохранить в Firebase Realtime Database
  await saveUserToDB(user);

  // Записать расширенные сущности (stats/progress) тоже
  await syncUserToFirebase(user);
  
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
  return user;
};

export const loginUser = async (input: { contact: string; password: string }) => {
  if (!input.contact.includes("@")) {
    throw new Error("Вход через Firebase Auth требует email");
  }

  const cred = await signInWithEmailAndPassword(auth, input.contact, input.password);
  const uid = cred.user.uid;

  const userFromDb = await getUserFromDB(uid);
  if (userFromDb) {
    storageSet(USER_KEY, userFromDb);
    if (typeof window !== "undefined") window.dispatchEvent(new Event(AUTH_EVENT));
    return userFromDb;
  }

  const created: User = {
    id: uid,
    name: cred.user.displayName || "Пользователь",
    contact: cred.user.email || input.contact,
    createdAt: new Date().toISOString(),
    legalAcceptedAt: new Date().toISOString(),
    plan: "free",
    profile: {},
  };

  storageSet(USER_KEY, created);
  await saveUserToDB(created);
  await syncUserToFirebase(created);
  if (typeof window !== "undefined") window.dispatchEvent(new Event(AUTH_EVENT));
  return created;
};

export const updateUserProfile = (patch: Partial<User["profile"]>) => {
  const user = getUser();
  if (!user) return null;
  const updated: User = { ...user, profile: { ...user.profile, ...patch } };
  
  // Сохранить в localStorage
  storageSet(USER_KEY, updated);
  
  // Полная синхронизация с Firebase
  syncUserToFirebase(updated);
  
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
  return updated;
};

export const logout = () => {
  storageRemove(USER_KEY);
  signOut(auth).catch(() => {
    // no-op
  });
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
};

export const initAuthListener = () => {
  if (typeof window === "undefined") return () => {};

  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      storageRemove(USER_KEY);
      window.dispatchEvent(new Event(AUTH_EVENT));
      return;
    }

    const existing = storageGet<User>(USER_KEY);
    if (existing && existing.id === firebaseUser.uid) {
      return;
    }

    const userFromDb = await getUserFromDB(firebaseUser.uid);
    if (userFromDb) {
      storageSet(USER_KEY, userFromDb);
      window.dispatchEvent(new Event(AUTH_EVENT));
      return;
    }

    const fallback: User = {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || "Пользователь",
      contact: firebaseUser.email || "",
      createdAt: new Date().toISOString(),
      legalAcceptedAt: new Date().toISOString(),
      plan: "free",
      profile: {},
    };

    storageSet(USER_KEY, fallback);
    await saveUserToDB(fallback);
    await syncUserToFirebase(fallback);
    window.dispatchEvent(new Event(AUTH_EVENT));
  });
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

// Plan management
export const PLAN_HIERARCHY: Record<User["plan"], number> = {
  free: 0,
  basic: 1,
  expert: 2,
};

export const getPlanLabel = (plan: User["plan"]) => {
  const labels: Record<User["plan"], string> = {
    free: "Бесплатный",
    basic: "Базовый",
    expert: "Эксперт",
  };
  return labels[plan];
};

export const isPlanActive = (user: User | null) => {
  if (!user) return false;
  if (user.plan === "free") return true;
  if (!user.planExpiresAt) return false;
  return new Date(user.planExpiresAt) > new Date();
};

export const hasAccess = (user: User | null, requiredPlan: User["plan"]) => {
  if (!user) return false;
  if (!isPlanActive(user)) return false;
  return PLAN_HIERARCHY[user.plan] >= PLAN_HIERARCHY[requiredPlan];
};

export const activatePlan = (plan: User["plan"], durationDays = 30) => {
  const user = getUser();
  if (!user) return null;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);
  const updated: User = {
    ...user,
    plan,
    planActivatedAt: now.toISOString(),
    planExpiresAt: plan === "free" ? undefined : expiresAt.toISOString(),
  };
  storageSet(USER_KEY, updated);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
  return updated;
};

export const assignExpert = (expertId: string, durationDays = 30) => {
  const user = getUser();
  if (!user) return null;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);
  const updated: User = {
    ...user,
    plan: "expert",
    assignedExpertId: expertId,
    planActivatedAt: now.toISOString(),
    planExpiresAt: expiresAt.toISOString(),
  };
  storageSet(USER_KEY, updated);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
  return updated;
};

export const getDaysRemaining = (user: User | null) => {
  if (!user || !user.planExpiresAt) return 0;
  const diff = new Date(user.planExpiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
};

// Реферальная система
export const generateReferralCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const createReferralCode = (userId: string) => {
  const user = getUser();
  if (!user || user.id !== userId) return null;
  
  const referralCode = generateReferralCode();
  const updated: User = {
    ...user,
    referralCode,
    referralStats: {
      referralsCount: 0,
      totalEarned: 0,
      pendingRewards: 0
    }
  };
  
  storageSet(USER_KEY, updated);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
  return updated;
};

export const applyReferral = (referralCode: string) => {
  const user = getUser();
  if (!user || user.referralCode) return null; // Уже есть реферальный код
  
  // В реальном приложении здесь будет проверка валидности кода
  const updated: User = {
    ...user,
    referredBy: referralCode,
    referralStats: {
      referralsCount: 0,
      totalEarned: 0,
      pendingRewards: 0
    }
  };
  
  storageSet(USER_KEY, updated);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
  return updated;
};

export const getReferralLink = (referralCode: string) => {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://academicapply.com";
  return `${baseUrl}?ref=${referralCode}`;
};

export const calculateReferralDiscount = (originalPrice: number, discountPercent: number = 10) => {
  return originalPrice * (1 - discountPercent / 100);
};

export const calculateQRDiscount = (originalPrice: number, discountPercent: number = 30) => {
  return originalPrice * (1 - discountPercent / 100);
};
