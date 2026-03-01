export const safeJsonParse = <T>(value: string | null): T | null => {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

export const storageGet = <T>(key: string): T | null => {
  if (typeof window === "undefined") return null;
  return safeJsonParse<T>(window.localStorage.getItem(key));
};

export const storageSet = (key: string, value: unknown) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const storageRemove = (key: string) => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(key);
};
