import { storageGet, storageRemove, storageSet } from "@/lib/storage";
import { saveUserToDB, getUserFromDB } from "./firebaseAuth";
import { referralSystem } from "./referral-system";
import { subscriptionSystem } from "./subscription-system";
// import { syncUserToFirebase } from "./syncService";
// import {
//   getAuth,
//   onAuthStateChanged,
//   signOut,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   updateProfile,
//   sendPasswordResetEmail,
// } from "firebase/auth";
// import { app } from "./firebase";

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
  role?: "student" | "consultant" | "admin";
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

// const auth = getAuth(app);

export const resetPassword = async (email: string) => {
  if (!email.includes("@")) {
    throw new Error("Для восстановления пароля нужен email");
  }
  try {
    console.debug("resetPassword: симуляция отправки на email", email);
    // В реальном приложении здесь была бы отправка email
    console.debug("resetPassword: успешно отправлено (симуляция)");
    return true;
  } catch (err: any) {
    console.error("resetPassword: ошибка", err);
    throw err;
  }
};

const randomId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

export const getUser = () => storageGet<User>(USER_KEY);

export const isAuthed = () => Boolean(getUser());

export const isConsultant = (user?: User) => {
  const currentUser = user || getUser();
  return currentUser?.role === "consultant";
};

export const isAdmin = (user?: User) => {
  const currentUser = user || getUser();
  return currentUser?.role === "admin";
};

export const isStudent = (user?: User) => {
  const currentUser = user || getUser();
  return !currentUser?.role || currentUser?.role === "student";
};

export const registerUser = async (input: {
  name: string;
  contact: string;
  password?: string;
  timezone?: string;
  legalAcceptedAt: string;
  userType?: "school" | "graduate" | "student";
  role?: "student" | "consultant" | "admin";
  attribution?: {
    leadSessionId?: string;
    source?: string;
    eventSlug?: string;
    expertRef?: string;
  };
  referralCode?: string;
}) => {
  const { name, contact: email, password, timezone, legalAcceptedAt, userType, role = "student", attribution, referralCode } = input;

  // 1. Проверить email (в реальном приложении здесь была бы валидация)
  if (!email.includes("@")) {
    throw new Error("Некорректный email");
  }

  // 2. Создать пользователя в localStorage
  const user: User = {
    id: randomId(),
    name,
    contact: email,
    timezone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    legalAcceptedAt,
    attributionLeadSessionId: attribution?.leadSessionId,
    attributionSource: attribution?.source,
    attributionEventSlug: attribution?.eventSlug,
    attributionExpertRef: attribution?.expertRef,
    role,
    createdAt: new Date().toISOString(),
    plan: "free",
    profile: {
      userType,
    },
  };

  try {
    console.debug("registerUser: сохранение в localStorage", { uid: user.id });
    await saveUserToDB(user);
    console.debug("registerUser: успешно сохранено в localStorage");
  } catch (err: any) {
    console.error("registerUser: ошибка сохранения", err);
    throw err;
  }


  storageSet(USER_KEY, user);
  console.debug("registerUser: регистрация завершена");
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
  return user;
};

export const loginUser = async (input: { contact: string; password: string }) => {
  const { contact: email, password } = input;
  try {
    console.debug("loginUser: попытка входа", { email });
    
    // В реальном приложении здесь была бы проверка пароля
    // Для демонстрации принимаем любой email с паролем > 5 символов
    if (!email.includes("@") || password.length < 5) {
      throw new Error("Некорректный email или пароль");
    }
    
    // Ищем пользователя в localStorage
    let dbUser = null;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('user_')) {
        const data = localStorage.getItem(key);
        if (data) {
          const user = JSON.parse(data);
          if (user.contact === email) {
            dbUser = user;
            break;
          }
        }
      }
    }
    
    if (!dbUser) {
      throw new Error("Пользователь не найден");
    }
    
    console.debug("loginUser: пользователь найден", { uid: dbUser.id, email: dbUser.contact });
    storageSet(USER_KEY, dbUser);
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(AUTH_EVENT));
    }
    
    return dbUser;
  } catch (err: any) {
    console.error("loginUser: ошибка входа", err);
    throw err;
  }
};

export const updateUserProfile = (patch: Partial<User["profile"]>) => {
  const user = getUser();
  if (!user) return null;
  const updated: User = { ...user, profile: { ...user.profile, ...patch } };
  
  // Сохранить в localStorage
  storageSet(USER_KEY, updated);
  
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
  return updated;
};

export const logout = async () => {
  try {
    console.debug("logout: выход из системы");
    storageRemove(USER_KEY);
    console.debug("logout: локальные данные очищены");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(AUTH_EVENT));
    }
  } catch (err: any) {
    console.error("logout: ошибка выхода", err);
  }
};

export const initAuthListener = () => {
  if (typeof window === "undefined") return () => {};
  
  // Проверяем localStorage при загрузке
  const user = getUser();
  if (user) {
    console.debug("initAuthListener: пользователь найден в localStorage", { name: user.name });
    storageSet(USER_KEY, user);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(AUTH_EVENT));
    }
  } else {
    console.debug("initAuthListener: пользователь не найден в localStorage");
  }
  
  return () => {
    // Cleanup function
    if (typeof window !== "undefined") {
      window.removeEventListener(AUTH_EVENT, () => {});
    }
  };
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

export const activatePlan = async (plan: User["plan"], durationDays = 30) => {
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

  await syncUserToFirebase(updated);
  return updated;
};

export const assignExpert = async (expertId: string, durationDays = 30) => {
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

  await syncUserToFirebase(updated);
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
