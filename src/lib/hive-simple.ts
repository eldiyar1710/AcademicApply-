import { database } from './firebase';
import { ref, set, get, onValue, update, remove } from 'firebase/database';

// Simple Hive-like state management with Firebase Realtime Database
export class HiveStore<T> {
  private key: string;
  private defaultValue: T;
  private listeners: Set<(value: T) => void> = new Set();
  private currentValue: T;
  private unsubscribe?: () => void;

  constructor(key: string, defaultValue: T) {
    this.key = `hive/${key}`;
    this.defaultValue = defaultValue;
    this.currentValue = defaultValue;
  }

  async init(): Promise<void> {
    try {
      // Load initial value from Firebase
      const dbRef = ref(database, this.key);
      const snapshot = await get(dbRef);
      this.currentValue = snapshot.exists() ? snapshot.val() : this.defaultValue;
      
      // Subscribe to Firebase changes
      this.unsubscribe = onValue(dbRef, (snapshot) => {
        const newValue = snapshot.exists() ? snapshot.val() : this.defaultValue;
        this.currentValue = newValue;
        this.notifyListeners();
      });
    } catch (error) {
      console.error(`Failed to initialize store ${this.key}:`, error);
      // Fallback to localStorage
      const localValue = localStorage.getItem(`hive_${this.key}`);
      if (localValue) {
        this.currentValue = JSON.parse(localValue);
      }
    }
  }

  get(): T {
    return this.currentValue;
  }

  async set(value: T): Promise<void> {
    try {
      this.currentValue = value;
      const dbRef = ref(database, this.key);
      await set(dbRef, value);
      
      // Fallback to localStorage
      localStorage.setItem(`hive_${this.key}`, JSON.stringify(value));
      
      this.notifyListeners();
    } catch (error) {
      console.error(`Failed to set value for ${this.key}:`, error);
      // Fallback to localStorage only
      this.currentValue = value;
      localStorage.setItem(`hive_${this.key}`, JSON.stringify(value));
      this.notifyListeners();
    }
  }

  async update(updates: Partial<T>): Promise<void> {
    try {
      const newValue = { ...this.currentValue, ...updates };
      await this.set(newValue);
    } catch (error) {
      console.error(`Failed to update ${this.key}:`, error);
    }
  }

  subscribe(listener: (value: T) => void): () => void {
    this.listeners.add(listener);
    listener(this.currentValue);
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentValue));
  }

  destroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    this.listeners.clear();
  }

  async clear(): Promise<void> {
    try {
      const dbRef = ref(database, this.key);
      await remove(dbRef);
      localStorage.removeItem(`hive_${this.key}`);
      this.currentValue = this.defaultValue;
      this.notifyListeners();
    } catch (error) {
      console.error(`Failed to clear ${this.key}:`, error);
    }
  }
}

// Store definitions
export const hiveStores = {
  // User store
  user: new HiveStore('user', {
    id: '',
    name: '',
    contact: '',
    role: 'student' as 'student' | 'consultant' | 'admin',
    plan: 'free' as 'free' | 'basic' | 'expert',
    profile: {
      userType: 'student' as 'school' | 'graduate' | 'student',
      gpa: '',
      ielts: '',
      dream: '',
    },
    createdAt: '',
    legalAcceptedAt: '',
  }),
  
  // Applications store
  applications: new HiveStore('applications', [] as Array<{
    id: string;
    universityId: string;
    status: 'draft' | 'submitted' | 'reviewed' | 'accepted' | 'rejected';
    submittedAt: string;
    updatedAt: string;
  }>),
  
  // Universities store (cached)
  universities: new HiveStore('universities', {} as Record<string, any>),
  
  // UI state store
  ui: new HiveStore('ui', {
    theme: 'light' as 'light' | 'dark',
    sidebarOpen: false,
    notifications: [] as Array<{
      id: string;
      type: 'info' | 'success' | 'warning' | 'error';
      message: string;
      timestamp: string;
    }>,
  }),
  
  // Chat store
  chat: new HiveStore('chat', {
    messages: [] as Array<{
      id: string;
      type: 'user' | 'assistant' | 'consultant';
      content: string;
      timestamp: string;
    }>,
    activeConsultant: null as string | null,
  }),
};

// Initialize all stores
export const initializeHiveStores = async () => {
  console.log('Initializing Hive stores with Firebase Realtime Database...');
  
  const initPromises = Object.entries(hiveStores).map(async ([key, store]) => {
    try {
      await store.init();
      console.log(`✓ Store ${key} initialized`);
    } catch (error) {
      console.error(`✗ Failed to initialize store ${key}:`, error);
    }
  });
  
  await Promise.all(initPromises);
  console.log('All Hive stores initialized!');
};

// Export types
export type UserStore = ReturnType<typeof hiveStores.user.get>;
export type ApplicationsStore = ReturnType<typeof hiveStores.applications.get>;
export type UniversitiesStore = ReturnType<typeof hiveStores.universities.get>;
export type UIStore = ReturnType<typeof hiveStores.ui.get>;
export type ChatStore = ReturnType<typeof hiveStores.chat.get>;

// Export default
export default hiveStores;
