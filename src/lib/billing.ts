import { storageGet, storageSet } from "@/lib/storage";

export type PlanId = "ai_roadmap" | "expert_mentorship" | "enterprise";

export type Plan = {
  id: PlanId;
  title: string;
  priceUsd: number;
  description: string;
};

export type Order = {
  id: string;
  planId: PlanId;
  planTitle: string;
  basePriceUsd: number;
  discountPercent: number;
  promoCode?: string;
  promoPercent: number;
  finalPriceUsd: number;
  currency: "USD";
  createdAt: string;
  attribution?: {
    source?: string;
    eventSlug?: string;
    expertRef?: string;
    leadSessionId?: string;
  };
};

const ORDERS_KEY = "aa_orders";

const randomId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

export const plans: Plan[] = [
  {
    id: "ai_roadmap",
    title: "$49 — AI Roadmap",
    priceUsd: 49,
    description: "Пошаговый план + список программ и дедлайнов",
  },
  {
    id: "expert_mentorship",
    title: "$490 — Expert Mentorship",
    priceUsd: 490,
    description: "3 встречи + проверка документов + трекинг дедлайнов",
  },
  {
    id: "enterprise",
    title: "Enterprise",
    priceUsd: 0,
    description: "Решения для школ/организаций (по запросу)",
  },
];

export const getPlan = (id: string | null) => plans.find((p) => p.id === id) || null;

export const validatePromoCode = (codeRaw: string) => {
  const code = codeRaw.trim().toUpperCase();
  if (!code) return { ok: false as const, percent: 0, code: "" };

  const promos: Record<string, number> = {
    BLOG10: 10,
    PARTNER15: 15,
    FRIEND5: 5,
  };

  const percent = promos[code] || 0;
  if (!percent) return { ok: false as const, percent: 0, code };
  return { ok: true as const, percent, code };
};

export const calcFinalPrice = (base: number, discountPercent: number, promoPercent: number) => {
  const totalPercent = Math.min(80, Math.max(0, discountPercent + promoPercent));
  const factor = (100 - totalPercent) / 100;
  return Math.round(base * factor);
};

export const createOrder = (input: {
  plan: Plan;
  discountPercent: number;
  promoCode?: string;
  promoPercent: number;
  attribution?: Order["attribution"];
}) => {
  const order: Order = {
    id: randomId(),
    planId: input.plan.id,
    planTitle: input.plan.title,
    basePriceUsd: input.plan.priceUsd,
    discountPercent: input.discountPercent,
    promoCode: input.promoCode,
    promoPercent: input.promoPercent,
    finalPriceUsd: calcFinalPrice(input.plan.priceUsd, input.discountPercent, input.promoPercent),
    currency: "USD",
    createdAt: new Date().toISOString(),
    attribution: input.attribution,
  };

  const existing = storageGet<Order[]>(ORDERS_KEY) || [];
  storageSet(ORDERS_KEY, [order, ...existing]);
  return order;
};

export const getOrderById = (id: string) => {
  const all = storageGet<Order[]>(ORDERS_KEY) || [];
  return all.find((o) => o.id === id) || null;
};
