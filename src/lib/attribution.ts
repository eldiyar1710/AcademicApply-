import { storageGet, storageSet } from "@/lib/storage";

export type AttributionSource = "organic" | "offline_qr";

export type Attribution = {
  leadSessionId: string;
  source: AttributionSource;
  eventSlug?: string;
  expertRef?: string;
  firstSeenAt: string;
  timezone?: string;
};

const ATTR_KEY = "aa_attribution";

const randomId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

export const getTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return undefined;
  }
};

export const getAttribution = () => storageGet<Attribution>(ATTR_KEY);

export const ensureOrganicAttribution = () => {
  const existing = getAttribution();
  if (existing) return existing;

  const created: Attribution = {
    leadSessionId: randomId(),
    source: "organic",
    firstSeenAt: new Date().toISOString(),
    timezone: getTimezone(),
  };
  storageSet(ATTR_KEY, created);
  return created;
};

export const setOfflineAttributionIfEmpty = (params: { eventSlug?: string; expertRef?: string }) => {
  const existing = getAttribution();
  if (existing) return existing;

  const created: Attribution = {
    leadSessionId: randomId(),
    source: "offline_qr",
    eventSlug: params.eventSlug,
    expertRef: params.expertRef,
    firstSeenAt: new Date().toISOString(),
    timezone: getTimezone(),
  };

  storageSet(ATTR_KEY, created);
  return created;
};

export const getDiscountInfo = () => {
  const attr = getAttribution();
  if (!attr || attr.source !== "offline_qr") return { eligible: false as const };

  const start = new Date(attr.firstSeenAt).getTime();
  const expiresAt = start + 24 * 60 * 60 * 1000;
  const now = Date.now();
  return {
    eligible: now < expiresAt,
    discountPercent: 10,
    expiresAt,
  };
};
