import { storageGet, storageSet } from "@/lib/storage";

const WISHLIST_KEY = "aa_wishlist";

type WishlistStore = Record<string, string[]>;

const normalizeIds = (ids: string[]) => Array.from(new Set(ids.filter(Boolean)));

const getScopeKey = (userId?: string | null) => (userId && userId.trim().length > 0 ? userId : "guest");

export const getWishlist = (userId?: string | null) => {
  const store = storageGet<WishlistStore>(WISHLIST_KEY) || {};
  const scope = getScopeKey(userId);
  return normalizeIds(store[scope] || []);
};

export const isWishlisted = (universityId: string, userId?: string | null) => {
  return getWishlist(userId).includes(universityId);
};

export const toggleWishlist = (universityId: string, userId?: string | null) => {
  const store = storageGet<WishlistStore>(WISHLIST_KEY) || {};
  const scope = getScopeKey(userId);
  const current = normalizeIds(store[scope] || []);

  const next = current.includes(universityId)
    ? current.filter((id) => id !== universityId)
    : normalizeIds([...current, universityId]);

  const updated: WishlistStore = { ...store, [scope]: next };
  storageSet(WISHLIST_KEY, updated);
  return next;
};

export const removeFromWishlist = (universityId: string, userId?: string | null) => {
  const store = storageGet<WishlistStore>(WISHLIST_KEY) || {};
  const scope = getScopeKey(userId);
  const current = normalizeIds(store[scope] || []);
  const next = current.filter((id) => id !== universityId);
  const updated: WishlistStore = { ...store, [scope]: next };
  storageSet(WISHLIST_KEY, updated);
  return next;
};
