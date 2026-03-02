// Упрощенный Hive адаптер для Firebase
import { database } from './firebase';
import { ref, set, get, onValue, update, remove } from 'firebase/database';
export class HiveAdapter {
  private db = database;
  
  async set(key: string, value: any): Promise<void> {
    try {
      const dbRef = ref(this.db, `hive/${key}`);
      await set(dbRef, value);
    } catch (error) {
      console.error('Firebase set error:', error);
      // Fallback to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(`hive_${key}`, JSON.stringify(value));
      }
    }
  }
  
  async get(key: string): Promise<any> {
    try {
      const dbRef = ref(this.db, `hive/${key}`);
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return null;
    } catch (error) {
      console.error('Firebase get error:', error);
      // Fallback to localStorage
      if (typeof window !== 'undefined') {
        const item = localStorage.getItem(`hive_${key}`);
        return item ? JSON.parse(item) : null;
      }
      return null;
    }
  }
  
  async update(key: string, updates: Partial<any>): Promise<void> {
    try {
      const dbRef = ref(this.db, `hive/${key}`);
      await update(dbRef, updates);
    } catch (error) {
      console.error('Firebase update error:', error);
      // Fallback to localStorage
      if (typeof window !== 'undefined') {
        const current = await this.get(key) || {};
        localStorage.setItem(`hive_${key}`, JSON.stringify({ ...current, ...updates }));
      }
    }
  }
  
  subscribe(key: string, callback: (value: any) => void): () => void {
    const dbRef = ref(this.db, `hive/${key}`);
    
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const value = snapshot.exists() ? snapshot.val() : null;
      callback(value);
    }, (error) => {
      console.error('Firebase subscription error:', error);
      // Fallback to localStorage polling
      const interval = setInterval(() => {
        this.get(key).then(callback);
      }, 1000);
      
      return () => clearInterval(interval);
    });
    
    return unsubscribe;
  }
  
  async remove(key: string): Promise<void> {
    try {
      const dbRef = ref(this.db, `hive/${key}`);
      await remove(dbRef);
    } catch (error) {
      console.error('Firebase remove error:', error);
      // Fallback to localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`hive_${key}`);
      }
    }
  }
}

// Экспорт адаптера
export const hiveAdapter = new HiveAdapter();

// Sync utilities
export const syncToFirebase = async (storeKey: string) => {
  const value = localStorage.getItem(`hive_${storeKey}`);
  if (value) {
    await hiveAdapter.set(storeKey, JSON.parse(value));
  }
};

export const syncFromFirebase = async (storeKey: string) => {
  const value = await hiveAdapter.get(storeKey);
  if (value) {
    localStorage.setItem(`hive_${storeKey}`, JSON.stringify(value));
  }
};

export const subscribeToFirebase = (storeKey: string) => {
  return hiveAdapter.subscribe(storeKey, (value) => {
    if (value) {
      localStorage.setItem(`hive_${storeKey}`, JSON.stringify(value));
    }
  });
};

// Initialize sync for all stores
export const initializeFirebaseSync = () => {
  const storeKeys = ['user', 'applications', 'universities', 'ui', 'chat'];
  
  storeKeys.forEach((storeKey) => {
    // Initial sync from Firebase
    syncFromFirebase(storeKey);
    
    // Subscribe to Firebase changes
    subscribeToFirebase(storeKey);
  });
};

export default hiveAdapter;
