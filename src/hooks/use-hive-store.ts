import { useEffect, useState } from 'react';
import { hiveStores, UserStore, ApplicationsStore, UniversitiesStore, UIStore, ChatStore, HiveStore } from '@/lib/hive-simple';

// Generic hook for Hive stores
export function useHiveStore<T>(store: HiveStore<T>) {
  const [state, setState] = useState<T>(store.get());

  useEffect(() => {
    const unsubscribe = store.subscribe(setState);
    return unsubscribe;
  }, [store]);

  return [state, (value: T) => store.set(value), (updates: Partial<T>) => store.update(updates)] as const;
}

// Specific hooks for each store
export function useUserStore() {
  return useHiveStore(hiveStores.user);
}

export function useApplicationsStore() {
  return useHiveStore(hiveStores.applications);
}

export function useUniversitiesStore() {
  return useHiveStore(hiveStores.universities);
}

export function useUIStore() {
  return useHiveStore(hiveStores.ui);
}

export function useChatStore() {
  return useHiveStore(hiveStores.chat);
}

// Type exports
export type { UserStore, ApplicationsStore, UniversitiesStore, UIStore, ChatStore };
