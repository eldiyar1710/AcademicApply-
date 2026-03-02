import { hiveAdapter } from './hive';

// Simple state management with Firebase sync
export class StateManager<T> {
  private key: string;
  private defaultValue: T;
  private listeners: Set<(value: T) => void> = new Set();
  private currentValue: T;
  private unsubscribe?: () => void;

  constructor(key: string, defaultValue: T) {
    this.key = key;
    this.defaultValue = defaultValue;
    this.currentValue = defaultValue;
  }

  async init(): Promise<void> {
    // Load initial value from Firebase
    const value = await hiveAdapter.get(this.key);
    this.currentValue = value || this.defaultValue;
    
    // Subscribe to Firebase changes
    this.unsubscribe = hiveAdapter.subscribe(this.key, (newValue) => {
      this.currentValue = newValue || this.defaultValue;
      this.notifyListeners();
    });
  }

  get(): T {
    return this.currentValue;
  }

  async set(value: T): Promise<void> {
    this.currentValue = value;
    await hiveAdapter.set(this.key, value);
    this.notifyListeners();
  }

  async update(updates: Partial<T>): Promise<void> {
    const newValue = { ...this.currentValue, ...updates };
    await this.set(newValue);
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
}

// Store instances
export const stores = {
  user: new StateManager('user', {
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
  
  applications: new StateManager('applications', [] as Array<{
    id: string;
    universityId: string;
    status: 'draft' | 'submitted' | 'reviewed' | 'accepted' | 'rejected';
    submittedAt: string;
    updatedAt: string;
  }>),
  
  universities: new StateManager('universities', {} as Record<string, any>),
  
  ui: new StateManager('ui', {
    theme: 'light' as 'light' | 'dark',
    sidebarOpen: false,
    notifications: [] as Array<{
      id: string;
      type: 'info' | 'success' | 'warning' | 'error';
      message: string;
      timestamp: string;
    }>,
  }),
  
  chat: new StateManager('chat', {
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
export const initializeStores = async () => {
  await Promise.all(
    Object.values(stores).map(store => store.init())
  );
};

// Export types
export type UserStore = ReturnType<typeof stores.user.get>;
export type ApplicationsStore = ReturnType<typeof stores.applications.get>;
export type UniversitiesStore = ReturnType<typeof stores.universities.get>;
export type UIStore = ReturnType<typeof stores.ui.get>;
export type ChatStore = ReturnType<typeof stores.chat.get>;
