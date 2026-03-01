import { storageGet, storageRemove, storageSet } from "@/lib/storage";

const LAST_RESULTS_KEY = "aa_last_results_query";

export const saveLastResultsQuery = (query: string) => {
  const normalized = query.startsWith("?") ? query.slice(1) : query;
  storageSet(LAST_RESULTS_KEY, normalized);
};

export const getLastResultsQuery = () => {
  return storageGet<string>(LAST_RESULTS_KEY) || "";
};

export const clearLastResultsQuery = () => {
  storageRemove(LAST_RESULTS_KEY);
};
